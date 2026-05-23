import { NavBar } from "@/components/navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t py-4 px-6">
        <div className="max-w-2xl mx-auto text-center text-xs text-muted-foreground">
          Crafted by{" "}
          <a
            href="https://www.teebostudio.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            TeeboStudio
          </a>
        </div>
      </footer>
    </div>
  )
}
