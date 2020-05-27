# Set、Map、WeakSet 和 WeakMap

## set

在MDN中

> Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。
>
> Set对象是值的集合，你可以按照插入的顺序迭代它的元素。 Set中的元素只会出现一次，即 Set 中的元素是唯一的。

Set类似于数组，本身是一个构造函数，用来生成 Set 数据结构，成员值都是唯一的，常用于数组去重。

因为 Set 中的值总是唯一的，所以需要判断两个值是否相等。在ECMAScript规范的早期版本中，这不是基于和===操作符中使用的算法相同的算法。

```javascript
let b =  new Set();
b.add({val:1})
b.add({val:1})
//  输出 Set(2) [{val:1}, {val:1}]
let a = {val:2};
b.add(a)
b.add(a)
// 输出 Set(3) [{val:1}, {val:1},{val:2}]
```

也就是说明并不能判断对象是否重复,只能判断对象是否是同一个引用而去重的

另外，NaN和undefined都可以被存储在Set 中， NaN之间被视为相同的值（NaN被认为是相同的，尽管 NaN !== NaN）。

### 属性

```javascript
b.size;// 3
```

### 方法

- add() 添加值，返回 Set 结构本身。
- delete() 删除值，返回一个布尔值，表示删除是否成功。
- has() 返回一个布尔值，表示该值是否为Set的成员。
- clear() 清除所有成员，没有返回值。

可以遍历

- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

可以通过`Array.from`和`...`展开操作符转化为数组

```javascript
let b =  new Set([1,2,2,3,2,4]);
Array.from(b) // [1,2,3,4]
[...b] // [1,2,3,4]
```

对于string

```javascript
let text = 'India';

let mySet = new Set(text);  // Set {'I', 'n', 'd', 'i', 'a'}
mySet.size;  // 5
```

## weakSet

在 MDN 的描述，对其的特点的描述主要有两点。

> 它和 Set 对象的区别有两点:
>
> 1.WeakSet 对象中只能存放对象引用, 不能存放值, 而 Set 对象都可以.
>
> 2.WeakSet 对象中存储的对象值都是被弱引用的, 如果没有其他的变量或属性引用这个对象值, 则这个对象值会被当成垃圾回收掉. 正因为这样, WeakSet 对象是无法被枚举的, 没有办法拿到它包含的所有元素

对于第二点的解释

- 对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

- WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失，所以WeakSet 的成员是不适合引用的。

- 由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

### 方法

- add(value) 在该 WeakSet 对象中添加一个新元素value.
- clear() 清空该 WeakSet 对象中的所有元素.
- delete(value) 从该 WeakSet 对象中删除value 这个元素, 之后 WeakSet.prototype.has(value) 方法便会返回false.
- has(value) 返回一个布尔值, 表示给定的值value是否存在于这个 WeakSet中

那它到底做什么用呢？在 Stack Overflow 上看到下面一段代码

```javascript
const requests = new WeakSet();
class ApiRequest {
  constructor() {
    requests.add(this);
  }
  makeRequest() {
    if(!request.has(this)) throw new Error("Invalid access");
    // do work
  }
}
```

在这里利用集合`requests`来管理所有的`ApiRequest`实例，

在`makeRequest`中判断了调用`makeRequest`的是否是`ApiRequest`的一个实例，

当`ApiRequest`的一个实例销毁后，会被当成垃圾回收掉

如果不使用`WeakSet`，使用`set`会造成内存泄露

## map

MDN中

> Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。
>
>一个Map对象在迭代时会根据对象中元素的插入顺序来进行 — 一个  for...of 循环在每次迭代后会返回一个形式为[key，value]的数组。

由于Object只能使用字符串或者 Symbols作为key，在使用上面会有很大的限制，比如使用DOM节点作为key时，就会被自动转为字符串[object HTMLDivElement]。

为了解决上述问题，ES6 引入了 Map ，它类似于对象，也是键值对的集合，但是其key的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

NaN 是与 NaN 相等的（虽然 NaN !== NaN），剩下所有其它的值是根据 === 运算符的结果判断是否相等。

### 与object的区别

- 一个Object的键只能是字符串或者 Symbols，但一个 Map 的键可以是任意值，包括函数、对象、基本类型。
- Map 中的键值是有序的，而添加到对象中的键则不是。因此，当对它进行遍历时，Map 对象是按插入的顺序返回键值。

```javascript
var a = {}
a[1] = 1
a[10] = 10
a[2] = 2
Object.keys(a); //["1", "2", "10"]

var b = new Map()
b.set(1,1)
b.set(10,10)
b.set(2,2)
b.keys();//MapIterator {1, 10, 2}
```

- 获取键值对的个数，可以通过`map.size`,而 `Object`只能手动计算

- Map可使用`for...of`直接迭代，Object需要声明变量记录key进行迭代

- Object 都有自己的原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。

- Map 在涉及频繁增删键值对的场景下会有些性能优势。

### 方法

- size
- set(k,v)
- get(K)
- has(k)
- delete(k)
- clear()
- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历 Map 的所有成员。

Map对象间可以进行合并，但是会保持键的唯一性。

```javascript
let first = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let second = new Map([
  [1, 'uno'],
  [2, 'dos']
]);

// 合并两个Map对象时，如果有重复的键值，则后面的会覆盖前面的。
// 展开运算符本质上是将Map对象转换成数组。
let merged = new Map([...first, ...second]);

console.log(merged.get(1)); // uno
console.log(merged.get(2)); // dos
console.log(merged.get(3)); // three
```

注意,虽然map可以像对象的方式设置属性，但是会有问题

```javascript
let wrongMap = new Map()
wrongMap['bla'] = 'blaa'
wrongMap['bla2'] = 'blaaa2'

console.log(wrongMap)  // Map { bla: 'blaa', bla2: 'blaaa2' }
wrongMap.has('bla')    // false
wrongMap.delete('bla') // false
console.log(wrongMap)  // Map { bla: 'blaa', bla2: 'blaaa2' }
```

## WeakMap

- WeakMap 的 key 只能是 Object 类型。
- WeakMap的键名所指向的对象，不计入垃圾回收机制
- WeakMap的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内
- 没有遍历方法，即没有keys()、values()和entries()方法
- 没有size属性、clear()方法
- WeakMap只有四个方法可用：get()、set()、has()、delete()

一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。
