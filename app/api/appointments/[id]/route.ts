import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/getRoles';

export async function PATCH(req: Request, {params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  console.log('Updating appointment with ID:', id);
  const {
    visit_status,
    patient_status,
    symptoms,
    diagnosis,
    treatment_plan,
    medicine_prescribed
  } = await req.json();

  const allowedVisitStatuses = ['Scheduled', 'Canceled', 'Completed'];
  const allowedPatientStatuses = ['Outpatient', 'Inpatient'];

  if (visit_status && !allowedVisitStatuses.includes(visit_status)) {
    return NextResponse.json({ error: 'Invalid visit_status' }, { status: 400 });
  }

  if (patient_status && !allowedPatientStatuses.includes(patient_status)) {
    return NextResponse.json({ error: 'Invalid patient_status' }, { status: 400 });
  }

  const result = await getUserRole();
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { role, userId } = result;

  if (role !== 'Doctor' && role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden: Only doctors or admins can update appointments' }, { status: 403 });
  }

  // Confirm appointment exists
  const { data: appointment, error: fetchError } = await supabase
    .from('medical_records')
    .select('record_id')
    .eq('record_id', id)
    .single();

  if (fetchError || !appointment) {
    console.error('Appointment not found:', fetchError);
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  // Perform update
  const { data: updated, error: updateError } = await supabase
    .from('medical_records')
    .update({
      visit_status,
      patient_status,
      symptoms: symptoms ?? null,
      diagnosis: diagnosis ?? null,
      treatment_plan: treatment_plan ?? null,
      medicine_prescribed: medicine_prescribed ?? null
    })
    .eq('record_id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Update error:', updateError);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }

  return NextResponse.json(updated, { status: 200 });
}
