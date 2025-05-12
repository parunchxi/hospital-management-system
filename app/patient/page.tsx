'use client'

import React, { useState, useEffect, useCallback } from 'react'
import PatientInfoCard from '@/components/patient/patient-info-card'
import AppointmentCalendarCard from '@/components/patient/appointment-calendar-card'
import UpcomingAppointmentsTable from '@/components/patient/upcoming-appointments-table'
import BillingSummaryTable from '@/components/patient/billing-summary-table'
import SummaryStatsCard from '@/components/patient/summary-stats-card'
import { Skeleton } from '@/components/ui/skeleton'

function SkeletonLoader() {
  return (
    <div className="flex flex-col w-full gap-4 px-4 py-10 container mx-auto @container">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-1/3" />
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <div className="hidden sm:grid gap-4 md:grid-cols-2 col-span-2">
          <Skeleton className="h-40" />
        </div>
      </section>
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  )
}

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
  const [billing, setBilling] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [patientResponse, appointmentsResponse, billingResponse] =
        await Promise.all([
          fetch('/api/patients/me'),
          fetch('/api/appointments'),
          fetch('/api/billing/patient/me'),
        ])

      if (!patientResponse.ok) {
        throw new Error('Failed to fetch patient profile')
      }
      if (!appointmentsResponse.ok) {
        throw new Error('Failed to fetch appointments')
      }

      const patientData = await patientResponse.json()
      const appointmentsData = await appointmentsResponse.json()
      const billingData = await billingResponse.json()

      setPatientProfile(patientData)
      setAppointments(appointmentsData)
      setBilling(billingData)
    } catch (err) {
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return <SkeletonLoader />
  }

  if (error) return <div>Failed to load data: {error}</div>

  return (
    <div className="flex flex-col w-full gap-4 px-4 py-10 container mx-auto @container">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {patientProfile?.users?.first_name || 'John Doe'}
        </h1>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PatientInfoCard
          patientProfile={patientProfile}
          refreshData={fetchData}
        />
        <AppointmentCalendarCard appointments={appointments} />
        <section className="hidden sm:grid gap-4 md:grid-cols-2 col-span-2">
          <SummaryStatsCard appointments={appointments} billing={billing} />
        </section>
      </section>

      <UpcomingAppointmentsTable appointments={appointments} />
      <BillingSummaryTable billing={billing} appointments={appointments} />
    </div>
  )
}
