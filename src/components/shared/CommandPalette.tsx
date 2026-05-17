"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Users, Building2, Target, Shield, ArrowRight, ShieldAlert, RefreshCw, BarChart3, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"

const COMMAND_ITEMS = [
  { id: "1", title: "Q4 Revenue Alignment", category: "Objectives", icon: Target, url: "/admin" },
  { id: "2", title: "Engineering Governance", category: "Audit", icon: Shield, url: "/admin/audit" },
  { id: "3", title: "Sarah Chen", category: "Personnel", icon: Users, url: "/admin/governance" },
  { id: "4", title: "Product Operations", category: "Departments", icon: Building2, url: "/admin/analytics" },
  { id: "5", title: "System Escalations", category: "Governance", icon: ShieldAlert, url: "/admin/escalations" },
  { id: "6", title: "Cycle Management", category: "Operations", icon: RefreshCw, url: "/admin/cycles" },
  { id: "7", title: "Executive Analytics", category: "Analytics", icon: BarChart3, url: "/admin/analytics" },
  { id: "8", title: "Audit Ledger history", category: "Audit", icon: FileText, url: "/admin/audit" },
]

export function CommandPalette({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const router = useRouter()

  const filteredItems = React.useMemo(() => {
    if (!query) return COMMAND_ITEMS
    return COMMAND_ITEMS.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = React.useCallback((url: string) => {
    router.push(url)
    setOpen(false)
    setQuery("")
  }, [router, setOpen])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }

      if (open) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
        } else if (e.key === "Enter" && filteredItems.length > 0) {
          e.preventDefault()
          handleSelect(filteredItems[selectedIndex].url)
        }
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen, filteredItems, selectedIndex, handleSelect])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border border-border/40 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] gap-0 bg-background/98 backdrop-blur-2xl rounded-3xl sm:rounded-3xl border-none">
        <div className="relative flex items-center h-[88px] px-8 border-b border-border/30 group">
          <Search className="h-6 w-6 text-muted-foreground/40 group-focus-within:text-primary transition-all duration-300" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-xl font-medium px-5 placeholder:text-muted-foreground/20 tracking-tight"
            placeholder="Search objectives, records, or departments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border/40 bg-muted/30 text-[11px] font-extrabold text-muted-foreground/50 shadow-sm uppercase tracking-widest leading-none">
              ESC
            </div>
            <div className="h-10 w-[1px] bg-border/20 mx-1" />
            <DialogClose 
              render={
                <button className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground/30 hover:text-foreground transition-all duration-300">
                  <X className="h-5 w-5" />
                </button>
              }
            />
          </div>
        </div>

        <div className="max-h-[520px] overflow-auto py-5 px-5 scrollbar-none">
          {filteredItems.length > 0 ? (
            <div className="space-y-1.5">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-[20px] cursor-pointer group transition-all duration-300 border border-transparent ${
                    selectedIndex === index ? "bg-primary/[0.03] border-primary/10 shadow-sm" : "hover:bg-muted/20"
                  }`}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`h-12 w-12 rounded-[18px] flex items-center justify-center border transition-all duration-500 ${
                      selectedIndex === index ? "bg-primary/10 border-primary/20 scale-105 shadow-inner" : "bg-muted/40 border-border/30"
                    }`}>
                      <item.icon className={`h-5 w-5 ${selectedIndex === index ? "text-primary animate-pulse" : "text-muted-foreground/50"}`} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${selectedIndex === index ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] transition-colors duration-300 ${selectedIndex === index ? "text-primary/60" : "text-muted-foreground/30"}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-4 transition-all duration-500 ${selectedIndex === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.15em] hidden sm:block">Open Record</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-muted/10 flex items-center justify-center mb-8 border border-dashed border-border/40">
                <Search className="h-8 w-8 text-muted-foreground/10" />
              </div>
              <p className="text-[12px] font-black text-muted-foreground/40 uppercase tracking-[0.25em]">No Governance Signal Found</p>
              <p className="text-xs text-muted-foreground/30 mt-3 font-medium max-w-[240px] leading-relaxed">The system could not identify any matching operational records for your query.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border/30 bg-muted/[0.03] flex items-center justify-between px-10">
          <div className="flex items-center gap-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/30">
            <span className="flex items-center gap-3 group/nav cursor-default">
              <kbd className="px-2 py-1 rounded-lg border border-border/40 bg-muted/50 text-foreground/40 shadow-xs transition-colors group-hover/nav:text-primary">↑↓</kbd> 
              <span className="group-hover/nav:text-muted-foreground/50 transition-colors">Navigate</span>
            </span>
            <span className="flex items-center gap-3 group/open cursor-default">
              <kbd className="px-2 py-1 rounded-lg border border-border/40 bg-muted/50 text-foreground/40 shadow-xs transition-colors group-hover/open:text-primary">ENTER</kbd> 
              <span className="group-hover/open:text-muted-foreground/50 transition-colors">Execute</span>
            </span>
            <span className="flex items-center gap-3 group/close cursor-default">
              <kbd className="px-2 py-1 rounded-lg border border-border/40 bg-muted/50 text-foreground/40 shadow-xs transition-colors group-hover/close:text-primary">ESC</kbd> 
              <span className="group-hover/close:text-muted-foreground/50 transition-colors">Dismiss</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-primary/30">
            <Shield className="h-4 w-4" />
            <div className="h-3 w-[1px] bg-border/20" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em]">GoalOS</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
