//app/api/admissions/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/get-role'
import { date } from 'zod'

// example request body
// {
//   "patient_id": 3,
//   "room_id": 10,
//   "nurse_id": 10,
//   "admission_date": "2025-05-10",
//   "discharge_date": "2025-05-20",
// }

// POST /api/admissions → Admit patient (Doctor or Admin)
export async function POST(req: Request) {
  const { patient_id, room_id, nurse_id, admission_date, discharge_date } =
    await req.json()

  const supabase = await createClient()
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { role, userId } = result

  if (role !== 'Admin' && role !== 'Doctor') {
    return NextResponse.json(
      { error: 'Forbidden: Only admins or doctors can assign nurses' },
      { status: 403 },
    )
  }
  // Get doctor info
  const { data: doctor, error: doctorError } = await supabase
    .from('medical_staff')
    .select('staff_id, staff_type')
    .eq('user_id', userId)
    .single()

  if (doctorError || !doctor) {
    return NextResponse.json(
      { error: 'Forbidden: You are not a medical staff' },
      { status: 403 },
    )
  }

  if (role !== 'Doctor' && role !== 'Admin') {
    return NextResponse.json(
      { error: 'Forbidden: Only doctors or admins can admit patients' },
      { status: 403 },
    )
  }

  // Validate required fields
  if (!patient_id || !room_id || !nurse_id || !admission_date) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    )
  }

  // Validate patient exists
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('patient_id')
    .eq('patient_id', patient_id)
    .single()

  if (patientError || !patient) {
    return NextResponse.json({ error: 'Invalid patient_id' }, { status: 400 })
  }

  // Validate room exists
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('room_id')
    .eq('room_id', room_id)
    .single()

  if (roomError || !room) {
    return NextResponse.json({ error: 'Invalid room_id' }, { status: 400 })
  }

  // Validate nurse exists and is a Nurse
  const { data: nurse, error: nurseError } = await supabase
    .from('medical_staff')
    .select('staff_id, staff_type')
    .eq('staff_id', nurse_id)
    .eq('staff_type', 'Nurse')
    .single()

  if (nurseError || !nurse) {
    return NextResponse.json(
      { error: 'Invalid nurse_id or staff is not a Nurse' },
      { status: 400 },
    )
  }

  // Validate check if added admission, it would not exceed selected room capacity
  const { data: roomCapacity, error: roomCapacityError } = await supabase
    .from('rooms')
    .select('capacity')
    .eq('room_id', room_id)
    .single()
  if (roomCapacityError || !roomCapacity) {
    return NextResponse.json({ error: 'Invalid room_id' }, { status: 400 })
  }

  // Check date range validity
  if (discharge_date && new Date(discharge_date) <= new Date(admission_date)) {
    return NextResponse.json(
      { error: 'Discharge date must be after admission date' },
      { status: 400 },
    )
  }

  // Check if adding this admission would exceed room capacity at admission time
  const admissionDateTime = new Date(admission_date).toISOString()
  const dischargeDateTime = discharge_date
    ? new Date(discharge_date).toISOString()
    : null

  // First, log the actual admission being attempted for debugging
  console.log(`Attempting admission - Room: ${room_id}, Dates: ${admissionDateTime} to ${dischargeDateTime || 'indefinite'}`)
  
  // Do a direct count query to simplify the logic and avoid filter issues
  const { data: currentAdmissions, error: admissionsError } = await supabase
    .from('admissions')
    .select('admission_id, admission_date, discharge_date')
    .eq('room_id', room_id)

  if (admissionsError) {
    console.error('Error retrieving admissions:', admissionsError)
    return NextResponse.json(
      { error: 'Failed to check room availability' },
      { status: 500 },
    )
  }

  // Log all admissions for this room for debugging
  console.log(`All admissions for room ${room_id}:`, currentAdmissions)
  
  // Count overlapping admissions manually
  const overlappingCount = currentAdmissions.filter(admission => {
    // Convert dates to standardized format for comparison
    const admStart = new Date(admission.admission_date).getTime()
    const admEnd = admission.discharge_date ? new Date(admission.discharge_date).getTime() : Infinity
    const newStart = new Date(admissionDateTime).getTime()
    const newEnd = dischargeDateTime ? new Date(dischargeDateTime).getTime() : Infinity
    
    // Check for overlap - basic interval overlap check:
    // (startA <= endB) AND (endA >= startB)
    const overlaps = (admStart <= newEnd) && (admEnd >= newStart)
    
    if (overlaps) {
      console.log(`Overlapping admission found:`, admission)
    }
    
    return overlaps
  }).length

  console.log(`Manual overlapping count: ${overlappingCount}, Room capacity: ${roomCapacity.capacity}`)
  
  // If adding this admission would exceed capacity
  if (overlappingCount >= roomCapacity.capacity) {
    return NextResponse.json(
      {
        error: `Room would be over capacity during the requested admission period. Current occupancy: ${overlappingCount}, Capacity: ${roomCapacity.capacity}`,
      },
      { status: 400 },
    )
  }

  // VALIDATE patient is not already admitted currently
  const now = new Date().toISOString()
  const { data: existingAdmission, error: existingAdmissionError } =
    await supabase
      .from('admissions')
      .select('admission_id')
      .eq('patient_id', patient_id)
      .lte('admission_date', now)
      .or(`discharge_date.is.null,discharge_date.gt.${now}`)
      .maybeSingle()

  if (existingAdmission) {
    return NextResponse.json(
      { error: 'Patient is already admitted' },
      { status: 400 },
    )
  }

  // Insert into admissions table
  const { data, error } = await supabase
    .from('admissions')
    .insert([
      {
        patient_id,
        room_id,
        nurse_id,
        doctor_id: doctor.staff_id,
        admission_date,
        discharge_date: discharge_date || null,
        updated_at: new Date().toISOString(),
      },
    ])
    .single()

  if (error) {
    console.error('Admit patient error:', error)
    return NextResponse.json(
      { error: 'Failed to admit patient' },
      { status: 500 },
    )
  }

  return NextResponse.json(data, { status: 201 })
}

