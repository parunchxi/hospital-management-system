import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  User2,
  MapPin,
  Phone,
  BadgeDollarSign,
  Droplet,
  Calendar,
  Contact,
} from 'lucide-react'
import { ButtonIcon } from '@/components/ui/editBtn'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/patient/use-toast'

interface PatientProfile {
  blood_type: string
  emergency_contact_id: number | null
  users: {
    address: string
    last_name: string
    first_name: string
    national_id: number
    phone_number: string
    date_of_birth: string
  }
}

export default function PatientInfoCard({
  patientProfile,
  refreshData,
}: {
  patientProfile: PatientProfile | null
  refreshData?: () => Promise<void>
}) {
  const user = patientProfile?.users
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState(user?.phone_number || '')
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayedPhoneNumber, setDisplayedPhoneNumber] = useState(
    user?.phone_number || '',
  )

  const handleEditClick = () => {
    setIsDialogOpen(true)
    setNewPhoneNumber(user?.phone_number || '')
    setValidationError('')
  }

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phoneNumber)
  }

  const handleSavePhoneNumber = async () => {
    // Validate phone number
    if (!validatePhoneNumber(newPhoneNumber)) {
      setValidationError('Phone number must be exactly 10 digits')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/patients/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: newPhoneNumber }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update phone number')
      }

      // Phone number updated successfully
      setDisplayedPhoneNumber(newPhoneNumber)
      toast({
        title: 'Success',
        description: 'Phone number updated successfully',
        variant: 'default',
      })
      setIsDialogOpen(false)

      // Refresh parent data if available
      if (refreshData) {
        await refreshData()
      }
    } catch (error) {
      console.error('Error updating phone number:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update phone number',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only digits
    const digitsOnly = value.replace(/\D/g, '')
    setNewPhoneNumber(digitsOnly)

    // Clear validation error if it was previously shown and input is now valid
    if (validationError && validatePhoneNumber(digitsOnly)) {
      setValidationError('')
    }
  }

  return (
    <>
      <Card className="lg:col-span-1 relative">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User2 className="h-5 w-5 text-muted-foreground" />
            {user ? `${user.first_name} ${user.last_name}` : 'John Doe'}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Patient profile details
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date of Birth: {user?.date_of_birth}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4" />
              <span>National ID: {user?.national_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              <span>Blood Type: {patientProfile?.blood_type}</span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{displayedPhoneNumber || user?.phone_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{user?.address}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <Contact className="h-4 w-4" />
              <span>
                Emergency Contact ID:{' '}
                {patientProfile?.emergency_contact_id ?? 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-3 right-3">
          <ButtonIcon onClick={handleEditClick} />
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Phone Number</DialogTitle>
            <DialogDescription>
              Enter your new phone number. Must be exactly 10 digits.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newPhoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter new phone number"
              maxLength={10}
              type="tel"
            />
            {validationError && (
              <p className="text-sm text-red-500 mt-1">{validationError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePhoneNumber}
              disabled={isSubmitting || !newPhoneNumber}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
