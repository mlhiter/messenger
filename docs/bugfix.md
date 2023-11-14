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

小问题，把 DesktopItem 写好就没事了

### 3，Failed to download `Inter` from Google Fonts. Using fallback font instead.

下载 google 字体失败。

实际上这个错误并不影响应用的正常运行。

解决方案：

很简单，关闭 VPN 即可，Next 的谷歌字体需要在线加载但是对代理不友好，导致的结果

### 4，app-index.js:32 Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <button>.

没法重现问题。。。

### 5，无法同时登陆两个账户，一直同步登录状态

一个使用隐私模式，另一个正常即可
