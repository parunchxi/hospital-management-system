import React, { useState, useEffect } from 'react'
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
  // State for fetched item name and price
  const [itemInfo, setItemInfo] = useState<{ name: string; price: number | undefined } | null>(null)
  const [itemLoading, setItemLoading] = useState(false)
  const [itemError, setItemError] = useState<string | null>(null)

  // Fetch all medicines for dropdown
  const [allMedicines, setAllMedicines] = useState<any[]>([])
  useEffect(() => {
    if (newItem.itemType === 'Medicine') {
      fetch('/api/medicine')
        .then((res) => res.json())
        .then((data) => setAllMedicines(Array.isArray(data) ? data : []))
        .catch(() => setAllMedicines([]))
    }
  }, [newItem.itemType])

  // Fetch all rooms for dropdown
  const [allRooms, setAllRooms] = useState<any[]>([])
  useEffect(() => {
    if (newItem.itemType === 'Room') {
      fetch('/api/rooms')
        .then((res) => res.json())
        .then((data) => setAllRooms(Array.isArray(data) ? data : []))
        .catch(() => setAllRooms([]))
    }
  }, [newItem.itemType])

  // Fetch item name and price when itemType and itemIdRef change (except for Treatment)
  useEffect(() => {
    const fetchItemInfo = async () => {
      setItemInfo(null)
      setItemError(null)
      if (!newItem.itemIdRef || !newItem.itemType || newItem.itemType === 'Treatment') return
      setItemLoading(true)
      try {
        let url = ''
        if (newItem.itemType === 'Medicine') {
          url = `/api/medicine?id=${newItem.itemIdRef}`
        } else if (newItem.itemType === 'Room') {
          url = `/api/rooms?id=${newItem.itemIdRef}`
        }
        if (!url) return
        const res = await fetch(url)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        // For medicine, expect array or object with name and price
        if (newItem.itemType === 'Medicine') {
          // Use the same logic as the doctor's stock table: show only the name
          // The API returns an array of medicines, find the one with matching id
          let med = null
          if (Array.isArray(data)) {
            med = data.find((m) => String(m.medicine_id || m.id) === String(newItem.itemIdRef))
          } else if (data && (data.medicine_id || data.id)) {
            if (String(data.medicine_id || data.id) === String(newItem.itemIdRef)) med = data
          }
          setItemInfo(med ? { name: med.name, price: undefined } : null)
        } else if (newItem.itemType === 'Room') {
          const room = Array.isArray(data) ? data[0] : data
          setItemInfo(room ? { name: room.room_type, price: room.price_per_night } : null)
        }
      } catch (err: any) {
        setItemError('Item not found')
        setItemInfo(null)
      } finally {
        setItemLoading(false)
      }
    }
    fetchItemInfo()
  }, [newItem.itemType, newItem.itemIdRef])

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
          <label className="block text-sm font-medium">Select Item/ Item ID</label>
          {newItem.itemType === 'Medicine' ? (
            <Select
              value={newItem.itemIdRef}
              onValueChange={v => setNewItem((i: any) => ({ ...i, itemIdRef: v }))}
            >
              <SelectTrigger className="w-full border rounded p-2">
                <SelectValue placeholder="-- Select Medicine --" />
              </SelectTrigger>
              <SelectContent>
                {allMedicines.map((med) => (
                  <SelectItem key={med.name} value={med.name}>
                    {med.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : newItem.itemType === 'Room' ? (
            <Select
              value={newItem.itemIdRef}
              onValueChange={v => setNewItem((i: any) => ({ ...i, itemIdRef: v }))}
            >
              <SelectTrigger className="w-full border rounded p-2">
                <SelectValue placeholder="-- Select Room --" />
              </SelectTrigger>
              <SelectContent>
                {allRooms.map((room) => (
                  <SelectItem key={room.room_id || room.id} value={String(room.room_id || room.id)}>
                    {room.room_type} (Dept: {room.departments?.name || room.department_id || '-'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="number"
              required
              value={newItem.itemIdRef}
              onChange={e => setNewItem((i: any) => ({ ...i, itemIdRef: e.target.value }))}
              className="w-full border rounded p-2 bg-background text-foreground"
              placeholder={newItem.itemType === 'Treatment' ? 'Treatment ID' : ''}
            />
          )}
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
