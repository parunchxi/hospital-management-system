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
  const getStatusClass = (status: string) => {
    switch (status) {
      case "in-stock": return "bg-green-100 text-green-700";
      case "low-stock": return "bg-yellow-100 text-yellow-700";
      case "out-of-stock": return "bg-red-100 text-red-700";
      default: return "";
    }
  };

  const getStatus = (quantity: number, minStockLevel: number) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= minStockLevel) return "low-stock";
    return "in-stock";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {medicines.map((med) => {
      const status = getStatus(med.quantity, med.min_stock_level);
      return (
        <div
        key={med.medicine_id}
        className="bg-white rounded-xl shadow p-5 flex flex-col items-start hover:shadow-lg transition-shadow duration-300"
        >
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-lg font-semibold">{med.name}</span>
          <span
          className={`inline-block px-3 py-1 ${getStatusClass(
            status
          )} rounded-full text-sm`}
          >
          {status === "in-stock"
            ? `In Stock`
            : status === "low-stock"
            ? `Low Stock`
            : "Out of Stock"}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Quantity:</span> {med.quantity}{" "}
          {med.unit}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Category:</span> {med.category}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Supplier:</span> {med.supplier}
        </div>
        <div className="text-xs text-gray-400">
          <span className="font-medium">Expiry:</span> {med.expiry_date}
        </div>
        </div>
      );
      })}
    </div>
  );
}