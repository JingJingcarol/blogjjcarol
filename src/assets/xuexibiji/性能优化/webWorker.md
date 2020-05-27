# web worker

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。

看到这样一个形象的比喻

> 就好比在一个餐厅，有一个厨师长，还有一堆帮厨，厨师长就好比主线程，帮厨就好比Web Worker，做一道菜，厨师长把控主要流程，分配给帮厨任务洗菜切丁，帮厨做事不会影响到厨师长干活，帮厨做完把结果递给厨师长，完成一道菜

**注意：**

- 同源限制
- DOM 限制 无法使用document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象。
- 通信联系
- 脚本限制 不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求
- 文件限制 不能打开本机的文件系统

它能操作的对象主要只包括

- 一个浏览器对象，只包含四个属性：appName,appVersion,userAgent,platform
- 一个location对象（和window里的一样，但是里面所有的属性是只读的）
- 一个self对象指向全局Web Worker线程对象
- 一个importScripts()方法使Web Worker能够加载外部js文件
- 所有的ECMAScript对象
- XMLHttpRequest构造器
- setTimeout()和setInterval()方法

## 使用

```javascript
//主线程
//生成 Worker 线程
var worker = new Worker('worker.js', { name : 'myWorker' });
//Worker.onerror：指定 error 事件的监听函数。
worker.onerror(function (event) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});
//Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在Event.data属性中。
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  doSomething();
}

function doSomething() {
  // 执行任务
  //Worker.postMessage()：向 Worker 线程发送消息。
  worker.postMessage('Work done!');
}
//Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
//立即终止 Worker 线程。
Worker.terminate()
```

```javascript
//worker.js
//self.name： Worker 的名字。该属性只读，由构造函数指定。
console.log(self.name);//myWorker
//self.onmessage：指定message事件的监听函数。
self.addEventListener('message', function (e) {
    // self.postMessage()：向产生这个 Worker 线程发送消息。
  self.postMessage('You said: ' + e.data);
}, false);
//self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
self.importScripts('script1.js')//加载 JS 脚本。它是以阻塞方法加载js的，只有所有文件加载完成之后接下来的脚本才能继续运行
self.close()//关闭 Worker 线程。

```
