export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/get-role'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function GET(req: NextRequest) {
  const result = await getUserRole()
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role, userId } = result

  const { data: patientRow, error: patientError } = await supabase
    .from('patients')
    .select('patient_id')
    .eq('user_id', userId)
    .single()

  console.log('patientRow', patientRow, 'patientError', patientError)

  if (patientError || !patientRow) {
    return NextResponse.json(
      { error: 'Patient record not found' },
      { status: 404 },
    )
  }

  const { patient_id } = patientRow

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
    .eq('patient_id', patient_id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
