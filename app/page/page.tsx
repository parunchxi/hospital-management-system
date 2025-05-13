import { getUserRole } from '@/utils/get-role'
import { redirect } from 'next/navigation'

export default async function Home() {
  const userRoleResult = await getUserRole()
  const role = userRoleResult ? userRoleResult.role : null

  if (role === 'Patient') {
    redirect('/patient')
  } else if (role === 'Doctor') {
    redirect('/doctor')
  } else if (role === 'Pharmacist') {
    redirect('/pharmacy')
  } else if (role === 'Nurse') {
    redirect('/nurse')
  } else if (role === 'Admin') {
    redirect('/admin')
  }
}
