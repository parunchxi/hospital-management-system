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

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  onRowClick,
}) => {
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  const [visibleAppointments, setVisibleAppointments] = useState(3)
  const [initialRowsShown, setInitialRowsShown] = useState(true)

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log('Appointments data:', data)
        setAppointments(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error)
        setLoading(false)
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
        return 'bg-green-500 text-white'
      case 'Canceled':
        return 'bg-red-500 text-white'
      case 'Scheduled':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-200 text-black'
    }
  }

  const getPatientStatusTooltip = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'The patient is in stable condition.'
      case 'Critical':
        return 'The patient is in critical condition.'
      case 'Recovering':
        return 'The patient is recovering.'
      default:
        return 'Unknown patient status.'
    }
  }

  if (isLoading)
    return (
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
          <Table className="border-collapse border-spacing-0">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>#</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Patient Status</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments && appointments.length > 0 ? (
                appointments.slice(0, visibleAppointments).map((record, i) => (
                  <TableRow
                    key={record.record_id}
                    className={`text-sm [&>td]:py-3 cursor-pointer ${
                      i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-gray-100 transition-colors`}
                    onClick={() => onRowClick(record)}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {record.patients?.users?.first_name}{' '}
                      {record.patients?.users?.last_name}
                    </TableCell>
                    <TableCell>{record.symptoms || 'Not specified'}</TableCell>
                    <TableCell>
                      <div
                        className="tooltip"
                        data-tooltip={getPatientStatusTooltip(
                          record.patient_status || 'Unknown',
                        )}
                      >
                        {record.patient_status || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.visit_date
                        ? new Date(record.visit_date).toLocaleDateString()
                        : 'Not scheduled'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusVariant(record.visit_status)}>
                        {record.visit_status || 'Unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
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
            <Button onClick={loadMoreAppointments} variant="outline" size="sm">
              Load More
            </Button>
          )}
          {!initialRowsShown && (
            <Button onClick={showLessAppointments} variant="outline" size="sm">
              Show Less
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default AppointmentsTable
