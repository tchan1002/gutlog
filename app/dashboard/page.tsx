'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

interface GutLog {
  id: string
  bristol_score: number
  gut_score: number
  tags: string[]
  activity: string
  note: string | null
  logged_at: string
}

// Group meals by meal_label and timestamp
interface GroupedMeal {
  meal_label: string
  logged_at: string
  items: MealLog[]
  totalCalories: number
}

export default function DashboardPage() {
  const [meals, setMeals] = useState<MealLog[]>([])
  const [gutLogs, setGutLogs] = useState<GutLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Get start of today in local timezone
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        // Fetch today's meals with food details
        const { data: mealsData, error: mealsError } = await supabase
          .from('food_logs')
          .select(`
            *,
            food_library (
              name,
              emoji,
              calories_per_serving
            )
          `)
          .gte('logged_at', startOfDay.toISOString())
          .order('logged_at', { ascending: false })

        if (mealsError) {
          console.error('Error fetching meals:', mealsError)
        } else {
          setMeals(mealsData || [])
        }

        // Fetch today's gut logs
        const { data: gutLogData, error: gutLogError } = await supabase
          .from('gut_logs')
          .select('*')
          .gte('logged_at', startOfDay.toISOString())
          .order('logged_at', { ascending: false })

        if (gutLogError) {
          console.error('Error fetching gut log:', gutLogError)
        } else {
          setGutLogs(gutLogData || [])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  // Group meals by their logged_at timestamp (meals logged together)
  const groupedMeals: GroupedMeal[] = []
  const mealMap = new Map<string, MealLog[]>()

  meals.forEach((meal) => {
    const key = `${meal.logged_at}-${meal.meal_label}`
    if (!mealMap.has(key)) {
      mealMap.set(key, [])
    }
    mealMap.get(key)!.push(meal)
  })

  mealMap.forEach((items, key) => {
    const totalCalories = items.reduce((sum, item) =>
      sum + (item.food_library.calories_per_serving * item.servings), 0
    )
    groupedMeals.push({
      meal_label: items[0].meal_label,
      logged_at: items[0].logged_at,
      items,
      totalCalories
    })
  })

  // Format today's date
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getMealEmoji = (mealLabel: string) => {
    switch (mealLabel) {
      case 'breakfast': return '🌅'
      case 'lunch': return '🌞'
      case 'dinner': return '🌙'
      case 'snack': return '🍎'
      default: return '🍽️'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
      {/* Date Header */}
      <div>
        <h1 className="text-3xl font-bold">{formattedDate}</h1>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-4">
        <Link href="/log/food" className="flex-1">
          <Button className="w-full" size="lg">
            Log Food
          </Button>
        </Link>
        <Link href="/log/gut" className="flex-1">
          <Button className="w-full" size="lg" variant="outline">
            Log Gut
          </Button>
        </Link>
      </div>

      {/* Running Log */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today's Log</h2>

        {/* Meal Logs */}
        {groupedMeals.length === 0 && gutLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No logs yet today</p>
            <p className="text-sm mt-2">Start by logging your first meal or gut check</p>
          </div>
        ) : (
          <>
            {groupedMeals.map((meal, index) => (
              <div
                key={`${meal.logged_at}-${index}`}
                className="rounded-lg border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMealEmoji(meal.meal_label)}</span>
                    <div>
                      <p className="font-semibold capitalize">{meal.meal_label}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(meal.logged_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{Math.round(meal.totalCalories)} cal</p>
                  </div>
                </div>

                {/* Food Items */}
                <div className="flex flex-wrap gap-2">
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm"
                    >
                      <span>{item.food_library.emoji}</span>
                      <span className="font-medium">{item.food_library.name}</span>
                      {item.servings > 1 && (
                        <span className="text-muted-foreground">×{item.servings}</span>
                      )}
                      <span className="text-muted-foreground">
                        ({Math.round(item.food_library.calories_per_serving * item.servings)} cal)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Gut Logs */}
            {gutLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💩</span>
                    <div>
                      <p className="font-semibold">Gut Check</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(log.logged_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Bristol: {log.bristol_score}</p>
                    <p className="text-sm text-muted-foreground">Feel: {log.gut_score}/10</p>
                  </div>
                </div>

                {/* Tags */}
                {log.tags && log.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {log.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-muted rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Note */}
                {log.note && (
                  <p className="text-sm text-muted-foreground italic">
                    "{log.note}"
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
