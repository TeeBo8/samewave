import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { riderProfile } from "@/server/db/schema"
import { OnboardingForm } from "./onboarding-form"

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const profile = await db.query.riderProfile.findFirst({
    where: eq(riderProfile.userId, session.user.id),
  })

  if (profile?.onboardingCompleted) redirect("/feed")

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <OnboardingForm userName={session.user.name} />
    </div>
  )
}
