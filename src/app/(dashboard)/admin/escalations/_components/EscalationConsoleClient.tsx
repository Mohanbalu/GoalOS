"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { triggerEscalationsDetection, resolveEscalationAction } from "@/lib/actions/escalation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Settings2, 
  Search, 
  Flame, 
  GanttChartSquare 
} from "lucide-react"

interface Escalation {
  id: string
  reason: string
  level: number
  status: string
  createdAt: Date | string
  goal: {
    title: string
    user: {
      name: string
      department: { name: string } | null
    }
  }
}

export function EscalationConsoleClient({ initialEscalations }: { initialEscalations: Escalation[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isScanning, setIsScanning] = React.useState(false)
  const [isResolving, setIsResolving] = React.useState<string | null>(null)

  // Configure state rule inputs
  const [submissionDays, setSubmissionDays] = React.useState(14)
  const [approvalDays, setApprovalDays] = React.useState(7)
  const [checkinDays, setCheckinDays] = React.useState(15)

  const handleRunEngine = async () => {
    setIsScanning(true)
    try {
      const res = await triggerEscalationsDetection()
      if (res.success) {
        toast.success(`Compliance Scan Complete! ${res.count} new goals escalated to HR.`)
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger rules engine.")
    } finally {
      setIsScanning(false)
    }
  }

  const handleResolve = async (id: string) => {
    setIsResolving(id)
    try {
      const res = await resolveEscalationAction(id)
      if (res.success) {
        toast.success("Governance compliance alert marked as resolved.")
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve alert.")
    } finally {
      setIsResolving(null)
    }
  }

  const filtered = initialEscalations.filter(e => 
    e.goal.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.goal.user.department?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingAlerts = filtered.filter(e => e.status === "PENDING")
  const resolvedAlerts = filtered.filter(e => e.status === "RESOLVED")

  return (
    <div className="flex flex-col gap-6">
      {/* Rule Configurations & Scan Trigger */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rules Config Card */}
        <Card className="lg:col-span-2 rounded-[2rem] border bg-card/60 backdrop-blur shadow-sm">
          <CardHeader className="pb-4 border-b border-border/20">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-sm font-black">Escalation Trigger Rules</CardTitle>
                <CardDescription className="text-xs">Adjust target windows for automated strategic reminders.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 block">Goal Setting (Submission)</span>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={submissionDays}
                    onChange={(e) => setSubmissionDays(Number(e.target.value) || 0)}
                    className="h-9 rounded-xl text-xs w-20"
                  />
                  <span className="text-xs font-bold text-muted-foreground uppercase">Days</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 block">Manager L1 Approval</span>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={approvalDays}
                    onChange={(e) => setApprovalDays(Number(e.target.value) || 0)}
                    className="h-9 rounded-xl text-xs w-20"
                  />
                  <span className="text-xs font-bold text-muted-foreground uppercase">Days</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 block">Q-Check-in Capture Window</span>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={checkinDays}
                    onChange={(e) => setCheckinDays(Number(e.target.value) || 0)}
                    className="h-9 rounded-xl text-xs w-20"
                  />
                  <span className="text-xs font-bold text-muted-foreground uppercase">Days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Trigger Card */}
        <Card className="rounded-[2rem] border bg-card/60 backdrop-blur shadow-sm flex flex-col justify-between overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/20 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              Automated Rules Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-grow flex flex-col justify-between gap-4">
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Manually trigger a full organizational database audit to scan for outstanding goals and miss check-in SLAs.
            </p>
            <Button 
              onClick={handleRunEngine}
              disabled={isScanning}
              className="w-full h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="h-4 w-4 fill-current" /> 
              {isScanning ? "Scanning Database..." : "Execute Compliance Scan"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/20 pb-4">
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 pl-1">
          <GanttChartSquare className="h-4 w-4 text-slate-500" />
          Governance Queue ({pendingAlerts.length} Alerts Active)
        </h3>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Search alerts, departments..."
            className="pl-9 rounded-2xl h-9 bg-card border-border/40 focus:ring-1 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Escalation log table */}
      <Card className="rounded-[2rem] border bg-card/60 backdrop-blur shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-wider pl-6">Affected Actor</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-wider">Context (Goal Title)</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-wider">Violation Reason</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-wider">Tier Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-wider">Alert Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-wider pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => {
                return (
                  <TableRow key={e.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell className="pl-6">
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">{e.goal.user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{e.goal.user.department?.name || "N/A"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {e.goal.title}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-500 italic max-w-[200px] truncate" title={e.reason}>
                      &quot;{e.reason}&quot;
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] font-black px-2 py-0.5 rounded border shadow-sm ${
                        e.level >= 3 ? "bg-red-500/5 text-red-600 border-red-500/20" : 
                        e.level >= 2 ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                        "bg-blue-500/5 text-blue-600 border-blue-500/20"
                      }`}>
                        Tier {e.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {e.status === "PENDING" ? (
                        <Badge variant="outline" className="rounded bg-orange-500/5 text-orange-600 border-orange-500/20 text-[9px] font-black uppercase tracking-wider">
                          Active Incident
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="rounded bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                          RESOLVED
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {e.status === "PENDING" ? (
                        <Button 
                          onClick={() => handleResolve(e.id)}
                          variant="ghost" 
                          size="sm" 
                          disabled={isResolving === e.id}
                          className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 active:scale-95 transition-all flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Resolve Alert
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest pr-4">Closed</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/5 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-black italic">
                        No compliance exceptions found.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
