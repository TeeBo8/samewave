# SameWave 🌊

**Find riders for your next session — surf, skate, snow, wake, kite.**

SameWave connects riders who want to session together IRL. No matching algorithms, no DMs required. Just open sessions, join requests, and vibes.

🔗 **[samewave-silk.vercel.app](https://samewave-silk.vercel.app)**

---

## The problem

You show up at the spot alone. Your usual crew isn't around. The Facebook group has 3000 members but nobody answers. You session alone anyway.

SameWave fixes that. Riders post sessions. Other riders join. Simple.

---

## Features

- **Session feed** — Browse open sessions nearby, filter by discipline
- **Map view** — See sessions on a map (MapLibre, zero API token needed)
- **Join requests** — Request to join a session, creator accepts or rejects
- **Rider profiles** — Level, disciplines, favorite spots, bio
- **Vibes** — Post-session positive feedback between riders
- **Email notifications** — Join requests & status updates via Resend
- **Dark / light mode** — Because riders have taste
- **Mobile-first** — Built for the beach, the park, the mountain

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| UI | shadcn/ui + Tailwind CSS v4 |
| API | tRPC v11 |
| Database | Neon (PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| Maps | MapLibre GL + react-map-gl |
| Emails | Resend |
| Deployment | Vercel |
| Tests | Vitest (14 tests, security-focused) |

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- A [Neon](https://neon.tech) database
- A [Resend](https://resend.com) API key

### Setup

```bash
git clone https://github.com/TeeBo8/samewave.git
cd samewave
pnpm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL=
DATABASE_URL_UNPOOLED=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=
```

Push the database schema:

```bash
pnpm db:push
```

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tests

```bash
pnpm test        # run once
pnpm test:watch  # watch mode
```

14 tests covering auth middleware, session join/accept security, and vibe constraints.

---

## Disciplines

Surf · Skate · Snowboard · Wake · Kite · Longboard

---

## Roadmap

- [ ] Google OAuth
- [ ] Photo upload (session / avatar)
- [ ] Direct messaging between riders
- [ ] Vibe leaderboard
- [ ] PWA / push notifications
- [ ] Map clustering for dense spots

---

## Contributing

This project is early-stage and feedback-driven. If you ride and have opinions about what's missing — open an issue or drop a message.

---

## License

MIT
