// /api/staff/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/get-role'

// GET /api/staff → get all staff
// GET /api/staff?type=Doctor → filter by type
// GET /api/staff?type=Nurse&department=ICU → filter by type and department

// GET /api/staff?type=Doctor&department=Cardiology
export async function GET(req: Request) {
  const supabase = await createClient()
  const result = await getUserRole()
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role, userId } = result

  if (role !== 'Admin' && role !== 'Doctor') {
    return NextResponse.json(
      { error: 'Forbidden: Only admins or doctors can view staff' },
      { status: 403 },
    )
  }

  // Extract query parameters
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const department = searchParams.get('department')

  // Build the query dynamically
  let query = supabase
    .from('medical_staff')
    .select('*, users(first_name, last_name)')

  if (type) {
    query = query.eq('staff_type', type)
  }

  if (department) {
    query = query.eq('department', department)
  }

  const { data, error } = await query

  if (error) {
    console.error('Fetch staff error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 },
    )
  }

  return NextResponse.json(data, { status: 200 })
}
