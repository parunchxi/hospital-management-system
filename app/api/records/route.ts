import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'

// POST /api/records → Create new medical record (Doctor only)
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
  } = await req.json();  // Extract data from the request body

  const result = await getUserRole();  // Get the current user's role
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });  // Unauthorized if no user session
  }

  const { role, userId } = result;
  
  if (role !== 'Doctor') {
    return NextResponse.json({ error: 'Forbidden: Only doctors can create medical records' }, { status: 403 });  // Only doctors can create records
  }


  // Validate required fields
  if (!patient_id || !symptoms || !diagnosis || !treatment_plan || !visit_date || !visit_status || !patient_status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });  // Missing fields error
  }

  const supabase = await createClient();

  const { data: staff_id, error: staffError } = await supabase
  .from('medical_staff')
  .select('staff_id')
  .eq('user_id', userId)
  .single();

  if (staffError) {
    console.error('Error fetching staff_id:', staffError);
    return NextResponse.json({ error: 'Failed to fetch staff_id' }, { status: 500 });
  }
  
  // Validate if the patient exists
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('patient_id')
    .eq('patient_id', patient_id)
    .single();

  if (patientError || !patient) {
    return NextResponse.json({ error: 'Invalid patient_id' }, { status: 400 });  // Invalid patient
  }

  // Insert new medical record into the database
  const patientId = parseInt(patient_id);
  const { data, error } = await supabase
    .from('medical_records')
    .insert([
      {
        patient_id: patientId,
        doctor_id: staff_id.staff_id,  // Use the logged-in doctor ID
        symptoms,
        diagnosis,
        treatment_plan,
        medicine_prescribed,
        visit_date,
        visit_status,
        patient_status,
        created_at: new Date().toISOString(),  // Set the creation timestamp
      },
    ])
    .single();  // Insert a single record

  if (error) {
    console.error('Create medical record error:', error);
    return NextResponse.json({ error: 'Failed to create medical record' }, { status: 500 });  // Server error
  }

  return NextResponse.json(data, { status: 201 });  // Successfully created medical record
}



