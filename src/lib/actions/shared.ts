"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { propagateSharedGoalUpdate } from "@/lib/services/sync"

export async function createSharedGoal(data: {
  title: string
  description?: string
  targetValue: number
  uom: string
  formulaType: "MIN" | "MAX" | "TIMELINE" | "ZERO"
  departmentId: string
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const sharedGoal = await prisma.sharedGoal.create({
    data: {
      ...data,
    },
  })

  revalidatePath("/admin/shared")
  return sharedGoal
}

export async function assignSharedGoal(sharedGoalId: string, employeeIds: string[]) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "MANAGER") {
    throw new Error("Unauthorized")
  }

  if (employeeIds.length === 0) throw new Error("No employees specified")

  const sharedGoal = await prisma.sharedGoal.findUnique({
    where: { id: sharedGoalId }
  })

  if (!sharedGoal) throw new Error("Shared Goal not found")

  const cycle = await prisma.cycle.findFirst({ where: { status: "ACTIVE" } })
  if (!cycle) throw new Error("No active cycle found")

  const primaryOwnerId = employeeIds[0]

  // Update SharedGoal primary owner and assign in a transaction
  await prisma.$transaction([
    prisma.sharedGoal.update({
      where: { id: sharedGoalId },
      data: { primaryOwnerId }
    }),
    ...employeeIds.map(empId => 
      prisma.goal.create({
        data: {
          userId: empId,
          cycleId: cycle.id,
          sharedGoalId: sharedGoal.id,
          title: sharedGoal.title,
          description: sharedGoal.description,
          targetValue: sharedGoal.targetValue,
          uom: sharedGoal.uom,
          formulaType: sharedGoal.formulaType,
          status: "DRAFT", // Created as Draft so weightage can be adjusted
          isLocked: false,  // Unlocked initially so they can adjust weightage
          weightage: 10,
          thrustArea: sharedGoal.thrustArea || "Departmental KPI",
        }
      })
    )
  ])

  revalidatePath("/admin/shared")
  revalidatePath("/employee/goals")
  return { success: true }
}

export async function syncSharedGoal(sharedGoalId: string, updates: { title?: string; targetValue?: number }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  // Use the robust enterprise synchronization service
  await propagateSharedGoalUpdate(sharedGoalId, updates)

  revalidatePath("/admin/shared")
  revalidatePath("/employee/goals")
  return { success: true }
}
