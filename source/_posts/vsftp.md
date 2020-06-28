---
title: vsftp
date: 2020-06-09 14:19:52
tags:
- ftp
---
> 据说vsftp是very safe FTP
> 参数定义-->[here](https://security.appspot.com/vsftpd/vsftpd_conf.html)
#### 主动和被动
#### issue "tcp_wrappers is set to YES but no tcp wrapper support compiled in"
#### ftp vs sftp
sftp是用openssl加密ftp传输过程,连接端口21变为22，使用sftp后无法直接用资源管理器访问<br>

#### issue "Insecure server, it does not support FTP over TLS."
#### 匿名