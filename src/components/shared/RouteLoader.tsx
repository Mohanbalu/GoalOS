"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function RouteLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // When the path or search params change, it means we've started or finished a navigation
    // Since this is a client component in the layout, it re-renders/runs on navigation.
    // We'll show the bar for a brief moment to simulate the route change perception.
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!loading) return null

  return <div className="top-loading-bar" />
}
