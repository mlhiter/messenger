import prisma from '@/app/libs/prismadb'
import getSession from './getSession'

const getCurrentUser = async () => {
  try {
    const session = await getSession()

    // 当前没有用户登录
    if (!session?.user?.email) {
      return null
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    })
    // 该email没有对应用户
    if (!currentUser) {
      return null
    }
    return currentUser
  } catch (error: any) {
    return null
  }
}
export default getCurrentUser
