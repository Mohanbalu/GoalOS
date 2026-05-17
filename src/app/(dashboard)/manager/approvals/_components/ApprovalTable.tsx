"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, X, Edit2, Save, Inbox } from "lucide-react"
import { approveGoal, rejectGoal } from "@/lib/actions/governance"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/empty-state"

interface Goal {
  id: string
  title: string
  uom: string
  targetValue: number
  weightage: number
  status: string
  user: {
    name: string | null
  }
}

export function ApprovalTable({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = React.useState(initialGoals)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editValues, setEditValues] = React.useState<{ targetValue: number; weightage: number } | null>(null)

  const startEditing = (goal: Goal) => {
    setEditingId(goal.id)
    setEditValues({ targetValue: goal.targetValue, weightage: goal.weightage })
  }

  const handleApprove = async (goalId: string) => {
    try {
      const updates = editingId === goalId ? editValues! : undefined
      await approveGoal(goalId, updates)
      toast.success("Goal approved successfully")
      setGoals(goals.filter(g => g.id !== goalId))
      setEditingId(null)
    } catch {
      toast.error("Failed to approve goal")
    }
  }

  const handleReject = async (goalId: string) => {
    const reason = window.prompt("Reason for rejection:")
    if (!reason) return
    try {
      await rejectGoal(goalId, reason)
      toast.success("Goal sent back for revision")
      setGoals(goals.filter(g => g.id !== goalId))
    } catch {
      toast.error("Failed to reject goal")
    }
  }

  return (
    <div className="rounded-[2rem] border bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm animate-in fade-in duration-500">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 border-b border-border/40">
            <TableHead className="text-xs font-black uppercase tracking-widest pl-6 py-4">Employee</TableHead>
            <TableHead className="w-[300px] text-xs font-black uppercase tracking-widest py-4">Goal Title</TableHead>
            <TableHead className="text-xs font-black uppercase tracking-widest py-4">Target Value</TableHead>
            <TableHead className="text-xs font-black uppercase tracking-widest py-4">Weightage</TableHead>
            <TableHead className="text-right text-xs font-black uppercase tracking-widest pr-6 py-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="p-0 border-none">
                <EmptyState 
                  title="No Pending Approvals"
                  description="Your approval queue is completely clear. All strategic team objectives have been locked for this period."
                  icon={Inbox}
                />
              </TableCell>
            </TableRow>
          ) : (
            goals.map((goal) => (
              <TableRow key={goal.id} className="hover:bg-muted/10 transition-colors border-b border-border/20 last:border-0">
                <TableCell className="font-bold pl-6 py-4 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary uppercase">
                      {goal.user.name?.substring(0, 2) || "EM"}
                    </div>
                    <span>{goal.user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium py-4 text-slate-600 dark:text-slate-400">
                  {goal.title}
                </TableCell>
                <TableCell className="py-4">
                  {editingId === goal.id ? (
                    <Input 
                      type="number" 
                      className="w-24 h-9 rounded-lg border-border/50 text-sm font-bold bg-white dark:bg-slate-900"
                      value={editValues?.targetValue}
                      onChange={(e) => setEditValues({...editValues!, targetValue: Number(e.target.value)})}
                    />
                  ) : (
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {goal.targetValue} <span className="text-[10px] font-black uppercase tracking-wider opacity-60 ml-0.5">{goal.uom}</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {editingId === goal.id ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        className="w-20 h-9 rounded-lg border-border/50 text-sm font-bold bg-white dark:bg-slate-900"
                        value={editValues?.weightage}
                        onChange={(e) => setEditValues({...editValues!, weightage: Number(e.target.value)})}
                      />
                      <span className="text-xs font-black text-slate-500">%</span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-xs font-black bg-slate-100 dark:bg-slate-800 border-border/40">
                      {goal.weightage}%
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <div className="flex justify-end gap-2">
                    {editingId === goal.id ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => handleApprove(goal.id)}
                          className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
                        >
                          <Save className="h-3.5 w-3.5 mr-1" /> Approve Changes
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditingId(null)}
                          className="h-8 w-8 rounded-lg p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEditing(goal)}
                          className="h-8 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-500/5 border-amber-500/20 font-bold text-xs"
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit Inline
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(goal.id)}
                          className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleReject(goal.id)}
                          className="h-8 rounded-lg font-bold text-xs"
                        >
                          <X className="h-3.5 w-3.5 mr-1" /> Rework
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

}
