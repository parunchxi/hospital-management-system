import React from 'react'

type Nurse = {
  staff_id: number
  users: { first_name: string; last_name: string }
}

type NurseAssignmentStatusProps = {
  nurses: Nurse[]
  roomsByNurse: Record<number, number[]>
}

export default function NurseAssignmentStatusSection({ nurses, roomsByNurse }: NurseAssignmentStatusProps) {
  return (
    <section className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Nurse Assignment Status</h2>
      <ul className="space-y-4">
        {nurses.map((nurse) => {
          const rooms = roomsByNurse[nurse.staff_id] || []
          return (
            <li key={nurse.staff_id} className="flex items-center justify-between">
              <span className="font-medium">
                {nurse.users.first_name} {nurse.users.last_name}
              </span>
              <span className="text-sm text-gray-500">
                {rooms.length > 0
                  ? `Assigned to room${rooms.length > 1 ? 's' : ''} ${rooms.join(', ')}`
                  : 'Available'}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
