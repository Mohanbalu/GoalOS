"use client"

import * as React from "react"
import { unlockGoal } from "@/lib/actions/governance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { 
  FileSpreadsheet, 
  LockOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  UserCheck,
  ClipboardList
} from "lucide-react"

interface Checkin {
  quarter: string
  actualValue: number
  status: string
}

interface Goal {
  id: string
  title: string
  thrustArea: string | null
  uom: string
  targetValue: number
  weightage: number
  isLocked: boolean
  status: string
  currentProgress: number
  checkins: Checkin[]
}

interface Employee {
  id: string
  name: string
  email: string
  department: { name: string } | null
  goals: Goal[]
}

export function GovernanceConsoleClient({ 
  employees, 
  currentQuarter 
}: { 
  employees: Employee[], 
  currentQuarter: string 
}) {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "unlock">("dashboard")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // 1. Filtered lists
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.department?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const allLockedGoals = employees.flatMap(emp => 
    emp.goals
      .filter(g => g.isLocked)
      .map(g => ({
        ...g,
        employeeName: emp.name,
        employeeDept: emp.department?.name ?? "N/A"
      }))
  ).filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.employeeName.toLowerCase().includes(searchQuery.toLowerCase()))

  // 2. CSV Exporter
  const handleExportCSV = () => {
    try {
      const headers = [
        "Employee Name",
        "Email",
        "Department",
        "Goal Title",
        "Strategic Focus",
        "Target Value",
        "UoM",
        "Weightage",
        "Q1 Actual",
        "Q2 Actual",
        "Q3 Actual",
        "Q4 Actual",
        "Overall Progress"
      ]

      const rows = employees.flatMap(emp => 
        emp.goals.map(goal => {
          const q1 = goal.checkins.find(c => c.quarter === "Q1")?.actualValue ?? ""
          const q2 = goal.checkins.find(c => c.quarter === "Q2")?.actualValue ?? ""
          const q3 = goal.checkins.find(c => c.quarter === "Q3")?.actualValue ?? ""
          const q4 = goal.checkins.find(c => c.quarter === "Q4")?.actualValue ?? ""

          return [
            `"${emp.name.replace(/"/g, '""')}"`,
            `"${emp.email.replace(/"/g, '""')}"`,
            `"${(emp.department?.name ?? "N/A").replace(/"/g, '""')}"`,
            `"${goal.title.replace(/"/g, '""')}"`,
            `"${(goal.thrustArea ?? "").replace(/"/g, '""')}"`,
            goal.targetValue,
            `"${goal.uom.replace(/"/g, '""')}"`,
            goal.weightage,
            q1,
            q2,
            q3,
            q4,
            `"${Math.round(goal.currentProgress)}%"`
          ]
        })
      )

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `GoalOS_Achievement_Report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Achievement Report exported successfully as CSV.")
    } catch (err) {
      toast.error("Export failure occurred.")
    }
  }

  // 3. Goal Unlock Trigger
  const handleUnlock = async (goalId: string, title: string) => {
    const reason = window.prompt(`Unlock Strategic Goal: "${title}"\n\nPlease supply a mandatory audit override explanation:`)
    if (!reason) {
      toast.error("An override reason is mandatory to preserve the governance trail.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await unlockGoal(goalId, reason)
      if (res.success) {
        toast.success("Strategic goal successfully unlocked for updates.")
        // Refresh local state without full reload
        window.location.reload()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to unlock strategic goal.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. Metrics
  const totalEmployees = employees.length
  const totalGoals = employees.reduce((sum, e) => sum + e.goals.length, 0)
  const completedCheckins = employees.reduce((sum, e) => 
    sum + e.goals.filter(g => g.checkins.some(c => c.quarter === currentQuarter)).length, 0
  )
  const completionRate = totalGoals > 0 ? Math.round((completedCheckins / totalGoals) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Top Interactive Metric Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Corporate Completion Velocity</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600">{completionRate}%</div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
              Active Quarter Check-ins Submitted ({currentQuarter})
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Compliance Nodes</CardTitle>
            <ClipboardList className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{completedCheckins} / {totalGoals}</div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
              Active Objectives Tracked
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Governance Actions</CardTitle>
            <Button 
              onClick={handleExportCSV} 
              size="sm" 
              className="h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[10px] uppercase tracking-widest px-3 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground font-semibold">
              Generate a high-fidelity planned vs actual spreadsheet for all organizational nodes.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Switcher & Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div className="flex bg-muted/40 p-1.5 rounded-2xl border border-border/30 w-full sm:w-auto">
          <button
            onClick={() => { setActiveTab("dashboard"); setSearchQuery(""); }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "dashboard"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-border/30"
                : "text-muted-foreground hover:text-slate-800"
            }`}
          >
            Completion Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("unlock"); setSearchQuery(""); }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "unlock"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-border/30"
                : "text-muted-foreground hover:text-slate-800"
            }`}
          >
            Exceptions & Override (Unlock)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder={activeTab === "dashboard" ? "Search employees..." : "Search locked goals..."}
            className="pl-9 rounded-2xl h-9 bg-card border-border/40 focus:ring-1 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Rendering */}
      {activeTab === "dashboard" ? (
        <Card className="rounded-[2rem] border bg-card/60 backdrop-blur shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/20">
            <CardTitle className="text-sm font-black">Real-Time Quarterly Verification Matrix</CardTitle>
            <CardDescription className="text-xs">
              Live status mapping of employee planned target alignment vs logged achievement.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-transparent">
                  <TableHead className="font-black text-[10px] uppercase tracking-wider pl-6">Employee</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider">Department</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider">Active Quarter Log Status ({currentQuarter})</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider">Strategic Objectives</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider pr-6 text-right">Aggregate Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => {
                  const goalsCount = emp.goals.length
                  const hasLogForQuarter = emp.goals.some(g => g.checkins.some(c => c.quarter === currentQuarter))
                  const completedAll = goalsCount > 0 && emp.goals.every(g => g.checkins.some(c => c.quarter === currentQuarter))
                  
                  const avgProgress = goalsCount > 0 
                    ? Math.round(emp.goals.reduce((sum, g) => sum + g.currentProgress, 0) / goalsCount)
                    : 0

                  return (
                    <TableRow key={emp.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell className="pl-6 font-bold text-slate-800 dark:text-slate-200">
                        <div>
                          <p className="text-sm font-black">{emp.name}</p>
                          <p className="text-[10px] text-muted-foreground">{emp.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {emp.department?.name ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {completedAll ? (
                          <Badge variant="outline" className="rounded-lg bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3" /> Fully Verified
                          </Badge>
                        ) : hasLogForQuarter ? (
                          <Badge variant="outline" className="rounded-lg bg-blue-500/5 text-blue-600 border-blue-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                            <Activity className="h-3 w-3 animate-pulse" /> Partially Tracked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-lg bg-amber-500/5 text-amber-600 border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                            <Clock className="h-3 w-3" /> Awaiting Capture
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {goalsCount} Active Objectives
                      </TableCell>
                      <TableCell className="pr-6 text-right font-black text-slate-800 dark:text-slate-100">
                        {avgProgress}%
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground italic">
                      No matching records loaded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-[2rem] border bg-card/60 backdrop-blur shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/20">
            <CardTitle className="text-sm font-black">Governance Override & Exception Locker</CardTitle>
            <CardDescription className="text-xs">
              Direct override controls to release locked goal sheets for updates. Each action writes atomically to the ledger.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-transparent">
                  <TableHead className="font-black text-[10px] uppercase tracking-wider pl-6">Employee</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider">Department</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider">Objective Focus & Title</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider">Lock Status</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-wider pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allLockedGoals.map((goal) => (
                  <TableRow key={goal.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell className="pl-6 font-bold text-slate-800 dark:text-slate-200">
                      {goal.employeeName}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {goal.employeeDept}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-tight text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                          {goal.thrustArea || "Strategic Focus"}
                        </span>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate mt-1">{goal.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-lg bg-orange-500/5 text-orange-600 border-orange-500/20 text-[9px] font-black uppercase tracking-wider">
                        Immutable Lock
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button 
                        onClick={() => handleUnlock(goal.id, goal.title)}
                        variant="outline" 
                        size="sm" 
                        disabled={isSubmitting}
                        className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 active:scale-95 transition-all flex items-center gap-1.5 ml-auto"
                      >
                        <LockOpen className="h-3.5 w-3.5" /> Unlock Goal
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {allLockedGoals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground italic">
                      No locked strategic objectives found under current criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
