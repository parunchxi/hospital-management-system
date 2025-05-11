import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  User2,
  MapPin,
  Phone,
  BadgeCheck,
  Calendar,
  Building2,
  GraduationCap,
  Briefcase,
  StickyNote,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface DoctorInfoCardProps {
  type?: 'name'
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ type }) => {
  const [doctor, setDoctor] = useState<any>(null)
  const [isLoading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetch('/api/staff/me')
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Load notes from localStorage when component mounts
    const savedNotes = localStorage.getItem('doctorNotes')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes !== undefined) {
      localStorage.setItem('doctorNotes', notes)
    }
  }, [notes])

  if (isLoading)
    return type === 'name' ? <span>Loading...</span> : <div>Loading...</div>
  if (!doctor)
    return type === 'name' ? <span>No data</span> : <div>No profile data</div>

  if (type === 'name') {
    return <span>{doctor.users.first_name}</span>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User2 className="h-5 w-5 text-muted-foreground" />
          Doctor Profile
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Doctor profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm text-muted-foreground">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4" />
            <span className="font-medium">
              {doctor.users.first_name} {doctor.users.last_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{doctor.users.phone_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{doctor.users.date_of_birth}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 mt-2">
            <BadgeCheck className="h-4 w-4" />
            <span>
              <strong>Staff ID:</strong> {doctor.staff_id}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <GraduationCap className="h-4 w-4" />
            <span>
              <strong>License:</strong> {doctor.license_number}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="h-4 w-4" />
            <span>
              <strong>Department:</strong> {doctor.departments.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Briefcase className="h-4 w-4" />
            <span>
              <strong>Joined:</strong> {doctor.date_hired}
            </span>
          </div>
        </div>

        {/* Notes Section */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="h-4 w-4" />
            <span className="font-medium">Personal Notes</span>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            className="min-h-[100px] w-full"
          />
          <p className="text-xs text-muted-foreground mt-1"></p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DoctorInfoCard
