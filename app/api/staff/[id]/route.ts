import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'
// GET /api/staff/:id → Get staff by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const result = await getUserRole()

    if (!result) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    const { role, userId } = result

    if (role !== 'Admin' && role !== 'Doctor') {
        return NextResponse.json({ error: 'Forbidden: Only admins or doctors can view staff' }, { status: 403 })
    }

    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Missing staff ID' }, { status: 400 })
    }

    let query = supabase
        .from('medical_staff')
        .select('*, users(*)')
        .eq('staff_id', id)
        .single()
    
    const { data, error } = await query

    if (error || !data) {
        console.error('Fetch staff error:', error)
        return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
}
