'use client'

import React, { useState, useEffect } from 'react'
import { PatientDetailsDialog } from '@/components/nurse/patient-details-dialog'
import AssignedPatientsTable from '@/components/nurse/AssignedPatientsTable'
import NurseInfoCard from '@/components/nurse/NurseInfo'

export default function NurseDashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [nurseName, setNurseName] = useState<string>('')

  useEffect(() => {
    // Fetch nurse name for greeting
    fetch('/api/staff/me')
      .then((res) => {
        if (res.ok) return res.json()
        return { users: { first_name: 'Nurse' } }
      })
      .then((data) => {
        setNurseName(data.users?.first_name || 'Nurse')
      })
      .catch((err) => {
        console.error('Error fetching nurse info:', err)
      })
  }, [])

  // Function to handle row click from AssignedPatientsTable
  const handleRowClick = (patient: any) => {
    setSelectedPatient(patient)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="flex flex-col w-full gap-4 px-4 py-10 container mx-auto @container">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            👋 Hello, {nurseName}!
          </h1>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <AssignedPatientsTable onRowClick={handleRowClick} />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <NurseInfoCard />
          </div>
        </section>

        <PatientDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          patient={selectedPatient}
        />
      </div>
    </>
  )
}
