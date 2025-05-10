import { useState } from "react";
import LowStockAlertCard from "./LowStockAlertCard";

interface Medicine {
  medicine_id: string;
  name: string;
  dosage: string;
  quantity: number;
}

interface Props {
  medicines: Medicine[];
  handleUpdateQuantity: (medicineId: number, newQuantity: number) => Promise<void>;
}

export default function LowStockSection({ medicines, handleUpdateQuantity }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [addAmount, setAddAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowPopup(true);
  };

  const handleAddAmount = async () => {
    if (!selectedMedicine || addAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      await handleUpdateQuantity(
        parseInt(selectedMedicine.medicine_id),
        selectedMedicine.quantity + addAmount
      );
      setShowPopup(false);
      setAddAmount(0);
      setSuccessMessage(`Successfully added ${addAmount} to ${selectedMedicine.name}`);
      setTimeout(() => setSuccessMessage(null), 5000); // Clear the message after 5 seconds
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred while updating the quantity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4 text-pink-700 flex items-center gap-2">
        <span>Low Stock Alert</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((med) => (
          <div key={med.medicine_id} className="relative border border-gray-200 rounded-lg shadow-md ">
            <LowStockAlertCard
              id={med.medicine_id}
              name={med.name}
              dosage={med.dosage}
              quantity={med.quantity}
            />
            <button
              onClick={() => handleAddClick(med)}
              className="absolute bottom-4 right-4 bg-red-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Add stock for ${med.name}`}
            >
              +
            </button>
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transition-transform transform scale-100 duration-300">

            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add Quantity for <span className="text-pink-700">{selectedMedicine.name}</span>
            </h3>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(Math.max(0, Number(e.target.value)))}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder="e.g. 20"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              min={1}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAmount}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${loading
                  ? "bg-gray-400 cursor-not-allowed focus:ring-gray-400"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  }`}
              >
                {loading ? "Updating..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 transition transform animate-slide-in fade-in-out">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}