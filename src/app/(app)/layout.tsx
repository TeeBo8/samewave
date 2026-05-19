import Link from "next/link"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/feed" className="font-bold text-lg tracking-tight">
            SameWave
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/session/create"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              + Session
            </Link>
            <Link
              href="/profile/me"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Profil
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}
