import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const {
      userId, //单人聊天的对象
      isGroup, //是否是群组
      members, //群组成员
      name, //群组名称
    } = body

    // 当前用户权限认证未通过
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    // 为满足群组创建条件
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 })
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        // 拿到用户的资料数据
        include: {
          users: true,
        },
      })

      return NextResponse.json(newConversation)
    }

    // 单聊必须先检查有没有已经有的conversation，群组是没事的
    // 这里findUnique不可以，因为语法不支持
    const existingConversation = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    })
    const singleConversation = existingConversation[0]
    if (singleConversation) {
      return NextResponse.json(singleConversation)
    }

    // 没有就创建一个新的
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    })

    return NextResponse.json(newConversation)
  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
