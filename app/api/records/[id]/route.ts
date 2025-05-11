import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/getRoles';

// GET /api/records/by_record/:record_id → View a single medical record
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await getUserRole();  
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });  
  }
  const { role } = result;
  if (role !== 'Doctor' && role !== 'Admin') {
    return NextResponse.json({ error: 'Only doctors can view medical records' }, { status: 403 });  // Only doctors can view medical records
  }

  const supabase = await createClient();
  const resolved_params = await params;
  const rec_id = resolved_params.id; 
  
  const { data, error } = await supabase
    .from('medical_records')  
    .select(`*,
      medical_staff: doctor_id (
        users (
          first_name,
          last_name
          ))`)
    .eq('record_id', rec_id)  
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });  
  }

  return NextResponse.json(data);
}