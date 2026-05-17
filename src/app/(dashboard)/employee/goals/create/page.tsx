import { GoalForm } from "@/components/forms/GoalForm"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CreateGoalPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/employee/goals" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create New Goal</h1>
      </div>
      
      <GoalForm />
    </div>
  )
}
