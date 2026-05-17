"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { submitManagerReview } from "@/lib/actions/checkin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Users, 
  Target, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  CalendarDays
} from "lucide-react"

interface Checkin {
  id: string
  quarter: string
  actualValue: number
  employeeComment: string | null
  managerComment: string | null
  status: string
}

interface Goal {
  id: string
  title: string
  description: string | null
  thrustArea: string | null
  uom: string
  targetValue: number
  weightage: number
  formulaType: string
  currentProgress: number
  checkins: Checkin[]
}

interface TeamMember {
  id: string
  name: string
  email: string
  goals: Goal[]
}

export function TeamCheckinConsole({ members }: { members: TeamMember[] }) {
  const router = useRouter()
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>(members[0]?.id || "")
  const [editingCheckinId, setEditingCheckinId] = React.useState<string | null>(null)
  const [managerCommentText, setManagerCommentText] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const activeMember = members.find(m => m.id === selectedMemberId)

  const handleSaveComment = async (checkinId: string) => {
    if (!managerCommentText.trim()) {
      toast.error("Commentary text cannot be blank.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitManagerReview({
        checkinId,
        managerComment: managerCommentText
      })
      if (res.success) {
        toast.success("Governance commentary logged successfully.")
        setEditingCheckinId(null)
        setManagerCommentText("")
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review comment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditing = (checkinId: string, currentComment: string | null) => {
    setEditingCheckinId(checkinId)
    setManagerCommentText(currentComment || "")
  }

  if (members.length === 0) {
    return (
      <Card className="rounded-[2rem] border bg-card/60 backdrop-blur-xl p-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
        <h3 className="text-lg font-bold">No Direct Reports Found</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          You are not currently assigned as manager for any employees under organizational structures.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Sidebar - Direct Reports */}
      <div className="lg:col-span-1 flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 pl-2">Operational Reports</h3>
        <div className="flex flex-col gap-2">
          {members.map((member) => {
            const isActive = member.id === selectedMemberId
            const avgProgress = member.goals.length > 0 
              ? Math.round(member.goals.reduce((sum, g) => sum + g.currentProgress, 0) / member.goals.length)
              : 0

            return (
              <button
                key={member.id}
                onClick={() => {
                  setSelectedMemberId(member.id)
                  setEditingCheckinId(null)
                }}
                className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                  isActive 
                    ? "bg-slate-900 border-slate-950 dark:bg-white dark:border-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10 dark:shadow-white/5 scale-[1.02]"
                    : "bg-card hover:bg-muted/10 border-border/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-black truncate">{member.name}</p>
                  <p className={`text-[10px] font-semibold truncate mt-1 ${isActive ? "text-white/60 dark:text-slate-500" : "text-muted-foreground"}`}>
                    {member.goals.length} Strategic Objectives
                  </p>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className={`text-xs font-black ${isActive ? "text-white" : "text-primary"}`}>{avgProgress}%</span>
                  <ChevronRight className="h-4 w-4 opacity-50 shrink-0" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Console Area */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {activeMember && (
          <>
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">{activeMember.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{activeMember.email}</p>
              </div>
              <Badge variant="secondary" className="rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">
                Team Alignment Matrix
              </Badge>
            </div>

            {activeMember.goals.length === 0 ? (
              <Card className="rounded-[2rem] border bg-card/60 backdrop-blur-xl p-12 text-center">
                <Target className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                <h4 className="text-sm font-bold">No Goals Configured</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  This employee has not added any performance objectives for the active cycle.
                </p>
              </Card>
            ) : (
              <div className="flex flex-col gap-6">
                {activeMember.goals.map((goal) => {
                  return (
                    <Card key={goal.id} className="rounded-[2rem] border bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-muted/10 border-b border-border/30 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                              {goal.thrustArea || "Strategic Focus"}
                            </span>
                            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 mt-2 truncate">{goal.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{goal.description || "No description loaded."}</p>
                          </div>
                          <div className="flex items-center gap-6 shrink-0 bg-white dark:bg-slate-900 border border-border/30 rounded-2xl p-3 shadow-inner">
                            <div className="text-center">
                              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Progress</span>
                              <span className="text-base font-black text-slate-800 dark:text-slate-100">{Math.round(goal.currentProgress)}%</span>
                            </div>
                            <div className="text-center">
                              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Weight</span>
                              <span className="text-base font-black text-slate-800 dark:text-slate-100">{goal.weightage}%</span>
                            </div>
                            <div className="text-center">
                              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Target</span>
                              <span className="text-sm font-black text-slate-800 dark:text-slate-100">{goal.targetValue} {goal.uom}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Quarterly Fulfillment Details
                        </h5>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                            const checkin = goal.checkins.find(c => c.quarter === q)

                            return (
                              <div key={q} className="rounded-2xl border border-border/30 bg-white dark:bg-slate-900/50 p-4 shadow-sm flex flex-col justify-between min-h-[170px]">
                                <div>
                                  <div className="flex items-center justify-between gap-2 border-b border-border/20 pb-2 mb-2">
                                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{q}</span>
                                    {checkin ? (
                                      <Badge variant="outline" className={`rounded px-1.5 py-0 text-[8px] font-black uppercase tracking-wider shrink-0 ${
                                        checkin.status === "COMPLETED" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" : 
                                        checkin.status === "ON_TRACK" ? "bg-blue-500/5 text-blue-600 border-blue-500/20" :
                                        "bg-amber-500/5 text-amber-600 border-amber-500/20"
                                      }`}>
                                        {checkin.status.replace("_", " ")}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="rounded px-1.5 py-0 text-[8px] font-black uppercase tracking-wider text-muted-foreground/60 border-border/40 shrink-0">
                                        Pending
                                      </Badge>
                                    )}
                                  </div>

                                  {checkin ? (
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-[9px] font-black uppercase tracking-tight text-slate-500 block">Achievement</span>
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                                          {checkin.actualValue} / {goal.targetValue} <span className="text-[8px] opacity-60 font-black">{goal.uom}</span>
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] font-black uppercase tracking-tight text-slate-500 block">Commentary</span>
                                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold line-clamp-2" title={checkin.employeeComment || ""}>
                                          &quot;{checkin.employeeComment || "N/A"}&quot;
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                      <Clock className="h-6 w-6 text-muted-foreground/30 animate-pulse mb-1" />
                                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Awaiting Log</span>
                                    </div>
                                  )}
                                </div>

                                {checkin && (
                                  <div className="border-t border-border/20 pt-2 mt-2">
                                    <span className="text-[9px] font-black uppercase tracking-tight text-primary block flex items-center gap-1">
                                      <MessageSquare className="h-2.5 w-2.5" />
                                      Manager Comment
                                    </span>
                                    
                                    {editingCheckinId === checkin.id ? (
                                      <div className="flex flex-col gap-1.5 mt-1.5">
                                        <Textarea 
                                          className="text-[10px] p-2 resize-none h-14 rounded-lg bg-white"
                                          placeholder="Enter check-in commentary..."
                                          value={managerCommentText}
                                          onChange={(e) => setManagerCommentText(e.target.value)}
                                        />
                                        <div className="flex items-center gap-1 justify-end">
                                          <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            onClick={() => setEditingCheckinId(null)}
                                            className="h-6 text-[9px] font-bold px-2 rounded-md"
                                          >
                                            Cancel
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            disabled={isSubmitting}
                                            onClick={() => handleSaveComment(checkin.id)}
                                            className="h-6 text-[9px] font-bold px-3 bg-slate-900 text-white rounded-md"
                                          >
                                            {isSubmitting ? "Saving..." : "Save"}
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div 
                                        onClick={() => startEditing(checkin.id, checkin.managerComment)}
                                        className="mt-1 cursor-pointer rounded-lg bg-slate-50 dark:bg-slate-800/40 p-2 hover:bg-primary/5 hover:text-primary transition-colors min-h-[40px] flex items-center"
                                      >
                                        {checkin.managerComment ? (
                                          <p className="text-[9px] font-semibold italic text-slate-700 dark:text-slate-300 line-clamp-2">
                                            &quot;{checkin.managerComment}&quot;
                                          </p>
                                        ) : (
                                          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1 mx-auto">
                                            + Add Comment
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
