---
title: Expo
date: 2024-12-09 10:23:00
tags:
- Web开发
categories: 
- 移动端
---
objectives orientation：
+ what & what benefits, defect(缺点)
+ 交互interact 
+ 隐私和权限
+ 工具链

#### what is Expo

Expo 是一个基于 React Native 的框架。其服务于简化和便于 React Native 开发方式，Expo框架包括Expo CLI（如 create-expo-app）Expo SDK （其封装了一些导航、设备、通知等功能和api）Expo Go（一个可以在 iOS 和 Android 上安装的应用程序，允许你通过扫描 QR 码或 URL 来即时预览和测试你的 Expo 项目，而不需要构建 APK 或 IPA 文件。）EAS (远程构建 一键推送Google Play和Apple Store)
参考[使用Expo开发应用](https://expo.nodejs.cn/workflow/overview/#%E5%85%B3%E9%94%AE%E6%A6%82%E5%BF%B5)

缺点是对深度定制开发（甚至无法对接支付宝和微信支付功能）和涉及到原生模块的开发缺乏灵活性，需要Expo eject成纯React Native项目，此操作不可逆


安装Expo：
```
npx create-expo-app StickerSmash --template blank-typescript
cd StickerSmash

npx expo run:android
npx expo start
```
使用npx expo install而不是npm i或yarn add，以便提供兼容性提示
#### Expo路由
file-based router

#### 配置
app.json 存放编译所需静态参数 如app名称、版本信息、OTA配置等
如需动态配置应使用app.config.ts
```
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'my-app',
  name: 'My App',
});

```

#### Expo SDK库

#### EAS
Expo Application Service, 构建安装包需要用eas服务，这是对墙内用户不友好的地方之一
```
npm i -g eas-cli
eas login
eas build --platform android --profile release
```
默认打包成abb文件，生成apk需要在eas.json中某个profile中设置好类型如
```
"release": {
    "android": {
        "buildType": "apk"
    }
}
```