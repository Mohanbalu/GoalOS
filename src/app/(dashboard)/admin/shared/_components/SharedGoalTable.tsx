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
import { Badge } from "@/components/ui/badge"
import { Share2, RefreshCw, Users, MoreHorizontal } from "lucide-react"
import { syncSharedGoal, assignSharedGoal } from "@/lib/actions/shared"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SharedGoalTable({ goals, employees }: { goals: { id: string, title: string, department: { name: string }, targetValue: number, uom: string, goals: { id: string }[] }[], employees: { id: string, name: string | null, department: { name: string } | null }[] }) {
  const [isSyncing, setIsSyncing] = React.useState<string | null>(null)

  const handleSync = async (goalId: string) => {
    setIsSyncing(goalId)
    try {
      await syncSharedGoal(goalId, {}) // Just trigger propagation
      toast.success("Synchronized successfully with all linked employees")
    } catch {
      toast.error("Sync failed")
    } finally {
      setIsSyncing(null)
    }
  }

  const handleQuickAssign = async (goalId: string) => {
    // In a real app, show a multi-select modal. Here we assign to all for demo.
    const allIds = employees.map(e => e.id)
    try {
      await assignSharedGoal(goalId, allIds)
      toast.success(`Assigned to ${allIds.length} employees`)
    } catch {
      toast.error("Assignment failed")
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Shared KPI</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Linked Users</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => (
            <TableRow key={goal.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-primary" />
                  {goal.title}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{goal.department.name || "Organization"}</Badge>
              </TableCell>
              <TableCell>{goal.targetValue} {goal.uom}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {goal.goals.length} employees
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSync(goal.id)} disabled={isSyncing === goal.id}>
                    <RefreshCw className={`h-4 w-4 ${isSyncing === goal.id ? "animate-spin" : ""}`} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleQuickAssign(goal.id)}>
                        Assign to All Dept
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Deactivate KPI
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
