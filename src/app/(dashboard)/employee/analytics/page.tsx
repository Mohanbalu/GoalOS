import { auth } from "@/auth"
import prisma from "@/lib/db/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ProgressPieChart } from "@/components/analytics/ProgressPieChart"
import { QuarterlyLineChart } from "@/components/analytics/QuarterlyLineChart"
import { Activity, Target, CheckCircle, AlertCircle } from "lucide-react"

export default async function EmployeeAnalytics() {
  const session = await auth()
  const userId = session?.user?.id

  const goals = await prisma.goal.findMany({
    where: { userId },
    include: { checkins: true }
  })

  // Calculations
  const totalGoals = goals.length
  const completedGoals = goals.filter(g => g.currentProgress >= 100).length
  const avgProgress = goals.reduce((acc, curr) => acc + curr.currentProgress, 0) / (totalGoals || 1)
  
  const distributionData = [
    { name: "Completed", value: completedGoals },
    { name: "On Track", value: goals.filter(g => g.currentProgress > 50 && g.currentProgress < 100).length },
    { name: "Needs Attention", value: goals.filter(g => g.currentProgress <= 50 && g.currentProgress > 0).length },
    { name: "Not Started", value: goals.filter(g => g.currentProgress === 0).length },
  ]

  const trendData = [
    { name: "Q1", progress: 25 }, // Mocked historical trends for demo
    { name: "Q2", progress: 45 },
    { name: "Q3", progress: 68 },
    { name: "Q4", progress: Math.round(avgProgress) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Performance Insights</h1>
        <p className="text-muted-foreground">Deep-dive into your goal achievements and growth trends.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgProgress)}%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals}</div>
            <p className="text-xs text-muted-foreground">Goals at 100%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requiring check-in</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goal Status Distribution</CardTitle>
            <CardDescription>Breakdown of goals by current completion stage.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressPieChart data={distributionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly Performance Trend</CardTitle>
            <CardDescription>Visualizing your progress growth over the fiscal year.</CardDescription>
          </CardHeader>
          <CardContent>
            <QuarterlyLineChart data={trendData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
