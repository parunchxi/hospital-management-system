'use client'

import React, { useState, useEffect } from 'react'
import PatientInfoCard from '@/components/patient/patient-info-card'
import AppointmentCalendarCard from '@/components/patient/appointment-calendar-card'
import UpcomingAppointmentsTable from '@/components/patient/upcoming-appointments-table'
import BillingSummaryTable from '@/components/patient/billing-summary-table'
import SummaryStatsCard from '@/components/patient/summary-stats-card'

export default function PatientDashboard() {
  interface PatientProfile {
    blood_type: string
    emergency_contact_id: number | null
    users: {
      address: string
      last_name: string
      first_name: string
      national_id: number
      phone_number: string
      date_of_birth: string
    }
  }

  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null,
  )
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientResponse, appointmentsResponse] = await Promise.all([
          fetch('/api/patients/me'),
          fetch('/api/appointments'),
        ])

        if (!patientResponse.ok) {
          throw new Error('Failed to fetch patient profile')
        }
        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments')
        }

        const patientData = await patientResponse.json()
        const appointmentsData = await appointmentsResponse.json()

        setPatientProfile(patientData)
        setAppointments(appointmentsData)
      } catch (err) {
        setError('An error occurred while fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Failed to load data: {error}</div>

  const billing = [
    { id: '1', amount: '$120.00', status: 'Paid' as 'Paid' },
    { id: '2', amount: '$80.00', status: 'Pending' as 'Pending' },
  ]

  return (
    <div className="flex flex-col w-full gap-4 px-4 py-10 container mx-auto @container">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {patientProfile?.users?.first_name || 'John Doe'}
        </h1>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PatientInfoCard patientProfile={patientProfile} />
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
