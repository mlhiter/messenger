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

### 二. Tailwind CSS

CSS原子化框架，通过类名的方式快速上样式，CSS框架领域的no.1。

项目中还用到的附属包：[@tailwindcss/forms examples (tailwindcss](https://tailwindcss-forms.vercel.app/)

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
| route        | 服务端API文件                                                |
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
