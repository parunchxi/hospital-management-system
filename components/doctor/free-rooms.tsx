'use client'

import React, { useState, useEffect } from 'react'
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
import { DoorOpen, Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Room {
  room_id: string
  room_type: string
  department_id: number
  price_per_night: number
  capacity: number
  departments: {
    name: string
  }
  current_occupancy?: number
  available_beds?: number
  occupancy_percentage?: number
}

interface Admission {
  room_id: string
  admission_date: string
  discharge_date: string | null
}

const RoomAvailabilityTable: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoomsAndAdmissions = async () => {
      try {
        const roomsResponse = await fetch('/api/rooms')
        if (!roomsResponse.ok) throw new Error('Failed to fetch rooms')
        const roomsData = await roomsResponse.json()

        const admissionsResponse = await fetch('/api/admission')
        if (!admissionsResponse.ok)
          throw new Error('Failed to fetch admissions')
        const admissionsData = await admissionsResponse.json()
        
        // Get current date (without time) for comparison
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const now = today.toISOString()
        
        console.log("Fetched admissions data:", admissionsData)

        // Process admissions data properly based on its structure
        const admissions = admissionsData.data || []
        console.log(`Processing ${admissions.length} admissions`)

        // Calculate current occupancy by room - only count active admissions
        const admissionsByRoom: Record<string, number> = {}
        
        admissions.forEach((admission: Admission) => {
          // Check if admission is active: admission date is in past or today AND (no discharge date OR discharge date is in future)
          const admissionDate = new Date(admission.admission_date)
          admissionDate.setHours(0, 0, 0, 0)
          
          const dischargeDate = admission.discharge_date 
            ? new Date(admission.discharge_date) 
            : null
          if (dischargeDate) dischargeDate.setHours(0, 0, 0, 0)
          
          const isActive = 
            admissionDate <= today && 
            (!dischargeDate || dischargeDate >= today)
            
          if (isActive && admission.room_id) {
            console.log(`Active admission in room ${admission.room_id}:`, admission)
            admissionsByRoom[admission.room_id] = (admissionsByRoom[admission.room_id] || 0) + 1
          }
        })
        
        console.log("Current occupancy by room:", admissionsByRoom)

        const roomsWithAvailability = roomsData.map((room: Room) => {
          const currentOccupancy = admissionsByRoom[room.room_id] || 0
          const availableBeds = Math.max(0, room.capacity - currentOccupancy)
          const occupancyPercentage = (currentOccupancy / room.capacity) * 100

          return {
            ...room,
            current_occupancy: currentOccupancy,
            available_beds: availableBeds,
            occupancy_percentage: occupancyPercentage,
          }
        })

        setRooms(roomsWithAvailability)
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomsAndAdmissions()
  }, [])

  const getAvailabilityBadge = (room: Room) => {
    let status = `${room.available_beds} Available`
    let variant =
      'bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white'

    if (room.available_beds === 0) {
      status = 'Full'
      variant =
        'bg-[var(--color-red)] hover:bg-[var(--color-red-hover)] text-white'
    } else if (((room.available_beds ?? 0) / room.capacity) * 100 <= 50) {
      status = `${room.available_beds} Available`
      variant =
        'bg-[var(--color-yellow)] hover:bg-[var(--color-yellow-hover)] text-white'
    }

    return <Badge className={variant}>{status}</Badge>
  }

  if (isLoading)
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading room availability...
        </CardContent>
      </Card>
    )

  if (error)
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          Error loading room data: {error}
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <DoorOpen className="h-5 w-5 text-muted-foreground" />
          Room Availability
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Real-time room occupancy and availability
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-auto max-h-[400px]">
          <Table className="border-collapse border-spacing-0">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length > 0 ? (
                rooms.map((room, i) => (
                  <TableRow key={room.room_id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{room.room_id}</TableCell>
                    <TableCell>{room.departments.name}</TableCell>
                    <TableCell>{room.room_type}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>
                            {room.current_occupancy || 0} / {room.capacity}
                          </span>
                          <span>
                            {Math.round(room.occupancy_percentage || 0)}%
                          </span>
                        </div>
                        <Progress
                          value={room.occupancy_percentage || 0}
                          color={
                            room.available_beds === 0
                              ? 'bg-[var(--color-red)]'
                              : ((room.available_beds ?? 0) / room.capacity) *
                                    100 <=
                                  50
                                ? 'bg-[var(--color-yellow)]'
                                : 'bg-[var(--color-green)]'
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getAvailabilityBadge(room)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No rooms found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoomAvailabilityTable
