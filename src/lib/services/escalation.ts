import prisma from "@/lib/db/prisma"
import { getCurrentQuarter } from "../utils/quarter"

export async function detectEscalations() {
  const currentQuarter = getCurrentQuarter()
  
  // Find goals that haven't had a check-in this quarter
  const overdueGoals = await prisma.goal.findMany({
    where: {
      status: "APPROVED",
      NOT: {
        checkins: {
          some: {
            quarter: currentQuarter
          }
        }
      }
    },
    include: {
      user: true
    }
  })

  // Create escalations for these
  const escalationCreations = overdueGoals.map(goal => 
    prisma.escalation.create({
      data: {
        goalId: goal.id,
        level: 1, // Escalated to Manager
        reason: `Missed ${currentQuarter} check-in`,
        status: "PENDING",
        nextRetryAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Retry in 24h
      }
    })
  )

  await Promise.all(escalationCreations)
  return overdueGoals.length
}

export async function resolveEscalation(id: string) {
  return await prisma.escalation.update({
    where: { id },
    data: { 
      status: "RESOLVED",
    }
  })
}
