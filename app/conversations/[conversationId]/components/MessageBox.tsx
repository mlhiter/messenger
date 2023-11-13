'use client'

import { FullMessageType } from '@/app/types'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import Avatar from '@/app/components/Avatar'
import { format } from 'date-fns'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useConversation from '@/app/hooks/useConversation'
import ImageModal from './ImageModal'
interface MessageBoxProps {
  data: FullMessageType
  isLast?: boolean
}
const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession()
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const isOwn = session?.data?.user?.email === data?.sender?.email
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ')

  console.log(
    `isOwn:${isOwn},isLast:${isLast},seenList:${seenList},message:${data.body}`
  )

  // alex,lisa,mary
  const container = clsx(
    `
      flex gap-3 p-4
    `,
    isOwn && 'justify-end'
  )
  const avatar = clsx(isOwn && 'order-2')
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end')
  const message = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  )
  const { conversationId } = useConversation()
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => {
                setImageModalOpen(true)
              }}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="
              object-cover
              cursor-pointer
              hover:scale-110
              transition
              translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {/* BUG:seen机制有问题，无法显示 */}
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  )
}

export default MessageBox
