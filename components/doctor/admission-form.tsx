import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PatientSearch } from './patient-search'
import { Hospital, Calendar, User } from 'lucide-react'

interface AdmissionFormProps {
  patientIdInput: string
  handlePatientIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fetchingPatient: boolean
  patientError: string
  admissionPatient: any
  admission: any
  handleAdmissionChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setAdmission: (value: React.SetStateAction<any>) => void
  nurses: any[]
  rooms: any[]
  loading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
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
  // Find selected room and nurse for display - convert IDs to same type for comparison
  const selectedRoom = rooms.find(
    (room) => room.room_id.toString() === admission.room_id?.toString(),
  )
  const selectedNurse = nurses.find(
    (nurse) => nurse.staff_id.toString() === admission.nurse_id?.toString(),
  )

  // Extract date and time parts for UI display
  const getDatePart = (isoString: string) => {
    return isoString ? isoString.split('T')[0] : '';
  }

  const getTimePart = (isoString: string) => {
    if (!isoString) return '';
    const timePart = isoString.split('T')[1];
    return timePart ? timePart.substring(0, 5) : ''; // Get HH:MM part
  }

  // Handler for date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'admission_date' | 'discharge_date') => {
    const { value } = e.target;
    const timePart = field === 'admission_date' 
      ? getTimePart(admission.admission_date) || '00:00'
      : getTimePart(admission.discharge_date) || '00:00';
    
    setAdmission((prev: typeof admission) => ({
      ...prev,
      [field]: value ? `${value}T${timePart}` : '',
    }));
  }

  // Handler for time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'admission_date' | 'discharge_date') => {
    const { value } = e.target;
    const datePart = field === 'admission_date'
      ? getDatePart(admission.admission_date)
      : getDatePart(admission.discharge_date);
    
    if (datePart) {
      setAdmission((prev: typeof admission) => ({
        ...prev,
        [field]: `${datePart}T${value || '00:00'}`,
      }));
    }
  }

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

          <Separator className="my-2" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="room"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Hospital className="h-4 w-4 text-muted-foreground" />
                Room
              </Label>{' '}
              <Select
                value={admission.room_id?.toString() || ''}
                onValueChange={(val: string) =>
                  setAdmission((prev: typeof admission) => ({
                    ...prev,
                    room_id: parseInt(val),
                  }))
                }
                required
              >
                <SelectTrigger id="room">
                  <SelectValue placeholder="Select room">
                    {selectedRoom
                      ? `${selectedRoom.room_id} - ${selectedRoom.room_type}`
                      : 'Select room'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem
                      key={room.room_id}
                      value={room.room_id.toString()}
                    >
                      {room.room_id} - {room.room_type} (
                      {room.departments?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="nurse"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Nurse
              </Label>{' '}
              <Select
                value={admission.nurse_id?.toString() || ''}
                onValueChange={(val: string) =>
                  setAdmission((prev: typeof admission) => ({
                    ...prev,
                    nurse_id: parseInt(val),
                  }))
                }
                required
              >
                <SelectTrigger id="nurse">
                  <SelectValue placeholder="Assign nurse">
                    {selectedNurse
                      ? `${selectedNurse.users?.first_name} ${selectedNurse.users?.last_name}`
                      : 'Assign nurse'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {nurses.map((nurse) => (
                    <SelectItem
                      key={nurse.staff_id}
                      value={nurse.staff_id.toString()}
                    >
                      {nurse.users?.first_name} {nurse.users?.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="admission-date"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Admission Date
                </Label>
                <Input
                  id="admission-date"
                  name="admission_date"
                  type="date"
                  value={getDatePart(admission.admission_date)}
                  onChange={(e) => handleDateChange(e, 'admission_date')}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="admission-time"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Admission Time
                </Label>
                <Input
                  id="admission-time"
                  name="admission_time"
                  type="time"
                  value={getTimePart(admission.admission_date)}
                  onChange={(e) => handleTimeChange(e, 'admission_date')}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="discharge-date"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Discharge Date
                </Label>
                <Input
                  id="discharge-date"
                  name="discharge_date"
                  type="date"
                  value={getDatePart(admission.discharge_date)}
                  onChange={(e) => handleDateChange(e, 'discharge_date')}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="discharge-time"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Discharge Time
                </Label>
                <Input
                  id="discharge-time"
                  name="discharge_time"
                  type="time"
                  value={getTimePart(admission.discharge_date)}
                  onChange={(e) => handleTimeChange(e, 'discharge_date')}
                  className="w-full"
                />
              </div>
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
  )
}
