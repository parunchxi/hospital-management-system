"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Hospital, ShieldCheck } from "lucide-react";

export default function PharmacyLanding() {
  const [quantity, setQuantity] = useState<number | string>(""); // State for quantity input
  const [medicineId, setMedicineId] = useState<string>(""); // State for medicine ID input
  const [dosage, setDosage] = useState<string>(""); // State for dosage input
  const [lowStockMedicines, setLowStockMedicines] = useState([
    { id: "1", name: "Ibuprofen", dosage: "200mg", quantity: 8 },
    { id: "2", name: "Cetirizine", dosage: "10mg", quantity: 5 },
    { id: "3", name: "Aspirin", dosage: "75mg", quantity: 3 },
  ]); // Example low stock medicines
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleUpdateQuantity = async (medicineId: string) => {
    if (!quantity) {
      alert("Please provide a valid quantity.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/medicine/${medicineId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: Number(quantity) }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      alert("Quantity updated successfully!");
      setLowStockMedicines((prev) =>
        prev.map((medicine) =>
          medicine.id === medicineId ? { ...medicine, quantity: Number(quantity) } : medicine
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (  
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-white shadow flex items-center px-8 py-4">
        {/* Hospital Logo */}
        <div className="flex items-center gap-2">
          <Hospital className="w-7 h-7 text-blue-600" />
          <span className="font-bold text-xl text-blue-700">HealthCareRx</span>
        </div>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <Input
            type="search"
            placeholder="Search medicines, healthcare items..."
            className="w-full max-w-md rounded-full bg-blue-50 border-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        {/* User Avatar/Name */}
        <div className="flex items-center gap-3">
          <img
            src="/avatar.png"
            alt="User"
            className="w-10 h-10 rounded-full object-cover bg-gray-200"
          />
          <span className="font-medium text-gray-700">John Doe</span>
        </div>
      </nav>
      {/* Pharmacy Banner */}
      <section className="w-full flex flex-col items-center justify-center bg-blue-100 rounded-lg shadow mt-8 mb-10 py-10 px-4">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Pharmacy</h1>
        <img
          src="./Doctor_picture.png"
          alt="Doctor"
          className="w-40 h-40 object-contain mb-4"
        />
        <div className="flex items-center gap-2 mt-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-semibold text-blue-700">100% Genuine Medicines</span>
        </div>
      </section>
      {/* Category Section */}
      {/* <section className="w-full px-4 mb-10">
        <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {[
            { label: "Pain Relief", img: "/categories/pain-relief.png" },
            { label: "Antibiotics", img: "/categories/antibiotics.png" },
            { label: "Heart Care", img: "/categories/heart-care.png" },
            { label: "Lung Care", img: "/categories/lung-care.png" },
            { label: "Diabetes Care", img: "/categories/diabetes-care.png" },
          ].map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center min-w-[120px] bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-14 h-14 object-contain mb-2"
                draggable={false}
              />
              <span className="text-sm font-medium text-gray-700">{cat.label}</span>
            </div>
          ))}
        </div>
      </section> */}
      {/* Main Content */}
      <main className="p-4 md:p-10">
        {/* Medicine Stock Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Medicine Stock</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Example Medicine Cards */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold mb-1">Paracetamol</span>
              <span className="text-gray-500 mb-2">500mg Tablet</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs mb-2">
                In Stock: 120
              </span>
              <span className="text-xs text-gray-400">Batch: PCT2025A</span>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold mb-1">Ibuprofen</span>
              <span className="text-gray-500 mb-2">200mg Tablet</span>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs mb-2">
                Low Stock: 8
              </span>
              <span className="text-xs text-gray-400">Batch: IBU2025B</span>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold mb-1">Amoxicillin</span>
              <span className="text-gray-500 mb-2">250mg Capsule</span>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs mb-2">
                Out of Stock
              </span>
              <span className="text-xs text-gray-400">Batch: AMX2025C</span>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start">
              <span className="text-lg font-semibold mb-1">Metformin</span>
              <span className="text-gray-500 mb-2">500mg Tablet</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs mb-2">
                In Stock: 60
              </span>
              <span className="text-xs text-gray-400">Batch: MET2025D</span>
            </div>
          </div>
        </section>
        {/* Low Stock Alert Table */}
        {/* <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center gap-2">
            <span>Low Stock Alert</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium">Medicine</th>
                  <th className="py-2 px-4 text-left font-medium">Dosage</th>
                  <th className="py-2 px-4 text-left font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4">Ibuprofen</td>
                  <td className="py-2 px-4">200mg Tablet</td>
                  <td className="py-2 px-4 text-yellow-700 font-semibold">8</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Cetirizine</td>
                  <td className="py-2 px-4">10mg Tablet</td>
                  <td className="py-2 px-4 text-yellow-700 font-semibold">5</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Aspirin</td>
                  <td className="py-2 px-4">75mg Tablet</td>
                  <td className="py-2 px-4 text-yellow-700 font-semibold">3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section> */}
        {/* High Priority Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-pink-700 flex items-center gap-2">
            <span>Low Stock Alert</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example urgent refill cards */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-yellow-600">
              <span className="text-base font-semibold text-gray-800">
                Medicine: <span className="font-normal">Ibuprofen</span>
              </span>
              <span className="text-sm text-gray-600">
                Dosage: <span className="font-medium text-yellow-700">200mg Tablet</span>
              </span>
              <span className="text-xs text-gray-500">Quantity : 8</span>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs w-max">
                Low Stock
              </span>
              <button className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-pink-700 text-xs font-semibold w-max">
                Acknowledge
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-red-600">
              <span className="text-base font-semibold text-gray-800">
                Medicine: <span className="font-normal">Cetirizine</span>
              </span>
              <span className="text-sm text-gray-600">
                Dosage: <span className="font-medium text-red-700">10mg Tablet</span>
              </span>
              <span className="text-xs text-gray-500">Quantity: 0</span>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs w-max">
                Out of Stock
              </span>
              <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-pink-700 text-xs font-semibold w-max">
                Acknowledge
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-red-600">
              <span className="text-base font-semibold text-gray-800">
                Patient: <span className="font-normal">Aspirin</span>
              </span>
              <span className="text-sm text-gray-600">
                Medicine: <span className="font-medium text-red-700">75mg Tablet</span>
              </span>
              <span className="text-xs text-gray-500">Quantity: 0</span>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs w-max">
                Out of Stock
              </span>
              <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-pink-700 text-xs font-semibold w-max">
                Acknowledge
              </button>
            </div>
          </div>
        </section>

        {/* Update Medicine Quantity Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Update Medicine Quantity</h2>
          <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="medicineId" className="block text-sm font-medium text-gray-700 mb-1">
                Medicine ID
              </label>
              <input
                id="medicineId"
                type="text"
                value={medicineId}
                onChange={(e) => setMedicineId(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Medicine ID"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                Dosage
              </label>
              <input
                id="dosage"
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Dosage (e.g., 500mg)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Quantity"
              />
            </div>
            <button
              onClick={() => handleUpdateQuantity(medicineId)} // Pass the medicineId explicitly
              disabled={loading}
              className={`w-full px-4 py-2 text-white rounded-md ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Quantity"}
            </button>
          </div>
        </section>

      </main>

      {/* Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        Low Stock Alerts
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
            <div className="space-y-4">
              {lowStockMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-500">{medicine.dosage}</p>
                    <p className="text-sm text-red-600">Quantity: {medicine.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="New Quantity"
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(medicine.id)}
                      disabled={loading}
                      className={`px-3 py-1 text-white rounded-md ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}