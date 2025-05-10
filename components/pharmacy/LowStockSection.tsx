import { useState } from "react";
import LowStockAlertCard from "./LowStockAlertCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Medicine {
  medicine_id: string;
  name: string;
  dosage: string;
  quantity: number;
}

interface Props {
  medicines: Medicine[];
  handleUpdateQuantity: (medicineId: number, newQuantity: number) => Promise<void>;
}

export default function LowStockSection({ medicines, handleUpdateQuantity }: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [addAmount, setAddAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setAddAmount(0); // Reset amount when opening dialog
    setShowDialog(true);
  };

  const handleAddAmount = async () => {
    if (!selectedMedicine || addAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    setLoading(true);
    try {
      await handleUpdateQuantity(
        parseInt(selectedMedicine.medicine_id),
        selectedMedicine.quantity + addAmount
      );
      setShowDialog(false);
      
      toast({
        title: "Stock Updated Successfully",
        description: `Added ${addAmount} units to ${selectedMedicine.name}`,
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred while updating the quantity.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12">
      <Card className="border-l-4 border-yellow-500">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-xl font-semibold text-gray-800">
              Low Stock Alert
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {medicines.map((med) => (
              <div key={med.medicine_id} className="relative group">
                <LowStockAlertCard
                  id={med.medicine_id}
                  name={med.name}
                  dosage={med.dosage}
                  quantity={med.quantity}
                />
                <Button
                  onClick={() => handleAddClick(med)}
                  className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white shadow-md rounded-full h-10 w-10 p-0 flex items-center justify-center transition-all opacity-90 group-hover:opacity-100"
                  size="icon"
                  variant="default"
                  aria-label={`Add stock for ${med.name}`}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog for adding stock */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Restock Medicine</span>
              {selectedMedicine && (
                <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  Current: {selectedMedicine.quantity}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {selectedMedicine && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-1 text-gray-500">Medicine</div>
                <div className="text-lg font-semibold text-gray-900">{selectedMedicine.name}</div>
                <div className="text-sm text-gray-500">{selectedMedicine.dosage}</div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount to Add
              </Label>
              <Input
                id="amount"
                type="number"
                value={addAmount || ''}
                onChange={(e) => setAddAmount(Math.max(0, Number(e.target.value)))}
                min={1}
                className="w-full"
                placeholder="Enter quantity"
              />
              
              {selectedMedicine && addAmount > 0 && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                  New stock level will be: <span className="font-semibold">{selectedMedicine.quantity + addAmount}</span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAmount}
              disabled={loading || addAmount <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stock
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}