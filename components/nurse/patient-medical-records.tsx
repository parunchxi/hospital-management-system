'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Clock,
  Stethoscope,
  Heart,
  Pill,
  FileText,
  X,
  Loader2,
  Calendar,
  User,
  AlertCircle,
} from 'lucide-react'
import { ButtonIcon } from '@/components/ui/editBtn'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MedicalRecord {
  record_id?: string | number
  patient_id?: number
  visit_date: string
  patient_status: string
  visit_status: string
  doctor_id: number
  diagnosis?: string
  treatment?: string
  notes?: string
  symptoms?: string
  prescription?: string
  treatment_plan?: string
  medicine_prescribed?: string
  created_at?: string
  updated_at?: string
  follow_up_date?: string
  medical_staff?: {
    users?: {
      first_name: string
      last_name: string
    }
  }
}

interface PatientMedicalRecordsProps {
  medicalRecords: MedicalRecord[] | undefined
}

// Helper functions extracted for cleaner component code
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    return dateString;
  }
}

const getStatusVariant = (status: string) => {
  if (!status) return 'default';
  
  const statusLower = status.toLowerCase();
  if (statusLower === 'completed') return 'success';
  if (statusLower === 'scheduled') return 'secondary';
  if (statusLower === 'cancelled') return 'destructive';
  return 'default';
}

const getDoctorName = (record: MedicalRecord) => {
  if (record.medical_staff?.users) {
    return `Dr. ${record.medical_staff.users.first_name} ${record.medical_staff.users.last_name}`;
  }
  return typeof record.doctor_id === 'number' ? `Doctor ID: ${record.doctor_id}` : 'Unknown Doctor';
}

// Extracted component for record details
function RecordDetails({ 
  record, 
  isLoading, 
  error, 
  onClose
}: { 
  record: MedicalRecord, 
  isLoading: boolean, 
  error: string | null,
  onClose: () => void,
}) {
  return (
    <Card className="mb-4 border border-primary/20 shadow-md">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">
              Medical Record Details
            </CardTitle>
            <CardDescription>
              {formatDate(record.visit_date)} -{' '}
              <Badge variant={getStatusVariant(record.visit_status)}>{record.visit_status}</Badge>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close record details"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4" aria-live="polite">
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" aria-hidden="true" />
            <p>Loading record details...</p>
          </div>
        ) : error ? (
          <div className="text-destructive bg-destructive/10 p-3 rounded-md flex items-center gap-2" role="alert">
            <AlertCircle className="h-4 w-4" />
            <p>Error: {error}</p>
          </div>
        ) : (
          <Tabs defaultValue="details">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="treatment">Treatment & Medication</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  Attending Doctor
                </h4>
                <p className="p-2 bg-muted/20 rounded-md">
                  {getDoctorName(record)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                  Patient Status
                </h4>
                <p className="p-2 bg-muted/20 rounded-md">
                  {record.patient_status || 'Not specified'}
                </p>
              </div>

              {record.symptoms && (
                <div>
                  <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                    Symptoms
                  </h4>
                  <p className="p-2 bg-muted/20 rounded-md">{record.symptoms}</p>
                </div>
              )}

              {record.diagnosis && (
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
                    Diagnosis
                  </h4>
                  <p className="p-2 bg-muted/20 rounded-md">{record.diagnosis}</p>
                </div>
              )}
              
              {record.created_at && (
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Record Created
                  </h4>
                  <p className="text-xs text-muted-foreground">{formatDate(record.created_at)}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="treatment" className="space-y-4 pt-4">
              {(record.treatment || record.treatment_plan) && (
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                    Treatment
                  </h4>
                  <p className="p-2 bg-muted/20 rounded-md">
                    {record.treatment || record.treatment_plan}
                  </p>
                </div>
              )}

              {(record.prescription || record.medicine_prescribed) && (
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                    <Pill className="h-3.5 w-3.5" aria-hidden="true" />
                    Prescription
                  </h4>
                  <p className="p-2 bg-muted/20 rounded-md">
                    {record.prescription || record.medicine_prescribed}
                  </p>
                </div>
              )}

              {record.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Notes
                  </h4>
                  <p className="p-2 bg-muted/20 rounded-md">{record.notes}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

    </Card>
  )
}

export function PatientMedicalRecords({ medicalRecords }: PatientMedicalRecordsProps) {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoadingRecord, setIsLoadingRecord] = useState(false)
  const [recordError, setRecordError] = useState<string | null>(null)

  const fetchRecordDetails = async (recordId: string | number) => {
    setIsLoadingRecord(true)
    setRecordError(null)

    try {
      const response = await fetch(`/api/records/${recordId}`)

      if (!response.ok) {
        throw new Error(`Error fetching record: ${response.status}`)
      }

      const recordData = await response.json()
      setSelectedRecord({
        ...recordData,
        treatment: recordData.treatment_plan || recordData.treatment,
        prescription: recordData.medicine_prescribed || recordData.prescription,
      })
    } catch (error) {
      console.error('Failed to fetch record details:', error)
      setRecordError(
        error instanceof Error ? error.message : 'Failed to load record details'
      )
    } finally {
      setIsLoadingRecord(false)
    }
  }

  const handleRecordClick = (record: MedicalRecord) => {
    if (record.record_id) {
      setSelectedRecord(record)
      fetchRecordDetails(record.record_id)
    } else {
      setSelectedRecord(record)
      setRecordError('Record ID is missing, cannot fetch details')
    }
  }


  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
          Visit History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedRecord && (
            <RecordDetails 
              record={selectedRecord}
              isLoading={isLoadingRecord}
              error={recordError}
              onClose={() => setSelectedRecord(null)}
            />
          )}

          <div role="region" aria-label="Medical records list">
            {medicalRecords && medicalRecords.length > 0 ? (
              <div className="border rounded-md divide-y shadow-sm">
                {medicalRecords.map((record, index) => (
                  <button
                    type="button"
                    key={record.record_id || index}
                    className="p-3 text-sm hover:bg-muted cursor-pointer transition-colors w-full text-left"
                    onClick={() => handleRecordClick(record)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span className="font-medium">
                          {formatDate(record.visit_date)}
                        </span>
                      </div>
                      <Badge
                        variant={getStatusVariant(record.visit_status)}
                      >
                        {record.visit_status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <div className="text-muted-foreground">
                        {record.medical_staff?.users ? (
                          <span>Dr. {record.medical_staff.users.first_name} {record.medical_staff.users.last_name}</span>
                        ) : (
                          <span>Patient Status: {record.patient_status}</span>
                        )}
                      </div>
                      {record.diagnosis && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" aria-hidden="true" />
                          <span className="max-w-[150px] truncate">{record.diagnosis}</span>
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No medical records found
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PatientMedicalRecords
