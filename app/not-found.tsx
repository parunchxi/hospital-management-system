'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <section className="text-center py-20 px-6 md:px-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-destructive">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
        The page you're looking for couldn't be found.
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={() => router.push('/')} variant="secondary" size="lg">
          Go to Home
        </Button>
        <Button onClick={() => router.back()} variant="destructive" size="lg">
          Go Back
        </Button>
      </div>
    </section>
  )
}
