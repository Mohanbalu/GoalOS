import {
  LayoutDashboard,
  Target,
  CheckSquare,
  BarChart3,
  ShieldAlert,
  Settings,
  AlertTriangle,
  Share2,
  FileText,
} from "lucide-react"

export const NAV_LINKS = {
  ADMIN: [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { title: "System Audit", href: "/admin/audit", icon: ShieldAlert },
    { title: "Cycles", href: "/admin/cycles", icon: Settings },
    { title: "Escalations", href: "/admin/escalations", icon: AlertTriangle },
    { title: "Governance", href: "/admin/governance", icon: FileText },
    { title: "Shared Goals", href: "/admin/shared", icon: Share2 },
  ],
  MANAGER: [
    { title: "Dashboard", href: "/manager", icon: LayoutDashboard },
    { title: "Approvals", href: "/manager/approvals", icon: CheckSquare },
    { title: "Analytics", href: "/manager/analytics", icon: BarChart3 },
  ],
  EMPLOYEE: [
    { title: "Dashboard", href: "/employee", icon: LayoutDashboard },
    { title: "My Goals", href: "/employee/goals", icon: Target },
    { title: "Analytics", href: "/employee/analytics", icon: BarChart3 },
  ],
}
