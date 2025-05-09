import { forgotPasswordAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams

  return (
    <form
      action={forgotPasswordAction}
      className="flex-1 flex flex-col w-full max-w-md min-w-64 text-foreground"
    >
      <div>
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <p className="text-sm text-secondary-foreground">
          Already have an account?{' '}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <SubmitButton pendingText="Sending link...">
          Reset Password
        </SubmitButton>

        <FormMessage message={searchParams} />
      </div>
    </form>
  )
}
