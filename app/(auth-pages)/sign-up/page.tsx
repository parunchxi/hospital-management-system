'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import { signUpAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage as FieldMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const SignupSchema = z.object({
  date_of_birth: z.date({ required_error: 'Date of birth is required' }),
  gender: z.string().min(1, 'Gender is required'),
  blood_type: z.string().min(1, 'Blood type is required'),
})

export default function SignupWrapper(props: {
  searchParams: Promise<Message>
}) {
  const [message, setMessage] = React.useState<Message>()

  React.useEffect(() => {
    props.searchParams.then(setMessage)
  }, [props.searchParams])

  return <Signup message={message} />
}

function Signup({ message }: { message?: Message }) {
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      gender: '',
    },
  })

  const watchDate = form.watch('date_of_birth')
  const watchGender = form.watch('gender')
  const watchBloodType = form.watch('blood_type')

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen">
      <Form {...form}>
        <form
          action={signUpAction}
          className="flex-1 flex flex-col min-w-64 w-full max-w-md"
        >
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text-foreground">
            Already have an account?{' '}
            <Link
              className="text-foreground font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="first_name">First Name</Label>
            <Input name="first_name" placeholder="First Name" required />

            <Label htmlFor="last_name">Last Name</Label>
            <Input name="last_name" placeholder="Last Name" required />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? format(field.value, 'PPP')
                            : 'Pick a date'}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldMessage />
                </FormItem>
              )}
            />

            <input
              type="hidden"
              name="date_of_birth"
              value={watchDate ? format(watchDate, 'yyyy-MM-dd') : ''}
            />
            <input type="hidden" name="gender" value={watchGender} />
            <input type="hidden" name="blood_type" value={watchBloodType || ''} />

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

            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              type="password"
              name="confirm_password"
              placeholder="Confirm your password"
              minLength={6}
              required
            />

            <FormField
              control={form.control}
              name="blood_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Blood Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldMessage />
                </FormItem>
              )}
            />

            <Label htmlFor="emergency_contact">Emergency Contact</Label>
            <Input
              name="emergency_contact"
              placeholder="0812345678"
              type="text"
              minLength={10}
              maxLength={10}
              required
            />

            <SubmitButton pendingText="Signing up...">Sign up</SubmitButton>
            {message && <FormMessage message={message} />}
          </div>
        </form>
      </Form>
    </div>
  )
}
