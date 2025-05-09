export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserRole } from '@/utils/getRoles';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(
  req: NextRequest,
  /* ⬇︎  ประกาศ params เป็น Promise เพื่อให้ type-check ผ่าน */
  { params }: { params: Promise<{ id: string }> }
) {
  /* ต้อง await params */
  const { id } = await params;
  const medicineId = Number(id);
  if (isNaN(medicineId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  /* อ่าน body */
  const { quantity } = (await req.json().catch(() => ({}))) as { quantity?: number };
  if (typeof quantity !== 'number') {
    return NextResponse.json({ error: 'Missing quantity' }, { status: 400 });
  }

  /* ตรวจสิทธิ์ */
  const userRole = await getUserRole();         // ส่ง req เข้าไป
  if (!userRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!['Doctor', 'Pharmacist', 'Admin'].includes(userRole.role)) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient role' },
      { status: 403 }
    );
  }

  /* อัปเดต stock */
  const { error } = await supabase
    .from('medicine_stock')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('medicine_id', medicineId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Quantity updated successfully' });
}
