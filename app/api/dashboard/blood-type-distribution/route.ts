import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    // All possible blood types from the schema
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    // Get counts for each blood type
    const bloodTypeCounts = await Promise.all(
      bloodTypes.map(async (type) => {
        const { count, error } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true })
          .eq('blood_type', type);
          
        if (error) throw error;
        
        return {
          type: type,
          count: count || 0
        };
      })
    );
    
    // Filter out blood types with 0 counts (optional)
    const filteredData = bloodTypeCounts.filter(item => item.count > 0);
    
    // Sort by count in descending order (optional)
    filteredData.sort((a, b) => b.count - a.count);
    
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error fetching blood type distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blood type distribution data' },
      { status: 500 }
    );
  }
}
