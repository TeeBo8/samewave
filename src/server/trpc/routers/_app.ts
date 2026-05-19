import { createTRPCRouter } from "@/server/trpc"
import { sessionsRouter } from "./sessions"
import { profilesRouter } from "./profiles"
import { usersRouter } from "./users"
import { vibesRouter } from "./vibes"

export const appRouter = createTRPCRouter({
  sessions: sessionsRouter,
  profiles: profilesRouter,
  users: usersRouter,
  vibes: vibesRouter,
})

export type AppRouter = typeof appRouter
