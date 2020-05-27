# eval 与 new Funcion 的区别

## 共同作用，动态执行脚本

## 区别

- eval 的作用域是当前作用域
- new Function 的作用域是全局作用域

## demo

```javascript
var a = 'glocal val';
fucntion fn(){
    var a = 'local val';
    eval('a'); //  'local val'
    new Function('return a')(); // 'glocal val'
}
```
