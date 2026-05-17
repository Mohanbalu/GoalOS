"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Shield, Lock, ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface TimelineConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  cycle: any
}

export function TimelineConfigurationModal({ isOpen, onClose, cycle }: TimelineConfigurationModalProps) {
  const [isSaving, setIsSaving] = React.useState(false)

  if (!cycle) return null

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Cycle governance timeline updated successfully.", {
        description: "All organizational nodes have been notified of the protocol change.",
      })
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-border/40 shadow-2xl">
        <DialogHeader className="p-8 bg-muted/5 border-b border-border/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight">Configure Governance Timeline</DialogTitle>
              <DialogDescription className="text-xs font-medium">{cycle.name} · FY 2026</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 grid grid-cols-2 gap-8 bg-card">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Operational Period
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 border border-border/40 rounded-xl p-3">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Start Date</span>
                  <span className="text-sm font-bold tracking-tight">Jan 01, 2026</span>
                </div>
                <div className="bg-muted/30 border border-border/40 rounded-xl p-3">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">End Date</span>
                  <span className="text-sm font-bold tracking-tight">Dec 31, 2026</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Active Governance Phase
              </label>
              <select className="w-full bg-muted/30 border border-border/40 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer">
                <option>Operational (Active)</option>
                <option>Planning & Strategy</option>
                <option>Review & Calibration</option>
                <option>System Lock</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Submission & Lock Parameters
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/10 border border-border/20 rounded-xl">
                  <span className="text-xs font-bold">Quarterly Lock</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/10 border border-border/20 rounded-xl opacity-50">
                  <span className="text-xs font-bold">Escalation Trigger</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">T-Minus 5d</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 items-start">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Policy Impact</p>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  Modifying the timeline will recalibrate all organizational milestones and sync audit ledgers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/5 border-t border-border/20 gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl text-[10px] font-black uppercase tracking-widest h-11 px-8">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="rounded-xl text-[10px] font-black uppercase tracking-widest h-11 px-10 shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            {isSaving ? "Syncing Protocols..." : "Commit Timeline Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
