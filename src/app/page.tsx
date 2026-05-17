import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Target, 
  Shield, 
  BarChart3, 
  Users, 
  ArrowRight, 
  Cpu, 
  GitMerge, 
  Activity, 
  Database,
  History,
  Lock,
  Flame,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react"
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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-primary/10 transition-colors duration-300">
      {/* Header / Global Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link className="flex items-center gap-2 group" href="#">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md group-hover:scale-105 transition-transform duration-300">
            <Target className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-wider uppercase text-slate-900 dark:text-white">GoalsOS</span>
        </Link>
        
        <nav className="flex gap-4 sm:gap-6 items-center">
          <Link className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors" href="/login">
            Access System
          </Link>
          <Button asChild size="sm" className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 h-9 active:scale-95 transition-all">
            <Link href="/login">Launch Workspace</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden border-b border-slate-200/50 dark:border-slate-800/20">
          {/* Executive Cyber-Grid Background */}
          <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl z-0" />
          
          <div className="container px-6 lg:px-12 relative z-10 mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              
              {/* Left Column: Authoritative Messaging */}
              <div className="lg:col-span-5 space-y-8 text-left">
                <div className="inline-flex items-center gap-2 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 px-3.5 py-1.5 rounded-full">
                  <Shield className="h-3.5 w-3.5 text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Compliance Clearance Level 3</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] font-serif text-slate-900 dark:text-white">
                    Orchestrate Strategic <span className="text-primary italic">Alignment</span>. Enforce Absolute <span className="text-primary">Governance</span>.
                  </h1>
                  <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                    GoalsOS couples transaction-safe goal setting with an immutable audit ledger, dynamic cascade synchronization, and rule-based escalation engines. High-density performance orchestration for modern enterprise networks.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button asChild size="lg" className="rounded-xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-md active:scale-95 transition-all">
                    <Link href="/login" className="flex items-center gap-2">
                      Access Enterprise Workspace <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Premium Interactive Product Visualization */}
              <div className="lg:col-span-7 relative">
                {/* Visual Glassmorphism Framing */}
                <div className="relative rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-2xl p-4 sm:p-6 overflow-hidden max-w-2xl mx-auto group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50 z-0" />
                  
                  {/* Header Simulated Controls */}
                  <div className="relative z-10 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/30 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-4 font-mono">goalsos://core.console</span>
                    </div>
                    <Badge className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 rounded-md text-[8px] font-mono tracking-widest uppercase px-2 py-0.5">
                      LIVE PROTOCOL ACTIVE
                    </Badge>
                  </div>

                  {/* Body Content Simulation */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Simulated Left Panel */}
                    <div className="md:col-span-1 border-r border-slate-200/50 dark:border-slate-800/30 pr-4 space-y-4 hidden md:block">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Node Clearance</span>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">Alex Rivera (L1)</p>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/20">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Console Monitor</span>
                        <div className="space-y-1">
                          <div className="bg-primary/5 border border-primary/10 rounded-lg p-1.5 flex items-center gap-1.5">
                            <Activity className="h-3 w-3 text-primary" />
                            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-350">Ops Active</span>
                          </div>
                          <div className="rounded-lg p-1.5 flex items-center gap-1.5 text-slate-400">
                            <History className="h-3 w-3" />
                            <span className="text-[9px] font-bold">Ledger Stream</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Right Active Console */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Metric cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-3 shadow-sm">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block">Departmental Velocity</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">84%</span>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl p-3 shadow-sm">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block">Ledger Integrity</span>
                          <span className="text-lg font-black text-emerald-600 dark:text-emerald-500 mt-1 block flex items-center gap-1">
                            100% <CheckCircle2 className="h-4 w-4" />
                          </span>
                        </div>
                      </div>

                      {/* Simulated Ledger Activity */}
                      <div className="bg-slate-950 dark:bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-sm font-mono text-[9px] text-slate-400 space-y-2">
                        <div className="flex items-center justify-between text-[8px] text-slate-500 border-b border-slate-800 pb-1.5 font-bold uppercase tracking-wider">
                          <span>Event Stream</span>
                          <span>Timestamp</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />GOAL_APPROVED</span>
                          <span>12:04:28</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />CHECKIN_MUTATION</span>
                          <span>12:04:12</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 italic">
                          <span>&gt;_ Listening for strategic mutations...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtly Layered Floating Elements */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl hidden sm:flex items-center gap-3 z-20 max-w-xs animate-bounce-slow">
                  <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <Flame className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Escalation Trigger</h4>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5">Q1 Check-in Target Missed</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Enterprise Metrics Strip */}
        <section className="w-full bg-slate-900 text-white py-6 border-y border-slate-800">
          <div className="container px-6 lg:px-12 mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">Corporate Nodes Managed</span>
                <span className="text-2xl font-black mt-1 block">50,000+</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">Ledger Security Sync</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">99.99%</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">SLA Compliance Index</span>
                <span className="text-2xl font-black mt-1 block">100%</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">Daily Audit Operations</span>
                <span className="text-2xl font-black text-primary mt-1 block">12.4M</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Infrastructure Capabilities */}
        <section className="w-full py-20 lg:py-32 bg-white dark:bg-slate-950">
          <div className="container px-6 lg:px-12 mx-auto max-w-7xl space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Governance Suite</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">Structural Framework for Organizational Velocity</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Decouple strategic directives from administrative friction with strongly typed governance safeguards.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Immutable Audit Ledger",
                  desc: "Every target change, checklist submission, L1 calibration, and override is recorded in our cryptographically secure, permanent ledger."
                },
                {
                  icon: GitMerge,
                  title: "Horizontal KPI Cascade",
                  desc: "Synchronize departmental goals across teams instantly. Achievement mutations dynamically propagate from primary owners to all siblings."
                },
                {
                  icon: Lock,
                  title: "Role-Based Clearance",
                  desc: "Distinct secure interfaces for Employees, L1 Managers, and Administrators, fully isolated by Auth.js clearance credentials."
                },
                {
                  icon: Flame,
                  title: "Escalation Rules Engine",
                  desc: "Rule-based triggers monitor outstanding check-ins, alert skip-level managers, and log compliance exceptions for HR remediation."
                },
                {
                  icon: FileSpreadsheet,
                  title: "Compliance Spreadsheet Export",
                  desc: "Instantly export high-density Excel-compatible spreadsheets detailing planned targets vs actual achievements across all corporate units."
                },
                {
                  icon: BarChart3,
                  title: "Velocity Analytics Dashboard",
                  desc: "Real-time organization completion scorecards, velocity charts, and manager effectiveness indicators at every clearance level."
                }
              ].map((capability, i) => (
                <div key={i} className="flex flex-col space-y-4 border border-slate-200/80 dark:border-slate-800/40 p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/30 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-800 transition-all group duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <capability.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black tracking-tight">{capability.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {capability.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Architecture / Authority */}
        <section className="w-full py-20 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200/50 dark:border-slate-800/30">
          <div className="container px-6 lg:px-12 mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Technical Superiority</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif text-slate-900 dark:text-white">
                    Engineered for Absolute Transaction Safety
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    GoalsOS guarantees atomic consistency during bulk strategic operations. Our stack is hardened against concurrency conflicts, state manipulation, and privilege escalation.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Pessimistic Write-Locking", desc: "Prevents race conditions during simultaneous employee goal calibration submissions.", icon: Cpu },
                    { title: "Multi-Step State Machine Validation", desc: "Forces exact 100% total weightage and 10% minimal individual parameters before approval locking.", icon: Database },
                    { title: "On-Demand Staged Revalidation", desc: "Leverages Next.js static bailing and revalidation routes for millisecond UI rendering latencies.", icon: Activity }
                  ].map((tech, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <tech.icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{tech.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{tech.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic / Abstract visualization representing security */}
              <div className="relative rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-xl overflow-hidden max-w-md mx-auto">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--primary)_0%,_transparent_50%)] opacity-5" />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-4">
                    <Lock className="h-5 w-5 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Security Clearance Guard</span>
                  </div>
                  
                  <div className="space-y-3 font-mono text-[10px] text-slate-400">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <span className="text-primary block font-bold">// TRANSACTION LOG INITIATED</span>
                      <span className="text-slate-600 dark:text-slate-400 block mt-1">BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <span className="text-slate-500 block">// LOCKING GOAL SHEET (ID: goal_sh_87)</span>
                      <span className="text-slate-600 dark:text-slate-400 block mt-1">SELECT * FROM &quot;Goal&quot; WHERE &quot;userId&quot; = $1 FOR UPDATE;</span>
                    </div>
                    <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-600">
                      <span className="font-bold block">// GOVERNANCE STATE VALIDATED (100% OK)</span>
                      <span className="block mt-1">COMMIT; // AUDIT LOG SYNCHRONIZED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Elevated Footer */}
      <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-950 px-6 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 mx-auto max-w-7xl">
        <div className="space-y-3 max-w-sm text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900">
              <Target className="h-4.5 w-4.5" />
            </div>
            <span className="text-md font-black tracking-wider uppercase">GoalsOS</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            GoalsOS is a state-of-the-art enterprise-grade goal governance SaaS platform, ensuring absolute strategic orchestration and audit compliance.
          </p>
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">CLEARANCE LEVEL 3 ISO COMPLIANT</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-black text-slate-400 block tracking-widest">Platform Node</span>
            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors" href="/login">Launch Workspace</Link>
            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors" href="/login">Access System</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-black text-slate-400 block tracking-widest">Legal clearance</span>
            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Privacy Protocol</Link>
            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
export const dynamic = "force-dynamic"
