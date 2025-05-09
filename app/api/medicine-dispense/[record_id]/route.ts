import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/getRoles'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest, { params }: { params: { record_id: string } }) {
  // ✅ Explicit destructuring removes warning
  const recordId = Number(params.record_id)


  if (isNaN(recordId)) {
    return NextResponse.json({ error: 'Invalid record_id' }, { status: 400 })
  }

  // ✅ Secure role check
  const userRole = await getUserRole()
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowedRoles = ['Doctor', 'Pharmacist', 'Admin']
  if (!allowedRoles.includes(userRole.role)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient role' }, { status: 403 })
  }

  // ✅ Query dispensed medicine records with joined medicine name
  const { data, error } = await supabase
    .from('medicine_dispense')
    .select(`
      dispense_id,
      quantity,
      dispense_date,
      medicine_stock(name),
      pharmacist_id
    `)
    .eq('record_id', recordId)
    .order('dispense_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
