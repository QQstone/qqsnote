---
title: Date
date: 2018-12-31 17:16:02
tags:
- javascript
categories: 
- 编程语言
---
方法|描述
---|:--
getDate()|从 Date 对象返回一个月中的某一天 (1 ~ 31)。
getDay()|从 Date 对象返回一周中的某一天 即星期几 (0 ~ 6)。
getMonth()|从 Date 对象返回月份 (0 ~ 11)。
getFullYear()|从 Date 对象以四位数字返回年份。
getHours()|返回 Date 对象的小时 (0 ~ 23)。
getMinutes()|返回 Date 对象的分钟 (0 ~ 59)。
getSeconds()|返回 Date 对象的秒数 (0 ~ 59)。
getMilliseconds()|返回 Date 对象的毫秒(0 ~ 999)。
getTime()|返回 1970 年 1 月 1 日至今的毫秒数。
getTimezoneOffset()|返回本地时间与格林威治标准时间 (GMT) 的分钟差。
getUTCDate()|根据世界时从 Date 对象返回月中的一天 (1 ~ 31)。
getUTCDay()|根据世界时从 Date 对象返回周中的一天 (0 ~ 6)。
getUTCMonth()|根据世界时从 Date 对象返回月份 (0 ~ 11)。
getUTCFullYear()|根据世界时从 Date 对象返回四位数的年份。
getUTCHours()|根据世界时返回 Date 对象的小时 (0 ~ 23)。
getUTCMinutes()|根据世界时返回 Date 对象的分钟 (0 ~ 59)。
getUTCSeconds()|根据世界时返回 Date 对象的秒钟 (0 ~ 59)。
getUTCMilliseconds()|根据世界时返回 Date 对象的毫秒(0 ~ 999)。
parse()|返回1970年1月1日午夜到指定日期（字符串）的毫秒数。
setDate()|设置 Date 对象中月的某一天 (1 ~ 31)。
setMonth()|设置 Date 对象中月份 (0 ~ 11)。
setFullYear()|设置 Date 对象中的年份（四位数字）。
setYear()|请使用 setFullYear() 方法代替。
setHours()|设置 Date 对象中的小时 (0 ~ 23)。
setMinutes()|设置 Date 对象中的分钟 (0 ~ 59)。
setSeconds()|设置 Date 对象中的秒钟 (0 ~ 59)。
setMilliseconds()|设置 Date 对象中的毫秒 (0 ~ 999)。
setTime()|以毫秒设置 Date 对象。
setUTCDate()|根据世界时设置 Date 对象中月份的一天 (1 ~ 31)。
setUTCMonth()|根据世界时设置 Date 对象中的月份 (0 ~ 11)。
setUTCFullYear()|根据世界时设置 Date 对象中的年份（四位数字）。
setUTCHours()|根据世界时设置 Date 对象中的小时 (0 ~ 23)。
setUTCMinutes()|根据世界时设置 Date 对象中的分钟 (0 ~ 59)。
setUTCSeconds()|根据世界时设置 Date 对象中的秒钟 (0 ~ 59)。
setUTCMilliseconds()|根据世界时设置 Date 对象中的毫秒 (0 ~ 999)。
toSource()|返回该对象的源代码。
toString()|把 Date 对象转换为字符串。
toTimeString()|把 Date 对象的时间部分转换为字符串。格式如：09:58:59 GMT+0800 (China Standard Time)
toDateString()|把 Date 对象的日期部分转换为字符串。格式如：Wed Nov 10 2021
~~toGMTString()|请使用 toUTCString() 方法代替。~~
toUTCString()|根据世界时，把 Date 对象转换为字符串。Wed, 10 Nov 2021 02:00:48 GMT
toLocaleString()|根据本地时间格式，把 Date 对象转换为字符串。11/10/2021, 10:01:19 AM
toLocaleTimeString()|根据本地时间格式，把 Date 对象的时间部分转换为字符串。10:01:19 AM
toLocaleDateString()|根据本地时间格式，把 Date 对象的日期部分转换为字符串。11/10/2021
UTC()|根据世界时返回 1970 年 1 月 1 日 到指定日期的毫秒数。
valueOf()|返回 Date 对象的原始值。

月份的英文缩写
+ 使用数组 
  \['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][(new Date()).getMonth()]
+ 使用格式化字符串
  (new Date()).toDateString().split(" ")[1]

星期同理
```
Date.property.format=function(format){
    // eg: format="yyyy-MM-dd hh:mm:ssS"
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3)/3), //quarter
        "S": this.getMilliseconds()
    };
    if(/(y+)/.test(format)){
        format = format.replace(RegExp.$1,(this.getFullYear) + "").substr(4 - RegExp.$1.length)
    }
    for(var k in o){
        if(new RegExp("(" + k + ")").test(format)){
            format = format.replace(RegExp.$1, RegExp.$1.length == 1?o[k]:("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
```