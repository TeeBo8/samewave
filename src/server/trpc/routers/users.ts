import { createTRPCRouter, protectedProcedure } from "@/server/trpc"
import { eq } from "drizzle-orm"
import { riderProfile } from "@/server/db/schema"

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.riderProfile.findFirst({
      where: eq(riderProfile.userId, ctx.user.id),
    })
    return { user: ctx.user, profile }
  }),
})
