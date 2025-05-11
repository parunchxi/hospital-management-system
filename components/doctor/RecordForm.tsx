'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Stethoscope, Heart, FileText, Activity, Pill } from 'lucide-react'

interface MedicalRecord {
  record_id?: string | number
  patient_id?: number
  visit_date: string
  patient_status: string
  visit_status: string
  doctor_id: number
  diagnosis?: string
  treatment?: string
  notes?: string
  symptoms?: string
  prescription?: string
  treatment_plan?: string
  medicine_prescribed?: string
  created_at?: string
  medical_staff?: {
    users?: {
      first_name: string
      last_name: string
    }
  }
}

interface RecordFormProps {
  record: MedicalRecord
  onSave: (updatedRecord: MedicalRecord) => void
  onCancel: () => void
}

const RecordForm: React.FC<RecordFormProps> = ({ record, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState<MedicalRecord>({
    ...record
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Edit Medical Record
          </CardTitle>
          <CardDescription>
            Update information for visit on {new Date(record.visit_date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visit_date">Visit Date</Label>
              <Input
                type="date"
                id="visit_date"
                name="visit_date"
                value={formData.visit_date.split('T')[0]}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit_status">Record Status</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="visit_status"
                name="visit_status"
                value={formData.visit_status}
                onChange={handleChange}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_status">Patient Status</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="patient_status"
                name="patient_status"
                value={formData.patient_status}
                onChange={handleChange}
              >
                <option value="Inpatient">Inpatient</option>
                <option value="Outpatient">Outpatient</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms" className="flex items-center gap-2">
              Symptoms
            </Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms || ''}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Diagnosis
            </Label>
            <Textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis || ''}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              Treatment
            </Label>
            <Textarea
              id="treatment"
              name="treatment"
              value={formData.treatment || ''}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prescription" className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-muted-foreground" />
              Prescription
            </Label>
            <Textarea
              id="prescription"
              name="prescription"
              value={formData.prescription || ''}
              onChange={handleChange}
              rows={2}
            />
          </div>


        </CardContent>
        <CardFooter className="flex justify-end gap-2 px-0 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default RecordForm
