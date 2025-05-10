'use client'

import React, { useState } from 'react'
import { PatientDetailsDialog } from '@/components/doctor/patient-details-dialog'
import AppointmentsTable from '@/components/doctor/AppointmentsTable'
import MedicineStockTable from '@/components/doctor/MedicineStockTable'
import RoomAvailabilityTable from '@/components/doctor/FreeRooms'
import DoctorInfoCard from '@/components/doctor/DoctorInfo'
import DoctorCalendar from '@/components/doctor/Calendar'
import FloatingActionMenu from '@/components/doctor/FloatingActionMenu'

export default function DoctorDashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // Function to handle row click from AppointmentsTable
  const handleRowClick = (record: any) => {
    setSelectedRecord(record)
    setDialogOpen(true)
  }
  return (
    <>
      <div className="flex flex-col w-full gap-4 px-4 py-10 container mx-auto @container">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            👋 Hello, Dr. <DoctorInfoCard type="name" />!
          </h1>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <AppointmentsTable onRowClick={handleRowClick} />
            <MedicineStockTable />
            <RoomAvailabilityTable />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <DoctorInfoCard />
            <DoctorCalendar />
          </div>
        </section>

        <PatientDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} patient={selectedRecord} />
      </div>
      {/* FloatingActionMenu rendered outside main container for proper positioning */}
      <FloatingActionMenu />
    </>
  )
}
