import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Shield } from "lucide-react"
import { GovernanceConsoleClient } from "./_components/GovernanceConsoleClient"
import { getCurrentQuarter } from "@/lib/utils/quarter"

export default async function GovernancePage() {
  const session = await auth()
  
  // Verify administrator clearance level
  if (session?.user?.role !== "ADMIN") {
    redirect("/unauthorized")
  }

  // 1. Fetch active quarter
  const currentQuarter = getCurrentQuarter()

  // 2. Fetch all human capital entries, departments, and active goals with their checkins
  const employees = await prisma.user.findMany({
    where: { 
      role: "EMPLOYEE",
      isActive: true 
    },
    include: {
      department: {
        select: { name: true }
      },
      goals: {
        include: {
          checkins: {
            select: {
              quarter: true,
              actualValue: true,
              status: true
            }
          }
        }
      }
    },
    orderBy: { name: "asc" }
  })

  return (
    <div className="flex-grow space-y-8 p-1 animate-in fade-in slide-in-from-bottom-3 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Governance & Exceptions Control</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Real-time completion dashboards, compliance spreadsheet extraction, and administrative goal overrides.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10 self-start md:self-auto">
          <Shield className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">HR Clearance L3</span>
        </div>
      </div>

      {/* Main Console */}
      <GovernanceConsoleClient 
        employees={employees as any} 
        currentQuarter={currentQuarter} 
      />
    </div>
  )
}
