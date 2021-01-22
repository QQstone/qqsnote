---
title: Angular工作空间配置
date: 2020-12-17 10:54:23
tags:
- Angular
categories: 
- 前端技术
---
工作区配置文件就是angular.json
#### 关于当前Project
```
"MyApp": {
    "root": "",
    "sourceRoot": "src",
    "projectType": "application",
    "prefix": "app",
    "schematics": {
    "@schematics/angular:component": {}
},
```
#### 编译/测试等工具
#### 关于build target
architect/build 节会为 ng build 命令的选项配置默认值。它具有下列顶层属性:builder,option,configurations.
另外对应ng serve,ng test,ng lint命令，有architect/serve|test|lint命令
+ builder就是个编译器名字，默认是@angular-devkit/build-angular:browser，(ng test的是karma，ng lint的是tslint)
+ options提供构建时的选项及默认值，私以为这些option可以认为是builder工具链所需参数，因而在test和lint中也各有不同
  ```
    "options": {
        "aot": true,
        "progress": false,
        "extractCss": true,
        "outputPath": "dist",
        "index": "src/index.html",
        "main": "src/main.ts",
        "polyfills": "src/polyfills.ts",
        "tsConfig": "src/tsconfig.app.json",
        "assets": [
            "src/favicon.ico",
            "src/assets",
            {
            "glob": "**/*",
            "input": "./node_modules/@ant-design/icons-angular/src/inline-svg/",
            "output": "/assets/"
            }
        ],
        "styles": [
            "src/theme.less",
            "src/styles.scss"
        ],
        "scripts": []
    }
  ```
+ configurations 脚手架生成项目会添加一个production的配置在这里，对编译进行部分优化以及打包限制，ng build 带--prod参数(注意--xxx是命令参数)使用该production配置，可以仿照production写其他(如 stage)配置，使用时形如 ng build --configuration stage
另配置可以加载复数个，后者的项会覆盖前者：ng build --configuraion staging,fr
"configurations": {
    "production": {
        "fileReplacements": [
        {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.prod.ts"
        }
        ],
        "optimization": true,
        "outputHashing": "all",
        "sourceMap": false,
        "extractCss": true,
        "namedChunks": false,
        "aot": true,
        "extractLicenses": true,
        "vendorChunk": false,
        "buildOptimizer": true,
        "budgets": [
        {
            "type": "initial",
            "maximumWarning": "2mb",
            "maximumError": "5mb"
        },
        {
            "type": "anyComponentStyle",
            "maximumWarning": "6kb",
            "maximumError": "10kb"
        }
        ]
    }
}
```
#### 样式预处理选项
[Angular Doc:Styles and scripts configuration](https://angular.cn/guide/workspace-config#style-preprocessor-options)
