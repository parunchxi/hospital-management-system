interface AlertProps {
    id: string;
    name: string;
    dosage: string;
    quantity: number;
  }
  
  export default function LowStockAlertCard({ id, name, dosage, quantity }: AlertProps) {
    return (
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-yellow-600">
        <span className="text-base font-semibold text-gray-800">
          Medicine: <span className="font-normal">{name}</span>
        </span>
        <span className="text-sm text-gray-600">
          Dosage: <span className="font-medium text-yellow-700">{dosage}</span>
        </span>
        <span className="text-xs text-gray-500">Quantity: {quantity}</span>
        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs w-max">
          Low Stock
        </span>
      </div>
    );
  }
  