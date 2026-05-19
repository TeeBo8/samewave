import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Tu es dans la place !</h1>
      <p className="text-muted-foreground max-w-sm">
        Le feed de sessions arrive en Phase 3. Profil sauvegardé, tu es prêt à rider.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  )
}
