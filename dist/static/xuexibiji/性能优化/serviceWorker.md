# service worker

javaScript 是单线程的，随着web业务的复杂化，开发者逐渐在js中做了许多耗费资源的运算过程，这使得单线程的弊端更加凹显。web worker正是基于此被创造出来，它是脱离在主线程之外的，我们可以将复杂耗费时间的事情交给web worker来做。但是web worker作为一个独立的线程，他的功能应当不仅于此。Service Worker便是在web worker的基础上增加了离线缓存的能力。

它和 Web Worker 相比，有相同的点，也有不同的地方。

相同：

- Service Worker 工作在 worker context 中，是没有访问 DOM 的权限的，所以我们无法在 Service Worker 中获取 DOM 节点，也无法在其中操作 DOM 元素；
- 我们可以通过 postMessage 接口把数据传递给其他 JS 文件；
- Service Worker 中运行的代码不会被阻塞，也不会阻塞其他页面的 JS 文件中的代码；

不同的地方在于，Service Worker 是一个浏览器中的进程而不是浏览器内核下的线程，因此它在被注册安装之后，能够被在多个页面中使用，也不会因为页面的关闭而被销毁。因此，Service Worker 很适合被用与多个页面需要使用的复杂数据的计算——购买一次，全家“收益”。

sw最重要的工作原理就是

- 后台线程：独立于当前网页线程；
- 网络代理：在网页发起请求时代理，来缓存文件；

## 基本特征

- 完全异步，无法使用XHR和localStorage
- 一旦被 install，就永远存在，除非被 uninstall或者dev模式手动删除
- 是由事件驱动的,具有生命周期
- 可以拦截处理页面的所有网络请求(fetch)，可以访问cache和indexDB
- 支持推送
- 并且可以让开发者自己控制管理缓存的内容以及版本，为离线弱网环境下的 web 的运行提供了可能
- Service Worker生命周期的反应： installing → installed → activating → activated 'install'用来缓存文件，'activate'用来缓存更新
- sw 是基于 HTTPS 的，因为service worker中涉及到请求拦截，所以必须使用HTTPS协议来保障安全。如果是本地调试的话，localhost是可以的。
- Service Worker 的缓存机制是依赖 Cache API 实现的
- Service worker 广泛使用了 promise。
- Service worker依赖 HTML5 fetch API
- Service worker 在不使用时将被终止，并会在需要的时候重新启动，因此你不能把onfetch 和 onmessage事件来作为全局依赖处理程序。
- google官方也推荐大家使用workbox

## 使用

### 注册

要使用Service worker，首先需要注册一个sw，通知浏览器为该页面分配一块内存，然后sw就会进入安装阶段。

Service Worker 的注册方法返回的是一个 Promise

```javascript
if('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        //页面加载完以后sw
        navigator.serviceWorker.register('./sw.js').then(function (reg) {
            console.log('success', reg);
            if (reg.waiting) {
                // 通知提示栏显示
                return;
            }
            // 每当Registration.Installing属性获取新的sw时都会调用该方法
            reg.onupdatefound = function () {
                const installingWorker = reg.installing;
                //
                installingWorker.onstatechange = function () {
                  switch (installingWorker.state) {
                    case 'installed':
                      // 应为在sw第一次安装的时候也会调用onupdatefound，所以要检查是否已经被sw控制
                      if (navigator.serviceWorker.controller) {
                        // 通知提示栏显示
                      }
                      break;
                  }
                };
             };
        })
        .catch(function (err) {
            console.log('fail', err);
        });

    })
}
```

### installing

```javascript
//sw.js
var CACHE_PREFIX = 'cms-sw-cache';
var CACHE_VERSION = '0.0.20';
var CACHE_NAME = CACHE_PREFIX+'-'+CACHE_VERSION;
//service worker安装成功后开始缓存所需的资源
var allAssets = [
    './main.css'
];
self.addEventListener('install', function(event) {
    self.skipWaiting();
    //这里就是一个串行的异步加载，当所有加载都成功时，那么 SW 就可以下一步。
    //caches.open 是用来打开指定的缓存
    //event.waitUntil监听函数内所有的promise,只要有一个promise的结果是reject，那么这次安装就会失败。
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW]: Opened cache');
                return cache.addAll(allAssets);
            })
    );
})
```

