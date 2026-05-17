import { auth } from "@/auth"
import prisma from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QuarterlyTimeline } from "./_components/QuarterlyTimeline"
import { CheckinForm } from "./_components/CheckinForm"
import { ManagerReviewForm } from "./_components/ManagerReviewForm"
import { getCurrentQuarter, isWindowOpen } from "@/lib/utils/quarter"

export default async function GoalDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const { id } = await params

  const goal = await prisma.goal.findUnique({
    where: { id },
    include: {
      checkins: true,
      user: true,
      cycle: true,
    }
  })

  if (!goal) notFound()

  const currentQuarter = getCurrentQuarter()
  const currentCheckin = goal.checkins.find(c => c.quarter === currentQuarter)
  const isLocked = !isWindowOpen(currentQuarter)
  const isOwner = session?.user?.id === goal.userId
  const isManagerOrAdmin = session?.user?.role === "MANAGER" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{goal.title}</h1>
          <p className="text-muted-foreground">{goal.description || "No description provided."}</p>
        </div>
        <Badge variant={goal.status === "APPROVED" ? "default" : "secondary"}>
          {goal.status}
        </Badge>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quarterly Progress</CardTitle>
            <CardDescription>Track achievements across each quarter of the cycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <QuarterlyTimeline goal={goal} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-bold">{Math.round(goal.currentProgress)}%</span>
              </div>
              <Progress value={goal.currentProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Target</p>
                <p className="text-lg font-bold">{goal.targetValue} {goal.uom}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Weightage</p>
                <p className="text-lg font-bold">{goal.weightage}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Formula</p>
                <p className="text-sm font-medium">{goal.formulaType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Cycle</p>
                <p className="text-sm font-medium">{goal.cycle.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{currentQuarter} Check-in</CardTitle>
            <CardDescription>Update achievement for the current window.</CardDescription>
          </CardHeader>
          <CardContent>
            {isOwner ? (
              <CheckinForm 
                goalId={goal.id} 
                quarter={currentQuarter} 
                initialData={currentCheckin}
                uom={goal.uom}
                isLocked={isLocked}
              />
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium">Employee Achievement: {currentCheckin?.actualValue || 0} {goal.uom}</p>
                  <p className="text-xs text-muted-foreground mt-1">Comment: {currentCheckin?.employeeComment || "No comment provided."}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Review</CardTitle>
            <CardDescription>Feedback and guidance from leadership.</CardDescription>
          </CardHeader>
          <CardContent>
            {isManagerOrAdmin && currentCheckin ? (
              <ManagerReviewForm 
                checkinId={currentCheckin.id} 
                initialComment={currentCheckin.managerComment} 
              />
            ) : currentCheckin?.managerComment ? (
              <div className="p-4 rounded-lg bg-muted border">
                <p className="text-sm italic">&quot;{currentCheckin.managerComment}&quot;</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No feedback provided yet for this quarter.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
