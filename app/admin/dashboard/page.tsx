'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { StatCards } from '@/components/dashboard/stat-cards'
import { DepartmentAreaChart } from '@/components/dashboard/charts/department-area-chart'
import { GenderDistributionChart } from '@/components/dashboard/charts/gender-distribution-chart'
import { BarChartCard } from '@/components/dashboard/charts/bar-chart'
import { RevenueOverTimeChart } from '@/components/dashboard/charts/revenue-over-time-chart'
import { MedicineQuantityChart } from '@/components/dashboard/charts/medicine-quantity-chart'
import { fetchData } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { chartConfig } from './data' // Keep chart configuration for now

// Define types for our data
interface DashboardStats {
  stats: Array<{
    label: string;
    icon: string;
    value: string | number;
  }>;
  revenueByDept: any[];
  visitsByDept: any[];
  genderData: { name: string; value: number }[];
  bloodTypeData: { type: string; count: number }[];
  itemTypeData: { type: string; count: number }[];
  medicineQuantityData: { name: string; quantity: number }[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<Partial<DashboardStats>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all required data
        const statsResponse = await fetchData<DashboardStats['stats']>('dashboard/stats');
        const revenueByDeptResponse = await fetchData<DashboardStats['revenueByDept']>('dashboard/revenue-by-department');
        const visitsByDeptResponse = await fetchData<DashboardStats['visitsByDept']>('dashboard/visits-by-department');
        const genderDataResponse = await fetchData<DashboardStats['genderData']>('dashboard/gender-distribution');
        const bloodTypeDataResponse = await fetchData<DashboardStats['bloodTypeData']>('dashboard/blood-type-distribution');
        const itemTypeDataResponse = await fetchData<DashboardStats['itemTypeData']>('dashboard/item-type-count');
        const medicineQuantityDataResponse = await fetchData<DashboardStats['medicineQuantityData']>('dashboard/medicine-quantity');

        // Check if any request had an error
        if (statsResponse.error || 
            revenueByDeptResponse.error || 
            visitsByDeptResponse.error ||
            genderDataResponse.error ||
            bloodTypeDataResponse.error ||
            itemTypeDataResponse.error ||
            medicineQuantityDataResponse.error) {
          throw new Error('Failed to load some dashboard data');
        }

        // Set all data
        setDashboardData({
          stats: statsResponse.data,
          revenueByDept: revenueByDeptResponse.data,
          visitsByDept: visitsByDeptResponse.data,
          genderData: genderDataResponse.data,
          bloodTypeData: bloodTypeDataResponse.data,
          itemTypeData: itemTypeDataResponse.data,
          medicineQuantityData: medicineQuantityDataResponse.data,
        });
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div className="p-6 text-center text-destructive">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[100px] w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {dashboardData.stats && <StatCards data={dashboardData.stats} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboardData.revenueByDept && (
              <DepartmentAreaChart 
                title="Revenue by Department"
                data={dashboardData.revenueByDept}
                config={chartConfig}
              />
            )}
            
            {dashboardData.visitsByDept && (
              <DepartmentAreaChart 
                title="Visits by Department"
                data={dashboardData.visitsByDept}
                config={chartConfig}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dashboardData.genderData && (
              <GenderDistributionChart data={dashboardData.genderData} />
            )}
            
            {dashboardData.bloodTypeData && (
              <BarChartCard 
                title="Blood Type Distribution" 
                data={dashboardData.bloodTypeData} 
                dataKey="count" 
                categoryKey="type" 
                color="hsl(var(--chart-2))"
              />
            )}
            
            {dashboardData.itemTypeData && (
              <BarChartCard 
                title="Item Type Count" 
                data={dashboardData.itemTypeData} 
                dataKey="count" 
                categoryKey="type" 
                color="hsl(var(--chart-3))"
              />
            )}
            
            {dashboardData.medicineQuantityData && (
              <MedicineQuantityChart data={dashboardData.medicineQuantityData} />
            )}
          </div>
        </>
      )}
    </div>
  )
}