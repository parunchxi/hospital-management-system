import { signUpAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default async function Signup(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="w-full flex-1 flex items-center justify-center h-screen p-4">
      <form className="flex flex-col min-w-64 w-full max-w-md">
        <h1 className="text-2xl font-medium mb-2">Sign up</h1>
        <p className="text-sm text-foreground mb-6">
          Already have an account?{' '}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>

        <div className="flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="first_name">First Name</Label>
          <Input name="first_name" placeholder="First Name" required />

          <Label htmlFor="last_name">Last Name</Label>
          <Input name="last_name" placeholder="Last Name" required />

          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input type="date" name="date_of_birth" required />

          <Label htmlFor="gender">Gender</Label>
          <select
            name="gender"
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <Label htmlFor="national_id">National ID</Label>
          <Input
            name="national_id"
            placeholder="1234567890123"
            type="text"
            minLength={13}
            maxLength={13}
            required
          />

          <Label htmlFor="address">Address</Label>
          <Input name="address" placeholder="Your address" required />

          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            name="phone_number"
            placeholder="0812345678"
            type="text"
            minLength={10}
            maxLength={10}
            required
          />

          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />

          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>

          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  )
}
