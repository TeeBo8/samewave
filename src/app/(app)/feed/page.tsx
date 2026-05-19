"use client"

import Link from "next/link"
import { useState } from "react"
import { trpc } from "@/trpc/client"
import { SessionCard } from "@/components/session-card"
import { Button } from "@/components/ui/button"

const FILTERS = [
  { value: undefined, label: "Tous" },
  { value: "surf", label: "🏄 Surf" },
  { value: "skate", label: "🛹 Skate" },
  { value: "snow", label: "🏔️ Snow" },
  { value: "wake", label: "🚤 Wake" },
  { value: "kite", label: "🪁 Kite" },
  { value: "longboard", label: "🛴 Longboard" },
] as const

type Discipline = "surf" | "skate" | "snow" | "wake" | "kite" | "longboard"

export default function FeedPage() {
  const [discipline, setDiscipline] = useState<Discipline | undefined>(undefined)
  const { data: sessions, isLoading } = trpc.sessions.getAll.useQuery({ discipline })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Sessions</h1>
        <Button asChild size="sm">
          <Link href="/session/create">+ Créer</Link>
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <Button
            key={String(f.value)}
            size="sm"
            variant={discipline === f.value ? "default" : "outline"}
            onClick={() => setDiscipline(f.value as Discipline | undefined)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && sessions?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Aucune session ouverte pour l&apos;instant.</p>
          <Button asChild className="mt-4">
            <Link href="/session/create">Créer la première</Link>
          </Button>
        </div>
      )}

      {sessions && sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}
