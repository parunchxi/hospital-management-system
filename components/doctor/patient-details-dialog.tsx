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
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  Activity,
  Droplet,
  Heart,
  Clock,
  CircleCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import AdmissionDetails from './admission-details'

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Record</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Full Name</span>
                      <span className="font-medium">
                        {patientInfo.users?.first_name} {patientInfo.users?.last_name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Date of Birth</span>
                      <span className="font-medium flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {patientInfo.users?.date_of_birth ? new Date(patientInfo.users?.date_of_birth).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Blood Type</span>
                      <span className="font-medium flex items-center gap-1">
                        <Droplet className="h-3.5 w-3.5 text-muted-foreground" />
                        {patientInfo.blood_type || "Not recorded"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Phone Number</span>
                      <span className="font-medium flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {patientInfo.users?.phone_number || "Not provided"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">National ID</span>
                      <span className="font-medium">
                        {patientInfo.users?.national_id || "Not provided"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Address</span>
                      <span className="font-medium flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {patientInfo.users?.address || "Not provided"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Visit History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientInfo.medical_records && patientInfo.medical_records.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {patientInfo.medical_records.map((record, index) => (
                          <div key={index} className="p-3 text-sm">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{new Date(record.visit_date).toLocaleDateString()}</span>
                              </div>
                              <Badge variant={record.visit_status === "Completed" ? "success" : "default"}>
                                {record.visit_status}
                              </Badge>
                            </div>
                            {record.doctor_id?.users && (
                              <div className="text-muted-foreground mt-1">
                                Dr. {record.doctor_id.users.first_name} {record.doctor_id.users.last_name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No medical records found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
