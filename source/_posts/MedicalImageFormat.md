---
title: 医学图像格式
date: 2019-08-08 18:12:55
tags:
- 医学图像
categories: 
- 图像处理
---
### 图像格式

#### Images(or voxel)

dcm (DICOM Image): DICOM的全称是 Digital Imaging and Communications in Medicine (医疗数位影像和传输协定)
它是一组通用的标准协定，可以整合不同厂商的医疗影像仪器、伺服器、工作站、列印机和网络设备
和其他格式不同的是它統合了所有的資訊在同一個資料內，也就是說，如果有一張胸腔X光影像在你的病人個人資料內，這個影像決不可能意外地再從你的病人資料中分離。

#### Meshes
stl (STereoLithography, 立體光刻),用于表示三角形网格的一种文件格式。它的文件格式非常简单，只能描述三维物体的几何信息，不支持颜色材质等信息。
以二进制.stl文件为例，文件起始的80个字节是文件头，用于存贮文件名；紧接着用 4 个字节的整数来描述模型的三角面片个数，后面逐个给出每个三角面片的几何信息。每个三角面片占用固定的50个字节
```
    UINT8//Header//文件头
    UINT32//Numberoftriangles//三角面片数量
    //foreachtriangle（每个三角面片中）
    REAL32[3]//Normalvector//法线矢量
    REAL32[3]//Vertex1//顶点1坐标
    REAL32[3]//Vertex2//顶点2坐标
    REAL32[3]//Vertex3//顶点3坐标
    UINT16//Attributebytecountend//文件属性统计
```
ply (Polygon File Format, 多边形档案),该格式主要用以储存立体扫描结果的三维数值，透过多边形片面的集合描述三维物体,是相较stl更丰富的方式
```
    ply
    format ascii 1.0             ...{ 文件类型：ascii或binary，版本号 }
    comment made by anonymous    ... { 注释行 }
    comment this file is a cube  ...{ 注释行 }
    comment texture file             {纹理贴图文件}
    element vertex 8             ...{ 定义“顶点”元素，其数量为8个 }
    property float32 x           ...{ 顶点的x属性，数据类型为float32 }
    property float32 y           ...{ 顶点的y属性，数据类型为float32 }
    property float32 z           ...{ 顶点的z属性，数据类型为float32 }
    property float32 textureu       {纹理坐标}
    property float32 texturev
    element face 6               ...{ 定义“面”元素，其数量为6个 }
    property list uint8 int32 vertex_index ...{ 面的顶点索引属性，类型为uint8的列表 }
    end_header                   ...{ 文件头结束标志 }
    0 0 0                        ...{ 顶点元素列表 }
    0 0 1
    0 1 1
    0 1 0
    1 0 0
    1 0 1
    1 1 1
    1 1 0
    4 0 1 2 3                    ...{ 面元素列表 顶点数 顶点编号 }
    4 7 6 5 4
    4 0 4 5 1
    4 1 5 6 2
    4 2 6 7 3
    4 3 7 4 0
```
### Marching Cubes Algorithm
    
[维基百科](https://en.wikipedia.org/wiki/Marching_cubes, "Marching Cubes Algorithm")

[Surface Extraction: Creating a mesh from pixel-data using Python and VTK](https://pyscience.wordpress.com/2014/09/11/surface-extraction-creating-a-mesh-from-pixel-data-using-python-and-vtk/)

### 图像处理工具库
#### pydicom
```
import pydicom
ds = pydicom.dcmread(file)
```
#### vtk
三维计算机图形学、图像处理和可视化软件，内核C++构建，具备多种转换界面，支持Java、Python等方式调用
render: camera actor light
data set:

#### itk
ITK 是一个开放源码、面向对象的软件系统，提供一个医学图像处理、图像分割与配准的算法平台
#### xslt

#### PACS
医学影像存档与通信系统（英语：Picture archiving and communication system，PACS）