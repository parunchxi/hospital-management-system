'use client'

import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Pill } from 'lucide-react'

const MedicineStockTable: React.FC = () => {
  const [medicineStock, setMedicineStock] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/medicine')
      .then((res) => res.json())
      .then((data) => {
        setMedicineStock(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch medicine stock')
        setLoading(false)
      })
  }, [])

  if (isLoading)
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          Loading medicine stock...
        </CardContent>
      </Card>
    )

  if (error)
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center text-destructive gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Pill className="h-5 w-5 text-muted-foreground" />
          Medicine Stock
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Available medicines in stock
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-auto max-h-[250px]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicineStock.length > 0 ? (
                medicineStock.map((medicine) => {
                  let status = 'OK'
                  let variant = 'outline'

                  if (medicine.quantity === 0) {
                    status = 'Out of Stock'
                    variant = 'destructive'
                  } else if (medicine.quantity < medicine.min_stock_level) {
                    status = 'Low'
                    variant = 'warning'
                  }

                  return (
                    <TableRow key={medicine.id || medicine.medicine_id}>
                      <TableCell>{medicine.name}</TableCell>
                      <TableCell className="text-center">
                        {medicine.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            status === 'Low' ? 'outline' : (variant as any)
                          }
                          className={
                            status === 'Low'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                              : ''
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No medicine stock available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default MedicineStockTable
