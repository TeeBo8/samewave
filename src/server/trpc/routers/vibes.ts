import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"
import { and, count, eq } from "drizzle-orm"
import { vibe } from "@/server/db/schema"
import { nanoid } from "nanoid"
import { TRPCError } from "@trpc/server"

export const vibesRouter = createTRPCRouter({
  send: protectedProcedure
    .input(z.object({ sessionId: z.string(), toUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.toUserId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Tu ne peux pas t'envoyer un vibe à toi-même" })
      }

      const existing = await ctx.db.query.vibe.findFirst({
        where: and(
          eq(vibe.sessionId, input.sessionId),
          eq(vibe.fromUserId, ctx.user.id),
          eq(vibe.toUserId, input.toUserId)
        ),
      })
      if (existing) return { id: existing.id }

      const id = nanoid()
      await ctx.db.insert(vibe).values({
        id,
        sessionId: input.sessionId,
        fromUserId: ctx.user.id,
        toUserId: input.toUserId,
        positive: true,
      })
      return { id }
    }),

  getSentForSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.vibe.findMany({
        where: and(
          eq(vibe.sessionId, input.sessionId),
          eq(vibe.fromUserId, ctx.user.id)
        ),
      })
    }),

  getCountForUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({ total: count() })
        .from(vibe)
        .where(and(eq(vibe.toUserId, input.userId), eq(vibe.positive, true)))
      return result[0]?.total ?? 0
    }),
})
