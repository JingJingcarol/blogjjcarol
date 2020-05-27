# 面向对象的SOLID原则

缩写 | 全称 | 中文
-- | -- | --
S | The Single Responsibility Principle | 单一责任原则
O | The Open Closed Principle | 开放封闭原则
L | Liskov Substitution Principle | 里氏替换原则
I | The Interface Segregation Principle | 接口分离原则
D | The Dependency Inversion Principle | 依赖倒置原则

## 单一职责原则

让一个类只做一件事

单⼀责任原则可以看作是低耦合、高内聚在面向对象原则上的引申，将责任定义为引起变化的原因，以提⾼内聚性来减少引起变化的原因。责任过多，可能引起它变化的原因就越多，这将导致责任依赖，相互之间就产⽣影响， 从⽽极大的损伤其内聚性和耦合度。

如果只用一个类表达，赋予其双重职责，后果:

- 特有属性和共有属性相互掺杂，难以理解;
- 修改一个场景可能会影响另一个场景。

## 开放封闭原则

可扩展(extension)，不可修改(modification)。

对扩展开放，意味着有新的需求或变化时，可以对现有代码进⾏扩展，以适应新的情况。对修改封闭，意味着类⼀旦设计完成，就可以独⽴完成其⼯作，⽽不要对类进⾏任何修改。

通过增加代码来扩展功能，而不是修改已经存在的代码。

## 里式替换原则

当子类可以在任意地方替换基类且软件功能不受影响时，这种继承关系的建模才是合理的。

```java
public class Rectangle {
    public double width;
    public double height;

     public void setWidth(double value) {
         this.width = value;
     }

     public double getWidth() {
         return this.width;
     }

     public void setHeight(double value) {
         this.height = value;
     }

     public double getHeight() {
         return this.height;
     }

     public double Area() {
         return this.width*this.height;
     }
}

public class Square extends Rectangle {

    public void setWidth(double value) {
        this.width = value;
        this.height = value;
    }
    public void setHeight(double value) {
        this.width = value;
        this.height = value;
    }
}

// 测试
void TestRectangle(Rectangle r) {
    r.setWidth(10);
    r.setHeight(20);
    r.width == 10;
    r.Area() == 200;
}

// 运行良好
Rectangle r = new Rectangle ();
TestRectangle(r);

// 现在两个Assert测试都失败了
Square s = new Square();
TestRectangle(s);
```

上面的Rectangle和Square，Square本身长和宽相等，几何学中用边长来表示边， 而Rectangle长和宽之分，直观地看，Square已经Refused了Rectangle的Bequest，让Square继承 Rectangle是一个不符合里式替换原则的设计。

## 接口分离原则

不能强迫用户去依赖那些他们不使用的接口。换句话说，使用多个专门的接口比使用单一的总接口总要好。

## 依赖倒置原则

- 高层次的模块不应依赖低层次的模块，他们都应该依赖于抽象。
- 抽象不应依赖于具体实现，具体实现应依赖抽象。