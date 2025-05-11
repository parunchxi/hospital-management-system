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
import { Progress } from "@/components/ui/progress"

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
        if (!admissionsResponse.ok) throw new Error('Failed to fetch admissions')
        const admissionsData = await admissionsResponse.json()
        
        const activeAdmissions = admissionsData.data ? 
          admissionsData.data.filter((admission: Admission) => admission.discharge_date === null) : 
          [];
        
        const admissionsByRoom: Record<string, number> = {}
        activeAdmissions.forEach((admission: Admission) => {
          if (admission.room_id) {
            admissionsByRoom[admission.room_id] = (admissionsByRoom[admission.room_id] || 0) + 1
          }
        })
        
        const roomsWithAvailability = roomsData.map((room: Room) => {
          const currentOccupancy = admissionsByRoom[room.room_id] || 0
          const availableBeds = Math.max(0, room.capacity - currentOccupancy)
          const occupancyPercentage = (currentOccupancy / room.capacity) * 100
          
          return {
            ...room,
            current_occupancy: currentOccupancy,
            available_beds: availableBeds,
            occupancy_percentage: occupancyPercentage
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
    if (room.available_beds === 0) return <Badge variant="destructive">Full</Badge>
    if (room.available_beds === room.capacity) return <Badge variant="outline">Empty</Badge>
    return <Badge variant="secondary">{room.available_beds} available</Badge>
  }

  if (isLoading) return (
    <Card>
      <CardContent className="p-6 flex justify-center items-center">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading room availability...
      </CardContent>
    </Card>
  )

  if (error) return (
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
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
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
                rooms.map((room) => (
                  <TableRow key={room.room_id}>
                    <TableCell>{room.room_id}</TableCell>
                    <TableCell>{room.departments.name}</TableCell>
                    <TableCell>{room.room_type}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{room.current_occupancy || 0} / {room.capacity}</span>
                          <span>{Math.round(room.occupancy_percentage || 0)}%</span>
                        </div>
                        <Progress 
                          value={room.occupancy_percentage || 0} 
                          className={
                            (room.occupancy_percentage || 0) === 100 ? "bg-red-200" : 
                            (room.occupancy_percentage || 0) > 80 ? "bg-amber-200" : 
                            "bg-green-200"
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getAvailabilityBadge(room)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
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
