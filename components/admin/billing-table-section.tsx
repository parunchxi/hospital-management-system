import React from 'react'
import { billingColumns } from "./billing-table-col"
import { DataTable } from "@/components/ui/data-table"

type BillingTableProps = {
  invoices: any[]
}

export default function BillingTableSection({ invoices }: BillingTableProps) {
  return (
    <section className="bg-card rounded-lg shadow p-6 mt-10">
      <h2 className="text-xl font-semibold mb-4">Billings for the Patient</h2>
      <DataTable columns={billingColumns} data={invoices} />
    </section>
  )
}
