import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Nurse = {
  staff_id: number
  users: { first_name: string; last_name: string }
}
type Admission = {
  admission_id: number
  room_id: number
  nurse_id: number
}

type AssignNurseProps = {
  nurses: Nurse[]
  admissions: Admission[]
  selectedAdm: Admission | null
  isAssigning: boolean
  feedback: { ok: boolean; msg: string } | null
  handleAssign: (e: React.FormEvent<HTMLFormElement>) => void
  handleAdmissionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function AssignNurseSection({
  nurses,
  admissions,
  selectedAdm,
  isAssigning,
  feedback,
  handleAssign,
  handleAdmissionChange,
}: AssignNurseProps) {
  return (
    <section className=" bg-card shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Assign Nurse</h2>
      <form className="space-y-4" onSubmit={handleAssign}>
        {/* Admission dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Admission</label>
          <Select value={selectedAdm?.admission_id ? String(selectedAdm.admission_id) : ""} onValueChange={v => handleAdmissionChange({ target: { value: v } } as any)}>
            <SelectTrigger className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="-- Select Admission --" />
            </SelectTrigger>
            <SelectContent>
              {admissions.map((a) => (
                <SelectItem key={a.admission_id} value={String(a.admission_id)}>
                  #{a.admission_id} — Room {a.room_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Nurse dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Nurse</label>
          <Select name="nurseId">
            <SelectTrigger className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="-- Select Nurse --" />
            </SelectTrigger>
            <SelectContent>
              {nurses.map((n) => (
                <SelectItem key={n.staff_id} value={String(n.staff_id)}>
                  {n.users.first_name} {n.users.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Room display */}
        <div>
          <label className="block text-sm font-medium mb-1">Room</label>
          <Input
            readOnly
            value={selectedAdm ? `Room #${selectedAdm.room_id}` : ''}
            placeholder="Choose admission first"
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
          />
        </div>
        <Button
          disabled={!selectedAdm || isAssigning}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-100"
        >
          {isAssigning ? 'Assigning…' : 'Assign'}
        </Button>
      </form>
      {feedback && (
        <p className={`mt-4 text-sm ${feedback.ok ? 'text-green-600' : 'text-red-600'}`}>
          {feedback.msg}
        </p>
      )}
    </section>
  )
}
