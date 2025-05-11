import { SquarePen } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ButtonIcon({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      <SquarePen />
    </Button>
  )
}
