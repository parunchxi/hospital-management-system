import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatientSearch } from './PatientSearch';

interface AdmissionFormProps {
  patientIdInput: string;
  handlePatientIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchingPatient: boolean;
  patientError: string;
  admissionPatient: any;
  admission: any;
  handleAdmissionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAdmission: (value: React.SetStateAction<any>) => void;
  nurses: any[];
  rooms: any[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({
  patientIdInput,
  handlePatientIdChange,
  fetchingPatient,
  patientError,
  admissionPatient,
  admission,
  handleAdmissionChange,
  setAdmission,
  nurses,
  rooms,
  loading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Card>
        <CardContent className="pt-4 space-y-4">
          <PatientSearch
            patientId={patientIdInput}
            onChange={handlePatientIdChange}
            patient={admissionPatient}
            isLoading={fetchingPatient}
            error={patientError}
          />

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select
                value={admission.room_id}
                onValueChange={val => setAdmission((prev: typeof admission) => ({ ...prev, room_id: val }))}
                required
              >
                <SelectTrigger id="room">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r: any) => (
                    <SelectItem key={r.room_id} value={String(r.room_id)}>
                      Room {r.room_id} ({r.room_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nurse">Nurse</Label>
              <Select
                value={admission.nurse_id}
                onValueChange={val => setAdmission((prev: typeof admission) => ({ ...prev, nurse_id: val }))}
                required
              >
                <SelectTrigger id="nurse">
                  <SelectValue placeholder="Select nurse" />
                </SelectTrigger>
                <SelectContent>
                  {nurses.map((n: any) => (
                    <SelectItem key={n.staff_id} value={String(n.staff_id)}>
                      {n.users?.first_name} {n.users?.last_name} (ID: {n.staff_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admission-date">Admission Date</Label>
              <Input
                id="admission-date"
                name="admission_date"
                type="date"
                value={admission.admission_date}
                onChange={handleAdmissionChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discharge-date">Discharge Date</Label>
              <Input
                id="discharge-date"
                name="discharge_date"
                type="date"
                value={admission.discharge_date}
                onChange={handleAdmissionChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={loading || !admissionPatient}
        className="w-full"
      >
        {loading ? 'Creating...' : 'Create Admission'}
      </Button>
    </form>
  );
};
