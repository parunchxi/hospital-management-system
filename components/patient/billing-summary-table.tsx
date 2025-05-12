'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BillingItem {
  item_id: number
  quantity: number
  item_type: string
  unit_price: number
  description: string
  item_id_ref: number
  total_price: number
}

interface Billing {
  bill_id: number
  total_price: number
  status: 'Paid' | 'Pending'
  created_at: string
  updated_at: string
  billing_items: BillingItem[]
}

interface Props {
  appointments: { status: string }[]
  billing: Billing[]
}

export default function BillingSummaryTable({ billing }: Props) {
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const toggleRow = (billId: number) => {
    setExpandedRows((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId],
    )
  }

  const getStatusVariant = (status: 'Paid' | 'Pending') =>
    status === 'Paid'
      ? 'bg-[color:var(--color-green)] text-white'
      : 'bg-[color:var(--color-yellow)] text-white'

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="lg:col-span-2 order-2 lg:order-none">
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
        <CardDescription>Track your financial activity</CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Bill ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billing.map(
              (
                {
                  bill_id,
                  total_price,
                  status,
                  created_at,
                  updated_at,
                  billing_items,
                },
                index,
              ) => (
                <React.Fragment key={bill_id}>
                  <TableRow className="text-sm [&>td]:py-3">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      BILL-{bill_id}
                    </TableCell>
                    <TableCell>${total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusVariant(status)}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(created_at)}</TableCell>
                    <TableCell>{formatDate(updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRow(bill_id)}
                      >
                        {expandedRows.includes(bill_id)
                          ? 'Hide Details'
                          : 'Show More'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows.includes(bill_id) && (
                    <TableRow key={`${bill_id}-details`}>
                      <TableCell
                        colSpan={7}
                        className="bg-[color:var(--color-card)]"
                      >
                        <div className="p-4">
                          <h4 className="font-medium mb-2">Billing Items</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {billing_items.map((item, itemIndex) => (
                                <TableRow key={item.item_id}>
                                  <TableCell>{itemIndex + 1}</TableCell>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    ฿{item.unit_price.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    ฿{item.total_price.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ),
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
