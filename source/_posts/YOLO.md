---
title: YOLO
date: 2026-03-15 21:07:00
tags:
- YOLO
categories:
- 人工智能
---
## 框架

YOLO(You Only Look Once) 高效目标检测算法框架 与传统目标检测方法不同 可以同时识别出图中多个物体的类别和位置

通常我们获取某个主流实现，如[Ultralytics YOLOv8](https://docs.ultralytics.com/zh/) 其提供了多种安装方案、命令、API等

一键安装Ultralytics YOLO工具箱

```cmd
pip install -U ultralytics
```

上述命令下载安装包括

+ YOLO算法的调用代码 包含了 YOLOv5, YOLOv8, YOLOv11 等不同版本模型的定义、训练、验证和推理的全部 Python 代码。
+ 相关依赖如Pytorch NumPy OpenCV等
+ CLI工具 以支持在终端直接调用yolo命令

使用Ultralytics YOLO几乎不需要编写代码

训练项目形如：

```cmd
my_dataset/
├── images/
│   ├── train/      # 训练图片
│   └── val/        # 验证图片
├── labels/
│   ├── train/      # 训练标签
│   └── val/        # 验证标签
└── data.yaml       # 数据配置文件
```

data.yaml配置：

```yaml
train: my_dataset/images/train
val: my_dataset/images/val
nc: 2                      # 类别数量
names: ['cat', 'dog']      # 类别名称
```

yolo命令

```cmd
# 训练
yolo train model=yolov8n.pt data=data.yaml epochs=100 imgsz=640
```

其中yolov8n.pt是预训练模型的标志符 也可以是路径；data.yaml传入数据集 100轮训练 图片尺寸640*640

训练完成生成.pt文件 如best.pt

```cmd
# 验证
yolo val model=runs/detect/train/weights/best.pt data=my_dataset.yaml
#推理
yolo predict model=best.pt source=path/to/your/image.jpg
```

python api:

```py
from ultralytics import YOLO
model = YOLO('best.pt')  # 加载模型
results = model('bus.jpg')  # 进行推理
```

## 实践：钢铁缺陷检测

[PaddlePaddle竞赛](https://aistudio.baidu.com/competition/detail/808/0/introduction)

项目目录

```bash

```

### EDA数据分析

在钢铁缺陷检测实践中 需识别图像中是否存在龟裂、夹杂、点蚀、划痕、斑块、氧化铁皮压入6种缺陷，在导入模型训练前，对样本标记结果进行如下分析

1. 类别分布 
2. 标注框尺寸分布
3. 缺陷面积箱线图
4. 类别不均衡程度

根据数据分析结果做特定的数据增强操作

### 数据增强

+ Pillow 做图像旋转、翻转
+ 亮度 对比度调整
+ 噪声(NumPy)
+ Albumentations

YOLO训练中自动开启的数据增强：

+ Mosaic
+ MixUp
+ 几何变换
+ 色彩变换 