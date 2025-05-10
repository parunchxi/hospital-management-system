import React, { useState, useEffect } from 'react'

interface DoctorInfoCardProps {
  type?: 'name'
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ type }) => {
  const [doctor, setDoctor] = useState<any>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/staff/me')
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (isLoading) return type === 'name' ? <span>Loading...</span> : <div>Loading...</div>
  if (!doctor) return type === 'name' ? <span>No data</span> : <div>No profile data</div>

  if (type === 'name') {
    return <span>{doctor.users.first_name}</span>
  }

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-black font-bold mb-4">Doctor Info</h2>
      <div className="text-black space-y-2">
        <div>
          <p><strong>First Name:</strong> {doctor.users.first_name}</p>
          <p><strong>Last Name:</strong> {doctor.users.last_name}</p>
          <p><strong>Gender:</strong> {doctor.users.gender}</p>
          <p><strong>Date of Birth:</strong> {doctor.users.date_of_birth}</p>
          <p><strong>National ID:</strong> {doctor.users.national_id}</p>
          <p><strong>Phone Number:</strong> {doctor.users.phone_number}</p>
        </div>
        <div className="pt-2 border-t border-gray-200 mt-2">
          <p><strong>Staff ID:</strong> {doctor.staff_id}</p>
          <p><strong>License Number:</strong> {doctor.license_number}</p>
          <p><strong>Staff Type:</strong> {doctor.staff_type}</p>
          <p><strong>Employment Status:</strong> {doctor.employment_status}</p>
          <p><strong>Date Hired:</strong> {doctor.date_hired}</p>
          <p><strong>Department:</strong> {doctor.departments.name}</p>
        </div>
      </div>
    </div>
  )
}

export default DoctorInfoCard
