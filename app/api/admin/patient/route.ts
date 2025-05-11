import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'

// GET /api/admin/patients/ → Get all patients' profiles for admin
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role, userId } = result
    if (role !== 'Admin') {
        return NextResponse.json({ error: 'Forbidden: Only admins can access this endpoint' }, { status: 403 })
    }

  const { data, error } = await supabase
    .from('patients')
    .select('users(national_id, first_name, last_name, date_of_birth, phone_number, address), blood_type, emergency_contact_id')

  if (error || !data) {
    console.error('Fetch patient error:', error?.message || error)
    return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 })
  }

  return NextResponse.json(data, { status: 200 })
}