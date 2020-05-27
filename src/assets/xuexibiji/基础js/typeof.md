# 比较typeof、instanceof、Object.prototype.toString.call

都是用来判断数据类型的方法

## typeof

能判断8种类型"number"、"string"、"boolean"、"object"、"function" 、“symbol”、“bigint”和 "undefined"。

但是当类型为object,null,array，Date,RegExp等对象时都会返回object,所以不能区分这些

```javascript
var str = '123',
    sym = Symbol('123'),
    bigI = 10n,
    arr = [],
    fun = function() {},
    n = null,
    un = undefined,
    number = 123,
    flag = true,
    date = new Date(),
    reg = new RegExp();
console.log(typeof(str)); //string
console.log(typeof(sym)); //symbol
console.log(typeof(bigI)); //bigint
console.log(typeof(arr)); //object
console.log(typeof(fun)); //function
console.log(typeof(n)); //object
console.log(typeof(un)); //undefined
console.log(typeof(number)); //number
console.log(typeof(flag)); //boolean
console.log(typeof(date)); //object
console.log(typeof(reg)); //object
```

## instanceof

A instanceof B：判断A是否是B的实例，返回boolean类型；
就是检查一个对象A的原型链中是否有构造函数B的prototype属性

缺点是：检测不了基础数据类型number,boolean,string

```javascript
console.log(arr instanceof Array); //true
console.log(str instanceof String); //false
str = new String(123);
console.log(str instanceof String); //true
console.log(date instanceof Date); //true
console.log(reg instanceof RegExp); //true
```

**注意：**

```javascript
Function instanceof Object; //true
Object instanceof Function; //true

var a = {};
var b = function(){};
a instanceof Object; //true
a instanceof Function; //false

b instanceof Function;//true
b instanceof Object;//true
```

## Object.prototype.toString.call

MDN中

> 每个对象都有一个 toString() 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，toString() 方法被每个 Object 对象继承。如果此方法在自定义对象中未被覆盖，toString() 返回 "[object type]"，其中 type 是对象的类型。

```javascript
console.log(Object.prototype.toString.call(str)); //[object String]
console.log(Object.prototype.toString.call(arr)); //[object Array]
console.log(Object.prototype.toString.call(n)); //[object Null]
console.log(Object.prototype.toString.call(un)); //[object Undefined]
console.log(Object.prototype.toString.call(number)); //[object Number]
console.log(Object.prototype.toString.call(flag)); //[object Boolean]
console.log(Object.prototype.toString.call(date)); //[object Date]
console.log(Object.prototype.toString.call(reg)); //[object RegExp]

let type = Object.prototype.toString.call(str);
type = type.slice(8, type.length - 1);
console.log(type);//String

function Person(name, age) {
    this.name = name;
    this.age = age;
}
var person = new Person("Rose", 18);
Object.prototype.toString.call(arr); //”[object Object]”
```

**很明显这种方法不能准确判断person是Person类的实例，而只能用instanceof 操作符来进行判断，如下所示：**

```javascript
console.log(person instanceof Person);//输出结果为true
```
