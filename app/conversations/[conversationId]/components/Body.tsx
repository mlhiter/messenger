'use client'

import useConversation from '@/app/hooks/useConversation'
import { FullMessageType } from '@/app/types'
import { useState, useRef, useEffect } from 'react'
import MessageBox from './MessageBox'
import axios from 'axios'
import { pusherClient } from '@/app/libs/pusher'
import { find } from 'lodash'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  // 用来滚动到底部的引用
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(initialMessages)
  const { conversationId } = useConversation()

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)

    bottomRef?.current?.scrollIntoView()

    const messagesHandler = (messages: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)

      // 如果新建聊天已经存在则不变，否则加上一个messages(一个聊天空间)
      setMessages((current) => {
        if (find(current, { id: messages.id })) {
          return current
        }
        return [...current, messages]
      })

      bottomRef?.current?.scrollIntoView()
    }
    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage
          }
          return currentMessage
        })
      )
    }
    pusherClient.bind('messages:new', messagesHandler)
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('message:new', messagesHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}

      <div ref={bottomRef} className="pt-24"></div>
    </div>
  )
}

export default Body
