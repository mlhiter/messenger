### 1，SyntaxError: Unexpected end of JSON input

dateTime：2023.11.11 22:52

登录的时候发生，导致无法正常登录。

报错还有：TypeError: "ikm" must be at least one byte in length

**解决方案：**

我没有设置NEXTAUTH_SECRET，设置方法：

```sh
openssl rand -base64 32
```

将生成的密钥填入env中的NEXTAUTH_SECRET中。

当然，你随便输入一个字符串都可以，但是不能啥都不输入。

### 2，如图

![image-20231112103044095](https://raw.githubusercontent.com/mlhiter/typora-images/master/202311121031557.png)

小问题，把DesktopItem写好就没事了

### 3，Failed to download `Inter` from Google Fonts. Using fallback font instead.

下载google字体失败。

实际上这个错误并不影响应用的正常运行。

解决方案：

很简单，关闭VPN即可，Next的谷歌字体需要在线加载但是对代理不友好，导致的结果