import "server-only"
import { createCallerFactory } from "@/server/trpc"
import { createTRPCContext } from "@/server/trpc/context"
import { appRouter } from "@/server/trpc/routers/_app"

const createCaller = createCallerFactory(appRouter)

export const api = createCaller(createTRPCContext)
