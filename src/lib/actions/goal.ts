"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { goalSchema, GoalFormValues } from "@/lib/validations/goal"

// Mock cycle ID for the hackathon (normally fetched dynamically)

export async function saveDraftGoal(data: GoalFormValues) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const parsed = goalSchema.parse(data)

  // In a real scenario, we'd look up the active cycle
  const cycle = await prisma.cycle.findFirst({ where: { status: "ACTIVE" } })
  if (!cycle) throw new Error("No active cycle found")

  await prisma.goal.create({
    data: {
      userId: session.user.id,
      cycleId: cycle.id,
      title: parsed.title,
      description: parsed.description,
      thrustArea: parsed.thrustArea,
      uom: parsed.uom,
      targetValue: parsed.targetValue,
      formulaType: parsed.formulaType,
      weightage: parsed.weightage,
      status: "DRAFT", // DRAFT status
    },
  })

  revalidatePath("/employee/goals")
  return { success: true }
}

export async function submitGoal(data: GoalFormValues) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const parsed = goalSchema.parse(data)

  const cycle = await prisma.cycle.findFirst({ where: { status: "ACTIVE" } })
  if (!cycle) throw new Error("No active cycle found")

  // NEW PESSIMISTIC LOCKING: Serialize concurrent submissions for the same user
  await prisma.$transaction(async (tx) => {
    // 1. Acquire Lock on the User record
    await tx.$executeRaw`SELECT 1 FROM "User" WHERE id = ${session.user.id} FOR UPDATE`

    // 2. Fetch active goals inside the locked transaction
    const currentGoals = await tx.goal.findMany({
      where: { 
        userId: session.user.id,
        cycleId: cycle.id,
        NOT: { status: "DRAFT" } 
      }
    })

    // 3. Recalculate aggregate
    const currentTotal = currentGoals.reduce((sum, g) => sum + g.weightage, 0)
    
    // 4. Validate <= 100
    if (currentTotal + parsed.weightage > 100) {
      throw new Error(`Total weightage would exceed 100% (Current: ${currentTotal}%)`)
    }

    // 5. Perform mutation & write audit log atomically
    const newGoal = await tx.goal.create({
      data: {
        userId: session.user.id,
        cycleId: cycle.id,
        title: parsed.title,
        description: parsed.description,
        thrustArea: parsed.thrustArea,
        uom: parsed.uom,
        targetValue: parsed.targetValue,
        formulaType: parsed.formulaType,
        weightage: parsed.weightage,
        status: "PENDING_APPROVAL",
        isLocked: true,
      },
    })

    await tx.auditLog.create({
      data: {
        entityId: newGoal.id,
        entityType: "GOAL",
        action: "CREATE",
        actorId: session.user.id,
        newData: { note: "Goal submitted for manager approval" },
      }
    })
  })

  revalidatePath("/employee/goals")
  return { success: true }
}

export async function getUserWeightage() {
  const session = await auth()
  if (!session?.user?.id) return 0

  const cycle = await prisma.cycle.findFirst({ where: { status: "ACTIVE" } })
  if (!cycle) return 0

  const goals = await prisma.goal.findMany({
    where: { 
      userId: session.user.id,
      cycleId: cycle.id
    }
  })

  return goals.reduce((sum, g) => sum + g.weightage, 0)
}

export async function submitGoalSheet() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const cycle = await prisma.cycle.findFirst({ where: { status: "ACTIVE" } })
  if (!cycle) throw new Error("No active cycle found")

  const result = await prisma.$transaction(async (tx) => {
    // 1. Pessimistic lock to serialize concurrent submissions
    await tx.$executeRaw`SELECT 1 FROM "User" WHERE id = ${session.user.id} FOR UPDATE`

    const goals = await tx.goal.findMany({
      where: {
        userId: session.user.id,
        cycleId: cycle.id,
      }
    })

    if (goals.length === 0) {
      throw new Error("No goals found in your sheet. Please create at least one goal.")
    }

    // Governance Rules:
    // Rule 1: Maximum number of goals per employee: 8
    if (goals.length > 8) {
      throw new Error(`Goal sheet exceeds maximum constraint: 8 goals allowed (Current: ${goals.length})`)
    }

    // Rule 2: Minimum weightage per individual goal: 10%
    const invalidWeightageGoal = goals.find(g => g.weightage < 10)
    if (invalidWeightageGoal) {
      throw new Error(`Every goal must have a minimum weightage of 10% (Goal "${invalidWeightageGoal.title}" has ${invalidWeightageGoal.weightage}%)`)
    }

    // Rule 3: Total weightage across all goals must equal exactly 100%
    const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0)
    if (totalWeightage !== 100) {
      throw new Error(`Total weightage across all goals must equal exactly 100% (Current total: ${totalWeightage}%)`)
    }

    // Transition all draft/revision goals to PENDING_APPROVAL and lock editing
    await tx.goal.updateMany({
      where: {
        userId: session.user.id,
        cycleId: cycle.id,
        status: { in: ["DRAFT", "REVISION_REQUESTED"] }
      },
      data: {
        status: "PENDING_APPROVAL",
        isLocked: true,
      }
    })

    // Create immutable audit log atomically
    await tx.auditLog.create({
      data: {
        entityId: session.user.id,
        entityType: "GOAL",
        action: "UPDATE",
        actorId: session.user.id,
        newData: { note: "Goal sheet submitted with 100% weightage validation passed", goalCount: goals.length }
      }
    })

    return { success: true }
  })

  revalidatePath("/employee/goals")
  return result
}
