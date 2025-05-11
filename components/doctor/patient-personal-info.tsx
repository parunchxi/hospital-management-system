'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User, Phone, MapPin, Droplet } from 'lucide-react'

interface PatientPersonalInfoProps {
  patientInfo: {
    users?: {
      first_name: string
      last_name: string
      date_of_birth: string
      phone_number: string
      address: string
      national_id: string
    }
    blood_type?: string
  }
}

export function PatientPersonalInfo({ patientInfo }: PatientPersonalInfoProps) {
  return (
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
              {patientInfo.users?.date_of_birth
                ? new Date(
                    patientInfo.users?.date_of_birth,
                  ).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Blood Type</span>
            <span className="font-medium flex items-center gap-1">
              <Droplet className="h-3.5 w-3.5 text-muted-foreground" />
              {patientInfo.blood_type || 'Not recorded'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Phone Number</span>
            <span className="font-medium flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              {patientInfo.users?.phone_number || 'Not provided'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">National ID</span>
            <span className="font-medium">
              {patientInfo.users?.national_id || 'Not provided'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Address</span>
            <span className="font-medium flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {patientInfo.users?.address || 'Not provided'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PatientPersonalInfo
