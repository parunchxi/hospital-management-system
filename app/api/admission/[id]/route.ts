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
      admission_date, discharge_date, updated_at,
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
