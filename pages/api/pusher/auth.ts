import { NextApiResponse, NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { pusherServer } from '@/app/libs/pusher'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

// function: pusher权限认证，验证信息发出方是用户（通过email）
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions)

  if (!session?.user?.email) {
    return response.status(401)
  }

  const socketId = request.body.socket_id
  const channel = request.body.channel_name
  const data = { user_id: session.user.email }

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data)

  return response.send(authResponse)
}
