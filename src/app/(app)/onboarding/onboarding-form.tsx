"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const DISCIPLINES = [
  { value: "surf", label: "Surf" },
  { value: "skate", label: "Skate" },
  { value: "snow", label: "Snow" },
  { value: "wake", label: "Wake" },
  { value: "kite", label: "Kite" },
  { value: "longboard", label: "Longboard" },
]

const LEVELS = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Expert" },
]

type Level = "beginner" | "intermediate" | "advanced"

export function OnboardingForm({ userName }: { userName: string }) {
  const router = useRouter()
  const [disciplines, setDisciplines] = useState<string[]>([])
  const [level, setLevel] = useState<Level | null>(null)
  const [city, setCity] = useState("")
  const [error, setError] = useState("")

  const upsert = trpc.profiles.upsert.useMutation({
    onSuccess: () => router.push("/feed"),
    onError: (err) => setError(err.message),
  })

  function toggleDiscipline(value: string) {
    setDisciplines((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (disciplines.length === 0) {
      setError("Sélectionne au moins une discipline")
      return
    }
    if (!level) {
      setError("Sélectionne ton niveau")
      return
    }
    setError("")
    upsert.mutate({
      disciplines,
      level,
      locationCity: city.trim() || undefined,
      onboardingCompleted: true,
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bienvenue, {userName} !</CardTitle>
        <CardDescription>Configure ton profil rider pour trouver ta crew</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Tes disciplines</Label>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <Button
                  key={d.value}
                  type="button"
                  variant={disciplines.includes(d.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDiscipline(d.value)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Ton niveau</Label>
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <Button
                  key={l.value}
                  type="button"
                  variant={level === l.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLevel(l.value as Level)}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">Ta ville (optionnel)</Label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Paris, Bordeaux, Biarritz..."
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={upsert.isPending}>
            {upsert.isPending ? "Enregistrement..." : "C'est parti !"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
