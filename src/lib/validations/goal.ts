import * as z from "zod"

export const goalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title is too long."),
  description: z.string().max(500, "Description cannot exceed 500 characters.").optional(),
  thrustArea: z.string().min(2, "Please specify a thrust area."),
  uom: z.enum(["NUMERIC", "PERCENTAGE", "TIMELINE", "ZERO_BASED"]),
  targetValue: z.coerce.number().positive("Target value must be a positive number."),
  formulaType: z.enum(["MIN", "MAX", "TIMELINE", "ZERO"]),
  weightage: z.coerce
    .number()
    .min(10, "Weightage must be at least 10%.")
    .max(100, "Weightage cannot exceed 100%."),
})

export type GoalFormValues = z.infer<typeof goalSchema>
