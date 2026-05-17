"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, ChevronDown, Check } from "lucide-react"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface AuditLog {
  id: string
  action: string
  entityType: string
  createdAt: Date
  actorName: string
  actorDept: string
  status: string
}

interface AuditLedgerClientProps {
  initialLogs: AuditLog[]
}

export function AuditLedgerClient({ initialLogs }: AuditLedgerClientProps) {
  const [search, setSearch] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 25

  const filterOptions = [
    "APPROVED",
    "VALIDATED",
    "ESCALATED",
    "PENDING_REVIEW",
    "VERIFIED",
    "RECONCILED"
  ]

  const filteredLogs = React.useMemo(() => {
    return initialLogs.filter(log => {
      const searchStr = search.toLowerCase()
      const matchesSearch = 
        log.actorName.toLowerCase().includes(searchStr) ||
        log.action.toLowerCase().includes(searchStr) ||
        log.entityType.toLowerCase().includes(searchStr) ||
        log.id.toLowerCase().includes(searchStr) ||
        log.status.toLowerCase().includes(searchStr)

      const matchesFilter = activeFilters.length === 0 || activeFilters.includes(log.status)

      return matchesSearch && matchesFilter
    })
  }, [initialLogs, search, activeFilters])

  const totalPages = Math.ceil(filteredLogs.length / pageSize)
  const pagedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    )
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setSearch("")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 border-b border-border/30 pb-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by hash, actor, or event signature..." 
            className="w-full bg-muted/20 border border-border/40 rounded-xl py-2.5 pl-11 pr-10 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-md hover:bg-muted/50 flex items-center justify-center text-muted-foreground/40 hover:text-foreground transition-all"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={(props) => (
            <Button 
              {...props}
              variant="outline" 
              size="sm" 
              className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 border-border/50 hover:bg-muted/50 transition-all shadow-sm"
            >
              <Filter className="h-3.5 w-3.5" />
              Protocol Filters
              {activeFilters.length > 0 && (
                <span className="ml-1 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] font-black">
                  {activeFilters.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          )} />
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest px-2 py-1.5 opacity-50">Operational Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.map(option => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={activeFilters.includes(option)}
                  onCheckedChange={() => toggleFilter(option)}
                  className="rounded-lg text-[11px] font-bold py-2 focus:bg-primary/5 focus:text-primary transition-colors"
                >
                  {option.replace('_', ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
            {activeFilters.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={clearAllFilters}
                  className="rounded-lg text-[10px] font-black uppercase tracking-widest text-center justify-center py-2 text-red-500 hover:bg-red-500/5 focus:bg-red-500/5 focus:text-red-600 transition-colors"
                >
                  Clear Protocol Filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {(activeFilters.length > 0 || search) && (
          <Button 
            variant="ghost" 
            onClick={clearAllFilters}
            className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset All
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mr-2">Active Protocols:</span>
          {activeFilters.map(filter => (
            <Badge 
              key={filter} 
              variant="secondary"
              className="rounded-full pl-3 pr-2 py-1 bg-primary/5 text-primary border-primary/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-tight group hover:bg-primary/10 transition-colors"
            >
              {filter.replace('_', ' ')}
              <X 
                className="h-3 w-3 cursor-pointer opacity-40 group-hover:opacity-100 transition-opacity" 
                onClick={() => toggleFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Ledger Table */}
      <div className="rounded-3xl border border-border/40 bg-card shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/40">
              <TableHead className="w-[220px] text-[10px] font-black uppercase tracking-[0.2em] py-6 px-8 text-muted-foreground/60">Protocol Timestamp</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] py-6 text-muted-foreground/60">Verified Actor</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] py-6 text-muted-foreground/60">Event Schema</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] py-6 text-muted-foreground/60">Action Signature</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] py-6 text-muted-foreground/60">Verification Hash</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] py-6 px-8 text-right text-muted-foreground/60">Audit State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedLogs.map((log) => (
              <TableRow key={log.id} className="enterprise-table-row border-b border-border/20 last:border-0 group hover:bg-muted/5 transition-colors animate-in fade-in duration-500">
                <TableCell className="text-[11px] font-bold text-slate-500 px-8 whitespace-nowrap">
                  {format(new Date(log.createdAt), "MMM dd, yyyy · h:mm a")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">{log.actorName}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mt-1">{log.actorDept}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {log.entityType}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    log.action.includes('REJECTED') || log.action.includes('TRIGGERED') ? "bg-red-500/5 text-red-600 border-red-500/10" : 
                    log.action.includes('APPROVED') || log.action.includes('VERIFIED') ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : 
                    "bg-blue-500/5 text-blue-600 border-blue-500/10"
                  }`}>
                    {log.action.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell className="text-[11px] font-mono font-medium tracking-tight text-muted-foreground/40">
                  <span className="bg-muted/30 px-2 py-1 rounded-md border border-border/20 group-hover:border-primary/20 group-hover:text-primary transition-all flex items-center gap-2 w-fit">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                    {log.id.replace(/-/g, '').substring(0, 12).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="px-8 text-right">
                  <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border ${
                    log.status === 'ESCALATED' ? 'bg-amber-500/5 text-amber-600 border-amber-500/20' :
                    log.status === 'PENDING_REVIEW' ? 'bg-blue-500/5 text-blue-600 border-blue-500/20' :
                    'bg-emerald-500/5 text-emerald-600 border-emerald-500/20'
                  }`}>
                    {log.status || 'VALIDATED'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {pagedLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="h-16 w-16 rounded-3xl bg-muted/20 flex items-center justify-center border border-border/40">
                      <Search className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100">No matching protocol records</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                        Try adjusting your governance filters or search parameters.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={clearAllFilters}
                      className="mt-2 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/50"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between bg-muted/[0.03] p-6 rounded-[2.5rem] border border-border/40 shadow-sm">
        <p className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
          Displaying: <span className="text-foreground font-black">
            {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} – {Math.min(currentPage * pageSize, filteredLogs.length)}
          </span> <span className="text-muted-foreground/20 mx-3">|</span> Filtered: <span className="text-foreground font-black">{filteredLogs.length} Operations</span>
          {filteredLogs.length !== initialLogs.length && (
            <span className="ml-2 text-muted-foreground/30">(Total Capacity: {initialLogs.length})</span>
          )}
        </p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage <= 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border-border/50 transition-all active:scale-95 disabled:opacity-30"
          >
            Previous Page
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage >= totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border-border/50 transition-all active:scale-95 disabled:opacity-30"
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  )
}
