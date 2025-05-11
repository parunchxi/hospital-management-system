'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Home, Users, Pill, CreditCard, FileText, Search } from 'lucide-react'

/* ========= types ========= */
type Nurse = {
  staff_id: number
  users: { first_name: string; last_name: string }
}
type Admission = {
  admission_id: number
  room_id: number
  nurse_id: number
}

type User = {
  user_id: number
  first_name: string
  last_name: string
}

type Patient = {
  patient_id: number
  users: {
    national_id: string
    first_name: string
    last_name: string
  }
  blood_type: string
  emergency_contact_id: number
}

export default function AdminDashboard() {
  /* ---------- state ---------- */
  const [nurses, setNurses] = useState<Nurse[]>([])
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedAdm, setSelectedAdm] = useState<Admission | null>(null)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null,
  )

  const [createFeedback, setCreateFeedback] = useState<{
    ok: boolean
    msg: string
  } | null>(null)
  const [updateFeedback, setUpdateFeedback] = useState<{
    ok: boolean
    msg: string
  } | null>(null)

  type Staff = {
    staff_id: number
    users: { first_name: string; last_name: string }
  }
  const [staffList, setStaffList] = useState<Staff[]>([])

  const [updateData, setUpdateData] = useState({
    staffId: '', // string
    departmentId: '',
    staffType: '',
    licenseNumber: '',
    employmentStatus: '',
  })
  const [userList, setUserList] = useState<User[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  /* ---------- load nurses + admissions ---------- */

  // แทน billings
  const [invoices, setInvoices] = useState<
    {
      total_price: any
      bill_id: number
      patient_name: string
      status: string
    }[]
  >([])

  // state สำหรับ Update Billing form
  const [updateBilling, setUpdateBilling] = useState({
    billId: '',
    status: 'Pending',
  })
  const [billingUpdateFeedback, setBillingUpdateFeedback] = useState<{
    ok: boolean
    msg: string
  } | null>(null)

  const [newItem, setNewItem] = useState({
    billId: '', // เลือก invoice ที่จะเพิ่ม item ให้
    itemType: 'Medicine', // Medicine | Treatment | Room
    itemIdRef: '', // รหัสของ medicine/treatment/room
    description: '',
    quantity: '',
    unitPrice: '',
  })
  const [itemFeedback, setItemFeedback] = useState<{
    ok: boolean
    msg: string
  } | null>(null)

  async function handleAddItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setItemFeedback(null)

    const body = {
      bill_id: Number(newItem.billId),
      item_type: newItem.itemType as 'Medicine' | 'Treatment' | 'Room',
      item_id_ref: Number(newItem.itemIdRef),
      description: newItem.description,
      quantity: Number(newItem.quantity),
      unit_price: Number(newItem.unitPrice),
    }

    try {
      const res = await fetch('/api/billing/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (res.ok) {
        setItemFeedback({ ok: true, msg: json.message })
        // เคลียร์ฟอร์ม
        setNewItem({
          billId: '',
          itemType: 'Medicine',
          itemIdRef: '',
          description: '',
          quantity: '',
          unitPrice: '',
        })
        // (ถ้าต้องการ รีโหลด table หรือ invoices ก็เรียก load() ใหม่ที่นี่)
      } else {
        setItemFeedback({ ok: false, msg: json.error || 'Add item failed' })
      }
    } catch (err) {
      console.error(err)
      setItemFeedback({ ok: false, msg: 'An unexpected error occurred' })
    }
  }

  useEffect(() => {
    async function load() {
      const [nurseRes, admRes] = await Promise.all([
        fetch('/api/admin/staff?type=Nurse', { credentials: 'include' }),
        fetch('/api/admission', { credentials: 'include' }),
      ])

      if (nurseRes.ok) {
        setNurses(await nurseRes.json())
      } else {
        console.error('staff load error', nurseRes.status)
      }

      if (admRes.ok) {
        const json = await admRes.json()
        console.log('admissions response', json) // → { data: [...] }
        setAdmissions(json.data) // now admissions is Admission[]
      }

      const patientsRes = await fetch('/api/admin/patient', {
        credentials: 'include',
      })

      if (patientsRes.ok) {
        const pts = await patientsRes.json()
        setPatients(Array.isArray(pts) ? pts : pts.data)
      } else {
        console.error('fetch patients error', patientsRes.status)
      }
      const invRes = await fetch('/api/billing', { credentials: 'include' })
      if (invRes.ok) {
        const inv = await invRes.json()
        setInvoices(inv)
      } else {
        console.error('fetch invoices failed', invRes.status)
      }
    }

    load()
    // fetch staff for Update‐Staff select
    fetch('/api/staff', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        // if your API wraps in { data: [...] } unwrap it
        const list = Array.isArray(d) ? d : d.data
        setStaffList(list)
      })
      .catch(console.error)
    fetch('/api/admin/user', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        // ถ้า API ของคุณ return { data: [...] } ให้ใช้ data.data
        const list = Array.isArray(data) ? data : data.data
        setUserList(list)
      })
      .catch((err) => console.error('fetch users failed', err))
  }, [])

  function handleAdmissionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedAdm(
      admissions.find((a) => a.admission_id === +e.target.value) || null,
    )
  }
  function handleStaffSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    const staff = staffList.find((s) => String(s.staff_id) === id)
    if (staff) {
      // ต้องมั่นใจว่า staffList item มีฟิลด์พวกนี้ return มาจาก API
      setUpdateData({
        staffId: id,
        departmentId: String((staff as any).department_id),
        staffType: (staff as any).staff_type,
        licenseNumber: (staff as any).license_number,
        employmentStatus: (staff as any).employment_status,
      })
    }
  }

  async function handleAssign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedAdm) return

    const form = e.currentTarget
    setFeedback(null)
    setIsAssigning(true)

    try {
      const nurseId = +form.nurseId.value
      const res = await fetch('/api/admin/assign-nurse', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          admission_id: selectedAdm.admission_id,
          nurse_id: nurseId,
          room_id: selectedAdm.room_id,
        }),
      })

      const json = await res.json()

      if (res.ok) {
        // update your admissions list
        setAdmissions((prev) =>
          prev.map((a) =>
            a.admission_id === json.admission_id
              ? { ...a, nurse_id: json.nurse_id }
              : a,
          ),
        )
        setFeedback({ ok: true, msg: '✔ Assigned successfully' })
        form.reset()
        setSelectedAdm(null)
      } else {
        // server returned a 4xx/5xx
        setFeedback({ ok: false, msg: json.error || 'Assign failed' })
      }
    } catch (err) {
      console.error(err)
      setFeedback({ ok: false, msg: 'Unexpected error' })
    } finally {
      // ALWAYS run this after success or error
      setIsAssigning(false)
    }
  }

  const sidebarLinks = [
    { label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Medical Personnel', icon: <Users className="w-5 h-5" /> },
    { label: 'Medication', icon: <Pill className="w-5 h-5" /> },
    { label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Report', icon: <FileText className="w-5 h-5" /> },
  ]

  const assignments = [
    { nurse: 'Jane Smith', status: 'Assigned to Room 101' },
    { nurse: 'Emily Clark', status: 'Available' },
    { nurse: 'Robert Lee', status: 'Assigned to Room 102' },
  ]

  const nurseOptions = ['John Doe', 'Jane Smith', 'Emily Clark']
  const roomOptions = ['Room 101', 'Room 102', 'Room 103']

  const roomsByNurse = React.useMemo(() => {
    const map: Record<number, number[]> = {}
    for (const a of admissions) {
      if (!map[a.nurse_id]) map[a.nurse_id] = []
      map[a.nurse_id].push(a.room_id)
    }
    for (const nid in map) {
      map[+nid] = Array.from(new Set(map[+nid]))
    }
    return map
  }, [admissions])

  const handleCreateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setCreateFeedback(null)

    const payload = {
      user_id: +form.userId.value,
      department_id: +form.departmentId.value,
      staff_type: form.staffType.value,
      license_number: form.licenseNumber.value,
      employment_status: form.employmentStatus.value,
      date_hired: form.dateHired.value,
      updated_at: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (res.ok) {
        setCreateFeedback({ ok: true, msg: '✔ Created staff' })
        form.reset()
      } else {
        setCreateFeedback({ ok: false, msg: json.error || 'Create failed' })
      }
    } catch {
      setCreateFeedback({ ok: false, msg: 'Unexpected error' })
    }
  }

  const handleUpdateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setUpdateFeedback(null)

    const id = form.staffId.value
    const payload: any = {
      department_id: +form.departmentId.value,
      staff_type: form.staffType.value,
      license_number: form.licenseNumber.value,
      employment_status: form.employmentStatus.value,
    }

    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (res.ok) {
        setUpdateFeedback({ ok: true, msg: '✔ Updated staff' })
        form.reset()
      } else {
        setUpdateFeedback({ ok: false, msg: json.error || 'Update failed' })
      }
    } catch {
      setUpdateFeedback({ ok: false, msg: 'Unexpected error' })
    }
  }

  const [newBilling, setNewBilling] = useState({
    patientId: '', // รหัส patient (string)
    totalPrice: '', // ยอดเงิน (string)
  })
  const [billingFeedback, setBillingFeedback] = useState<{
    ok: boolean
    msg: string
  } | null>(null)

  async function handleCreateBilling(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBillingFeedback(null)

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patient_id: Number(newBilling.patientId),
          total_price: Number(newBilling.totalPrice),
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setBillingFeedback({
          ok: true,
          msg: `✔ Bill created successfully (ID: ${json.bill_id})`,
        })
        setNewBilling({ patientId: '', totalPrice: '' })
        // (ถ้าต้องรีโหลด list bills ก็เรียก fetch ใหม่ที่นี่)
      } else {
        setBillingFeedback({
          ok: false,
          msg: json.error || 'Bill creation failed',
        })
      }
    } catch (err) {
      console.error(err)
      setBillingFeedback({ ok: false, msg: 'An error occurred.  ' })
    }
  }

  async function handleUpdateBilling(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBillingUpdateFeedback(null)

    // เอา ID มาก่อน
    const billId = updateBilling.billId
    if (!billId) return

    try {
      const res = await fetch(`/api/billing/${billId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: updateBilling.status, // ต้องส่งเป็น field "status"
        }),
      })

      const json = await res.json()

      if (res.ok) {
        setBillingUpdateFeedback({ ok: true, msg: `✔ ${json.message}` })
        setUpdateBilling({ billId: '', status: 'Pending' })
        // (ถ้าจะรีโหลด list invoices ก็เรียก load() ใหม่ที่นี่)
      } else {
        setBillingUpdateFeedback({
          ok: false,
          msg: json.error || 'Update failed',
        })
      }
    } catch (err) {
      console.error(err)
      setBillingUpdateFeedback({ ok: false, msg: 'An error occurred.' })
    }
  }

  /* ---------- JSX ---------- */
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {sidebarLinks.map((l) => (
            <a
              key={l.label}
              href="#"
              className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            >
              {l.icon}
              <span className="font-medium">{l.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Content */}
        <main className="flex-1 p-10">
          {/* grid 2 col top */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* left col */}
            <div className="space-y-6">
              {/* Assign Nurse card */}
              <section className="max-w-md bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Assign Nurse</h2>

                <form className="space-y-4" onSubmit={handleAssign}>
                  {/* Admission dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Admission
                    </label>
                    <select
                      name="admissionId"
                      required
                      value={selectedAdm?.admission_id ?? ''}
                      onChange={handleAdmissionChange}
                      className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled hidden>
                        -- Select Admission --
                      </option>
                      {admissions.map((a) => (
                        <option key={a.admission_id} value={a.admission_id}>
                          #{a.admission_id} — Room {a.room_id}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nurse dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nurse
                    </label>
                    <select
                      name="nurseId"
                      required
                      className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled hidden>
                        -- Select Nurse --
                      </option>
                      {nurses.map((n) => (
                        <option key={n.staff_id} value={n.staff_id}>
                          {n.users.first_name} {n.users.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Room display */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Room
                    </label>
                    <input
                      readOnly
                      value={selectedAdm ? `Room #${selectedAdm.room_id}` : ''}
                      placeholder="Choose admission first"
                      className="w-full border px-3 py-2 rounded-md bg-gray-100"
                    />
                  </div>
                  <button
                    disabled={!selectedAdm || isAssigning}
                    className="w-full bg-blue-600 text-white py-2 rounded-md 
                                  hover:bg-blue-700 disabled:opacity-100"
                  >
                    {isAssigning ? 'Assigning…' : 'Assign'}
                  </button>
                </form>

                {feedback && (
                  <p
                    className={`mt-4 text-sm ${feedback.ok ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {feedback.msg}
                  </p>
                )}
              </section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Create Staff (placeholder) */}
                <section className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Create Staff</h2>
                  <form onSubmit={handleCreateStaff} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">User</label>
                      <select
                        name="userId"
                        required
                        className="w-full border rounded p-2"
                      >
                        <option value="" disabled hidden>
                          -- เลือก User --
                        </option>
                        {userList.map((u) => (
                          <option key={u.user_id} value={u.user_id}>
                            {u.first_name} {u.last_name} (#{u.user_id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Department
                      </label>
                      <select
                        name="departmentId"
                        required
                        className="w-full border rounded p-2"
                      >
                        <option value="" disabled hidden>
                          -- Select Department --
                        </option>
                        <option value="1">Cardiology 1</option>
                        <option value="2">Emergency 2</option>
                        <option value="3">Pediatrics 3</option>
                        <option value="4">Neurology 4</option>
                        <option value="5">Orthopedics 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Staff Type
                      </label>
                      <select
                        name="staffType"
                        required
                        className="w-full border rounded p-2"
                      >
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Pharmacist">Pharmacist</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        License #
                      </label>
                      <input
                        name="licenseNumber"
                        type="text"
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Employment Status
                      </label>
                      <select
                        name="employmentStatus"
                        required
                        className="w-full border rounded p-2"
                      >
                        <option value="Active">Active</option>
                        <option value="On_Leave">On Leave</option>
                        <option value="Resigned">Resigned</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Date Hired
                      </label>
                      <input
                        name="dateHired"
                        type="date"
                        required
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Create
                    </button>
                    {createFeedback && (
                      <p
                        className={`mt-2 text-sm ${createFeedback.ok ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {createFeedback.msg}
                      </p>
                    )}
                  </form>
                </section>
                {/* Update Staff */}
                <section className="bg-white rounded-lg shadow p-6 justify-self-start md:justify-self-end">
                  <h2 className="text-xl font-semibold mb-4">Update Staff</h2>
                  <form onSubmit={handleUpdateStaff} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Select Staff
                      </label>
                      <select
                        name="staffId"
                        value={updateData.staffId}
                        onChange={handleStaffSelectChange}
                        className="w-full border rounded p-2"
                      >
                        <option value="" disabled hidden>
                          -- Select Staff --
                        </option>
                        {staffList.map((s) => (
                          <option key={s.staff_id} value={s.staff_id}>
                            {s.users.first_name} {s.users.last_name} (#
                            {s.staff_id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Department
                      </label>
                      <select
                        name="departmentId"
                        value={updateData.departmentId}
                        onChange={(e) =>
                          setUpdateData((d) => ({
                            ...d,
                            departmentId: e.target.value,
                          }))
                        }
                        className="w-full border rounded p-2"
                      >
                        <option value="" disabled hidden>
                          -- Select Department --
                        </option>
                        <option value="1">Cardiology 1</option>
                        <option value="2">Emergency 2</option>
                        <option value="3">Pediatrics 3</option>
                        <option value="4">Neurology 4</option>
                        <option value="5">Orthopedics 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Staff Type
                      </label>
                      <select
                        name="staffType"
                        value={updateData.staffType}
                        onChange={(e) =>
                          setUpdateData((d) => ({
                            ...d,
                            staffType: e.target.value,
                          }))
                        }
                        className="w-full border rounded p-2"
                      >
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Pharmacist">Pharmacist</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        License #
                      </label>
                      <input
                        name="licenseNumber"
                        type="text"
                        value={updateData.licenseNumber}
                        onChange={(e) =>
                          setUpdateData((d) => ({
                            ...d,
                            licenseNumber: e.target.value,
                          }))
                        }
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Employment Status
                      </label>
                      <select
                        name="employmentStatus"
                        value={updateData.employmentStatus}
                        onChange={(e) =>
                          setUpdateData((d) => ({
                            ...d,
                            employmentStatus: e.target.value,
                          }))
                        }
                        className="w-full border rounded p-2"
                      >
                        <option value="Active">Active</option>
                        <option value="On_Leave">On Leave</option>
                        <option value="Resigned">Resigned</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                    {updateFeedback && (
                      <p
                        className={`mt-2 text-sm ${updateFeedback.ok ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {updateFeedback.msg}
                      </p>
                    )}
                  </form>
                </section>
              </div>
            </div>

            {/* right col */}
            <div className="space-y-6">
              {/* Nurse assignment status card */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Nurse Assignment Status
                </h2>
                <ul className="space-y-4">
                  {nurses.map((nurse) => {
                    const rooms = roomsByNurse[nurse.staff_id] || []
                    return (
                      <li
                        key={nurse.staff_id}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-700">
                          {nurse.users.first_name} {nurse.users.last_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {rooms.length > 0
                            ? `Assigned to room${rooms.length > 1 ? 's' : ''} ${rooms.join(', ')}`
                            : 'Available'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </div>
          </div>

          {/* grid create / update billing */}
          <div className="grid md:grid-cols-2 gap-y-10 md:gap-x-10 mt-16">
            {/* Create Billing */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">
                Create Billing for the patient
              </h2>
              <form onSubmit={handleCreateBilling} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Patient
                  </label>
                  <select
                    name="patientId"
                    value={newBilling.patientId}
                    onChange={(e) =>
                      setNewBilling((b) => ({
                        ...b,
                        patientId: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      -- Select Patient --
                    </option>
                    {patients.map((p) => (
                      <option key={p.patient_id} value={p.patient_id}>
                        {p.users.first_name} {p.users.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Price
                  </label>
                  <input
                    name="amount"
                    type="number"
                    value={newBilling.totalPrice}
                    onChange={(e) =>
                      setNewBilling((b) => ({
                        ...b,
                        totalPrice: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Create Billing
                </button>
                {billingFeedback && (
                  <p
                    className={`mt-4 text-sm ${billingFeedback.ok ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {billingFeedback.msg}
                  </p>
                )}
              </form>
            </section>

            {/* Update Billing */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Update Billing Status
              </h2>
              <form onSubmit={handleUpdateBilling} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Invoice</label>
                  <select
                    value={updateBilling.billId}
                    onChange={(e) =>
                      setUpdateBilling((b) => ({
                        ...b,
                        billId: e.target.value,
                      }))
                    }
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="" disabled>
                      -- Select Invoice --
                    </option>
                    {invoices.map((i) => (
                      <option key={i.bill_id} value={i.bill_id}>
                        INV-{i.bill_id.toString().padStart(3, '0')} —{' '}
                        {i.patient_name} ({i.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    New Status
                  </label>
                  <select
                    value={updateBilling.status}
                    onChange={(e) =>
                      setUpdateBilling((b) => ({
                        ...b,
                        status: e.target.value,
                      }))
                    }
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Canceled">Cancelled(Invalid status)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Update Status
                </button>
                {billingUpdateFeedback && (
                  <p
                    className={`mt-2 text-sm ${billingUpdateFeedback.ok ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {billingUpdateFeedback.msg}
                  </p>
                )}
              </form>
            </section>
            {/* Add Billing Item */}
            <section className="bg-white rounded-lg shadow p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Add Billing Item</h2>
              <form onSubmit={handleAddItem} className="space-y-4">
                {/* เลือก Invoice */}
                <div>
                  <label className="block text-sm font-medium">Invoice</label>
                  <select
                    required
                    value={newItem.billId}
                    onChange={(e) =>
                      setNewItem((i) => ({ ...i, billId: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="" disabled>
                      -- Select Invoice --
                    </option>
                    {invoices.map((i) => (
                      <option key={i.bill_id} value={i.bill_id}>
                        INV-{i.bill_id.toString().padStart(3, '0')} —{' '}
                        {i.patient_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ประเภท item */}
                <div>
                  <label className="block text-sm font-medium">Item Type</label>
                  <select
                    required
                    value={newItem.itemType}
                    onChange={(e) =>
                      setNewItem((i) => ({ ...i, itemType: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="Medicine">Medicine</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Room">Room</option>
                  </select>
                </div>

                {/* รหัส item (ID จากตาราง medicine/treatment/room) */}
                <div>
                  <label className="block text-sm font-medium">Item ID</label>
                  <input
                    type="number"
                    required
                    value={newItem.itemIdRef}
                    onChange={(e) =>
                      setNewItem((i) => ({ ...i, itemIdRef: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>

                {/* คำอธิบาย */}
                <div>
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem((i) => ({ ...i, description: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>

                {/* จำนวน */}
                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem((i) => ({ ...i, quantity: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>

                {/* ราคาต่อหน่วย */}
                <div>
                  <label className="block text-sm font-medium">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newItem.unitPrice}
                    onChange={(e) =>
                      setNewItem((i) => ({ ...i, unitPrice: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Add Item
                </button>

                {itemFeedback && (
                  <p
                    className={`mt-2 text-sm ${itemFeedback.ok ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {itemFeedback.msg}
                  </p>
                )}
              </form>
            </section>
          </div>

          {/* Billing table (demo) */}
          <section className="bg-white rounded-lg shadow p-6 mt-10">
            <h2 className="text-xl font-semibold mb-4">
              Billings for the Patient
            </h2>

            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Invoice</th>
                  <th className="py-2 px-4 text-left">Patient</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.bill_id} className="border-b">
                    <td className="py-2 px-4">
                      INV-{i.bill_id.toString().padStart(3, '0')}
                    </td>
                    <td className="py-2 px-4">{i.patient_name}</td>
                    <td className="py-2 px-4">
                      {/* ถ้าชื่อฟิลด์ใน API ของคุณคือ total_price */}$
                      {i.total_price?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          i.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : i.status === 'Cancelled'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {i.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  )
}
