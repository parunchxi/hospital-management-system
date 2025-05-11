// app/api/staff/me/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/get-role'

const validStaffTypes = ['Doctor', 'Nurse', 'Admin', 'Pharmacist']

export async function GET(req: Request) {
  const supabase = await createClient()
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role, userId } = result

  const { data: staffRecord, error: staffError } = await supabase
    .from('medical_staff')
    .select(
      `
      staff_id, staff_type, license_number, employment_status, date_hired, updated_at,
      departments(name),
      users: user_id (
        user_id, national_id, first_name, last_name, gender, date_of_birth, phone_number, address
      )
    `,
    )
    .eq('user_id', userId)
    .single()

  if (staffError) {
    if (staffError.code === 'PGRST116') {
      // No record found
      return NextResponse.json(
        { error: 'Forbidden: Not registered as medical staff' },
        { status: 403 },
      )
    }
    return NextResponse.json({ error: staffError.message }, { status: 500 })
  }

  return NextResponse.json(staffRecord)
}
