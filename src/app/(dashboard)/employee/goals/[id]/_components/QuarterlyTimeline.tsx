import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from "lucide-react"
import { Quarter, FormulaType, Checkin } from "@prisma/client"
import { calculateProgress } from "@/lib/utils/progress"

interface GoalWithCheckins {
  formulaType: FormulaType
  targetValue: number
  uom: string
  checkins: Checkin[]
}

export function QuarterlyTimeline({ goal }: { goal: GoalWithCheckins }) {
  const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"]
  
  return (
    <div className="relative flex justify-between items-start pt-4">
      {/* Line connecting the points */}
      <div className="absolute top-[26px] left-0 w-full h-0.5 bg-muted z-0" />
      
      {quarters.map((q) => {
        const checkin = goal.checkins.find((c: Checkin) => c.quarter === q)
        const progress = checkin ? calculateProgress(goal.formulaType, goal.targetValue, checkin.actualValue) : 0
        const isCompleted = checkin?.status === "COMPLETED" || progress >= 100

        return (
          <div key={q} className="relative z-10 flex flex-col items-center gap-3 w-1/4">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background ${
              isCompleted ? "border-primary" : checkin ? "border-blue-500" : "border-muted"
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : checkin ? (
                <Clock className="h-4 w-4 text-blue-500" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-muted" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider">{q}</p>
              <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                {checkin ? `${Math.round(progress)}% done` : "Waiting"}
              </p>
            </div>

            {checkin && (
              <Badge variant="outline" className="text-[9px] h-4 px-1">
                {checkin.actualValue} {goal.uom}
              </Badge>
            )}
          </div>
        )
      })}
    </div>
  )
}
