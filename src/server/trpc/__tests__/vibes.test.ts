import { describe, it, expect, vi } from "vitest"
import { createCallerFactory } from "@/server/trpc"
import { vibesRouter } from "@/server/trpc/routers/vibes"
import { type Context } from "@/server/trpc/context"

vi.mock("nanoid", () => ({ nanoid: () => "generated-vibe-id" }))

// ─── Fixtures ────────────────────────────────────────────────────────────────

const USER_A = { id: "user-a", name: "Alice", email: "alice@test.com" }
const USER_B = { id: "user-b", name: "Bob", email: "bob@test.com" }

const EXISTING_VIBE = {
  id: "vibe-existing",
  sessionId: "session-1",
  fromUserId: "user-a",
  toUserId: "user-b",
  positive: true,
}

// ─── Mock DB factory ─────────────────────────────────────────────────────────

function makeMockDb(vibeTotal = 3) {
  return {
    query: {
      vibe: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue(undefined) })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ total: vibeTotal }]),
      })),
    })),
  }
}

function makeCtx(user: typeof USER_A | null, db = makeMockDb()) {
  return {
    db,
    session: user ? { id: "sess-token", userId: user.id } : null,
    user,
  } as unknown as Context
}

const createCaller = createCallerFactory(vibesRouter)

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("vibes.send", () => {
  it("est idempotent — retourne l'ID existant si le vibe existe déjà", async () => {
    const db = makeMockDb()
    db.query.vibe.findFirst.mockResolvedValue(EXISTING_VIBE)

    const caller = createCaller(makeCtx(USER_A, db))
    const result = await caller.send({ sessionId: "session-1", toUserId: USER_B.id })

    expect(result.id).toBe("vibe-existing")
    expect(db.insert).not.toHaveBeenCalled()
  })

  it("crée un nouveau vibe si pas encore envoyé", async () => {
    const db = makeMockDb()
    db.query.vibe.findFirst.mockResolvedValue(undefined)

    const caller = createCaller(makeCtx(USER_A, db))
    const result = await caller.send({ sessionId: "session-1", toUserId: USER_B.id })

    expect(result.id).toBe("generated-vibe-id")
    expect(db.insert).toHaveBeenCalled()
  })

  it("interdit d'envoyer un vibe à soi-même", async () => {
    const db = makeMockDb()

    const caller = createCaller(makeCtx(USER_A, db))
    await expect(
      caller.send({ sessionId: "session-1", toUserId: USER_A.id })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" })
  })

  it("throws UNAUTHORIZED sans session", async () => {
    const caller = createCaller(makeCtx(null))
    await expect(
      caller.send({ sessionId: "session-1", toUserId: USER_B.id })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" })
  })
})

describe("vibes.getCountForUser", () => {
  it("retourne le total de vibes positifs reçus", async () => {
    const db = makeMockDb(5)
    const caller = createCaller(makeCtx(USER_A, db))
    const total = await caller.getCountForUser({ userId: USER_B.id })
    expect(total).toBe(5)
  })
})
