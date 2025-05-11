import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/getRoles'

// GET /api/records/by_record/:record_id → View a single medical record
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = await getUserRole()
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { role } = result
  if (role !== 'Doctor' && role !== 'Admin' && role !== 'Nurse') {
    return NextResponse.json(
      { error: 'Only doctors can view medical records' },
      { status: 403 },
    ) // Only doctors can view medical records
  }

  const supabase = await createClient()
  const resolved_params = await params
  const rec_id = resolved_params.id

  const { data, error } = await supabase
    .from('medical_records')
    .select(
      `*,
      medical_staff: doctor_id (
        users (
          first_name,
          last_name
          ))`,
    )
    .eq('record_id', rec_id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// DELETE -> delete medical record
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role } = result

  if (role !== 'Doctor' && role !== 'Admin') {
    return NextResponse.json(
      { error: 'Only doctors can view medical records' },
      { status: 403 },
    ) // Only doctors can view medical records
  }
  const supabase = await createClient()
  const resolved_params = await params
  const rec_id = resolved_params.id

  try {
    if (!rec_id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 },
      )
    }

    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('record_id', rec_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Medical record deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete medical record' },
      { status: 500 },
    )
  }
}
