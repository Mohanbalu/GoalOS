"use client"

import * as React from "react"
import { ShieldCheck, Activity, Lock, Database, Globe } from "lucide-react"

const messages = [
  "Synchronizing governance protocols...",
  "Authenticating enterprise session...",
  "Loading organizational alignment...",
  "Verifying immutable audit logs...",
  "Securing strategic environment...",
  "Establishing RBAC authority...",
]

export function AuthTransitionOverlay() {
  const [messageIndex, setMessageIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 animate-in fade-in duration-500">
      <div className="relative flex flex-col items-center gap-8 max-w-sm w-full px-6">
        {/* Branded Logo/Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-white dark:bg-slate-900 border border-primary/20 p-5 rounded-2xl shadow-2xl">
            <ShieldCheck className="h-10 w-10 text-primary animate-pulse" />
          </div>
        </div>

        {/* Messaging */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            GoalsOS Governance
          </h2>
          <div className="h-4 flex items-center justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary animate-in slide-in-from-bottom-2 fade-in duration-300">
              {messages[messageIndex]}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress-indeterminate w-1/3 rounded-full" />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-8 pt-8 opacity-20 grayscale">
          <div className="flex flex-col items-center gap-1">
            <Lock className="h-4 w-4" />
            <span className="text-[8px] font-bold uppercase">SSL/TLS</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Database className="h-4 w-4" />
            <span className="text-[8px] font-bold uppercase">Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="text-[8px] font-bold uppercase">Global</span>
          </div>
        </div>
      </div>
    </div>
  )
}
