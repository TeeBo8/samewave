import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"
import { desc, eq } from "drizzle-orm"
import { gameSession, riderProfile } from "@/server/db/schema"
import { nanoid } from "nanoid"

export const profilesRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.riderProfile.findFirst({
        where: eq(riderProfile.userId, input.userId),
      })
    }),

  getPublic: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.query.riderProfile.findFirst({
        where: eq(riderProfile.userId, input.userId),
        with: { user: true },
      })
      const sessions = await ctx.db.query.gameSession.findMany({
        where: eq(gameSession.creatorId, input.userId),
        orderBy: [desc(gameSession.scheduledAt)],
        limit: 10,
        with: {
          creator: true,
          participants: { with: { user: true } },
        },
      })
      return { profile, sessions }
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        disciplines: z.array(z.string()),
        level: z.enum(["beginner", "intermediate", "advanced"]),
        favoriteSpots: z.array(z.string()).optional(),
        locationCity: z.string().optional(),
        bio: z.string().max(300).optional(),
        onboardingCompleted: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.riderProfile.findFirst({
        where: eq(riderProfile.userId, ctx.user.id),
      })

      if (existing) {
        await ctx.db
          .update(riderProfile)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(riderProfile.userId, ctx.user.id))
        return existing.id
      }

      const id = nanoid()
      await ctx.db.insert(riderProfile).values({
        id,
        userId: ctx.user.id,
        disciplines: input.disciplines,
        level: input.level,
        favoriteSpots: input.favoriteSpots ?? [],
        locationCity: input.locationCity,
        bio: input.bio,
        onboardingCompleted: input.onboardingCompleted ?? false,
      })
      return id
    }),
})
