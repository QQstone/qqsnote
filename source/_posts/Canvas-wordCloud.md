---
title: Canvas-wordCloud
date: 2021-04-25 14:52:09
mathjax: true
tags:
- canvas
- javascript
---
### 基础
```
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

ctx.beginPath()
ctx.arc(75,75,50,0,Math.PI*2,true);//以(75, 75)为圆心50为半径绘制从0~2pi的圆弧，true为顺时针
ctx.stroke() //使用线条绘制图形轮廓 相对的fill是填充图形
```
> canvas元素创造了一块固定的画布，它公开了一个或多个渲染上下文，其可以用来绘制和处理要展示的内容。
getContext('2d')提供了二维渲染上下文 并没有‘3d’参数，而是‘webgl’或‘webgl2’ 见[GetContext MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext)
### hexo tag cloud
[Hexo plugin: hexo-tag-cloud](https://github.com/D0n9X1n/hexo-tag-cloud)
该项目使用使用胶水语言(如swig)，将tagCanvas.js植入Hexo项目
[tagCanvas.js 库](https://www.goat1000.com/tagcanvas.php)
在本项目qqsnote中，并按hexo-tag-cloud的README示意的没有集成到sidebar,而是集成到了theme/next/layout/page.swig，并按tagCanvas.js 库文档示意设置了权重显示模式

#### 在屏幕上画一个立体球
看一眼 [吖猩的3D旋转球](https://github.com/whxaxes/canvas-test/blob/master/src/3D-demo/3Dball.html)

在球面的经纬焦点处绘制粒子，从球心到球半径R分n层纬度，2n经度，则共4n<sup>2</sup>+2n个点
假设在每个点处放置半径r的粒子小球，小球在二维屏幕的投影用arc绘制填充即可，投影圆的位置为(x,y)，z=(R<sup>2</sup>-x<sup>2</sup>-y<sup>2</sup>)<sup>1/2</sup>
有意思的来了：球在二维的投影，位置(远近z)反映在投影上是投影圆的半径(也可以进而根据这个比例设置opacity)，两个成像物体成像到固定像平面，像高r与物距l的关系是
r'/r = (l-f)/(f-z)
当l=2f时成像与物体等大 即r'=f/(f-z)*r
```
<script type="text/javascript">
    // init webgl
    const canvas = document.getElementById('wordCloud')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const vpx = canvas.width/2 // 圆心偏移原点(0,0) 使x，y不为负数
    const vpy = canvas.height/2
    const R = 300
    // z: [-300 300]
    f = 600 
    opacity_min = 0.3
    const atoms=[]
    // solid ball 经纬
    // 粒子
    const atom = function(x,y,z,r){
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
    }
    atom.prototype.paint=function(){
        ctx.save() //?
        ctx.beginPath()
        const r_projection = this.r*f/(f-this.z) // projection 投影
        ctx.arc(vpx+this.x,vpy+this.y,this.r,0,Math.PI*2,true)
        ctx.fillStyle=`rgba(255,255,255,${opacity_min + (R+this.z)/2/R})`
        ctx.fill()
        ctx.restore()
    }
    const N = 5
    for(let k=-N; k<=N; k++){ // 2N+1个纬度
        const R_latitude = Math.pow(R*R - Math.pow(R*k/N,2),0.5)
        for(let i = 0; i<2*N; i++){ // 2N条经线
            const x = R_latitude*Math.cos(i*Math.PI/N)
            const y = R_latitude*Math.sin(i*Math.PI/N)
            const z = k/N*R
            const a = new atom(x,y,z,1.5)
            a.paint()
            atoms.push(a)
        }
    }
</script>
```
![五层纬度球](https://i0.wp.com/tvax4.sinaimg.cn/large/a60edd42ly1gpy2efigmqj20o20mcq2u.jpg)

如上相当于从z轴方向俯视一个球，了解另一种“撒点”方式:
球坐标点(R, θ, φ)
![球坐标系](https://tva3.sinaimg.cn/large/a60edd42ly1gpy37k5u8sj208c07g0so.jpg)
x = R * sinθ * sinφ
y = R * sinθ * cosφ
z = R * cosθ
θ不取0和180就可以避免出现‘南北极’(上面的算法中极点是一圈粒子重合在一起)
设共N个粒子，i取[0, N)
找一个f(i)取值(-1, 1) 作为cosθ 那就f(i) = 2*(i + 1)/N - 1
找一个g(i)
#### 旋转
绕z轴 转过角度θ
$$
\left[
 \begin{matrix}
   x' \\
   y' 
  \end{matrix}
  \right]=
 \left[
 \begin{matrix}
   cosθ & -sinθ \\
   sinθ & cosθ 
  \end{matrix}
  \right]·
  \left[
 \begin{matrix}
   x \\
   y 
  \end{matrix}
  \right]
$$
[旋转矩阵的推导](https://zhuanlan.zhihu.com/p/102814853)

实际上绕z旋转在投影屏幕上就是同心圆环绕，并没有粒子的前后(z)不变，也难以用一个二维的变量控制，因此前辈们都使用将鼠标(x, y)的偏移对应并分解到绕x，y轴的旋转之实现
旋转矩阵是相同的
```
let angleX = angleY = 0
function rotateX(angle){
    atoms.forEach(atom=>{
        const y = atom.y*Math.cos(angle) - atom.z*Math.sin(angle) 
        const z = atom.y*Math.sin(angle) + atom.z*Math.cos(angle)
        atom.y = y
        atom.z = z 
    })
}
function rotateY(angle){
    atoms.forEach(atom=>{
        const z = atom.z*Math.cos(angle) - atom.x*Math.sin(angle) 
        const x = atom.z*Math.sin(angle) + atom.x*Math.cos(angle)
        atom.z = z
        atom.x = x 
    })
}
function rolling(){ // click事件，点击一下随机绕x或y转十分之一圆周
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(Math.random()>0.5){
        rotateX(Math.PI/36)
    }else{
        rotateY(Math.PI/36)
    }
    atoms.forEach(atom=>{
        atom.paint()
    })
}
```
根据鼠标偏移控制旋转角度
```
canvas.addEventListener('mousemove',function(e){
    var x = e.clientX - vpx
    var y = e.clientY - vpy
    angleX = -x*0.00001
    angleY = -y*0.00001
})
```
对于博客，该事件加在body上，使整个页面上都可以响应鼠标位置，相应的应减去球心位置偏移 (canvas.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft, canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop)
#### window.requrestAnimationFrame
> 告诉浏览器:你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

因为渲染canvas和执行js不是一个线程，使用for循环来串起动画是行不通的，setInterval和setTimeout倒可以使用
```
let start
function animation(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!start){
        start = timestamp
    }
    rotateX(angleX)
    rotateY(angleY)
    atoms.forEach(atom=>{
        atom.paint()
    })
    const elapsed = timestamp - start
    if(true){
        requestAnimationFrame(animation)
    }
}
requestAnimationFrame(animation)
```
