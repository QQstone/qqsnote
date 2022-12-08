---
title: PyQt
date: 2022-08-24 17:30:49
tags:
- Python
---
PyQt 是 Qt 的Python版本，Qt是基于C++的GUI，在Python的UI组件库中，PyQt功能强大，提供QT Designer设计UI。PyQt 可与 C++ Qt无缝整合，另有QtWebEngine结合web前端实现Electron的功能。

题外话：Tkinter 是Python解决UI的原生库，优点在于没有其他依赖。但内容基础功能简单 比其他UI库都有不及

PyQt5类分为很多模块
> QtCore 包含了核心的非GUI的功能。主要和时间、文件与文件夹、各种数据、流、URLs、mime类文件、进程与线程一起使用。
QtGui 包含了窗口系统、事件处理、2D图像、基本绘画、字体和文字类。QtWidgets类包含了一系列创建桌面应用的UI元素。 QtMultimedia包含了处理多媒体的内容和调用摄像头API的类。 QtNetwork包含了网络编程的类，这些工具能让TCP/IP和UDP开发变得更加方便和可靠。QtWebSockets包含了WebSocket协议的类。 QtWebKit包含了一个基WebKit2的web浏览器。 

#### 安装
```
pip install pyqt5
pip install pyqt5-tools
```
使用国内pip源
```
pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple pyqt5
```
添加pyqt5-tools路径到环境变量Path

配置PyCharm外部工具
PyCharm -> 文件 -> 设置 -> 工具 -> 外部工具

填入QT designer路径
![image.png](http://tva1.sinaimg.cn/large/a60edd42gy1h5j1czipcaj20av099jsh.jpg)

另添加 Pyuic 用于将ui文件转为py文件 

须填入参数\$FileName$ -o \$FileNameWithoutExtension$.py
![v2-7039dac81f16e3567988b1a16b745067_720w.jpg](http://tva1.sinaimg.cn/large/a60edd42gy1h5j1g8wdgxj20av099zkp.jpg)

类似的 可添加PyRCC

#### PyQt Hello World
```
import sys
from PyQt5.QtWidgets import QApplication, QWidget


if __name__ == '__main__':

    app = QApplication(sys.argv)

    w = QWidget()
    w.resize(250, 150)
    w.setFixedSize(250, 150) # 固定大小
    w.move(300, 300)
    w.setWindowTitle('HelloWorld!')
    w.show()

    sys.exit(app.exec_())
```
#### QT designer
完成如上配置 可在PyCharm的外部工具打开 QT designer，
使用QT designer生成UI文件

#### 从.ui文件到.py文件
```
pyuic demo.ui -o demo.py
```
生成的py文件是UI的类定义文件
```
class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(800, 600)
        self.centralWidget = QtWidgets.QWidget(MainWindow)
        self.centralWidget.setObjectName("centralWidget")
        self.btn_import = QtWidgets.QToolButton(self.centralWidget)
        self.btn_import.setGeometry(QtCore, QRect(610, 20, 71, 22))
        self.btn_import.setObjectName("btn_import")
        self.btn_import.clicked.connect(self.on_clicked_btn_import)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "MainWindow"))
        self.btn_import.setText(_translate("MainWindow", "import"))
    
    def on_clicked_btn_import(self):
        print("btn_import clicked")
    
    .....
```
运行该UI需要在程序入口（\_\_main__）实例化
```
import sys

from PyQt5.QtWidgets import QApplication, QMainWindow, QFileDialog, QMessageBox

from ui.mainWindow import Ui_MainWindow # 引入UI的类定义


class Startup(QMainWindow, Ui_MainWindow):
    def __init__(self):
        super(Startup, self).__init__()
        self.setupUi(self)

    def importImg(self):
        fname = QFileDialog.getOpenFileName(self, 'import Image', './')

        if fname[0]:
            QMessageBox.information(self, 'import success', fname[0], QMessageBox.Yes)
        print("import img is here")


if __name__ == '__main__':
    app = QApplication(sys.argv)
    startup = Startup()
    startup.show()
    sys.exit(app.exec_())

```
可见这里的Startup类即 Ui_MainWindow 实例化参数object 两个类是相互引用的；Startup类函数即主窗体的槽函数
#### 事件、信号和槽函数
在控件层面 事件如点击按钮（clicked）选择菜单（triggered），事件可以直接connect到响应函数（槽函数）
```
    btn = QPushButton('test', self)
    btn.resize(btn.sizeHint())
    btn.move(50, 50)
    btn.clicked.connect(self.showDlg)
```
```
    # MenuBar -> Menu -> Action -> Slot
    self.menubar = QtWidgets.QMenuBar(MainWindow)
    self.menubar.setGeometry(QtCore.QRect(0, 0, 842, 26))
    self.menubar.setObjectName("menubar")
    self.menu = QtWidgets.QMenu(self.menubar)
    self.menu.setObjectName("menu")
    MainWindow.setMenuBar(self.menubar)
    
    self.actionimport = QtWidgets.QAction(MainWindow)
    self.actionimport.setObjectName("actionimport")
    self.menu.addAction(self.actionimport)
    self.menubar.addAction(self.menu.menuAction())

    self.retranslateUi(MainWindow)
    self.actionimport.triggered.connect(MainWindow.importImg)
    QtCore.QMetaObject.connectSlotsByName(MainWindow)
```
或者，不同事件发送某信号，而某个模块监听到该信号而触发响应
```
# 创建一个信号closeApp。当触发鼠标点击事件时信号会被发射。信号连接到QMainWindow的close()方法。
class Communicate(QObject):   
    closeApp = pyqtSignal()
# 信号使用了pyqtSignal()方法创建，并且成为外部类Communicate类的属性。
self.c = Communicate()
self.c.closeApp.connect(self.close)
# 把自定义的closeApp信号连接到QMainWindow的close()槽上。
def mousePressEvent(self, event):
     
    self.c.closeApp.emit()
# 当我们在窗口上点击一下鼠标，closeApp信号会被发射。应用中断。
```
#### 封装
pyinstaller vs Nuitka

> Nuitka(音妞卡)是将python程序转换成C语言的可执行elf文件。这样在运行时就可以享受到C语言处理过程中的优化，提高速度。

```
pip install -U nuitka
```
编译依赖Python和C compiler，c compiler需支持C11或C++03 这意味着需安装MinGW64 C11编译器 基于gcc11.2或更高版本，或visual studio
