---
title: 视频剪辑
date: 2026-01-20 14:36:18
tags:
- 视频剪辑
---
## 流媒体下载

Youtube 视频、音频 -> [Y2mate](https://v6.www-y2mate.com/)

bilibili等多平台 -> [SnapAny](https://snapany.com/zh/bilibili)

## 文字转语音

[text-to-speech(TTS)](https://www.text-to-speech.cn/)

## ai音频字幕(ai听译)

[converter app](https://converter.app/cn/mp3-text/)

## 格式转换(ffmpeg)

```cmd
# windows bash 安装
winget install ffmpeg

ffmpeg -i input.mp4 -vn -acodec libmp3lame -q:a 2 output.mp3
ffmpeg -i input.mp4 -vn -acodec wmav2 output.wma      
```

## 截取

视频截取

```cmd
ffmpeg -i input.mp4 -ss 00:00:10 -to 00:00:20 -c copy output.mp4
```

图片批量截取

```cmd
pip install Pillow
python clips.py
```

clips.py
```py
import os
from PIL import Image

# 配置参数
input_dir = '.'          # 输入目录，'.' 表示当前目录
output_dir = 'output'    # 输出子目录名

# 截取区域 (左, 上, 右, 下)
# 注意：Pillow 的坐标系统原点(0,0)在左上角
crop_box = (1254, 104, 1798, 888)

def main():
    # 如果输出目录不存在，则创建
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"创建输出目录: {output_dir}")

    # 获取目录下所有文件
    files = os.listdir(input_dir)
    png_files = [f for f in files if f.lower().endswith('.png')]
    
    count = 0
    for filename in png_files:
        input_path = os.path.join(input_dir, filename)
        
        try:
            # 打开图片
            with Image.open(input_path) as img:
                # 截取指定区域
                cropped_img = img.crop(crop_box)
                
                # 构造输出路径
                output_path = os.path.join(output_dir, filename)
                
                # 保存图片
                cropped_img.save(output_path)
                
                print(f"处理完成: {filename}")
                count += 1
                
        except Exception as e:
            print(f"处理 {filename} 时出错: {e}")

    print(f"\n全部完成！共处理 {count} 张图片。")

if __name__ == '__main__':
    main()
```

## 剪辑软件常用功能(以剪映为例)

+ 分辨率 长宽比 短视频9:16
+ 裁剪
+ 定格
+ 文字 动画效果

流程化

视频结构：老套的开篇叙事 重点字幕 音效 转场

视频剪辑工作流 to be continued
