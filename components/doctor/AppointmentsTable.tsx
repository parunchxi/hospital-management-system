import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface AppointmentsTableProps {
  onRowClick: (patient: any) => void
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

  if (isLoading) return <p>Loading appointments...</p>

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-black font-bold mb-4">Appointments</h2>
      <div className="overflow-auto max-h-[350px]">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="text-black">
              <th className="border border-gray-300 p-2">Patient Name</th>
              <th className="border border-gray-300 p-2">Case</th>
              <th className="border border-gray-300 p-2">Patient Status</th>
              <th className="border border-gray-300 p-2">Visit Date</th>
              <th className="border border-gray-300 p-2">Case Status</th>
            </tr>
          </thead>          <tbody>
            {appointments && appointments.length > 0 ? (
              appointments.slice(0, visibleAppointments).map((patient: any) => (
                <tr
                  key={patient.record_id}
                  className="text-black hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRowClick(patient)}
                >
                  <td className="border border-gray-300 p-2">
                    {patient.patients?.users?.first_name} {patient.patients?.users?.last_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {patient.symptoms || 'Not specified'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {patient.patient_status}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {patient.visit_date ? new Date(patient.visit_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {patient.visit_status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-gray-300 p-2 text-center" colSpan={5}>
                  No appointments available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {appointments && appointments.length > 3 && (
          <>
            {appointments.length > visibleAppointments && (
              <Button onClick={loadMoreAppointments} variant="outline" size="sm">Load More</Button>
            )}
            {!initialRowsShown && (
              <Button onClick={showLessAppointments} variant="outline" size="sm">Show Less</Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AppointmentsTable
