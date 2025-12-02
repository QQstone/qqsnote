---
title: 数据结构和算法
date: 2021-04-23 15:13:25
tags:
- 算法
---
#### 数据结构——图

各元素之间有路径 如a1 -> a2, a2 -> a4, a3 -> a1

根据路径的指向 给每个元素统计**入度**和**出度**

例 寻找小镇法官问题

题解即求是否存在入度为n出度为0的节点

例 课程表问题：该学期必须选修 numCourses 门课程 课程存在的前置关系数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi]

约定俗成地，用两个节点对表示图上的有向路径 某节点有多条路径 在图关系列表中 就有多项 包含该节点元素

题解思路 入度为0的课程xi可直接选 以xi为前置的课程随后可选 以此类推 可选课程等于 numCourses 即可完成学期课程任务

#### 数据结构——堆(heap)

数据结构中的堆是完全二叉树(从上到下、从左到右连续性) 通常依序以长列表的形式存储在计算机中

若以1~n为序号 任意i∈n节点 左右子节点分别是2i，2i+1

堆排序 就是将数据整理成大根堆(根节点均大于等于子节点)或小根堆(根节点均小于等于子节点)，js并不像C++、Java等面向对象语言提供了堆结构的Api, 堆排的js实现复杂 手写容易出错。且记堆排序时间复杂度O(nlogK) 

对于形似堆结构的题目 退而求其次使用sort api和循环计数的方式完成

~~应用场景如 top K问题：找出数组中最大/小的count个数~~

桶排序问题

堆型数据结构的问题 有时可以用桶排序的方式解。 所谓桶排序 就是将项放到某集合中 通过对集合进行排序 筛选出解

如 返回前k高频元素

```js
// 桶排
var createBucket = (nums)=>{
    // value - frequency Map
    const map = new Map()
    nums.forEach(val=>{
        if(map.get(val)){
            map.set(val, map.get(val)+1)
        }else{
            map.set(val,1)
        }
    })
    //console.log('map:',map)
    return map
}
var topKFrequent = function(nums, k) {
    const map = createBucket(nums)
    const arr = [] // 相同频次(freq)的value 归并到一起 作为arr的一项 该项放到arr的下标为req的位置
    const res = []
    map.forEach((freq,key)=>{
        if(arr[freq]){
            arr[freq].push(key)
        }else{
            arr[freq] = [key]
        }
    })
    //console.log('arr:',arr)
    for(i=arr.length-1;i>=0&&res.length<k;i--){
        if(arr[i]){
            res.push(...arr[i])
        }
    }
    return res
}
```

#### 数据结构——栈

#### 数据结构——队列

#### 数据结构——链表

至少两部分：数据域&指针域 链表没有索引 查找复杂度O(n)

```js
class Node(){
    constructor(data){
        this.data = data
        this.next = null
    }
}

const head = new Node(1)
head.next = new Node(2)

// 输出链表
let point = head
let res = ''
while(point){ // 若链表有环 循环不会停止
    res+=`${point.data}->`
    point = point.next
}
console.log(res)
```

检查链表是否有环

+ 节点放入集合(如Set)遍历中利用Set.has(point)检查是否存在此节点对象

+ 快慢指针 遍历环时必会套圈 无环则快指针先跳出循环

```js
fast = head
slow = head
while(fast && fast.next){
    slow = slow.next
    fast = fast.next.next

    if(fast === slow){
        return true
    }
}
return false
```

双向链表 克服单向链表逆序查找困难的问题

```js
class Snode{
    constructor(val,next = null){
        this.data = val
        this.next = next
    }
}
class Dnode{
    constructor(val, perv = null, next = null){
        this.data = val
        this.next = next
        this.prev = perv
    }
}
// test case
let head = new Snode(null)
let node = head
for(let val of [1,2,3,4,5]){
console.log(val)
    node.next = new Snode(val)
    node = node.next
}
head = head.next
// constructed test case

const dhead = new Dnode(head.data)
let point = head
let dpoint = dhead
while(point.next){
    dpoint.next = new Dnode(point.next.data, dpoint, null)

    point = point.next
    dpoint = dpoint.next
}
console.log(dhead)
```

#### 数据结构——数组

