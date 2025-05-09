//app/api/admissions/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'

// POST /api/admissions → Admit patient (Doctor or Admin)
export async function POST(req: Request) {
  const {
    patient_id,
    room_id,
    nurse_id,
    admission_date,
    discharge_date,
    reason_for_admission,
    admission_status,
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
    !admission_date ||
    !admission_status
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
        reason_for_admission: reason_for_admission || null,
        admission_status,
        created_at: new Date().toISOString(),
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
