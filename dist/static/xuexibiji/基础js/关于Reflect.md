# 关于 Reflect

MDN中

> Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与proxy handlers的方法相同。Reflect不是一个函数对象，因此它是不可构造的。

所有Reflect的属性和方法都是静态的，使用方法和Math对象一样。

## 用途

- Object上面的方法不能完成操作的时候会抛出异常，处理这些异常会增加programmer的负担，所以可以使用boolean(true | false)来替代异常处理。

    ```javascript
    try {
        Object.defineProperty(obj, name, desc);
        // property defined successfully
    } catch (e) {
        // possible failure and need to do something about it
    }

    // but

    if (Reflect.defineProperty(obj, name, desc)) {
    // success
    } else {
    // failure (and far better)
    }
    ```

- Object上一些命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。

- apply函数

```javascript
func.apply(obj, arr);
//可能存在潜在问题，因为func可能是一个已有自定apply的对象
Reflect.apply(func, obj, arr);
```

- 解决Proxy操作后对象中需要访问原生方法的问题,也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

```javascript
const employee = {
  firstName: 'Hal',
  lastName: 'Shaw'
};

let logHandler = {
  get: function(target, fieldName) {
      if(!target[fieldName]) {
           console.log("Default name ")
      }  
      else {
        console.log("Proxy: " + target[fieldName]);
      }
      return Reflect.get(target, fieldName);
  }
};

let func = () => {
  let p = new Proxy(employee, logHandler);
  p.firstName;
  p.lastName;
  p.testname;
  p.name;
};

func();
// Proxy: Hal
// Proxy: Shaw
// Default name
// Default name
```

## 方法

- `Reflect.apply()` 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。
- `Reflect.construct()` 对构造函数进行 new 操作，相当于执行 new target(...args)。
- `Reflect.defineProperty()` 和 Object.defineProperty() 类似。
- `Reflect.deleteProperty()` 作为函数的delete操作符，相当于执行 delete target[name]。
- `Reflect.enumerate()` 该方法会返回一个包含有目标对象身上所有可枚举的自身字符串属性以及继承字符串属性的迭代器，for...in 操作遍历到的正是这些属性。
- `Reflect.get()` 获取对象身上某个属性的值，类似于 target[name]。
- `Reflect.getOwnPropertyDescriptor()` 类似于 Object.getOwnPropertyDescriptor()。
- `Reflect.getPrototypeOf()` 类似于 Object.getPrototypeOf()。
- `Reflect.has()` 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。
- `Reflect.isExtensible()` 类似于 Object.isExtensible().
- `Reflect.ownKeys()` 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响).
- `Reflect.preventExtensions()` 类似于 Object.preventExtensions()。返回一个Boolean。
- `Reflect.set()` 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
- `Reflect.setPrototypeOf()` 类似于 Object.setPrototypeOf()。
