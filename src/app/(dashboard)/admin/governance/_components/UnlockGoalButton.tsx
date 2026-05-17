"use client"

import { Button } from "@/components/ui/button"
import { LockOpen } from "lucide-react"
import { unlockGoal } from "@/lib/actions/governance"
import { toast } from "sonner"

export function UnlockGoalButton({ goalId, goalTitle }: { goalId: string; goalTitle: string }) {
  const handleUnlock = async () => {
    const reason = window.prompt(`Unlock Goal: "${goalTitle}"\n\nPlease provide a mandatory reason for this governance override:`)
    if (!reason) return

    try {
      await unlockGoal(goalId, reason)
      toast.success("Goal successfully unlocked for employee editing")
      window.location.reload() // Quick refresh for hackathon
    } catch {
      toast.error("Failed to unlock goal. Admin privileges required.")
    }
  }

  return (
    <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={handleUnlock}>
      <LockOpen className="h-4 w-4 mr-1" /> Unlock
    </Button>
  )
}
