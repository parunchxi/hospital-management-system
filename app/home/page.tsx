import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <main className="flex flex-col items-start justify-start w-full max-w-3xl px-4 py-10 mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome 👋</h1>
        <p className="text-muted-foreground mt-2">
          You're now signed in as{' '}
          <span className="font-medium">{user.email}</span>
        </p>
      </div>

      <div className="w-full border rounded-lg p-4 bg-muted/50">
        <h2 className="font-semibold text-lg mb-2">Your Profile</h2>
        <pre className="text-sm font-mono overflow-x-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <Link
        href="/home/reset-password"
        className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
      >
        Reset Password
      </Link>
    </main>
  )
}
