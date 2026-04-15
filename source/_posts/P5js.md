---
title: P5js
date: 2026-03-30 13:51:58
tags:
---
```
let flowerImg;
let plants = [];
const NUM_PLANTS = 45; // 花朵总数

function preload() {
  // 关键：在这里加载你的手绘花朵模板图片
  // 确保图片背景是透明的 (PNG格式)
  flowerImg = loadImage('./flower.png'); 
}

function setup() {
  createCanvas(600, 800);
  imageMode(CENTER); // 让图片以中心点为基准绘制

  // 初始化所有植物数据
  for (let i = 0; i < NUM_PLANTS; i++) {
    plants.push(new Plant());
  }
}

function draw() {
  // 绘制蓝色渐变背景 (模拟视频里的背景)
  setGradient(0, 0, width, height, color(40, 60, 90), color(120, 160, 200));

  // 绘制花盆 (用简单图形模拟，你也可以替换为 loadImage)
  drawPot();

  // 遍历并绘制每根茎和花朵
  for (let i = 0; i < plants.length; i++) {
    // 利用索引 i 让每根茎的生长开始时间错开，产生层次感
    if (frameCount > i * 4) {
      plants[i].grow();
      plants[i].display();
    }
  }
}

// 定义植物类
class Plant {
  constructor() {
    // 生长起点统一在花盆口中心
    this.startX = width / 2;
    this.startY = height - 150;

    // 关键点1：参差不齐与向外散开
    // 终点的 X 随机向左右散开，Y 随机高度
    this.endX = width / 2 + random(-250, 250);
    this.endY = height - random(300, 650); 

    // 生成贝塞尔曲线的两个控制点，让茎有自然的弯曲弧度
    this.cp1X = this.startX + random(-50, 50);
    this.cp1Y = this.startY - random(50, 100);
    this.cp2X = this.endX + random(-100, 100);
    this.cp2Y = this.endY + random(100, 200);

    // t 代表生长进度，从 0 生长到 1
    this.t = 0; 
    this.speed = random(0.005, 0.015); // 每根茎生长速度不同，增加参差感

    this.flowerScale = 0;
    this.maxFlowerScale = random(0.03, 0.08); // 花朵最终大小随机

    // 关键点2：随机的花朵颜色深浅
    // 使用 tint() 可以在不改变原图结构的情况下叠加颜色
    // 这里生成随机深浅的色调 (以偏黄色调为例，你可以调整 RGB 值)
    let shade = random(100, 255);
    this.flowerTint = color(shade, shade, shade); // 比如让黄色呈现不同深浅
  }

  grow() {
    // 1. 茎先生长
    if (this.t < 1) {
      this.t += this.speed*2;
    } 
    // 2. 茎长到 100% 后，花朵开始膨胀长出
    else if (this.flowerScale < this.maxFlowerScale) {
      this.flowerScale += 0.01; 
    }
  }

  display() {
    noFill();
    stroke(45, 140, 45); // 茎的绿色
    strokeWeight(4);

    // 关键点3：绘制生长的茎
    // 不是直接画一条线，而是计算从起点到当前进度 t 的贝塞尔曲线点
    beginShape();
    for (let i = 0; i <= this.t; i += 0.02) {
      let px = bezierPoint(this.startX, this.cp1X, this.cp2X, this.endX, i);
      let py = bezierPoint(this.startY, this.cp1Y, this.cp2Y, this.endY, i);
      vertex(px, py);
    }
    // 补上当前尖端的精确位置，防止锯齿断层
    let currentX = bezierPoint(this.startX, this.cp1X, this.cp2X, this.endX, this.t);
    let currentY = bezierPoint(this.startY, this.cp1Y, this.cp2Y, this.endY, this.t);
    vertex(currentX, currentY);
    endShape();

    // 当茎长完后，在终点绘制花朵
    if (this.t >= 1 && this.flowerScale > 0) {
      push();
      translate(this.endX, this.endY); // 移动到茎的顶端
      scale(this.flowerScale);         // 花朵缩放动画
      tint(this.flowerTint);           // 应用随机深浅颜色滤镜
      
      // 绘制加载的手绘模板图片
      if (flowerImg) {
        image(flowerImg, 0, 0);
      } else {
        // 如果图片加载失败的备用绘制 (粉色圆圈)
        fill(255, 100, 150);
        noStroke();
        ellipse(0, 0, 50, 50); 
      }
      pop();
    }
  }
}

// --- 辅助函数：绘制渐变背景 ---
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

// --- 辅助函数：绘制简单的花盆 ---
function drawPot() {
  fill(250, 245, 235); // 陶瓷白
  noStroke();
  
  // 盆体
  beginShape();
  vertex(width/2 - 70, height);
  vertex(width/2 + 70, height);
  vertex(width/2 + 90, height - 150);
  vertex(width/2 - 90, height - 150);
  endShape(CLOSE);
  
  // 盆口边缘
  rectMode(CENTER);
  rect(width/2, height - 150, 190, 20, 10);
}
```