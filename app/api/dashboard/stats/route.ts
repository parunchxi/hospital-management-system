import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/get-role'

export async function GET() {
  const result = await getUserRole()

  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role } = result

  if (role !== 'Admin') {
    return NextResponse.json(
      { error: 'Only admins can view dashboard stats' },
      { status: 403 },
    )
  }

  const supabase = await createClient()

  try {
    // Fetch all required stats in parallel
    const [
      { count: totalPatients },
      { count: totalStaff },
      { count: totalBills },
      { count: totalDoctors },
      { count: totalNurses },
      { count: totalPharmacists },
      { count: departments },
      { count: appointments },
      { count: totalRecords },
      { count: treatments },
      { count: medicines },
      revenueRes,
      mostActiveDoctorRes,
      mostVisitedDeptRes,
      { count: visitsThisMonth },
    ] = await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase
        .from('medical_staff')
        .select('*', { count: 'exact', head: true }),
      supabase.from('billing').select('*', { count: 'exact', head: true }),
      supabase
        .from('medical_staff')
        .select('*', { count: 'exact', head: true })
        .eq('staff_type', 'Doctor'),
      supabase
        .from('medical_staff')
        .select('*', { count: 'exact', head: true })
        .eq('staff_type', 'Nurse'),
      supabase
        .from('medical_staff')
        .select('*', { count: 'exact', head: true })
        .eq('staff_type', 'Pharmacist'),
      supabase.from('departments').select('*', { count: 'exact', head: true }),
      supabase
        .from('medical_records')
        .select('*', { count: 'exact', head: true })
        .eq('visit_status', 'Scheduled'),
      supabase
        .from('medical_records')
        .select('*', { count: 'exact', head: true }),
      supabase.from('treatments').select('*', { count: 'exact', head: true }),
      supabase
        .from('medicine_stock')
        .select('*', { count: 'exact', head: true }),

      // Revenue: SUM of billing.total_price where status = 'Paid'
      supabase.from('billing').select('total_price').eq('status', 'Paid'),

      // Most Active Doctor: Group medical_records by doctor_id
      supabase
        .from('medical_records')
        .select('doctor_id')
        .then((res) => {
          if (!res.data || res.data.length === 0) return { data: [] }

          // Count occurrences of each doctor_id
          const doctorCounts: Record<number, number> = {}
          res.data.forEach((record) => {
            const { doctor_id } = record
            doctorCounts[doctor_id] = (doctorCounts[doctor_id] || 0) + 1
          })

          // Find doctor with highest count
          let maxCount = 0
          let mostActiveDoctor = null
          Object.entries(doctorCounts).forEach(([doctorId, count]) => {
            if (count > maxCount) {
              maxCount = count
              mostActiveDoctor = parseInt(doctorId)
            }
          })

          return {
            data: mostActiveDoctor ? [{ doctor_id: mostActiveDoctor }] : [],
          }
        }),

      // Most Visited Department: Join records → doctors → departments and count
      supabase
        .from('medical_records')
        .select('doctor_id')
        .then(async (res) => {
          if (!res.data || res.data.length === 0) return { name: 'N/A' }

          // Get unique doctor IDs
          const doctorIds = Array.from(
            new Set(res.data.map((r) => r.doctor_id)),
          )

          // Get departments for all doctors in one query
          const { data: doctors } = await supabase
            .from('medical_staff')
            .select('staff_id, department_id')
            .in('staff_id', doctorIds)

          if (!doctors || doctors.length === 0) return { name: 'N/A' }

          // Create a mapping of doctor to department
          const doctorDeptMap: Record<number, number> = {}
          doctors.forEach((doc) => {
            doctorDeptMap[doc.staff_id] = doc.department_id
          })

          // Count departments
          const deptCounts: Record<number, number> = {}
          res.data.forEach((record) => {
            const deptId = doctorDeptMap[record.doctor_id]
            if (deptId) {
              deptCounts[deptId] = (deptCounts[deptId] || 0) + 1
            }
          })

          // Find most visited department ID
          let mostVisitedDeptId = null
          let maxCount = 0
          Object.entries(deptCounts).forEach(([deptId, count]) => {
            if (count > maxCount) {
              maxCount = count
              mostVisitedDeptId = parseInt(deptId)
            }
          })

          if (!mostVisitedDeptId) return { name: 'N/A' }

          // Get the department name
          const { data: dept } = await supabase
            .from('departments')
            .select('name')
            .eq('department_id', mostVisitedDeptId)
            .single()

          return { name: dept?.name || 'N/A' }
        }),

      // Visits This Month
      supabase
        .from('medical_records')
        .select('*', { count: 'exact', head: true })
        .gte(
          'visit_date',
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
          ).toISOString(),
        ),
    ])

    // Calculate revenue
    const revenue = (revenueRes.data || []).reduce(
      (sum, item) => sum + item.total_price,
      0,
    )

    // Get doctor name from most active doctor
    let mostActiveDoctorName = 'N/A'
    if (mostActiveDoctorRes.data?.length) {
      const doctorId = mostActiveDoctorRes.data[0].doctor_id
      const doctorUser = await supabase
        .from('medical_staff')
        .select('user_id')
        .eq('staff_id', doctorId)
        .single()
      if (doctorUser.data?.user_id) {
        const user = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('user_id', doctorUser.data.user_id)
          .single()
        if (user.data) {
          mostActiveDoctorName = `Dr. ${user.data.first_name}`
        }
      }
    }

    const stats = [
      { label: 'Total Patients', icon: 'Users', value: totalPatients || 0 },
      { label: 'Total Staff', icon: 'Users', value: totalStaff || 0 },
      { label: 'Total Bills', icon: 'CreditCard', value: totalBills || 0 },
      { label: 'Total Doctors', icon: 'Stethoscope', value: totalDoctors || 0 },
      { label: 'Total Nurses', icon: 'Syringe', value: totalNurses || 0 },
      {
        label: 'Total Pharmacists',
        icon: 'FilePlus',
        value: totalPharmacists || 0,
      },
      { label: 'Departments', icon: 'Hospital', value: departments || 0 },
      { label: 'Appointments', icon: 'CalendarDays', value: appointments || 0 },
      {
        label: 'Total Records',
        icon: 'ClipboardList',
        value: totalRecords || 0,
      },
      { label: 'Treatments', icon: 'HeartPulse', value: treatments || 0 },
      { label: 'Medicines', icon: 'FileText', value: medicines || 0 },
      { label: 'Revenue', icon: 'DollarSign', value: revenue },
      {
        label: 'Most Active Doctor',
        icon: 'Activity',
        value: mostActiveDoctorName,
      },
      {
        label: 'Most Visited Dept.',
        icon: 'LayoutList',
        value: mostVisitedDeptRes.name,
      },
      {
        label: 'Visits This Month',
        icon: 'TrendingUp',
        value: visitsThisMonth || 0,
      },
    ]

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('[DASHBOARD_STATS_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard stats' },
      { status: 500 },
    )
  }
}
