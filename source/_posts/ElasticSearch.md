---
title: ElasticSearch
date: 2021-04-02 09:45:57
tags:
---
参考https://www.cnblogs.com/dreamroute/p/8484457.html
#### 全文搜索引擎
‘全文检索’不是ElasticSearch，ElasticSearch是一个开源的基于全文搜索引擎（Apache Lucene）的搜索和分析引擎。

全文搜索引擎面向文档型存储，即插入其数据库的每条记录作为一个文档，搜索引擎为提取文档的词，生成索引，通过查询索引达到搜索目标文档的目的。这种先建立索引，再对索引进行搜索的过程就叫全文检索（Full-text Search）
![](https://tvax3.sinaimg.cn/large/a60edd42ly1gp57m8a30oj20nm0k4wis.jpg)
#### 文档-类型-索引
关系数据库：      ⇒ 数据库 ⇒ 表    ⇒ 行    ⇒ 列(Columns)

Elasticsearch：  ⇒ 索引(Index)   ⇒ 类型(type)  ⇒ 文档(Docments)  ⇒ 字段(Fields)  
#### 二叉树 倒排
#### Kibana
ElasticSearch的可视化仪表盘