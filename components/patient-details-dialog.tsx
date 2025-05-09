'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Patient {
  id: string
  name: string
  checkInDate: string
  caseName: string
  roomNumber: string
  // Add more fields for the patient's personal info
  age?: number
  dob?: string
  gender?: string
  contactNumber?: string
  address?: string
  emailAddress?: string
  bloodType?: string
  allergies?: string[]
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
  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Patient Information</DialogTitle>
          <DialogDescription>
            Details for patient {patient.name} (ID: {patient.id})
          </DialogDescription>
        </DialogHeader>

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
                <p className="text-sm">{patient.name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Patient ID</h3>
                <p className="text-sm">{patient.id}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Date of Birth</h3>
                <p className="text-sm">{patient.dob || 'Not available'}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Age</h3>
                <p className="text-sm">{patient.age || 'Not available'}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Gender</h3>
                <p className="text-sm">{patient.gender || 'Not available'}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Blood Type</h3>
                <p className="text-sm">
                  {patient.bloodType || 'Not available'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Contact Number</h3>
                <p className="text-sm">
                  {patient.contactNumber || 'Not available'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Email Address</h3>
                <p className="text-sm">
                  {patient.emailAddress || 'Not available'}
                </p>
              </div>

              <div className="space-y-2 col-span-2">
                <h3 className="font-medium">Address</h3>
                <p className="text-sm">{patient.address || 'Not available'}</p>
              </div>

              <div className="space-y-2 col-span-2">
                <h3 className="font-medium">Allergies</h3>
                <p className="text-sm">
                  {patient.allergies && patient.allergies.length > 0
                    ? patient.allergies.join(', ')
                    : 'None reported'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4 mt-4">
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Medical History</h3>
              <p className="text-sm text-muted-foreground">
                Medical records information will be displayed here. This
                information is not yet available.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="admission" className="space-y-4 mt-4">
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Current Admission</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Check-in Date</p>
                  <p className="text-sm">{patient.checkInDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Room Number</p>
                  <p className="text-sm">{patient.roomNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Case</p>
                  <p className="text-sm">{patient.caseName}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
