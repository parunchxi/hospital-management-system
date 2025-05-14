'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Home, Users, Pill, CreditCard, FileText, Search } from 'lucide-react'
import AssignNurseSection from '../../components/admin/assign-nurse'
import CreateStaffSection from '../../components/admin/create-staff'
import UpdateStaffSection from '../../components/admin/update-staff'
import NurseAssignmentStatusSection from '../../components/admin/nurse-status'
import CreateBillingSection from '../../components/admin/create-billing'
import UpdateBillingSection from '../../components/admin/update-billing'
import AddBillingItemSection from '../../components/admin/add-billing'
import BillingTableSection from '../../components/admin/billing-table-section'

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

  const [invoices, setInvoices] = useState<
    {
      total_price: any
      bill_id: number
      patient_name: string
      status: string
    }[]
  >([])

  const [updateBilling, setUpdateBilling] = useState({
    billId: '',
    status: 'Pending',
  })
  const [billingUpdateFeedback, setBillingUpdateFeedback] = useState<{
    ok: boolean
    msg: string
  } | null>(null)

  const [newItem, setNewItem] = useState({
    billId: '',
    itemType: 'Medicine',
    itemIdRef: '',
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
        setNewItem({
          billId: '',
          itemType: 'Medicine',
          itemIdRef: '',
          description: '',
          quantity: '',
          unitPrice: '',
        })
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
    fetch('/api/staff', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.data
        setStaffList(list)
      })
      .catch(console.error)
    fetch('/api/admin/user', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
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
      user_id: form.userId.value,
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
    patientId: '',
    totalPrice: '',
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
          status: updateBilling.status, // send as field "status"
        }),
      })

      const json = await res.json()

      if (res.ok) {
        setBillingUpdateFeedback({ ok: true, msg: `✔ ${json.message}` })
        setUpdateBilling({ billId: '', status: 'Pending' })
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
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-10">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AssignNurseSection
                nurses={nurses}
                admissions={admissions}
                selectedAdm={selectedAdm}
                isAssigning={isAssigning}
                feedback={feedback}
                handleAssign={handleAssign}
                handleAdmissionChange={handleAdmissionChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <CreateStaffSection
                  userList={userList}
                  createFeedback={createFeedback}
                  handleCreateStaff={handleCreateStaff}
                />
                <UpdateStaffSection
                  staffList={staffList}
                  updateData={updateData}
                  updateFeedback={updateFeedback}
                  handleUpdateStaff={handleUpdateStaff}
                  handleStaffSelectChange={handleStaffSelectChange}
                  setUpdateData={setUpdateData}
                />
              </div>
            </div>
            <div className="space-y-6">
              <NurseAssignmentStatusSection
                nurses={nurses}
                roomsByNurse={roomsByNurse}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-y-10 md:gap-x-10 mt-16">
            <CreateBillingSection
              patients={patients}
              newBilling={newBilling}
              billingFeedback={billingFeedback}
              setNewBilling={setNewBilling}
              handleCreateBilling={handleCreateBilling}
            />
            <UpdateBillingSection
              invoices={invoices}
              updateBilling={updateBilling}
              billingUpdateFeedback={billingUpdateFeedback}
              setUpdateBilling={setUpdateBilling}
              handleUpdateBilling={handleUpdateBilling}
            />
            <AddBillingItemSection
              invoices={invoices}
              newItem={newItem}
              itemFeedback={itemFeedback}
              setNewItem={setNewItem}
              handleAddItem={handleAddItem}
            />
          </div>
          <BillingTableSection invoices={invoices} />
        </main>
      </div>
    </div>
  )
}
