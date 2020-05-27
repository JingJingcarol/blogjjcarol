# 关于 AST

AST 抽象语法树

> It is a hierarchical program representation that presents source code structure according to the grammar of a programming language, each AST node corresponds to an item of a source code.
>
> 它是一种分层的程序表示，根据编程语言的语法来表示源代码结构，每个AST节点对应一个源代码项。

简单理解为 它就是你所写代码的的树状结构化表现形式。

看一个栗子🌰

```javascript
var answer = 6 * 7;

//esprima parser
{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "answer"
                    },
                    "init": {
                        "type": "BinaryExpression",
                        "operator": "*",
                        "left": {
                            "type": "Literal",
                            "value": 6,
                            "raw": "6"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 7,
                            "raw": "7"
                        }
                    }
                }
            ],
            "kind": "var"
        }
    ],
    "sourceType": "script"
}
```

也就是说，是从纯文本中，我们将得到树形结构的数据。每个条目和树中的节点一一对应 的过程。

过程主要经过词法分析和语法分析

- **词法分析** 也叫做扫描scanner，它读取我们的代码，然后把它们按照预定的规则合并成一个个的标识tokens。同时，它会移除空白符，注释，等。最后，整个代码将被分割进一个tokens列表（或者说一维数组）。

  当词法分析源代码的时候，它会一个一个字母地读取代码，所以很形象地称之为扫描-scans；当它遇到空格，操作符，或者特殊符号的时候，它会认为一个话已经完成了。

  上面🌰生成的tokens

  ```javascript
  [
      {
          "type": "Keyword",
          "value": "var"
      },
      {
          "type": "Identifier",
          "value": "answer"
      },
      {
          "type": "Punctuator",
          "value": "="
      },
      {
          "type": "Numeric",
          "value": "6"
      },
      {
          "type": "Punctuator",
          "value": "*"
      },
      {
          "type": "Numeric",
          "value": "7"
      },
      {
          "type": "Punctuator",
          "value": ";"
      }
  ]
  ```

  Javascript 代码中的语法单元主要包括以下这么几种：

  - 关键字：例如 var、let、const等
  - 标识符：没有被引号括起来的连续字符，可能是一个变量，也可能是 if、else 这些关键字，又或者是 true、false 这些内置常量
  - 运算符： +、-、 *、/ 等
  - 数字：像十六进制，十进制，八进制以及科学表达式等语法
  - 字符串：因为对计算机而言，字符串的内容会参与计算或显示
  - 空格：连续的空格，换行，缩进等
  - 注释：行注释或块注释都是一个不可拆分的最小语法单元
  - 其他：大括号、小括号、分号、冒号等

- **语法分析**，也解析器。它会将词法分析出来的数组转化成树形的表达形式。同时，验证语法，语法如果有错的话，抛出语法错误。

[esprima可视化转化demo https://esprima.org/demo/parse.html#](https://esprima.org/demo/parse.html#)

## 应用

- IDE的错误提示、代码格式化、代码高亮、代码自动补全等
- JSLint、JSHint对代码错误或风格的检查等
- webpack、rollup进行代码打包等
- CoffeeScript、TypeScript、JSX等转化为原生Javascript
- babel

## css的AST语法树

目前css 处理插件最火的就是postcss

postcss 只是一个平台，它只负责将css 转换成AST语法树，然后，运行postcss上的插件修改css Ast对象，最后将AST转换为css内容。

post 转换为css语法的原理是：将每一个selector 归为一块 名为rule，然后将selector 内的每一个属性归为一块
