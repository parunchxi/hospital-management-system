import React from 'react'
import { Calendar } from '@/components/ui/calendar'

const DoctorCalendar: React.FC = () => {
  return (
    <div className="bg-white p-4 shadow rounded flex flex-col items-center">
      <h2 className="text-black font-bold mb-4">Calendar</h2>
      <Calendar className="rounded-md border mx-auto" />
    </div>
  )
}

export default DoctorCalendar
