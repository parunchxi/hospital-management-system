// app/api/rooms/route.ts

// ✅ Example Query Strings:
// /api/rooms?type=ICU
// /api/rooms?department=3
// /api/rooms?available=true
// /api/rooms?type=Operating&available=false&department=5

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'
const validRoomTypes = ['General', 'ICU', 'Private', 'Emergency']

export async function GET(req: Request) {
  const supabase = await createClient()
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role, userId } = result

  if (role !== 'Admin' && role !== 'Doctor') {
    return NextResponse.json(
      { error: 'Forbidden: Only admins or doctors can view rooms' },
      { status: 403 },
    )
  }
  const { data: staff, error: staffError } = await supabase
    .from('medical_staff')
    .select('staff_id, staff_type')
    .eq('user_id', userId)
    .single()

  if (staffError || !staff) {
    return NextResponse.json(
      { error: 'Forbidden: You are not medical staff' },
      { status: 403 },
    )
  }

  if (staff.staff_type !== 'Doctor' && staff.staff_type !== 'Admin') {
    return NextResponse.json(
      {
        error: `Forbidden: Only Doctors and Admins can view rooms. Your role: ${staff.staff_type}`,
      },
      { status: 403 },
    )
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const department_id = searchParams.get('department')
  const available = searchParams.get('available') // 'true' or 'false'

  let query = supabase
    .from('rooms')
    .select(
      `
      room_id, room_type, department_id, price_per_night, capacity,
      departments(name)
    `,
    )
    .order('room_id')

  if (type) query = query.eq('room_type', type)
  if (department_id) query = query.eq('department_id', department_id)
  if (available === 'true') query = query.gt('capacity', 0)
  else if (available === 'false') query = query.lte('capacity', 0)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
