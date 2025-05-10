'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
} from 'lucide-react'

interface MedicalRecord {
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
}

interface PatientMedicalRecordsProps {
  medicalRecords: MedicalRecord[] | undefined
}

export function PatientMedicalRecords({ medicalRecords }: PatientMedicalRecordsProps) {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          Visit History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedRecord && (
            <Card className="mb-4 border border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-medium">
                      Medical Record Details
                    </CardTitle>
                    <CardDescription>
                      {new Date(selectedRecord.visit_date).toLocaleDateString()} - {selectedRecord.visit_status} <br></br>
                      {/* {JSON.stringify(selectedRecord, null, 2)} */}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRecord(null)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {selectedRecord.doctor_id?.users && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-muted-foreground">Attending Doctor</h4>
                    <p>Dr. {selectedRecord.doctor_id.users.first_name} {selectedRecord.doctor_id.users.last_name}</p>
                  </div>
                )}

                {selectedRecord.diagnosis && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                      <Stethoscope className="h-3.5 w-3.5" />
                      Diagnosis
                    </h4>
                    <p>{selectedRecord.diagnosis}</p>
                  </div>
                )}

                {selectedRecord.symptoms && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-muted-foreground">Symptoms</h4>
                    <p>{selectedRecord.symptoms}</p>
                  </div>
                )}

                {selectedRecord.treatment && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-3.5 w-3.5" />
                      Treatment
                    </h4>
                    <p>{selectedRecord.treatment}</p>
                  </div>
                )}

                {selectedRecord.prescription && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                      <Pill className="h-3.5 w-3.5" />
                      Prescription
                    </h4>
                    <p>{selectedRecord.prescription}</p>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      Notes
                    </h4>
                    <p>{selectedRecord.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {medicalRecords && medicalRecords.length > 0 ? (
            <div className="border rounded-md divide-y">
              {medicalRecords.map((record, index) => (
                <div
                  key={index}
                  className="p-3 text-sm hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => setSelectedRecord(record)}
                >
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
                      - Dr. {record.doctor_id.users.first_name} {record.doctor_id.users.last_name}
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
  )
}

export default PatientMedicalRecords
