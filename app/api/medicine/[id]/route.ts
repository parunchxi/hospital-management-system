// // app/api/medicine/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/getRoles'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params
  const medicineId = parseInt(id)
  const body = await req.json()
  const { quantity } = body

  if (!quantity) {
    return NextResponse.json({ error: 'Missing quantity' }, { status: 400 })
  }

  // ✅ 1. Get role from session
  const userRole = await getUserRole()
  console.log('User role:', userRole)
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowedRoles = ['Doctor', 'Pharmacist', 'Admin']
  if (!allowedRoles.includes(userRole.role)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient role' }, { status: 403 })
  }

  // ✅ 2. Update stock
  const { error } = await supabase
    .from('medicine_stock')
    .update({
      quantity,
      updated_at: new Date().toISOString()
    })
    .eq('medicine_id', medicineId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Quantity updated successfully' })
}
