"use client"

import { useRouter } from "next/navigation"
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
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

// OpenFreeMap — gratuit, sans token, tiles OpenStreetMap
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty"

export function MapView({ sessions }: { sessions: Session[] }) {
  const router = useRouter()

  const sessionsWithCoords = sessions.filter(
    (s): s is Session & { lat: number; lng: number } =>
      s.lat !== null && s.lat !== undefined && s.lng !== null && s.lng !== undefined
  )

  if (sessionsWithCoords.length === 0) {
    return (
      <div className="h-[420px] rounded-lg border bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Aucune session avec coordonnées GPS pour l&apos;instant.</p>
      </div>
    )
  }

  const avgLat = sessionsWithCoords.reduce((acc, s) => acc + s.lat, 0) / sessionsWithCoords.length
  const avgLng = sessionsWithCoords.reduce((acc, s) => acc + s.lng, 0) / sessionsWithCoords.length

  return (
    <div className="h-[420px] rounded-lg overflow-hidden border">
      <Map
        initialViewState={{ longitude: avgLng, latitude: avgLat, zoom: 6 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
      >
        <NavigationControl position="top-right" />
        {sessionsWithCoords.map((s) => (
          <Marker
            key={s.id}
            longitude={s.lng}
            latitude={s.lat}
            onClick={() => router.push(`/session/${s.id}`)}
          >
            <button
              className="text-xl cursor-pointer hover:scale-125 transition-transform"
              title={s.spotName}
            >
              {DISCIPLINE_EMOJI[s.discipline]}
            </button>
          </Marker>
        ))}
      </Map>
    </div>
  )
}
