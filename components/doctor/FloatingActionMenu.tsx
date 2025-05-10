import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import { AdmissionForm } from './AdmissionForm'
import { AppointmentForm } from './AppointmentForm'

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
    setPatientData
  }
}

const FloatingActionMenu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const [dialogType, setDialogType] = useState<'admission' | 'appointment' | null>(null)
  const [admission, setAdmission] = useState(initialAdmission)
  const [appointment, setAppointment] = useState(initialAppointment)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nurses, setNurses] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])

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
      fetch('/api/staff?type=Nurse').then(res => res.json()),
      fetch('/api/rooms?available=true').then(res => res.json())
    ])
    .then(([nurseData, roomData]) => {
      setNurses(nurseData || [])
      setRooms(roomData || [])
    })
    .catch(err => {
      toast.error('Error loading data')
      console.error(err)
    })
  }, [])

  // Update admission data when patient is selected
  useEffect(() => {
    if (admissionPatient) {
      setAdmission(prev => ({ ...prev, patient_id: admissionPatient.patient_id }))
    }
  }, [admissionPatient])

  // Update appointment data when patient is selected
  useEffect(() => {
    if (appointmentPatient) {
      setAppointment(prev => ({ ...prev, patient_id: appointmentPatient.patient_id }))
    }
  }, [appointmentPatient])

  // Form change handlers
  const handleAdmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmission({ ...admission, [e.target.name]: e.target.value })
  }

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <div className="fixed bottom-8 right-8 z-50">
        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" className="rounded-full h-14 w-14 shadow-lg">
              <PlusIcon className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-56">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => { setDialogType('admission'); setOpenMenu(false) }}
            >
              Create Admission
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => { setDialogType('appointment'); setOpenMenu(false) }}
            >
              Create Appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Admission Dialog */}
      <Dialog
        open={dialogType === 'admission'}
        onOpenChange={open => { if (!open) resetAdmissionForm() }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Admission</DialogTitle>
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
        onOpenChange={open => { if (!open) resetAppointmentForm() }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Appointment</DialogTitle>
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

      <Toaster />
    </>
  )
}

export default FloatingActionMenu
