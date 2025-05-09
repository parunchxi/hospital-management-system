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
        return 'default'
      case 'Canceled':
        return 'destructive'
      case 'Scheduled':
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="sm:col-span-2 order-1 lg:order-none">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your confirmed doctor visits</CardDescription>
      </CardHeader>
      <CardContent className="pl-2px-6 py-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appt, i) => (
              <TableRow key={i} className="text-sm [&>td]:py-3">
                <TableCell className="font-medium">{appt.visit_date}</TableCell>
                <TableCell>
                  {appt.medical_staff.users.first_name}{' '}
                  {appt.medical_staff.users.last_name}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(appt.visit_status)}>
                    {appt.visit_status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
