import { createClient } from '@/utils/supabase/server'

export async function getUserRole() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Authentication failed:', userError)
    return null
  }

  const { data: staffData, error: staffError } = await supabase
    .from('medical_staff')
    .select('staff_type')
    .eq('user_id', user.id)
    .single()

  if (staffError) {
    if (staffError.code === 'PGRST116') {
      // No matching staff: probably a patient
      return 'Patient'
    }
    console.error('Error checking role:', staffError)
    return null
  }

  return staffData?.staff_type || 'Patient'
}
