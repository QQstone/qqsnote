---
title: GPT-sovits
date: 2026-03-13 22:04:47
tags:
---
一款神经网络音频编解码器 可用于影视角色台词二创

[Autodl 部署GPT-sovits](https://www.yuque.com/baicaigongchang1145haoyuangong/ib3g1e/tkemqe8vzhadfpeu)

## 📋 任务概述

**目标**：使用原音频训练声音模型，生成新台词语音

**原台词**：
> 我病了三年，四万块钱一瓶的正版药我吃了三年，房子吃没了，家人被我吃垮了，现在好不容易有了便宜药，你们非说他是假药，那药假不假，我们能不知道吗？那药才买五百块钱一瓶，药贩子根本没赚钱，谁家能不遇上个病人，你能保证你这一辈子不生病吗，啊？你们把他抓走了，我们都得等死，我不想死，我想活着

**新台词**：
> 我失业了三年，四万块钱一个月的房贷我扛了三年，房子扛没了，家人被我啃垮了，现在好不容易有了openclaw，你们非说他没用，龙虾有没有用，我们能不知道吗？那软件是开源的，原作者根本没赚钱，谁家能保证自己不失业，你能保证你这一辈子不被AI取代吗，啊？你们把AI泡沫戳破了，我们都得等死，我不想死，我想活着

---

## 第一部分：租用AutoDL实例

AutoDL 4090 社区镜像关键字RVC-Boss/GPT-sovits

### 1.4 获取连接信息

实例启动后，在AutoDL控制台获取：
- SSH连接命令（如：`ssh -p 12345 root@region-x.autodl.pro`）
- 密码

---

## 第二部分：环境配置

### 2.1 连接实例

```bash
# 使用AutoDL提供的SSH命令连接
ssh -p <端口> root@<地址>
# 输入密码
```

### 2.2 安装依赖

```bash
# 更新系统
apt update && apt upgrade -y

# 安装ffmpeg和git
apt install -y ffmpeg git

# 创建工作目录
mkdir -p /root/workspace
cd /root/workspace

# 克隆GPT-SoVITS仓库（使用国内镜像加速）
git clone https://gitee.com/RVC-Boss/GPT-SoVITS.git
# 或使用GitHub
# git clone https://github.com/RVC-Boss/GPT-SoVITS.git

cd GPT-SoVITS
```

### 2.3 使用Conda环境

```bash
# 检查conda是否存在
which conda

# 创建Python环境
conda create -n GPTSoVits python=3.10 -y
conda activate GPTSoVits

若需conda init:

```bash
conda init bash
source ~/.bashrc
conda activate GPTSoVits
```

# 安装PyTorch（根据CUDA版本选择）
# 查看CUDA版本
nvidia-smi | grep "CUDA Version"

显示 
```bash
| NVIDIA-SMI 580.105.08             Driver Version: 580.105.08     CUDA Version: 13.0     |
```
查看pytorch
```
python -c "import torch; print(torch.__version__)"
```
```bash
2.10.0+cu128
```

# 安装项目依赖

```bash
cd /root/workspace/GPT-SoVITS
bash install.sh --device CU128 --source ModelScope
```

torch版本未指定问题

```bash
# 卸载可能冲突的包
pip uninstall torch torchvision torchaudio triton
# 清理 pip 缓存（可选）
pip cache purge
# 用正确命令重装（以 cu121 为例）
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
```

### 2.4 下载预训练模型

```bash
# 方法1：使用安装脚本（推荐，自动下载所有必需模型）


# 方法2：手动下载（如果脚本失败）
# 创建模型目录
mkdir -p GPT_SoVITS/pretrained_models
mkdir -p GPT_SoVITS/text
mkdir -p tools/UVR5/UVR5_weights

# 使用modelscope下载（国内镜像） 因为使用的python3.8 需要安装旧版本modelscope
pip install modelscope=1.11.0

modelscope download iic/speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch

mv ~/.cache/modelscope/hub/iic/* ~/GPT-SoVITS/tools/asr/models 
```

---

## 第三部分：准备训练数据

### 3.1 上传音频文件

**方法1：使用AutoDL文件管理器（推荐）**
1. 在AutoDL控制台打开"文件管理"
2. 创建目录 `/root/workspace/audio/`
3. 上传音频文件 `output.wav`

**方法2：使用SCP上传**
```bash
# 在本地电脑执行
scp -P <端口> output.wav root@<地址>:/root/workspace/audio/
```

**方法3：使用rclone或其他工具**
```bash
# 如果音频在网盘，可以使用rclone下载
```

### 3.2 音频要求

- **格式**：WAV（推荐）、MP3、FLAC
- **采样率**：建议16kHz以上，24kHz最佳
- **声道**：单声道
- **时长**：建议1-5分钟的清晰人声
- **质量**：无背景音乐、无噪音、无混响

### 3.3 音频预处理（可选）

如果音频有背景音乐或噪音，需要先处理：

```bash
cd /root/workspace/GPT-SoVITS

# 启动WebUI
python webui.py zh_CN

# 浏览器访问 http://<实例IP>:9874
# 进入 "0a-UVR5人声伴奏分离&去混响去延迟工具"
# 上传音频，选择模型，点击"分离"
```

---

## 第四部分：训练模型

### 4.1 方案A：快速推理（零样本，无需训练）

适合快速测试，效果可能不如微调：

```bash
cd /root/workspace/GPT-SoVITS
python webui.py

# 浏览器访问 http://<实例IP>:9874
# 1. 在"请上传参考音频"处上传音频文件
# 2. 在"输入目标文本"处输入新台词
# 3. 点击"生成"按钮
```

### 4.2 方案B：微调训练（推荐，效果更好）

#### 步骤1：配置AutoDL端口映射

1. 在AutoDL控制台 → 自定义服务 → 开启端口映射
2. 添加端口 `9874`（WebUI默认端口）
3. 获取访问链接

```
ssh -p 19612 -L 9874:localhost:9874 root@connect.bjb2.seetacloud.com
```

#### 步骤2：启动WebUI

```bash
cd /root/workspace/GPT-SoVITS
conda activate GPTSoVits

# 启动WebUI（监听所有端口）
python webui.py --listen 0.0.0.0

# 或指定端口
python webui.py --listen 0.0.0.0 --port 9874
```

package issues

```bash
pip install opencc==1.1.6
pip install torchcodec
```

use pytorch 2.8

```bash
pip uninstall torch torchaudio torchvision torchcodec -y
pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0
```


#### 步骤3：使用WebUI训练

1. **打开WebUI**：浏览器访问端口映射地址

2. **音频切分**（如果音频较长）：
   - 进入 `0b-音频切片工具`
   - 上传音频，设置切片参数（建议每段10-15秒）
   - 点击"切分"

3. **语音识别**：
   - 进入 `0c-中文ASR工具`
   - 选择切分后的音频目录
   - 点击"识别"，生成文本标注

4. **文本校对**：
   - 进入 `0d-文本校对工具`
   - 校对识别结果，确保文本与音频内容一致
   - 保存标注文件

5. **训练集格式化**：
   - 进入 `1A-训练集格式化工具`
   - 选择处理好的音频和标注文件
   - 点击"格式化"，生成训练数据

6. **微调训练**：
   - 进入 `1B-微调训练`
   - 设置训练参数：
     - **SoVITS训练轮数**：建议10-20轮
     - **GPT训练轮数**：建议10-20轮
     - **批量大小**：根据显存调整（RTX 4090可用8-12）
     - **学习率**：使用默认值
   - 点击"开始训练"
   - 等待训练完成（约30分钟-1小时）

7. **推理测试**：
   - 训练完成后，回到主页
   - 选择训练好的模型
   - 输入新台词，点击"生成"
   - 下载生成的音频

---

## 第五部分：命令行训练（高级用户）

如果WebUI不可用，可以使用命令行：

### 5.1 准备训练数据

```bash
# 创建训练数据目录
mkdir -p /root/workspace/GPT-SoVITS/Data/your_speaker_name

# 复制音频文件
cp /root/workspace/audio/output.wav /root/workspace/GPT-SoVITS/Data/your_speaker_name/

# 创建标注文件
cat > /root/workspace/GPT-SoVITS/Data/your_speaker_name/esd.list << 'EOF'
/root/workspace/GPT-SoVITS/Data/your_speaker_name/output.wav|your_speaker_name|我病了三年，四万块钱一瓶的正版药我吃了三年，房子吃没了，家人被我吃垮了，现在好不容易有了便宜药，你们非说他是假药，那药假不假，我们能不知道吗？那药才买五百块钱一瓶，药贩子根本没赚钱，谁家能不遇上个病人，你能保证你这一辈子不生病吗，啊？你们把他抓走了，我们都得等死，我不想死，我想活着
EOF
```

### 5.2 处理训练数据

```bash
cd /root/workspace/GPT-SoVITS
conda activate GPTSoVits

# 生成文本特征
python prepare_datasets/1-get-text.py \
    --inp_text Data/your_speaker_name/esd.list \
    --inp_wav_dir Data/your_speaker_name \
    --opt_dir Data/your_speaker_name/processed

# 生成hubert特征
python prepare_datasets/2-get-hubert.py \
    --inp_text Data/your_speaker_name/processed/esd.list \
    --inp_wav_dir Data/your_speaker_name \
    --opt_dir Data/your_speaker_name/processed

# 生成语义特征
python prepare_datasets/3-get-semantic.py \
    --inp_text Data/your_speaker_name/processed/esd.list \
    --inp_wav_dir Data/your_speaker_name \
    --opt_dir Data/your_speaker_name/processed
```

### 5.3 训练SoVITS模型

```bash
# 修改配置文件
cp configs/s2.json configs/s2_custom.json

# 编辑配置文件，设置训练参数
# 主要修改：
# - train_dataset_path: 训练数据路径
# - batch_size: 批量大小（根据显存调整）
# - total_epoch: 训练轮数（建议10-20）

# 开始训练
python s2_train.py --config configs/s2_custom.json
```

### 5.4 训练GPT模型

```bash
# 修改配置文件
cp configs/s1.json configs/s1_custom.json

# 开始训练
python s1_train.py --config configs/s1_custom.json
```

### 5.5 推理生成

```bash
# 使用训练好的模型生成语音
python inference.py \
    --s2_model_path logs/s2/your_model.pth \
    --s1_model_path logs/s1/your_model.ckpt \
    --ref_audio /root/workspace/audio/output.wav \
    --ref_text "我病了三年，四万块钱一瓶的正版药我吃了三年" \
    --target_text "我失业了三年，四万块钱一个月的房贷我扛了三年" \
    --output_path output.wav
```

---

## 第六部分：使用API调用

### 6.1 启动API服务

```bash
cd /root/workspace/GPT-SoVITS
conda activate GPTSoVits

# 启动API服务
python api_v2.py --listen 0.0.0.0 --port 9880

# 后台运行
nohup python api_v2.py --listen 0.0.0.0 --port 9880 > api.log 2>&1 &
```

### 6.2 API调用示例

```python
import requests

url = "http://<实例IP>:9880/tts"

data = {
    "text": "我失业了三年，四万块钱一个月的房贷我扛了三年，房子扛没了，家人被我啃垮了，现在好不容易有了openclaw，你们非说他没用，龙虾有没有用，我们能不知道吗？那软件是开源的，原作者根本没赚钱，谁家能保证自己不失业，你能保证你这一辈子不被AI取代吗，啊？你们把AI泡沫戳破了，我们都得等死，我不想死，我想活着",
    "text_lang": "zh",
    "ref_audio_path": "/root/workspace/audio/output.wav",
    "prompt_text": "我病了三年，四万块钱一瓶的正版药我吃了三年，房子吃没了，家人被我吃垮了",
    "prompt_lang": "zh",
    "top_k": 5,
    "top_p": 1.0,
    "temperature": 1.0,
    "text_split_method": "cut5",
    "batch_size": 1,
    "speed_factor": 1.0,
    "split_bucket": True
}

response = requests.post(url, json=data)
with open("output.wav", "wb") as f:
    f.write(response.content)
```

### 6.3 curl调用示例

```bash
curl -X POST "http://<实例IP>:9880/tts" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "我失业了三年，四万块钱一个月的房贷我扛了三年",
    "text_lang": "zh",
    "ref_audio_path": "/root/workspace/audio/output.wav",
    "prompt_text": "我病了三年，四万块钱一瓶的正版药我吃了三年",
    "prompt_lang": "zh"
  }' \
  --output output.wav
```

---

## 第七部分：下载生成的音频

### 7.1 使用AutoDL文件管理器

1. 在AutoDL控制台打开"文件管理"
2. 找到生成的音频文件
3. 点击下载

### 7.2 使用SCP下载

```bash
# 在本地电脑执行
scp -P <端口> root@<地址>:/root/workspace/GPT-SoVITS/output.wav ./
```

### 7.3 使用rclone同步

```bash
# 在云主机上配置rclone
rclone config

# 同步到网盘
rclone copy /root/workspace/GPT-SoVITS/output.wav remote:backup/
```

---

## 第八部分：常见问题

### Q1：显存不足怎么办？

```bash
# 减小batch_size
# 修改配置文件中的batch_size参数
# RTX 3090/4090: batch_size = 8-12
# RTX 3080: batch_size = 4-6
# RTX 2080: batch_size = 2-4

# 或使用fp16训练
export CUDA_LAUNCH_BLOCKING=1
```

### Q2：训练速度慢？

- 检查是否正确使用GPU：`nvidia-smi`
- 确认CUDA版本与PyTorch版本匹配
- 使用更快的GPU（如RTX 4090）

### Q3：生成的语音效果不好？

- 增加训练轮数（20-50轮）
- 使用更高质量的训练音频
- 确保训练音频与目标文本风格一致
- 调整推理参数（top_k, top_p, temperature）

### Q4：WebUI无法访问？

- 检查端口映射是否正确配置
- 确认防火墙设置
- 使用 `--listen 0.0.0.0` 参数

### Q5：模型下载失败？

- 使用国内镜像（HF-Mirror, ModelScope）
- 手动下载模型文件

---

## 第九部分：费用估算

### AutoDL计费参考

| GPU型号 | 参考价格（元/小时） | 预计训练时间 | 预计费用 |
|---------|---------------------|--------------|----------|
| RTX 4090 | 约 3-4 元 | 30分钟-1小时 | 约 2-4 元 |
| RTX 3090 | 约 2-3 元 | 1-2小时 | 约 3-6 元 |
| A100 | 约 10-15 元 | 20-40分钟 | 约 5-10 元 |

**建议**：选择RTX 4090，性价比最高，总费用约5元以内

---

## 第十部分：完整操作流程总结

### 快速版（零样本推理，无需训练）

```bash
# 1. 连接实例
ssh -p <端口> root@<地址>

# 2. 克隆仓库
git clone https://gitee.com/RVC-Boss/GPT-SoVITS.git
cd GPT-SoVITS

# 3. 安装依赖
conda create -n GPTSoVits python=3.10 -y
conda activate GPTSoVits
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

# 4. 下载模型
bash install.sh --device CU118 --source HF-Mirror

# 5. 上传音频到 /root/workspace/audio/output.wav

# 6. 启动WebUI
python webui.py --listen 0.0.0.0

# 7. 浏览器访问，上传音频，输入新台词，生成语音
```

### 完整版（微调训练，效果更好）

```bash
# 1-4步同上

# 5. 启动WebUI
python webui.py --listen 0.0.0.0

# 6. 使用WebUI工具：
#    - 0b: 音频切片
#    - 0c: 语音识别
#    - 0d: 文本校对
#    - 1A: 训练集格式化
#    - 1B: 微调训练

# 7. 训练完成后，使用新模型生成语音

# 8. 下载生成的音频
```

[2025最新GPT-SoVITS教程](https://www.bilibili.com/video/BV14xS8BDE1w)

总结 该项目对python pytorch版本要求严格 cuda向下兼容 使用cu124/cu128无差