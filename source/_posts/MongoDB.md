---
title: MongoDB
date: 2019-07-31 18:36:52
tags:
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