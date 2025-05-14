import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type User = {
  user_id: number
  first_name: string
  last_name: string
}

type CreateStaffProps = {
  userList: User[]
  createFeedback: { ok: boolean; msg: string } | null
  handleCreateStaff: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function CreateStaffSection({
  userList,
  createFeedback,
  handleCreateStaff,
}: CreateStaffProps) {
  return (
    <section className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Create Staff</h2>
      <form onSubmit={handleCreateStaff} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">User</label>
          <Select name="userId">
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select User --" />
            </SelectTrigger>
            <SelectContent>
              {userList.map((u) => (
                <SelectItem key={u.user_id} value={String(u.user_id)}>
                  {u.first_name} {u.last_name} (#{u.user_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Department</label>
          <Select name="departmentId">
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select Department --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Cardiology 1</SelectItem>
              <SelectItem value="2">Emergency 2</SelectItem>
              <SelectItem value="3">Pediatrics 3</SelectItem>
              <SelectItem value="4">Neurology 4</SelectItem>
              <SelectItem value="5">Orthopedics 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Staff Type</label>
          <Select name="staffType">
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select Staff Type --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Pharmacist">Pharmacist</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">License #</label>
          <Input name="licenseNumber" type="text" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Employment Status</label>
          <Select name="employmentStatus">
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select Employment Status --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On_Leave">On Leave</SelectItem>
              <SelectItem value="Resigned">Resigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">Date Hired</label>
          <Input name="dateHired" type="date" required className="w-full border rounded p-2" />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create
        </Button>
        {createFeedback && (
          <p className={`mt-2 text-sm ${createFeedback.ok ? 'text-green-600' : 'text-red-600'}`}>
            {createFeedback.msg}
          </p>
        )}
      </form>
    </section>
  )
}
