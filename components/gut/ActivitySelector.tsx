'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ActivitySelectorProps {
  value: string
  onChange: (value: string) => void
}

const activities = [
  { value: 'rest', label: 'Rest' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'active', label: 'Active' },
]

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Activity Level</label>
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
        <SelectTrigger className="w-full h-12">
          <SelectValue placeholder="Select activity level" />
        </SelectTrigger>
        <SelectContent>
          {activities.map((activity) => (
            <SelectItem key={activity.value} value={activity.value}>
              {activity.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
