# bigint

ES6之后基本类型增加到了6种：String、Number、Boolean、Null、Undefined、Symbol。

在JS中，按照IEEE 754-2008标准的定义，所有数字都以双精度64位浮点格式表示。

就是说，JS 中的Number类型只能安全地表示-9007199254740991 (-(2^53-1)) 和9007199254740991(2^53-1)之间的整数，任何超出此范围的整数值都可能失去精度。

```javascript
9007199254740992 === 9007199254740993;    // true
```

JS 提供Number.MAX_SAFE_INTEGER常量来表示 最大安全整数，Number.MIN_SAFE_INTEGER常量表示最小安全整数：

```javascript
const minInt = Number.MIN_SAFE_INTEGER;
console.log(Number.MAX_SAFE_INTEGER); //9007199254740991
console.log(minInt); //-9007199254740991

console.log(minInt - 5 === minInt - 4); // true
```

ES10中添加的新特性之一：BigInt 任意精度整数

## 用法

可以用在一个整数字面量后面加 n 的方式定义一个 BigInt ，如：10n，或者调用函数BigInt()。

```javascript
const theBiggestInt = 9007199254740991n;

const alsoHuge = BigInt(9007199254740991);// 9007199254740991n

const hugeString = BigInt("9007199254740991");// 9007199254740991n

const hugeHex = BigInt("0x1fffffffffffff");// 9007199254740991n

const hugeBin = BigInt("0b11111111111111111111111111111111111111111111111111111");// 9007199254740991n

BigInt(true);    // → 1n

//无法转换的数据类型和值会引发异常:
BigInt(10.2);     // → RangeError
BigInt(null);     // → TypeError
BigInt("abc");    // → SyntaxError
```

与number比较

- 不能用于 Math 对象中的方法
- 不能和任何 Number 实例混合运算，两者必须转换成同一种类型，BigInt 变量在转换成 Number 变量时可能会丢失精度。

## 类型比较

```javascript
typeof 10n; // 'bigint'

typeof Object(1n) === 'object'; // true

10n === BigInt(10); // true
10n == 10; // true

10n === 10;    // false

//可以和number比较
1n < 2 // true
//两者也可以混在一个数组内并排序。
const mixed = [4n, 6, -12n, 10, 4, 0, 0n];// [4n, 6, -12n, 10, 4, 0, 0n]

mixed.sort();// [-12n, 0, 0n, 10, 4n, 4, 6]
```

## 运算

可以使用 `+`、`*`、`-`、`**`、`%`，位操作符如`|`、`&`、`<<`、`>>`和`^`

```javascript
10n + 20n;    // → 30n
10n - 20n;    // → -10n
+10n;         // → TypeError: Cannot convert a BigInt value to a number
-10n;         // → -10n
10n * 20n;    // → 200n
20n / 10n;    // → 2n
23n % 10n;    // → 3n
10n ** 3n;    // → 1000n

const x = 10n;
++x;          // → 11n
--x;          // → 9n

90 | 115;      // → 123
90n | 115n;    // → 123n
90n | 115;     // → TypeError
```

在需要转换成 Boolean 的时表现跟 Number 类似

```javascript
if (0n) {
  console.log('Hello from the if!');
} else {
  console.log('Hello from the else!');
}

// "Hello from the else!"

0n || 12n // 12n

0n && 12n // 0n

Boolean(0n) // false

Boolean(12n) // true

!12n // false

!0n // true
```
