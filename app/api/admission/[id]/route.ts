import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/getRoles';

// GET /api/admissions/:id → Get admission record by ID (Doctor or Admin only)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  // Correctly extract `id` from URL params


  const supabase = await createClient();
  const result = await getUserRole();

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { role } = result;
  if (role !== 'Doctor' && role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden: Doctor or Admin only' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('admissions')
    .select(`
      admission_id, admission_date, discharge_date, updated_at,
      nurse: nurse_id (
        user: users (
          first_name,
          last_name
        )
      ),
      room: room_id (
        room_id,
        room_type,
        department: department_id ( name )
      )
    `)
    .eq('patient_id', id)

  if (error) {
    console.error('Detailed Supabase error:', error);  // Log detailed error from Supabase
    return NextResponse.json({ error: 'Admission record not found' }, { status: 404 });
  }

  return NextResponse.json(data);  // Return the admission data in response
}

// PATCH /api/admissions/:id → Update discharge date, nurse assigned
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { discharge_date, nurse_id } = await req.json();

  const result = await getUserRole();
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { role, userId } = result;

  // Get doctor info
  const { data: doctor, error: doctorError } = await supabase
    .from('medical_staff')
    .select('staff_id, staff_type')
    .eq('user_id', userId)
    .single();

  if (doctorError || !doctor) {
    console.error('Doctor check error:', doctorError);
    return NextResponse.json({ error: 'Forbidden: You are not a medical staff' }, { status: 403 });
  }

  if (doctor.staff_type !== 'Doctor' && doctor.staff_type !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden: Only doctors or admins can update admissions' }, { status: 403 });
  }

  // Validate nurse if provided
  if (nurse_id) {
    const { data: nurse, error: nurseError } = await supabase
      .from('medical_staff')
      .select('staff_id, staff_type')
      .eq('staff_id', nurse_id)
      .eq('staff_type', 'Nurse')
      .single();

    if (nurseError || !nurse) {
      console.error('Nurse validation error:', nurseError);
      return NextResponse.json({ error: 'Invalid nurse_id or staff is not a Nurse' }, { status: 400 });
    }
  }

  // Validate admission exists
  const { data: admission, error: admissionError } = await supabase
    .from('admissions')
    .select('*')
    .eq('admission_id', id)
    .single();

  if (admissionError || !admission) {
    console.error('Admission fetch error:', admissionError);
    return NextResponse.json({ error: 'Admission record not found' }, { status: 404 });
  }

  // Update admission
  const { data, error } = await supabase
    .from('admissions')
    .update({
      discharge_date,
      nurse_id,
      updated_at: new Date().toISOString(),
    })
    .eq('admission_id', id)
    .select()
    .single();

  if (error) {
    console.error('Update admission error:', error);
    return NextResponse.json({ error: 'Failed to update admission' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
