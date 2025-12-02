---
title: Stable Diffusion 和 ComfyUI
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
+ VAE (Variational Auto-Encoder 变分自编码器) 修复图片中的某些部分,例如修复人脸图片中的眼睛，或者可以理解为一种滤镜
+ LoRA (Low-Rank Adaptation of Large Language Models) 自然语言处理大模型的低秩(Low-Rank)适应性版本(Adaptation)
+ DeepBooru

#### LoRA
[什么是LoRA模型](https://zhuanlan.zhihu.com/p/624230991)
自然语言大模型参数庞大(如GPT参数量超过千亿)，训练成本太高，因此LoRA采用了一个办法，仅训练低秩矩阵（low rank matrics），使用时将LoRA模型的参数注入（inject）SD模型，从而改变SD模型的生成风格，或者为SD模型添加新的人物/IP。
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
[Stable Diffusion 提示词入门指南](https://juejin.cn/post/7273025863989755956)
基础模型库：[C站](https://civitai.com/) [Huggingface](https://huggingface.co/) 出自[魔法学院文章](https://www.wehelpwin.com/article/4033)

#### ComfyUI
recommended Python3.12！
对Stable Diffusion相关工具链的进一步封装，提供工作流编辑。
![](https://github.com/comfyanonymous/ComfyUI/blob/master/comfyui_screenshot.png)
[GitHub](https://github.com/comfyanonymous/ComfyUI?tab=readme-ov-file#nvidia)
```
git clone https://github.com/comfyanonymous/ComfyUI.git
```
编辑extra_model_paths.yaml文件以访问Stable Diffusion Webui项目目录下的模型
```
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu126
pip install -r requirements.txt
python main.py --listen=127.0.0.1 --port=8188
```
其中torch 2.5GB下载较久 源地址 https://download.pytorch.org/whl/cu126/torch-2.6.0%2Bcu126-cp312-cp312-win_amd64.whl  下载后本地安装命令如
```
pip install D:\Download\torch-2.6.0+cu126-cp312-cp312-win_amd64.whl
```
修改haggingface.io使用国内镜像：D:\Software\Anaconda3\envs\py312\Lib\site-packages\huggingface_hub\__init__.py脚本末尾添加
```
os.environ['HF_ENDPOINT'] = 'https://hf-mirror.com'
```
[ComfyUI中文手册](https://comfyuidoc.com/zh/)
#### SD3 SD3.5 Flux.1
#### checkpoints
可见载入我们的大模型的label写的是checkpoints, 即所谓大模型放在model/checkpoints目录, checkpoints常见于RPG游戏被认为是存档点，对于训练复杂的模型，也需要记录阶段性的实验结果，以方便之后的运算基于此进行。
Keras Docs对checkpoints的解释 from[《理解checkpoints》](https://cloud.tencent.com/developer/article/1583630)：
+ The architecture of the model, allowing you to re-create the model
+ The weights of the model
+ The training configuration (loss, optimizer, epochs, and other meta-information)
+ The state of the optimizer, allowing to resume training exactly where you left off.

checkpoints是基础模型的参数定制

#### controlnet


#### others
[清华大学第六弹：AIGC发展研究3.0](https://pan.quark.cn/s/cfec4694b3a9)

#### 人物替换