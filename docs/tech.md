## 技术栈

### 一. React

前端基础 UI 框架，用于构建交互性 Web 界面

文档地址：[React 官方中文文档](https://zh-hans.react.dev/)

项目中用到的知识点：

#### 1. Hook 函数

1. useCallback

   1. 缓存一个函数，之后每次渲染观察依赖项的值是否发生改变，如果没有发生改变 useCallback 就返回缓存中的函数，否则返回此次渲染中传递的函数。

   2. 作用：性能优化

   3. 使用方式

      ```js
      const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
          setVariant('REGISTER')
        } else {
          setVariant('LOGIN')
        }
      }, [variant]) //variant为依赖项
      ```

   4. useCallback 缓存函数本身（函数的内存地址，因为函数每次都会创建新的，缓存有利于保证其他依赖组件不发生变化而提高性能；但是注意**useCallback 并不会阻止新的渲染中该函数的创建**，只是 react 忽略了新创建的，转而仍然使用旧的函数）；useMemo 调用函数缓存结果（比如 return 了一个值，缓存这个值，当依赖项不变，则不进行计算直接返回该值），必要时 React 仍然会重新运行代码计算结果

   5. 网站交互占比越大，越有必要使用 useCallback

2. useMemo

   1. 和useCallback比较类似，只是useMemo缓存函数计算结果（如果两次渲染依赖项不变，则不会进行计算，直接返回缓存结果）
   2. 作用：跳过代价昂贵的重新计算

3. useEffect

   1. 允许组件和外部系统同步

   2. useEffect执行过程：组件挂载到页面时运行一次setup代码，之后如果重新渲染发现依赖项改变，则会执行上一次的cleanup代码，然后执行一次这一次的setup代码。当组件从页面卸载后，cleanup代码会运行一次。

   3. 作用：一般用于包装请求、外部API、订阅事件、触发动画

   4. 使用方式：

      ```jsx
      import { useEffect } from 'react';
      
      function MyComponent() {
        useEffect(() => {
          // 执行副作用的代码->setup
      
          // 返回一个清理函数（可选）->cleanup
          //一般用于取消订阅、清除定时器等
          return () => {
            // 在组件卸载或下一次运行 effect 之前执行清理操作(如果dependencies改变的话)
          };
        }, [dependencies]);
      }
      
      ```

   5. 注意：useEffect完全在客户端运行；无法选择依赖项，必须将响应式数据全部写上；开发环境下react会在实际运行setup之前额外运行一次setup和cleanup

4. useState

   1. 控制响应式变量的getter和setter

   2. 使用

      ```jsx
      //age为getter，setAge为setter，42为初始值  
      const [age, setAge] = useState(42);
      age //42
      setAge(11)//可以直接传入值
      setAge(x=>x+1)//可以传入更新函数
      ```

   3. 注意：开发环境下会运行两次初始化函数；set函数仅更新下一次渲染的状态变量（在本次渲染中再读取还是旧值）；如果新值和旧值相同则跳过渲染


### 二. Tailwind CSS

CSS原子化框架，通过类名的方式快速上样式，CSS框架领域的no.1。

项目中还用到的附属包：[@tailwindcss/forms](https://tailwindcss-forms.vercel.app/)

文档地址：[Tailwind CSS](https://tailwindcss.com/)

项目中用到的（我）不太常见的类名：

| ClassName        | Effect                                                       |
| ---------------- | ------------------------------------------------------------ |
| sm:px-6          | 这个前缀是@media (min-width: variant)的预置项，用于响应式设计。variant有几个预置选项：sm(640px)、md(768px)、lg(1024px)、xl(1280px)、2xl(1536px) |
| mx-auto          | mx->就是margin-left:auto和margin-right:auto的结合体          |
| font-bold        | 字体粗度的一种：thin、extralight、light、normal、medium、semimedium、bold、extrabold、black |
| tracking-tight   | 字母间距的一种：tighter、tight、normal、width、wider、widest |
| shadow-sm        | 元素边框阴影的一种：sm、空、md、lg、xl、2xl、inner、none     |
| inset-0          | 填满整个父元素，父元素要有relative，当前元素一般设置为absolute，inset是四个边距的缩写 |
| ring             | 元素border外的一圈环状线，常见值有0、1、2、空、4、8；也常常与ring-inset配合使用，将其渲染在元素内部，防止元素出现在屏幕边缘导致渲染无法显示 |
| outline-offset-0 | 元素轮廓偏移量，取值有0，1，2，4，8                          |
| leading-6        | 行高                                                         |

### 三. React-hook-form

React 的表单解决方案->高性能、易扩展

react-hook-form 是非受控模式，不需要使用很多 state，这是它的优势之一

文档地址：[React Hook Form](https://react-hook-form.com/)

使用方式：

```jsx
import { useForm, SubmitHandler } from "react-hook-form"
// definition:输入表单类型限制
type User = {
  username: string
  password: string
}
export default function App() {
  const {
    register,// 注册表单项到hook里，可以传入认证规则（比如是否必须等）
    handleSubmit,// 对原始表单的submit进行包装，用于提交前的认证和其他处理
    watch, // 可以watch表单输入值的变化
    formState: { errors },// 订阅表单状态，一般用于某种错误出现时页面渲染错误提示信息
  } = useForm<User>({defaultValues:{username:"Alex Lee",password:"123456"}})//传入默认值
  // 提交
  const onSubmit: SubmitHandler<Inputs> = (data) =>console.log(data)
  console.log(watch("example")) // 通过传入name可以监视example的值变化

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor={username}>用户名</label>
			<input  {...register("username")} />
      <label htmlFor={password}>密码</label>
			<input {...register("password", { required: true })} />
			{errors.password && <span>This field is required</span>}
 			<input type="submit" />
   	</form>
 )
}
```

### 四. clsx

一款小型工具包，**有条件地**构建 classNames 字符串

文档地址：[clsx ](https://www.npmjs.com/package/clsx)

使用方式：

```jsx
import clsx from 'clsx'
//会下面这种方式即可，好使
const Button: React.FC<ButtonProps> = () => {
  return (
    <button className={clsx(disabled && 'opacity-50 cursor-default')}>
      {children}
    </button>
  )
}

export default Button
```

### 五. Next

（其实这个应该位置应该放到第二位）

基于 React 基础上实现的全栈框架，进行了全面的优化和改良，神中神！

文档地址：[Next.js](https://nextjs.org/)

项目中用到的知识点：

#### 1. 路由

树状结构，通过文件夹区分路径段，子文件夹就是子路径。

Next13之后出现的app路由模式，它基于React Server Components，也就是说它默认的界面是服务端渲染，无法进行动态交互。所以如果想要加入动态交互需要在有动态交互的组件文件最上面加上`use client`

Next使用一种约定式的方式规定了一些特殊的文件，它们有特殊的作用

| 约定文件名称 | 作用                                                         |
| ------------ | ------------------------------------------------------------ |
| layout       | 该路由及其子段的共享布局UI（就是界面框架，当前路由和其子路由共享） |
| page         | 当前路由的独特UI，并使路由可公开访问                         |
| loading      | 该路由和其子段共享的加载UI                                   |
| not-found    | 未找到路由和其字段的UI                                       |
| error        | 该路由和其子段共享的错误UI                                   |
| global-error | 全局错误UI                                                   |
| route        | 服务端API文件->只能返回GET、POST、DELETE之类的请求名称（名字也不能变），不能返回其他东西 |
| template     | 重新渲染布局UI（和layout的差别是这个每次加载子路由都会新建一个实例，也就是说重新加载DOM元素） |

#### 2. Image组件

Next对Image、Font等进行了优化。

比较明显的作用：

- 大小优化：next使用新的现代化的文件格式，比如avif或者webp，并且保证提供正确的尺寸大小
- 视觉稳定性：不会出现图像出现导致的布局偏移

使用：

```tsx
import Image from 'next/image'
import profilePic from './me.png'
 
export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="Picture of the author"
    />
  )
}
```

### 六. React-icons

react使用的一组图标库

文档地址：[React Icons](https://react-icons.github.io/react-icons)

### 七. Prisma

ORM（Object/Relational Mapping），用面向对象的方式操作数据库（可以是关系型数据库或者非关系型数据库）

简单地说就是让数据库操作更简单的工具

使用包：@prisma/client（ORM客户端，用来进行数据查询query）、prisma（服务端本体库，用来数据库对接和建模）

文档地址：[Prisma](https://www.prisma.io/)

使用：架构文件（schema,primsa）

```jsx
generator client{//生成什么客户端
  provider = 'prisma-client-js'
}
datesource db{//prisma链接的数据库
  provider = "mongodb" //数据库类型
  env = env("DATABASE_URL") //数据库地址，读取环境变量
}
// 名叫User的模型定义->映射为表/集合
model User {
  //字段名称 字段类型+可选类型修饰符 属性（可选）
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  name           String?
  email          String?   @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  conversationIds String[]       @db.ObjectId
  conversations   Conversation[] @relation(fields: [conversationIds], references: [id])
}
......
```

查询功能自己看文档吧：[Prisma Client](https://www.prisma.io/client)

### 八. next-auth

Next框架下工具包，用来权限认证

附属包：@next-auth/prisma-adapterr（prisma适配器）

文档地址：[NextAuth.js](https://next-auth.js.org/)

### 九. axios

Promise式的请求api包

文档地址：[Axios](https://axios-http.com/)

### 十. bcrypt

哈希密码包

文档地址：[bcrypt](https://www.npmjs.com/package/bcrypt)

使用：

```ts
//生成hash化的密码
const hashedPassword = await bcrypt.hash(password, 12)
//检查密码是否正确
const isCorrectPassword = await bcrypt.compare(
credentials.password,user.hashedPassword
)
```

### 十一. date-fns

时间工具包

文档地址：[date-fns](https://date-fns.org/)

使用：

```tsx
import { format } from 'date-fns'

<div className="text-xs text-gray-400">
  //p转换为长本地化时间字符串
{format(new Date(data.createdAt), 'p')}
</div>
```

### 十一. next-cloudinary

云图像存储，提供上传组件

文档地址：[next-cloudinary](https://www.npmjs.com/package/next-cloudinary)

使用：

```tsx
import { CldUploadButton } from 'next-cloudinary'

const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true,
    })
  }

<CldUploadButton
  options={{ maxFiles: 1 }}
  onUpload={handleUpload}
  uploadPreset="">
  <Button disabled={isLoading} secondary type="button">Change</Button>
</CldUploadButton>
```

### 十二. Pusher

相关包：pusher（pusher服务端）、pusherjs（pusher客户端）

pusher是一个托管推送通知的服务提供商，实现客户端和服务端的实时中间层。

web Sockets API允许我们实时通讯但是API太过底层，需要很多封装处理，基于pusher我们不需要学什么东西，直接用就得了，用法很简单。

**项目里的作用是进行实时的消息显示。**比如你发了一条消息给我我的浏览器上能够立马看到。

文档地址：[Pusher](https://pusher.com/)

使用：

```jsx
//服务器发布事件event到特定的频道channel,内容是第三个参数
pusher.trigger('my-channel', 'my-event', {
  message: 'Hello, Pusher!'
});
// 客户端订阅频道并监听事件
const channel = pusher.subscribe('my-channel');
// 绑定event更新到一个handler函数上，每当event一更新，handler对更新后的数据进行处理
channel.bind('my-event', function(data) {
  console.log('接收到来自 Pusher 的事件:', data);
});
channel.unbind('my-event', ()=>{})
```

### 十三. headlessui

包：@headlessui/react

无头UI，只提供组件逻辑，不提供组件样式，自己配置样式（它提供配置接口）。

比较常用而且项目里用到的：Dialog(弹出框)、Transition(过渡样式)

文档地址：[@headlessui/react](https://headlessui.com/react/menu)

使用：

```html
<Transition.Root show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-100 bg-opacity-50 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className=" flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel>
              <ClipLoader size={40} color="#0284c7" />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
```

### 十四. react-hot-toast

一个组件包，notifications，就是界面弹出提示的包。

文档地址：[react-hot-toast](https://react-hot-toast.com/)

使用：

```jsx
toast.success('Successfully toasted!')
```

就酱，直接js里用就得了，其他用法看文档

### 十五. zustand

React的状态管理工具。

文档地址：[Zustand](https://zustand-demo.pmnd.rs/)

使用：

```ts
import { create } from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

### 十六. lodash

JS工具库，封装了一些基本工具

文档地址：[Lodash](https://www.lodashjs.com/)

项目中用到的函数方法：

```ts
import { find } from 'lodash'
// 如果新建聊天已经存在则不变，否则加上一个messages(一个聊天空间)
setMessages((current) => {
  //找到current对象数组里，含有属性id且id的value为messanges.id的对象
  if (find(current, { id: messages.id })) {
    return current
  }
    return [...current, messages]
  })
```

### 十七. next-superjson-plugin

修复NextJS里return方法里不允许包含非JS值的问题(Map、Date、Set)

文档地址:[next-superjson](https://www.npmjs.com/package/next-superjson-plugin)

使用：

```ts
//next.config.js
const nextConfig = {
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
}
```

### 十八. react-select

react的select组件

文档地址：[React Select](https://react-select.com/home)

使用：

```tsx
import React from 'react'
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const MyComponent = () => (
  <Select options={options} />
)
```

### 十九. react-spinners

加载器效果组件的收集集合

文档地址：[react-spinners](https://www.npmjs.com/package/react-spinners)

在线查阅地址：[React Spinners](https://www.davidhu.io/react-spinners/)

```tsx
import { ClipLoader } from 'react-spinners'
<ClipLoader size={40} color="#0284c7" />
```

