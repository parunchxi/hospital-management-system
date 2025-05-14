"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type Invoice = {
  bill_id: number
  patient_name: string
  total_price: number
  status: string
}

export const billingColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "bill_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{`INV-${row.original.bill_id.toString().padStart(3, "0")}`}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "patient_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Patient
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.patient_name,
    enableSorting: true,
  },
  {
    accessorKey: "total_price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>${row.original.total_price?.toFixed(2) ?? "0.00"}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <span
          className={`inline-block px-2 py-1 rounded text-xs ${
            status === "Paid"
              ? "bg-green-100 text-green-700"
              : status === "Cancelled"
              ? "bg-gray-100 text-gray-600"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      )
    },
    enableSorting: true,
  },
]
