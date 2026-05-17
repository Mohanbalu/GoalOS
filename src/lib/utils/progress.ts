import { FormulaType } from "@prisma/client"

export function calculateProgress(
  formula: FormulaType,
  target: number,
  actual: number
): number {
  if (target === 0 && formula !== "ZERO") return 0

  let score = 0

  switch (formula) {
    case "MIN": // User definition: Higher is better (Maximize)
      score = (actual / target) * 100
      break
    case "MAX": // User definition: Lower is better (Minimize)
      score = actual === 0 ? 100 : (target / actual) * 100
      break
    case "ZERO": // 0 = success
      score = actual === 0 ? 100 : 0
      break
    case "TIMELINE": // Date based placeholder logic
      score = actual >= target ? 100 : (actual / target) * 100
      break
    default:
      score = 0
  }

  // Normalize score between 0 and 100
  return Math.min(Math.max(Math.round(score * 10) / 10, 0), 100)
}

export function getStatusFromProgress(progress: number) {
  if (progress === 0) return "NOT_STARTED"
  if (progress >= 100) return "COMPLETED"
  return "ON_TRACK"
}
