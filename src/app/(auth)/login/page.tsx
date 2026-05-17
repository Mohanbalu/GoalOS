import { LoginForm } from "@/components/auth/LoginForm"
import { Target, ShieldCheck, Zap, BarChart3, Lock, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 overflow-hidden bg-background">
      {/* Left Panel: Enterprise Governance Branding */}
      <div className="relative hidden lg:flex flex-col justify-between bg-muted p-10 text-foreground overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
              <Target className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">GoalsOS</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Enterprise Goal <span className="text-primary">Governance</span> Platform
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Drive organizational alignment with immutable approvals, audit-safe workflows, and real-time performance analytics.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { icon: ShieldCheck, text: "Immutable Audit Trails", sub: "Permanent record of all state transitions" },
                { icon: Zap, text: "Shared KPI Synchronization", sub: "Real-time propagation across departments" },
                { icon: BarChart3, text: "Quarterly Performance Tracking", sub: "Data-driven employee growth metrics" },
                { icon: Lock, text: "Role-Based Governance", sub: "Fine-grained security and access control" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{item.text}</h3>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini Preview Widget */}
        <div className="relative z-10 mt-auto pt-10">
          <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-md p-4 shadow-2xl shadow-foreground/5 max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Governance Metric</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">98.4%</span>
              <span className="text-xs text-emerald-500 font-medium pb-1 flex items-center gap-0.5">
                <Zap className="h-2.5 w-2.5 fill-current" /> +1.2% this quarter
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary w-[98.4%]" />
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground italic">
              Goal integrity verified across 42 active departments.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] blur-[120px]" />
        
        <div className="w-full max-w-[400px] space-y-8 relative z-10">
          <div className="flex flex-col items-center space-y-2 text-center lg:items-start lg:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary lg:hidden mb-2">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Platform Access</h2>
            <p className="text-sm text-muted-foreground max-w-[320px]">
              Secure authentication required for organizational governance and performance tracking.
            </p>
          </div>
          
          <LoginForm />
          
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex items-center gap-6 grayscale opacity-60">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-tighter">
                <ShieldCheck className="h-3 w-3" />
                <span>RBAC Protected</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-tighter">
                <CheckCircle2 className="h-3 w-3" />
                <span>Audit Ready</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-tighter">
                <Lock className="h-3 w-3" />
                <span>Secure ISO</span>
              </div>
            </div>
            
            <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
              © 2024 GoalsOS Enterprise Platform. All rights reserved.<br />
              Performance tracking, approvals, analytics, and audit management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
