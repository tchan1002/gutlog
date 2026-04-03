'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { BristolSelector } from '@/components/gut/BristolSelector'
import { GutFeelSlider } from '@/components/gut/GutFeelSlider'
import { SymptomTags } from '@/components/gut/SymptomTags'
import { ActivitySelector } from '@/components/gut/ActivitySelector'

export default function GutLogPage() {
  const router = useRouter()
  const supabase = createClient()

  const [bristolScore, setBristolScore] = useState<number | null>(null)
  const [gutScore, setGutScore] = useState<number | null>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [activity, setActivity] = useState<string>('light')
  const [note, setNote] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const currentTime = new Date()
  const formattedTime = currentTime.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const handleSave = async () => {
    // Validate required fields
    if (!bristolScore || !gutScore) {
      setError('Please select both Bristol score and gut feel')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from('gut_logs').insert({
        bristol_score: bristolScore,
        gut_score: gutScore,
        tags: symptoms,
        activity: activity,
        note: note || null,
        logged_at: currentTime.toISOString(),
      })

      if (insertError) {
        throw insertError
      }

      // Show success message
      setSuccess(true)

      // Clear form
      setBristolScore(null)
      setGutScore(null)
      setSymptoms([])
      setActivity('light')
      setNote('')

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      console.error('Error saving gut log:', err)
      setError(err instanceof Error ? err.message : 'Failed to save gut log')
    } finally {
      setSaving(false)
    }
  }

  const handleClear = () => {
    setBristolScore(null)
    setGutScore(null)
    setSymptoms([])
    setActivity('light')
    setNote('')
    setError(null)
    setSuccess(false)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Gut Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Today at {formattedTime}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
            Gut log saved successfully! Redirecting...
          </div>
        )}

        {/* Bristol Stool Scale Selector */}
        <BristolSelector value={bristolScore} onChange={setBristolScore} />

        {/* Gut Feel Slider */}
        <GutFeelSlider value={gutScore} onChange={setGutScore} />

        {/* Symptom Tags */}
        <SymptomTags value={symptoms} onChange={setSymptoms} />

        {/* Activity Level Selector */}
        <ActivitySelector value={activity} onChange={setActivity} />

        {/* Optional Note Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (optional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any notes? (optional)"
            maxLength={500}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground text-right">
            {note.length}/500
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving || !bristolScore || !gutScore}
            className="flex-1 h-12"
          >
            {saving ? 'Saving...' : 'Save Log'}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            disabled={saving}
            className="h-12 px-6"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
