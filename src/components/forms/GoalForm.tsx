"use client"

import * as React from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { goalSchema, type GoalFormValues } from "@/lib/validations/goal"
import { saveDraftGoal, submitGoal, getUserWeightage } from "@/lib/actions/goal"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react"

export function GoalForm({ 
  initialData, 
  isLocked: propLocked 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any, 
  isLocked?: boolean 
}) {
  const router = useRouter()
  const isShared = !!initialData?.sharedGoalId
  const isLocked = propLocked || initialData?.isLocked
  const [isDrafting, setIsDrafting] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [existingTotal, setExistingTotal] = React.useState(0)

  React.useEffect(() => {
    getUserWeightage().then(setExistingTotal)
  }, [])

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema) as unknown as Resolver<GoalFormValues>,
    defaultValues: initialData || {
      title: "",
      description: "",
      thrustArea: "",
      uom: "NUMERIC",
      targetValue: 0,
      formulaType: "MAX",
      weightage: 10,
    },
  })

  // Watch weightage to show live tracking
  const currentWeightage = Number(form.watch("weightage")) || 0
  const proposedTotal = existingTotal + currentWeightage

  async function onSaveDraft(data: GoalFormValues) {
    setIsDrafting(true)
    try {
      await saveDraftGoal(data)
      toast.success("Draft saved successfully.")
      router.push("/employee/goals")
    } catch {
      toast.error("Failed to save draft. Please try again.")
    } finally {
      setIsDrafting(false)
    }
  }

  async function onSubmitGoal(data: GoalFormValues) {
    if (proposedTotal > 100) {
      toast.error("Cannot submit: Total weightage exceeds 100%.")
      return
    }
    
    setIsSubmitting(true)
    try {
      await submitGoal(data)
      toast.success("Goal submitted for manager approval.")
      router.push("/employee/goals")
    } catch {
      toast.error("Failed to submit goal. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Weightage Tracker Banner */}
      <Card className={proposedTotal > 100 ? "border-destructive/50 bg-destructive/5" : proposedTotal === 100 ? "border-emerald-500/50 bg-emerald-500/5" : "bg-muted/50"}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {proposedTotal > 100 ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : proposedTotal === 100 ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            )}
            <div>
              <p className="text-sm font-medium">Total Weightage Tracker</p>
              <p className="text-xs text-muted-foreground">
                Existing: {existingTotal}% + Proposed: {currentWeightage}% = {proposedTotal}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${proposedTotal > 100 ? "text-destructive" : proposedTotal === 100 ? "text-emerald-500" : ""}`}>
              {proposedTotal}%
            </span>
            <span className="text-sm text-muted-foreground"> / 100%</span>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Objective Definition</CardTitle>
                  <CardDescription>Specify the strategic intent and scope.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operational Objective</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Q2 Strategic Expansion" 
                            disabled={isShared || isLocked} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strategic Context</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide operational background..." 
                            className="resize-none h-32" 
                            disabled={isLocked}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thrustArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strategic Focus Area</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Financial Optimization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Indicators</CardTitle>
                  <CardDescription>Quantitative criteria for success.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="uom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit of Measure</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger disabled={isShared || isLocked}>
                                <SelectValue placeholder="Select UoM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NUMERIC">Numeric Value</SelectItem>
                              <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                              <SelectItem value="TIMELINE">Target Date</SelectItem>
                              <SelectItem value="ZERO_BASED">Incidence Target</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="formulaType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Optimization Logic</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger disabled={isShared || isLocked}>
                                <SelectValue placeholder="Select logic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MAX">Maximization</SelectItem>
                              <SelectItem value="MIN">Minimization</SelectItem>
                              <SelectItem value="TIMELINE">Timeline Compliance</SelectItem>
                              <SelectItem value="ZERO">Zero-Variance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Performance Target</FormLabel>
                          <FormControl>
                            <Input type="number" disabled={isShared || isLocked} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weightage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strategic Weightage (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min={10} max={100} disabled={isLocked} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t pt-6">
            {!isLocked && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDrafting || isSubmitting}
                  onClick={form.handleSubmit(onSaveDraft)}
                  className="font-semibold"
                >
                  {isDrafting ? "Syncing Draft..." : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  disabled={isDrafting || isSubmitting || proposedTotal > 100}
                  onClick={form.handleSubmit(onSubmitGoal)}
                  className="font-bold shadow-md shadow-primary/10"
                >
                  {isSubmitting ? "Validating..." : "Submit for Governance Review"}
                </Button>
              </>
            )}
            {isLocked && (
              <p className="text-sm text-muted-foreground italic flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-primary" /> This objective is locked under governance protocol and cannot be modified.
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
