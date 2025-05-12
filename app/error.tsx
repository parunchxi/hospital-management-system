'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error?: Error
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    if (error) {
      console.log('Error details:', error)
    }
  }, [error])

  return (
    <section className="text-center py-20 px-6 md:px-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-destructive">
        Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
        {error?.message ??
          'An unexpected error occurred. Please try again later.'}
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={reset} variant="destructive" size="lg">
          Try Again
        </Button>
        <Button onClick={() => router.push('/')} variant="secondary" size="lg">
          Go to Home
        </Button>
      </div>
    </section>
  )
}
