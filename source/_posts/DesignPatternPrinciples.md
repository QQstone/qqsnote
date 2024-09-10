---
title: 设计模式原则
date: 2021-08-04 09:26:47
tags:
categories: 
- 后端技术
---
简写为SOLID
#### 单一职责(Sigle Responsibility Principle)
避免设计对象（类，方法）承担多项职责，在对职责1操作或修改时可能会造成职责2的异常。
+ 在需要if else时考虑划分为两个类或方法
+ 在需求变更导致职责细分时考虑将类或方法划分
  
#### 开放关闭(Open Closed Principle)
设计对象应该根据需求被扩展，而不应该因需求而做修改，即对类进行抽象和继承
违反开放关闭原则：
```
class Factory {
    public Computer produceComputer(String type) {
        Computer c = null;
        if(type.equals("macbook")){
            c = new Macbook();
        }else if(type.equals("surface")){
            c = new Surface();
        }
        return c;
    }   
}
```
抽象出produce接口
```
interface Factory {
    public Computer produceComputer();
}
class AppleFactory implements Factory {
    public Computer produceComputer() {
        return new Macbook();
    }
}
class MSFactory implements Factory {
    public Computer produceComputer() {
        return new Surface();
    }
}
```
#### 里氏替换(Liskov Substitution Principle)
> 所有引用基类的地方必须能透明地使用其子类的对象。

A的子类B继承父类时，不应改变原功能，只做扩展

#### 接口隔离(Interface Segregation Principle)
合理设计接口的粒度，避免类型依赖它不需要的接口

#### 依赖倒置(Dependency Injection Principle)
高层模块不应依赖低层模块，以免因为低层修改而牵扯高层，两者应该共同依赖接口，将改动限制在接口的实现上
即最少知道，类型对其直接引用的对象A保持最少的了解，不会通过该对象与第三者对象B建立间接的调用关系，要求A将必要的方法封装为public提供外部调用，而不暴露其引用了B的事实

[23种设计模式](https://juejin.cn/post/7072175210874535967)