import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import { stringify } from 'querystring'

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

  if (isLoading) return <p>Loading medicine stock...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-white p-4 shadow rounded">
        {/* <tr>
              <td colSpan={4} className="border border-gray-300 p-2 text-left">
                <pre>{JSON.stringify(medicineStock, null, 2)}</pre>
              </td>
            </tr> */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-black font-bold">Medicine Stock</h2>
      </div>
      <div className="overflow-auto max-h-[250px]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="text-black">
              <th className="border border-gray-300 p-2">Medicine Name</th>
              <th className="border border-gray-300 p-2">Current Stock</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {medicineStock.length > 0 ? medicineStock.map((medicine) => {
              let status = 'OK'
              if (medicine.quantity === 0) status = 'Out of Stock'
              else if (medicine.quantity < medicine.min_stock_level) status = 'Low'
              return (
                <tr key={medicine.id || medicine.medicine_id} className="text-black">
                  <td className="border border-gray-300 p-2">{medicine.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{medicine.quantity}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <Badge
                      variant={status === 'Out of Stock' ? 'destructive' : 'outline'}
                      className={status === 'Low' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                    >
                      {status}
                    </Badge>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td className="border border-gray-300 p-2 text-center" colSpan={3}>
                  No medicine stock available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MedicineStockTable
