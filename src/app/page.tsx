import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Target, Shield, BarChart3, Users } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    const role = session.user.role
    if (role === "ADMIN") redirect("/admin")
    if (role === "MANAGER") redirect("/manager")
    redirect("/employee")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Target className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold tracking-tight">GoalsOS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Sign In
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Enterprise Goal Governance & Tracking
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Align your organization, track quarterly progress, and ensure accountability with GoalsOS. The premium performance management platform.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/login">Access Dashboard</Link>
                </Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-card shadow-sm">
                <Shield className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Enterprise Governance</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Immutable audit logs and multi-level approval workflows for maximum compliance.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-card shadow-sm">
                <BarChart3 className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Deep-dive into team performance and organizational health with high-fidelity charts.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-card shadow-sm">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">RBAC Hierarchy</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Tailored experiences for Employees, Managers, and Admins with secure access control.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 GoalsOS Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">Terms of Service</Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">Privacy</Link>
        </nav>
      </footer>
    </div>
  )
}
