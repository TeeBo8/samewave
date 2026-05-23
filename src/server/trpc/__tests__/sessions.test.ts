import { describe, it, expect, vi } from "vitest"
import { createCallerFactory } from "@/server/trpc"
import { sessionsRouter } from "@/server/trpc/routers/sessions"
import { type Context } from "@/server/trpc/context"

vi.mock("@/lib/resend", () => ({
  resend: { emails: { send: vi.fn().mockResolvedValue({}) } },
  FROM_EMAIL: "noreply@samewave.app",
}))

vi.mock("nanoid", () => ({ nanoid: () => "generated-id" }))

// ─── Fixtures ────────────────────────────────────────────────────────────────

const CREATOR = { id: "user-creator", name: "Alice", email: "alice@test.com" }
const JOINER = { id: "user-joiner", name: "Bob", email: "bob@test.com" }
const OUTSIDER = { id: "user-outsider", name: "Carol", email: "carol@test.com" }

const FAKE_SESSION = {
  id: "session-1",
  creatorId: "user-creator",
  spotName: "Hossegor",
  creator: CREATOR,
}

const FAKE_PARTICIPANT = {
  id: "participant-1",
  sessionId: "session-1",
  userId: "user-joiner",
  status: "pending" as const,
  user: JOINER,
  session: FAKE_SESSION,
}

// ─── Mock DB factory ─────────────────────────────────────────────────────────

function makeMockDb() {
  return {
    query: {
      sessionParticipant: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      gameSession: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue(undefined) })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) })),
    })),
  }
}

function makeCtx(user: typeof CREATOR | null, db = makeMockDb()) {
  return {
    db,
    session: user ? { id: "sess-token", userId: user.id } : null,
    user,
  } as unknown as Context
}

const createCaller = createCallerFactory(sessionsRouter)

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("protectedProcedure", () => {
  it("throws UNAUTHORIZED when called without a session", async () => {
    const caller = createCaller(makeCtx(null))
    await expect(caller.join({ sessionId: "session-1" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    })
  })

  it("throws UNAUTHORIZED on create without a session", async () => {
    const caller = createCaller(makeCtx(null))
    await expect(
      caller.create({
        discipline: "surf",
        spotName: "Hossegor",
        scheduledAt: new Date(Date.now() + 86400000),
        level: "intermediate",
        vibe: "chill",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" })
  })
})

describe("sessions.join", () => {
  it("est idempotent — retourne l'ID existant si déjà inscrit", async () => {
    const db = makeMockDb()
    db.query.gameSession.findFirst.mockResolvedValue(FAKE_SESSION)
    db.query.sessionParticipant.findFirst.mockResolvedValue(FAKE_PARTICIPANT)

    const caller = createCaller(makeCtx(JOINER, db))
    const result = await caller.join({ sessionId: "session-1" })

    expect(result.id).toBe("participant-1")
    expect(db.insert).not.toHaveBeenCalled()
  })

  it("crée un participant pending si pas encore inscrit", async () => {
    const db = makeMockDb()
    db.query.gameSession.findFirst.mockResolvedValue(FAKE_SESSION)
    db.query.sessionParticipant.findFirst.mockResolvedValue(undefined)

    const caller = createCaller(makeCtx(JOINER, db))
    const result = await caller.join({ sessionId: "session-1" })

    expect(result.id).toBe("generated-id")
    expect(db.insert).toHaveBeenCalled()
  })

  it("interdit au créateur de rejoindre sa propre session", async () => {
    const db = makeMockDb()
    db.query.gameSession.findFirst.mockResolvedValue(FAKE_SESSION)

    const caller = createCaller(makeCtx(CREATOR, db))
    await expect(caller.join({ sessionId: "session-1" })).rejects.toMatchObject({
      code: "FORBIDDEN",
    })
  })
})

describe("sessions.updateParticipantStatus", () => {
  it("permet au créateur d'accepter un participant", async () => {
    const db = makeMockDb()
    db.query.sessionParticipant.findFirst.mockResolvedValue(FAKE_PARTICIPANT)

    const caller = createCaller(makeCtx(CREATOR, db))
    await expect(
      caller.updateParticipantStatus({ participantId: "participant-1", status: "accepted" })
    ).resolves.not.toThrow()
  })

  it("permet au créateur de rejeter un participant", async () => {
    const db = makeMockDb()
    db.query.sessionParticipant.findFirst.mockResolvedValue(FAKE_PARTICIPANT)

    const caller = createCaller(makeCtx(CREATOR, db))
    await expect(
      caller.updateParticipantStatus({ participantId: "participant-1", status: "rejected" })
    ).resolves.not.toThrow()
  })

  it("interdit à un non-créateur de modifier le statut d'un participant", async () => {
    const db = makeMockDb()
    db.query.sessionParticipant.findFirst.mockResolvedValue(FAKE_PARTICIPANT)

    const caller = createCaller(makeCtx(OUTSIDER, db))
    await expect(
      caller.updateParticipantStatus({ participantId: "participant-1", status: "accepted" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" })
  })

  it("interdit au participant de valider sa propre demande", async () => {
    const db = makeMockDb()
    db.query.sessionParticipant.findFirst.mockResolvedValue(FAKE_PARTICIPANT)

    const caller = createCaller(makeCtx(JOINER, db))
    await expect(
      caller.updateParticipantStatus({ participantId: "participant-1", status: "accepted" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" })
  })
})
