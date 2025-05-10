import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/getRoles'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const userRole = await getUserRole()

  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowedRoles = ['Doctor', 'Pharmacist', 'Admin']
  if (!allowedRoles.includes(userRole.role)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient role' }, { status: 403 })
  }

  const { data, error } = await supabase.from('medicine_stock').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
