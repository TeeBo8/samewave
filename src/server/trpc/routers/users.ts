import { createTRPCRouter, protectedProcedure } from "@/server/trpc"
import { desc, eq } from "drizzle-orm"
import { gameSession, riderProfile, sessionParticipant } from "@/server/db/schema"

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.riderProfile.findFirst({
      where: eq(riderProfile.userId, ctx.user.id),
    })
    return { user: ctx.user, profile }
  }),

  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    // Demandes en attente sur MES sessions (je suis créateur)
    const mySessions = await ctx.db.query.gameSession.findMany({
      where: eq(gameSession.creatorId, ctx.user.id),
      with: { participants: { with: { user: true } } },
    })
    const pendingRequests = mySessions.flatMap((s) =>
      s.participants
        .filter((p) => p.status === "pending")
        .map((p) => ({ session: s, participant: p }))
    )

    // Mes participations avec statut accepted/rejected
    const myParticipations = await ctx.db.query.sessionParticipant.findMany({
      where: eq(sessionParticipant.userId, ctx.user.id),
      orderBy: [desc(sessionParticipant.updatedAt)],
      with: { session: { with: { creator: true } } },
    })
    const myStatuses = myParticipations.filter((p) => p.status !== "pending")

    return { pendingRequests, myStatuses }
  }),
})
