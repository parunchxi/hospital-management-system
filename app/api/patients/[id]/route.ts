import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/get-role'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role, userId } = result
  const { id: patientId } = await params

  const { data: patient, error } = await supabase
    .from('patients')
    .select(
      `*, users( national_id,first_name,last_name,date_of_birth,phone_number,address),
            medical_records(record_id, visit_date, visit_status, doctor_id (users(first_name,last_name)))`,
    )
    .eq('patient_id', patientId)
    .single()
  console.log('Patient data:', patient)

  if (error || !patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
  }

  if (
    role !== 'Admin' &&
    role !== 'Doctor' &&
    role !== 'Nurse' &&
    userId !== patient.user_id
  ) {
    return NextResponse.json(
      { error: "Forbidden: You can't access this patient's data" },
      { status: 403 },
    )
  }

  return NextResponse.json(patient, { status: 200 })
}
