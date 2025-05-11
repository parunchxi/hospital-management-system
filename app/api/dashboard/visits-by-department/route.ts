import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Updated interfaces to handle different response structures
interface DepartmentData {
  name: string;
}

// Handle both array and object structures
interface MedicalStaffData {
  department_id: number;
  departments: DepartmentData | DepartmentData[];
}

interface MedicalRecordData {
  visit_date: string;
  doctor_id: number;
  medical_staff: MedicalStaffData | MedicalStaffData[];
}

export async function GET() {
  const supabase = await createClient();
  
  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Get medical records with doctor and department info from the last 7 days
    const { data: records, error: recordsError } = await supabase
      .from('medical_records')
      .select(`
        visit_date,
        doctor_id,
        medical_staff!medical_records_doctor_id_fkey(
          department_id,
          departments(name)
        )
      `)
      .gte('visit_date', sevenDaysAgoStr) // Filter for last 7 days
      .order('visit_date');
      
    if (recordsError) throw recordsError;
    
    // Define our fixed department names
    const fixedDepartmentNames = [
      'Cardiology',
      'Emergency',
      'Neurology',
      'Orthopedics',
      'Pediatrics'
    ];
    
    // Pre-populate with entries for all 7 days
    const recordsByDate: Record<string, Record<string, number>> = {};
    
    // Generate entries for all 7 days, even if no visits
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago to today
      const dateStr = date.toISOString().split('T')[0];
      
      recordsByDate[dateStr] = {};
      fixedDepartmentNames.forEach(dept => {
        recordsByDate[dateStr][dept] = 0;
      });
    }
    
    // Process actual records
    (records as MedicalRecordData[]).forEach(record => {
      // Extract only the date part (YYYY-MM-DD)
      const fullDate = record.visit_date;
      const dateObj = new Date(fullDate);
      const visitDate = dateObj.toISOString().split('T')[0];
      
      // Handle both object and array structures for medical_staff
      let departmentName: string | undefined;
      
      if (record.medical_staff) {
        if (Array.isArray(record.medical_staff)) {
          // If it's an array
          const staff = record.medical_staff[0];
          if (staff?.departments) {
            if (Array.isArray(staff.departments)) {
              departmentName = staff.departments[0]?.name;
            } else {
              departmentName = staff.departments.name;
            }
          }
        } else {
          // If it's an object
          if (record.medical_staff.departments) {
            if (Array.isArray(record.medical_staff.departments)) {
              departmentName = record.medical_staff.departments[0]?.name;
            } else {
              departmentName = record.medical_staff.departments.name;
            }
          }
        }
      }
      
      // Only process if department matches one of our fixed departments
      if (!departmentName || !fixedDepartmentNames.includes(departmentName)) {
        return;
      }
      
      // Increment count for this department on this date
      if (recordsByDate[visitDate]) {
        recordsByDate[visitDate][departmentName] = 
          (recordsByDate[visitDate][departmentName] || 0) + 1;
      }
    });
    
    // Convert to array format with date field
    const result = Object.entries(recordsByDate).map(([date, deptCounts]) => {
      return {
        date,
        ...deptCounts
      };
    });
    
    // Sort by date
    result.sort((a, b) => a.date.localeCompare(b.date));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching visits by department:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visits by department data', details: String(error) },
      { status: 500 }
    );
  }
}
