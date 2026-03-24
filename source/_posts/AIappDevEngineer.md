---
title: AIappDevEngineer
date: 2026-02-26 20:01:04
tags:
- LLM
categories:
- 人工智能
---

### 私有化部署模型和api调用

#### 实践6-1 区分好评/差评(情感判断)

Model：RoBERTa 来源：Huggingface

```py
import os
# 必须在导入 pipeline 之前设置
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"
os.environ["HF_HOME"] = "/root/autodl-tmp/models"  # 同时控制 model 和 tokenizer 缓存

from transformers import pipeline

# 1. 加载 pipeline
# 指定 task="sentiment-analysis"
# 💡 技巧：如果不指定 model，默认下载英文模型。
# 这里我们指定一个中文微调过的模型，效果更好。
cache_dir = '/root/autodl-tmp/models'
classifier = pipeline(
    task="sentiment-analysis",
    model="uer/roberta-base-finetuned-dianping-chinese"
    #model="bert-base-chinese"
)

# 2. 预测
result = classifier("这个手机屏幕太烂了，反应很慢！")
print(result)
# 输出示例：[{'label': 'negative (negative)', 'score': 0.98}]

result2 = classifier("物流很快，包装很精美，五星好评。")
print(result2)
# 输出示例：[{'label': 'positive (positive)', 'score': 0.99}]
```

#### 实践6-3 分类(tokenizer分词器)

Model: BART

```py
from transformers import AutoTokenizer

# 加载分词器
tokenizer = AutoTokenizer.from_pretrained("bert-base-chinese") 

# 模拟一个 Batch（两个长度不一样的句子）
sentences = ["我爱AI", "HuggingFace真好用"]

# 调用分词器
inputs = tokenizer(
    sentences,
    padding=True,      # 自动填充到最长句子的长度
    truncation=True,   # 超过最大长度就截断
    max_length=10,     # 设置最大长度
    return_tensors="pt" # 返回 PyTorch 张量
)

print(inputs)
# 重点观察：
# 'input_ids': 你的字对应的数字
# 'attention_mask': 1代表是真实的字，0代表是填充的(Padding)
```

#### 实践6-6 实现一个模型调用的pipeline

NLP 常用任务：

+ sentiment-analysis：情感分析，判断文本褒贬。
+ text-generation：文本生成，如写故事、续写代码。
+ zero-shot-classification：零样本分类，无需训练即可根据自定义标签分类。
+ question-answering：问答系统，根据给定的上下文回答问题。
+ summarization：自动摘要，将长文浓缩为短句。
+ translation_xx_to_yy：翻译任务，如translation_en_to_zh。
+ ner：命名实体识别，提取人名、地名、组织名

 CV & 音频常用任务：

+ image-classification：图像分类。
+ object-detection：目标检测，识别图中的物体并定位。
+ automatic-speech-recognition (ASR)：语音转文字。
+ text-to-speech (TTS)：文字转语音。

### huggingface 高效微调(PEFT)

Trainer类 封装Forward, Backward, Optimizer_step, Zero_grad迭代过程

+ 前向传播
+ 反向传播
+ 参数优化
+ 梯度清零

训练数据集 DataSet 在huggingface上的另一大类资源

#### 实践6-7 垃圾右键分类器

利用Dateset微调llm 