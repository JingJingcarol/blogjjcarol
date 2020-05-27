# void、null、undefined的区别

```typescript
//strict为false时

let x:number;
let y:null;
let z:undefined;
let s:void;
let t:never;

x = 123;// 运行正确
x = null;// 运行正确
x = undefined;// 运行正确

y = null;// 运行正确
y = 123;// 运行错误
y = undefined;// 运行错误

z = undefined;// 运行正确
z = 123;// 运行错误
z = null;// 运行错误

s = undefined;// 运行正确
s = null;// 运行正确
s = 123;// 运行错误

t = undefined;// 运行正确
t = null;// 运行正确
t = 123;// 运行错误

```
