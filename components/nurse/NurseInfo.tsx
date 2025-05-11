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

interface NurseInfoCardProps {
  type?: 'name'
}

const NurseInfoCard: React.FC<NurseInfoCardProps> = ({ type }) => {
  const [nurse, setNurse] = useState<any>(null)
  const [isLoading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetch('/api/staff/me')
      .then((res) => res.json())
      .then((data) => {
        setNurse(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Load notes from localStorage when component mounts
    const savedNotes = localStorage.getItem('nurseNotes')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes !== undefined) {
      localStorage.setItem('nurseNotes', notes)
    }
  }, [notes])

  if (isLoading) return type === 'name' ? <span>Loading...</span> : <div>Loading...</div>
  if (!nurse) return type === 'name' ? <span>No data</span> : <div>No profile data</div>

  if (type === 'name') {
    return <span>{nurse.users.first_name}</span>
  }

  return (
    <Card >
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User2 className="h-5 w-5 text-muted-foreground" />
          Nurse Profile
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
        Nurse profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm text-muted-foreground">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4" />
            <span className="font-medium">
              {nurse.users.first_name} {nurse.users.last_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{nurse.users.phone_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{nurse.users.date_of_birth}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 mt-2">
            <BadgeCheck className="h-4 w-4" />
            <span><strong>Staff ID:</strong> {nurse.staff_id}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <GraduationCap className="h-4 w-4" />
            <span><strong>License:</strong> {nurse.license_number}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="h-4 w-4" />
            <span><strong>Department:</strong> {nurse.departments.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Briefcase className="h-4 w-4" />
            <span><strong>Joined:</strong> {nurse.date_hired}</span>
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
          <p className="text-xs text-muted-foreground mt-1">
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default NurseInfoCard
