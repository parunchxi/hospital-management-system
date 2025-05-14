import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Invoice = {
  bill_id: number
  patient_name: string
  status: string
}

type UpdateBillingProps = {
  invoices: Invoice[]
  updateBilling: { billId: string; status: string }
  billingUpdateFeedback: { ok: boolean; msg: string } | null
  setUpdateBilling: React.Dispatch<React.SetStateAction<any>>
  handleUpdateBilling: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function UpdateBillingSection({
  invoices,
  updateBilling,
  billingUpdateFeedback,
  setUpdateBilling,
  handleUpdateBilling,
}: UpdateBillingProps) {
  return (
    <section className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Update Billing Status</h2>
      <form onSubmit={handleUpdateBilling} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Invoice</label>
          <Select value={updateBilling.billId} onValueChange={v => setUpdateBilling((b: any) => ({ ...b, billId: v }))}>
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select Invoice --" />
            </SelectTrigger>
            <SelectContent>
              {invoices.map((i) => (
                <SelectItem key={i.bill_id} value={String(i.bill_id)}>
                  INV-{i.bill_id.toString().padStart(3, '0')} — {i.patient_name} ({i.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium">New Status</label>
          <Select value={updateBilling.status} onValueChange={v => setUpdateBilling((b: any) => ({ ...b, status: v }))}>
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select Status --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Canceled">Cancelled(Invalid status)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Update Status
        </Button>
        {billingUpdateFeedback && (
          <p className={`mt-2 text-sm ${billingUpdateFeedback.ok ? 'text-green-600' : 'text-red-600'}`}>
            {billingUpdateFeedback.msg}
          </p>
        )}
      </form>
    </section>
  )
}
