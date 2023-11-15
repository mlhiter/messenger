import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'mt1', //集群，这里的ap1指的是美国东部的集群
  useTLS: true, //使用TLS传输层加密
})

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    // NOTE: pusher不支持Nuxt13之后的app结构解析，需要使用pages目录
    channelAuthorization: {
      endpoint: '/api/pusher/auth', //服务端：返回用户登录所需的身份验证签名
      transport: 'ajax', //调用身份验证方式
    },
    cluster: 'mt1',
  }
)
