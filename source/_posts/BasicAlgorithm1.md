---
title: 基本算法-String, Array
date: 2018-07-31 17:00:18
tags: 
- 字符串操作
---
>实现字符串翻转方法
```
function reverseString(str) {
    var litters=str.split("");
    var rlitters=litters.reverse();
    return rlitters.join("");
}
reverseString("hello");
```
#### 区分String方法split以及Array方法slice, splice
split 以特定字符或正则表达式为标记，将字符串分割为字符串数组
slice 以起止下标为界切片返回新数组，原数组不受影响
splice 以起止下标为界切片从数组中剔除

常用到的将含length的对象转为数组用
```
Array.prototype.slice.call(a)
```
>实现数字千位分隔符
```
function kiloFormat(num){
	num=num.toString().split(".");//区分整数部分和小数部分
	num[0]=num[0].split("").reverse();//整数部分数组化并翻转
	num[0]=num[0].map((item,i)=>{
	if(i%3==0&&i!=0){
		return item+=",";
}else{return item;}
});
num[0]=num[0].reverse().join("");
return num.join(".");
}
```
```
// 另 正则表达式实现
function thousandBitSeparator(num) {
    return num && num
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
        });
}
```