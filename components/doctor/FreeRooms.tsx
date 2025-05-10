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
import { DoorOpen } from 'lucide-react'

interface Room {
  room_id: string
  room_type: string
  department_id: number
  price_per_night: number
  capacity: number
  departments: {
    name: string
  }
}

const RoomAvailabilityTable: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rooms?available=true')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (isLoading) return (
    <Card>
      <CardContent className="p-6 flex justify-center items-center">
        Loading rooms...
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
          Currently available rooms
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-auto max-h-[200px]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No rooms available
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
