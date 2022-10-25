---
title: OpenCV
date: 2022-06-27 22:34:15
tags:
- OpenCV
categories: 
- 图像处理
---
> OpenCV是计算机视觉领域应用最广泛的开源工具包，基于C/C++，支持Linux/Windows/MacOS/Android/iOS，并提供了Python，Matlab和Java等语言的接口

+ core：核心模块，主要包含了OpenCV中最基本的结构（矩阵，点线和形状等），以及相关的基础运算/操作。
+ imgproc：图像处理模块，包含和图像相关的基础功能（滤波，梯度，改变大小等），以及一些衍生的高级功能（图像分割，直方图，形态分析和边缘/直线提取等）。
+ highgui：提供了用户界面和文件读取的基本函数，比如图像显示窗口的生成和控制，图像/视频文件的IO等。
如果不考虑视频应用，以上三个就是最核心和常用的模块了。针对视频和一些特别的视觉应用，OpenCV也提供了强劲的支持：
+ video：用于视频分析的常用功能，比如光流法（Optical Flow）和目标跟踪等。
+ calib3d：三维重建，立体视觉和相机标定等的相关功能。
+ features2d：二维特征相关的功能，主要是一些不受专利保护的，商业友好的特征点检测和匹配等功能，比如ORB特征。
+ object：目标检测模块，包含级联分类和Latent SVM
+ ml：机器学习算法模块，包含一些视觉中最常用的传统机器学习算法。
+ flann：最近邻算法库，Fast Library for Approximate
+ Nearest Neighbors，用于在多维空间进行聚类和检索，经常和关键点匹配搭配使用。
+ gpu：包含了一些gpu加速的接口，底层的加速是CUDA实现。
+ photo：计算摄像学（Computational Photography）相关的接口，当然这只是个名字，其实只有图像修复和降噪而已。
+ stitching：图像拼接模块，有了它可以自己生成全景照片。
+ nonfree：受到专利保护的一些算法，其实就是SIFT和SURF。
+ contrib：一些实验性质的算法，考虑在未来版本中加入的。
+ legacy：字面是遗产，意思就是废弃的一些接口，保留是考虑到向下兼容。
+ ocl：利用OpenCL并行加速的一些接口。
+ superres：超分辨率模块，其实就是BTV-L1（Biliteral Total Variation – L1 regularization）算法
+ viz：基础的3D渲染模块，其实底层就是著名的3D工具包VTK（Visualization Toolkit）。

#### 安装
```
pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple opencv-python
```
#### 读取显示图像
```
img = cv2.imread('singlemushroom.jpg', cv2.IMREAD_UNCHANGED)
cv2.imshow("origin image", img)

img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

cv2.imshow("gray image", img_gray)

cv2.waitKey(0)
cv2.destroyAllWindows()

# 写入图像
cv2.imwrite("originImage.jpg", img)
```
#### 缩放
```
result = cv2.resize(src, (200,100))
```
#### 像素操作
```
#矩阵运算

#拷贝区域
ball=img[280:340,330:390]
img[273:333,100:160]=ball
```
#### 通道
```
#通道顺序与R-G-B顺序相反
b,g,r=cv2.split(img)
#b=img[:,:,0]
img=cv2.merge(b,g,r)
```
#### 阈值
```
#读取图片
src = cv2.imread('miao.jpg')

#灰度图像处理
GrayImage = cv2.cvtColor(src,cv2.COLOR_BGR2GRAY)

#二进制阈值化处理
r, b = cv2.threshold(GrayImage, 127, 255, cv2.THRESH_BINARY)
#THRESH_BINARY 超过阈值像素设为最大值 否则为0
#THRESH_BINARY_INV 超过阈值像素设为0 否则为最大值
#THRESH_TRUNC 大于阈值部分设为最大值 否则不变
#THRESH_TOZERO 大于阈值部分不变 否则设为0
#THRESH_TOZERO_INV 大于阈值部分设为0 否则不变
print(r)

#显示图像
cv2.imshow("src", src)
cv2.imshow("result", b)
```
自适应阈值 adapativeThreshold
```
adaptiveThreshold(src, maxValue, adaptiveMethod, thresholdType, blockSize, C[, dst])
```
+ maxValue 满足条件的最大值
+ adaptiveMethod 自适应方法 ADAPTIVE_THRESH_MEAN_C ADAPTIVE_THRESH_GAUSSIAN_C
 ADAPTIVE_THRESH_MEAN_C的计算方法是计算出领域的平均值再减去 C；ADAPTIVE_THRESH_GAUSSIAN_C的计算方法是计算出领域的高斯均值再减去C
