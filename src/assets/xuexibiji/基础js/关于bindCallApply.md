# 关于bind、call、apply

bind，call，apply的作用都是用来改变this指向

## call

call方法，表示传入的对象参数调用call前面对象的方法，并且被调用的函数会被执行，call方法的参数是当前上下文的对象以及参数列表

`fun.call(thisArg, arg1, arg2, ...)`

call 核⼼:

- 将函数设为对象的属性
- 执⾏&删除这个函数
- 指定 this 到函数并传⼊给定参数执⾏函数
- 如果不传⼊入参数，默认指向为 window

使用场景

- Object.prototype.toString.call(arguments) 用来精确判断数据类型："[object Array]" 或者 "[object Object]"
- Array.slice.call(类数组) 或者 [].slice.call(类数组) 用来把类数组转为数组,其实这里就是让类数组使用一下不属于自己的方法slice

手动实现call方法

```javascript
Function.prototype.call2 = function(content = window) {
    content.fn = this;
    let args = [...arguments].slice(1);
    let result = content.fn(...args);
    delete content.fn;
    return result;
}
var foo = {
    value: 1
}
function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);

}
bar.call2(foo, 'black', '18') // black 18 1
```

## apply

与call不同的是，它传入的参数是对象和参数数组

`func.apply(thisArg, [argsArray])`

手动实现apply方法

```javascript
Function.prototype.apply2 = function(context = window) {
    context.fn = this
    let result;
    // 判断是否有第⼆个参数
    if(arguments[1]) {
        result = context.fn(...arguments[1])
    } else {
        result = context.fn()
    }
    delete context.fn()
    return result
}
```

使用技巧

```javascript
var arr=[1,10,5,8,3];
console.log(Math.max.apply(null, arr)); //10
```

其中Math.max函数的参数是以参数列表，如：Math.max(1,10,5,8,3)的形式传入的，因此我们没法直接把数组当做参数，但是apply方法可以将数组参数转换成列表参数传入，从而直接求数组的最大值。

## bind

MDN中
> 会创建⼀一个新函数。当这个新函数被调⽤用时，bind() 的第⼀一个参数将作为它运⾏行行时的 this，之 后的⼀一序列列参数将会在传递的实参前传⼊入作为它的参数。

bind和apply区别是apply会立刻执行，而bind只是起一个绑定执行上下文的作用。且apply和call是一次性传入参数，而bind可以分为多次传入。bind 是返回绑定this之后的函数，便于稍后调用；apply 、call 则是立即执行 。

使用示例

```javascript
var arr=[1,10,5,8,12];
var max=Math.max.bind(null,arr[0],arr[1],arr[2],arr[3])
console.log(max(arr[4])); //12
```

手动实现bind方法

```javascript
Function.prototype.bind2 = function(content) {
    if(typeof this != "function") {
        throw Error("not a function")
    }
    // 若没问参数类型则从这开始写
    let fn = this;
    let args = [...arguments].slice(1);
    let resFn = function() {
        return fn.apply(this instanceof resFn ? this : content,args.concat(...arguments) )
    }
    function tmp() {}
    tmp.prototype = this.prototype;
    resFn.prototype = new tmp();
    return resFn;
}
```
