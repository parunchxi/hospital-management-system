export const runtime = 'nodejs';      // full cookie support
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserRole } from '@/utils/getRoles';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  /* ── read & validate body ─────────────────────────────── */
  const body = await req.json().catch(() => null) as
    | { patient_id?: number; total_price?: number }
    | null;

  if (!body || typeof body.patient_id !== 'number') {
    return NextResponse.json(
      { error: 'Body must include numeric patient_id' },
      { status: 400 }
    );
  }

  const totalPrice = typeof body.total_price === 'number' ? body.total_price : 0;

  /* ── authorise user ───────────────────────────────────── */
  const userRole = await getUserRole();
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (userRole.role !== 'Admin') {
    return NextResponse.json({ error: 'You do not have permission.' }, { status: 403 });
  }

  /* ── insert the bill ──────────────────────────────────── */
  const { data, error } = await supabase
    .from('billing')
    .insert(
      [
        {
          patient_id : body.patient_id,
          total_price: totalPrice,     // can be 0 – you’ll update later
          status     : 'Pending'
        }
      ],
      { defaultToNull: false }        // ensures defaults (created_at etc.) populate
    )
    .select('bill_id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      message: 'Billing record created.',
      bill_id: data.bill_id
    },
    { status: 201 }
  );
}
