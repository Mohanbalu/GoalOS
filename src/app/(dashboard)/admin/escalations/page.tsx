import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Shield } from "lucide-react"
import { EscalationConsoleClient } from "./_components/EscalationConsoleClient"

export const dynamic = "force-dynamic"

export default async function EscalationPage() {
  const session = await auth()
  
  // Verify administrator clearance level
  if (session?.user?.role !== "ADMIN") {
    redirect("/unauthorized")
  }

  // Fetch all escalations
  const escalations = await prisma.escalation.findMany({
    include: {
      goal: {
        include: {
          user: {
            include: {
              department: {
                select: { name: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex-grow space-y-8 p-1 animate-in fade-in slide-in-from-bottom-3 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Governance Alert Center</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Enterprise-wide oversight of compliance failures, automated escalations, and system integrity logs.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10 self-start md:self-auto">
          <Shield className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">HR Clearance L3</span>
        </div>
      </div>

      {/* Main Console */}
      <EscalationConsoleClient initialEscalations={escalations as any} />
    </div>
  )
}
