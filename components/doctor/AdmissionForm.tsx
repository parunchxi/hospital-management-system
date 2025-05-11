import React from 'react'
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
import { PatientSearch } from './PatientSearch'
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
                value={admission.admission_date}
                onChange={handleAdmissionChange}
                required
                className="w-full"
              />
            </div>

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
                value={admission.discharge_date}
                onChange={handleAdmissionChange}
                className="w-full"
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
  )
}
