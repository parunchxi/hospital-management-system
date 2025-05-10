'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
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
import { CalendarClock } from 'lucide-react'

interface AppointmentsTableProps {
  onRowClick: (record: any) => void
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ onRowClick }) => {
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  const [visibleAppointments, setVisibleAppointments] = useState(3)
  const [initialRowsShown, setInitialRowsShown] = useState(true)

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Appointments data:', data);
        setAppointments(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      })
  }, [])

  const loadMoreAppointments = () => {
    setVisibleAppointments((prev) => prev + 3)
    setInitialRowsShown(false)
  }

  const showLessAppointments = () => {
    setVisibleAppointments(3)
    setInitialRowsShown(true)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'Canceled':
        return 'destructive'
      case 'Scheduled':
        return 'default'
      default:
        return 'outline'
    }
  }

  if (isLoading) return (
    <Card>
      <CardContent className="p-6 flex justify-center items-center">
        Loading appointments...
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-muted-foreground" />
          Appointments
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Manage your patient appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-auto max-h-[350px]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Patient Status</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments && appointments.length > 0 ? (
                appointments.slice(0, visibleAppointments).map((record: any) => (
                  <TableRow
                    // key={record.record_id}
                    className="cursor-pointer"
                    onClick={() => {
                        // alert(`Row clicked, patient data: ${JSON.stringify(record, null, 2)}`);
                      onRowClick(record);
                    }}
                  >
                    <TableCell>
                      {record.patients?.users?.first_name} {record.patients?.users?.last_name}
                    </TableCell>
                    <TableCell>{record.symptoms || 'Not specified'}</TableCell>
                    <TableCell>{record.patient_status || 'Unknown'}</TableCell>
                    <TableCell>
                      {record.visit_date ?
                        new Date(record.visit_date).toLocaleDateString() :
                        'Not scheduled'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(record.visit_status)}>
                        {record.visit_status || 'Unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {appointments && appointments.length > 3 && (
        <CardFooter className="flex justify-center gap-4 pt-2">
          {appointments.length > visibleAppointments && (
            <Button onClick={loadMoreAppointments} variant="outline" size="sm">Load More</Button>
          )}
          {!initialRowsShown && (
            <Button onClick={showLessAppointments} variant="outline" size="sm">Show Less</Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default AppointmentsTable
