import { SessionDetail } from "./session-detail"

type Props = { params: Promise<{ id: string }> }

export default async function SessionPage({ params }: Props) {
  const { id } = await params
  return <SessionDetail sessionId={id} />
}
