---
title: StableDiffusion
date: 2023-03-08 18:18:34
tags:
- AI
---
#### 原理
> Stable Diffusion is a latent text-to-image diffusion model. Thanks to a generous compute donation from Stability AI and support from LAION, we were able to train a Latent Diffusion Model on 512x512 images from a subset of the LAION-5B database. Similar to Google's Imagen, this model uses a frozen CLIP ViT-L/14 text encoder to condition the model on text prompts. With its 860M UNet and 123M text encoder, the model is relatively lightweight and runs on a GPU with at least 10GB VRAM. 
#### 本地部署
env requirement:

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