import { signOutAction } from '@/app/actions'
import { hasEnvVars } from '@/utils/supabase/check-env-vars'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function AuthButton() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!hasEnvVars) {
    return (
      <div className="flex items-center justify-between gap-4">
        <Badge variant="default" className="font-normal pointer-events-none">
          Please update <code>.env.local</code> with your Supabase URL & anon
          key
        </Badge>

        <div className="flex gap-2">
          <Button
            asChild
            variant="secondary"
            size="sm"
            disabled
            className="pointer-events-none"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            asChild
            variant="default"
            size="sm"
            disabled
            className="pointer-events-none"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    )
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground sm:grid hidden">
        {user.email}
      </span>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild variant="secondary" size="sm">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild variant="default" size="sm">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  )
}
