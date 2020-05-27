# Symbol

ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

每个从Symbol()返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的。

声明方法：

```javascript
let id = Symbol('id');
```

Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

```javascript
var sym1 = Symbol('foo');
var sym2 = Symbol('foo');
sym1 == sym2 //false
sym2.toString();//"Symbol('foo')"
```

Symbol 数据类型的另一特点是隐藏性，`for···in`，`object.keys()` 不能访问,`Object.getOwnPropertyNames()`不会返回symbol对象的属性,但是可以通过`Object.getOwnPropertySymbols()`得到他们。

```javascript
let id = Symbol("id");
let obj = {
    [id]:'symbol'
};
for(let option in obj){
    console.log(obj[option]); //空
}
console.log(Object.getOwnPropertySymbols(obj));//[Symbol(id)]
```

虽然这样保证了Symbol的唯一性，但我们不排除希望能够多次使用同一个symbol值的情况。
为此，官方提供了全局注册并登记的方法：`Symbol.for()`

```javascript
let name1 = Symbol.for('name'); //检测到未创建后新建
let name2 = Symbol.for('name'); //检测到已创建后返回
console.log(name1 === name2); // true
console.log(Symbol.keyFor(name1));  // 'name'
```

## Symbol 类型转换

- 尝试将一个 symbol 值转换为一个 number 值时，会抛出一个 TypeError 错误

```javascript
var a = Symbol('1243')
Number(a) // Uncaught TypeError: Cannot convert a Symbol value to a number
```

-  

```javascript
Object(a) == a // true
```

- 触发隐式运算，比如与字符串连接时，会抛出一个 TypeError 错误

```javascript
a + 'bar' //Uncaught TypeError: Cannot convert a Symbol value to a string
```

- 当使用 JSON.stringify() 时，以 symbol 值作为键的属性会被完全忽略：

```javascript
JSON.stringify({[Symbol("foo")]: "foo"});
// '{}'
```
