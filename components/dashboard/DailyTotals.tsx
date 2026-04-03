'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DailyTotalsProps {
  totalCalories: number
}

export function DailyTotals({ totalCalories }: DailyTotalsProps) {
  const formattedCalories = totalCalories.toLocaleString()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Daily Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {formattedCalories} <span className="text-2xl text-muted-foreground">cal</span>
        </div>
      </CardContent>
    </Card>
  )
}
