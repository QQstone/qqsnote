---
title: vsftp
date: 2020-06-09 14:19:52
tags:
- ftp
---
据说vsftp是very safe FTP, vsftp服务以ssl保护数据传输，使用22端口而不是21端口。
```
sudo apt-get install vsftpd
```
参数配置：/etc/vsftpd.conf,用cp命令备份下先
参数定义-->[here](https://security.appspot.com/vsftpd/vsftpd_conf.html)

修改配置后重启
```
service vsftpd restart
```
[FileZilla](https://filezilla-project.org/)