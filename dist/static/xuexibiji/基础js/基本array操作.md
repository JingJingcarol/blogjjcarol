# Array 数组操作

## 扁平化n维数组(ES10)

```javascript
  [1,[2,3]].flat(2) // [1,2,3]
  [1,[2,3,[4,5]]].flat(3) //[1,2,3,4,5]
  [1,[2,3,[4,5]]].toString() // 1,2,3,4,5
  [1,[2,3,[4,5,[...]]]].flat(infinity) //[1,2,3,4...
```

## 去重

```javascript
  Array.form(new Set([1,2,3,3,4,4])) //[1,2,3,4]
  //set   ES6   定义不重复数组的数据类型
  //Array.form 将类数组转化为数组
```

## 排序

```javascript
  [1,2,3,4].sort((a,b) => a - b); //[1,2,3,4]
```

## 最大值

```javascript
  Math.max(...[1,2,3,4])
  Math.max().apply(this.[1,2,3,4])
  [1,2,3,4].reduce((prev,cur,curIndex,arr) => {
      return Math.max(prev,cur)
  },0)
  //reduce   prev(上一次的返回值)，cur(当前值)，curIndex(当前值索引)，arr(当前数组)
```

## 求和

```javascript
  [1,2,3,4].reduce((prev,cur) => {
      return prev + cur;
  }) //10
```

## 合并

```javascript
  [1,2,3,4].concat([5,6])
  [...[1,2,3,4],...[5,6]]
  [1,2,3,4].push.apply([1,2,3,4],[5,6])
```

## 判断是否包含值

```javascript
  [1,2,3].includes(4) //false ES7
  [1,2,3].indexOf(4) //-1
  [1,2,3].find((item) => item===3) //[3]
  [1,2,3].findIndex((item) => item === 3) //[2]
```

## 类数组转化

```javascript
  Array.prototype.slice.call(arguments)
  Array.prototype.slice.apply(arguments)
  Array.form(arguments)
  [..arguments]
```

## 每一项设置值

```javascript
  [1,2,3].fill(false) //[false,false,false] ES6
```

## 每一项是否满足

```javascript
    [1,2,3].every(item => {return item > 2}) //false
```

## 有一项满足

```javascript
    [1,2,3].some(item => {return item > 2}) //true
```

## 过滤数组

```javascript
  [1,2,3].filter(item => {return item > 2}) // [3]
```

## 对象和数组转化

```javascript
  Object.keys({name:’张三’,age:’14’}) //[name,age]
  Objext,values({name:’张三’,age:’14’}) //[’张三’,14]
  Object.entries({name:’张三’,age:’14’}) //[[name,’张三’],[age,14]]
  Object.formEntries([name,’张三’],[age,14]) //{name:’张三’,age:’14’} ES10
```