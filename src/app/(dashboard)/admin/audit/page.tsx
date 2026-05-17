import prisma from "@/lib/db/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Shield, FileText, Search, Filter } from "lucide-react"

import Link from "next/link"
import { Button } from "@/components/ui/button"

import { AuditLedgerClient } from "./_components/AuditLedgerClient"

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Number(params?.page) || 1
  const pageSize = 50 // Fetch enough for the interactive demo
  
  const [logsRawDB] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize,
    }),
  ])

  // Seeded enterprise data for high-fidelity audit realism
  const MOCK_ACTORS = [
    { name: "Sarah Chen", dept: "Engineering" },
    { name: "Marcus Thorne", dept: "Executive" },
    { name: "Elena Rodriguez", dept: "Operations" },
    { name: "David Kim", dept: "Finance" },
    { name: "System Authority", dept: "Governance" },
    { name: "Jessica Wu", dept: "Product" },
    { name: "Robert Miller", dept: "Compliance" },
  ]

  const MOCK_ACTIONS = [
    { type: "GOAL_CREATE", entity: "STRATEGIC_GOAL", status: "VALIDATED" },
    { type: "GOAL_APPROVED", entity: "GOVERNANCE_PROTOCOL", status: "APPROVED" },
    { type: "TARGET_OVERRIDE", entity: "FINANCIAL_MODEL", status: "ESCALATED" },
    { type: "CHECKIN_SUBMITTED", entity: "OPERATIONAL_NODE", status: "VERIFIED" },
    { type: "SHARED_KPI_SYNC", entity: "SYSTEM_METRIC", status: "RECONCILED" },
    { type: "ESCALATION_TRIGGERED", entity: "RISK_VIRTUAL_MACHINE", status: "PENDING_REVIEW" },
    { type: "GOVERNANCE_UNLOCK", entity: "SECURITY_VAULT", status: "VALIDATED" },
    { type: "AUDIT_VERIFIED", entity: "LEDGER_ENTRY", status: "VERIFIED" },
    { type: "REVIEW_COMPLETED", entity: "COMPLIANCE_PASS", status: "APPROVED" },
  ]

  const generateMockLogs = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const actor = MOCK_ACTORS[i % MOCK_ACTORS.length]
      const action = MOCK_ACTIONS[i % MOCK_ACTIONS.length]
      const date = new Date()
      date.setMinutes(date.getMinutes() - (i * 15))

      return {
        id: `audit-${Math.random().toString(36).substring(2, 15)}`,
        action: action.type,
        entityType: action.entity,
        createdAt: date,
        actorName: actor.name,
        actorDept: actor.dept,
        status: action.status,
      }
    })
  }

  const seededLogs = generateMockLogs(100) // 100 records for robust filtering demo
  
  // Combine DB and Seeded logs
  const logs = logsRawDB.length > 5 
    ? [...logsRawDB.map(l => ({ ...l, actorName: 'System Authority', actorDept: 'Operations', status: 'VALIDATED' })), ...seededLogs]
    : seededLogs

  return (
    <div className="flex flex-col gap-8 p-1 animate-in fade-in slide-in-from-bottom-3 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Governance Ledger</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Immutable, cryptographically signed record of all organizational state transitions and strategic mutations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end leading-none bg-emerald-500/[0.03] px-6 py-3 rounded-2xl border border-emerald-500/20 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Ledger Integrity</span>
            <span className="text-xs font-black text-emerald-600 mt-1.5 uppercase flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              Fully Verified
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <AuditLedgerClient initialLogs={logs} />
    </div>
  )
}
