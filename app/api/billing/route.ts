// app/api/billing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/get-role'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── GET /api/billing ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const userRole = await getUserRole()
  if (!userRole)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (userRole.role !== 'Admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // ดึงข้อมูล billing พร้อมชื่อคนไข้
  const { data, error } = await supabase.from('billing').select(`
      bill_id,
      total_price,
      status,
      patients (
        users ( first_name, last_name )
      )
    `)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const invoices = (data as any[]).map((r: any) => ({
    bill_id: r.bill_id,
    total_price: r.total_price,
    status: r.status,
    patient_name: `${r.patients.users.first_name} ${r.patients.users.last_name}`,
  }))

  return NextResponse.json(invoices, { status: 200 })
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    patient_id?: number
    total_price?: number
  } | null

  if (!body || typeof body.patient_id !== 'number') {
    return NextResponse.json(
      { error: 'Body must include numeric patient_id' },
      { status: 400 },
    )
  }

  const totalPrice = typeof body.total_price === 'number' ? body.total_price : 0

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

  const { data, error } = await supabase
    .from('billing')
    .insert(
      [
        {
          patient_id: body.patient_id,
          total_price: totalPrice, // can be 0 – you’ll update later
          status: 'Pending',
        },
      ],
      { defaultToNull: false }, // ensures defaults (created_at etc.) populate
    )
    .select('bill_id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    {
      message: 'Billing record created.',
      bill_id: data.bill_id,
    },
    { status: 201 },
  )
}
