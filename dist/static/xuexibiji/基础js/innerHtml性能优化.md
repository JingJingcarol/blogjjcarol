# innerHTML 的性能优化

```javascript
var olddiv = document.createElement('div');
var newNode = olddiv.cloneNode();
newNode.innerHtml = '我的innerHtml';
var newdiv = olddiv.parentNode.replaceHtml(olddiv,newNode);

```
