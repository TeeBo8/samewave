"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { trpc } from "@/trpc/client"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-1 rounded-md hover:bg-accent transition-colors"
      aria-label="Changer de thème"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export function NavBar() {
  const { data } = trpc.users.getNotifications.useQuery(undefined, {
    refetchInterval: 30_000,
  })

  const pendingCount = data?.pendingRequests.length ?? 0

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/feed" className="font-bold text-lg tracking-tight">
          SameWave
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/session/create">+ Session</Link>
          <Link href="/notifications" className="relative">
            🔔
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </Link>
          <Link href="/profile/me">Profil</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
