import prisma from "@/lib/db/prisma"
import { SharedGoalTable } from "./_components/SharedGoalTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SharedGoalsPage() {
  const sharedGoals = await prisma.sharedGoal.findMany({
    include: {
      goals: { select: { id: true } },
      department: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    select: { id: true, name: true, department: { select: { name: true } } }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shared Objectives</h1>
          <p className="text-muted-foreground">Manage cascading KPIs and departmental targets across the organization.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Shared KPI
        </Button>
      </div>

      <SharedGoalTable goals={sharedGoals} employees={employees} />
    </div>
  )
}
