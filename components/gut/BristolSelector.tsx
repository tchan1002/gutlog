'use client'

import { Button } from '@/components/ui/button'

interface BristolSelectorProps {
  value: number | null
  onChange: (value: number) => void
}

const bristolTypes = [
  { score: 1, label: 'Hard separate lumps', emoji: '💩' },
  { score: 2, label: 'Lumpy sausage', emoji: '💩' },
  { score: 3, label: 'Sausage with cracks', emoji: '💩' },
  { score: 4, label: 'Smooth sausage (ideal)', emoji: '💩' },
  { score: 5, label: 'Soft blobs', emoji: '💩' },
  { score: 6, label: 'Mushy pieces', emoji: '💩' },
  { score: 7, label: 'Entirely liquid', emoji: '💩' },
]

export function BristolSelector({ value, onChange }: BristolSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Bristol Stool Scale *</label>
      <div className="grid grid-cols-1 gap-2">
        {bristolTypes.map((type) => (
          <Button
            key={type.score}
            variant={value === type.score ? 'default' : 'outline'}
            onClick={() => onChange(type.score)}
            className="h-auto min-h-[48px] justify-start text-left px-4 py-3"
          >
            <span className="text-2xl mr-3">{type.emoji}</span>
            <span className="flex flex-col">
              <span className="font-semibold">Type {type.score}</span>
              <span className="text-xs opacity-80">{type.label}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
