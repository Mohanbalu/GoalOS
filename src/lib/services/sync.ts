import prisma from "@/lib/db/prisma"
import { calculateProgress } from "@/lib/utils/progress"

/**
 * Enterprise Grade Shared Goal Synchronization Service
 * Decouples target propagation from expensive progress recalculations
 * to prevent connection pool exhaustion and deadlocks.
 */
export async function propagateSharedGoalUpdate(
  sharedGoalId: string, 
  updates: { title?: string; targetValue?: number }
) {
  // 1. Transactionally update the parent and simple scalar fields on children
  await prisma.$transaction(async (tx) => {
    // Update master
    await tx.sharedGoal.update({
      where: { id: sharedGoalId },
      data: updates
    })

    // Bulk propagate simple fields instantly (Highly optimized SQL UPDATE)
    await tx.goal.updateMany({
      where: { sharedGoalId },
      data: {
        ...(updates.title && { title: updates.title }),
        ...(updates.targetValue !== undefined && { targetValue: updates.targetValue }),
      }
    })
  })

  // 2. If target changed, we MUST recalculate progress.
  // In a true enterprise system, this is pushed to an SQS/Kafka queue.
  // For the hackathon, we simulate a background worker by firing asynchronously without awaiting,
  // or chunking it safely. We will await it here for UI consistency in the demo, but using a 
  // highly optimized read-then-batch-update strategy.
  if (updates.targetValue !== undefined) {
    await batchRecalculateProgress(sharedGoalId, updates.targetValue)
  }
}

async function batchRecalculateProgress(sharedGoalId: string, newTarget: number) {
  // Fetch all goals and their checkins linked to this shared goal
  const goalsWithCheckins = await prisma.goal.findMany({
    where: { sharedGoalId },
    select: { id: true, formulaType: true, checkins: true }
  })

  // Prepare batch updates (preventing massive active transactions)
  const updates = goalsWithCheckins.map(goal => {
    let avgProgress = 0
    if (goal.checkins.length > 0) {
      const total = goal.checkins.reduce((sum, c) => sum + calculateProgress(goal.formulaType, newTarget, c.actualValue), 0)
      
      // ENTERPRISE MATH: Divide by actual number of elapsed/submitted quarters, not hardcoded 4
      const elapsedQuarters = Math.max(1, goal.checkins.length)
      avgProgress = total / elapsedQuarters
    }

    // Return the raw SQL promise for bulk execution
    return prisma.$executeRaw`UPDATE "Goal" SET "currentProgress" = ${avgProgress} WHERE id = ${goal.id}`
  })

  // Execute in batches of 50 to prevent connection starvation
  const BATCH_SIZE = 50
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE)
    await Promise.all(batch)
  }
}
