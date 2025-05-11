// app/api/appointments/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'

// Allowed ENUM values (adjust based on your database definitions)
const validVisitStatuses = ['Scheduled', 'Completed', 'Cancelled']
const validPatientStatuses = ['Outpatient', 'Inpatient']

// GET /api/appointments → List all appointments (Doctor only)
export async function GET(req: Request) {
  const supabase = await createClient()
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role, userId } = result

  const { data: doctor, error: doctorError } = await supabase
    .from('medical_staff')
    .select('staff_id, staff_type')
    .eq('user_id', userId)
    .single()


  if (role === 'Patient') {
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('patient_id')
      .eq('user_id', userId)
      .single();

    if (patientError || !patient) {
      console.error('Fetch patient ID error:', patientError);
      return NextResponse.json(
        { error: 'Failed to fetch patient ID' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('medical_records')
      .select(`
      visit_date,
      visit_status,
      medical_staff: doctor_id (
          users(
            first_name,
            last_name
          )
        )
      `)
      .eq('patient_id', patient.patient_id);

    if (error) {
      console.error('Fetch patient records error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch patient records' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } else if (role === 'Doctor') {
    if (!doctor || !doctor.staff_id) {
      return NextResponse.json(
        { error: 'Doctor information is missing or invalid' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        patient_id,
        record_id,
        symptoms,
        patient_status,
        visit_date,
        visit_status,
        patients(
            users(
                first_name,
                last_name
            )
        )
      `)
      .eq('doctor_id', doctor.staff_id)
      .eq('visit_status', 'Scheduled')
      .order('visit_date', { ascending: false });
    if (error) {
      console.error('Fetch doctor appointments error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch doctor appointments' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } else if (role === 'Admin' || role === 'Pharmacist') {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        record_id,
        symptoms,
        patient_status,
        visit_date,
        visit_status,
        patients(
            users(
                first_name,
                last_name
            )
        )
      `)
      .eq('visit_status', 'Scheduled')
      .order('visit_date', { ascending: false });
    if (error) {
      console.error('Fetch all appointments error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch all appointments' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  }

}

// POST /api/appointments → Create appointment (Doctor only)
export async function POST(req: Request) {
  const {
    patient_id,
    symptoms,
    diagnosis,
    treatment_plan,
    medicine_prescribed,
    visit_date,
    visit_status,
    patient_status,
  } = await req.json()

  const supabase = await createClient()
  const result = await getUserRole()
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { role, userId } = result
  // Check if user is a Doctor
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

  if (doctor.staff_type !== 'Doctor' && doctor.staff_type !== 'Admin') {
    return NextResponse.json(
      {
        error: `Forbidden: Only doctors can create appointments. Your role: ${doctor.staff_type}`,
      },
      { status: 403 },
    )
  }

  // Validate required fields
  if (!patient_id || !visit_date || !visit_status || !patient_status) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    )
  }

  // Validate ENUMs
  if (!validVisitStatuses.includes(visit_status)) {
    return NextResponse.json({ error: 'Invalid visit_status' }, { status: 400 })
  }

  if (!validPatientStatuses.includes(patient_status)) {
    return NextResponse.json(
      { error: 'Invalid patient_status' },
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

  // Insert into medical_records
  const { data, error } = await supabase
    .from('medical_records')
    .insert([
      {
        patient_id,
        doctor_id: doctor.staff_id,
        symptoms: symptoms || null,
        diagnosis: diagnosis || null,
        treatment_plan: treatment_plan || null,
        medicine_prescribed: medicine_prescribed || null,
        visit_date,
        visit_status,
        patient_status,
        created_at: new Date().toISOString(),
      },
    ])
    .single()

  if (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 },
    )
  }

  return NextResponse.json(data, { status: 201 })
}
