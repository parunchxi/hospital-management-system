import { useState } from 'react'
import LowStockAlertCard from './LowStockAlertCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { AlertCircle, Plus, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Medicine {
  medicine_id: string
  name: string
  dosage: string
  quantity: number
}

interface Props {
  medicines: Medicine[]
  handleUpdateQuantity: (
    medicineId: number,
    newQuantity: number,
  ) => Promise<void>
}

export default function LowStockSection({
  medicines,
  handleUpdateQuantity,
}: Props) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  )
  const [addAmount, setAddAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const handleAddClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setAddAmount(0) // Reset amount when opening dialog
    setShowDialog(true)
  }

  const handleAddAmount = async () => {
    if (!selectedMedicine || addAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0.')
      return
    }

    setLoading(true)
    try {
      // Fix: Parse the medicine_id as a number
      await handleUpdateQuantity(
        parseInt(selectedMedicine.medicine_id),
        selectedMedicine.quantity + addAmount,
      )
      setShowDialog(false)

      toast.success(`Added ${addAmount} units to ${selectedMedicine.name}`)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the quantity.',
      )
    } finally {
      setLoading(false)
    }
  }

  // Sort medicines by quantity (lowest first for better urgency display)
  const sortedMedicines = [...medicines].sort((a, b) => a.quantity - b.quantity)

  if (medicines.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <Card className="border-l-4 border-yellow-500 dark:border-yellow-600">
        <CardHeader className="pb-2">
          <div className="flex items-start">
            <div className="mr-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Low Stock Alert
              </CardTitle>
              <CardDescription>
                These medicines require immediate restocking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedMedicines.length > 6 ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {sortedMedicines.map((med) => (
                  <LowStockAlertCard
                    key={med.medicine_id}
                    id={med.medicine_id}
                    name={med.name}
                    dosage={med.dosage}
                    quantity={med.quantity}
                    onRestock={() => handleAddClick(med)}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {sortedMedicines.map((med) => (
                <LowStockAlertCard
                  key={med.medicine_id}
                  id={med.medicine_id}
                  name={med.name}
                  dosage={med.dosage}
                  quantity={med.quantity}
                  onRestock={() => handleAddClick(med)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding stock */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              Restock Medicine
              {selectedMedicine && (
                <Badge
                  className={
                    selectedMedicine.quantity === 0
                      ? 'ml-2 bg-red-100 text-red-800 hover:bg-red-200 border-red-300'
                      : 'ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300'
                  }
                >
                  Current: {selectedMedicine.quantity}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {selectedMedicine && (
              <div className="mb-4 bg-muted/30 p-4 rounded-lg border border-muted">
                <div className="text-sm font-medium mb-1 text-muted-foreground">
                  Medicine
                </div>
                <div className="text-lg font-semibold">
                  {selectedMedicine.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedMedicine.dosage}
                </div>

                {selectedMedicine.quantity === 0 && (
                  <div className="mt-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium py-1 px-2 rounded border border-red-200 dark:border-red-800/30 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                    Currently out of stock
                  </div>
                )}
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
                onChange={(e) =>
                  setAddAmount(Math.max(0, Number(e.target.value)))
                }
                min={1}
                className="w-full"
                placeholder="Enter quantity"
              />

              {selectedMedicine && addAmount > 0 && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border border-muted">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span className="font-medium">
                      {selectedMedicine.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Adding:</span>
                    <span className="font-medium text-green-600 dark:text-green-500">
                      +{addAmount}
                    </span>
                  </div>
                  <div className="border-t border-muted mt-2 pt-2 flex justify-between">
                    <span>New stock level:</span>
                    <span className="font-semibold">
                      {selectedMedicine.quantity + addAmount}
                    </span>
                  </div>
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
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
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
  )
}
