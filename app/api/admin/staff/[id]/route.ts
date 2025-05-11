import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/get-role'
import { NextRequest, NextResponse } from 'next/server'

const validStaffTypes = ['Doctor', 'Nurse', 'Pharmacist', 'Admin']
const validEmploymentStatus = ['Active', 'On_Leave', 'Resigned', 'Retired']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  // const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  const { department_id, staff_type, license_number, employment_status } =
    await req.json()

  const result = await getUserRole()
  if (!result)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { role, userId } = result
  if (role !== 'Admin')
    return NextResponse.json(
      { error: 'Forbidden: Admin only' },
      { status: 403 },
    )

  if (!department_id && !staff_type && !license_number && !employment_status) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const supabase = await createClient()
  const updateData: any = {}

  // ✅ Check department_id exists
  if (department_id !== undefined) {
    const { data: dept, error: deptError } = await supabase
      .from('departments')
      .select('department_id')
      .eq('department_id', department_id)
      .single()

    if (deptError || !dept) {
      return NextResponse.json(
        { error: 'Invalid department_id' },
        { status: 400 },
      )
    }
    updateData.department_id = department_id
  }

  // ✅ Validate staff_type ENUM
  if (staff_type !== undefined) {
    if (!validStaffTypes.includes(staff_type)) {
      return NextResponse.json({ error: 'Invalid staff_type' }, { status: 400 })
    }
    updateData.staff_type = staff_type
  }

  // ✅ Validate employment_status ENUM
  if (employment_status !== undefined) {
    if (!validEmploymentStatus.includes(employment_status)) {
      return NextResponse.json(
        { error: 'Invalid employment_status' },
        { status: 400 },
      )
    }
    updateData.employment_status = employment_status
  }

  if (license_number !== undefined) updateData.license_number = license_number
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('medical_staff')
    .update(updateData)
    .eq('staff_id', id)
    .single()

  if (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update staff info' },
      { status: 500 },
    )
  }

  return NextResponse.json(data, { status: 200 })
}
