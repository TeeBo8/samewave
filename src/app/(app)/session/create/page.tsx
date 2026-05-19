"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DISCIPLINES = [
  { value: "surf", label: "🏄 Surf" },
  { value: "skate", label: "🛹 Skate" },
  { value: "snow", label: "🏔️ Snow" },
  { value: "wake", label: "🚤 Wake" },
  { value: "kite", label: "🪁 Kite" },
  { value: "longboard", label: "🛴 Longboard" },
]

const LEVELS = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Expert" },
]

const VIBES = [
  { value: "chill", label: "Chill" },
  { value: "progression", label: "Progression" },
  { value: "competitive", label: "Compétitif" },
]

type Discipline = "surf" | "skate" | "snow" | "wake" | "kite" | "longboard"
type Level = "beginner" | "intermediate" | "advanced"
type Vibe = "chill" | "progression" | "competitive"

export default function CreateSessionPage() {
  const router = useRouter()
  const [discipline, setDiscipline] = useState<Discipline | null>(null)
  const [spotName, setSpotName] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [level, setLevel] = useState<Level | null>(null)
  const [vibe, setVibe] = useState<Vibe | null>(null)
  const [maxRiders, setMaxRiders] = useState(4)
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const create = trpc.sessions.create.useMutation({
    onSuccess: ({ id }) => router.push(`/session/${id}`),
    onError: (err) => setError(err.message),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!discipline || !level || !vibe || !scheduledAt) {
      setError("Remplis tous les champs obligatoires")
      return
    }
    setError("")
    create.mutate({
      discipline,
      spotName,
      scheduledAt: new Date(scheduledAt),
      level,
      vibe,
      maxRiders,
      description: description.trim() || undefined,
    })
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Nouvelle session</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Discipline *</Label>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <Button
                  key={d.value}
                  type="button"
                  size="sm"
                  variant={discipline === d.value ? "default" : "outline"}
                  onClick={() => setDiscipline(d.value as Discipline)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="spotName">Nom du spot *</Label>
            <Input
              id="spotName"
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              required
              placeholder="Plage de Lacanau, Skatepark des Batignolles..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scheduledAt">Date &amp; heure *</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Niveau *</Label>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map((l) => (
                <Button
                  key={l.value}
                  type="button"
                  size="sm"
                  variant={level === l.value ? "default" : "outline"}
                  onClick={() => setLevel(l.value as Level)}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ambiance *</Label>
            <div className="flex gap-2 flex-wrap">
              {VIBES.map((v) => (
                <Button
                  key={v.value}
                  type="button"
                  size="sm"
                  variant={vibe === v.value ? "default" : "outline"}
                  onClick={() => setVibe(v.value as Vibe)}
                >
                  {v.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maxRiders">Riders max</Label>
            <Input
              id="maxRiders"
              type="number"
              min={2}
              max={20}
              value={maxRiders}
              onChange={(e) => setMaxRiders(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conditions du jour, niveau attendu, point de RDV..."
              maxLength={500}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? "Création..." : "Créer la session"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
