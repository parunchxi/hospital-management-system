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
  time: string
  doctor: string
  status: 'Paid' | 'Pending'
}

export default function UpcomingAppointmentsTable({
  appointments,
}: {
  appointments: Appointment[]
}) {
  const getStatusVariant = (status: 'Paid' | 'Pending') =>
    status === 'Paid' ? 'default' : 'destructive'

  return (
    <Card className="lg:col-span-2 order-1 lg:order-none">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your confirmed doctor visits</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="overflow-x-auto rounded-xl border border-border bg-muted/40 px-6 py-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell>{appt.doctor}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(appt.status)}>
                      {appt.status}
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
