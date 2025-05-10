import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Define proper TypeScript interfaces
interface MedicineStock {
  name: string;
}

interface MedicineDispenseItem {
  quantity: number;
  medicine_stock: MedicineStock | MedicineStock[];
}

export async function GET() {
  const supabase = await createClient();
  
  try {
    // Query the dispensed medicines with their names
    const { data, error } = await supabase
      .from('medicine_dispense')
      .select(`
        quantity,
        medicine_stock(name)
      `)
      .order('quantity', { ascending: false });
    
    if (error) throw error;
    
    // Group and sum quantities by medicine name
    const medicineMap = new Map<string, number>();
    
    (data as MedicineDispenseItem[]).forEach((item) => {
      if (!item.medicine_stock) return;
      
      // Handle both possible structures returned by Supabase
      let medicineName: string | undefined;
      if (Array.isArray(item.medicine_stock)) {
        // If it's an array, take the name from the first item
        medicineName = item.medicine_stock[0]?.name;
      } else {
        // If it's an object, take the name directly
        medicineName = (item.medicine_stock as MedicineStock).name;
      }
      
      if (!medicineName) return;
      
      const currentQuantity = medicineMap.get(medicineName) || 0;
      medicineMap.set(medicineName, currentQuantity + item.quantity);
    });
    
    // Convert map to array with the required format
    const formattedData = Array.from(medicineMap.entries()).map(([name, quantity]) => ({
      name,
      quantity
    }));
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching dispensed medicine data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dispensed medicine data' },
      { status: 500 }
    );
  }
}
