# this和对象原型

this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。

当一个函数被调用时，会创建一个活动记录(有时候也称为执行上下文)。这个记录会包含函数在哪里被调用(调用栈)、函数的调用方法、传入的参数等信息。this 就是记录的其中一个属性，会在函数执行的过程中用到。

## this绑定规则

- 默认绑定 独立函数调用
- 隐式绑定 调用位置是否有上下文对象，或者说是否被某个对象拥有或者包
含
- 显式绑定 使用函数的 call(..) 和 apply(..) 方法

    如果你传入了一个原始值(字符串类型、布尔类型或者数字类型)来当作 this 的绑定对 象，这个原始值会被转换成它的对象形式(也就是new String(..)、new Boolean(..)或者 new Number(..))。这通常被称为“装箱”。

- new

    使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。
    1. 创建(或者说构造)一个全新的对象。
    2. 这个新对象会被执行[[原型]]连接。
    3. 这个新对象会绑定到函数调用的this。
    4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象

bind(...)实现

```javascript
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") { // 与 ECMAScript 5 最接近的 // 内部 IsCallable 函数
            throw new TypeError(
                "Function.prototype.bind - what is trying " +
                "to be bound is not callable"
            );
        }
        var aArgs = Array.prototype.slice.call( arguments, 1 ),
            fToBind = this,
            fNOP = function(){},
            fBound = function(){
                return fToBind.apply(
                    (
                        this instanceof fNOP &&
                        oThis ? this : oThis
                    ),
                    aArgs.concat(Array.prototype.slice.call( arguments )
                );
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

```

**优先级：** new > 显式绑定 > 隐式绑定 > 默认绑定

## 例外

- 如果你把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值
在调用时会被忽略
  - 一种“更安全”的做法是传入一个空的非委托的对象
  - Object.create(null) 和 {} 很像，但是并不会创建 Object.prototype 这个委托，所以它比 {}“更空”
- “间接引用”
- 软绑定

    ```javascript
    if (!Function.prototype.softBind) {
      Function.prototype.softBind = function(obj) {
        var fn = this;
        // 捕获所有 curried 参数
        var curried = [].slice.call( arguments, 1 );
        var bound = function() {
          return fn.apply(
            (!this || this === (window || global)) ?
            obj : this
            curried.concat.apply( curried, arguments )
          ); };
        bound.prototype = Object.create( fn.prototype );
        return bound;
      };
    }
    function foo() {
      console.log("name: " + this.name);
    }
    var obj = { name: "obj" },
      obj2 = { name: "obj2" },
      obj3 = { name: "obj3" };
    var fooOBJ = foo.softBind( obj );
    fooOBJ(); // name: obj
    obj2.foo = foo.softBind(obj);
    obj2.foo(); // name: obj2 <---- 看!!!
    fooOBJ.call( obj3 ); // name: obj3 <---- 看!
    setTimeout( obj2.foo, 10 );
    // name: obj <---- 应用了软绑定
    ```

- 箭头函数,它用更常见的词法作用域取代了传统的 this 机制

  如果你经常编写 this 风格的代码，但是绝大部分时候都会使用 self = this 或者箭头函数 来否定 this 机制，那你或许应当:

  1. 只使用词法作用域并完全抛弃错误this风格的代码;
  2. 完全采用 this 风格，在必要时使用 bind(..)，尽量避免使用 self = this 和箭头函数

## 对象

对象可以通过两种形式定义:声明(文字)形式和构造形式。唯一的区别是，在文字声明中你可以添加多个 键 / 值对，但是在构造形式中你必须逐个添加属性。

