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
}: {
  patientProfile: PatientProfile | null
}) {
  const user = patientProfile?.users

  return (
    <Card className="lg:col-span-1">
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
            <span>{user?.phone_number}</span>
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
    </Card>
  )
}
