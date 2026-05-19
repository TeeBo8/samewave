import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { headers } from "next/headers"

export async function createTRPCContext() {
  const hdrs = await headers()
  const sessionData = await auth.api.getSession({ headers: hdrs })

  return {
    db,
    session: sessionData?.session ?? null,
    user: sessionData?.user ?? null,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
