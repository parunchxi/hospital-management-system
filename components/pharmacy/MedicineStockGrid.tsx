import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PillIcon,
  Calendar,
  PackageIcon,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

interface Medicine {
  name: string
  dosage: string // You can map this to "unit" from the JSON
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  quantity: number
  batch: string // You can map this to "expiry_date" or another field if needed
}

interface Props {
  medicines: {
    medicine_id: number
    name: string
    category: string
    description: string
    unit: string
    quantity: number
    min_stock_level: number
    supplier: string
    expiry_date: string
    updated_at: string
  }[]
}

export default function MedicineStockGrid({ medicines }: Props) {
  const getStatus = (quantity: number, minStockLevel: number) => {
    if (quantity === 0) return 'out-of-stock'
    if (quantity <= minStockLevel) return 'low-stock'
    return 'in-stock'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" /> In Stock
          </Badge>
        )
      case 'low-stock':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
          >
            <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
          </Badge>
        )
      case 'out-of-stock':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          >
            <AlertCircle className="h-3 w-3 mr-1" /> Out of Stock
          </Badge>
        )
      default:
        return null
    }
  }

  if (medicines.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-1 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <ScrollArea className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
        {medicines.map((med) => {
          const status = getStatus(med.quantity, med.min_stock_level)
          const expiryDate = new Date(med.expiry_date)
          const isExpiringSoon =
            new Date() >
            new Date(expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000)

          return (
            <TooltipProvider key={med.medicine_id}>
              <Card
                className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                  status === 'out-of-stock'
                    ? 'border-red-200'
                    : status === 'low-stock'
                      ? 'border-yellow-200'
                      : ''
                }`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle
                        className="text-lg font-medium line-clamp-1"
                        title={med.name}
                      >
                        {med.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {med.category}
                      </CardDescription>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm">
                      <PillIcon className="h-4 w-4 text-gray-500" />
                      <span>
                        <span className="font-medium">{med.quantity}</span>{' '}
                        {med.unit}s
                      </span>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar
                            className={`h-3.5 w-3.5 ${isExpiringSoon ? 'text-red-500' : 'text-gray-500'}`}
                          />
                          <span
                            className={
                              isExpiringSoon
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                            }
                          >
                            {new Date(med.expiry_date).toLocaleDateString()}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>
                          {isExpiringSoon ? 'Expiring Soon' : 'Expiry Date'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="text-sm space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 overflow-hidden">
                          <PackageIcon className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          <span
                            className="text-gray-700 truncate"
                            title={med.supplier}
                          >
                            {med.supplier}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Supplier</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Stock level indicator */}
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div
                      className={`h-full rounded-full ${
                        status === 'out-of-stock'
                          ? 'bg-red-500'
                          : status === 'low-stock'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (med.quantity / (med.min_stock_level * 3)) * 100)}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TooltipProvider>
          )
        })}
      </div>
    </ScrollArea>
  )
}
