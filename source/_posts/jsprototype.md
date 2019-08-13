---
title: 原型和面向对象
date: 2018-12-25 11:00:42
tags:
- javascript
---
### 创建对象
#### 1 工厂方式
```
function createPerson(name, age, job){ 
    var o = new Object(); o.name = name; o.age = age; o.job = job;
    o.sayName = function(){ 
        alert(this.name);
        };
    return o; 
}
var person1 = createPerson("Nicholas", 29"Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");
```
工厂模式虽然解决了创建 多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）
#### 2构造方法
```
function Person(name, age, job){ 
    this.name = name; this.age = age; 
    this.job = job;
    this.sayName = function(){ alert(this.name);}; 
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```
构造的对象属于同一类型
```
alert(person1.constructor == Person); //true 
alert(person2.constructor == Person); //true

alert(person1 instanceof Object); //true 
alert(person1 instanceof Person); //true 
alert(person2 instanceof Object); //true
alert(person2 instanceof Person); //true
```
其实有这么一个问题：不同实例上的同名函数是不相等的
即person1.sayName == person2.sayName为false
#### 3原型方式
```
function Person(){ }
Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){ alert(this.name);};
var person1 = new Person(); 
person1.sayName();
var person2 = new Person(); 
person2.sayName();
```
所有对象可以通过引用Person.prototype属性，从而实现共享属性和方法
### 原型对象，对象属性和原型属性
无论什么时候，<u>只要创建了一个新函数（如上文Person），就会根据一组特定的规则为该函数创建一个**原型对象**prototype</u>，在默认情况下，<u>所有原型对象都会自动获得一个 constructor，该构造方法指向 prototype 属性所在函数（即Person.prototype.constructor=Person）</u>。<u>通过这个构造函数，我们还可继续为原型对象添加其他属性和方法</u>。创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性；至于其他方法，则都是从 Object 继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（\_\_proto\_\_,注，ECMA-262第5版中管这个指针叫[[Prototype]]。虽然在脚本中没有标准的方式访问[[Prototype]]，但 Firefox、Safari 和 Chrome 在每个对象上都支持属性 __proto __；~~而在其他实现中，这个属性对脚本则是完全不可见的~~），指向构造函数的原型对象（即person1.\_\_proto\_\_=Person.prototype）。
<div align=center>![prototype](https://upload-images.jianshu.io/upload_images/3140250-a75fde4f80938b58.PNG "prototype")</div>
在无法访问[[Prototype]]的情形下（QQs尚未接触到不支持\_\_proto\_\_的环境），可以通过 isPrototypeOf()方法来确定对象之间是否存在这种关系，有Person.prototype.isPrototypeOf(person1)返回true,另ES5提供Object.getPrototypeOf，有Object.getPrototypeOf(person1) == Person.prototype为true。

代码读取某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性。搜索首先 从对象实例本身开始。如果在实例中找到了具有给定名字的属性，则返回该属性的值；如果没有找到， 则继续搜索指针指向的原型对象，在原型对象中查找具有给定名字的属性。如果在原型对象中找到了这 个属性，则返回该属性的值。也就是说，在我们调用 person1.sayName()的时候，会先后执行两次搜 索。首先，解析器会问：“实例 person1 有 sayName 属性吗？”答：“没有。”然后，它继续搜索，再 问：“person1 的原型有 sayName 属性吗？”答：“有。”于是，它就读取那个保存在原型对象中的函数。

可以通过对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值。如果我们 在实例中添加了一个属性，而该属性与实例原型中的一个属性同名，那我们就在实例中创建该属性，该属性将会屏蔽原型中的那个属性。而delete对象实例的这个属性，会重新暴露原型对象的属性
```
Person.prototype.name = "Nicholas";
var person1 = new Person(); 
person1.name = "Greg"; 
alert(person1.name); //"Greg"——来自实例 
delete person1.name; 
alert(person1.name);//"Nicholas"——来自原型
```
使用hasOwnProperty()方法可以检测一个属性是存在于实例中(true)，还是存在于原型中(false)。
检测属性（无论实例属性或是原型属性）是否存在可以用in，即"name" in person1返回true。

从in说到for in，遍历所有能够通过对象访问的、可枚举的（enumerated）属性，其中 既包括存在于实例中的属性，也包括存在于原型中的属性。
不可枚举属性，即将 [[Enumerable]]标记为 false 的属性，而屏蔽不可枚举属性的实例属性也会遍历到。
ES5已经提供Object.keys()返回所有可枚举属性的字符串数组。

### 更多创建对象姿势
#### 动态原型模式
```
function Person(name, age, job){ //属性
    this.name = name; this.age = age;
    this.job = job;
    if (typeof this.sayName != "function"){    
        Person.prototype.sayName = function(){ 
            alert(this.name);
        }; 
    }
}
```
原型对象方法sayName在第一次调用构造方法Person时执行。
#### 寄生构造方法模式
```
function Person(name, age, job){ 
    var o = new Object(); 
    o.name = name; 
    o.age = age; 
    o.job = job;
    o.sayName = function(){ 
        alert(this.name);
    }; 
    return o; 
}
var friend = new Person("Nicholas", 29, "Software Engineer");
```
注意这种方式不能依赖 instanceof 操作符来确定对象类型
#### 稳妥构造函数模式
```
function Person(name, age, job){ //创建要返回的对象
    var o = new Object();
    //可以在这里定义私有变量和函数 
    //添加方法
    o.sayName = function(){ 
        alert(name);
    };
    //返回对象 
    return o;
}
var friend = Person("Nicholas", 29, "Software Engineer"); friend.sayName(); //"Nicholas"
```
对象实例只能调用闭包内函数以返回name，而无法直接访问任何属性
### 原型链和继承
#### 原型链
假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。
```
function SuperType(){ 
    this.property = true;
}
SuperType.prototype.getSuperValue = function(){ 
    return this.property;
};
function SubType(){ }
SubType.prototype = new SuperType();//继承了 SuperType 
SubType.prototype.getSubValue = function (){ 
    return this.subproperty;
};
var instance = new SubType(); 
alert(instance.getSuperValue());//true
```
SubType 继承了 SuperType。实现的本质是重写原型对象，代之以一个新类型的实例。换句话说，原来存在于基类型的实例中的所有属性和方法，现在也存在于衍生类原型对象中了。
注意，所有引用类型的对象都继承了Object，这个继承也是通过原型链实现的。
<div align=center>![inherit](https://upload-images.jianshu.io/upload_images/3140250-998e96f2cdff75a3.PNG "inherit")</div>
两个问题缺点：父类包含的引用类型属性，随实例共享到子类的所有实例，这可能并不是我们期望的；子类原型引用的是父类实例，不能向超类型的构造函数中传递参数（在ES6中可以在子类constructor中通过超类型super调用父类方法）。
子类原型对象的constructor指向父类构造方法

#### 借用构造方法constructor stealing
```
function SuperType(){ 
    this.colors = ["red", "blue", "green"]; 
}
function SubType(){ 
    //继承了 SuperType 
    SuperType.call(this);
}
var instance1 = new SubType(); 
instance1.colors.push("black"); 
alert(instance1.colors);//"red,blue,green,black"
var instance2 = new SubType(); 
alert(instance2.colors);//"red,blue,green"
```
传参
```
function SuperType(name){ 
    this.name = name;
}
function SubType(){ 
    SuperType.call(this, "Nicholas");//调用SuperType构造方法
    this.age = 29; //实例属性 
}
var instance = new SubType(); 
alert(instance.name); //"Nicholas";
alert(instance.age);//29
```
无法避免构造函数模式存在的问题——方法都在构造函数中定 义，因此函数复用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。考虑到这些问题，借用构造函数的技术也是很少单独使用的。
#### 组合构造
```
function SuperType(name){ 
    this.colors = ["red", "blue", "green"]; 
    this.name=name;
}
SuperType.prototype.sayName=function(){alert(this.name)};

function SubType(name,age){ 
    //继承了 SuperType 
    SuperType.call(this,name);
    this.age=age;
}
SubType.prototype=new SuperType();
SubType.prototype.constructor=SubType;// 注@
SubType.prototype.sayAge=function(){alert(this.age)};

var instance1 = new SubType(); 
instance1.colors.push("black"); 
alert(instance1.colors);//"red,blue,green,black"
var instance2 = new SubType(); 
alert(instance2.colors);//"red,blue,green"
```
在注@这一行，将原型对象的构造方法指向到SubType，因为之前该对象根据继承关系图示，作为SuperType实例，其[[prototype]]指向SuperType.prototype，故而SubType.prototype.constructor原先为SuperType方法。

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 JavaScript 中最常用的继承模式。而且，instanceof 和 isPrototypeOf()也能够用于识别基于组合继承创建的对象。
#### 原型式继承
浅复制方法
```
function object(o){ 
    function F(){}
    F.prototype = o; 
    return new F();
}
```
关于ES5 Object.create();