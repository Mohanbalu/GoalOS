"use client"

import * as React from "react"
import { Bell, ShieldCheck, AlertCircle, RefreshCw, Users, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const notifications = [
  {
    id: 1,
    title: "14 Reviews Pending",
    description: "Quarterly review window closing in 12 days.",
    time: "2m ago",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: 2,
    title: "Escalation Triggered",
    description: "Level 1 escalation for Engineering department overdue check-ins.",
    time: "45m ago",
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: 3,
    title: "Shared KPI Synchronized",
    description: "Revenue targets updated across 42 employee objectives.",
    time: "2h ago",
    icon: RefreshCw,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: 4,
    title: "Governance Audit Complete",
    description: "Weekly integrity verification finished with 100% compliance.",
    time: "5h ago",
    icon: FileText,
    color: "text-primary",
    bg: "bg-primary/10",
  },
]

export function NotificationCenter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        render={
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-[380px] p-0 border border-border/50 shadow-2xl overflow-hidden">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-5 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold tracking-tight">Operational Alerts</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enterprise Oversight</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                {notifications.length} Active
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[440px] overflow-auto py-2">
          {notifications.map((notif) => (
            <DropdownMenuItem key={notif.id} className="flex gap-4 p-5 cursor-pointer focus:bg-muted/50 transition-all border-b border-border/5 last:border-0">
              <div className={`h-10 w-10 shrink-0 rounded-xl ${notif.bg} flex items-center justify-center border border-border/5 shadow-sm`}>
                <notif.icon className={`h-5 w-5 ${notif.color}`} />
              </div>
              <div className="flex flex-col space-y-1.5 overflow-hidden flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{notif.title}</span>
                  <span className="text-[9px] font-bold text-muted-foreground/50 uppercase shrink-0 bg-muted/30 px-1.5 py-0.5 rounded tracking-tighter">{notif.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-medium">
                  {notif.description}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-3 bg-muted/5">
          <Link href="/admin/escalations" className="w-full">
            <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 h-10">
              View All Governance Alerts
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
