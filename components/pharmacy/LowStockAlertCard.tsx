import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, PillIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AlertProps {
  id: string
  name: string
  dosage: string
  quantity: number
  onRestock?: () => void
}

export default function LowStockAlertCard({
  id,
  name,
  dosage,
  quantity,
  onRestock,
}: AlertProps) {
  // Determine the urgency level based on quantity
  const isOutOfStock = quantity === 0
  const isVeryCritical = quantity <= 2

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-md',
        isOutOfStock &&
          'bg-red-50/50 border-red-300 dark:bg-red-900/10 dark:border-red-900/30',
        isVeryCritical &&
          !isOutOfStock &&
          'bg-orange-50/50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800/30',
        !isOutOfStock &&
          !isVeryCritical &&
          'border-yellow-300 dark:border-yellow-700/50',
      )}
    >
      <CardContent className="p-5 pb-3 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <span className="text-base font-semibold text-foreground">
            {name}
          </span>
          <Badge
            variant="outline"
            className={cn(
              'font-medium',
              isOutOfStock
                ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50'
                : isVeryCritical
                  ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50'
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50',
            )}
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <PillIcon
            className={cn(
              'h-3.5 w-3.5',
              isOutOfStock
                ? 'text-red-500 dark:text-red-400'
                : isVeryCritical
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-yellow-600 dark:text-yellow-400',
            )}
          />
          <span className="font-medium">{dosage}</span>
        </div>

        <div className="flex justify-between items-center mt-0.5">
          <span className="text-xs text-muted-foreground">
            Current Quantity:
          </span>
          <span
            className={cn(
              'text-sm font-bold',
              isOutOfStock
                ? 'text-red-600 dark:text-red-400'
                : isVeryCritical
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-yellow-600 dark:text-yellow-400',
            )}
          >
            {quantity}
          </span>
        </div>

        {/* Stock level progress bar */}
        <div className="h-1.5 w-full bg-muted rounded-full mt-1">
          <div
            className={cn(
              'h-full rounded-full',
              isOutOfStock
                ? 'bg-red-500 dark:bg-red-600'
                : isVeryCritical
                  ? 'bg-orange-500 dark:bg-orange-600'
                  : 'bg-yellow-500 dark:bg-yellow-600',
            )}
            style={{
              width: `${Math.max(5, Math.min(100, (quantity / 10) * 100))}%`,
            }}
          />
        </div>
      </CardContent>

      {onRestock && (
        <CardFooter className="p-0 pt-1">
          <Button
            onClick={onRestock}
            className={cn(
              'w-full rounded-t-none h-9 flex gap-1 items-center justify-center font-medium transition-colors',
              isOutOfStock
                ? 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800'
                : isVeryCritical
                  ? 'bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-800'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700',
            )}
            variant="default"
          >
            <Plus className="h-4 w-4" />
            {isOutOfStock ? 'Add Stock' : 'Restock'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
