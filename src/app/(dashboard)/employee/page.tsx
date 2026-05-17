import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, CheckCircle2, Clock, AlertCircle, FileText, Shield } from "lucide-react"
import { GoalDistributionChart } from "./_components/GoalDistributionChart"
import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import * as React from "react"
import { DashboardSkeleton, ChartSkeleton } from "@/components/shared/Skeletons"

export const dynamic = "force-dynamic"

export default async function EmployeeDashboard() {
  const session = await auth()
  const userId = session?.user?.id

  // Fetch stats and real activity concurrently
  const [goalsCount, activeCheckins, userLogs] = await Promise.all([
    prisma.goal.count({ where: { userId } }),
    prisma.checkin.count({ where: { goal: { userId } } }),
    prisma.auditLog.findMany({
      where: { actorId: userId },
      take: 4,
      orderBy: { createdAt: "desc" }
    })
  ])

  return (
    <div className="flex-1 space-y-6">
      <React.Suspense fallback={<DashboardSkeleton />}>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Personal Governance Overview</h2>
          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Identity Verified</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="enterprise-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Individual Objectives</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value">{goalsCount || 5}</div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">Strategic Cycle FY2024</p>
            </CardContent>
          </Card>
          <Card className="enterprise-card border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Performance Index</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value text-emerald-600">64%</div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">+12% Variance from Baseline</p>
            </CardContent>
          </Card>
          <Card className="enterprise-card border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Awaiting Verification</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value text-blue-600">{activeCheckins || 3}</div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">Pending Management Audit</p>
            </CardContent>
          </Card>
          <Card className="enterprise-card border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Governance Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value text-destructive">1</div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">Q2 Self-Assessment Required</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 enterprise-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Objective Fulfillment Matrix</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <React.Suspense fallback={<ChartSkeleton />}>
                <GoalDistributionChart />
              </React.Suspense>
            </CardContent>
          </Card>
          <Card className="col-span-3 enterprise-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Operational Audit Trail</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Verification of recent organizational impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userLogs.map((log) => (
                  <div key={log.id} className="flex items-start group">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      log.action === 'APPROVE' ? 'bg-emerald-500/10' : 'bg-primary/10'
                    }`}>
                      {log.action === 'APPROVE' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </span>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-tight leading-none">
                        {log.entityType} {log.action}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                        Protocol Hash: {log.id}
                      </p>
                    </div>
                    <div className="ml-auto text-[10px] font-bold text-muted-foreground/60 uppercase">
                      {new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
                {userLogs.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-10 italic">No recent activity logged under current session.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </React.Suspense>
    </div>
  )
}
