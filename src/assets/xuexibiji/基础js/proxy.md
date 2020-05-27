# Object.defineProperty 与 proxy

经常用来做数据劫持

数据劫持:在访问或者修改对象的某个属性时，通过一段代码拦截这个行为，进行额外的操作或者修改返回结果.数据劫持最典型的应用------双向的数据绑定(一个常用的面试题),

Vue 2.x 利用 Object.defineProperty()，并且把内部解耦为 Observer, Dep, 并使用 Watcher 相连
Vue 在 3.x 版本之后改用 Proxy 进行实现

## Object.definePropert

MDN中

> Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

`Object.defineProperty(obj, prop, descriptor)`

该方法允许精确地添加或修改对象的属性。通过赋值操作添加的普通属性是可枚举的，在枚举对象属性时会被枚举到（for...in 或 Object.keys 方法），可以改变这些属性的值，也可以删除这些属性。这个方法允许修改默认的额外选项（或配置）。默认情况下，使用 Object.defineProperty() 添加的属性值是不可修改（immutable）的。

对象里目前存在的属性描述符

键值 | 数据描述符 | 存取描述符 | 默认值 | 描述
-- | -- | -- | -- | --
configurable | ✅ | ✅ | false | 当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
enumerable | ✅ | ✅ | false | 当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
value | ✅ | ❌ | undefined | 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
writable |  ✅ | ❌ | false | 当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。
get | ❌ |  ✅ | undefined | 属性的 getter 函数，当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
set | ❌ |  ✅ | undefined | 属性的 setter 函数，当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。

```javascript
var o = {}; // 创建一个新对象

// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(o, "a", {
  value : 37,
  writable : true,
  enumerable : true,
  configurable : true
});

// 对象 o 拥有了属性 a，值为 37

// 在对象中添加一个设置了存取描述符属性的示例
var bValue;
Object.defineProperty(o, "b", {
  // 使用了方法名称缩写（ES2015 特性）
  // 下面两个缩写等价于：
  // get : function() { return bValue; },
  // set : function(newValue) { bValue = newValue; },
  get() { return bValue; },
  set(newValue) { bValue = newValue; },
  enumerable : true,
  configurable : true
});

o.b; // 38
// 对象 o 拥有了属性 b，值为 38
// 现在，除非重新定义 o.b，o.b 的值总是与 bValue 相同

// 数据描述符和存取描述符不能混合使用
Object.defineProperty(o, "conflict", {
  value: 0x9f91102,
  get() { return 0xdeadbeef; }
});
// 抛出错误 TypeError: value appears only in data descriptors, get appears only in accessor descriptors
```

### 问题

- 不能监听数组的变化
  - push()
  - pop()
  - shift()
  - unshift()
  - splice()
  - sort()
  - reverse()
- 必须遍历对象的每个属性
- 必须深层遍历嵌套的对象

**优势：** 兼容性好，支持 IE9

## proxy

> Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

`var proxy = new Proxy(target, handler);`

特点

- 可以劫持整个对象，并返回一个新对象
- 有13种劫持操作
- Proxy是es6提供的，兼容性不好,无法用polyfill磨平
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改

```javascript
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35
```
