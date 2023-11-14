import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

// api: 新建conversation，传入参数是新的conversation的一些属性
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

    // 当前用户没有id或email，权限认证不通过
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 不满足成为的群组条件
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 })
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            // 将当前用户和其他群组内用户关联到一个conversation
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
        // 拿到用户的数据
        include: {
          users: true,
        },
      })

      // 对群组发布pusher订阅
      newConversation.users.forEach((user) => {
        if (user.email) {
          // 对群组内的每个用户发布一个事件，群组内都能监听到新群组被创建（自己在新群组内）的消息
          pusherServer.trigger(user.email, 'conversation:new', newConversation)
        }
      })

      return NextResponse.json(newConversation)
    }

    // 提前检查是否有单聊存在（两个用户），群组不需要查看
    // 条件涉及两个用户的ID，findUnique语法不可以
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
    // 存在单聊直接返回
    if (singleConversation) {
      return NextResponse.json(singleConversation)
    }

    // 没有就创建一个新的单聊
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

    // 对单聊发布订阅
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation)
      }
    })
    return NextResponse.json(newConversation)
  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
