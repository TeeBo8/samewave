type Props = {
  params: Promise<{ id: string }>
}

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Session {id} — Phase 3</p>
    </div>
  )
}
