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
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { submitManagerReview } from "@/lib/actions/checkin"
import { toast } from "sonner"

const reviewSchema = z.object({
  managerComment: z.string().min(1, "Feedback is required"),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

export function ManagerReviewForm({ 
  checkinId,
  initialComment 
}: { 
  checkinId: string, 
  initialComment?: string | null 
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      managerComment: initialComment || "",
    },
  })

  async function onSubmit(data: ReviewFormValues) {
    setIsSubmitting(true)
    try {
      await submitManagerReview({
        checkinId,
        ...data,
      })
      toast.success("Review submitted")
    } catch {
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="managerComment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager Feedback</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide feedback on the employee achievement..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save Feedback"}
        </Button>
      </form>
    </Form>
  )
}
