import prisma from "@/lib/db/prisma"
import { GoalStatus } from "@prisma/client"

export async function ensureGoalOwnershipAndState(
  goalId: string,
  userId: string,
  allowedStates?: GoalStatus[]
) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
  })

  if (!goal) {
    throw new Error("Goal not found")
  }

  if (goal.deletedAt !== null) {
    throw new Error("Forbidden: Goal has been deleted")
  }

  if (goal.userId !== userId) {
    throw new Error("Forbidden: You do not own this goal")
  }

  if (allowedStates && !allowedStates.includes(goal.status)) {
    throw new Error(`Forbidden: Goal is in invalid state (${goal.status}) for this action`)
  }

  return goal
}

export async function ensureManagerHierarchyAndState(
  goalId: string,
  managerId: string,
  allowedStates?: GoalStatus[]
) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { user: true }
  })

  if (!goal) {
    throw new Error("Goal not found")
  }

  if (goal.deletedAt !== null) {
    throw new Error("Forbidden: Goal has been deleted")
  }

  if (goal.user.managerId !== managerId) {
    throw new Error("Forbidden: You are not the manager for this employee")
  }

  if (allowedStates && !allowedStates.includes(goal.status)) {
    throw new Error(`Forbidden: Goal is in invalid state (${goal.status}) for this action`)
  }

  return goal
}
