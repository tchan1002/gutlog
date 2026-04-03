'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { TodaysMeals } from '@/components/dashboard/TodaysMeals'
import { DailyTotals } from '@/components/dashboard/DailyTotals'
import { GutLogCard } from '@/components/dashboard/GutLogCard'
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

export default function DashboardPage() {
  // Use hardcoded test user ID
  const userId = '00000000-0000-0000-0000-000000000001'
  const [meals, setMeals] = useState<MealLog[]>([])
  const [gutLog, setGutLog] = useState<GutLog | null>(null)
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
          .eq('user_id', userId)
          .gte('logged_at', startOfDay.toISOString())
          .order('logged_at', { ascending: false })

        if (mealsError) {
          console.error('Error fetching meals:', mealsError)
        } else {
          setMeals(mealsData || [])
        }

        // Fetch today's gut log
        const { data: gutLogData, error: gutLogError } = await supabase
          .from('gut_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('logged_at', startOfDay.toISOString())
          .maybeSingle()

        if (gutLogError) {
          console.error('Error fetching gut log:', gutLogError)
        } else {
          setGutLog(gutLogData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase, userId])

  // Calculate total calories
  const totalCalories = meals.reduce((total, meal) => {
    return total + (meal.food_library.calories_per_serving * meal.servings)
  }, 0)

  // Format today's date
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
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

      {/* Daily Totals and Gut Log Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <DailyTotals totalCalories={totalCalories} />
        <GutLogCard gutLog={gutLog} />
      </div>

      {/* Today's Meals */}
      <TodaysMeals meals={meals} />
    </div>
  )
}
