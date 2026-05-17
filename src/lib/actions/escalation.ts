"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { detectEscalations as runDetection, resolveEscalation as runResolution } from "../services/escalation"

export async function triggerEscalationsDetection() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Administrator clearance required.")
  }

  const detectedCount = await runDetection()
  
  // Create an audit log entry for running rules engine
  await prisma.auditLog.create({
    data: {
      entityId: "SYSTEM",
      entityType: "SYSTEM_METRIC",
      action: "UPDATE",
      actorId: session.user.id,
      newData: { note: "Escalation rules engine executed.", detectedCount }
    }
  })

  revalidatePath("/admin/escalations")
  return { success: true, count: detectedCount }
}

export async function resolveEscalationAction(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Administrator clearance required.")
  }

  await runResolution(id)

  // Create an audit log entry for resolution
  await prisma.auditLog.create({
    data: {
      entityId: id,
      entityType: "RISK_VIRTUAL_MACHINE",
      action: "UPDATE",
      actorId: session.user.id,
      newData: { note: "Escalation alert resolved by Admin." }
    }
  })

  revalidatePath("/admin/escalations")
  return { success: true }
}
