'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Patient {
  id?: string
  record_id?: string
  patient_id?: string
  visit_date?: string
  symptoms?: string
  roomNumber?: string
  patients?: {
    patient_id?: string
    users?: any
  }
  users?: {
    first_name: string
    last_name: string
    date_of_birth: string
    phone_number: string
    address: string
    national_id: string
  }
  blood_type?: string
  medical_records?: Array<{
    visit_date: string
    visit_status: string
    doctor_id?: {
      users?: {
        first_name: string
        last_name: string
      }
    }
  }>
}

interface PatientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
}

export function PatientDetailsDialog({
  open,
  onOpenChange,
  patient,
}: PatientDetailsDialogProps) {
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatientData() {
      if (!open || !patient) {
        return
      }

      // Determine which ID to use
      const patientId = patient.patient_id ||
                        patient.patients?.patient_id ||
                        patient.id ||
                        patient.record_id

      if (!patientId) {
        setError("Cannot find patient ID")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/patients/${patientId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch patient data: ${response.status}`)
        }

        const data = await response.json()
        setPatientInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Error fetching patient data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatientData()

    // Clean up state when dialog closes
    return () => {
      if (!open) {
        setPatientInfo(null)
        setError(null)
      }
    }
  }, [open, patient])

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Patient Information</DialogTitle>
          <DialogDescription>
            {isLoading ? "Loading patient details..." :
              error ? `Error: ${error}` :
              `Patient ID: ${patientInfo?.patient_id || "Unknown"}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">Loading patient information...</div>
        ) : error ? (
          <div className="text-red-500 py-4">Failed to load patient data: {error}</div>
        ) : patientInfo ? (
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Record</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Name</h3>
                  <p className="text-sm">
                    {patientInfo.users?.first_name} {patientInfo.users?.last_name}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Date of Birth</h3>
                  <p className="text-sm">
                    {patientInfo.users?.date_of_birth ?
                      new Date(patientInfo.users.date_of_birth).toLocaleDateString() :
                      'Not available'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">National ID</h3>
                  <p className="text-sm">
                    {patientInfo.users?.national_id || 'Not available'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Blood Type</h3>
                  <p className="text-sm">
                    {patientInfo.blood_type || 'Not available'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Contact Number</h3>
                  <p className="text-sm">
                    {patientInfo.users?.phone_number || 'Not available'}
                  </p>
                </div>

                <div className="space-y-2 col-span-2">
                  <h3 className="font-medium">Address</h3>
                  <p className="text-sm">
                    {patientInfo.users?.address || 'Not available'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Medical History</h3>
                {patientInfo.medical_records && patientInfo.medical_records.length > 0 ? (
                  <div className="space-y-3">
                    {patientInfo.medical_records.map((record, index) => (
                      <div key={index} className="p-2 border rounded">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs font-medium">Visit Date</p>
                            <p className="text-sm">{new Date(record.visit_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium">Status</p>
                            <p className="text-sm">{record.visit_status}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-medium">Doctor</p>
                            <p className="text-sm">
                              {record.doctor_id?.users?.first_name} {record.doctor_id?.users?.last_name || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No medical records available for this patient.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="admission" className="space-y-4 mt-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Current Admission</h3>
                {patient.visit_date || patient.roomNumber || patient.symptoms ? (
                  <div className="grid grid-cols-2 gap-4">
                    {patient.visit_date && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Check-in Date</p>
                        <p className="text-sm">{new Date(patient.visit_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    {patient.roomNumber && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Room Number</p>
                        <p className="text-sm">{patient.roomNumber}</p>
                      </div>
                    )}
                    {patient.symptoms && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Symptoms</p>
                        <p className="text-sm">{patient.symptoms}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No admission details available for this patient.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
