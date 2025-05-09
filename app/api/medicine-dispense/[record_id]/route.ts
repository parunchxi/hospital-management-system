export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserRole } from '@/utils/getRoles';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  /* ⬇︎ ประกาศเป็น Promise ให้ตรงทุกเมธอดในโฟลเดอร์ */
  { params }: { params: Promise<{ record_id: string }> }
) {
  /* ต้อง await params */
  const { record_id } = await params;
  const recordId = Number(record_id);

  if (isNaN(recordId)) {
    return NextResponse.json({ error: 'Invalid record_id' }, { status: 400 });
  }

  /* เช็ก role */
  const userRole = await getUserRole();          // ← ส่ง req เข้าไป
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!['Doctor', 'Pharmacist', 'Admin'].includes(userRole.role)) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient role' },
      { status: 403 }
    );
  }

  /* ดึงข้อมูล dispense + ชื่อยา */
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
    .order('dispense_date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
