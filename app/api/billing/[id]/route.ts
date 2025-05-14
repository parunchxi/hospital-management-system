export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserRole } from '@/utils/get-role'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

type Status = 'Pending' | 'Paid' | 'Canceled'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const billId = Number(id)
  if (isNaN(billId)) {
    return NextResponse.json({ error: 'Invalid bill_id' }, { status: 400 })
  }

  const { status } = (await req.json().catch(() => ({}))) as { status?: Status }
  if (!status || !['Pending', 'Paid', 'Canceled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const userRole = await getUserRole()
  if (!userRole)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (userRole.role !== 'Admin')
    return NextResponse.json(
      { error: 'You do not have permission.' },
      { status: 403 },
    )

  const { error } = await supabase
    .from('billing')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('bill_id', billId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    message: `Billing status updated to "${status}".`,
  })
}
