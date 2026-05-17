"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NAV_LINKS } from "@/lib/constants/navigation"
import { cn } from "@/lib/utils"
import { Target } from "lucide-react"

interface SidebarProps {
  role: "ADMIN" | "MANAGER" | "EMPLOYEE"
  isMobile?: boolean
}

export function Sidebar({ role, isMobile }: SidebarProps) {
  const pathname = usePathname()
  const links = NAV_LINKS[role] || NAV_LINKS.EMPLOYEE

  return (
    <aside className={cn(
      "flex-col border-r bg-sidebar h-full",
      isMobile ? "flex w-full" : "hidden w-64 md:flex sticky top-0"
    )}>
      <div className="flex h-14 items-center border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Target className="h-6 w-6 text-primary" />
          <span className="text-lg tracking-tight">GoalsOS</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {links.map((link, index) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm border-l-4 border-primary rounded-l-none" 
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <link.icon className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground/70"
                )} />
                <span className={cn(isActive && "font-bold tracking-tight")}>{link.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-border/50">
        <div className="enterprise-card bg-muted/20 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Q4 Operations</span>
            <span className="text-[10px] font-bold text-primary">82%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '82%' }} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-medium text-muted-foreground uppercase">
              <span>Cycle Closure</span>
              <span className="text-foreground">12 Days</span>
            </div>
            <div className="flex justify-between text-[9px] font-medium text-muted-foreground uppercase">
              <span>Pending Audits</span>
              <span className="text-foreground">14 Items</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full h-7 text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
            Operational Overview
          </Button>
        </div>
      </div>
    </aside>
  )
}
