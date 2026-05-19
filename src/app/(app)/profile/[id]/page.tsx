type Props = {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Profil {id} — Phase 4</p>
    </div>
  )
}
