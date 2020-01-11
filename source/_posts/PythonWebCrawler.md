---
title: Python爬虫
date: 2020-01-10 17:16:47
tags:
- Python
---
> 爬虫(Web Crawler)

> 郑重声明：本文仅限于编程学习，用于非法目的及造成侵权后果的行为，老子概不负责
#### http请求
私以为，爬虫程序就是以程序执行代替人工操作，在一定范围的网络资源中找自己要的东西。当人做这项枯燥的工作时，无非输入网址--打开网页--用肉眼识别--下载这样子，下面基本上就是用python模拟这个过程。
```
import requests
import re
response = requests.get('https://qqstone.github.io/qqsnote/2019/10/28/MySQL/')
print(response.text)
if response.text.find('主键'):
    print('find it！')
    keyUnicode = str('主键'.encode('unicode_escape')).replace('\\\\','\\')[2:14]
    print('\S*'+keyUnicode+'\S*')
    matchObj = re.findall('\S*'+keyUnicode+'\S*',response.text)
    print(matchObj)
```
#### 反“反爬设置”
有时请求一个网页时，发现无论通过Get或Post以及其他请求方式，都会出现403错误。这种现象多数是由于服务器拒绝了访问，因为这些网页为了防止恶意采集信息，所用的反爬虫设置。<br>
此时可以通过模拟浏览器的header信息来进行访问。
```
import requests
import re
url='https://www.acfun.cn/a/ac12293064'
headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'}
response = requests.get(url,headers=headers)
print(response.text)
```
#### 超时处理

#### 使用代理

#### 解析html树

#### Scrapy框架
依赖：<br>
```
pip install Twisted
# windows平台用下面这个
pip install Twisted[windows_platform]

pip install Scrapy
```
参考 [Scrapy文档](https://docs.scrapy.org/en/latest/)
```
import scrapy
import re


class QuotesSpider1(scrapy.Spider):
    name = "quotes1"
    keyword = ""
    pages = 75

    def start_requests(self):
        url = 'https://xxxxxxx.xxx.html'
        yield scrapy.Request(url=url, callback=self.parse)
        for i in range(2, self.pages):
            surl = url.replace('.html', '-'+str(i)+'.html')
            yield scrapy.Request(url=surl, callback=self.parse_key_word)

    def parse(self, response):
        regexp = r'\d{2}'
        video_list_tags = response.css('h3::attr(title)')
        for vt in video_list_tags:
            #if vt.extract().find(self.keyword) >= 0:
            match_array = re.findall(regexp, vt.extract())

            if len(match_array):
                self.log(vt.extract())
                filename = 'output.log'
                with open(filename, 'a', encoding='utf-8') as f:
                    f.write(vt.extract()+'-->'+response.url+"\n")

    def parse_key_word(self, response):
        video_list_tags = response.css('h3::attr(title)')
        for vt in video_list_tags:
            if vt.extract().find(self.keyword) >= 0:
                self.log(vt.extract())
                filename = 'output.log'
                with open(filename, 'a', encoding='utf-8') as f:
                    f.write(vt.extract() + '-->' + response.url + "\n")

```
执行scrapy实例
```
scrapy crawl quotes1
```