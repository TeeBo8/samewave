import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">SameWave 🏄</h1>
      <p className="text-muted-foreground max-w-md text-lg">
        Trouve des riders pour partager tes sessions. Surf, skate, snow, wake — partout en France.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/register">Rejoindre</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Connexion</Link>
        </Button>
      </div>
    </main>
  )
}
