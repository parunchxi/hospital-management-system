import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PackageX, Plus, AlertCircle, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Medicine {
  medicine_id: string
  name: string
  category: string
  description: string
  unit: string
  quantity: number
  min_stock_level: number
  supplier: string
  expiry_date: string
  updated_at: string
}

interface Props {
  medicines: Medicine[]
  onRestock: (medicine: Medicine) => void
}

export default function OutOfStockSection({ medicines, onRestock }: Props) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  )
  const [addAmount, setAddAmount] = useState<number>(10) // Default to 10 for convenience
  const [loading, setLoading] = useState(false)

  const handleRestockClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setAddAmount(10) // Reset amount to default
    setShowDialog(true)
  }

  const handleAddAmount = async () => {
    if (!selectedMedicine || addAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0.')
      return
    }

    setLoading(true)
    try {
      await onRestock({
        ...selectedMedicine,
        quantity: addAmount - 1, // Subtract 1 because onRestock adds 1 internally
      })
      setShowDialog(false)
      toast.success(`Added ${addAmount} units to ${selectedMedicine.name}`)
    } catch (error) {
      toast.error('An error occurred while updating the quantity.')
    } finally {
      setLoading(false)
    }
  }

  if (medicines.length === 0) {
    return (
      <Card className="border-dashed text-center bg-muted/20">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full p-3 bg-green-50 dark:bg-green-900/20">
              <AlertCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Out of Stock Items</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              All medicines are currently in stock. Good job maintaining
              inventory levels!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-l-4 border-red-500 dark:border-red-700">
        <CardHeader className="pb-2">
          <div className="flex items-start">
            <div className="mr-2">
              <PackageX className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Out of Stock
              </CardTitle>
              <CardDescription>
                These medicines need immediate restocking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {medicines.length > 6 ? (
            <ScrollArea className="h-[310px] pr-4">
              <OutOfStockGrid
                medicines={medicines}
                onRestock={handleRestockClick}
              />
            </ScrollArea>
          ) : (
            <OutOfStockGrid
              medicines={medicines}
              onRestock={handleRestockClick}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding stock */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              Restock Out-of-Stock Medicine
              {selectedMedicine && (
                <Badge className="ml-2 bg-red-100 text-red-800 border-red-300">
                  Current: 0
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
                  {selectedMedicine.category} • {selectedMedicine.unit}
                </div>

                <div className="mt-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium py-1 px-2 rounded border border-red-200 dark:border-red-800/30 flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                  Currently out of stock
                </div>
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
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Adding:</span>
                    <span className="font-medium text-green-600 dark:text-green-500">
                      +{addAmount}
                    </span>
                  </div>
                  <div className="border-t border-muted mt-2 pt-2 flex justify-between">
                    <span>New stock level:</span>
                    <span className="font-semibold">{addAmount}</span>
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
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restocking...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Restock Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function OutOfStockGrid({ medicines, onRestock }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {medicines.map((medicine) => (
        <div key={medicine.medicine_id} className="group">
          <Card className="bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 hover:shadow-md transition-all overflow-hidden">
            <CardContent className="p-4 pt-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium line-clamp-1" title={medicine.name}>
                  {medicine.name}
                </div>
                <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs py-0.5 px-1.5 rounded font-medium">
                  Out of Stock
                </span>
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {medicine.category}
                  </span>
                  <span className="text-xs">{medicine.unit}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-red-100 dark:border-red-900/30">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white dark:bg-red-800 dark:hover:bg-red-700"
                    size="sm"
                    onClick={() => onRestock(medicine)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Restock Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
