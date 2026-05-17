"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { submitCheckin } from "@/lib/actions/checkin"
import { toast } from "sonner"
import { Quarter, CheckinStatus } from "@prisma/client"

const checkinSchema = z.object({
  actualValue: z.number().min(0, "Achievement value must be positive"),
  employeeComment: z.string().min(1, "Governance Commentary is required"),
  status: z.enum(["ON_TRACK", "COMPLETED", "AT_RISK"]),
})

type CheckinFormValues = z.infer<typeof checkinSchema>

export function CheckinForm({ 
  goalId, 
  quarter, 
  initialData,
  uom,
  isLocked = false
}: { 
  goalId: string, 
  quarter: Quarter, 
  initialData?: { actualValue: number, employeeComment: string | null, status?: CheckinStatus } | null,
  uom: string,
  isLocked?: boolean
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<CheckinFormValues>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      actualValue: initialData?.actualValue || 0,
      employeeComment: initialData?.employeeComment || "",
      status: (initialData?.status as any) || "ON_TRACK",
    },
  })

  async function onSubmit(data: CheckinFormValues) {
    setIsSubmitting(true)
    try {
      await submitCheckin({
        goalId,
        quarter,
        ...data,
      })
      toast.success(`${quarter} check-in submitted successfully`)
    } catch (err: any) {
      toast.error(err.message || "Failed to submit check-in")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="actualValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Actual Achievement ({uom})</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="any" 
                  disabled={isLocked} 
                  className="h-10 rounded-xl"
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription className="text-[10px] text-muted-foreground">
                {isLocked ? "The governance submission window for this quarter is closed." : `Enter the actual value achieved in ${quarter}.`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Goal Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLocked}>
                <FormControl>
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="Select current status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl p-1">
                  <SelectItem value="AT_RISK" className="rounded-lg">Not Started / At Risk</SelectItem>
                  <SelectItem value="ON_TRACK" className="rounded-lg">On Track</SelectItem>
                  <SelectItem value="COMPLETED" className="rounded-lg">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-[10px] text-muted-foreground">
                Commit your subjective performance status alignment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employeeComment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Governance Commentary</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your progress, challenges, actions taken, and next key focus areas..." 
                  className="resize-none h-28 rounded-xl"
                  disabled={isLocked}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold active:scale-95 transition-all text-xs uppercase tracking-widest" 
          disabled={isSubmitting || isLocked}
        >
          {isLocked ? "Window Closed" : isSubmitting ? "Submitting Protocol..." : `Save ${quarter} Performance Audit`}
        </Button>
      </form>
    </Form>
  )
}
