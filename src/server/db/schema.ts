import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core"

// ─── Enums ───────────────────────────────────────────────────────────────────

export const disciplineEnum = pgEnum("discipline", [
  "surf",
  "skate",
  "snow",
  "wake",
  "kite",
  "longboard",
])

export const levelEnum = pgEnum("level", ["beginner", "intermediate", "advanced"])

export const vibeEnum = pgEnum("vibe", ["chill", "progression", "competitive"])

export const sessionStatusEnum = pgEnum("session_status", [
  "open",
  "closed",
  "completed",
])

export const participantStatusEnum = pgEnum("participant_status", [
  "pending",
  "accepted",
  "rejected",
])

// ─── Better Auth tables ───────────────────────────────────────────────────────
// Ces tables sont gérées par Better Auth via son Drizzle adapter.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── Rider profiles ───────────────────────────────────────────────────────────

export const riderProfile = pgTable("rider_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  disciplines: text("disciplines").array().notNull().default([]),
  level: levelEnum("level"),
  favoriteSpots: text("favorite_spots").array().notNull().default([]),
  locationCity: text("location_city"),
  bio: text("bio"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── Game sessions (sessions de ride) ────────────────────────────────────────

export const gameSession = pgTable("game_session", {
  id: text("id").primaryKey(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  discipline: disciplineEnum("discipline").notNull(),
  spotName: text("spot_name").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  level: levelEnum("level").notNull(),
  vibe: vibeEnum("vibe").notNull(),
  maxRiders: integer("max_riders").notNull().default(4),
  description: text("description"),
  status: sessionStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── Session participants ─────────────────────────────────────────────────────

export const sessionParticipant = pgTable("session_participant", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => gameSession.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: participantStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── Vibes (post-session feedback) ───────────────────────────────────────────

export const vibe = pgTable("vibe", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => gameSession.id, { onDelete: "cascade" }),
  fromUserId: text("from_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  toUserId: text("to_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  positive: boolean("positive").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