+ thresholdType 阈值类型 THRESH_BINARY 或者 THRESH_BINARY_INV
+ blockSize 邻域大小 如 3，5，7
+ C 阈值偏移量
```
thresh1 = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
thresh2 = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 31, 3)
thresh3 = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
thresh4 = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 3)
```

#### 卷积和滤波
设想3*3矩阵 对中心位置像素值做卷积运算 其作用即一种平滑滤波
```
#高斯滤波
gaussianBlur = cv2.GaussianBlur(greyImg, (3,3), 0)
```
#### 膨胀和腐蚀，开运算和闭运算 
```
#腐蚀
kernel=np.ones((5,5),np.uint8)
erosion=cv2.erode(img,kernel,iterations=1) 
#iterations 为重复次数
#膨胀
kernel=np.ones((5,5),np.uint8)
dilate=cv2.dilate(img,kernel,iterations=1)
```
开为先腐蚀再膨胀 闭为先膨胀后腐蚀

#### 边缘检测Sobel canny Laplace
```

```
#### FindContour
一种边缘提取方法

```
contours,_=cv2.findContours(img,RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
```
+ 参数1 二值图像
+ 参数2 轮廓返回模式（**RETR_EXTERNAL**: 表示只检测最外层轮廓；**RETR_LIST**: 提取所有轮廓，并放置在list中，检测的轮廓不建立等级关系； **RETR_TREE**: 提取所有轮廓并重新建立网状轮廓结构 ）
+ 参数3 遍历发现方法（**CHAIN_APPROX_NONE**：获取每个轮廓的每个像素，相邻的两个点的像素位置差不超过1；**CHAIN_APPROX_SIMPLE**：压缩水平方向，垂直方向，对角线方向的元素，值保留该方向的重点坐标，如果一个矩形轮廓只需4个点来保存轮廓信息 ）
[用findcontour去孔洞](https://wenku.baidu.com/view/0349bd53a717866fb84ae45c3b3567ec102ddcda.html)

#### drawContours
cv2.drawContours()
```
cv2.drawContours(image, contours, contourIdx, color, thickness=None, lineType=None, hierarchy=None, maxLevel=None, offset=None)
```
+ image 原图像
+ contours 轮廓集合 例如findContours获得的集合
+ contourIdx 指定绘制轮廓list中的哪条轮廓，如果是-1，则绘制其中的所有轮廓。
+ color 颜色
+ thickness 轮廓线的宽度，如果是-1（cv2.FILLED），则为填充模式。
```

```
#### 外接矩形
```
x, y, w, h = cv2.boundingRect(contour)
img = cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 1)
cv2.imshow(img)
```
#### 区域质心位置
```
mu = cv2.moments(contour, False)
mc = [mu['m10']/mu['m00'], mu['m01']/mu['m00']]
```
#### 联通区域计数
[CSDN Blog:连通区域分析算法](https://blog.csdn.net/qq_40467656/article/details/109214792)

#### floodFill填充孔洞

#### 掩膜
或者叫蒙版 将感兴趣区域（Region of Interest, ROI）提取出来 掩盖其他区域. 
```
h, w = gaussianBlur.shape
mask = np.zeros((h, w), np.uint8)
cv2.fillPoly(mask, [capContour], (255, 255, 255))
roi = cv2.bitwise_and(GrayImage, GrayImage, mask=mask)
cv2.imshow('roi', roi)
```
#### 直方图
反映像素的值在图像中的分布，值范围分段，进行统计，值可以是亮度，或任意色彩通道的分量
直方图可以作为阈值分割的参数选择依据
```
import cv2  
import numpy as np
import matplotlib.pyplot as plt

#读取图像
src = cv2.imread('orign.bmp')

#绘制直方图
plt.hist(src.ravel(), bins=256, density=1, facecolor='green', alpha=0.75)
plt.xlabel("x")
plt.ylabel("y")
plt.show()

#显示原始图像
cv2.imshow("src", src)
cv2.waitKey(0)
cv2.destroyAllWindows()
```
+ src.ravel()将二维图像数据展成一维
+ BINS 分若干组
+ DENSITY 密度
+ FACECOLOR 直方图颜色
+ ALPHA