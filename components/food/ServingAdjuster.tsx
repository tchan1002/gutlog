'use client'

import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon } from 'lucide-react'

interface ServingAdjusterProps {
  servings: number
  onServingsChange: (servings: number) => void
  minServings?: number
}

export function ServingAdjuster({
  servings,
  onServingsChange,
  minServings = 0.5
}: ServingAdjusterProps) {
  const handleDecrement = () => {
    const newValue = Math.max(minServings, servings - 0.5)
    onServingsChange(newValue)
  }

  const handleIncrement = () => {
    onServingsChange(servings + 0.5)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleDecrement}
        disabled={servings <= minServings}
      >
        <MinusIcon className="size-4" />
      </Button>
      <div className="min-w-16 text-center font-medium">
        {servings} {servings === 1 ? 'serving' : 'servings'}
      </div>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleIncrement}
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  )
}
