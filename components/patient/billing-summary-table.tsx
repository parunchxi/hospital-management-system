'use client'

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

interface Invoice {
  id: string
  amount: string
  status: 'Paid' | 'Pending'
}

export default function BillingSummaryTable({
  billing,
}: {
  billing: Invoice[]
}) {
  const getStatusVariant = (status: 'Paid' | 'Pending') =>
    status === 'Paid' ? 'default' : 'destructive'

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
              <TableHead>Invoice ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billing.map(({ id, amount, status }, index) => (
              <TableRow key={index} className="text-sm [&>td]:py-3">
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell>{amount}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    View Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
