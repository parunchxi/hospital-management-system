import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  PlusIcon,
  CalendarPlus,
  Hospital,
  Clipboard,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import { AdmissionForm } from './AdmissionForm'
import { AppointmentForm } from './AppointmentForm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'

// Initial state objects
const initialAdmission = {
  patient_id: '',
  room_id: '',
  nurse_id: '',
  admission_date: '',
  discharge_date: '',
}

const initialAppointment = {
  patient_id: '',
  symptoms: '',
  diagnosis: '',
  treatment_plan: '',
  medicine_prescribed: '',
  visit_date: '',
  visit_status: 'Scheduled',
  patient_status: 'Outpatient',
  doctor_id: '',
  record_id: '',
}

// Helper hook for patient data fetching with debounce
const usePatientSearch = () => {
  const [patientData, setPatientData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputValue, setInputValue] = useState('')

  const fetchPatient = async (id: string) => {
    if (!id) {
      setPatientData(null)
      setError('')
      return null
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/patients/${id}`)
      if (!res.ok) throw new Error('Patient not found')

      const data = await res.json()
      setPatientData(data)
      return data
    } catch (err: any) {
      setError(err.message || 'Error fetching patient')
      setPatientData(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInputValue(value)

    const debounceTimer = setTimeout(() => {
      fetchPatient(value)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }

  return {
    patientData,
    loading,
    error,
    inputValue,
    setInputValue,
    handleInputChange,
    fetchPatient,
    setPatientData,
  }
}

const FloatingActionMenu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const [dialogType, setDialogType] = useState<
    'admission' | 'appointment' | 'deleteRecord' | null
  >(null)
  const [admission, setAdmission] = useState(initialAdmission)
  const [appointment, setAppointment] = useState(initialAppointment)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nurses, setNurses] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])

  // New states for delete record functionality
  const [records, setRecords] = useState<any[]>([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Use custom hook for patient search for both forms
  const {
    patientData: admissionPatient,
    loading: admissionLoading,
    error: admissionError,
    inputValue: admissionInput,
    handleInputChange: handleAdmissionInput,
    setPatientData: setAdmissionPatient,
    setInputValue: setAdmissionInput,
  } = usePatientSearch()

  const {
    patientData: appointmentPatient,
    loading: appointmentLoading,
    error: appointmentError,
    inputValue: appointmentInput,
    handleInputChange: handleAppointmentInput,
    setPatientData: setAppointmentPatient,
    setInputValue: setAppointmentInput,
  } = usePatientSearch()

  // Load room and nurse data on component mount
  useEffect(() => {
    Promise.all([
      fetch('/api/staff?type=Nurse').then((res) => res.json()),
      fetch('/api/rooms?available=true').then((res) => res.json()),
    ])
      .then(([nurseData, roomData]) => {
        setNurses(nurseData || [])
        setRooms(roomData || [])
      })
      .catch((err) => {
        toast.error('Error loading data')
        console.error(err)
      })
  }, [])

  // Update admission data when patient is selected
  useEffect(() => {
    if (admissionPatient) {
      setAdmission((prev) => ({
        ...prev,
        patient_id: admissionPatient.patient_id,
      }))
    }
  }, [admissionPatient])

  // Update appointment data when patient is selected
  useEffect(() => {
    if (appointmentPatient) {
      setAppointment((prev) => ({
        ...prev,
        patient_id: appointmentPatient.patient_id,
      }))
    }
  }, [appointmentPatient])

  // Load records when delete dialog opens
  useEffect(() => {
    if (dialogType === 'deleteRecord') {
      fetchRecords()
    }
  }, [dialogType])

  // Form change handlers
  const handleAdmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmission({ ...admission, [e.target.name]: e.target.value })
  }

  const handleAppointmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value })
  }

  // Form submit handlers
  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admission),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to create admission')
      } else {
        toast.success('Admission created successfully')
        resetAdmissionForm()
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to create appointment')
      } else {
        toast.success('Appointment created successfully')
        resetAppointmentForm()
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to fetch records
  const fetchRecords = async () => {
    setLoadingRecords(true)
    try {
      const response = await fetch('/api/records')
      if (!response.ok) {
        throw new Error('Failed to fetch records')
      }
      const data = await response.json()
      setRecords(data.data || [])
    } catch (error) {
      toast.error('Error loading records')
      console.error(error)
    } finally {
      setLoadingRecords(false)
    }
  }

  // Handle record deletion
  const handleDeleteRecord = async () => {
    if (!selectedRecord) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/records/${selectedRecord.record_id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete record')
      }

      toast.success('Record deleted successfully')
      // Refresh records list
      fetchRecords()
      setSelectedRecord(null)
    } catch (error: any) {
      toast.error(error.message || 'Error deleting record')
    } finally {
      setDeleteLoading(false)
      setConfirmDelete(false)
    }
  }

  // Filter records based on search term
  const filteredRecords = records.filter((record) => {
    const patientName =
      record.patients?.users?.first_name +
        ' ' +
        record.patients?.users?.last_name || ''
    const doctorName =
      record.medical_staff?.users?.first_name +
        ' ' +
        record.medical_staff?.users?.last_name || ''

    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(record.record_id).includes(searchTerm)
    )
  })

  // Reset form helpers
  const resetAdmissionForm = () => {
    setAdmission(initialAdmission)
    setAdmissionPatient(null)
    setAdmissionInput('')
    setDialogType(null)
  }

  const resetAppointmentForm = () => {
    setAppointment(initialAppointment)
    setAppointmentPatient(null)
    setAppointmentInput('')
    setDialogType(null)
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100]">
        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
            >
              <PlusIcon className="h-6 w-6 text-primary-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-56">
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                setDialogType('admission')
                setOpenMenu(false)
              }}
            >
              <Hospital className="h-4 w-4" />
              Create Admission
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                setDialogType('appointment')
                setOpenMenu(false)
              }}
            >
              <CalendarPlus className="h-4 w-4" />
              Create Appointment
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                setDialogType('deleteRecord')
                setOpenMenu(false)
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Admission Dialog */}
      <Dialog
        open={dialogType === 'admission'}
        onOpenChange={(open) => {
          if (!open) resetAdmissionForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Hospital className="h-5 w-5 text-muted-foreground" />
              Create New Admission
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Admit a patient to the hospital
            </DialogDescription>
          </DialogHeader>

          <AdmissionForm
            patientIdInput={admissionInput}
            handlePatientIdChange={handleAdmissionInput}
            fetchingPatient={admissionLoading}
            patientError={admissionError}
            admissionPatient={admissionPatient}
            admission={admission}
            handleAdmissionChange={handleAdmissionChange}
            setAdmission={setAdmission}
            nurses={nurses}
            rooms={rooms}
            loading={isSubmitting}
            onSubmit={handleAdmissionSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Appointment Dialog */}
      <Dialog
        open={dialogType === 'appointment'}
        onOpenChange={(open) => {
          if (!open) resetAppointmentForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-muted-foreground" />
              Create New Appointment
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Schedule a new patient appointment
            </DialogDescription>
          </DialogHeader>

          <AppointmentForm
            patientIdInput={appointmentInput}
            handlePatientIdChange={handleAppointmentInput}
            fetchingPatient={appointmentLoading}
            patientError={appointmentError}
            appointmentPatient={appointmentPatient}
            appointment={appointment}
            handleAppointmentChange={handleAppointmentChange}
            setAppointment={setAppointment}
            loading={isSubmitting}
            onSubmit={handleAppointmentSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Record Dialog */}
      <Dialog
        open={dialogType === 'deleteRecord'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogType(null)
            setSearchTerm('')
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-muted-foreground" />
              Delete Medical Record
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Select a record to delete from the list below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                placeholder="Search records..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loadingRecords ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading records...</span>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No records found</h3>
                <p className="text-sm text-muted-foreground">
                  There are no records available for deletion.
                </p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow
                        key={record.record_id}
                        className={
                          selectedRecord?.record_id === record.record_id
                            ? 'bg-muted'
                            : ''
                        }
                      >
                        <TableCell>{record.record_id}</TableCell>
                        <TableCell>
                          {record.patients?.users?.first_name}{' '}
                          {record.patients?.users?.last_name}
                        </TableCell>
                        <TableCell>
                          {record.medical_staff?.users?.first_name}{' '}
                          {record.medical_staff?.users?.last_name}
                        </TableCell>
                        <TableCell>
                          {new Date(record.visit_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.visit_status}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record)
                              setConfirmDelete(true)
                            }}
                            disabled={record.visit_status === 'Completed'}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the medical record for{' '}
              <span className="font-medium">
                {selectedRecord?.patients?.users?.first_name}{' '}
                {selectedRecord?.patients?.users?.last_name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteRecord()
              }}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </>
  )
}

export default FloatingActionMenu
