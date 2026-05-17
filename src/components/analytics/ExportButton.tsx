"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/utils/export"

export function ExportButton({ data, filename, label = "Export Report" }: { data: Record<string, unknown>[], filename: string, label?: string }) {
  return (
    <Button variant="outline" size="sm" onClick={() => exportToCSV(data, filename)}>
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