#### 数据结构——矩阵

#### 数据结构——字符串

#### 数据结构——哈希表

#### 数据结构——二叉树

遍历顺序(前、中、后)指的是根节点在遍历时的先后顺序 均为递归遍历 深度优先

二叉树的广度优先遍历(层序遍历)

#### 算法——广度优先搜索(BFS)

#### 算法——深度优先搜索(DFS)

#### 算法——滑动窗口

滑动窗口本质是双指针问题 一 在一个游标(指针)基础上 移动另一个游标 判断符合条件 然后分情况移动左右游标

三数之和

数组中任意三数之和 与目标数值最接近的

```js
function nearThreeSumary(arr, target) {
    arr.sort((a, b) => (a - b))
    let distance = Number.MAX_VALUE
    res = []
    for (let i = 0; i < arr.length-3; i++) {
        let left = i + 1
        let right = arr.length - 1
        while (left < right) {
            const sum = arr[i] + arr[left] + arr[right]
            if (Math.abs(target - sum) < distance)
                res = [arr[i], arr[left], arr[right]]
            distance = target - sum
            console.log([arr[i], arr[left], arr[right]], sum)
            if (target > sum) {
                left++
            } else if (target < sum) {
                right--
            } else {
                return res
            }
        }
    }
    return res
}
```

两数之和的问题利用的就是left right双指针，三数之和的问题是在两数之和基础上固定一个。

#### 算法——动态规划(DP)

爬楼梯问题被称为动态规划

统计一步两步上楼方式 f(n) = f(n-1) + f(n-2)只是个简单的迭代方法

每级台阶设上权重 即爬楼梯最小开支问题

> 整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用(起点和终点不在数组中)。你可以选择从下标为 0 或下标为 1 的台阶开始爬楼梯。

下面是个错误题解！迭代较大数组时计算开销激增 甚至测试用例运行超时

```js
var minCostClimbingStairs = function(cost) {
    if(cost.length<=1) return 0

    // up1
    const pay1 = minCostClimbingStairs(cost.slice(0,cost.length-1))  + cost[cost.length-1]
    // up2
    const pay2 = minCostClimbingStairs(cost.slice(0,cost.length-2))  + cost[cost.length-2]
    return Math.min(pay1,pay2)
};
```

事实上 return f(n-1) + f(n-2) 的代码在统计上楼方式时已经存在问题 如下统计f(5)时，f(3)重复计算(称为重叠子) 当迭代层级增大时重复计算以指数激增

```cmd
        f(5)
       /    \
    f(4)      f(3)
   /    \    /    \
f(3)  f(2)  f(2)  f(1)
 / \
f(2) f(1)
```

为避免重复计算 要自低阶到高阶 将已经计算的结果(应称为子问题最优解或最优子，并非局部最优解)缓存起来 

```js
var minCostClimbingStairs = function(cost) {
    const dp = []
    dp[0] = 0
    dp[1] = 0
    for(let i=2;i<=cost.length;i++){
        dp[i] = Math.min(dp[i-1] + cost[i-1], dp[i-2]+ cost[i-2])
    }
    return dp[cost.length]
};
```

f(n) = f(n-1) + f(n-2) 斐波那契数列

#### 算法——二分查找

典型的复杂度O(logN)的算法

#### 算法——双指针

快慢指针

对向指针

#### 算法——并查集

#### 算法——位运算

#### 算法——分治

快排的本质也是分治

返回第k大的数 数组值范围大 要求O(n)复杂度

```js
function findKmax(nums, k){
    
    quickSort(nums, 0, nums.length-1)
    function quickSort(nums, left, right){
        // 枢轴
        const pivot = nums.length-1
        quickSort()
    }

    function patition(arr, left, right){
        const pivot = Math.floor(Math.random()*(right - left +1 ) + left)
        let i = left, j = right
        while(i<=j){
            while(arr[i]<arr[pivot]) {
                i++
            }
            while(arr[j]>arr[pivot]){
                j--
            }
            if(i<=j){
                [arr[i],arr[j]] = [arr[j], arr[i]]
            }
        }
        return i
    }
}
```

#### 算法——回溯

#### 算法——贪心

#### 算法——递归

#### 算法——数学
