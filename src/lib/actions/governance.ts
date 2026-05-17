"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { ensureManagerHierarchyAndState } from "@/lib/utils/guards"

export async function approveGoal(goalId: string, updates?: { targetValue?: number; weightage?: number }) {
  const session = await auth()
  if (session?.user?.role !== "MANAGER") throw new Error("Unauthorized")

  // NEW IDOR PROTECTION: Centralized Guard ensures manager hierarchy and state
  const goal = await ensureManagerHierarchyAndState(goalId, session.user.id, ["PENDING_APPROVAL"])

  // GOVERNANCE HARDENING: Transaction-safe mutation + audit log
  await prisma.$transaction(async (tx) => {
    // Whitelist updates to prevent injection of malicious fields
    const safeUpdates = {
      ...(updates?.targetValue !== undefined && { targetValue: updates.targetValue }),
      ...(updates?.weightage !== undefined && { weightage: updates.weightage })
    }

    await tx.goal.update({
      where: { id: goalId },
      data: {
        ...safeUpdates,
        status: "APPROVED",
        isLocked: true, // Immutable lock
      },
    })

    // Create immutable audit log atomically
    await tx.auditLog.create({
      data: {
        entityId: goalId,
        entityType: "GOAL",
        action: "APPROVE",
        actorId: session.user.id,
        oldData: { targetValue: goal.targetValue, weightage: goal.weightage, status: goal.status },
        newData: { ...safeUpdates, status: "APPROVED", note: updates ? "Approved with adjustments" : "Approved without changes" },
      },
    })
  })

  revalidatePath("/manager/approvals")
  revalidatePath("/employee/goals")
  return { success: true }
}

export async function rejectGoal(goalId: string, reason: string) {
  const session = await auth()
  if (session?.user?.role !== "MANAGER") throw new Error("Unauthorized")

  // NEW IDOR PROTECTION: Centralized Guard ensures manager hierarchy and state
  const goal = await ensureManagerHierarchyAndState(goalId, session.user.id, ["PENDING_APPROVAL"])

  // GOVERNANCE HARDENING: Transaction-safe mutation + audit log
  await prisma.$transaction(async (tx) => {
    await tx.goal.update({
      where: { id: goalId },
      data: {
        status: "REVISION_REQUESTED", // State machine transition
        isLocked: false,
      },
    })

    await tx.auditLog.create({
      data: {
        entityId: goalId,
        entityType: "GOAL",
        action: "REJECT",
        actorId: session.user.id,
        oldData: { status: goal.status },
        newData: { status: "REVISION_REQUESTED", note: `Rejected for revision: ${reason}` },
      },
    })
  })

  revalidatePath("/manager/approvals")
  return { success: true }
}

export async function unlockGoal(goalId: string, reason: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const goal = await prisma.goal.findUnique({ where: { id: goalId } })
  if (!goal) throw new Error("Goal not found")
  if (goal.status !== "APPROVED") throw new Error("Forbidden: Can only unlock approved goals")

  // GOVERNANCE HARDENING: Transaction-safe mutation + audit log
  await prisma.$transaction(async (tx) => {
    await tx.goal.update({
      where: { id: goalId },
      data: {
        isLocked: false,
        status: "DRAFT", // State machine reset
      },
    })

    await tx.auditLog.create({
      data: {
        entityId: goalId,
        entityType: "GOAL",
        action: "UPDATE",
        actorId: session.user.id,
        oldData: { status: goal.status, isLocked: goal.isLocked },
        newData: { status: "DRAFT", isLocked: false, note: `Admin unlocked goal. Reason: ${reason}` },
      },
    })
  })

  revalidatePath("/admin/audit")
  revalidatePath("/employee/goals")
  return { success: true }
}
