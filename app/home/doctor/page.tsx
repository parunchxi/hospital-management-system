'use client'

import React, { useState } from 'react'
import { PatientDetailsDialog } from '@/components/doctor/patient-details-dialog'
import AppointmentsTable from '../../../components/doctor/AppointmentsTable'
import MedicineStockTable from '../../../components/doctor/MedicineStockTable'
import RoomAvailabilityTable from '../../../components/doctor/FreeRooms'
import DoctorInfoCard from '../../../components/doctor/DoctorInfo'
import DoctorCalendar from '../../../components/doctor/Calendar'
import FloatingActionMenu from '../../../components/doctor/FloatingActionMenu'

const DoctorDashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  // Function to handle row click from AppointmentsTable
  const handleRowClick = (patient: any) => {
    setSelectedPatient(patient)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-light-blue-50 p-6 mb-35">
      <h1 className="text-2xl font-bold mb-6">
        👋 Hello, Dr. <DoctorInfoCard type="name" />!
      </h1>
      <div className="w-full max-h-10xl overflow-shown mb-35">
        {/* <pre>{JSON.stringify(selectedPatient, null, 2)}</pre> */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 grid grid-cols-1 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
            <AppointmentsTable onRowClick={handleRowClick} />
            <MedicineStockTable />
            <RoomAvailabilityTable />
          </div>
          <div className="col-span-4 grid grid-cols-1 gap-6">
            <DoctorInfoCard />
            <DoctorCalendar />
          </div>
        </div>
      </div>
      <PatientDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} patient={selectedPatient} />
      <FloatingActionMenu />
    </div>
  )
}

export default DoctorDashboard
