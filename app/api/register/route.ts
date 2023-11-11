import bcrypt from 'bcrypt'

import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

// POST注册请求
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, name, password } = body
    // 如果信息不全
    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户并返回JSON数据
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })
    return NextResponse.json(user)
  } catch (error: any) {
    console.log(error, 'REGISTRATION_ERROR')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
