import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/getRoles';

// GET /api/records/by_patient/:patient_id → List patient’s medical records (Doctor/Nurse)
export async function GET(req: Request, { params }: { params: { patient_id: string } }) {
  const result = await getUserRole();  
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });  
  }

  const { role } = result;
  if (role !== 'Doctor' && role !== 'Nurse') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });  
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('medical_records')  // Query the medical_records table
    .select('*')
    .eq('patient_id', params.patient_id);  

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });  
  }

  return NextResponse.json(data);  
}