- 当我们说“内容”时，似乎在暗示这些值实际上被存储在对象内部， 但是这只是它的表现形式。在引擎内部，这些值的存储方式是多种多样的，一般并不会存 在对象容器内部。存储在对象容器内部的是这些属性的名称，它们就像指针(从技术角度 来说就是引用)一样，指向这些值真正的存储位置。
- 在对象中，属性名永远都是字符串。如果你使用 string(字面量)以外的其他值作为属性名，那它首先会被转换为一个字符串。
- 函数永远不会“属于”一个对象,它只是对于函数对象的引用
- 可以给数组添加属性,但数组的 length 值并未发生变化。
- 由于 Object.assign(..) 就是使用 = 操作符来赋值，所 以源对象属性的一些特性(比如 writable)不会被复制到目标对象。
- Object.defineProperty 即便属性是 configurable:false，我们还是可以 把 writable 的状态由 true 改为 false，但是无法由 false 改为 true。
- 如果希望属性或者对象是不可改变(无论有意还是无意)的
  - 对象常量

    ```javascript
    var myObject = {};
    Object.defineProperty( myObject, "FAVORITE_NUMBER", {
      value: 42,
      writable: false,
      configurable: false
    } );
    ```

  - 禁止扩展

    ```javascript
    var myObject = { a:2};
    Object.preventExtensions( myObject );
    myObject.b = 3;
    myObject.b; // undefined
    ```

  - 密封 `Object.seal(..)` 密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性
  - 冻结 `Object.freeze(..)` 它会禁止对于对象本身及其任意直接属性的修改
- [[GET]]和 [[PUT]]
  - 如果已经存在这个属性,[[Put]] 算法大致会检查下面这些内容
    1. 属性是否是访问描述符? 如果是并且存在setter就调用setter。
    2. 属性的数据描述符中writable是否是false? 如果是，在非严格模式下静默失败，在
    严格模式下抛出 TypeError 异常。
    3. 如果都不是，将该值设置为属性的值。
- in 操作符会检查属性是否在对象及其 [[Prototype]] 原型链中。相比之下， hasOwnProperty(..) 只会检查属性是否在 myObject 对象中，不会检查 [[Prototype]] 链。
- 但是有的对象可能没有连接到 Object.prototype( 通 过 `Object. create(null)` 来创建)。在这种情况下，形如 `myObject.hasOwnProperty(..)` 就会失败
- 这时可以使用一种更加强硬的方法来进行判断:`Object.prototype.hasOwnProperty.call(myObject,"a")`
- 不可枚举是不会出现在 for..in 循环中(尽管 可以通过 in 操作符来判断是否存在)
- `propertyIsEnumerable(..)` 会检查给定的属性名是否直接存在于对象中(而不是在原型链 上)并且满足 enumerable:true。
- `Object.keys(..)` 会返回一个数组，包含所有可枚举属性，`Object.getOwnPropertyNames(..)` 会返回一个数组，包含所有属性，无论它们是否可枚举。
- for..of 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的 next() 方法来遍历所有返回值。
- 数组有内置的 @@iterator，因此 for..of 可以直接应用在数组上。我们使用内置的 @@ iterator 来手动遍历数组，

  ```javascript
  var myArray = [ 1, 2, 3 ];
  var it = myArray[Symbol.iterator]();
  it.next(); // { value:1, done:false }
  it.next(); // { value:2, done:false }
  it.next(); // { value:3, done:false }
  it.next(); // { done:true }
  ```

- 普通的对象没有内置的 @@iterator，所以无法自动完成 for..of 遍历。当然，你可以给任何想遍历的对象定义 @@iterator

  ```javascript
  var myObject = {
    a: 2,
    b: 3
  };
  Object.defineProperty( myObject, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function() {
      var o = this;
      var idx = 0;
      var ks = Object.keys( o );
      return {
        next: function() {
          return {
            value: o[ks[idx++]],
            done: (idx > ks.length)
          };
        }
      };
    }
  } );
  // 手动遍历 myObject
  var it = myObject[Symbol.iterator]();
  it.next(); // { value:2, done:false }
  it.next(); // { value:3, done:false }
  it.next(); // { value:undefined, done:true }
  // 用 for..of 遍历 myObject
  for (var v of myObject) {
    console.log( v );
  }
  // 2 // 3
  ```
