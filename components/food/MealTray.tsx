'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ServingAdjuster } from './ServingAdjuster'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface FoodItem {
  id: string
  name: string
  emoji: string
  calories_per_serving: number
  serving_size: string
}

interface SelectedFood extends FoodItem {
  servings: number
}

interface MealTrayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedFoods: SelectedFood[]
  onServingsChange: (foodId: string, servings: number) => void
  userId: string
}

type MealLabel = 'breakfast' | 'lunch' | 'dinner' | 'snack'

function getMealSuggestion(): MealLabel {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 10) return 'breakfast'
  if (hour >= 10 && hour < 14) return 'lunch'
  if (hour >= 14 && hour < 17) return 'snack'
  if (hour >= 17 && hour < 22) return 'dinner'
  return 'snack'
}

export function MealTray({
  open,
  onOpenChange,
  selectedFoods,
  onServingsChange,
  userId,
}: MealTrayProps) {
  const router = useRouter()
  const [mealLabel, setMealLabel] = useState<MealLabel>(getMealSuggestion())
  const [timestamp, setTimestamp] = useState(() => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalCalories = selectedFoods.reduce(
    (sum, food) => sum + food.calories_per_serving * food.servings,
    0
  )

  const handleSave = async () => {
    if (selectedFoods.length === 0) {
      setError('Please select at least one food item')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()

      // Insert all food logs
      const logs = selectedFoods.map(food => ({
        user_id: userId,
        food_id: food.id,
        meal_label: mealLabel,
        servings: food.servings,
        logged_at: new Date(timestamp).toISOString(),
      }))

      const { error: insertError } = await supabase
        .from('food_logs')
        .insert(logs)

      if (insertError) throw insertError

      // Success - redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Error saving meal:', err)
      setError(err instanceof Error ? err.message : 'Failed to save meal')
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Your Meal</DialogTitle>
          <DialogDescription>
            Adjust servings and confirm your meal details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected Foods */}
          <div className="space-y-3">
            {selectedFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{food.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{food.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(food.calories_per_serving * food.servings)} cal
                    </div>
                  </div>
                </div>
                <ServingAdjuster
                  servings={food.servings}
                  onServingsChange={(servings) =>
                    onServingsChange(food.id, servings)
                  }
                />
              </div>
            ))}
          </div>

          {/* Total Calories */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Calories</span>
              <span className="text-2xl font-bold text-primary">
                {Math.round(totalCalories)}
              </span>
            </div>
          </div>

          {/* Meal Label */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Meal Type</label>
            <Select value={mealLabel} onValueChange={(value) => value && setMealLabel(value as MealLabel)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || selectedFoods.length === 0}
          >
            {isSaving ? 'Saving...' : 'Save Meal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
