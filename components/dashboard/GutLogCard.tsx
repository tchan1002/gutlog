'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface GutLog {
  id: string
  bristol_score: number
  gut_score: number
  tags: string[]
  activity: string
  note: string | null
  logged_at: string
}

interface GutLogCardProps {
  gutLog: GutLog | null
}

function getBristolEmoji(score: number): string {
  const emojis: Record<number, string> = {
    1: '💩',
    2: '💩',
    3: '💩',
    4: '💩',
    5: '💩',
    6: '💩',
    7: '💩'
  }
  return emojis[score] || '💩'
}

function getGutFeelEmoji(score: number): string {
  const emojis: Record<number, string> = {
    1: '😣',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😊'
  }
  return emojis[score] || '😐'
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function GutLogCard({ gutLog }: GutLogCardProps) {
  if (!gutLog) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Gut Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4 mb-4">
            No gut log yet today
          </p>
          <Link href="/log/gut">
            <Button className="w-full">Log Gut Health</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Gut Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {formatTime(gutLog.logged_at)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Bristol Score</div>
            <div className="text-3xl">
              {getBristolEmoji(gutLog.bristol_score)} {gutLog.bristol_score}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Gut Feel</div>
            <div className="text-3xl">
              {getGutFeelEmoji(gutLog.gut_score)} {gutLog.gut_score}/5
            </div>
          </div>
        </div>

        {gutLog.tags && gutLog.tags.length > 0 && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">Symptoms</div>
            <div className="flex flex-wrap gap-2">
              {gutLog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-sm text-muted-foreground mb-1">Activity Level</div>
          <div className="capitalize">{gutLog.activity}</div>
        </div>

        {gutLog.note && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Note</div>
            <p className="text-sm">{gutLog.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
