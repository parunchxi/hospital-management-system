import { ShieldCheck, Pill } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function PharmacyBanner() {
  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm mt-8 mb-10">
      <CardContent className="flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-blue-100 p-3 rounded-full mb-4">
          <Pill className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Pharmacy Management
        </h1>
        <div className="flex items-center gap-2 mt-1 bg-white/80 px-4 py-2 rounded-full shadow-sm">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span className="text-base font-semibold text-blue-700">
            100% Genuine Medicines
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
