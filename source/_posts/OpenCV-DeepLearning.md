---
title: 使用预训练模型进行目标识别
date: 2023-11-14 15:20:52
tags:
- OpenCV
- AI
categories: 
- 图像处理
---
#### 安装TensorFlow Object Detection API
参考{% post_link PaddleX PaddleX %}准备anaconda和cuda

参考[安装Tensorflow2](https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/install.html#install-the-tensorflow-pip-package)
```
conda create -n tensorflow python=3.10
conda activate tensorflow
pip install tensorflow 
```
pip自动安装最新release版本 2.0之后不再区分cpu和gpu版本

测试安装，在python中引用tensorflow， 对一个随机张量的求和
```
python -c "import tensorflow as tf;print(tf.reduce_sum(tf.random.normal([1000, 1000])))"
# 结果形如tf.Tensor(-1082.7711, shape=(), dtype=float32)
```
install the TensorFlow Object Detection API：
下载[模型库](https://github.com/tensorflow/models) 新建一个Tensorflow目录并将模型库clone/解压到目录下
TensorFlow/
└─ models/
   ├─ community/
   ├─ official/
   ├─ orbit/
   ├─ research/
   └── ...
根据Readme的提示安装official library
```
# 将model路径添加到PYTHONPATH环境变量
set PYTHONPATH=%PYTHONPATH%;C:\Users\qqqst\Documents\TensorFlow\models
# 安装requirements
pip3 install --user -r models/official/requirements.txt 
```
<del>
下载[protobuf](https://github.com/protocolbuffers/protobuf/releases)添加到环境变量path,对于windows下载 protoc-*-*-win64.zip并解压，注意protobuf-*-*.zip是source code 添加路径如D:\Software\protoc-25.1-win64\bin到path

使用protoc编译模型的python版本(与.proto一一对应的.py文件)
```
# cmdline in TensorFlow/models/research
for /f %i in ('dir /b object_detection\protos\*.proto') do protoc object_detection\protos\%i --python_out=.
```

install pycocotools (依赖[vc++ 2015](https://go.microsoft.com/fwlink/?LinkId=691126))
```
pip install cython
pip install git+https://github.com/philferriere/cocoapi.git#subdirectory=PythonAPI
```

看到Object Detection for TensorFlow 2.0的[setup script](https://github.com/tensorflow/models/blob/master/research/object_detection/packages/tf2/setup.py)

Install the Object Detection API
```
# From within TensorFlow/models/research/
cp object_detection\packages\tf2\setup.py .
python -m pip install .
```
调用test脚本以测试安装
```
# From within TensorFlow/models/research/
python object_detection/builders/model_builder_tf2_test.py
```
</del>