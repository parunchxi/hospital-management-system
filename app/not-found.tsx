'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <section className="text-center py-20 px-6 md:px-12">
      <div className="flex flex-col items-center space-y-4">
        <SearchX className="w-36 h-36 text-destructive" />
        <h1 className="text-3xl md:text-5xl font-bold text-destructive">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          The page you're looking for couldn't be found. It might have been
          moved or deleted.
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={() => router.push('/')} variant="default" size="lg">
          Go to Home
        </Button>
        <Button onClick={() => router.back()} variant="secondary" size="lg">
          Go Back
        </Button>
      </div>
    </section>
  )
}
