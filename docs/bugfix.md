1. ```css
   html,
   body,
   :root {
     height: 100%;
   }
   ```

   问：作用是什么？为什么html也要设置？

   答：

   这个CSS的作用是**设置:root高度为浏览器高度**。

   首先我们知道如果不设置width浏览器会自动为元素设置为整个浏览器的长度，但是对于高度，浏览器并不会设置。

   其次设置百分比高度的方式必须建立在**父元素也设置height并且不为auto的形式。**

   再就是这里为什么设置html的height也为100%，原因是如果不设置的话body设置100%没效果，仍然是0；网络上给出的思路是**html如果不设置默认高度是0**，必须设置为100%或者其他固定值，比如100vh(其实和100%一样)。

   这样设置的**作用是**为了保证整个项目的页面大小是整个浏览器视口大小，对其设置背景色之类的不会出现割裂感，而且也符合大家直觉（项目是在浏览器这整张白纸上工作的）

2. min-height、max-height之类的CSS的用处是什么？他们和height的区别是什么？

   结合上一个问题，这里也说一下height和min-height的区别。

   - height：给元素指定高度、一旦元素的内容超出这个高度就会**溢出**
   - min-height：给元素设置最小高度，当内容少的时候（子元素高度没有超过这个min-height时）元素就是这个最小高度；当内容超出这个最小高度的时候元素高度会自适应内容，不会出现内容溢出的情况

   相应的，max-height就是给元素设置最大高度，当元素内容少的时候，元素会是内容的高度，当元素内容高度超过max-height时，高度仍然是max-height，并不会增大

   优先级：**min-height>max-height（当出现min-height大于max-height这种情况时）**

   详细地说：

   - 当height和max-height一起使用：谁小听谁的
   - 当height和min-height一起使用：谁大听谁的
   - 当height、min-height、max-height一起使用：
     - height>max-height>min-height：选max-height
     - height>min-height>max-height：选min-height（这里就用到优先级）
     - min-height>height>max-height：选min-height

3. 关于媒体查询@media

   作用：针对不同的屏幕尺寸设置不同的样式

4. inline-flex和flex的区别

   一句话，当flex容器没有设置大小限制时，指定为flex时flexbox的宽度会填充父元素，指定为inline-flex的flexbox会包裹项目，并不会填满父元素