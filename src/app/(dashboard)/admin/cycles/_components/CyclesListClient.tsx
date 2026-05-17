"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  Lock, 
  ArrowUpRight, 
  Settings2, 
  History,
  AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { TimelineConfigurationModal } from "./TimelineConfigurationModal"

interface Cycle {
  id: string
  name: string
  period: string
  status: string
  phase: string
  deadline: string
  completion: number
  priority: string
}

interface CyclesListClientProps {
  initialCycles: Cycle[]
}

export function CyclesListClient({ initialCycles }: CyclesListClientProps) {
  const router = useRouter()
  const [selectedCycle, setSelectedCycle] = React.useState<Cycle | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = React.useState(false)

  const handleConfigure = (cycle: Cycle) => {
    setSelectedCycle(cycle)
    setIsConfigModalOpen(true)
  }

  const handleManage = (id: string) => {
    router.push(`/admin/cycles/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold tracking-tight">Operational Planning Cycles</h2>
        </div>
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Audit History</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {initialCycles.map((cycle) => (
          <Card key={cycle.id} className={`enterprise-card group transition-all duration-500 overflow-hidden ${
            cycle.status === "ACTIVE" ? "border-primary/20 ring-1 ring-primary/5" : ""
          }`}>
            <div className={`h-1 w-full ${
              cycle.status === "ACTIVE" ? "bg-emerald-500" : 
              cycle.status === "LOCKED" ? "bg-amber-500" : 
              cycle.status === "ARCHIVED" ? "bg-slate-300 dark:bg-slate-700" : 
              "bg-blue-500"
            }`} />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
                      cycle.priority === "CRITICAL" ? "bg-red-500/5 text-red-600 border-red-500/10" : "bg-muted text-muted-foreground"
                    }`}>
                      {cycle.priority || "STANDARD"}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{cycle.period}</span>
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {cycle.name}
                  </CardTitle>
                </div>
                <Badge variant="outline" className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                  cycle.status === "ACTIVE" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]" : 
                  cycle.status === "LOCKED" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                  "bg-muted/50 text-muted-foreground border-border/50"
                }`}>
                  {cycle.status === "LOCKED" && <Lock className="mr-1.5 h-3 w-3 inline" />}
                  {cycle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Active Phase</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${cycle.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cycle.phase || "Inactive"}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Governance Deadline</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cycle.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground/60">Review Progress</span>
                  <span className="text-slate-900 dark:text-white">{cycle.completion}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden border border-border/10">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      cycle.status === "ACTIVE" ? "bg-emerald-500" : "bg-blue-500"
                    }`} 
                    style={{ width: `${cycle.completion}%` }} 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleConfigure(cycle)}
                  className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/50 hover:bg-muted/50 transition-all gap-2"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Configure Timeline
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleManage(cycle.id)}
                  className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all gap-2"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Manage Cycle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TimelineConfigurationModal 
        isOpen={isConfigModalOpen} 
        onClose={() => setIsConfigModalOpen(false)} 
        cycle={selectedCycle} 
      />
    </div>
  )
}
