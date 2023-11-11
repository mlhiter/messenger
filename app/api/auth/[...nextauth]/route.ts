import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '@/app/libs/prismadb'

// 认证配置项
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Github 认证
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Google 认证
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // 普通的邮箱认证（email+password）
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      // function:认证逻辑
      async authorize(credentials) {
        // not email or password
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid Credentials')
        }
        // find user from prima
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })
        // not this user or not password
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials')
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )
        // incorrect password
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }
        // normal return
        return user
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
