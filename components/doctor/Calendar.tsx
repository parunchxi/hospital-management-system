import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'

const DoctorCalendar: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          Calendar
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          View your schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar className="rounded-md border mx-auto" />
      </CardContent>
    </Card>
  )
}

export default DoctorCalendar
