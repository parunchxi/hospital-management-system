import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/getRoles';

// GET /api/records/by_record/:record_id → View a single medical record
export async function GET(req: Request, { params }: { params: { record_id: string } }) {
  console.log(req);
  const result = await getUserRole();  
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });  
  }

  const { role } = result;
  if (role !== 'Doctor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });  // Only doctors can view medical records
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('medical_records')  
    .select('*')
    .eq('record_id', params.record_id)  
    .single();  

  if (error || !data) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });  
  }

  return NextResponse.json(data);  // Return the medical record data