### activated

Service Worker 在安装完成后会被激活，所以我们也可监听 activate 事件。

sw进行更新时

首先老的sw为A，新的sw版本为B。
B进入install阶段，而A还处于工作状态，所以B进入waiting阶段。只有等到A被terminated后，B才能正常替换A的工作。

这个terminated的时机有如下几种方式：

- 关闭浏览器一段时间；
- 手动清除serviceworker；
- 在sw安装时直接跳过waiting阶段

如果当前页面已经存在service worker进程，那么就需要等待页面下一次被打开时新的sw才会被激活，或者使用 self.skipWaiting() 跳过等待。

在activate中通常我们要检查并删除旧缓存，如果事件里有 event.waitUntil() 则会等待这个 Promise 完成才会成功。这时可以调用 Clients.claim() 接管所有页面，注意这会导致新版的sw接管旧版本页面。

```javascript
self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return cacheNames.filter(cacheName => CACHE_NAME !== cacheName);

    }).then(cachesToDelete => {

      return Promise.all(cachesToDelete.map(cacheToDelete => {

        return caches.delete(cacheToDelete);

      }));

    }).then(() => {

      // 立即接管所有页面

      self.clients.claim()

    })

  );

});
```

### fetch

用于拦截代理所有指定的请求，并进行对应的操作。

```javascript
//监听浏览器的所有fetch请求，对已经缓存的资源使用本地缓存回复
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                //该fetch请求已经缓存
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
```

event.respondWith： 接收的是一个 promise 参数，把其结果返回到受控制的 client 中，内容可以是任何自定义的响应生成代码。

默认发起的fetch好像不会携带cookie，需要设置{ credential: 'include' }

对于跨域的资源，需要设置 { mode: 'cors' } ，否则 response 中拿不到对应的数据

`sw-toolbox`，通常有如下几种缓存策略：

- networkFirst：首先尝试通过网络来处理请求，如果成功就将响应存储在缓存中，否则返回缓存中的资源来回应请求。它适用于以下类型的API请求，即你总是希望返回的数据是最新的，但是如果无法获取最新数据，则返回一个可用的旧数据。

- cacheFirst：如果缓存中存在与网络请求相匹配的资源，则返回相应资源，否则尝试从网络获取资源。 同时，如果网络请求成功则更新缓存。此选项适用于那些不常发生变化的资源，或者有其它更新机制的资源。

- fastest：从缓存和网络并行请求资源，并以首先返回的数据作为响应，通常这意味着缓存版本则优先响应。一方面，这个策略总会产生网络请求，即使资源已经被缓存了。另一方面，当网络请求完成时，现有缓存将被更新，从而使得下次读取的缓存将是最新的。

- cacheOnly：从缓存中解析请求，如果没有对应缓存则请求失败。此选项适用于需要保证不会发出网络请求的情况，例如在移动设备上节省电量。

- networkOnly：尝试从网络获取网址来处理请求。如果获取资源失败，则请求失败，这基本上与不使用service worker的效果相同。

### 更新

用户首次访问sw控制的网站或页面时，sw会立刻被下载。

之后至少每24小时它会被下载一次。它可能被更频繁地下载，不过每24小时一定会被下载一次，以避免不良脚本长时间生效，这个是浏览器自己的行为。

我们可以在注册sw的地方监听 controllerchange 事件来得知控制当前页面的sw是否发生了改变，然后刷新站点，让自己从头到尾都被新的sw控制，就能避免sw新旧交替的问题了

```javascript
navigator.serviceWorker.addEventListener('controllerchange', () => {
    //但是sw的变更就发生在加载页面后的几秒内，用户刚打开站点就遇上了莫名的刷新，
  window.location.reload();

})
```

### 向等待中的sw发送消息

```javascript
navigator.serviceWorker.getRegistration().then(reg => {
    reg.waiting.postMessage('skipWaiting');
});

```

### sw接收到消息

```javascript
//sw.js
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    //todo
  }
})

```
