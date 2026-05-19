"use client"

import { use } from "react"
import { trpc } from "@/trpc/client"
import { Badge } from "@/components/ui/badge"
import { SessionCard } from "@/components/session-card"

const DISCIPLINE_EMOJI: Record<string, string> = {
  surf: "🏄",
  skate: "🛹",
  snow: "🏔️",
  wake: "🚤",
  kite: "🪁",
  longboard: "🛴",
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Expert",
}

type Props = { params: Promise<{ id: string }> }

export default function ProfilePage({ params }: Props) {
  const { id } = use(params)
  const { data, isLoading } = trpc.profiles.getPublic.useQuery({ userId: id })
  const { data: vibeCount } = trpc.vibes.getCountForUser.useQuery({ userId: id })

  if (isLoading) {
    return <div className="h-48 rounded-lg border bg-muted animate-pulse" />
  }

  if (!data?.profile) {
    return <p className="text-muted-foreground">Profil introuvable.</p>
  }

  const { profile, sessions } = data

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{profile.user.name}</h1>

        <div className="flex flex-wrap gap-2">
          {profile.disciplines.map((d) => (
            <Badge key={d} variant="secondary">
              {DISCIPLINE_EMOJI[d]} {d}
            </Badge>
          ))}
          {profile.level && (
            <Badge variant="outline">{LEVEL_LABEL[profile.level]}</Badge>
          )}
          {(vibeCount ?? 0) > 0 && (
            <Badge variant="outline">🤙 {vibeCount} vibe{(vibeCount ?? 0) > 1 ? "s" : ""}</Badge>
          )}
        </div>

        {profile.locationCity && (
          <p className="text-sm text-muted-foreground">📍 {profile.locationCity}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        )}
      </div>

      {sessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Sessions créées</h2>
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}

      {sessions.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucune session créée pour l&apos;instant.</p>
      )}
    </div>
  )
}
