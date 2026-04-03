'use client'

import { Slider } from '@/components/ui/slider'

interface GutFeelSliderProps {
  value: number | null
  onChange: (value: number) => void
}

const emojiMap: { [key: number]: string } = {
  1: '😣',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
}

export function GutFeelSlider({ value, onChange }: GutFeelSliderProps) {
  const displayValue = value ?? 3

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">How does your gut feel? *</label>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{emojiMap[displayValue]}</span>
          <span className="text-lg font-semibold">{displayValue}</span>
        </div>
      </div>

      <Slider
        value={[displayValue]}
        onValueChange={(values) => {
          const newValue = Array.isArray(values) ? values[0] : values
          if (newValue !== undefined) {
            onChange(newValue)
          }
        }}
        min={1}
        max={5}
        step={1}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>😣 Rough</span>
        <span>😊 Great</span>
      </div>
    </div>
  )
}
