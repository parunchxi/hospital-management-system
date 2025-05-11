import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/getRoles'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { record_id, medicine_id, quantity } = body

  if (!record_id || !medicine_id || !quantity) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    )
  }

  // ✅ Get user role from session
  const userRole = await getUserRole()
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!['Doctor', 'Pharmacist', 'Admin'].includes(userRole.role)) {
    return NextResponse.json(
      { error: 'Only doctors and pharmacists can dispense' },
      { status: 403 },
    )
  }

  // ✅ Look up staff_id from user_id
  const { data: staffRow, error: staffLookupError } = await supabase
    .from('medical_staff')
    .select('staff_id')
    .eq('user_id', userRole.userId)
    .single()

  if (staffLookupError || !staffRow) {
    return NextResponse.json(
      { error: 'Staff not found for this user' },
      { status: 400 },
    )
  }

  // ✅ Check medicine stock
  const { data: medicine, error: stockError } = await supabase
    .from('medicine_stock')
    .select('quantity')
    .eq('medicine_id', medicine_id)
    .single()

  if (stockError || !medicine) {
    return NextResponse.json({ error: 'Invalid medicine ID' }, { status: 400 })
  }

  if (medicine.quantity < quantity) {
    return NextResponse.json(
      { error: 'Not enough stock available' },
      { status: 400 },
    )
  }

  // ✅ Insert dispense record
  const { error: insertError } = await supabase
    .from('medicine_dispense')
    .insert([
      {
        record_id,
        pharmacist_id: staffRow.staff_id, // ✅ this is now defined
        medicine_id,
        quantity,
        dispense_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // ✅ Subtract stock
  const { error: updateError } = await supabase
    .from('medicine_stock')
    .update({
      quantity: medicine.quantity - quantity,
      updated_at: new Date().toISOString(),
    })
    .eq('medicine_id', medicine_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Medicine dispensed and stock updated' })
}
