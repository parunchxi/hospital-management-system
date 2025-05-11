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
import { BedIcon, Users, Loader2 } from 'lucide-react'

interface AssignedPatientsTableProps {
  onRowClick: (patient: any) => void
}

const AssignedPatientsTable: React.FC<AssignedPatientsTableProps> = ({
  onRowClick,
}) => {
  const [admissions, setAdmissions] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visiblePatients, setVisiblePatients] = useState(5)
  const [initialRowsShown, setInitialRowsShown] = useState(true)

  useEffect(() => {
    // Fetch admissions assigned to the logged-in nurse
    fetch('/api/admission')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then((responseData) => {
        console.log('Admissions data:', responseData)
        // The API returns data in the 'data' property
        const admissionsData = responseData.data || []
        setAdmissions(admissionsData)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching admissions:', error)
        setError(error.message || 'Failed to fetch assigned patients')
        setLoading(false)
      })
  }, [])

  const loadMorePatients = () => {
    setVisiblePatients((prev) => prev + 5)
    setInitialRowsShown(false)
  }

  const showLessPatients = () => {
    setVisiblePatients(5)
    setInitialRowsShown(true)
  }

  const getConditionVariant = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'critical':
        return 'destructive'
      case 'serious':
        return 'warning'
      case 'stable':
        return 'success'
      case 'improving':
        return 'default'
      default:
        return 'outline'
    }
  }

  if (isLoading)
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          Loading assigned patients...
        </CardContent>
      </Card>
    )

  if (error)
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Assigned Patients
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Patients currently assigned to your care: {admissions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-auto max-h-[350px]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Expected Discharge</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissions.length > 0 ? (
                admissions.slice(0, visiblePatients).map((admission) => (
                  <TableRow
                    key={admission.admission_id}
                    className="cursor-pointer"
                    onClick={() =>
                      onRowClick({
                        patient_id: admission.patient_id,
                        admission: admission,
                      })
                    }
                  >
                    <TableCell className="flex items-center gap-1">
                      <BedIcon className="h-4 w-4 text-muted-foreground" />
                      {admission.room_id || 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      {admission.rooms?.departments?.name || 'Not specified'}
                    </TableCell>
                    <TableCell>
                      {admission.admission_date
                        ? new Date(
                            admission.admission_date,
                          ).toLocaleDateString()
                        : 'Not admitted'}
                    </TableCell>
                    <TableCell>
                      {admission.discharge_date
                        ? new Date(
                            admission.discharge_date,
                          ).toLocaleDateString()
                        : 'Not specified'}
                    </TableCell>
                    <TableCell>
                      {admission.admission_date
                        ? `${Math.ceil((new Date().getTime() - new Date(admission.admission_date).getTime()) / (1000 * 3600 * 24))} days`
                        : 'N/a'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No patients currently assigned
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {admissions.length > 5 && (
        <CardFooter className="flex justify-center gap-4 pt-2">
          {admissions.length > visiblePatients && (
            <Button onClick={loadMorePatients} variant="outline" size="sm">
              Load More
            </Button>
          )}
          {!initialRowsShown && (
            <Button onClick={showLessPatients} variant="outline" size="sm">
              Show Less
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default AssignedPatientsTable
