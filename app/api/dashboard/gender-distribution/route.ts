import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/getRoles';



export async function GET() {
    const supabase = await createClient();
  try {
    // Query users table to count by gender using the count() method
    const { count: maleCount, error: maleError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('gender', 'Male');
      
    const { count: femaleCount, error: femaleError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('gender', 'Female');
      
    const { count: otherCount, error: otherError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('gender', 'Other');
      
    if (maleError || femaleError || otherError) {
      throw new Error('Error fetching gender distribution data');
    }

    const genderData = [
      { name: 'Male', value: maleCount || 0 },
      { name: 'Female', value: femaleCount || 0 },
      { name: 'Other', value: otherCount || 0 }
    ];
    
    return NextResponse.json(genderData);
  } catch (error) {
    console.error('Error fetching gender distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gender distribution data' },
      { status: 500 }
    );
  }
}
