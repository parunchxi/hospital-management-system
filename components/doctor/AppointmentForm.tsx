import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { PatientSearch } from './PatientSearch';

interface AppointmentFormProps {
  patientIdInput: string;
  handlePatientIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchingPatient: boolean;
  patientError: string;
  appointmentPatient: any;
  appointment: any;
  handleAppointmentChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setAppointment: (value: React.SetStateAction<any>) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  patientIdInput,
  handlePatientIdChange,
  fetchingPatient,
  patientError,
  appointmentPatient,
  appointment,
  handleAppointmentChange,
  setAppointment,
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
            patient={appointmentPatient}
            isLoading={fetchingPatient}
            error={patientError}
          />

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="visit-date">Appointment Date</Label>
            <Input
              id="visit-date"
              name="visit_date"
              type="date"
              value={appointment.visit_date}
              onChange={handleAppointmentChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visit-status">Visit Status</Label>
              <Select value={appointment.visit_status} onValueChange={val => setAppointment((prev: typeof appointment) => ({ ...prev, visit_status: val }))} required>
                <SelectTrigger id="visit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-status">Patient Status</Label>
              <Select value={appointment.patient_status} onValueChange={val => setAppointment((prev: typeof appointment) => ({ ...prev, patient_status: val }))} required>
                <SelectTrigger id="patient-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Outpatient">Outpatient</SelectItem>
                  <SelectItem value="Inpatient">Inpatient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms</Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              value={appointment.symptoms}
              onChange={handleAppointmentChange}
              placeholder="Enter patient symptoms"
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              value={appointment.diagnosis}
              onChange={handleAppointmentChange}
              placeholder="Enter diagnosis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment-plan">Treatment Plan</Label>
            <Textarea
              id="treatment-plan"
              name="treatment_plan"
              value={appointment.treatment_plan}
              onChange={handleAppointmentChange}
              placeholder="Enter treatment plan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicine">Medicine Prescribed</Label>
            <Input
              id="medicine"
              name="medicine_prescribed"
              value={appointment.medicine_prescribed}
              onChange={handleAppointmentChange}
              placeholder="Enter prescribed medicines"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={loading || !appointmentPatient}
        className="w-full"
      >
        {loading ? 'Creating...' : 'Create Appointment'}
      </Button>
    </form>
  );
};
