import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// 没创建prisma实例就创建，如果有prisma实例就直接使用
// 单例模式：保证只有一个prisma实例
const client = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client
