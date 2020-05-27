# 比较for、forEach、for...in和for...of

## for

`for(let i = 0; i < number; i ++){...}`

## forEach

`arr.forEach(function (value, index, array) {}, thisArg)`

- forEach()只能用于Array，不能用于其他的可迭代对象
- forEach()接收一个function作为参数
- 这个function会为数组里面的每一个元素都执行一次

forEach 适用于循环次数未知，或者计算循环次数比较麻烦情况下使用效率更高，但是更为复杂的一些循环还是需要用到 for 循环效率更高。

**注意：**

- forEach()总是返回undefined，这于map()和reduce()不同
- 一旦Array对第一个元素调用forEach()里面的回调函数，这之后添加的新元素，并不会在此轮被遍历到。

```javascript
let numbers = [1, 2, 3];
numbers.forEach(function (value, index, numbers) {
    console.log(value); // 1, 2, 3
    numbers.push(4);
});
console.log(numbers);//[1, 2, 3, 4, 4, 4]
```

但是，如果在轮询中修改了Array，某些元素可能会被轮询跳过：

```javascript
let numbers = [1, 2, 3, 4];
numbers.forEach((value, index, numbers)=>{
   console.log(value);
   if(value === 2){
       numbers.shift(); //1 2 4
   }
});
console.log(numbers);// [2, 3, 4]
```

- forEach 方法按升序为数组中含有效值的每一项执行一次callback 函数，那些已删除或者未初始化的项将被跳过

- 在forEach()里面不能跳出轮询,break命令或return命令都不管用。

## for...in

`for(let key in object){...}`

for...in以任意顺序来遍历一个对象除了Symbole类型外的可枚举属性。

for…in主要是为遍历对象而设计，不适合遍历数组。

1. 它的遍历是无序的
2. 它遍历的是对象的属性名，而不是属性对应的值
3. 它只遍历可枚举属性

    可枚举属性是指那些内部 “可枚举（enumerable）” 标志设置为 true 的属性。

    - 直接通过赋值和属性初始化的属性，默认enumerable == true，是可枚举的
    - 通过Object.defineProperty定义的属性，默认enumerable == false，则不可枚举;如果想要可枚举，需要手动改enumerable:true

4. 在可枚举属性里面，不遍历Symbol类型
5. for...in不仅会遍历自己的属性，也会遍历继承的属性。

    如果不想被访问原型

    ```javascript
    Object.prototype.test = function(){}
    var array={};
    array[0] = 1;
    array[5] = 5;
    for(var i in array){
        if (array.hasOwnProperty(i) === true) {
            console.log(i, array[i])
        }
    }
    // 0 1
    // 5 5
    // 不使用hasOwnProperty，会打印出test ƒ (){}
    ```

6. 我们在for...in的循环中，最好不要对属性进行添加，删除（通过delete），修改（通过Object.defineProperty）操作，因为在循环中进行这些操作都无法保证得到一个确定的结果。

## for...of

`for(let value of iterable){...}`

for...of用来遍历可迭代对象的元素的值,是ES6新引入的特性

1. ES6内建的可迭代对象：Array，TypedArray，Map， Set，String
2. Array-like object：arguments， nodeList
3. 用户自己创建的可迭代对象(用生成器函数创建的可迭代对象)
4. weakSet和weakMap都是不可迭代对象，所以不能使用for...of

```javascript
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};

// 每个对象将继承objCustom属性，并且作为Array的每个对象将继承arrCustom属性，
// 因为将这些属性添加到Object.prototype和Array.prototype。
// 由于继承和原型链，对象iterable继承属性objCustom和arrCustom。
let iterable = [3, 5, 7];
iterable.foo = 'hello world';


// 此循环仅以原始插入顺序记录iterable对象的可枚举属性。
// 它不记录数组元素3, 5, 7 或hello，因为这些不是枚举属性。
// 但是它记录了数组索引以及arrCustom和objCustom。
// 前面说了，不建议使用for...in迭代数组，这里是纯粹举例才这样写，请勿模仿
for (let i in iterable) {
  console.log(i); // 0, 1, 2, "foo", "arrCustom", "objCustom"
}


// 这个循环类似于第一个，但是它使用hasOwnProperty() 来检查，
// 如果找到的枚举属性是对象自己的（不是继承的）。如果是，该属性被记录。
// 记录的属性是0, 1, 2和foo，因为它们是自身的属性（不是继承的）。
// 属性arrCustom和objCustom不会被记录，因为它们是继承的。
for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // 0, 1, 2, "foo"
  }
}


// 该循环迭代并记录iterable作为可迭代对象定义的迭代值，这些是数组元素 3, 5, 7，而不是任何对象的属性。
for (let i of iterable) {
  console.log(i); // 3, 5, 7
}
```
