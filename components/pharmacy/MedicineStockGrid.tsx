import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PillIcon, Calendar, PackageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Medicine {
  name: string;
  dosage: string; // You can map this to "unit" from the JSON
  status: "in-stock" | "low-stock" | "out-of-stock";
  quantity: number;
  batch: string; // You can map this to "expiry_date" or another field if needed
}

interface Props {
  medicines: {
    medicine_id: number;
    name: string;
    category: string;
    description: string;
    unit: string;
    quantity: number;
    min_stock_level: number;
    supplier: string;
    expiry_date: string;
    updated_at: string;
  }[];
}

export default function MedicineStockGrid({ medicines }: Props) {
  const getStatus = (quantity: number, minStockLevel: number) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= minStockLevel) return "low-stock";
    return "in-stock";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> In Stock
          </Badge>
        );
      case "low-stock":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Low Stock
          </Badge>
        );
      case "out-of-stock":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Out of Stock
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {medicines.map((med) => {
        const status = getStatus(med.quantity, med.min_stock_level);
        const expiryDate = new Date(med.expiry_date);
        const isExpiringSoon = new Date() > new Date(expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return (
          <TooltipProvider key={med.medicine_id}>
            <Card 
              className="overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium line-clamp-1" title={med.name}>
                    {med.name}
                  </CardTitle>
                  {getStatusBadge(status)}
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm">
                    <PillIcon className="h-4 w-4 text-gray-500" />
                    <span>
                      <span className="font-medium">{med.quantity}</span> {med.unit}s
                    </span>
                  </div>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className={isExpiringSoon ? "text-red-600 font-medium" : ""}>
                          {new Date(med.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expiry Date</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex gap-1">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{med.category}</span>
                  </div>
                  
                  
                  <div className="flex items-center gap-1 overflow-hidden">
                    <PackageIcon className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                    <span className="text-gray-700 truncate" title={med.supplier}>
                      {med.supplier}
                    </span>
                  </div>
                </div>
                
                {/* Stock level indicator */}
                <div className="w-full h-1 bg-gray-100 rounded-full mt-2">
                  <div 
                    className={`h-full rounded-full ${
                      status === "out-of-stock" ? "bg-red-500" :
                      status === "low-stock" ? "bg-yellow-500" : "bg-green-500"
                    }`} 
                    style={{ 
                      width: `${Math.min(100, (med.quantity / (med.min_stock_level * 3)) * 100)}%` 
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TooltipProvider>
        );
      })}
    </div>
  );
}