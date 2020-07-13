---
title: WebGL教程
date: 2019-09-12 14:45:02
tags:
- WebGL
categories: 
- 图像处理
---
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

