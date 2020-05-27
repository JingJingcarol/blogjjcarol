# prefetch，preload，preconnect

## preload

当我们在 link 标签中使用 preload 时，它会提前请求资源。主要用于获取当前路由中使用的高优先级资源。

```html
<link rel="preload">
<!-- 如果你的预加载需要 CORS 的跨域请求，那么也要加上 crossorigin 的属性。 -->
```

Preload 与 prefetch 不同的地方就是它专注于当前的页面，并以高优先级加载资源，Prefetch 专注于下一个页面将要加载的资源并以低优先级加载。同时也要注意 preload 并不会阻塞 window 的 onload 事件。

使用 preload 指令的好处包括：

- 允许浏览器来设定资源加载的优先级因此可以允许前端开发者来优化指定资源的加载。
- 赋予浏览器决定资源类型的能力，因此它能分辨这个资源在以后是否可以重复利用。
- 浏览器可以通过指定 as 属性来决定这个请求是否符合 content security policy。
- 浏览器可以基于资源的类型（比如 image/webp）来发送适当的 accept 头。

preload 用 “as” 或者用 “type” 属性来表示他们请求资源的优先级（比如说 preload 使用 as="style" 属性将获得最高的优先级）。没有 “as” 属性的将被看作异步请求，“Early”意味着在所有未被预加载的图片请求之前被请求（“late”意味着之后）

没有用到的 preload 资源在 Chrome 的 console 里会在 onload 事件 3s 后发生警告。
在手机上，这相当于浪费了用户的流量，所以明确你要 preload 对象。

**【注意】** 不要 preload 所有东西！ 作为替代的，用 preload 来告诉浏览器一些本来不能被提早发现的资源，以便提早获取它们。你可以尽早加载图片、样式、字体和媒体资源。

## Prefetch

允许浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中。一旦一个页面加载完毕就会开始下载其他的资源，然后当用户点击了一个带有 prefetched 的连接，它将可以立刻从缓存中加载内容。有三种不同的 prefetch 的类型，link，DNS 和 prerendering

- **Link Prefetching：** 不要过早进行 prefetch，否则会降低你当前浏览的页面的加载速度

    ```html
    <link rel="prefetch" href="/uploads/images/pic.png">
    ```

- **DNS Prefetching** 允许浏览器在用户浏览页面时在后台运行 DNS 的解析,这也对需要重定向的资源很有用

    ```html
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//www.google-analytics.com">
    <link rel="dns-prefetch" href="//opensource.keycdn.com">
    <link rel="dns-prefetch" href="//cdn.domain.com">
    ```

    不过要注意的是 Chrome 已经在敲击地址栏的时候做了类似的事情
- **Prerendering**在后台渲染了整个页面，整个页面所有的资源。

    ```html
    <link rel="prerender" href="https://www.keycdn.com">
    ```

    要小心的使用 prerender，因为它将会加载很多资源并且可能造成带宽的浪费，尤其是在移动设备上。还要注意的是，你无法在 Chrome DevTools 中进行测试
- 除了多余的资源加载外，使用 prefetch 还有一切 额外的副作用
  - Web 统计将会收到影响而变大，尽管 Google 说已经限制了这个标签。看看这个关于页面分析将会被影响而在一次点击时产生两个 session 的 文章。
  - 由于可能从未访问的站点下载了更多的页面（尤其是隐匿下载正在变得更加先进和多样化），用户的安全将面临更多的风险。
  - 如果预取访问未经授权的内容，用户可能违反其网络或组织的可接受使用策略。
- 在 Chrome 中，如果用户从一个页面跳转到另一个页面，prefetch 发起的请求仍会进行不会中断。
- prefetch 的资源在网络堆栈中至少缓存 5 分钟，无论它是不是可以缓存的。

## Preconnect

允许浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析，TLS 协商，TCP 握手，

```html
<link href="https://cdn.domain.com" rel="preconnect" crossorigin>
```
