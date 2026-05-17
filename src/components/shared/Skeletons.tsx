import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KPISkeleton() {
  return (
    <Card className="enterprise-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-end space-x-2 h-[200px] w-full pt-4">
        <Skeleton className="h-[40%] flex-1" />
        <Skeleton className="h-[70%] flex-1" />
        <Skeleton className="h-[55%] flex-1" />
        <Skeleton className="h-[90%] flex-1" />
        <Skeleton className="h-[30%] flex-1" />
        <Skeleton className="h-[65%] flex-1" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 enterprise-card">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent className="pt-2">
            <ChartSkeleton />
          </CardContent>
        </Card>
        <Card className="col-span-3 enterprise-card">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={4} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
