### 1，SyntaxError: Unexpected end of JSON input

dateTime：2023.11.11 22:52

登录的时候发生，导致无法正常登录。

报错还有：TypeError: "ikm" must be at least one byte in length

**解决方案：**

我没有设置 NEXTAUTH_SECRET，设置方法：

```sh
openssl rand -base64 32
```

将生成的密钥填入 env 中的 NEXTAUTH_SECRET 中。

当然，你随便输入一个字符串都可以，但是不能啥都不输入。

### 2，如图

![image-20231112103044095](https://raw.githubusercontent.com/mlhiter/typora-images/master/202311121031557.png)

小问题，把 DesktopItem组件 写好就没事了

### 3，Failed to download `Inter` from Google Fonts. Using fallback font instead.

下载 google 字体失败。

实际上这个错误并不影响应用的正常运行。

解决方案：

很简单，关闭 VPN 即可，Next 的谷歌字体需要在线加载但是对代理不友好，导致的结果

### 4，app-index.js:32 Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <button>.

没法重现问题。。。

### 5，无法同时登陆两个账户，一直同步登录状态

一个使用隐私模式，另一个正常即可

### 6，build 的时候遇到问题

**问题：**Type error: Route "app/api/auth/[...nextauth]/route.ts" does not match the required types of a Next.js Route. 

发生在/app/api/auth/[…nextauth]/route.ts中

解决方案：[My Next Js app isn't building and returing a type error, how do I fix? - Stack Overflow](https://stackoverflow.com/questions/76298505/my-next-js-app-isnt-building-and-returing-a-type-error-how-do-i-fix)

**原因：**

在NextJS中使用route.ts文件只能导出名为GET、POST、PATCH等的http对象，我尝试导出authOptions，所以构建失败了

**解决方法：**将authOptions移到另一个文件中，然后导入到这个文件里即可

我是配置了快捷键，alt+enter可以快速操作，选项里有move to new file，非常轻松，1s搞定，这种方式还不需要你改其他导入的地方，很简练

### 7，超时问题

部署vercel之后，请求pusher时出现超时错误：

An error occurred with your deployment

FUNCTION_INVOCATION_TIMEOUT

原因：经过查询是Vercel的hobby计划只允许无服务器API请求5s，如果超时会报错504。我设置了pusher的cluster地址为ap，即新加披，那么就很容易超时了

解决方式：将pusher地址改为美国
