---
title: React-Native
date: 2024-01-25 14:00:41
tags:
---
#### Why React Native
React Native 和前端技术生态重合度很高，学习成本低, 一份源码可以同时编译成 Android 和 iOS 原生应用. 适合更新迭代较快的项目
同时 其底层架构师根植于移动端原生API 可以自定义原生模块 以及优化性能
#### 本质（nature）
> 在 Android 开发中是使用 Kotlin 或 Java 来编写视图；在 iOS 开发中是使用 Swift 或 Objective-C 来编写视图。在 React Native 中，则使用 React 组件通过 JavaScript 来调用这些视图。在运行时，React Native 为这些组件创建相应的 Android 和 iOS 视图。由于 React Native 组件就是对原生视图的封装，因此使用 React Native 编写的应用外观、感觉和性能与其他任何原生应用一样。我们将这些平台支持的组件称为原生组件。

> 在较早的React Native中通过称为Bridge的异步机制完成js与原生代码之间的通信，0.74版本开始默认使用Bridgeless mode，调用JSI访问原生代码从而提高性能和响应速度

> React Native 允许您为 Android 和 iOS 构建自己的 Native Components（**原生组件**），以满足您开发应用程序的独特需求。React Native 还包括一组基本的，随时可用的原生组件，您可以使用它们来构建您的应用程序。这些是 React Native 的**核心组件**。

#### 环境配置
+ node & jdk 
  ```
  choco install -y nodejs-lts microsoft-openjdk17
  ```
+ [Android Studio](https://developer.android.google.cn/studio/)
+ Android SDK及路径其环境变量
参考[Environment Setup](https://reactnative.cn/docs/environment-setup)

React Native项目
```
npx @react-native-community/cli@latest init AwesomeProject
yarn start # 启动 Metro 构建工具
yarn android
```

Android设备
+ USB连接Android手机
+ AVD(Android Virtual Device)模拟器

Android Studio-->工具栏Device Manager-->Add a new device-->Create Virtual Device-->选择任意设备-->Next-->UpsideDownCake API Level 34 image

#### 开发
Android Studio开发js/ts很不习惯，可以使用vscode调试，添加react-native-tool，配置emulator到环境变量以使能被vscode调起
```
npm i -g react-native
react-native init mobileApp
npm run android
npm run ios
```
项目终端执行 npm run android 输出
```
$ react-native run-android
info Launching emulator
...
info Installing the app
> IDLE
> IDLE
...
```
安装完毕后
会另外启动四个窗口
+ NodeJS 窗口
+ emulator\crashpad_handle.exe
+ emulator\qemu\windows-x86_64\qemu-system-x86_64.exe
+ Android Emulator 移动设备界面

调试 
在Android Emulator界面上按 Ctrl + M 弹出Emulator菜单，在菜单中点击Open DevTools启动React Native Cli自带DevTools

打包
```
cd android
./gradlew assembleRelease
```
#### android emulator
命令行输入emulator --help查看工具参数手册
```
emulator -list-avds
...
```
对于应用crash导致系统崩溃，尝试不加载snapshot后冷启动
```
emulator -avd myavd -no-snapshot-load -no-snapshot-save
emulator -avd myavd -cold-boot
# 擦除用户数据（恢复设置）
emulator -avd myavd -no-snapshot-load -wipe-data
```
将本地文件放入虚拟设备
```
avd push D:\Download\Game.apk /sdcard/Download/Game.apk
```
Internet

#### Platform
```
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```
Platform.OS返回'ios' 或者'android'
Platform.version返回OS版本号
Platform.select根据平台返回以平台字符串为key的map中对应的value
```
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();

<Component />;
```

#### Metro
The JavaScript bundler for React Native 打包器

#### 视图
视图是React Native UI的基本组成。**视图的概念**可以小到屏幕上的一个小矩形元素、可用于显示文本、图像或响应用户输入。甚至应用程序最小的视觉元素（例如一行文本或一个按钮）也都是各种视图。View可以嵌套View。全部都是视图。
![](https://cdn.jsdelivr.net/gh/reactnativecn/react-native-website@gh-pages/docs/assets/diagram_ios-android-views.svg)

#### 核心组件
+ View
+ Text
+ Image
+ ScrollView
+ TextInput
+ StyleSheet
+ Button
+ Switch
+ FlatList
+ SectionList

#### 样式
与网页的不同
+ 子元素不继承样式
+ 驼峰命名fontSize
+ 不使用单位(px等)

StyleSheet:
```
import { StyleSheet, Text } from 'reat-native'

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24
  }
})

return (
  <>
    <Text style={{styles.sectionTitle}}>
  </>
)
```
css px是逻辑像素，物理像素/逻辑像素叫**设备像素比** 这里css省略px，强调逻辑像素，具体显示的物理像素数量由设备根据屏幕种类换算

PPI(pixels per inch)每英寸物理像素点


#### Navigator
[React Native Navigation](https://react-navigation.nodejs.cn/)
React Native 中导航变得很复杂，原因在于页面url不会加入window.history
+ Stack Navigator
+ Tab Navigator
+ Drawer Navigator
```
yarn add @react-navigation/native
yarn add react-native-screens react-native-safe-area-context

yarn add @react-navigation/native-stack --> stack导航器
```
编辑位于 android/app/src/main/java/<your package name>/ 下的 MainActivity.kt 或 MainActivity.java 文件。
添加以下代码
```
//...
import android.os.Bundle;

class MainActivity: ReactActivity() {
  // ...
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
  // ...
}
```
Example：
```
const Stack = createNativeStackNavigator();
 
function App(): React.JSX.Element {
 
  return (
    // <SafeAreaView style={backgroundStyle}>
      <NavigationContainer>      
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="List" component={PatientList} />
        <Stack.Screen name="Detail" component={PatientDetail} />
      </Stack.Navigator>
      </NavigationContainer>
 
    // </SafeAreaView>
  );
}
```
#### 响应式


#### AndroidManifest.xml
声明安卓应用版本信息，元数据，权限声明等，相应的ios应用是Info.plist
```
<uses-permission android:name="android.permission.CAMERA" />
```

#### build.gradle
配置应用的构建过程，包含依赖的仓库和插件等等
使用react-native-vector-icons需要配置build.gradle
```
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```
使用icons：
```
import Icon from "react-native-vector-icons/FontAwesome"

<Icon name="camera" color="#ccc" size={36} onPress={openCamera} />
```

