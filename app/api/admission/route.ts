//app/api/admissions/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'

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
  const {
    patient_id,
    room_id,
    nurse_id,
    admission_date,
    discharge_date,
  } = await req.json()

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
  if (
    !patient_id ||
    !room_id ||
    !nurse_id ||
    !admission_date 
  ) {
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
    return NextResponse.json(
      { error: 'Invalid room_id' },
      { status: 400 },
    )
  }

  // Check if adding this admission would exceed room capacity at admission time
  const admissionDateTime = new Date(admission_date).toISOString();
  const dischargeDateTime = discharge_date ? new Date(discharge_date).toISOString() : null;
  
  // Query to find overlapping admissions - fix the OR condition syntax
  let overlappingQuery = supabase
    .from('admissions')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', room_id);

  if (dischargeDateTime) {
    // If there's a discharge date, we need to find admissions that:
    // 1. Have no discharge date, OR
    // 2. Have a discharge date that's after our admission date AND
    //    Have an admission date that's before our discharge date
    overlappingQuery = overlappingQuery.or(
      `discharge_date.is.null,and(discharge_date.gt.${admissionDateTime},admission_date.lt.${dischargeDateTime})`
    );
  } else {
    // If there's no discharge date, we need to find admissions that:
    // 1. Have no discharge date, OR
    // 2. Have a discharge date that's after our admission date
    overlappingQuery = overlappingQuery.or(
      `discharge_date.is.null,discharge_date.gt.${admissionDateTime}`
    );
  }

  const { count: overlappingAdmissionsCount, error: overlappingError } = await overlappingQuery;
  
  if (overlappingError) {
    console.error('Error checking overlapping admissions:', overlappingError);
    return NextResponse.json(
      { error: 'Failed to check room availability' },
      { status: 500 },
    );
  }

  // If adding this admission would exceed capacity
  if ((overlappingAdmissionsCount || 0) >= roomCapacity.capacity) {
    return NextResponse.json(
      { error: 'Room would be over capacity during the requested admission period' },
      { status: 400 },
    );
  }

  // VALIDATE patient is not already admitted currently
  const now = new Date().toISOString();
  const { data: existingAdmission, error: existingAdmissionError } = await supabase
    .from('admissions')
    .select('admission_id')
    .eq('patient_id', patient_id)
    .or(`discharge_date.is.null,discharge_date.gt.${now}`)
    .single();

  if (existingAdmissionError && existingAdmissionError.code !== 'PGRST116') { // Ignore "No rows found" error
    console.error('Error checking existing admission:', existingAdmissionError);
    return NextResponse.json(
      { error: 'Failed to check existing admission' },
      { status: 500 },
    );
  }
  
  if (existingAdmission) {
    return NextResponse.json(
      { error: 'Patient is already admitted' },
      { status: 400 },
    );
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
        updated_at: new Date().toISOString()
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

  if (role == 'Admin' || role == 'Doctor') {

    const { data, error } = await supabase
      .from('admissions')
      .select(`
        *
      `)
      .order('admission_date', { ascending: false })

    if (error) {
      console.error('Get admissions error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve admission records' },
        { status: 500 },
      )
    }
    return NextResponse.json({ data }, { status: 200 })
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
      .select(`
        *, 
        rooms: room_id ( departments: department_id ( name ) )
      `)
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