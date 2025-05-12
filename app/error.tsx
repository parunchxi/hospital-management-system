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
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="w-36 h-36 text-destructive" />
        <h1 className="text-3xl md:text-5xl font-bold text-destructive">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {error?.message ??
            'An unexpected error occurred. Please try again later.'}
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={reset} variant="default" size="lg">
          Try Again
        </Button>
        <Button onClick={() => router.push('/')} variant="secondary" size="lg">
          Go to Home
        </Button>
      </div>
    </section>
  )
}
