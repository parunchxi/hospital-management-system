'use client'

import React from 'react'
import PatientInfoCard from '@/components/patient/patient-info-card'
import AppointmentCalendarCard from '@/components/patient/appointment-calendar-card'
import UpcomingAppointmentsTable from '@/components/patient/upcoming-appointments-table'
import BillingSummaryTable from '@/components/patient/billing-summary-table'
import SummaryStatsCard from '@/components/patient/summary-stats-card'

export default function PatientDashboard() {
  const appointments: {
    date: string
    time: string
    doctor: string
    status: 'Paid' | 'Pending'
  }[] = [
    {
      date: '2025-05-15',
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      status: 'Paid',
    },
    {
      date: '2025-06-01',
      time: '2:30 PM',
      doctor: 'Dr. Lee',
      status: 'Pending',
    },
  ]

  const billing: { id: string; amount: string; status: 'Paid' | 'Pending' }[] =
    [
      { id: 'INV-001', amount: '$120.00', status: 'Paid' },
      { id: 'INV-002', amount: '$80.00', status: 'Pending' },
    ]

  return (
    <div className="flex flex-col w-full gap-4 px-4 py-10 container mx-auto @container">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, John Doe</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PatientInfoCard />
        <AppointmentCalendarCard />
        <UpcomingAppointmentsTable appointments={appointments} />
      </section>

      <section className="hidden sm:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryStatsCard appointments={appointments} billing={billing} />
      </section>

      <BillingSummaryTable billing={billing} />
    </div>
  )
}
