"use client"

import Link from "next/link"
import { trpc } from "@/trpc/client"
import { Badge } from "@/components/ui/badge"

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

const DISCIPLINE_EMOJI: Record<string, string> = {
  surf: "🏄",
  skate: "🛹",
  snow: "🏔️",
  wake: "🚤",
  kite: "🪁",
  longboard: "🛴",
}

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  accepted: { label: "Accepté", variant: "default" },
  rejected: { label: "Refusé", variant: "destructive" },
}

export default function NotificationsPage() {
  const { data, isLoading } = trpc.users.getNotifications.useQuery()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg border bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  const pendingRequests = data?.pendingRequests ?? []
  const myStatuses = data?.myStatuses ?? []
  const hasNothing = pendingRequests.length === 0 && myStatuses.length === 0

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Notifications</h1>

      {hasNothing && (
        <p className="text-muted-foreground text-sm">Aucune notification pour l&apos;instant.</p>
      )}

      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Demandes reçues ({pendingRequests.length})
          </h2>
          {pendingRequests.map(({ session, participant }) => (
            <Link
              key={participant.id}
              href={`/session/${session.id}`}
              className="block rounded-lg border p-3 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {participant.user.name} veut rejoindre ta session
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {DISCIPLINE_EMOJI[session.discipline]} {session.spotName} · {formatDate(session.scheduledAt)}
                  </p>
                </div>
                <Badge variant="secondary">En attente</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}

      {myStatuses.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Mes demandes
          </h2>
          {myStatuses.map((p) => {
            const badge = STATUS_BADGE[p.status]
            return (
              <Link
                key={p.id}
                href={`/session/${p.session.id}`}
                className="block rounded-lg border p-3 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      {DISCIPLINE_EMOJI[p.session.discipline]} {p.session.spotName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(p.session.scheduledAt)} · par {p.session.creator.name}
                    </p>
                  </div>
                  {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
