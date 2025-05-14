'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Appointment {
  date: string
  doctor: string
  status: 'Scheduled' | 'Completed' | 'Canceled'
}

export default function UpcomingAppointmentsTable({
  appointments,
}: {
  appointments: {
    visit_date: string
    visit_status: 'Scheduled' | 'Completed' | 'Canceled'
    medical_staff: {
      users: {
        last_name: string
        first_name: string
      }
    }
  }[]
}) {
  const getStatusVariant = (status: 'Scheduled' | 'Completed' | 'Canceled') => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-white'
      case 'Canceled':
        return 'bg-red-500 text-white'
      case 'Scheduled':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-card'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'MMMM d, yyyy')
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'HH:mm')
  }

  return (
    <Card className="sm:col-span-2 order-1 lg:order-none">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your confirmed doctor visits</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-auto max-h-[350px]">
          <Table className="border-collapse border-spacing-0">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt, i) => (
                <TableRow
                  key={i}
                  className={`text-sm [&>td]:py-3 ${
                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors`}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{formatDate(appt.visit_date)}</TableCell>
                  <TableCell>{formatTime(appt.visit_date)}</TableCell>
                  <TableCell>
                    {appt.medical_staff.users.first_name}{' '}
                    {appt.medical_staff.users.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusVariant(appt.visit_status)}>
                      {appt.visit_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
