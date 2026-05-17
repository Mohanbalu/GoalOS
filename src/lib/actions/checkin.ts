"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { calculateProgress } from "@/lib/utils/progress"
import { Quarter, CheckinStatus } from "@prisma/client"
import { isWindowOpen } from "@/lib/utils/quarter"
import { ensureGoalOwnershipAndState } from "@/lib/utils/guards"

export async function submitCheckin(data: {
  goalId: string
  quarter: Quarter
  actualValue: number
  employeeComment: string
  status?: CheckinStatus
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  if (!isWindowOpen(data.quarter)) {
    throw new Error(`The submission window for ${data.quarter} is currently closed.`)
  }

  // NEW IDOR PROTECTION: Centralized Guard ensures ownership and state
  const goal = await ensureGoalOwnershipAndState(data.goalId, session.user.id, ["APPROVED"])

  const goalWithCheckins = await prisma.goal.findUnique({
    where: { id: data.goalId },
    include: { checkins: true }
  })
  
  if (!goalWithCheckins) throw new Error("Goal not found")

  // Calculate progress for this quarter
  const progress = calculateProgress(goal.formulaType, goal.targetValue, data.actualValue)

  // Upsert check-in
  await prisma.checkin.upsert({
    where: {
      goalId_quarter: {
        goalId: data.goalId,
        quarter: data.quarter
      }
    },
    update: {
      actualValue: data.actualValue,
      employeeComment: data.employeeComment,
      status: data.status || (progress >= 100 ? "COMPLETED" : "ON_TRACK"),
      updatedAt: new Date(),
    },
    create: {
      goalId: data.goalId,
      quarter: data.quarter,
      actualValue: data.actualValue,
      employeeComment: data.employeeComment,
      status: data.status || (progress >= 100 ? "COMPLETED" : "ON_TRACK"),
    }
  })

  // Update overall goal progress (average of checkins for simplicity in this engine)
  const allCheckins = await prisma.checkin.findMany({ where: { goalId: data.goalId } })
  const avgProgress = allCheckins.reduce((acc, curr) => {
    const p = calculateProgress(goalWithCheckins.formulaType, goalWithCheckins.targetValue, curr.actualValue)
    return acc + p
  }, 0) / 4 // Div by 4 quarters

  await prisma.goal.update({
    where: { id: data.goalId },
    data: { currentProgress: avgProgress }
  })

  // Achievement synchronization: sync to other linked goal sheets if primary owner updates
  if (goal.sharedGoalId) {
    const sharedGoal = await prisma.sharedGoal.findUnique({
      where: { id: goal.sharedGoalId }
    })
    
    if (sharedGoal && sharedGoal.primaryOwnerId === session.user.id) {
      const siblingGoals = await prisma.goal.findMany({
        where: {
          sharedGoalId: goal.sharedGoalId,
          NOT: { id: goal.id }
        }
      })
      
      for (const sibling of siblingGoals) {
        // Upsert synced checkin for sibling
        await prisma.checkin.upsert({
          where: {
            goalId_quarter: {
              goalId: sibling.id,
              quarter: data.quarter
            }
          },
          update: {
            actualValue: data.actualValue,
            employeeComment: `Synced from Primary Owner (${session.user.name || "System"}).`,
            status: data.status || (progress >= 100 ? "COMPLETED" : "ON_TRACK"),
            updatedAt: new Date(),
          },
          create: {
            goalId: sibling.id,
            quarter: data.quarter,
            actualValue: data.actualValue,
            employeeComment: `Synced from Primary Owner (${session.user.name || "System"}).`,
            status: data.status || (progress >= 100 ? "COMPLETED" : "ON_TRACK"),
          }
        })

        // Recalculate sibling progress
        const siblingCheckins = await prisma.checkin.findMany({ where: { goalId: sibling.id } })
        const siblingAvg = siblingCheckins.reduce((acc, curr) => {
          return acc + calculateProgress(sibling.formulaType, sibling.targetValue, curr.actualValue)
        }, 0) / 4

        await prisma.goal.update({
          where: { id: sibling.id },
          data: { currentProgress: siblingAvg }
        })
      }
    }
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      entityId: data.goalId,
      entityType: "GOAL",
      action: "UPDATE",
      actorId: session.user.id,
      newData: { checkin: data, progress: avgProgress }
    }
  })

  revalidatePath("/employee/goals")
  revalidatePath(`/employee/goals/${data.goalId}`)
  return { success: true }
}

export async function submitManagerReview(data: {
  checkinId: string
  managerComment: string
}) {
  const session = await auth()
  if (session?.user?.role !== "MANAGER" && session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const checkin = await prisma.checkin.findUnique({
    where: { id: data.checkinId },
    include: { goal: { include: { user: true } } }
  })

  if (!checkin) throw new Error("Checkin not found")

  // NEW IDOR PROTECTION: Ensure manager manages the user owning this checkin
  if (session.user.role === "MANAGER" && checkin.goal.user.managerId !== session.user.id) {
    throw new Error("Forbidden: You do not manage this employee")
  }

  await prisma.checkin.update({
    where: { id: data.checkinId },
    data: {
      managerComment: data.managerComment,
    }
  })

  revalidatePath("/manager/approvals")
  return { success: true }
}
