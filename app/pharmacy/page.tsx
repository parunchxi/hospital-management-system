"use client";
import { useEffect, useState } from "react";
import PharmacyBanner from "@/components/pharmacy/PharmacyBanner";
import MedicineStockGrid from "@/components/pharmacy/MedicineStockGrid";
import LowStockSection from "@/components/pharmacy/LowStockSection";
import DispenseButton from "@/components/pharmacy/DispenseButton";

export default function PharmacyLanding() {
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [highStockMedicines, setHighStockMedicines] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stockRes = await fetch("/api/medicine");
      if (!stockRes.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const stock = await stockRes.json();
      setStockData(stock);

      const lowStockData = stock.filter(
        (medicine: { quantity: number; min_stock_level: number }) =>
          medicine.quantity < medicine.min_stock_level
      );
      setLowStockMedicines(lowStockData);

      const highStockData = stock.filter(
        (medicine: { quantity: number; min_stock_level: number }) =>
          medicine.quantity >= medicine.min_stock_level
      );
      setHighStockMedicines(highStockData);
    } catch (err: any) {
      alert(`Error fetching data: ${err.message}`);
    }
  };

  const handleUpdateQuantity = async (medicineId: number, newQuantity: number) => {
    try {
      const res = await fetch(`/api/medicine/${medicineId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }
      fetchData();
    } catch (err: any) {
      alert(`Error updating quantity: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PharmacyBanner />
      <main className="p-4 md:p-10">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Medicine Stock</h2>
          <MedicineStockGrid medicines={highStockMedicines} />
        </section>

        <LowStockSection
          medicines={lowStockMedicines}
          handleUpdateQuantity={handleUpdateQuantity}
        />

        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-green-800">Dispense Medicine</h2>
          <DispenseButton onDispenseSuccess={fetchData} />
        </section>
      </main>
    </div>
  )
}
