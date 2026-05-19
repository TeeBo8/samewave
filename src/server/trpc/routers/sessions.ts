import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"
import { and, desc, eq } from "drizzle-orm"
import { gameSession, sessionParticipant } from "@/server/db/schema"
import { nanoid } from "nanoid"

export const sessionsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        discipline: z.enum(["surf", "skate", "snow", "wake", "kite", "longboard"]).optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.gameSession.findMany({
        where: and(
          eq(gameSession.status, "open"),
          input.discipline ? eq(gameSession.discipline, input.discipline) : undefined
        ),
        orderBy: [desc(gameSession.scheduledAt)],
        limit: input.limit,
        with: {
          creator: true,
          participants: { with: { user: true } },
        },
      })
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.gameSession.findFirst({
        where: eq(gameSession.id, input.id),
        with: {
          creator: true,
          participants: { with: { user: true } },
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        discipline: z.enum(["surf", "skate", "snow", "wake", "kite", "longboard"]),
        spotName: z.string().min(2).max(100),
        lat: z.number().optional(),
        lng: z.number().optional(),
        scheduledAt: z.date(),
        level: z.enum(["beginner", "intermediate", "advanced"]),
        vibe: z.enum(["chill", "progression", "competitive"]),
        maxRiders: z.number().min(2).max(20).default(4),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = nanoid()
      await ctx.db.insert(gameSession).values({
        id,
        creatorId: ctx.user.id,
        ...input,
      })
      return { id }
    }),

  join: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.sessionParticipant.findFirst({
        where: and(
          eq(sessionParticipant.sessionId, input.sessionId),
          eq(sessionParticipant.userId, ctx.user.id)
        ),
      })
      if (existing) return { id: existing.id }

      const id = nanoid()
      await ctx.db.insert(sessionParticipant).values({
        id,
        sessionId: input.sessionId,
        userId: ctx.user.id,
        status: "pending",
      })
      return { id }
    }),

  updateParticipantStatus: protectedProcedure
    .input(
      z.object({
        participantId: z.string(),
        status: z.enum(["accepted", "rejected"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(sessionParticipant)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(sessionParticipant.id, input.participantId))
    }),

  getMy: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.gameSession.findMany({
      where: eq(gameSession.creatorId, ctx.user.id),
      orderBy: [desc(gameSession.scheduledAt)],
      with: {
        creator: true,
        participants: { with: { user: true } },
      },
    })
  }),

  getMyParticipations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.sessionParticipant.findMany({
      where: eq(sessionParticipant.userId, ctx.user.id),
      orderBy: [desc(sessionParticipant.updatedAt)],
      with: {
        session: { with: { creator: true } },
      },
    })
  }),
})
