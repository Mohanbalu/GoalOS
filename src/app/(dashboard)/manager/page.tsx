import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckSquare, TrendingUp, AlertCircle, Shield } from "lucide-react"
import { TeamProgressChart } from "./_components/TeamProgressChart"
import { TeamCheckinConsole } from "./_components/TeamCheckinConsole"
import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import * as React from "react"
import { DashboardSkeleton, ChartSkeleton } from "@/components/shared/Skeletons"
import { getCurrentQuarter } from "@/lib/utils/quarter"

export const dynamic = "force-dynamic"

export default async function ManagerDashboard() {
  const session = await auth()
  const managerId = session?.user?.id

  // 1. Get active quarter
  const currentQuarter = getCurrentQuarter()

  // 2. Fetch direct reports and goals concurrently
  const [teamMembers, pendingApprovals, pendingGoalsList] = await Promise.all([
    prisma.user.findMany({
      where: { managerId, isActive: true },
      include: {
        goals: {
          include: {
            checkins: true
          }
        }
      }
    }),
    prisma.goal.count({ 
      where: { 
        user: { managerId },
        status: "PENDING_APPROVAL"
      } 
    }),
    prisma.goal.findMany({
      where: { 
        user: { managerId },
        status: "PENDING_APPROVAL"
      },
      take: 4,
      include: {
        user: { select: { name: true } }
      }
    })
  ])

  // 3. Compute dynamic metrics
  const teamMembersCount = teamMembers.length
  const totalTeamGoals = teamMembers.reduce((sum, m) => sum + m.goals.length, 0)
  
  // Dynamic average aggregate progress
  const avgTeamProgress = totalTeamGoals > 0 
    ? Math.round(teamMembers.reduce((sum, m) => sum + m.goals.reduce((gSum, g) => gSum + g.currentProgress, 0), 0) / totalTeamGoals)
    : 0

  // Compliance exceptions: active goals missing checkin for the current quarter
  const complianceExceptions = teamMembers.reduce((sum, m) => {
    const missing = m.goals.filter(g => !g.checkins.some(c => c.quarter === currentQuarter)).length
    return sum + missing
  }, 0)

  // 4. Map data for chart
  const teamChartData = teamMembers.map(member => {
    const goalsCount = member.goals.length
    const avgProgress = goalsCount > 0 
      ? Math.round(member.goals.reduce((sum, g) => sum + g.currentProgress, 0) / goalsCount)
      : 0
    return {
      name: member.name,
      progress: avgProgress
    }
  })

  return (
    <div className="flex-grow space-y-8 p-1 animate-in fade-in slide-in-from-bottom-3 duration-1000">
      <React.Suspense fallback={<DashboardSkeleton />}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Departmental Operations</h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Track achievements, conduct check-ins, and manage strategic goals for your reports.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10 self-start md:self-auto">
            <Shield className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Manager console</span>
          </div>
        </div>

        {/* Dynamic KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="enterprise-card border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Governance Queue</CardTitle>
              <CheckSquare className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value">{pendingApprovals}</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Pending Calibration</p>
            </CardContent>
          </Card>

          <Card className="enterprise-card border-l-4 border-l-primary shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Assigned Human Capital</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value">{teamMembersCount}</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Direct Reports Active</p>
            </CardContent>
          </Card>

          <Card className="enterprise-card border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Team Velocity</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value text-emerald-600">{avgTeamProgress}%</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Avg. Aggregate Progress</p>
            </CardContent>
          </Card>

          <Card className={`enterprise-card border-l-4 shadow-sm ${complianceExceptions > 0 ? 'border-l-destructive' : 'border-l-slate-350'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Compliance Exceptions</CardTitle>
              <AlertCircle className={`h-4 w-4 ${complianceExceptions > 0 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`kpi-value ${complianceExceptions > 0 ? 'text-destructive' : 'text-slate-700'}`}>{complianceExceptions}</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Missing QCheck-ins ({currentQuarter})</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Pending Review Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 enterprise-card shadow-sm rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Departmental Velocity Analysis</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wider font-semibold">Individual completion rates by member</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <React.Suspense fallback={<ChartSkeleton />}>
                <TeamProgressChart data={teamChartData} />
              </React.Suspense>
            </CardContent>
          </Card>

          <Card className="col-span-3 enterprise-card shadow-sm rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Pending Review Queue</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wider font-semibold">Latest objective submissions awaiting audit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingGoalsList.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-4 rounded-2xl border border-border/30 p-3 hover:bg-muted/10 transition-colors cursor-pointer group">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-black text-primary text-[10px] uppercase">
                      {goal.user.name?.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-none truncate">{goal.user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate mt-1.5 italic">
                        &quot;{goal.title}&quot;
                      </p>
                    </div>
                    <CheckSquare className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                ))}
                {pendingGoalsList.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12 italic">No pending governance submissions.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Check-in Console */}
        <div className="border-t border-border/30 pt-8 mt-4">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Team Achievement & Check-in Console</h2>
            <p className="text-xs text-muted-foreground">Perform continuous validation of planned vs actual objectives and record manager commentary.</p>
          </div>
          <TeamCheckinConsole members={teamMembers} />
        </div>
      </React.Suspense>
    </div>
  )
}
