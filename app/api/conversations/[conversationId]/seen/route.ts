import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/pusher'

interface IParams {
  conversationId?: string
}

// api:更新消息，传入conversationId
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()
    const { conversationId } = params

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 先找到已存在的conversation（必须是已存在，不然更新啥消息）
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    })

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 })
    }

    // find the lastMessage
    const lastMessage = conversation.messages[conversation.messages.length - 1]

    if (!lastMessage) {
      return NextResponse.json(conversation)
    }

    // update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })

    // 发布事件到当前用户的频道，当前用户可以订阅自己消息的更新
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    })

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation)
    }

    // 发布事件到聊天区代号的频道，内容是已经更新的聊天区消息，用户订阅该聊天区的消息更新
    await pusherServer.trigger(
      conversationId!,
      'message:update',
      updatedMessage
    )

    return new NextResponse('Success')
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGE_SEEN')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
