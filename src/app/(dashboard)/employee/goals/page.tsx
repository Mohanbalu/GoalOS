import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { Plus, Lock, FileEdit, Target, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { GoalSheetStatusPanel } from "./_components/GoalSheetStatusPanel"

export const dynamic = "force-dynamic"

export default async function GoalsPage() {
  const session = await auth()
  const userId = session?.user?.id

  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col gap-8 p-1 animate-in fade-in slide-in-from-bottom-3 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Performance Goals</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Define, track, and align your strategic objectives with organization thrust areas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/employee/goals/create" 
            className={`${buttonVariants({ variant: "default" })} h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 shadow-xl hover:scale-105 transition-all`}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Individual Goal
          </Link>
        </div>
      </div>

      {/* Goal Sheet Status Banner */}
      <GoalSheetStatusPanel goals={goals} />

      {/* Goals Table */}
      <div className="rounded-[2rem] border bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/40">
              <TableHead className="w-[300px] text-xs font-black uppercase tracking-widest pl-6 py-4">Goal Title</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest py-4">Status</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest py-4">Weightage</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest py-4">Target</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest py-4">Progress</TableHead>
              <TableHead className="text-right text-xs font-black uppercase tracking-widest pr-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0 border-none">
                  <EmptyState 
                    title="No Objectives Found"
                    description="Your goal sheet is currently empty. Design and add your performance objectives to commit."
                    icon={Target}
                    action={{
                      label: "Define First Goal",
                      href: "/employee/goals/create"
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              goals.map((goal) => (
                <TableRow key={goal.id} className="hover:bg-muted/10 transition-colors border-b border-border/20 last:border-0">
                  <TableCell className="font-bold pl-6 py-4">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      {goal.isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />}
                      <span>{goal.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      goal.status === "APPROVED" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" : 
                      goal.status === "PENDING_APPROVAL" ? "bg-blue-500/5 text-blue-600 border-blue-500/20" :
                      goal.status === "REVISION_REQUESTED" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                      "bg-muted/50 text-muted-foreground border-border/50"
                    }`}>
                      {goal.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300">{goal.weightage}%</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{goal.targetValue} {goal.uom}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 rounded-full bg-muted/40 overflow-hidden border border-border/10">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${goal.currentProgress}%` }} 
                        />
                      </div>
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{goal.currentProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <Button variant="ghost" size="icon" disabled={goal.isLocked} className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
