'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FoodLibraryItem {
  name: string
  emoji: string
  calories_per_serving: number
}

interface MealLog {
  id: string
  logged_at: string
  meal_label: string
  servings: number
  food_library: FoodLibraryItem
}

interface TodaysMealsProps {
  meals: MealLog[]
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function groupMealsByLabel(meals: MealLog[]) {
  const groups: Record<string, MealLog[]> = {}
  const order = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

  meals.forEach(meal => {
    const label = meal.meal_label || 'Snack'
    if (!groups[label]) {
      groups[label] = []
    }
    groups[label].push(meal)
  })

  return order
    .filter(label => groups[label])
    .map(label => ({ label, meals: groups[label] }))
}

export function TodaysMeals({ meals }: TodaysMealsProps) {
  if (meals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No meals logged yet today
          </p>
        </CardContent>
      </Card>
    )
  }

  const groupedMeals = groupMealsByLabel(meals)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {groupedMeals.map(({ label, meals: mealGroup }) => (
          <div key={label} className="space-y-2">
            <h3 className="font-semibold text-lg">{label}</h3>
            <div className="text-sm text-muted-foreground mb-2">
              {formatTime(mealGroup[0].logged_at)}
            </div>
            <div className="space-y-2">
              {mealGroup.map((meal) => {
                const totalCalories = meal.food_library.calories_per_serving * meal.servings
                return (
                  <div key={meal.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{meal.food_library.emoji}</span>
                      <span>{meal.food_library.name}</span>
                      {meal.servings !== 1 && (
                        <span className="text-sm text-muted-foreground">
                          × {meal.servings}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(totalCalories)} cal
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
