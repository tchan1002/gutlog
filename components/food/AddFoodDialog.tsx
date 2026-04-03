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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase'

interface AddFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess: () => void
}

export function AddFoodDialog({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: AddFoodDialogProps) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [category, setCategory] = useState('')
  const [caloriesPerServing, setCaloriesPerServing] = useState('')
  const [servingSize, setServingSize] = useState('')
  const [isPantryStaple, setIsPantryStaple] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!caloriesPerServing || isNaN(Number(caloriesPerServing))) {
      setError('Valid calories per serving is required')
      return
    }
    if (!servingSize.trim()) {
      setError('Serving size is required')
      return
    }

    // Validate emoji (should be single character or empty)
    if (emoji && emoji.length > 2) {
      setError('Emoji should be a single character')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase
        .from('food_library')
        .insert({
          user_id: userId,
          name: name.trim(),
          emoji: emoji.trim() || '🍽️',
          category: category.trim() || null,
          calories_per_serving: parseInt(caloriesPerServing),
          serving_size: servingSize.trim(),
          is_pantry_staple: isPantryStaple,
        })

      if (insertError) {
        // Check if it's a table doesn't exist error
        if (insertError.message.includes('relation') && insertError.message.includes('does not exist')) {
          throw new Error('Database not set up. Please run the SQL migrations first.')
        }
        throw insertError
      }

      // Success - reset form and close
      setName('')
      setEmoji('🍽️')
      setCategory('')
      setCaloriesPerServing('')
      setServingSize('')
      setIsPantryStaple(false)
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error('Error adding food item:', err)
      setError(err instanceof Error ? err.message : 'Failed to add food item')
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (!isSaving) {
      onOpenChange(false)
      // Reset error when closing
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Food Item</DialogTitle>
          <DialogDescription>
            Add a new food item to your library
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grilled Chicken"
              disabled={isSaving}
              required
            />
          </div>

          {/* Emoji */}
          <div className="space-y-2">
            <label htmlFor="emoji" className="text-sm font-medium">
              Emoji
            </label>
            <Input
              id="emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🍽️"
              maxLength={2}
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Single emoji character (default: 🍽️)
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., protein, vegetable, fruit"
              disabled={isSaving}
            />
          </div>

          {/* Calories per Serving */}
          <div className="space-y-2">
            <label htmlFor="calories" className="text-sm font-medium">
              Calories per Serving <span className="text-destructive">*</span>
            </label>
            <Input
              id="calories"
              type="number"
              value={caloriesPerServing}
              onChange={(e) => setCaloriesPerServing(e.target.value)}
              placeholder="e.g., 180"
              min="0"
              disabled={isSaving}
              required
            />
          </div>

          {/* Serving Size */}
          <div className="space-y-2">
            <label htmlFor="servingSize" className="text-sm font-medium">
              Serving Size <span className="text-destructive">*</span>
            </label>
            <Input
              id="servingSize"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              placeholder="e.g., 4 oz, 1 cup, 2 pieces"
              disabled={isSaving}
              required
            />
          </div>

          {/* Is Pantry Staple */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pantryStaple"
              checked={isPantryStaple}
              onCheckedChange={setIsPantryStaple}
              disabled={isSaving}
            />
            <label
              htmlFor="pantryStaple"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Pantry staple
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add to Library'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
