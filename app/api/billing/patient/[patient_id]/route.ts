export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/get-role'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ patient_id: string }> },
) {
  const { patient_id } = await params
  const patientId = Number(patient_id)
  if (isNaN(patientId)) {
    return NextResponse.json({ error: 'Invalid patient_id' }, { status: 400 })
  }

  const userRole = await getUserRole()
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /* Only Admin or the patient themselves */
  if (userRole.role === 'Admin') {
    /* pass */
  } else if (userRole.role === 'Patient') {
    const { data: pRow } = await supabase
      .from('patients')
      .select('patient_id')
      .eq('user_id', userRole.userId)
      .single()
    if (!pRow || pRow.patient_id !== patientId) {
      return NextResponse.json(
        { error: 'You do not have permission.' },
        { status: 403 },
      )
    }
  } else {
    return NextResponse.json(
      { error: 'You do not have permission.' },
      { status: 403 },
    )
  }

  const { data, error } = await supabase
    .from('billing')
    .select(
      `
      bill_id,
      total_price,
      status,
      created_at,
      updated_at,
      billing_items (
        item_id,
        item_type,
        item_id_ref,
        description,
        quantity,
        unit_price,
        total_price
      )
    `,
    )
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
