import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RouterOutputs } from "@/trpc/types"

type Session = RouterOutputs["sessions"]["getAll"][number]

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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function SessionCard({ session }: { session: Session }) {
  const acceptedCount = session.participants.filter((p) => p.status === "accepted").length
  const spotsLeft = Math.max(0, session.maxRiders - acceptedCount - 1)

  return (
    <Link href={`/session/${session.id}`}>
      <Card className="hover:border-foreground/20 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold leading-none">
                {DISCIPLINE_EMOJI[session.discipline]} {session.spotName}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(session.scheduledAt)}
              </p>
            </div>
            <Badge variant={spotsLeft === 0 ? "destructive" : "secondary"}>
              {spotsLeft === 0 ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{LEVEL_LABEL[session.level]}</Badge>
            <Badge variant="outline">{VIBE_LABEL[session.vibe]}</Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              par {session.creator.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
