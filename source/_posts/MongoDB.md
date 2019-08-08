---
title: MongoDB
date: 2019-07-31 18:36:52
tags:
- MongoDB
---
#### "NoSQL" database
非关系型数据库，不适用SQL作为查询语言，不使用数据表格存放数据。

优势：
+ Scalability 可扩展性: by default, non-relational databases are split (or "shared") across many systems instead of only one. This makes it easier to improve performance at a lower cost.
+ Flexibility 灵活性: new datasets and properties can be added to a document without the need to make a new table for that data.
+ Replication 备用性: copies of the database run in parallel so if one goes down, one of the copies becomes the new primary data source.

#### MongoDB Atlas
a cloud MongoDB service
```
mongodb+srv://qqs:<password>@clusteraws-vcbnj.mongodb.net/test?retryWrites=true&w=majority
```
#### Project with MongoDB
package:<br>
+ mongodb
+ mongoose
    ```
    var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGO_URI);
    ```
[Mongoose Docs](https://mongoosejs.com/docs/guide.html "see the mongoose docs")
+ Schema：  一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
+ Model：  由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
+ Entity ：  由Model创建的实体，他的操作也会影响数据库


```
mongoose.connect(process.env.MONGO_URI);           //数据库连接

var Schema = mongoose.Schema;
var personSchema = new Schema({                    //定义Schema
  name: String,
  age: Number,
  favoriteFoods: Array
})

var Person = mongoose.model('Person',personSchema); //发布Model

var document = new Person({                         //创建Entity
  name:'David',
  age:18,
  favoriteFoods:'ice cream'
})

document.save(function(error,data){                           //调用实例save方法
  console.log('Person document saved')              //以回调函数作为最后一个参数
})
```
如果是Entity，使用save方法，如果是Model，使用create方法，参数是json + 回调函数
```
Person.create({
    name:'Ellar',
    age:18,
    favoriteFoods:'banana'
},callback)
```
