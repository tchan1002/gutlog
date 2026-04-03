'use client'

import { Button } from '@/components/ui/button'

interface SymptomTagsProps {
  value: string[]
  onChange: (value: string[]) => void
}

const symptoms = [
  'Bloated',
  'Gassy',
  'Crampy',
  'Nauseous',
  'Heavy',
  'Normal',
  'Energized',
]

export function SymptomTags({ value, onChange }: SymptomTagsProps) {
  const toggleSymptom = (symptom: string) => {
    if (value.includes(symptom)) {
      onChange(value.filter((s) => s !== symptom))
    } else {
      onChange([...value, symptom])
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Symptoms (optional)</label>
      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom) => (
          <Button
            key={symptom}
            variant={value.includes(symptom) ? 'default' : 'outline'}
            onClick={() => toggleSymptom(symptom)}
            className="h-auto min-h-[48px] px-4 py-3 rounded-full"
          >
            {symptom}
          </Button>
        ))}
      </div>
    </div>
  )
}
