# FP，FCP，FMP

- FP (First Paint) 首次绘制: 标记浏览器渲染任何在视觉上不同于导航前屏幕内容之内容的时间点.
- FCP (First Contentful Paint) 首次内容绘制 标记浏览器渲染来自 DOM 第一位内容的时间点，该内容可能是文本、图像、SVG 甚至 元素.
- LCP (Largest Contentful Paint) 最大内容渲染: 代表在viewport中最大的页面元素加载的时间. LCP的数据会通过PerformanceEntry对象记录, 每次出现更大的内容渲染, 则会产生一个新的PerformanceEntry对象.(2019年11月新增)
- DCL (DomContentloaded): 当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，无需等待样式表、图像和子框架的完成加载.
- FMP(First Meaningful Paint) 首次有效绘制
- L (onLoad), 当依赖的资源, 全部加载完毕之后才会触发.
- TTI (Time to Interactive) 可交互时间: 指标用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点.
- TBT (Total Blocking Time) 页面阻塞总时长: TBT汇总所有加载过程中阻塞用户操作的时长，在FCP和TTI之间任何long task中阻塞部分都会被汇总.
- FID (First Input Delay) 首次输入延迟: 指标衡量的是从用户首次与您的网站进行交互（即当他们单击链接，点击按钮等）到浏览器实际能够访问之间的时间
- CLS (Cumulative Layout Shift) 累积布局偏移: 总结起来就是一个元素初始时和其hidden之间的任何时间如果元素偏移了, 则会被计算进去
- SI (Speed Index): 指标用于显示页面可见部分的显示速度, 单位是时间,

## 首屏白屏

- 等待 HTML 文档返回，此时处于白屏状态。
- 对 HTML 文档解析完成后进行首屏渲染，SPA下html中可能仅存在`<div id="app"></div>`。
- 进行文件加载、JS 解析等过程，导致界面长时间出于灰屏中。
- 客户端渲染执行js，界面显示出大体框架。
- 调用 API 获取到时机业务数据后才能展示出最终的页面内容。

导致用户会长时间出于不可交互的首屏灰白屏状态，从而给用户一种网页很“慢”的感觉

- 57%的用户更在乎网页在3秒内是否完成加载。
- 52%的在线用户认为网页打开速度影响到他们对网站的忠实度。
- 每慢1秒造成页面 PV 降低11%，用户满意度也随之降低降低16%。
- 近半数移动用户因为在10秒内仍未打开页面从而放弃。

## 如何优化

- 将 FCP 或 FMP 完整的 HTML 文档提前到 FP 时机预渲染
- 骨架图
- SSR
- 离线化
- 前端缓存 quicklink
- 分块加载

## 进行「相对准确」的计算 FMP

- 主动上报：开发者在相应页面的「Meaning」位置上报时间
- 权重计算：根据页面元素，计算权重最高的元素渲染时间
  - DOM 节点进行阶段性标记，监听 DOM 变化 `MutationObserver`
    - `disconnect()` 阻止 MutationObserver 实例继续接收的通知，直到再次调用其observe()方法，该观察者对象包含的回调函数都不会再被调用。
    - `observe()`配置MutationObserver在DOM更改匹配给定选项时，通过其回调函数开始接收通知。
    - `takeRecords()`从MutationObserver的通知队列中删除所有待处理的通知，并将它们返回到MutationRecord对象的新Array中。

    ```javascript
    global.mo = new MutationObserver(() => {
        /* callback: DOM 节点设置阶段性标记 */
        global.timeStack[++_ti] = performance.now(); // 记时间
        doTag(_ti); // 打标记
    });

    /**
    * mutationObserver.observe(target[, options])
    * target - 需要观察变化的 DOM Node。
    * options - MutationObserverInit 对象，配置需要观察的变化项。
    * 更多 options 的介绍请参考 https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserverInit#%E5%B1%9E%E6%80%A7
    **/
    global.mo.observe(document, {
      childList: true,  // 监听子节点变化（如果subtree为true，则包含子孙节点）
      subtree: true // 整个子树的所有节点
    });
    ```

  - Mutation Observer 有以下特点
    - 它等待所有脚本任务完成后，才会运行（即异步触发方式）。
    - 它把 DOM 变动记录封装成一个数组进行处理，而不是一条条个别处理 DOM 变动。
    - 它既可以观察 DOM 的所有类型变动，也可以指定只观察某一类变动。
  - 一般来说 - 视图占比越大的元素越有可能是主角元素 - 视频比图片更可能是主角元素 - svg 和 canvas 也很重要 - 其他元素都可以按普通 dom 计算了 - 背景图片视情况而定，可记可不记
  - 不同的元素获取时间的方式并不相同
    - 普通元素：按标记点时间计算
    - 图片和视频：按资源相应结束时间计算
    - 带背景元素：可以以背景资源相应结束时间计算，也可以按普通元素计算

- 趋势计算：在 render 期间，根据 dom 的变化趋势推算 FMP 值
