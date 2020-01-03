---
title: MongoDB
date: 2019-07-31 18:36:52
tags:
- MongoDB
categories: 
- 数据库
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
  favoriteFoods:'ice cream'，
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

Person.create(arrayOfPeople,callback);              //批量创建
```
Model.find()
```
// example find all documents whose name is David
Person.find({name:'David'},function(error,data){
  if(!error){
    console.log(data)
  }else{
    console.log(error)
  }
})

// find方法在非完全匹配情况下的应用，会复杂很多，需要借助不同的方法及其选项，这些方法以$开头
// example find whose name contains 'White'
Person.find(
  {
    name:
    {
      '$regex':'White',
      '$options':'i'
    }
  },findcallback
)
// example find whose favoriteFood Array contains 'ice creame'
Person.find(
  {
    favoriteFood:{
      $in:['ice cream']
    },
  },findcallback
)
```
// update
```
var findAndUpdate = function(personName, done) {
  var ageToSet = 20;
  Person.findOneAndUpdate(
    {name:personName},              /* find filter*/
    {$set:{age:ageToSet}},          /* set options*/
    {new:true},                     /* return option*/
    (error,data)=>{
      if(error)
        done(error);
      done(null,data)
    }
  )
  //done(null/*, data*/);
};
```
// findByIdAndRemove
```
Person.findByIdAndRemove('5d4a500e994a2154010dc67f',function(){})
```
#### 实现自增长字段
```
var WebSiteSchema = mongoose.Schema({
  "original_url":String,
  "short_url":Number
})
// model
var Website = mongoose.model('Website', CounterSchema)
// counter
var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

WebSiteSchema.pre('save', function(){
  var self = this;
  counter.findByIdAndUpdate(
    {_id: 'entityId'},
    {$inc:{req:1}},
    function(err,data){
      if(err){
        return next(err)
      }
      self.short_url = data.seq;
      next();
    }
  )
})
```
pre是前置中间件操作，相当于其他语境的拦截器，在保存WebSite实例前调用计数器counter的findByIdAndUpdate。pre作用在Schema级别上，因此要在使用Schema生成model前定义才会生效。

#### 区间条件
```
/*
* collection{
*    userId:String,
*    from:Date,
*    to:Date,
*    limit:Number
*}
*/
var getLog = function(collection,callback){
  let queryCondition = {userId:collection.userId}
  if(collection.from){
    queryCondition.date = (queryCondition.date || {});
    queryCondition.date['$gte'] = collection.from;
  }
  if(collection.to){
    queryCondition.date = (queryCondition.date || {});
    queryCondition.date['$lt'] = collection.to;
  }
  console.log('query conditions:',queryCondition)
  let query = Exercise.find(queryCondition)
  if(collection.limit){
    query = query.sort({'date': -1}).limit(collection.limit)
  }
  query.exec(callback)
}
```

#### 关联查询 population （存目）