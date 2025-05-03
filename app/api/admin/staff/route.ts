// app/api/admin/staff/route.ts
import { NextResponse } from 'next/server'
import { getUserRole } from '@/utils/getRoles'
import { createClient } from '@/utils/supabase/server'

const validStaffTypes = ['Doctor', 'Nurse', 'Pharmacist', 'Admin']
const validEmploymentStatus = ['Active', 'On_Leave', 'Resigned', 'Retired']

// GET /api/admin/staff → List all staff by type
export async function GET(req: Request) {
  const role = await getUserRole()

  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
  }

  const staffType = new URL(req.url).searchParams.get('type')
  const supabase = await createClient()

  let query = supabase
    .from('medical_staff')
    .select(`
      staff_id, staff_type, license_number, employment_status, date_hired, updated_at,
      departments(name),
      users: user_id (
        user_id, national_id, first_name, last_name, gender, phone_number
      )
    `)
    .order('staff_id')

  if (staffType) query = query.eq('staff_type', staffType)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/staff → Create staff 
export async function POST(req: Request) {
  const { user_id, department_id, staff_type, license_number, employment_status, date_hired, updated_at} = await req.json()

  const role = await getUserRole()
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (role !== 'Admin') return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })

  if (!department_id || !staff_type || !license_number || !employment_status || !updated_at) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = await createClient()

  // Validate user_id exists in the users table
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('user_id')
    .eq('user_id', user_id)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: 'Invalid user_id. User does not exist.' }, { status: 400 })
  }

  // Validate department_id exists
  const { data: dept, error: deptError } = await supabase
    .from('departments')
    .select('department_id')
    .eq('department_id', department_id)
    .single()

  if (deptError || !dept) {
    return NextResponse.json({ error: 'Invalid department_id' }, { status: 400 })
  }

  // Validate staff_type ENUM
  if (!validStaffTypes.includes(staff_type)) {
    return NextResponse.json({ error: 'Invalid staff_type' }, { status: 400 })
  }

  // Validate employment_status ENUM
  if (!validEmploymentStatus.includes(employment_status)) {
    return NextResponse.json({ error: 'Invalid employment_status' }, { status: 400 })
  }

  // Create new staff record
  const { data, error } = await supabase
    .from('medical_staff')
    .insert([
      {
        user_id,
        department_id,
        staff_type,
        license_number,
        employment_status,
        date_hired,
        updated_at
      }
    ])
    .single()

  if (error) {
    console.error('Create staff error:', error)
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}