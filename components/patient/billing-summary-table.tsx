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

interface BillingItem {
  item_id: number;
  quantity: number;
  item_type: string;
  unit_price: number;
  description: string;
  item_id_ref: number;
  total_price: number;
}

interface Billing {
  bill_id: number;
  total_price: number;
  status: 'Paid' | 'Pending';
  created_at: string;
  updated_at: string;
  billing_items: BillingItem[];
}

interface Props {
  appointments: { status: string }[];
  billing: Billing[];
}

export default function BillingSummaryTable({
  billing,
}: Props) {
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
            {billing.map(({ bill_id, total_price, status }, index) => (
              <TableRow key={index} className="text-sm [&>td]:py-3">
                <TableCell className="font-medium">{bill_id}</TableCell>
                <TableCell>${total_price.toFixed(2)}</TableCell>
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
