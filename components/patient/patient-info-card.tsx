import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User2, MapPin, Phone, BadgeDollarSign } from 'lucide-react'

export default function PatientInfoCard() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User2 className="h-4 w-4 text-muted-foreground" /> John Doe
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> 123 Main St, Springfield
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" /> (555) 123-4567
        </div>
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-4 w-4" /> Patient ID: P123456
        </div>
      </CardContent>
    </Card>
  )
}
