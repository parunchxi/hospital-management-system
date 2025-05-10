import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Updated interfaces to handle Supabase's nested join responses
interface Department {
  name: string;
}

interface Room {
  price_per_night: number;
  department: Department | Department[];
}

interface Admission {
  admission_date: string;
  discharge_date: string | null;
  room: Room | Room[];
}

export async function GET() {
  const supabase = await createClient();
  
  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();
    
    // Get admissions from the last 7 days with room and department info
    const { data: admissions, error: admissionsError } = await supabase
      .from('admissions')
      .select(`
        admission_date,
        discharge_date,
        room:room_id(
          price_per_night,
          department:department_id(name)
        )
      `)
      .gte('admission_date', sevenDaysAgoStr);
      
    if (admissionsError) throw admissionsError;
    
    // Define our fixed department names
    const fixedDepartmentNames = [
      'Cardiology',
      'Emergency',
      'Neurology',
      'Orthopedics',
      'Pediatrics'
    ];
    
    // Pre-populate with entries for all 7 days
    const revenueByDate: Record<string, Record<string, number>> = {};
    
    // Generate entries for all 7 days, even if no revenue
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago to today
      const dateStr = date.toISOString().split('T')[0];
      
      revenueByDate[dateStr] = {};
      fixedDepartmentNames.forEach(dept => {
        revenueByDate[dateStr][dept] = 0;
      });
    }
    
    // Process actual admissions
    admissions?.forEach((admission: any) => {
      // Extract room and department info, handling both array and object structures
      let departmentName: string | undefined;
      let pricePerNight = 0;
      
      // Handle room data which might be an array or object
      if (admission.room) {
        let roomData: any;
        
        if (Array.isArray(admission.room)) {
          roomData = admission.room[0];
        } else {
          roomData = admission.room;
        }
        
        if (roomData) {
          pricePerNight = roomData.price_per_night || 0;
          
          // Handle department data which might be an array or object
          if (roomData.department) {
            if (Array.isArray(roomData.department)) {
              departmentName = roomData.department[0]?.name;
            } else {
              departmentName = roomData.department.name;
            }
          }
        }
      }
      
      // Only process if department matches one of our fixed departments
      if (!departmentName || !fixedDepartmentNames.includes(departmentName)) {
        return;
      }
      
      // Calculate duration and distribute revenue across days
      const admissionDate = new Date(admission.admission_date);
      const dischargeDate = admission.discharge_date 
        ? new Date(admission.discharge_date) 
        : new Date(); // Use current date if not discharged
      
      // Loop through each day of the admission within our 7-day window
      const currentDate = new Date(admissionDate);
      
      while (currentDate <= dischargeDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Only count if the date is within our 7-day window
        if (revenueByDate[dateStr]) {
          revenueByDate[dateStr][departmentName] += pricePerNight;
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // Convert to array format with date field
    const result = Object.entries(revenueByDate).map(([date, deptRevenue]) => {
      return {
        date,
        ...deptRevenue
      };
    });
    
    // Sort by date
    result.sort((a, b) => a.date.localeCompare(b.date));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching revenue by department:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue by department data', details: String(error) },
      { status: 500 }
    );
  }
}
