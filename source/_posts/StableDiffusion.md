---
title: Stable Diffusion
date: 2023-03-08 18:18:34
tags:
- AI
---
#### 原理
> Stable Diffusion is a latent text-to-image diffusion model. Thanks to a generous compute donation from Stability AI and support from LAION, we were able to train a Latent Diffusion Model on 512x512 images from a subset of the LAION-5B database. Similar to Google's Imagen, this model uses a frozen CLIP ViT-L/14 text encoder to condition the model on text prompts. With its 860M UNet and 123M text encoder, the model is relatively lightweight and runs on a GPU with at least 10GB VRAM. 

QQs按：Stable Diffusion并非特定程序，而是一种**文生图扩散模型**，所谓扩散模型大致是将语意或原图，人为加入随机种子并采样，从局部要素发散以匹配学习过的素材特征，从而生成完整图像。Stability AI是推出Stable Diffusion模型的创业公司，LAION（Large-scale Artificial Intelligence Open Network）是一家非营利组织，成员来自世界各地，旨在向公众提供大规模机器学习模型、数据集和相关代码。这里需要指出的是，由于训练素材大多是512x512的小尺寸图像，使用文生图不宜创建太大尺寸，否则会被算法认为是多图拼接，欲生成大尺寸图像应由计算结果通过高清插值插件扩充。

[通俗理解扩散模型](https://zhuanlan.zhihu.com/p/563543020)

[大白话讲解扩散模型](https://zhuanlan.zhihu.com/p/610012156)
#### webui
[Stable Diffusion Webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 为方便调用模型接口制作了图形化的交互界面 

env requirement:
+ Python3.10
#### models
+ GFPGAN 腾讯开源的人像修复算法
+ VAE (Variational Auto-Encoder 变分自编码器)
+ LoRA (Low-Rank Adaptation of Large Language Models) 自然语言处理
+ DeepBooru
#### vas

#### tags
korean doll

nagetive prompt

paintings, sketchers, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans

#### troubleshooting
> [not enough GPU memory](https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/8427)
```
@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set COMMANDLINE_ARGS= --lowvram --no-half --precision full --no-half-vae --opt-sub-quad-attention --opt-split-attention-v1 --autolaunch 

call webui.bat
```
> No python at "D:\Program Files\Anaconda3\env\py310\Python.exe"
删除项目env下除Libs外的所有文件 重新执行webui.bat
#### 资源