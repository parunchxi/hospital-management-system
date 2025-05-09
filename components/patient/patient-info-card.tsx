import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User2, MapPin, Phone, BadgeDollarSign } from 'lucide-react'

interface PatientProfile {
  blood_type: string;
  emergency_contact_id: number | null;
  users: {
    address: string;
    last_name: string;
    first_name: string;
    national_id: number;
    phone_number: string;
    date_of_birth: string;
  };
}

export default function PatientInfoCard({ patientProfile }: { patientProfile: PatientProfile | null }) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User2 className="h-4 w-4 text-muted-foreground" /> {patientProfile?.users?.first_name || 'John'} {patientProfile?.users?.last_name || 'Doe'}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> {patientProfile?.users?.address}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" /> {patientProfile?.users?.phone_number}
        </div>
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-4 w-4" /> National ID: {patientProfile?.users?.national_id}
        </div>
      </CardContent>
    </Card>
  )
}
