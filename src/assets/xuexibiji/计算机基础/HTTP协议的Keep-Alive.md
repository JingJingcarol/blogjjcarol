# HTTP协议的Keep-Alive

在 请求头部和响应头部都有一个 `Connection: Keep-Alive`

这个键值对的作用是让HTTP保持连接状态，因为HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求/应答客户和服务器都要新建一个连接，完成之后立即断开连接（HTTP 协议为无连接的协议）；当使用 Keep-Alive 模式时，Keep-Alive 功能使客户端到服务器端的连接持续有效。

在HTTP 1.1版本后，默认都开启Keep-Alive模式，只有加入加入 Connection: close才关闭连接，当然也可以设置Keep-Alive模式的属性，例如 Keep-Alive: timeout=5, max=100，表示这个TCP通道可以保持5秒，max=100，表示这个长连接最多接收100次请求就断开。

- client发出的HTTP请求头需要增加Connection:keep-alive字段
- Web-Server端要能识别Connection:keep-alive字段，并且在http的response里指定Connection:keep-alive字段，告诉client，我能提供keep-alive服务，并且"应允"client我暂时不会关闭socket连接

## Keep-Alive模式下如何知道某一次数据传输结束

- 如果是静态的响应数据，可以通过判断响应头部中的Content-Length 字段，判断数据达到这个大小就知道数据传输结束了。

- 但是返回的数据是动态变化的，服务器不能第一时间知道数据长度，这样就没有 Content-Length 关键字了。这种情况下，服务器是分块传输数据的，Transfer-Encoding：chunk，这时候就要根据传输的数据块chunk来判断，数据传输结束的时候，最后的一个数据块chunk的长度是0。

## Nginx keep-alive配置

- keepalive_timeout
```
    Syntax: keepalive_timeout timeout [header_timeout]; // timeout服务器端保持与客户端连接保持打开状态的超时时间，[header_timeout]响应头字段 Keep-Alive:timeout=time
    Default:    keepalive_timeout 75s;
    Context:    http, server, location
```

- keepalive_requests
```
    Syntax: keepalive_requests number; //请求的最大数量
    Default:    keepalive_requests 100;
    Context:    http, server, location
```

## TCP的Keep Alive

HTTP的Keep-Alive与TCP的Keep Alive，有些不同，两者意图不一样。前者主要是 TCP连接复用，避免简历过多的TCP连接。而TCP的Keep Alive的意图是在于保持TCP连接的存活，就是发送心跳包。隔一段时间给连接对端发送一个探测包，如果收到对方回应的 ACK，则认为连接还是存活的，在超过一定重试次数之后还是没有收到对方的回应，则丢弃该 TCP 连接。

### Nginx配置tcp keepalive

```
so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt] 
```
