# WebSocket

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

HTTP 协议有一个缺陷：通信只能由客户端发起。

Websocket是一个持久化的协议，相对于HTTP这种非持久的协议来说

## 与轮询和长连接对比

ajax轮询

> 客户端：啦啦啦，有没有新信息(Request)
>
> 服务端：没有（Response）
>
> 客户端：啦啦啦，有没有新信息(Request)
>
> 服务端：没有。。（Response）
>
> 客户端：啦啦啦，有没有新信息(Request)
>
> 服务端：你好烦啊，没有啊。。（Response）
>
> 客户端：啦啦啦，有没有新消息（Request）
>
> 服务端：好啦好啦，有啦给你。（Response）
>
> 客户端：啦啦啦，有没有新消息（Request）
>
> 服务端：。。。。。没。。。。没。。。没有（Response） —- loop

长连接

> 客户端：啦啦啦，有没有新信息，没有的话就等有了才返回给我吧（Request）
>
> 服务端：额。。 等待到有消息的时候。。来 给你（Response）
>
> 客户端：啦啦啦，有没有新信息，没有的话就等有了才返回给我吧（Request） -loop

websocket

> 客户端：啦啦啦，我要建立Websocket协议，需要的服务：chat，Websocket协议版本：17（HTTP Request）
>
> 服务端：ok，确认，已升级为Websocket协议（HTTP Protocols Switched）
>
> 客户端：麻烦你有信息的时候推送给我噢。。
>
> 服务端：ok，有的时候会告诉你的。
>
> 服务端：balabalabalabala
>
> 服务端：balabalabalabala
>
> 服务端：哈哈哈哈哈啊哈哈哈哈
>
> 服务端：笑死我了哈哈哈哈哈哈哈

## 使用

浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。

当你获取 Web Socket 连接后，你可以通过 send() 方法来向服务器发送数据，并通过 onmessage 事件来接收服务器返回的数据。

```javascript
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) {
  console.log("Connection open ...");
  ws.send("Hello WebSockets!");
  //实例对象的bufferedAmount属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。
  if (ws.bufferedAmount === 0) {
    // 发送完毕
    } else {
    // 发送还没结束
    }
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  //服务器数据可能是文本，也可能是二进制数据（blob对象或Arraybuffer对象）。
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};

ws.onerror = function(event) {
  // handle error event
};
switch (ws.readyState) {
  case WebSocket.CONNECTING:
    // do something 表示正在连接
    break;
  case WebSocket.OPEN:
    // do something 表示连接成功，可以通信了。
    break;
  case WebSocket.CLOSING:
    // do something 表示连接正在关闭。
    break;
  case WebSocket.CLOSED:
    // do something 表示连接已经关闭，或者打开连接失败。
    break;
  default:
    // this never happens
    break;
}
```

一个典型的Websocket握手请求如下：

客户端请求

```
GET / HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Host: example.com
Origin: http://example.com
Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
Sec-WebSocket-Version: 13
```

服务器回应

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Location: ws://example.com/
```
