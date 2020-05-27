# getComputedStyle

MDN中

> Window.getComputedStyle()方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。 私有的CSS属性值可以通过对象提供的API或通过简单地使用CSS属性名称进行索引来访问。

`let style = window.getComputedStyle(element, [pseudoElt]);`

## getComputedStyle与style的区别

- getComputedStyle方法是只读的，只能获取样式，不能设置；而element.style能读能写
- getComputedStyle方法获取的是最终应用在元素上的所有CSS属性对象（即使没有CSS代码，也会把默认的祖宗八代都显示出来）；而element.style只能获取元素style属性中的CSS样式。
- 返回的CSSStyleDeclaration对象将包含所有受支持的CSS属性长名称的活动值,

    getComputedStyle方法获取形如

    ```javascript
    CSSStyleDeclaration {0: "animation-delay", 1: "animation-direction"}
    ```

    可以使用getPropertyValue(propName)API或直接索引到对象

    style方法获取形如

    ```javascript
    CSSStyleDeclaration {alignContent: "", alignItems: ""}
    ```

## defaultView

MDN中，defaultView的描述

> 在浏览器中，该属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。

正常情况下，当前上下文的window等于当前document关联的window

当使用Firefox 3.6时，其frame中需要使用document.defaultView去获取window对象，才能使用其getComputedStyle方法。

## getComputedStyle与currentStyle

currentStyle是IE特有的，element.currentStyle返回的是元素当前应用的最终CSS属性值（包括外链CSS文件，页面中嵌入的`<style>`属性等）

不过，currentStyle属性貌似不支持伪类样式获取

## other

- getComputedStyle的返回值是 resolved values,  通常跟CSS2.1中的computed values是相同的值。 但对于一些旧的属性，比如width, height, padding 它们的值又为 used values。 最初, CSS2.0定义的计算值Computed values 就是属性的最终值。 但是CSS2.1 重新定义了 computed values 为布局前的值， used values布局后的值。 布局前与布局后的区别是， width 或者 height的 百分比可以代表元素的宽度，在布局后会被像素值替换.

- 在某些情况下，通过浏览器会特意返回不准确的值。 特别是在避免CSS 浏览历史泄露的安全问题， 比如，浏览者看过某个网站， 它的链接通常会变成蓝色带下划线的链接，通过判断链接的颜色（getComputedSytle(node, null).color) 是否为蓝色，就会泄露用户的浏览历史， 所以浏览器会特意返回不准确的值，保护用户隐私。

- 在CSS过渡期间，getComputedStyle返回Firefox中的原始属性值，但返回WebKit中的最终属性值。

- 在Firefox中，属性值为auto的会直接返回使用值，而不是auto。比如，你在设定了一个元素的css为height:30px; top: auto; bottom:0;它的父元素height:100px;，在请求top的计算样式时，Firefox会返回'70px' = 100px - 30px;。

- 注意，如果元素的背景色透明，那么getComputedStyle获取出来的就是透明的这个背景（因为透明本身也是有效的），而不会是父节点的背景。所以它不一定是最终显示的颜色。

- getComputedStyle会引起回流，因为它需要获取祖先节点的一些信息进行计算（譬如宽高等），所以用的时候慎用，回流会引起性能问题。
