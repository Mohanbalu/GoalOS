import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.escalation.deleteMany()
  await prisma.checkin.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.sharedGoal.deleteMany()
  await prisma.user.deleteMany()
  await prisma.department.deleteMany()
  await prisma.cycle.deleteMany()

  console.log('Seeding enterprise data...')

  const passwordHash = await bcrypt.hash('Password123!', 10)

  // 1. Cycles
  const fy24 = await prisma.cycle.create({
    data: {
      name: 'FY 2024 Global Objectives',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
    },
  })

  // 2. Departments
  const departments = [
    { name: 'Executive Leadership' },
    { name: 'Engineering' },
    { name: 'Sales & Marketing' },
    { name: 'Operations' },
    { name: 'Customer Success' },
    { name: 'Human Resources' },
  ]

  const depts: Record<string, { id: string; name: string }> = {}
  for (const d of departments) {
    depts[d.name] = await prisma.department.create({ data: d })
  }

  // 3. Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@goalsos.com',
      name: 'Chief Governance Officer',
      passwordHash,
      role: 'ADMIN',
      departmentId: depts['Executive Leadership'].id,
    },
  })

  const managers = [
    { email: 'eng.dir@goalsos.com', name: 'Elena Rodriguez', dept: 'Engineering' },
    { email: 'sales.v@goalsos.com', name: 'Marcus Sterling', dept: 'Sales & Marketing' },
    { email: 'ops.head@goalsos.com', name: 'Wei Chen', dept: 'Operations' },
    { email: 'cs.lead@goalsos.com', name: 'Aisha Patel', dept: 'Customer Success' },
  ]

  const mgrs: Record<string, { id: string; name: string }> = {}
  for (const m of managers) {
    mgrs[m.name] = await prisma.user.create({
      data: { email: m.email, name: m.name, passwordHash, role: 'MANAGER', departmentId: depts[m.dept].id },
    })
  }

  // Generate 20 diverse employees
  const employeeNames = [
    'Alex Rivera', 'Jordan Smith', 'Sarah Jenkins', 'Tom Hardy', 'Nina Kraviz', 
    'Omar Little', 'Jane Doe', 'John Smith', 'Michael Chang', 'Emily Watson',
    'David Miller', 'Rachel Green', 'Monica Geller', 'Chandler Bing', 'Ross Geller',
    'Joey Tribbiani', 'Phoebe Buffay', 'Dwight Schrute', 'Jim Halpert', 'Pam Beesly'
  ]
  const emps: any[] = []
  
  for (let i = 0; i < employeeNames.length; i++) {
    const mgrKeys = Object.keys(mgrs)
    const assignedMgr = mgrs[mgrKeys[i % mgrKeys.length]]
    
    const emp = await prisma.user.create({
      data: {
        email: `emp${i}@goalsos.com`,
        name: employeeNames[i],
        passwordHash,
        role: 'EMPLOYEE',
        departmentId: depts['Engineering'].id, // simplifying for seed
        managerId: assignedMgr.id,
      },
    })
    emps.push(emp)
  }

  // 4. Shared Goals (Enterprise KPIs)
  const kpis = [
    { title: 'Increase Q2 ARR Growth by 18%', uom: '%', target: 18, formula: 'MAX' },
    { title: 'Reduce MTTR below 45 minutes', uom: 'minutes', target: 45, formula: 'MIN' },
    { title: 'Maintain CSAT above 92%', uom: '%', target: 92, formula: 'MAX' },
    { title: 'Decrease SLA breaches by 15%', uom: '%', target: 15, formula: 'MIN' },
  ]

  const sharedKpis: any[] = []
  for (const k of kpis) {
    const sg = await prisma.sharedGoal.create({
      data: {
        title: k.title, uom: k.uom, targetValue: k.target,
        formulaType: k.formula as 'MAX' | 'MIN' | 'TIMELINE' | 'ZERO',
        departmentId: depts['Engineering'].id,
      },
    })
    sharedKpis.push(sg)
  }

  // 5. Generate 50+ Goals, Approvals, and Audit Logs
  const goalTopics = [
    'Migrate to Next.js 15', 'Optimize Postgres Queries', 'Reduce AWS Bill by 10%', 
    'Hire 5 Senior Engineers', 'Launch Mobile App V2', 'Improve Test Coverage to 80%',
    'Refactor Payment Gateway', 'Implement SOC2 Controls', 'Upgrade Redis Cluster'
  ]

  let goalCounter = 0;
  for (const emp of emps) {
    for (let j = 0; j < 3; j++) {
      goalCounter++;
      const isApproved = j < 2; // 2 approved, 1 pending per user
      const target = Math.floor(Math.random() * 100) + 10;
      
      const goal = await prisma.goal.create({
        data: {
          userId: emp.id,
          cycleId: fy24.id,
          sharedGoalId: j === 0 ? sharedKpis[0].id : null,
          title: j === 0 ? sharedKpis[0].title : goalTopics[goalCounter % goalTopics.length],
          uom: 'Units',
          targetValue: j === 0 ? sharedKpis[0].targetValue : target,
          weightage: 30,
          formulaType: 'MAX',
          status: isApproved ? 'APPROVED' : 'PENDING_APPROVAL',
          isLocked: isApproved,
          currentProgress: isApproved ? Math.floor(Math.random() * 80) + 20 : 0,
        }
      })

      // Create Audit Logs to make the table look rich
      await prisma.auditLog.create({
        data: {
          entityType: 'GOAL', entityId: goal.id, actorId: emp.id, action: 'CREATE',
          newData: { note: "Goal submitted for manager approval", weightage: 30 }
        }
      })

      if (isApproved) {
        await prisma.auditLog.create({
          data: {
            entityType: 'GOAL', entityId: goal.id, actorId: emp.managerId, action: 'APPROVE',
            oldData: { status: 'PENDING_APPROVAL' },
            newData: { status: 'APPROVED', note: "Approved without changes" }
          }
        })

        // Check-ins for approved goals
        await prisma.checkin.create({
          data: {
            goalId: goal.id, quarter: 'Q1', actualValue: Math.floor(target * 0.5),
            employeeComment: 'Solid progress in Q1.', managerComment: 'Keep it up.',
            status: 'ON_TRACK',
          }
        })
      }
    }
  }

  // 6. Escalations (To make dashboard warnings active)
  for (let i = 0; i < 5; i++) {
    await prisma.escalation.create({
      data: {
        goalId: await prisma.goal.findFirst({ skip: i }).then(g => g!.id),
        level: i % 2 === 0 ? 1 : 2,
        status: 'PENDING',
        reason: 'Missed mandatory check-in deadline.',
        nextRetryAt: new Date(Date.now() + 86400000),
      }
    })
  }

  console.log('Massive Enterprise seed completed! 50+ goals generated.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
