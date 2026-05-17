import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const role = (user.role || "EMPLOYEE") as "ADMIN" | "MANAGER" | "EMPLOYEE"

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <Sidebar role={role} />
      <div className="flex flex-col">
        <Topbar user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/20 animate-in fade-in duration-700">
          {children}
        </main>
      </div>
    </div>
  )
}
