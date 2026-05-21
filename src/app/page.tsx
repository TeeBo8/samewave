import Link from "next/link"
import { Button } from "@/components/ui/button"

const DISCIPLINES = [
  { emoji: "🏄", name: "Surf" },
  { emoji: "🛹", name: "Skate" },
  { emoji: "🏔️", name: "Snow" },
  { emoji: "🚤", name: "Wake" },
  { emoji: "🪁", name: "Kite" },
  { emoji: "🛴", name: "Longboard" },
]

const STEPS = [
  {
    number: "01",
    title: "Trouve une session",
    desc: "Filtre par spot, discipline et niveau. Des riders près de toi, là maintenant.",
  },
  {
    number: "02",
    title: "Ride ensemble",
    desc: "Tu te retrouves au spot. C'est là que les vraies connexions naissent — pas dans les DMs.",
  },
  {
    number: "03",
    title: "Le reste arrive",
    desc: "Crew, potes, ou plus si affinités. Ce qui se passe après la session, c'est votre histoire.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">SameWave</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Rejoindre</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="py-28 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-7">
            <div className="inline-block border rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground mb-2">
              Surf · Skate · Snow · Wake · Kite
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Les vraies rencontres<br />
              <span className="text-muted-foreground">se passent au spot.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              SameWave connecte les riders par les sessions IRL.
              Pas de swipe, pas de match dans le vide —
              juste des gens qui vivent vraiment comme toi.
            </p>
            <div className="flex gap-3 justify-center flex-wrap pt-2">
              <Button size="lg" asChild>
                <Link href="/register">Créer mon compte</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/feed">Voir les sessions</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Gratuit · Pas de paywall · Pas de dark patterns
            </p>
          </div>
        </section>

        {/* Insight */}
        <section className="py-16 px-6 bg-muted/40">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <p className="text-2xl font-semibold leading-snug">
              &ldquo;Deux personnes qui partagent une session ont déjà plus en commun qu&apos;un couple qui a matché sur une app.&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">— SameWave</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-16">
              Comment ça marche
            </h2>
            <div className="grid sm:grid-cols-3 gap-12">
              {STEPS.map((s) => (
                <div key={s.number} className="space-y-4">
                  <span className="text-4xl font-black text-muted-foreground/30">
                    {s.number}
                  </span>
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disciplines */}
        <section className="py-16 px-6 bg-muted/40">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-xs font-semibold text-muted-foreground mb-8 uppercase tracking-widest">
              Toutes les disciplines
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {DISCIPLINES.map((d) => (
                <div
                  key={d.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-background hover:border-foreground/30 transition-colors"
                >
                  <span className="text-2xl">{d.emoji}</span>
                  <span className="text-xs font-medium">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
            <div className="space-y-2">
              <p className="text-2xl font-bold">IRL first</p>
              <p className="text-sm text-muted-foreground">
                La messagerie s&apos;ouvre après une session confirmée. Le spot d&apos;abord, le tchat ensuite.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">100% gratuit</p>
              <p className="text-sm text-muted-foreground">
                Pas de freemium, pas de paywall caché. L&apos;accès complet pour tous les riders, pour toujours.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">Safe by design</p>
              <p className="text-sm text-muted-foreground">
                Les vibes post-session construisent une réputation. La communauté s&apos;auto-régule naturellement.
              </p>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-24 px-6 bg-muted/40">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Same wave.<br />Same life.
            </h2>
            <p className="text-muted-foreground">
              Rejoins la communauté. Ta prochaine session — et peut-être plus — t&apos;attend déjà.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Je rejoins SameWave 🤙</Link>
            </Button>
          </div>
        </section>

      </main>

      <footer className="border-t py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 SameWave</span>
          <span>Fait avec 🤙 pour les riders</span>
        </div>
      </footer>

    </div>
  )
}
