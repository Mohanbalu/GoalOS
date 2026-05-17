"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { submitGoalSheet } from "@/lib/actions/goal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  HelpCircle,
  FileCheck,
  CheckSquare
} from "lucide-react"

interface Goal {
  id: string
  title: string
  weightage: number
  status: string
}

export function GoalSheetStatusPanel({ goals }: { goals: Goal[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0)
  const goalCount = goals.length
  const hasDraftsOrRevision = goals.some(g => g.status === "DRAFT" || g.status === "REVISION_REQUESTED")
  const allPending = goals.length > 0 && goals.every(g => g.status === "PENDING_APPROVAL")
  const allApproved = goals.length > 0 && goals.every(g => g.status === "APPROVED")

  // Validations
  const isCountValid = goalCount <= 8 && goalCount > 0
  const isIndividualWeightageValid = goals.every(g => g.weightage >= 10)
  const isTotalWeightageValid = totalWeightage === 100

  const isReadyForSubmission = isCountValid && isIndividualWeightageValid && isTotalWeightageValid && hasDraftsOrRevision

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await submitGoalSheet()
      if (res.success) {
        toast.success("Goal Sheet submitted successfully", {
          description: "Your strategic objectives are locked and awaiting manager (L1) approval.",
        })
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit goal sheet.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine state banner
  let bannerStyle = "border-amber-500/20 bg-amber-500/[0.03] text-amber-700 dark:text-amber-400"
  let bannerIcon = <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse" />
  let bannerTitle = "Goal Sheet Incomplete"
  let bannerDesc = `Your total committed weightage is currently at ${totalWeightage}%. It must equal exactly 100% to submit.`

  if (allApproved) {
    bannerStyle = "border-emerald-500/20 bg-emerald-500/[0.03] text-emerald-700 dark:text-emerald-400"
    bannerIcon = <ShieldCheck className="h-5 w-5 text-emerald-600" />
    bannerTitle = "Goal Sheet Locked & Approved"
    bannerDesc = "All strategic objectives are fully verified and locked under organizational governance protocols."
  } else if (allPending) {
    bannerStyle = "border-blue-500/20 bg-blue-500/[0.03] text-blue-700 dark:text-blue-400"
    bannerIcon = <Lock className="h-5 w-5 text-blue-500" />
    bannerTitle = "Pending Governance Review"
    bannerDesc = "Your goal sheet has been locked and submitted for L1 Manager approval."
  } else if (isReadyForSubmission) {
    bannerStyle = "border-emerald-500/30 bg-emerald-500/[0.05] text-emerald-700 dark:text-emerald-400"
    bannerIcon = <FileCheck className="h-5 w-5 text-emerald-600 animate-pulse" />
    bannerTitle = "Goal Sheet Validated"
    bannerDesc = "All governance constraints met. Ready to submit for formal strategic calibration."
  } else if (totalWeightage > 100) {
    bannerStyle = "border-destructive/20 bg-destructive/[0.03] text-destructive"
    bannerIcon = <ShieldAlert className="h-5 w-5 text-destructive" />
    bannerTitle = "Weightage Violation"
    bannerDesc = `Your total committed weightage exceeds 100% (Current: ${totalWeightage}%). Please adjust weightage.`
  }

  if (goals.length === 0) return null

  return (
    <Card className={`border rounded-[2rem] shadow-sm transition-all duration-300 overflow-hidden ${bannerStyle}`}>
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-border/20 shadow-inner flex items-center justify-center">
            {bannerIcon}
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">{bannerTitle}</h3>
            <p className="text-xs font-semibold opacity-80 mt-1 max-w-xl leading-relaxed">{bannerDesc}</p>
            
            {/* Rules Checklist */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-[10px] font-bold uppercase tracking-wider">
              <span className={`flex items-center gap-1.5 ${isTotalWeightageValid ? "text-emerald-600" : "opacity-60"}`}>
                <CheckSquare className={`h-3.5 w-3.5 ${isTotalWeightageValid ? "text-emerald-500" : "opacity-40"}`} />
                Total Weightage: 100% ({totalWeightage}%)
              </span>
              <span className={`flex items-center gap-1.5 ${isCountValid ? "text-emerald-600" : "opacity-60"}`}>
                <CheckSquare className={`h-3.5 w-3.5 ${isCountValid ? "text-emerald-500" : "opacity-40"}`} />
                Goal Count: ≤ 8 ({goalCount}/8)
              </span>
              <span className={`flex items-center gap-1.5 ${isIndividualWeightageValid ? "text-emerald-600" : "opacity-60"}`}>
                <CheckSquare className={`h-3.5 w-3.5 ${isIndividualWeightageValid ? "text-emerald-500" : "opacity-40"}`} />
                Min Goal Weightage: 10%
              </span>
            </div>
          </div>
        </div>

        {isReadyForSubmission && (
          <Button 
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all text-xs uppercase tracking-widest"
          >
            {isSubmitting ? "Submitting Protocol..." : "Submit Goal Sheet"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
