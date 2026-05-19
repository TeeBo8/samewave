"use client"

import { useRouter } from "next/navigation"
import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

const VIBE_LABEL: Record<string, string> = {
  chill: "Chill",
  progression: "Progression",
  competitive: "Compétitif",
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente de validation",
  accepted: "Accepté",
  rejected: "Refusé",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function SessionDetail({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const { data: session, isLoading, refetch } = trpc.sessions.getById.useQuery({ id: sessionId })
  const { data: me } = trpc.users.me.useQuery()
  const { data: sentVibes, refetch: refetchVibes } = trpc.vibes.getSentForSession.useQuery(
    { sessionId },
    { enabled: !!me }
  )

  const join = trpc.sessions.join.useMutation({ onSuccess: () => refetch() })
  const updateStatus = trpc.sessions.updateParticipantStatus.useMutation({
    onSuccess: () => refetch(),
  })
  const sendVibe = trpc.vibes.send.useMutation({ onSuccess: () => refetchVibes() })

  if (isLoading) {
    return <div className="h-48 rounded-lg border bg-muted animate-pulse" />
  }

  if (!session) {
    return <p className="text-muted-foreground">Session introuvable.</p>
  }

  const isCreator = me?.user.id === session.creatorId
  const myParticipation = session.participants.find((p) => p.userId === me?.user.id)
  const acceptedParticipants = session.participants.filter((p) => p.status === "accepted")
  const pendingParticipants = session.participants.filter((p) => p.status === "pending")
  const isFull = acceptedParticipants.length >= session.maxRiders - 1

  const sessionIsPast = new Date(session.scheduledAt) < new Date()
  const canSendVibes =
    sessionIsPast &&
    (myParticipation?.status === "accepted" || isCreator) &&
    acceptedParticipants.length > 0

  const vibeTargets = acceptedParticipants.filter((p) => p.userId !== me?.user.id)
  const sentVibeTo = (userId: string) => sentVibes?.some((v) => v.toUserId === userId) ?? false

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">
          {DISCIPLINE_EMOJI[session.discipline]} {session.spotName}
        </h1>
        <p className="text-muted-foreground mt-1 capitalize">{formatDate(session.scheduledAt)}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge>{LEVEL_LABEL[session.level]}</Badge>
        <Badge variant="secondary">{VIBE_LABEL[session.vibe]}</Badge>
        <Badge variant="outline">{session.maxRiders} riders max</Badge>
      </div>

      {session.description && (
        <p className="text-sm text-muted-foreground">{session.description}</p>
      )}

      <Separator />

      <div className="space-y-1">
        <p className="text-sm font-medium">Organisé par {session.creator.name}</p>
        <p className="text-sm text-muted-foreground">
          {acceptedParticipants.length} / {session.maxRiders - 1} places prises
        </p>
      </div>

      {!isCreator && !myParticipation && session.status === "open" && !isFull && (
        <Button
          className="w-full"
          onClick={() => join.mutate({ sessionId })}
          disabled={join.isPending}
        >
          {join.isPending ? "Envoi..." : "Rejoindre la session"}
        </Button>
      )}

      {!isCreator && !myParticipation && isFull && (
        <p className="text-sm text-center text-muted-foreground">Session complète</p>
      )}

      {myParticipation && (
        <div className="rounded-lg border p-3 text-sm text-center">
          Statut :{" "}
          <span className="font-medium">{STATUS_LABEL[myParticipation.status]}</span>
        </div>
      )}

      {isCreator && pendingParticipants.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Demandes ({pendingParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingParticipants.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2">
                <span className="text-sm">{p.user.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      updateStatus.mutate({ participantId: p.id, status: "accepted" })
                    }
                    disabled={updateStatus.isPending}
                  >
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateStatus.mutate({ participantId: p.id, status: "rejected" })
                    }
                    disabled={updateStatus.isPending}
                  >
                    Refuser
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isCreator && acceptedParticipants.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Riders confirmés</p>
          <div className="space-y-1">
            {acceptedParticipants.map((p) => (
              <p key={p.id} className="text-sm text-muted-foreground">
                {p.user.name}
              </p>
            ))}
          </div>
        </div>
      )}

      {canSendVibes && vibeTargets.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🤙 Envoyer des vibes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vibeTargets.map((p) => {
              const alreadySent = sentVibeTo(p.userId)
              return (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm">{p.user.name}</span>
                  <Button
                    size="sm"
                    variant={alreadySent ? "secondary" : "outline"}
                    disabled={alreadySent || sendVibe.isPending}
                    onClick={() =>
                      sendVibe.mutate({ sessionId, toUserId: p.userId })
                    }
                  >
                    {alreadySent ? "✓ Vibe envoyée" : "🤙 Vibe"}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
        ← Retour
      </Button>
    </div>
  )
}
