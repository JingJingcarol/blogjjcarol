# http的缓存

## 强缓存与弱缓存

缓存可以简单的划分成两种类型：强缓存（200 from cache）与协商缓存（304）

区别简述如下：

- 强缓存（200 from cache）时，浏览器如果判断本地缓存未过期，就直接使用，无需发起http请求
- 协商缓存（304）时，浏览器会向服务端发起http请求，然后服务端告诉浏览器文件未改变，让浏览器使用本地缓存
- 对于协商缓存，使用Ctrl + F5强制刷新可以使得缓存无效

但是对于强缓存，在未过期时，必须更新资源路径才能发起新的请求

## 缓存头部

### 属于强缓存控制的：

```
（http1.1）Cache-Control/Max-Age
（http1.0）Pragma/Expires
```

### 属于协商缓存控制的：

```
（http1.1）If-None-Match/E-tag
（http1.0）If-Modified-Since/Last-Modified
```

其实HTML页面中也有一个meta标签可以控制缓存方案

```html
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
```
支持情况不佳

### http1.0中的缓存控制：

- `Pragma`：严格来说，它不属于专门的缓存控制头部，但是它设置`no-cache`时可以让本地强缓存失效（属于编译控制，来实现特定的指令，主要是因为兼容http1.0，所以以前又被大量应用）
- `Expires`：服务端配置的，属于强缓存，用来控制在规定的时间之前，浏览器不会发出请求，而是直接使用本地缓存，注意，`Expires`一般对应服务器端时间，如`Expires：Fri, 30 Oct 1998 14:19:41`
- `If-Modified-Since/Last-Modified`：这两个是成对出现的，属于协商缓存的内容，其中浏览器的头部是`If-Modified-Since`，而服务端的是`Last-Modified`，它的作用是，在发起请求时，如果`If-Modified-Since`和`Last-Modified`匹配，那么代表服务器资源并未改变，因此服务端不会返回资源实体，而是只返回头部，通知浏览器可以使用本地缓存。`Last-Modified`，顾名思义，指的是文件最后的修改时间，而且只能精确到1s以内

### http1.1中的缓存控制：

- `Cache-Control`：缓存控制头部，有`no-cache`、`max-age`等多种取值
- `Max-Age`：服务端配置的，用来控制强缓存，在规定的时间之内，浏览器无需发出请求，直接使用本地缓存，注意，`Max-Age`是`Cache-Control`头部的值，不是独立的头部，譬如`Cache-Control: max-age=3600`，而且它值得是绝对时间，由浏览器自己计算
- `If-None-Match/E-tag`：这两个是成对出现的，属于协商缓存的内容，其中浏览器的头部是`If-None-Match`，而服务端的是`E-tag`，同样，发出请求后，如果`If-None-Match`和`E-tag`匹配，则代表内容未变，通知浏览器使用本地缓存，和`Last-Modified`不同，`E-tag`更精确，它是类似于指纹一样的东西，基于`FileEtag INode Mtime Size`生成，也就是说，只要文件变，指纹就会变，而且没有1s精确度的限制。

### Max-Age相比Expires

- `Expires`使用的是服务器端的时间

但是有时候会有这样一种情况-客户端时间和服务端不同步

那这样，可能就会出问题了，造成了浏览器本地的缓存无用或者一直无法过期

所以一般`http1.1`后不推荐使用`Expires`

- 而`Max-Age`使用的是客户端本地时间的计算，因此不会有这个问题

因此推荐使用`Max-Age`。

注意，如果同时启用了`Cache-Control`与`Expires`，`Cache-Control`优先级高。

### E-tag相比Last-Modified

`Last-Modified`：

- 表明服务端的文件最后何时改变的
- 它有一个缺陷就是只能精确到1s，
- 然后还有一个问题就是有的服务端的文件会周期性的改变，导致缓存失效

而`E-tag`：

- 是一种指纹机制，代表文件相关指纹
- 只有文件变才会变，也只要文件变就会变，
- 也没有精确时间的限制，只要文件一遍，立马`E-tag`就不一样了

如果同时带有`E-tag`和`Last-Modified`，服务端会优先检查`E-tag`