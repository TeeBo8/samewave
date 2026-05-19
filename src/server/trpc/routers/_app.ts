import { createTRPCRouter } from "@/server/trpc"
import { sessionsRouter } from "./sessions"
import { profilesRouter } from "./profiles"
import { usersRouter } from "./users"

export const appRouter = createTRPCRouter({
  sessions: sessionsRouter,
  profiles: profilesRouter,
  users: usersRouter,
})

export type AppRouter = typeof appRouter
