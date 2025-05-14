import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Invoice = {
  bill_id: number
  patient_name: string
}

type AddBillingItemProps = {
  invoices: Invoice[]
  newItem: {
    billId: string
    itemType: string
    itemIdRef: string
    description: string
    quantity: string
    unitPrice: string
  }
  itemFeedback: { ok: boolean; msg: string } | null
  setNewItem: React.Dispatch<React.SetStateAction<any>>
  handleAddItem: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function AddBillingItemSection({
  invoices,
  newItem,
  itemFeedback,
  setNewItem,
  handleAddItem,
}: AddBillingItemProps) {
  return (
    <section className="bg-card rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Add Billing Item</h2>
      <form onSubmit={handleAddItem} className="space-y-4">
        {/* เลือก Invoice */}
        <div>
          <label className="block text-sm font-medium">Invoice</label>
          <Select value={newItem.billId} onValueChange={v => setNewItem((i: any) => ({ ...i, billId: v }))}>
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select Invoice --" />
            </SelectTrigger>
            <SelectContent>
              {invoices.map((i) => (
                <SelectItem key={i.bill_id} value={String(i.bill_id)}>
                  INV-{i.bill_id.toString().padStart(3, '0')} — {i.patient_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* ประเภท item */}
        <div>
          <label className="block text-sm font-medium">Item Type</label>
          <Select value={newItem.itemType} onValueChange={v => setNewItem((i: any) => ({ ...i, itemType: v }))}>
            <SelectTrigger className="w-full border rounded p-2">
              <SelectValue placeholder="-- Select Item Type --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medicine">Medicine</SelectItem>
              <SelectItem value="Treatment">Treatment</SelectItem>
              <SelectItem value="Room">Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* รหัส item (ID จากตาราง medicine/treatment/room) */}
        <div>
          <label className="block text-sm font-medium">Item ID</label>
          <Input
            type="number"
            required
            value={newItem.itemIdRef}
            onChange={e => setNewItem((i: any) => ({ ...i, itemIdRef: e.target.value }))}
            className="w-full border rounded p-2 bg-background text-foreground"
          />
        </div>
        {/* คำอธิบาย */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <Input
            type="text"
            required
            value={newItem.description}
            onChange={e => setNewItem((i: any) => ({ ...i, description: e.target.value }))}
            className="w-full border rounded p-2 bg-background text-foreground"
          />
        </div>
        {/* จำนวน */}
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <Input
            type="number"
            min="1"
            required
            value={newItem.quantity}
            onChange={e => setNewItem((i: any) => ({ ...i, quantity: e.target.value }))}
            className="w-full border rounded p-2 bg-background text-foreground"
          />
        </div>
        {/* ราคาต่อหน่วย */}
        <div>
          <label className="block text-sm font-medium">Unit Price</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            required
            value={newItem.unitPrice}
            onChange={e => setNewItem((i: any) => ({ ...i, unitPrice: e.target.value }))}
            className="w-full border rounded p-2 bg-background text-foreground"
          />
        </div>
        <Button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Add Item
        </Button>
        {itemFeedback && (
          <p className={`mt-2 text-sm ${itemFeedback.ok ? 'text-green-600' : 'text-red-600'}`}>
            {itemFeedback.msg}
          </p>
        )}
      </form>
    </section>
  )
}
