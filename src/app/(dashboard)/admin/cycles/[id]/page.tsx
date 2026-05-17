import prisma from "@/lib/db/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Building, 
  BarChart3, 
  Clock, 
  History, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Lock,
  Search
} from "lucide-react"
import Link from "next/link"

export default async function CycleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Seeded high-fidelity data for the specific cycle
  const cycle = {
    id,
    name: "FY 2026 Strategic Objectives",
    period: "Jan 01 – Dec 31, 2026",
    status: "ACTIVE",
    phase: "Operational Phase II",
    completion: 42.8,
    employeeCount: 1248,
    deptCount: 14,
    pendingApprovals: 86,
    escalatedNodes: 4,
    auditCount: 324,
    lastUpdate: "Just now",
  }

  return (
    <div className="flex flex-col gap-8 p-1 animate-in fade-in slide-in-from-left-4 duration-1000">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/cycles" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Back to Governance Hub
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8 mt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{cycle.name}</h1>
              <Badge className="rounded-lg px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                {cycle.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Detailed operational oversight of objective fulfillment, governance state, and organizational performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl font-bold px-6 border-border/50">
              <History className="mr-2 h-4 w-4" /> View Full Audit Ledger
            </Button>
            <Button className="h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 shadow-xl hover:scale-105 transition-all">
              Manage Governance Protocols
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="enterprise-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="kpi-label">Strategic Fulfillment</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="kpi-value-lg text-emerald-600">{cycle.completion}%</div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${cycle.completion}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="kpi-label">Participating Personnel</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="kpi-value-lg">{cycle.employeeCount.toLocaleString()}</div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase mt-2">Active Strategic Contributors</p>
          </CardContent>
        </Card>
        <Card className="enterprise-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="kpi-label">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="kpi-value-lg text-amber-600">{cycle.pendingApprovals}</div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase mt-2">Requiring Administrative Action</p>
          </CardContent>
        </Card>
        <Card className="enterprise-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="kpi-label">Escalated Objectives</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="kpi-value-lg text-red-600">{cycle.escalatedNodes}</div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase mt-2">High Risk Protocol Breaches</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details & Departments */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="enterprise-card border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl font-black tracking-tight">Governance Intelligence Summary</CardTitle>
              <CardDescription>Comprehensive overview of current strategic alignment across all organizational nodes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Active Phase</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">{cycle.phase}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Audit Velocity</span>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary/60" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">{cycle.auditCount} Events / Cycle</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Business Units</span>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary/60" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">{cycle.deptCount} Divisions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="enterprise-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Participating Business Units</CardTitle>
                <CardDescription>Departmental fulfillment rates and governance status.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/50">
                <Search className="mr-2 h-3.5 w-3.5" /> Filter Units
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Executive Leadership", progress: 94, status: "Healthy" },
                  { name: "Engineering & R&D", progress: 88, status: "Healthy" },
                  { name: "Sales & Marketing", progress: 72, status: "At Risk" },
                  { name: "Operations & Logistics", progress: 81, status: "Healthy" },
                ].map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-4 bg-muted/5 border border-border/30 rounded-2xl hover:bg-muted/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Building className="h-5 w-5 text-primary/60" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{dept.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{dept.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{dept.progress}%</p>
                        <div className="h-1 w-24 bg-muted rounded-full mt-1.5 overflow-hidden">
                          <div className={`h-full ${dept.progress > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${dept.progress}%` }} />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary/5 group-hover:text-primary">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline & Lock Controls */}
        <div className="space-y-8">
          <Card className="enterprise-card bg-slate-900 dark:bg-white text-white dark:text-slate-900 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Lock className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center border border-white/20 dark:border-slate-900/20 mb-4">
                <Lock className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight">Cycle Governance Lock</CardTitle>
              <CardDescription className="text-white/60 dark:text-slate-900/60 font-medium mt-1">Manage the operational mutability of the current strategic window.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 dark:bg-slate-900/5 border border-white/10 dark:border-slate-900/10 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 dark:text-slate-900/40">Status</p>
                    <p className="text-sm font-black">Open for Submissions</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white border-0 text-[10px] font-black">ACTIVE</Badge>
                </div>
              </div>
              <Button className="w-full h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-[1.02] transition-all">
                Execute Governance Lock
              </Button>
            </CardContent>
          </Card>

          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Operational Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/40">
                {[
                  { label: "Cycle Initiation", date: "Jan 01, 2026", status: "Completed" },
                  { label: "Q1 Strategy Review", date: "Mar 31, 2026", status: "Completed" },
                  { label: "Q2 Calibration", date: "Jun 30, 2026", status: "Upcoming" },
                  { label: "Final Audit Pass", date: "Dec 31, 2026", status: "Scheduled" },
                ].map((step, i) => (
                  <div key={step.label} className="flex gap-4 relative">
                    <div className={`h-6 w-6 rounded-full border-4 border-card z-10 ${
                      step.status === "Completed" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : 
                      step.status === "Upcoming" ? "bg-primary shadow-[0_0_12px_rgba(59,130,246,0.4)] animate-pulse" : 
                      "bg-muted border-border/40"
                    }`} />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{step.label}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{step.date} · {step.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
