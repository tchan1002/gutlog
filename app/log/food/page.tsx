'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { FoodGrid, type FoodLibraryItem } from '@/components/food/FoodGrid'
import { MealTray } from '@/components/food/MealTray'
import { Button } from '@/components/ui/button'

interface SelectedFood extends FoodLibraryItem {
  servings: number
}

export default function FoodLogPage() {
  // Use hardcoded test user ID
  const userId = '00000000-0000-0000-0000-000000000001'
  const [foods, setFoods] = useState<FoodLibraryItem[]>([])
  const [selectedFoods, setSelectedFoods] = useState<Map<string, SelectedFood>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMealTray, setShowMealTray] = useState(false)

  // Fetch food library
  useEffect(() => {
    async function fetchFoods() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from('food_library')
          .select('id, name, emoji, calories_per_serving, serving_size')
          .eq('user_id', userId)
          .order('name')

        if (fetchError) throw fetchError

        setFoods(data || [])
      } catch (err) {
        console.error('Error fetching foods:', err)
        setError(err instanceof Error ? err.message : 'Failed to load foods')
      } finally {
        setLoading(false)
      }
    }

    fetchFoods()
  }, [userId])

  const handleFoodToggle = (foodId: string) => {
    setSelectedFoods((prev) => {
      const newSelected = new Map(prev)

      if (newSelected.has(foodId)) {
        // Deselect
        newSelected.delete(foodId)
      } else {
        // Select with default 1 serving
        const food = foods.find((f) => f.id === foodId)
        if (food) {
          newSelected.set(foodId, { ...food, servings: 1 })
        }
      }

      return newSelected
    })
  }

  const handleServingsChange = (foodId: string, servings: number) => {
    setSelectedFoods((prev) => {
      const newSelected = new Map(prev)
      const food = newSelected.get(foodId)
      if (food) {
        newSelected.set(foodId, { ...food, servings })
      }
      return newSelected
    })
  }

  const handleReviewMeal = () => {
    if (selectedFoods.size === 0) return
    setShowMealTray(true)
  }

  const handleMealTrayClose = (open: boolean) => {
    if (!open) {
      // Clear selection when closing
      setSelectedFoods(new Map())
    }
    setShowMealTray(open)
  }

  // Show loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-full bg-muted animate-pulse rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  const selectedFoodArray = Array.from(selectedFoods.values())

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Log Your Meal</h1>
        <p className="text-muted-foreground">
          Select foods from your library to create a meal
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Food Grid */}
      <FoodGrid
        foods={foods}
        selectedFoodIds={new Set(selectedFoods.keys())}
        onFoodToggle={handleFoodToggle}
      />

      {/* Floating Action Button */}
      {selectedFoods.size > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none">
          <Button
            size="lg"
            className="pointer-events-auto shadow-lg min-w-[200px]"
            onClick={handleReviewMeal}
          >
            Review Meal ({selectedFoods.size} {selectedFoods.size === 1 ? 'item' : 'items'})
          </Button>
        </div>
      )}

      {/* Meal Tray Dialog */}
      <MealTray
        open={showMealTray}
        onOpenChange={handleMealTrayClose}
        selectedFoods={selectedFoodArray}
        onServingsChange={handleServingsChange}
        userId={userId}
      />
    </div>
  )
}
