"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShieldCheck, User, Users, Lock } from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

type LoginFormValues = z.infer<typeof loginSchema>

import { useTransition } from "@/components/providers/TransitionProvider"

export function LoginForm() {
  const router = useRouter()
  const { startTransition } = useTransition()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.")
        setIsLoading(false)
      } else {
        toast.success("Authentication successful.")
        startTransition()
        // Perform navigation and refresh
        router.push("/")
        router.refresh()
      }
    } catch {
      toast.error("An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  const fillDemo = (email: string) => {
    form.setValue("email", email)
    form.setValue("password", "Password123!")
  }

  return (
    <Card className="border-border/50 shadow-xl shadow-foreground/5">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight">Sign In</CardTitle>
        <CardDescription className="text-xs">
          Secure access to enterprise governance workflows.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="admin@goalsos.com" 
                      className="h-10 bg-muted/30 focus-visible:ring-1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">Password</FormLabel>
                    <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-10 bg-muted/30 focus-visible:ring-1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-semibold shadow-sm" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Sign In to Platform"}
            </Button>
          </form>
        </Form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium tracking-widest">
              Demo Environments
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 justify-start gap-3 bg-muted/20 hover:bg-muted/40 transition-colors border-border/50"
            onClick={() => fillDemo("admin@goalsos.com")}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[11px] font-semibold">Admin Portal</span>
              <span className="text-[9px] text-muted-foreground">admin@goalsos.com</span>
            </div>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 justify-start gap-3 bg-muted/20 hover:bg-muted/40 transition-colors border-border/50"
              onClick={() => fillDemo("eng.dir@goalsos.com")}
            >
              <Users className="h-3.5 w-3.5 text-blue-500" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[11px] font-semibold">Manager</span>
                <span className="text-[9px] text-muted-foreground">Manager Access</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 justify-start gap-3 bg-muted/20 hover:bg-muted/40 transition-colors border-border/50"
              onClick={() => fillDemo("dev1@goalsos.com")}
            >
              <User className="h-3.5 w-3.5 text-emerald-500" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[11px] font-semibold">Employee</span>
                <span className="text-[9px] text-muted-foreground">Alex Rivera</span>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
