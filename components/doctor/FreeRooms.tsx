import React, { useState, useEffect } from 'react'

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

  if (isLoading) return <p>Loading rooms...</p>

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-black font-bold mb-4">Room Availability</h2>
      <div className="overflow-auto max-h-[200px]">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="text-black">
              <th className="border border-gray-300 p-2">Room</th>
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room.room_id} className="text-black">
                  <td className="border border-gray-300 p-2">{room.room_id}</td>
                  <td className="border border-gray-300 p-2">{room.departments.name}</td>
                  <td className="border border-gray-300 p-2">{room.room_type}</td>
                  <td className="border border-gray-300 p-2">{room.capacity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-gray-300 p-2 text-center" colSpan={4}>
                  No rooms available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RoomAvailabilityTable
