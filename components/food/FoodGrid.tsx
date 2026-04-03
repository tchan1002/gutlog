'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FoodLibraryItem {
  id: string
  name: string
  emoji: string
  calories_per_serving: number
  serving_size: string
}

interface FoodGridProps {
  foods: FoodLibraryItem[]
  selectedFoodIds: Set<string>
  onFoodToggle: (foodId: string) => void
  onAddFood?: () => void
}

export function FoodGrid({
  foods,
  selectedFoodIds,
  onFoodToggle,
  onAddFood,
}: FoodGridProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return foods

    const query = searchQuery.toLowerCase().trim()
    return foods.filter((food) =>
      food.name.toLowerCase().includes(query)
    )
  }, [foods, searchQuery])

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-lg font-semibold mb-2">No food items yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          Add your first item to start building your food library!
        </p>
        {onAddFood && (
          <Button size="lg" onClick={onAddFood}>
            Add Food Item
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Food Grid */}
      {filteredFoods.length === 0 && !onAddFood ? (
        <div className="text-center py-8 text-muted-foreground">
          No foods match your search
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Add Food Tile - Always First */}
          {onAddFood && (
            <Button
              onClick={onAddFood}
              variant="outline"
              className="h-auto min-h-[80px] flex flex-col items-center justify-center gap-2 p-3 border-dashed"
            >
              <span className="text-3xl">+</span>
              <span className="text-xs font-medium">Add Food</span>
            </Button>
          )}

          {/* Food Items */}
          {filteredFoods.map((food) => {
            const isSelected = selectedFoodIds.has(food.id)
            return (
              <Button
                key={food.id}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'h-auto min-h-[80px] flex flex-col items-center justify-center gap-2 p-3 transition-all',
                  isSelected && 'ring-2 ring-primary ring-offset-2'
                )}
                onClick={() => onFoodToggle(food.id)}
              >
                <span className="text-3xl">{food.emoji}</span>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs font-medium text-center line-clamp-2">
                    {food.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {food.calories_per_serving} cal
                  </span>
                </div>
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
