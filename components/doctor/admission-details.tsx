import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Heart,
  Loader2,
  AlertCircle,
  Pencil,
  User,
  Calendar,
  Hospital,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'

interface AdmissionInfo {
  admission_id?: string
  admission_date?: string
  discharge_date?: string
  updated_at?: string
  reason?: string
  status?: string
  room?: {
    room_id?: string
    room_type?: string
    department?: {
      name?: string
    }
  }
  nurse?: {
    user?: {
      first_name?: string
      last_name?: string
    }
  }
}

interface RoomInfo {
  room_id: string
  room_type: string
  department: { name: string }
}

interface NurseInfo {
  staff_id: string
  users: { first_name: string; last_name: string }
}

interface AdmissionDetailsProps {
  patientId?: string
  roomNumber?: string
  visitDate?: string
}

const AdmissionDetails: React.FC<AdmissionDetailsProps> = ({
  patientId,
  visitDate,
}) => {
  const [admissionInfo, setAdmissionInfo] = useState<AdmissionInfo | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [nurses, setNurses] = useState<NurseInfo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form setup
  const form = useForm({
    defaultValues: {
      room_id: '',
      nurse_id: '',
      discharge_date: '',
    },
  })

  useEffect(() => {
    if (!patientId) return

    setIsLoading(true)
    setError(null)

    fetch(`/api/admission/${patientId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log('Admission data received:', data)
        // API returns an array, take the first item if available
        const admissionData =
          Array.isArray(data) && data.length > 0 ? data[0] : data
        setAdmissionInfo(admissionData)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching admission data:', error)
        setError('Failed to load admission details')
        setIsLoading(false)
      })
  }, [patientId])

  useEffect(() => {
    if (!isDialogOpen) return

    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(Array.isArray(data) ? data : []))
    fetch('/api/staff?type=Nurse')
      .then((res) => res.json())
      .then((data) => setNurses(Array.isArray(data) ? data : []))

    // Reset form with current admission info
    if (admissionInfo) {
      let nurseId = ''
      if (admissionInfo.nurse && admissionInfo.nurse.user && nurses.length) {
        const foundNurse = nurses.find(
          (n) =>
            n.users.first_name === admissionInfo.nurse?.user?.first_name &&
            n.users.last_name === admissionInfo.nurse?.user?.last_name,
        )
        nurseId = foundNurse ? foundNurse.staff_id : ''
      }
      form.reset({
        room_id: admissionInfo.room?.room_id || '',
        nurse_id: nurseId,
        discharge_date: admissionInfo.discharge_date || '',
      })
    }
  }, [isDialogOpen, admissionInfo, nurses, form])

  // PATCH handler
  const onSubmit = async (values: any) => {
    if (!admissionInfo?.admission_id) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admission/${admissionInfo.admission_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: values.room_id,
          nurse_id: values.nurse_id ? parseInt(values.nurse_id) : null,
          discharge_date: values.discharge_date || null,
        }),
      })
      if (!res.ok) throw new Error('Failed to update admission')
      toast.success('Admission updated successfully')
      setIsDialogOpen(false)
      // Refresh admission info
      setIsLoading(true)
      fetch(`/api/admission/${patientId}`)
        .then((res) => res.json())
        .then((data) =>
          setAdmissionInfo(
            Array.isArray(data) && data.length > 0 ? data[0] : data,
          ),
        )
        .finally(() => setIsLoading(false))
    } catch (e: any) {
      toast.error(e.message || 'Error updating admission')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if we have admission data from the API
  const hasAdmissionData =
    admissionInfo &&
    typeof admissionInfo === 'object' &&
    Object.keys(admissionInfo).length > 0

  // Use API data if available, otherwise fall back to props
  const displayRoomId =
    hasAdmissionData && admissionInfo.room
      ? admissionInfo.room.room_id || 'Unknown'
      : 'Unknown'

  const displayAdmissionDate =
    hasAdmissionData && admissionInfo.admission_date
      ? admissionInfo.admission_date
      : visitDate

  // Ensure we properly check for existence and provide default values
  const displayRoomDept =
    hasAdmissionData && admissionInfo.room?.department?.name
      ? admissionInfo.room.department.name
      : null

  const displayRoomType =
    hasAdmissionData && admissionInfo.room?.room_type
      ? admissionInfo.room.room_type
      : null

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            Admission Details
          </CardTitle>

          {/* Debug output - remove in production */}
          <div className="text-xs text-gray-400 mt-1 break-all hidden">
            {JSON.stringify(admissionInfo)}
          </div>
        </CardHeader>
        <CardContent>
          {hasAdmissionData && (
            <div className="absolute top-2 right-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit admission details</span>
              </Button>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">
                Loading admission details...
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-muted-foreground text-sm">{error}</span>
            </div>
          ) : hasAdmissionData ? (
            <div className="space-y-3">
              {displayRoomId && displayRoomId !== 'Unknown' && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Room ID:
                  </span>
                  <Badge variant="outline">{displayRoomId}</Badge>
                </div>
              )}

              {displayRoomType && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Room Type:
                  </span>
                  <Badge variant="outline">{displayRoomType}</Badge>
                </div>
              )}

              {displayRoomDept && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Department:
                  </span>
                  <Badge variant="outline">{displayRoomDept}</Badge>
                </div>
              )}

              {displayAdmissionDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Admission Date:
                  </span>
                  <span className="text-sm">
                    {new Date(displayAdmissionDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Display additional admission details if available */}
              {admissionInfo.discharge_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Discharge Date:
                  </span>
                  <span className="text-sm">
                    {new Date(
                      admissionInfo.discharge_date,
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}

              {admissionInfo.reason && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reason:</span>
                  <span className="text-sm">{admissionInfo.reason}</span>
                </div>
              )}

              {admissionInfo.status && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      admissionInfo.status === 'Discharged'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {admissionInfo.status}
                  </Badge>
                </div>
              )}

              {admissionInfo.nurse?.user && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Assigned Nurse:
                  </span>
                  <span className="text-sm">
                    {admissionInfo.nurse.user.first_name}{' '}
                    {admissionInfo.nurse.user.last_name}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <span className="text-muted-foreground text-sm">
                Patient is not currently admitted
              </span>
            </div>
          )}
        </CardContent>
        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit Admission Details
              </DialogTitle>
              <DialogDescription>
                Update the room, nurse, and discharge date for this admission.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Hospital className="h-4 w-4 opacity-70" />
                        Room
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem key={room.room_id} value={room.room_id}>
                              {room.room_id} - {room.room_type} (
                              {room.department?.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nurse_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 opacity-70" />
                        Nurse
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a nurse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {nurses.map((nurse) => (
                            <SelectItem
                              key={nurse.staff_id}
                              value={nurse.staff_id}
                            >
                              {nurse.users.first_name} {nurse.users.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discharge_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 opacity-70" />
                        Discharge Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </Card>
      <Toaster />
    </>
  )
}

export default AdmissionDetails
