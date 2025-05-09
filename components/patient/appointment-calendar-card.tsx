import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

export default function AppointmentCalendarCard() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" /> Appointment
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs mx-auto">
          <Calendar />
        </div>
      </CardContent>
    </Card>
  )
}
