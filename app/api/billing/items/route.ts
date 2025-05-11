export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/get-role'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

type ItemBody = {
  bill_id: number
  item_type: 'Medicine' | 'Treatment' | 'Rooom'
  item_id_ref: number
  description: string
  quantity: number
  unit_price: number
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as ItemBody | null

  if (
    !body ||
    typeof body.bill_id !== 'number' ||
    typeof body.item_type !== 'string' ||
    typeof body.item_id_ref !== 'number' ||
    typeof body.description !== 'string' ||
    typeof body.quantity !== 'number' ||
    typeof body.unit_price !== 'number'
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid fields.' },
      { status: 400 },
    )
  }
  if (body.quantity <= 0 || body.unit_price < 0) {
    return NextResponse.json(
      { error: 'Quantity must be > 0 and price >= 0.' },
      { status: 400 },
    )
  }

  const userRole = await getUserRole()
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (userRole.role !== 'Admin') {
    return NextResponse.json(
      { error: 'You do not have permission.' },
      { status: 403 },
    )
  }

  const { data: billRow, error: billErr } = await supabase
    .from('billing')
    .select('total_price')
    .eq('bill_id', body.bill_id)
    .single()

  if (billErr || !billRow) {
    return NextResponse.json({ error: 'Bill not found.' }, { status: 400 })
  }

  const itemTotal = body.quantity * body.unit_price

  const { error: insertErr } = await supabase.from('billing_items').insert([
    {
      bill_id: body.bill_id,
      item_type: body.item_type,
      item_id_ref: body.item_id_ref,
      description: body.description,
      quantity: body.quantity,
      unit_price: body.unit_price,
      total_price: itemTotal,
    },
  ])

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  const { error: updErr } = await supabase
    .from('billing')
    .update({
      total_price: billRow.total_price + itemTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('bill_id', body.bill_id)

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 })
  }

  return NextResponse.json(
    {
      message: 'Item added and bill total updated.',
      new_item_total: itemTotal,
    },
    { status: 201 },
  )
}
