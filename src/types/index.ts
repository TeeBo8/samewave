export type Discipline = "surf" | "skate" | "snow" | "wake" | "kite" | "longboard"

export type Level = "beginner" | "intermediate" | "advanced"

export type Vibe = "chill" | "progression" | "competitive"

export type SessionStatus = "open" | "closed" | "completed"

export type ParticipantStatus = "pending" | "accepted" | "rejected"

export const DISCIPLINES: { value: Discipline; label: string; emoji: string }[] = [
  { value: "surf", label: "Surf", emoji: "🏄" },
  { value: "skate", label: "Skate", emoji: "🛹" },
  { value: "snow", label: "Snow", emoji: "🏂" },
  { value: "wake", label: "Wake", emoji: "🚤" },
  { value: "kite", label: "Kitesurf", emoji: "🪁" },
  { value: "longboard", label: "Longboard", emoji: "🛹" },
]

export const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Confirmé" },
]

export const VIBES: { value: Vibe; label: string }[] = [
  { value: "chill", label: "Chill" },
  { value: "progression", label: "Progression" },
  { value: "competitive", label: "Compétitif" },
]
