"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface DispenseButtonProps {
  onDispenseSuccess?: () => Promise<void>;
}

interface Record {
  record_id: string;
  patients: {
    users: {
      first_name: string;
      last_name: string;
    };
  };
}

interface Medicine {
  medicine_id: string;
  name: string;
  quantity: number; // Add quantity to track available stock
}

export default function DispenseButton({ onDispenseSuccess }: DispenseButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ record_id: "", medicine_id: "", quantity: "" });
  const [records, setRecords] = useState<Record[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDialogOpen) {
      fetchRecords();
      fetchMedicines();
    }
  }, [isDialogOpen]);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/appointments"); 
      if (!res.ok) {
        throw new Error("Failed to fetch records");
      }
      const data = await res.json();
      setRecords(data);
    } catch (err: any) {
      alert(`Error fetching records: ${err.message}`);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await fetch("/api/medicine");
      if (!res.ok) {
        throw new Error("Failed to fetch medicines");
      }
      const data = await res.json();
      setMedicines(data);
    } catch (err: any) {
      alert(`Error fetching medicines: ${err.message}`);
    }
  };

  const handleDispenseMedicine = async () => {
    const { record_id, medicine_id, quantity } = formData;
    const selectedMedicine = medicines.find((medicine) => medicine.medicine_id === medicine_id);

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    if (selectedMedicine && Number(quantity) > selectedMedicine.quantity) {
      setError(`Quantity cannot exceed available stock (${selectedMedicine.quantity}).`);
      return;
    }

    setError(null); // Clear any previous errors

    try {
      const res = await fetch("/api/medicine-dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_id: Number(record_id), medicine_id: Number(medicine_id), quantity: Number(quantity) }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Dispense failed");
      }
      alert("Medicine dispensed successfully!");
      setIsDialogOpen(false); // Close the dialog
      onDispenseSuccess?.(); // Notify parent component
    } catch (err: any) {
      alert(`Error dispensing medicine: ${err.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="bg-green-600 text-white hover:bg-green-700">
        Dispense Medicine
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispense Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              onValueChange={(value) => setFormData((prev) => ({ ...prev, record_id: value }))}
              value={formData.record_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Record ID" />
              </SelectTrigger>
              <SelectContent>
                {records.map((record) => (
                  <SelectItem key={record.record_id} value={record.record_id}>
                    {record.patients.users.first_name} {record.patients.users.last_name} (Medical Record ID: {record.record_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setFormData((prev) => ({ ...prev, medicine_id: value }))}
              value={formData.medicine_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Medicine" />
              </SelectTrigger>
              <SelectContent>
                {medicines.map((medicine) => (
                  <SelectItem key={medicine.medicine_id} value={medicine.medicine_id}>
                    {medicine.name} (ID: {medicine.medicine_id}   Stock: {medicine.quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              type="number"
              min="1"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleDispenseMedicine} className="bg-blue-600 text-white hover:bg-blue-700">
              Submit
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
