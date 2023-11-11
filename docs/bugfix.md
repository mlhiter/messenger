### 1，SyntaxError: Unexpected end of JSON input

dateTime：2023.11.11 22:52

登录的时候发生，导致无法正常登录。

报错还有：TypeError: "ikm" must be at least one byte in length

解决方案：

我没有设置NEXTAUTH_SECRET，设置方法：

```sh
openssl rand -base64 32
```

将生成的密钥填入env中的NEXTAUTH_SECRET中。

当然，你随便输入一个字符串都可以，但是不能啥都不输入。

