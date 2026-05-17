import { auth } from "@/auth"
import prisma from "@/lib/db/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TeamBarChart } from "@/components/analytics/TeamBarChart"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Clock, AlertTriangle } from "lucide-react"

export default async function TeamAnalytics() {
  const session = await auth()
  const managerId = session?.user?.id

  const team = await prisma.user.findMany({
    where: { managerId },
    include: {
      goals: true,
    }
  })

  // Calculations
  const teamData = team.map(member => {
    const avg = member.goals.reduce((acc, curr) => acc + curr.currentProgress, 0) / (member.goals.length || 1)
    return {
      name: member.name?.split(" ")[0] || "Unknown",
      progress: Math.round(avg),
      goalsCount: member.goals.length,
    }
  })

  const teamAvgProgress = teamData.reduce((acc, curr) => acc + curr.progress, 0) / (teamData.length || 1)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Performance Analytics</h1>
        <p className="text-muted-foreground">Monitor departmental progress and employee engagement metrics.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(teamAvgProgress)}%</div>
            <p className="text-xs text-muted-foreground">Average across {team.length} members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Direct Reports</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.length}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Checks</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Q3 check-ins pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Goals below 20% completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Individual Performance Comparison</CardTitle>
            <CardDescription>Average goal completion rate by team member.</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamBarChart data={teamData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Leaderboard</CardTitle>
            <CardDescription>Top contributors by progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {teamData.sort((a, b) => b.progress - a.progress).slice(0, 5).map((member, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-muted-foreground">{member.progress}%</span>
                  </div>
                  <Progress value={member.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
