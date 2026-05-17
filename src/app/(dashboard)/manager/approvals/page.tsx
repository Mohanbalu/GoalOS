import prisma from "@/lib/db/prisma"
import { auth } from "@/auth"
import { ApprovalTable } from "./_components/ApprovalTable"

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await auth()
  const managerId = session?.user?.id
  const params = await searchParams
  const currentPage = Number(params?.page) || 1
  const pageSize = 20

  const [pendingGoals, totalCount] = await Promise.all([
    prisma.goal.findMany({
      where: {
        user: { managerId },
        status: "PENDING_APPROVAL"
      },
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: "asc" },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),
    prisma.goal.count({
      where: {
        user: { managerId },
        status: "PENDING_APPROVAL"
      }
    })
  ])
  
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approval Queue</h1>
        <p className="text-muted-foreground">Review, adjust, and approve goals for your team members.</p>
      </div>

      <ApprovalTable initialGoals={pendingGoals} />
    </div>
  )
}
