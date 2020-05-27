# 13种proxy模式

## 代理模式

代理模式，就好比卖东西，总部在A地，在B地区有渠道代理商，那么B地的人就通过B地区的渠道代理商购买

代理对象内部含有对本体对象的引用，因而可以与调用本体的相关方法；同时，代理对象提供与本体对象相同的接口，方便在任何时刻代理本体对象。

就是说B地区的渠道代理商要和A地卖的东西一样

- 保护代理，主要用于控制不同权限的对象对本体对象的访问权限，就是说，在B地下属的区县C也有一个代理商，C地比B地可卖的东西和数量要少
- 虚拟代理，将调用本体方法的请求进行管理，等到本体适合执行时，再执行。

    ```javascript
    /**虚拟代理合并http请求 */
    //通过代理函数收集一段时间的请求，一次性发送给服务器，减少频繁的网络请求带来的极大开销
    //模拟向服务器发送同步请求的函数
    var synchronousFile = function(id){
        console.log('开始同步上传文件，id为：'+id);
    }

    //代理类收集一段时间的同步请求，统一发送
    var proxySynchronousFile = (function(){
        var cache = [], //设置缓存数组
            timer; //定时器，通过闭包访问定时器的引用

        return function(id){
            cache.push(id);
            if(timer){
                return;
            }
            timer = setTimeout(function(){
                synchronousFile(cache.join(','));
                clearTimeout(timer);
                timer = null;
                cache.length = 0;
            },2000)
        }
    })()

    var checkbox = document.getElementsByTagName('input');

    for(var i=0,c;c=checkbox[i++];){
        c.onclick = function(){
            if(this.check === true){
                proxySynchronousFile(this.id);
            }
        }
    }
    ```

- 缓存代理,可以为开销大的一些运算结果提供暂时性的存储，如果再次传进相同的参数是，直接返回结果，避免大量重复计算。
- 防火墙代理、
- 远程代理、
- 智能引用代理、
- 写时复制代理

## Proxy有13种数据劫持的操作

- get 得到某对象属性值时预处理的方法

    ```javascript
    var pro = {
        name: "LV",
        count:0,
    };
    var proxyPro = new Proxy(pro, {
        get: function(target, key) {
            if (target['count'] <= 0) {
            return '库存不足';
            } else {
            return target[key];
            }
        }
    });
    proxyPro.count
    //"库存不足"
    ```

- set 拦截某个属性的赋值操作

    ```javascript
    var pro = {
        name: "LV",
        count:0,
    };
    var proxyPro = new Proxy(pro, {
        set: function(target, key, value) {
            if (key == 'count' && value > 100) {
                throw new TypeError('库存最多存放100个');
            }

            target[key] = value;
        }
    });
    proxyPro.count = 120
    //TypeError: 库存最多存放100个
    ```

- has 使用in操作符判断key是否存在,只返回true/false

    ```javascript
    var pro = {
        name: "LV",
        count:0,
    };
    var proxyPro = new Proxy(pro, {
        has: function(target, key) {
            if (target[key] || key.indexOf('data-') == 0) {
                return true
            }
        }
    });

    'data-color' in proxyPro
    //true
    ```

- apply 函数调用，仅在代理对象是function时有效

    ```javascript
    function pro(){
        return {
            name: "LV",
            count:0,
        };
    }
    var proxyPro = new Proxy(pro, {
        apply: function(target, that, args) {
            if (args && args[0] == false) {
                return '就不告诉你';
            }else{
                return target.apply(that,args)
            }
        }
    });
    proxyPro(false)//就不告诉你
    proxyPro()//{name: "LV", count: 0}
    ```

- ownKeys 获取目标对象所有的key

    ```javascript
    var pro = {
        name: "LV",
        count:0,
    };
    var proxyPro = new Proxy(pro, {
        ownKeys: function(target) {
            let keys = Object.keys(target);
            return keys.concat(['我是假象'])
        }
    });

    Object.getOwnPropertyNames(proxyPro)
    // ["name", "count", "我是假象"]
    ```

- construct 函数通过示例化调用，仅在代理对象是function时有效,通过一个新构造函数来扩展一个已有的构造函数
- isExtensible 判断对象是否可扩展 Object.isExtensible
- deleteProperty 删除一个属性

    ```javascript
    var pro = {
        name: "LV",
        count:0,
    };
    var proxyPro = new Proxy(pro, {
        deleteProperty: function(target) {
            throw new TypeError('一个也不能少');
        }
    });

    delete proxyPro.name
    // TypeError: 一个也不能少
    ```

- defineProperty 定义一个属性 Object.defineProperty
- getPrototypeOf 获取原型对象 Object.getPrototypeOf
- setPrototypeOf 设置原型对象 Object.setPrototypeOf
- preventExtensions 设置对象为不可扩展 Object.preventExtensions
- getOwnPropertyDescriptor 获取一个自有属性的属性描述 Object.getOwnPropertyDescriptor
