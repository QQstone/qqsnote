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

安装
```
pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple opencv-python
```
读取显示图像
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
缩放
```
result = cv2.resize(src, (200,100))
```
像素操作
```
#矩阵运算

#拷贝区域
ball=img[280:340,330:390]
img[273:333,100:160]=ball
```
通道
```
#通道顺序与R-G-B顺序相反
b,g,r=cv2.split(img)
#b=img[:,:,0]
img=cv2.merge(b,g,r)
```
阈值
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
卷积和滤波
设想3*3矩阵 对中心位置像素值做卷积运算 其作用即一种平滑滤波

膨胀和腐蚀，开运算和闭运算 


自适应阈值

联通区域计数