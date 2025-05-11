"use client";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import PharmacyBanner from "@/components/pharmacy/PharmacyBanner";
import MedicineStockGrid from "@/components/pharmacy/MedicineStockGrid";
import LowStockSection from "@/components/pharmacy/LowStockSection";
import OutOfStockSection from "@/components/pharmacy/OutOfStockSection";
import DispenseButton from "@/components/pharmacy/DispenseButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, AlertTriangle, Pill, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
// Add a Medicine interface to define the expected structure
interface Medicine {
  medicine_id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  min_stock_level: number;
  supplier: string;
  expiry_date: string;
  updated_at: string;
}

export default function PharmacyLanding() {
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [outOfStockMedicines, setOutOfStockMedicines] = useState([]);
  const [highStockMedicines, setHighStockMedicines] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    outOfStock: 0,
    expiringThisMonth: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stockRes = await fetch("/api/medicine");
      if (!stockRes.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const stock = await stockRes.json();
      setStockData(stock);

      const outOfStockData = stock.filter(
        (medicine: { quantity: number }) => medicine.quantity === 0
      );

      const lowStockData = stock.filter(
        (medicine: { quantity: number; min_stock_level: number }) =>
          medicine.quantity <= medicine.min_stock_level && medicine.quantity > 0
      );

      const highStockData = stock.filter(
        (medicine: { quantity: number; min_stock_level: number }) =>
          medicine.quantity > medicine.min_stock_level
      );

      const outOfStockCount = outOfStockData.length;

      // Calculate medicines expiring this month
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const expiringCount = stock.filter(
        (medicine: { expiry_date: string }) => {
          const expiryDate = new Date(medicine.expiry_date);
          return expiryDate > today && expiryDate <= nextMonth;
        }
      ).length;

      setOutOfStockMedicines(outOfStockData);
      setLowStockMedicines(lowStockData);
      setHighStockMedicines(highStockData);

      setStats({
        totalMedicines: stock.length,
        lowStock: lowStockData.length,
        outOfStock: outOfStockCount,
        expiringThisMonth: expiringCount
      });
    } catch (err: any) {
      toast.error(`Error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
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
      await fetchData();
    } catch (err: any) {
      toast.error(`Error updating quantity: ${err.message}`);
    }
  };

  // Update the restock handler to handle specified quantities
  const handleRestockClick = (medicine: Medicine) => {
    // Check if there's a specified quantity in the medicine object
    const quantity = typeof medicine.quantity === 'number' && medicine.quantity > 0 
      ? medicine.quantity 
      : 1; // Default to adding 1 if no quantity specified
      
    handleUpdateQuantity(parseInt(medicine.medicine_id), quantity);
  };

  return (
    <div className="min-h-screen">
      <PharmacyBanner />

      <main className="container p-4 md:p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
              <Pill className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalMedicines}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Expiring This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold text-purple-600">{stats.expiringThisMonth}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="in-stock" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="in-stock">In Stock</TabsTrigger>
              <TabsTrigger value="low-stock" className="relative">
                Low Stock
                {stats.lowStock > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white rounded-full text-[10px] flex items-center justify-center">
                    {stats.lowStock}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="out-of-stock" className="relative">
                Out of Stock
                {stats.outOfStock > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">
                    {stats.outOfStock}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all">All Medicines</TabsTrigger>
            </TabsList>

            <DispenseButton onDispenseSuccess={fetchData} />
          </div>

          <TabsContent value="in-stock" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>In-Stock Medicines</CardTitle>
                <CardDescription>
                  Medicines with adequate stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <span>Loading medicines...</span>
                  </div>
                ) : (
                  <MedicineStockGrid medicines={highStockMedicines} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading low stock items...</span>
              </div>
            ) : (
              <LowStockSection
                medicines={lowStockMedicines}
                handleUpdateQuantity={handleUpdateQuantity}
              />
            )}
          </TabsContent>

          <TabsContent value="out-of-stock" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading out of stock items...</span>
              </div>
            ) : (
              <OutOfStockSection
                medicines={outOfStockMedicines}
                onRestock={handleRestockClick}
              />
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Medicines</CardTitle>
                <CardDescription>
                  Complete inventory of all medicines
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <span>Loading medicines...</span>
                  </div>
                ) : (
                  <MedicineStockGrid medicines={stockData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Show urgent sections on main page regardless of tab */}
        {outOfStockMedicines.length > 0 && (
          <div className="pt-2">
            <OutOfStockSection 
              medicines={outOfStockMedicines}
              onRestock={handleRestockClick}
            />
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
