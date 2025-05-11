"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Loader2, FlaskConical, Search } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DispenseButtonProps {
  onDispenseSuccess?: () => Promise<void>;
}

interface Record {
  record_id: string;
  symptoms: string;
  patient_status: string;
  visit_date: string;
  visit_status: string;
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
  category: string;
  description: string;
  unit: string;
  quantity: number;
  min_stock_level: number;
  supplier: string;
  expiry_date: string;
  updated_at: string;
}

export default function DispenseButton({ onDispenseSuccess }: DispenseButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ record_id: "", medicine_id: "", quantity: "" });
  const [records, setRecords] = useState<Record[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedicineDetails, setSelectedMedicineDetails] = useState<Medicine | null>(null);
  const [selectedRecordDetails, setSelectedRecordDetails] = useState<Record | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isDialogOpen) {
      fetchRecords();
      fetchMedicines();
    } else {
      setFormData({ record_id: "", medicine_id: "", quantity: "" });
      setSelectedMedicineDetails(null);
      setSelectedRecordDetails(null);
      setError(null);
    }
  }, [isDialogOpen]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/appointments");
      if (!res.ok) {
        throw new Error("Failed to fetch records");
      }
      const data = await res.json();
      setRecords(data);
    } catch (err: any) {
      toast.error(`Error fetching records: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/medicine");
      if (!res.ok) {
        throw new Error("Failed to fetch medicines");
      }
      const data = await res.json();
      setMedicines(data);
    } catch (err: any) {
      toast.error(`Error fetching medicines: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispenseMedicine = async () => {
    const { record_id, medicine_id, quantity } = formData;

    if (!record_id) {
      setError("Please select a medical record");
      return;
    }

    if (!medicine_id) {
      setError("Please select a medicine");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    const selectedMedicine = medicines.find((medicine) => medicine.medicine_id === medicine_id);

    if (selectedMedicine && Number(quantity) > selectedMedicine.quantity) {
      setError(`Quantity cannot exceed available stock (${selectedMedicine.quantity}).`);
      return;
    }

    setError(null);

    setIsLoading(true);
    try {
      const res = await fetch("/api/medicine/dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_id: Number(record_id), medicine_id: Number(medicine_id), quantity: Number(quantity) }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Dispense failed");
      }
      toast.success("Medicine dispensed successfully!");
      setIsDialogOpen(false);
      onDispenseSuccess?.();
    } catch (err: any) {
      toast.error(`Error dispensing medicine: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineSelection = (value: string) => {
    setFormData((prev) => ({ ...prev, medicine_id: value }));
    const selected = medicines.find(med => med.medicine_id === value);
    setSelectedMedicineDetails(selected || null);
  };

  const handleRecordSelection = (value: string) => {
    setFormData((prev) => ({ ...prev, record_id: value }));
    const selected = records.find(rec => rec.record_id === value);
    setSelectedRecordDetails(selected || null);
  };

  const filteredRecords = records.filter(record => {
    const patientName = `${record.patients.users.first_name} ${record.patients.users.last_name}`.toLowerCase();
    const recordId = String(record.record_id);
    return patientName.includes(searchTerm.toLowerCase()) || recordId.includes(searchTerm);
  });

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        className="bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
        variant="default"
        size="lg"
      >
        <FlaskConical className="h-5 w-5" />
        Dispense Medicine
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Dispense Medicine</DialogTitle>
            <DialogDescription>
              Select a patient record and medicine to dispense
            </DialogDescription>
          </DialogHeader>
          
          <Separator className="my-2" />
          
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="record-search" className="text-sm font-medium">
                  Search Patient Records
                </Label>
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              </div>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  id="record-search"
                  placeholder="Search by patient name or ID..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="record-select" className="text-sm font-medium">
                Patient Record
              </Label>
              <Select
                onValueChange={handleRecordSelection}
                value={formData.record_id}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full" id="record-select">
                  <SelectValue placeholder="Select Record ID" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {filteredRecords.map((record) => (
                      <SelectItem key={record.record_id} value={record.record_id}>
                        {record.patients.users.first_name} {record.patients.users.last_name} (ID: {record.record_id})
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            
            {selectedRecordDetails && (
              <Card className="border-muted transition-all duration-200">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">Patient Information</CardTitle>
                    <Badge 
                      variant={selectedRecordDetails.patient_status === "Outpatient" ? "outline" : "default"}
                      className={selectedRecordDetails.patient_status === "Outpatient" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
                    >
                      {selectedRecordDetails.patient_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Patient Name</p>
                      <p className="font-medium">{selectedRecordDetails.patients.users.first_name} {selectedRecordDetails.patients.users.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visit Status</p>
                      <Badge variant={
                        selectedRecordDetails.visit_status === "Scheduled" ? "secondary" : 
                        selectedRecordDetails.visit_status === "Completed" ? "success" : 
                        "default"
                      }>
                        {selectedRecordDetails.visit_status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visit Date</p>
                      <p className="font-medium">{new Date(selectedRecordDetails.visit_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Symptoms</p>
                    <p className="text-sm bg-gray-50 p-2 rounded border mt-1">{selectedRecordDetails.symptoms}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="medicine-select" className="text-sm font-medium">
                Medicine
              </Label>
              <Select
                onValueChange={handleMedicineSelection}
                value={formData.medicine_id}
                disabled={isLoading || !formData.record_id}
              >
                <SelectTrigger className="w-full" id="medicine-select">
                  <SelectValue placeholder="Select Medicine" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {medicines.map((medicine) => (
                      <SelectItem key={medicine.medicine_id} value={medicine.medicine_id}>
                        {medicine.name} ({medicine.quantity} {medicine.unit}s available)
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            
            {selectedMedicineDetails && (
              <Card className="border-muted transition-all duration-200">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">{selectedMedicineDetails.name}</CardTitle>
                    <Badge variant="outline" className="bg-gray-100">
                      {selectedMedicineDetails.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <p className="text-sm mb-3">{selectedMedicineDetails.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Stock</p>
                      <p className="font-medium flex items-center gap-1">
                        <span>{selectedMedicineDetails.quantity}</span>
                        <span className="text-sm text-muted-foreground">{selectedMedicineDetails.unit}s</span>
                        {selectedMedicineDetails.quantity <= selectedMedicineDetails.min_stock_level && (
                          <Badge variant="destructive" className="ml-1 text-xs">Low Stock</Badge>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                      <p className="font-medium">{new Date(selectedMedicineDetails.expiry_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-medium">{selectedMedicineDetails.supplier}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="quantity-input" className="text-sm font-medium">
                Quantity to Dispense
              </Label>
              <Input
                id="quantity-input"
                name="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                type="number"
                min="1"
                max={selectedMedicineDetails?.quantity.toString()}
                className="w-full"
                disabled={isLoading || !formData.medicine_id}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 text-sm">
                {error}
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDispenseMedicine}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !formData.record_id || !formData.medicine_id || !formData.quantity}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Dispense Medicine'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
