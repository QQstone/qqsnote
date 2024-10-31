---
title: WebGL教程
date: 2019-09-12 14:45:02
mathjax: true
tags:
- WebGL
categories: 
- 图像处理
---
#### RoadMap
[webgl学习路线](https://juejin.cn/post/7383894634156130313?searchId=20240703103839DF2909CC9BD7E7EF9519)
#### 目标导向
keyWords: 渲染引擎开发 shader设计优化
#### 三维模型的平面投影————矩阵运算
[图解webgl](https://juejin.im/entry/58fdb9b544d9040069ef2488)
#### WebGLRenderingContext

```
const canvas = document.getElementById('webgl');
// if webgl context isnot exist, init it 
const webgl = canvas.getContext('webgl');

// Set clear color to black, fully opaque
webgl.clearColor(0.0, 0.0, 0.0, 1.0);
// Clear the color buffer with specified clear color
webgl.clear(webgl.COLOR_BUFFER_BIT);
```
color 是float 0.0~1.0 映射 0~255<br>
颜色缓冲区（COLOR_BUFFER_BIT），其他还有深度缓冲区（DEPTH_BUFFER_BIT）模板参数缓冲区（STENCIL_BUFFER_BIT）参考 [官方标准](www.khronos.org)
#### vs fs shader

#### 着色器函数
```
 private initShader(gl:WebGLRenderingContext, vertexShaderSource:string, fragmentShaderSource:string) {
    //创建顶点着色器对象
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    //创建片元着色器对象
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //创建程序对象program
    let program = gl.createProgram();
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接program
    gl.linkProgram(program);
    //使用program
    gl.useProgram(program);
    //返回程序program对象
    return program;
  }
```
#### 着色器
着色器是使用 OpenGL ES Shading Language(GLSL)编写的程序，它携带着绘制形状的顶点信息以及构造绘制在屏幕上像素的所需数据，换句话说，它负责记录着像素点的位置和颜色。<br>
顶点着色器（Programmable Vertex Processor）和 片元着色器（Programmable Fragment Processor）
```
var vertexShaderSource = '' +
//attribute声明vec4类型变量apos
'attribute vec4 apos;' +
'void main(){' +
//顶点坐标apos赋值给内置变量gl_Position
'   gl_Position =apos;' +
'}';

//片元着色器（Programmable Fragment Processor）源码
let fragShaderSource = '' +
'void main(){' +
//定义片元颜色
'   gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
'}';

//初始化着色器
let program = this.initShader(this.gl, vertexShaderSource, fragShaderSource);
//获取顶点着色器的位置变量apos
var aposLocation = this.gl.getAttribLocation(program, 'apos');
```
#### 标量 向量 张量
+ 标量 scalar
+ 向量 vendor
+ 张量 tensor 与矢量相类似，定义由若干坐标系改变时满足一定坐标转化关系的有序数组成的集合为张量。

> 在二维空间里，二维二阶张量（平面应力张量）的每个方向都可以用二维空间两个方向表示。（区分2阶张量的2个方向，和二维空间的两个方向x，y）所以共有2^2=4个方向。
在三维空间里，三维二阶张量（空间应力张量）的每个方向都可以用三维空间三个方向表示。（区分2阶张量的2个方向，和三维空间的三个方向x，y、z）所以共有3^2=9个方向。[通俗理解张量tensor](https://www.jianshu.com/p/2a0f7f7735ad)

三维空间内的向量根据笛卡尔坐标系的x,y,z三个基向量分解为三个分量 故
$$v=\left[
 \begin{matrix}
   v_x \\
   v_y \\
   v_z 
  \end{matrix}
  \right]$$

而三维二阶张量，其物理含义是某点分解为三个两两正交的平面以及每个平面上的力（力是向量 其自有三个分量）3×3共9个分量
![](https://i0.wp.com/tvax1.sinaimg.cn/large/a60edd42gy1gvv4q8pv40j20fl09m0t8.jpg)
如视频截图 方块表示每个分量上的值(模值，标量)
$$t=\left[
 \begin{matrix}
   v_{xx} & v_{xy} & v_{xz} \\
   v_{yx} & v_{yy} & v_{xz} \\
   v_{zx} & v_{xy} & v_{zz} 
  \end{matrix}
  \right]$$
[应力张量](https://pencilq.com/38/)
[通俗地理解张量](https://www.zhihu.com/question/23720923/answer/32739132)

#### mesh polygon nurbs
mesh是曲面 在计算机三维处理中常以polygon(多边形)来实现
NURBS （Non-uniform rational basis spline非均匀有理基本样条）基于数学公式表达的曲面，但在计算机三维处理中实现 还是需要差值以及polygon