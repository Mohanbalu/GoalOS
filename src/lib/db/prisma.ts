import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// In development, the command `next dev` clears Node.js cache on run.
// This in turn initializes a new PrismaClient instance each time due to
// hot reloading that creates a connection to the database.
// To prevent this issue, we instantiate the PrismaClient as a global variable.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
