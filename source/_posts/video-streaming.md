---
title: video和视频流
date: 2019-04-19 21:29:16
tags:
---
### 直播原理
### 协议
### H5 video标签
### 直播流的制作
### Nginx+ffmpeg
#### 安装

### 下载RTMP模块并重编译nginx
官方源代码https://github.com/arut/nginx-rtmp-module.git
#### 配置
```
./configure --prefix=/usr/local/nginx --add-module=~/nginx-rtmp-module --with-http_ssl_module
```
#### 编译并安装
```
make && make install
```
#### nginx reload后报“open() "/usr/local/nginx/logs/nginx.pid" failed”,执行下面的命令，指定nginx的configure路径
```
./nginx -c /usr/local/nginx/conf/nginx.conf
```

#### 编译通过nginx可访问，还没完，配置nginx.conf，在末尾添加rtmp模块配置：
```
rtmp{
    server {
        listen 1935;
        chunk_size 4000;

        # RTMP 直播流配置
        application rtmplive {
            live on;
            max_connections 1024;
        }

        # hls 直播流配置
        application hls{
            live on;
            hls on;
            hls_path /usr/local/userdata/live;
            hls_fragment 5s;
        }
    }
}

```
hls_path是分割文件存储路径

在http模块中添加服务路径
```
http {
    server {
        location /hls{
            types{
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /usr/local/userdata/live;
            add_header Cache-Control no-cache
        }
    }
}
```
## 安装流媒体文件转换工具ffmpeg
官方release：http://www.ffmpeg.org/download.html#releases
解压
```
tar jxvf ffmpeg-4.1.3.tar.bz2
```
执行configure报“yasm/nasm not found or too old. Use --disable-x86asm for a crippled build”,ffmpeg默认的编译器未安装，需使用--disable-x86asm

将本地视频文件通过nginx推流

本地视频文件kon.mp4
### 推送RTMP流
```
ffmpeg -re -i test.mp4 -vcodec libx264 -acodec acc -f flv rtmp://127.0.0.1:1935/rtmplive/rtmp
```

### 推送HLS流
```
ffmpeg -re -i test.mp4 -vcodec libx264 -acodec acc -f flv rtmp://127.0.0.1:1935/hls/stream
```
## 这里有一个关于编码器的坑
 > vcodec acodec 分别指明了视频、音频的编码器，其实这里可以用copy也就是不需要转码，从官方GitHub下载安装的ffmpeg是没有libx264的编码器的，故而在执行上述推流命令时报unkown encoder libx264

 > 而通用的h.264视频编码器是叫x264：https://www.videolan.org/developers/x264.html

安装x264需要将类库提供给外部应用程序(如ffmpeg)
```
./configure –enable-shared 

make && make install
```
配置编译的时候最好有--prefix指明安装路径，否则一般默认到/usr/local/lib路径下
需要将/usr/local/lib路径加入共享库配置文件/etc/ld.so.conf中
```
echo "/usr/local/lib" >> /etc/ld.so.conf

ldconfig
```
编译安装含外部解码器的FFmpeg
```
./configure --enable-static --enable-gpl --enable-libx264 --extra-cflags=-I/usr/local/include --extra-ldflags=-L/usr/local/lib

make && make install
```
