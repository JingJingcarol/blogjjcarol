# get和post的区别

- post更安全（不会作为url的一部分，不会被缓存、保存在服务器日志、以及浏览器浏览记录中）

- post发送的数据更大（get有url长度限制）

- post能发送更多的数据类型（get只能发送ASCII字符）

- post比get慢

- post用于修改和写入数据，get一般用于搜索排序和筛选之类的操作（淘宝，支付宝的搜索查询都是get提交），目的是资源的获取，读取数据

## 为什么get比post更快

### post请求包含更多的请求头

  因为post需要在请求的body部分包含数据，所以会多了几个数据描述部分的首部字段（如：content-type）,这其实是微乎其微的。

#### post在真正接收数据之前会先将请求头发送给服务器进行确认，然后才真正发送数据

#### post请求的过程：

- 浏览器请求tcp连接（第一次握手）

- 服务器答应进行tcp连接（第二次握手）

- 浏览器确认，并发送post请求头（第三次握手，这个报文比较小，所以http会在此时进行第一次数据发送）

- 服务器返回100 Continue响应

- 浏览器发送数据

- 服务器返回200 OK响应

#### get请求的过程：

- 浏览器请求tcp连接（第一次握手）

- 服务器答应进行tcp连接（第二次握手）

- 浏览器确认，并发送get请求头和数据（第三次握手，这个报文比较小，所以http会在此时进行第一次数据发送）

- 服务器返回200 OK响应

### get会将数据缓存起来，而post不会

### post不能进行管道化传输

管道通信的方式：把需要发送到服务器上的所有请求放到输出队列中，在第一个请求发送出去后，不等到收到服务器的应答，第二个请求紧接着就发送出去，但是这样的方式有一个问题：不安全，如果一个管道中有10个连接，在发送出9个后，突然服务器告诉你，连接关闭了，此时客户端即使收到了前9个请求的答复，也会将这9个请求的内容清空，也就是说，白忙活了……此时，客户端的这9个请求需要重新发送。

## get传参最大长度
- http协议并未规定get和post的长度限制

- get的最大长度限制是因为浏览器和web服务器限制了URL的长度

- 不同的浏览器和web服务器，限制的最大长度不一样

- 要支持IE，则最大长度为2083byte，若支持Chrome，则最大长度8182byte

- get有长度限制，也是限制的整个URL的长度
- 如果超出了最大长度，大部分的服务器直接截断，也有一些服务器会报414错误。

### 各个浏览器和web服务器的最大长度总结

#### 浏览器

- IE：IE浏览器（Microsoft Internet Explorer） 对url长度限制是2083（2K+53），超过这个限制，则自动截断（若是form提交则提交按钮不起作用）。

- firefox：firefox（火狐浏览器）的url长度限制为 65536字符，但实际上有效的URL最大长度不少于100,000个字符。

- chrome：chrome（谷歌）的url长度限制超过8182个字符返回本文开头时列出的错误。

- Safari：Safari的url长度限制至少为 80 000 字符。

- Opera：Opera 浏览器的url长度限制为190 000 字符。Opera9 地址栏中输入190000字符时依然能正常编辑。

#### 服务器

- Apache：Apache能接受url长度限制为8 192 字符

- IIS：Microsoft Internet Information Server(IIS)能接受url长度限制为16384个字符。这个是可以通过修改的（IIS7）
```xml
configuration/system.webServer/security/requestFiltering/requestLimits@maxQueryStringsetting.<requestLimitsmaxQueryString="length"/>
```
- Perl HTTP::Daemon

Perl HTTP::Daemon 至少可以接受url长度限制为8000字符。PerlHTTP::Daemon中限制HTTP request headers的总长度不超过16 384字节(不包括post,fileuploads等)。但当url超过8000字符时会返回413错误。这个限制可以被修改，在Daemon.pm查找16×1024并更改成更大的值。

- ngnix：可以通过修改配置来改变url请求串的url长度限制。
```
client_header_buffer_size 默认值：client_header_buffer_size1k

large_client_header_buffers默认值 ：large_client_header_buffers 4 4k/8k
```

