"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { AuthTransitionOverlay } from "@/components/auth/AuthTransitionOverlay"

interface TransitionContextType {
  startTransition: () => void
  stopTransition: () => void
  isTransitioning: boolean
}

const TransitionContext = React.createContext<TransitionContextType | undefined>(undefined)

function TransitionProviderInner({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startTransition = React.useCallback(() => {
    setIsTransitioning(true)
  }, [])

  const stopTransition = React.useCallback(() => {
    setIsTransitioning(false)
  }, [])

  // Automatically stop transition when the route changes
  React.useEffect(() => {
    // Small delay to ensure the new page has painted
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <TransitionContext.Provider value={{ startTransition, stopTransition, isTransitioning }}>
      {isTransitioning && <AuthTransitionOverlay />}
      {children}
    </TransitionContext.Provider>
  )
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      <TransitionProviderInner>{children}</TransitionProviderInner>
    </React.Suspense>
  )
}

export function useTransition() {
  const context = React.useContext(TransitionContext)
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider")
  }
  return context
}
