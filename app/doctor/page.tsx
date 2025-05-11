'use client'

import React, { useState } from 'react'
import { PatientDetailsDialog } from '@/components/doctor/patient-details-dialog'
import AppointmentsTable from '@/components/doctor/AppointmentsTable'
import MedicineStockTable from '@/components/doctor/MedicineStockTable'
import RoomAvailabilityTable from '@/components/doctor/FreeRooms'
import DoctorInfoCard from '@/components/doctor/DoctorInfo'
import DoctorCalendar from '@/components/doctor/Calendar'
import FloatingActionMenu from '@/components/doctor/FloatingActionMenu'

// Define proper interface for patient records
interface PatientRecord {
  id: string;
  name: string;
  // Add other patient properties as needed
  [key: string]: any; // For any additional properties
}

export default function DoctorDashboard() {
  const [patientDetailsOpen, setPatientDetailsOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)

  // Function to handle row click from AppointmentsTable
  const handlePatientSelect = (patient: PatientRecord) => {
    setSelectedPatient(patient)
    setPatientDetailsOpen(true)
  }

  return (
    <>
      <main className="flex flex-col w-full gap-4 px-4 py-10 container mx-auto @container">
        <header className="flex flex-wrap items-center justify-between gap-4" role="banner">
          <h1 className="text-3xl font-bold tracking-tight">
            👋 Hello, Dr. <DoctorInfoCard type="name" />!
          </h1>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Dashboard content">
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <section aria-labelledby="appointments-heading">
              <h2 id="appointments-heading" className="sr-only">Appointments</h2>
              <AppointmentsTable onRowClick={handlePatientSelect} />
            </section>
            
            <section aria-labelledby="medicine-heading">
              <h2 id="medicine-heading" className="sr-only">Medicine Stock</h2>
              <MedicineStockTable />
            </section>
            
            <section aria-labelledby="rooms-heading">
              <h2 id="rooms-heading" className="sr-only">Room Availability</h2>
              <RoomAvailabilityTable />
            </section>
          </div>
          
          <aside className="grid grid-cols-1 gap-6">
            <DoctorInfoCard />
            <DoctorCalendar />
          </aside>
        </section>

        <PatientDetailsDialog 
          open={patientDetailsOpen} 
          onOpenChange={setPatientDetailsOpen} 
          patient={selectedPatient} 
        />
      </main>
      
      <FloatingActionMenu />
    </>
  )
}
