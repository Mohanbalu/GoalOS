import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Building2, Calendar, FileText, Activity, AlertCircle, TrendingUp, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { OrgPerformanceChart } from "./_components/OrgPerformanceChart"
import prisma from "@/lib/db/prisma"
import * as React from "react"
import { DashboardSkeleton, ChartSkeleton } from "@/components/shared/Skeletons"

export default async function AdminDashboard() {
  const [usersCount, activeCycles, totalGoals, logs] = await Promise.all([
    prisma.user.count(),
    prisma.cycle.count({ where: { status: "ACTIVE" } }),
    prisma.goal.count(),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        entityType: true,
        createdAt: true,
        actorId: true,
      }
    })
  ])

  // Manual join for actor names since the relation is missing in schema
  const actorIds = [...new Set(logs.map(log => log.actorId))]
  const actors = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, name: true }
  })

  const actorMap = Object.fromEntries(actors.map(a => [a.id, a.name]))
  const recentLogs = logs.map(log => ({
    ...log,
    actorName: actorMap[log.actorId] || 'System Authority'
  }))

  return (
    <div className="flex-1 space-y-8 p-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <React.Suspense fallback={<DashboardSkeleton />}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/50 pb-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Governance Control Center</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Real-time oversight of organizational alignment and compliance integrity.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="executive-signal">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Audit Integrity: 100%</span>
            </div>
            <div className="executive-signal">
              <Activity className="h-3 w-3 text-blue-500" />
              <span>Last Sync: 2m ago</span>
            </div>
            <div className="executive-signal bg-amber-500/5 border-amber-500/20 text-amber-700">
              <AlertCircle className="h-3 w-3" />
              <span>14 Pending Reviews</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="enterprise-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Enterprise Business Units</CardTitle>
              <Building2 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value-lg">06</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Operational</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase">Global Nodes</span>
              </div>
            </CardContent>
          </Card>
          <Card className="enterprise-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Human Capital Base</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value-lg">2,482</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase">+34 Monthly</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase">Verified Identities</span>
              </div>
            </CardContent>
          </Card>
          <Card className="enterprise-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Governance Integrity</CardTitle>
              <Shield className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value-lg text-emerald-600">92.4%</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">High Trust</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase">Compliance Pass</span>
              </div>
            </CardContent>
          </Card>
          <Card className="enterprise-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="kpi-label">Strategic Objectives</CardTitle>
              <Target className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="kpi-value-lg">1,248</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">84% Complete</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase">Alignment Index</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 enterprise-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Organizational Performance Matrix</CardTitle>
                <p className="text-xs text-muted-foreground font-medium mt-1">Strategic completion distribution across core enterprise business units.</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground/50" />
            </CardHeader>
            <CardContent className="pl-2 pt-4">
              <React.Suspense fallback={<ChartSkeleton />}>
                <OrgPerformanceChart />
              </React.Suspense>
            </CardContent>
          </Card>
          
          <Card className="col-span-3 enterprise-card flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-4">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">Governance Ledger</CardTitle>
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary mt-1">Immutable Activity Stream</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pt-4 scrollbar-hide">
              <div className="space-y-1">
                {recentLogs.map((log) => (
                  <div key={log.id} className="activity-feed-item group">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                      <Shield className="h-4 w-4 text-slate-500 group-hover:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold leading-none uppercase tracking-tight text-slate-900 dark:text-slate-100">
                          {log.entityType} {log.action.replace('_', ' ')}
                        </p>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-muted-foreground font-medium truncate">
                          Actor: <span className="text-slate-700 dark:text-slate-300 font-bold">{log.actorName}</span>
                        </p>
                        <span className="text-[10px] text-muted-foreground/30">•</span>
                        <p className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1 rounded">
                          {log.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentLogs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <Shield className="h-10 w-10 text-muted-foreground/20" />
                    <p className="text-xs text-muted-foreground font-medium italic">No recent governance events detected.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 border-t border-border/30 bg-muted/10 mt-auto">
              <Link href="/admin/audit" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-all">
                  View Full Audit Ledger
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </React.Suspense>
    </div>
  )
}