// GET /api/admission → Get all admissions (Admin only)
export async function GET() {
  const supabase = await createClient()
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { role } = result

  if (role == 'Admin') {
    const { data, error } = await supabase
      .from('admissions')
      .select(
        `
        *
      `,
      )
      .order('admission_date', { ascending: false })

    if (error) {
      console.error('Get admissions error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve admission records' },
        { status: 500 },
      )
    }
    return NextResponse.json({ data }, { status: 200 })
  } else if (role == 'Doctor') {
    const now = new Date().toISOString()

    const { data, error: doctorError } = await supabase // Changed variable name to avoid redundancy
      .from('admissions')
      .select(`
        *,
        patients!inner(*),
        rooms!inner(*),
        nurse:medical_staff!nurse_id(*),
        doctor:medical_staff!doctor_id(*)
      `) // Added proper join selectors for related data
      .lte('admission_date', now)
      .or(`discharge_date.is.null,discharge_date.gt.${now}`)

    if (doctorError || !data) {
      return NextResponse.json(
        { error: 'Failed to retrieve admission information' },
        { status: 500 },
      )
    }

    return NextResponse.json({ data }, { status: 200 }) // Changed to match other response formats
  } else if (role == 'Nurse') {
    // Fetch admissions for the logged-in nurse
    const { data: nurse, error: nurseError } = await supabase
      .from('medical_staff')
      .select('staff_id, staff_type')
      .eq('user_id', result.userId)
      .single()

    if (nurseError || !nurse) {
      return NextResponse.json(
        { error: 'Failed to retrieve nurse information' },
        { status: 500 },
      )
    }

    const { data, error } = await supabase
      .from('admissions')
      .select(
        `
        *, 
        rooms: room_id ( departments: department_id ( name ) )
      `,
      )
      .eq('nurse_id', nurse.staff_id)
      .order('admission_date', { ascending: false })

    if (error) {
      console.error('Get admissions error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve admission records' },
        { status: 500 },
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  }
}
