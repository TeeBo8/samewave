"use client"

import { useState } from "react"
import { toast } from "sonner"
import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SessionCard } from "@/components/session-card"
import { RiderAvatar } from "@/components/rider-avatar"
import type { RouterOutputs } from "@/trpc/types"

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

type Level = "beginner" | "intermediate" | "advanced"
type Profile = NonNullable<RouterOutputs["users"]["me"]["profile"]>

function ProfileForm({ profile, onSaved }: { profile: Profile | null | undefined; onSaved: () => void }) {
  const [disciplines, setDisciplines] = useState<string[]>(profile?.disciplines ?? [])
  const [level, setLevel] = useState<Level | null>((profile?.level as Level) ?? null)
  const [locationCity, setLocationCity] = useState(profile?.locationCity ?? "")
  const [bio, setBio] = useState(profile?.bio ?? "")

  const upsert = trpc.profiles.upsert.useMutation({
    onSuccess: () => {
      onSaved()
      toast.success("Profil sauvegardé")
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  })

  function toggleDiscipline(value: string) {
    setDisciplines((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!level) return
    upsert.mutate({
      disciplines,
      level,
      locationCity: locationCity.trim() || undefined,
      bio: bio.trim() || undefined,
      onboardingCompleted: true,
    })
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-base">Mon profil</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Disciplines</Label>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <Button
                  key={d.value}
                  type="button"
                  size="sm"
                  variant={disciplines.includes(d.value) ? "default" : "outline"}
                  onClick={() => toggleDiscipline(d.value)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Niveau</Label>
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

          <div className="space-y-1.5">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              placeholder="Paris, Hossegor, Grenoble..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Quelques mots sur toi..."
              maxLength={300}
            />
          </div>

          <Button type="submit" className="w-full" disabled={upsert.isPending || !level}>
            {upsert.isPending ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}

export default function MyProfilePage() {
  const { data: me, isLoading, refetch } = trpc.users.me.useQuery()
  const { data: mySessions } = trpc.sessions.getMy.useQuery()

  if (isLoading) {
    return <div className="h-48 rounded-lg border bg-muted animate-pulse" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <RiderAvatar image={me?.user.image} name={me?.user.name ?? ""} size="lg" />
        <div>
          <h1 className="text-2xl font-bold">{me?.user.name}</h1>
          <p className="text-sm text-muted-foreground">{me?.user.email}</p>
        </div>
      </div>

      <ProfileForm profile={me?.profile} onSaved={() => refetch()} />

      {mySessions && mySessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Mes sessions ({mySessions.length})</h2>
          {mySessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}

      {mySessions && mySessions.length === 0 && (
        <p className="text-sm text-muted-foreground">Tu n&apos;as pas encore créé de session.</p>
      )}

      <div className="pt-2">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          Lien public :{" "}
          <Badge variant="outline" className="font-mono text-xs">
            /profile/{me?.user.id}
          </Badge>
        </div>
      </div>
    </div>
  )
}
