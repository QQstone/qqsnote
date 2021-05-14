---
title: graphQL
date: 2021-05-14 13:45:05
tags:
- GraphQL
---
#### OData和GraphQL
用了微软家的OData，就不得不再看一遍GraphQL，两者都让前端调用api获得了很大的自由度
相比OData的底层渗透性，GraphQL只在Http接口层做文章，实际上将底层模型封装成schema，开放给接口，这个过程更大程度上做到了安全性和前端业务的可控。
#### Quick Start 
见官方[GraphQL Doc：各种语言实现](https://graphql.cn/code/#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E5%BA%93)
```
var express = require('express');
var {graphqlHTTP} = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    heros: [Hero]
    battle(name:String): String
    random: Float!
  }
  type Hero{
    name:String
    abilities: [String]
}
`);

var root = { heros: () => ([
        {
            name: 'Luke skywalker',
            abilities: ['light sward', 'force']
        },
        {
            name: 'Anakin skywalker',
            abilities: ['light sward', 'force', 'dark']
        }
    ]),
    battle: (name) => {
        return 'I am your father';
      },
      random: () => {
        return Math.random();
      }
 };

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(3000, () => console.log('Now browse to localhost:3000/graphql'));
```
关于graphqlHTTP(也就是GraphiQL客户端)的Options：
schema是查询涉及的类型声明， rootValue api的查询方法的集，详见下文章节
#### schema 类型声明
```
var schema = buildSchema(`
    type Hero {
        name: String!
        abilities: [String!]!
        length(unit: LengthUnit = METER): Float
    }
`);
```
标量类型
+ ID
+ String
+ Boolean
+ Int Float
注意 ！表示非空
枚举
```
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

接口和实现接口的类型
```
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}
```

联合类型
```
union SearchResult = Human | Droid | Starship
```

#### 操作类型
+ query 查询：获取数据、查找
+ mutation 变更：对数据进行变更，比如增加、删除、修改
+ substription 订阅：当数据发生更改，进行消息推送

#### GraphQL client
前面的express-graphQL启动后打开GraphiQL页面，GraphiQL就是一个客户端，使用GraphQL client向 GraphQL 服务器上的入口端点发送一个 HTTP POST 请求，其中将 GraphQL 查询作为 JSON 载荷的 query 字段，就能调用 GraphQL 服务器。
其js实现大致是
```
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: "{ hello }"})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```
#### 查询参数
schema 中的 Query声明了若干查询方法，查询方法的具体实现在root中定义，其参数类型的指定格式与typescript相同！
调用格式如下
```
{
  battle(name:"dark lord")
}
```