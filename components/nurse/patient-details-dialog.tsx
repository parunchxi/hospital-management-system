'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import PatientPersonalInfo from './patient-personal-info'
import PatientMedicalRecords from './patient-medical-records'

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
    record_id?: string
    visit_date: string
    visit_status: string
    doctor_id?: {
      users?: {
        first_name: string
        last_name: string
      }
    }
    diagnosis?: string
    treatment?: string
    notes?: string
    symptoms?: string
    prescription?: string
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

  // Function to transform medical records to match expected format
  const transformMedicalRecords = (records?: Array<any>) => {
    if (!records) return undefined;
    return records.map(record => ({
      ...record,
      // Add missing fields with default values
      patient_status: record.patient_status || 'Unknown',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
      symptoms: record.symptoms || '',
      prescription: record.prescription || ''
    }));
  };

  useEffect(() => {
    async function fetchPatientData() {
      if (!open || !patient) {
        return
      }

      const patientId = patient.patient_id;

      if (!patientId) {
        console.error("Cannot find patient ID in:", patient);
        setError("Cannot find patient ID in appointment data")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Fetch patient data
        const patientResponse = await fetch(`/api/patients/${patientId}`)

        if (!patientResponse.ok) {
          throw new Error(`Failed to fetch patient data: ${patientResponse.status}`)
        }

        const patientData = await patientResponse.json()
        setPatientInfo(patientData)
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
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Patient Information
          </DialogTitle>
          <DialogDescription>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading patient details...
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : (
              <span>Patient ID: {patientInfo?.patient_id || "Unknown"}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
            Loading patient information...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 text-destructive py-8">
            <AlertCircle className="h-5 w-5" />
            Failed to load patient data: {error}
          </div>
        ) : patientInfo ? (
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Record</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <PatientPersonalInfo patientInfo={patientInfo} />
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <PatientMedicalRecords 
                medicalRecords={transformMedicalRecords(patientInfo.medical_records)} 
              />
            </TabsContent>

          </Tabs>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
