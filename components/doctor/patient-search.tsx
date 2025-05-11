import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, User, Calendar } from 'lucide-react'

interface PatientSearchProps {
  patientId: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  patient: any
  isLoading: boolean
  error: string
  label?: string
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  patientId,
  onChange,
  patient,
  isLoading,
  error,
  label = 'Patient ID',
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="patient-id" className="text-sm font-medium">
        {label}
      </Label>
      <div className="space-y-2">
        <Input
          id="patient-id"
          value={patientId}
          onChange={onChange}
          placeholder="Enter patient ID"
          className="w-full"
          required
        />

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Fetching patient details...
          </div>
        )}

        {error && <div className="text-sm text-destructive">{error}</div>}

        {patient && (
          <div className="text-sm p-3 border rounded-md bg-muted/50 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {patient.users?.first_name} {patient.users?.last_name}
              </span>
            </div>
            {patient.users?.date_of_birth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(patient.users.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
