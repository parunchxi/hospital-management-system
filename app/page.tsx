import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/getRoles';
export default async function Users() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();
  const role = await getUserRole();
  return (
    <div>
      <h1>Role: {role}</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}