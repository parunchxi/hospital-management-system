import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface PatientSearchProps {
  patientId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  patient: any;
  isLoading: boolean;
  error: string;
  label?: string;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  patientId,
  onChange,
  patient,
  isLoading,
  error,
  label = "Patient ID",
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="patient-id">{label}</Label>
      <div className="space-y-2">
        <Input
          id="patient-id"
          value={patientId}
          onChange={onChange}
          placeholder="Enter patient ID"
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
          <div className="text-sm p-3 border rounded-md bg-muted/50">
            <div>
              <span className="font-semibold">Name:</span> {patient.users?.first_name} {patient.users?.last_name}
            </div>
            {patient.users?.date_of_birth && (
              <div>
                <span className="font-semibold">DOB:</span>{" "}
                {new Date(patient.users.date_of_birth).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
