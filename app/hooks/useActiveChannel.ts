import { Channel, Members } from 'pusher-js'
import useActiveList from './useActiveList'
import { useEffect, useState } from 'react'
import { pusherClient } from '../libs/pusher'

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList()
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

  useEffect(() => {
    let channel = activeChannel
    if (!channel) {
      // 订阅messenger的状态频道
      channel = pusherClient.subscribe('presence-messenger')
      setActiveChannel(channel)
    }

    // 绑定订阅更新事件到回调函数里
    // 状态频道的subscription_succeeded就是用户auth pusher成功，可以通过id获取id(也就是email)
    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = []
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      )
      set(initialMembers)
    })

    // 监测增加成员的行为
    channel.bind('pusher:member_added', (member: Record<string, any>) => {
      add(member.id)
    })

    // 监测移除成员的行为
    channel.bind('pusher:member_removed', (member: Record<string, any>) => {
      remove(member.id)
    })

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger')
        setActiveChannel(null)
      }
    }
  }, [activeChannel, set, add, remove])
}

export default useActiveChannel
