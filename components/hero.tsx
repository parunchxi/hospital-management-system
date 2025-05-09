'use client'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="text-center py-20 px-6 md:px-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Hospital Management System
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
        Efficiently manage patients, appointments, and staff using our secure,
        user-friendly platform built with Next.js, Tailwind CSS, and Supabase.
      </p>
      <div className="flex justify-center gap-2">
        <Button asChild variant="secondary" size="lg">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild variant="default" size="lg">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </section>
  )
}
