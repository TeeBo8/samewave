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

const FEATURES = [
  {
    icon: "📍",
    title: "Trouve des spots près de toi",
    desc: "Sessions géolocalisées partout en France. Filtre par discipline et niveau.",
  },
  {
    icon: "🤝",
    title: "Rejoins ou organise une session",
    desc: "Crée ta session, accepte les riders, et ride ensemble.",
  },
  {
    icon: "🤙",
    title: "Vibes post-session",
    desc: "Envoie des vibes aux riders avec qui tu as sharé une bonne session.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
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
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Ride ensemble.<br />
              <span className="text-muted-foreground">Partout en France.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              SameWave connecte les riders de surf, skate, snow et plus.
              Trouve des sessions ouvertes, rejoins des spots, partage des vibes.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button size="lg" asChild>
                <Link href="/register">Créer mon compte</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/feed">Voir les sessions</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Disciplines */}
        <section className="py-12 px-6 bg-muted/40">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
              Disciplines
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {DISCIPLINES.map((d) => (
                <div
                  key={d.name}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl border bg-background hover:border-foreground/20 transition-colors"
                >
                  <span className="text-2xl">{d.emoji}</span>
                  <span className="text-xs font-medium">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">
              Comment ça marche
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="space-y-3">
                  <div className="text-3xl">{f.icon}</div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-muted/40">
          <div className="max-w-xl mx-auto text-center space-y-5">
            <h2 className="text-3xl font-bold">Prêt à rider ?</h2>
            <p className="text-muted-foreground">
              Rejoins la communauté, crée ta première session et trouve des riders sur la même longueur d&apos;onde.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">C&apos;est parti 🤙</Link>
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
