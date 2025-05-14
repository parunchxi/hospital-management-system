import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Patient = {
  patient_id: number
  users: { first_name: string; last_name: string }
}

type CreateBillingProps = {
  patients: Patient[]
  newBilling: { patientId: string; totalPrice: string }
  billingFeedback: { ok: boolean; msg: string } | null
  setNewBilling: React.Dispatch<React.SetStateAction<any>>
  handleCreateBilling: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function CreateBillingSection({
  patients,
  newBilling,
  billingFeedback,
  setNewBilling,
  handleCreateBilling,
}: CreateBillingProps) {
  return (
    <section className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-center">Create Billing for the patient</h2>
      <form onSubmit={handleCreateBilling} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Patient</label>
          <Select value={newBilling.patientId} onValueChange={v => setNewBilling((b: any) => ({ ...b, patientId: v }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select Patient --" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.patient_id} value={String(p.patient_id)}>
                  {p.users.first_name} {p.users.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Price</label>
          <Input
            name="amount"
            type="number"
            value={newBilling.totalPrice}
            onChange={e => setNewBilling((b: any) => ({ ...b, totalPrice: e.target.value }))}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Create Billing
        </Button>
        {billingFeedback && (
          <p className={`mt-4 text-sm ${billingFeedback.ok ? 'text-green-600' : 'text-red-600'}`}>
            {billingFeedback.msg}
          </p>
        )}
      </form>
    </section>
  )
}
