import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PatientSearch } from './patient-search'
import {
  Calendar,
  ClipboardList,
  Stethoscope,
  FileText,
  Pill,
  CheckCircle,
  UserCheck,
} from 'lucide-react'

interface AppointmentFormProps {
  patientIdInput: string
  handlePatientIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fetchingPatient: boolean
  patientError: string
  appointmentPatient: any
  appointment: any
  handleAppointmentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  setAppointment: (value: React.SetStateAction<any>) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
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
  // Visit status options
  const visitStatusOptions = ['Scheduled', 'Completed', 'Canceled']
  // Patient status options
  const patientStatusOptions = ['Outpatient', 'Inpatient'] // State for medicines
  const [medicines, setMedicines] = useState<any[]>([])
  const [loadingMedicines, setLoadingMedicines] = useState(false)

  // Extract date and time parts for UI display
  const getDatePart = (isoString: string) => {
    return isoString ? isoString.split('T')[0] : ''
  }

  const getTimePart = (isoString: string) => {
    if (!isoString) return ''
    const timePart = isoString.split('T')[1]
    return timePart ? timePart.substring(0, 5) : '' // Get HH:MM part
  }

  // Handler for date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const timePart = getTimePart(appointment.visit_date) || '00:00'

    setAppointment((prev: typeof appointment) => ({
      ...prev,
      visit_date: value ? `${value}T${timePart}` : '',
    }))
  }

  // Handler for time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const datePart = getDatePart(appointment.visit_date)

    if (datePart) {
      setAppointment((prev: typeof appointment) => ({
        ...prev,
        visit_date: `${datePart}T${value || '00:00'}`,
      }))
    }
  }

  // Fetch medicines on component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoadingMedicines(true)
      try {
        const res = await fetch('/api/medicine')
        if (!res.ok) throw new Error('Failed to fetch medicines')
        const data = await res.json()
        setMedicines(data)
      } catch (error) {
        console.error('Error fetching medicines:', error)
      } finally {
        setLoadingMedicines(false)
      }
    }

    fetchMedicines()
  }, [])

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Card className="max-h-[65vh] overflow-y-auto">
        <CardContent className="pt-4 space-y-4">
          <PatientSearch
            patientId={patientIdInput}
            onChange={handlePatientIdChange}
            patient={appointmentPatient}
            isLoading={fetchingPatient}
            error={patientError}
          />

          <Separator className="my-2" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="visit-date"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Appointment Date
              </Label>
              <Input
                id="visit-date"
                name="visit_date"
                type="date"
                value={getDatePart(appointment.visit_date)}
                onChange={handleDateChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="visit-time"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Appointment Time
              </Label>
              <Input
                id="visit-time"
                name="visit_time"
                type="time"
                value={getTimePart(appointment.visit_date)}
                onChange={handleTimeChange}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="visit-status"
                className="text-sm font-medium flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Visit Status
              </Label>
              <Select
                value={appointment.visit_status}
                onValueChange={(val: string) =>
                  setAppointment((prev: typeof appointment) => ({
                    ...prev,
                    visit_status: val,
                  }))
                }
              >
                <SelectTrigger id="visit-status">
                  <SelectValue placeholder="Scheduled" />
                </SelectTrigger>
                <SelectContent>
                  {visitStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="patient-status"
                className="text-sm font-medium flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                Patient Status
              </Label>
              <Select
                value={appointment.patient_status}
                onValueChange={(val: string) =>
                  setAppointment((prev: typeof appointment) => ({
                    ...prev,
                    patient_status: val,
                  }))
                }
              >
                <SelectTrigger id="patient-status">
                  <SelectValue placeholder="Outpatient" />
                </SelectTrigger>
                <SelectContent>
                  {patientStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-2">
            <Label
              htmlFor="symptoms"
              className="text-sm font-medium flex items-center gap-2"
            >
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              Symptoms
            </Label>
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
            <Label
              htmlFor="diagnosis"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Diagnosis
            </Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              value={appointment.diagnosis}
              onChange={handleAppointmentChange}
              placeholder="Enter diagnosis"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="treatment-plan"
              className="text-sm font-medium flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              Treatment Plan
            </Label>
            <Textarea
              id="treatment-plan"
              name="treatment_plan"
              value={appointment.treatment_plan}
              onChange={handleAppointmentChange}
              placeholder="Enter treatment plan"
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
  )
}
