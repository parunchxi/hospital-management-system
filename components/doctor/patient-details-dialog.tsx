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
  User,
} from 'lucide-react'
import AdmissionDetails from './admission-details'
import PatientPersonalInfo from './patient-personal-info'
import PatientMedicalRecords from './patient-medical-records'

interface MedicalRecord {
  record_id?: string
  visit_date: string
  visit_status: string
  patient_status: string
  doctor_id: number | {
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
  treatment_plan?: string
  medicine_prescribed?: string
}

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
  medical_records?: MedicalRecord[]
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

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setPatientInfo(null)
      setError(null)
    }
  }, [open]);

  // Fetch patient data when dialog opens
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
  }, [open, patient])

  if (!patient) return null

  // Prepare medical records with proper typing for the PatientMedicalRecords component
  const preparedMedicalRecords = patientInfo?.medical_records?.map(record => ({
    ...record,
    // Ensure doctor_id is a number as expected by PatientMedicalRecords
    doctor_id: typeof record.doctor_id === 'number' ? record.doctor_id : -1,
  })) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            Patient Information
          </DialogTitle>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2" aria-live="polite">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading patient details...
              </div>
            </div>
          ) : error ? (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-destructive" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" aria-hidden="true" />
                <span>Patient ID: {patientInfo?.patient_id || "Unknown"}</span>
              </div>
            </div>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8" aria-live="polite">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" aria-hidden="true" />
            <p>Loading patient information...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 text-destructive py-8 bg-destructive/10 rounded-md p-3" role="alert">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            <p>Failed to load patient data: {error}</p>
          </div>
        ) : patientInfo ? (
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Record</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <PatientPersonalInfo patientInfo={patientInfo} />
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <PatientMedicalRecords medicalRecords={preparedMedicalRecords} />
            </TabsContent>

            <TabsContent value="admission" className="space-y-4 mt-4">
              <AdmissionDetails
                patientId={patient.patient_id}
                visitDate={patient.visit_date}
              />
            </TabsContent>
          </Tabs>
        ) : null}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            aria-label="Close patient details dialog"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
