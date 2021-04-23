---
title: Angular 多语言
date: 2020-05-11 14:07:27
tags:
- Angular
- 多语言
categories: 
- 前端技术
---
#### 国际化和本地化
> Internationalization is the process of designing and preparing your app to be usable in different languages. Localization is the process of translating your internationalized app into specific languages for particular locales.

国际化是将应用程序设计以及预备，使之支持不同的语言的过程。 本地化是一个把国际化的应用根据区域配置翻译成特定语言的过程。

国际化设计是实现“多语言切换”的前提，angular框架的国际化基础是i18n模块

#### 框架本地化（Localization）
为应用配置“地区”，这个地区成为查找相应的本地化数据的依据。
```
ng add @angular/localize
```
异常：
> Uncaught Error: It looks like your application or one of its dependencies is using i18n.
Angular 9 introduced a global \`$localize()\` function that needs to be loaded.
Please run \`ng add @angular/localize\` from the Angular CLI.
(For non-CLI projects, add \`import '@angular/localize/init';\` to your \`polyfills.ts` file.

如上所述，需要添加 import '@angular/localize/init' 到 polyfills.ts
#### 模板翻译
1. 在组件模板中标记需要翻译的静态文本信息。
    ```
    <h1 i18n>Hello QQs</h1>
    <h1 i18n="say hello|translate hello">Hello QQs</h1>
    ```
    在组件上添加i18n属性，标记该文本待翻译，另外可附上“<意图>|<描述>”，注意这些文字并不作为翻译条目的标识符，只是增强代码的可读性<br>
    i18n提取工具会为这些标记的单元生成一个随机的id，这个才是标识符，该id可自定义如下
    ```
    <h1 i18n="@@introductionHeader">Hello QQs</h1>
    ```
    非文本内容标签（待翻译文本是组件属性，而非内容）的标记
    ```
    <img [src]="logo" i18n-title title="Angular logo" />
    ```
    单复数问题
    ```
    <span i18n>Updated {minutes, plural, =0 {just now} =1 {one minute ago} other {{{minutes}} minutes ago}}</span>
    <!-- 期望： -->
    <!-- 当minutes=0时，翻译文本“Updated just now” -->
    <!-- 当minutes=1时，翻译文本“Updated one minute ago” -->
    <!-- 其他，翻译文本“Updated xx minutes ago” -->
    ```
    plural /ˈplʊərəl/ 复数的 这里是复数翻译模式的关键字

    选择问题
    ```
    <span i18n>The author is {gender, select, male {male} female {female} other {other}}</span>
    ```
2. 创建翻译文件：使用 Angular CLI 的 xi18n 命令，把标记过的文本提取到一个符合行业标准的翻译源文件中。
   ```
    ng xi18n --i18n-format=xlf --output-path src/locale --out-file translate.xlf
   ```
    得到的是一个xml语言的标准格式文件
    ```
    <?xml version="1.0" encoding="UTF-8" ?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
        <file source-language="en" datatype="plaintext" original="ng2.template">
            <body>
            <trans-unit id="introductionHeader" datatype="html">
                <source>Hello QQs</source>
                <context-group purpose="location">
                <context context-type="sourcefile">src/app/app.component.html</context>
                <context context-type="linenumber">353</context>
                </context-group>
            </trans-unit>
            <trans-unit id="updatetime" datatype="html">
                <source>Updated <x id="ICU" equiv-text="{minutes, plural, =0 {...} =1 {...} other {...}}"/></source>
                <context-group purpose="location">
                <context context-type="sourcefile">src/app/app.component.html</context>
                <context context-type="linenumber">354</context>
                </context-group>
            </trans-unit>
            <trans-unit id="5a134dee893586d02bffc9611056b9cadf9abfad" datatype="html">
                <source>{VAR_PLURAL, plural, =0 {just now} =1 {one minute ago} other {<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago} }</source>
                <context-group purpose="location">
                <context context-type="sourcefile">src/app/app.component.html</context>
                <context context-type="linenumber">354</context>
                </context-group>
            </trans-unit>
            </body>
        </file>
        </xliff>
    ```
3. 编辑所生成的翻译文件：把提取出的文本翻译成目标语言。
   复制上面生成的翻译格式文件，填入翻译后的文本
   ```
    <trans-unit id="introductionHeader" datatype="html">
        <source>Hello QQs</source>
        <target>你好，爸爸</target>
    </trans-unit>
    <trans-unit id="updatetime" datatype="html">
        <source>Updated <x id="ICU" equiv-text="{minutes, plural, =0 {...} =1 {...} other {...}}"/></source>
        <target>{VAR_PLURAL, plural, =0 {方才} =1 {il y 刚片刻} other {il y a <x id="INTERPOLATION" equiv-text="{{minutes}}"/> 分钟前} }</target>
    </trans-unit>
   ```

4. 将目标语言环境和语言翻译添加到应用程序的配置中。<br>
   
   a. 配置AOT编译<br>

   <b>警告</b>,此处存在版本差异：<br>
   Angular v9 angular.json 
   ```
    "projects": {
        ...
        "my-project": {
            ...
            "i18n": {
                "sourceLocale": "en-US",
                "locales": {
                    "fr": "src/locale/messages.fr.xlf",
                    "zh": "src/locale/translate.zh-cn.xlf"
                }
            }
        }
    }
   ```
   调用ng build --prod --localize构建 i18n 下定义的所有语言环境。生成若干套静态资源：
   ```
    dist
      └───my-project
            ├───en-US
            ├───fr
            └───zh
   ```
   配置特定的语言环境，指定Locale_ID
   ```
   "build": {
       "configurations": {
           "fr": {
                "aot": true,
                "outputPath": "dist/my-project-fr/",
                "i18nFile": "src/locale/messages.fr.xlf",
                "i18nFormat": "xlf",
                "i18nLocale": "fr",
                "i18nMissingTranslation": "error" //报告缺失的翻译 提醒级别为error
            }
            ...
       }
       ...
   }
   ```
   Angular v8 angular.json 
   ```
    ...
    "architect": {
        "build": {
            "builder": "@angular-devkit/build-angular:browser",
            "options": { ... },
            "configurations": {
                "fr": {
                    "aot": true,
                    "outputPath": "dist/my-project-fr/",
                    "i18nFile": "src/locale/messages.fr.xlf",
                    "i18nFormat": "xlf",
                    "i18nLocale": "fr",
                    "i18nMissingTranslation": "error",
                }
            }
        },
        ...
        "serve": {
            "builder": "@angular-devkit/build-angular:dev-server",
            "options": {
                "browserTarget": "my-project:build"
            },
            "configurations": {
                "production": {
                    "browserTarget": "my-project:build:production"
                },
                "fr": {
                    "browserTarget": "my-project:build:fr"
                }
            }
        }
    }
   ```
   可见 angular.json中，为ng build命令添加了3个用于国际化的参数i18nFile，i18nFormat，i18nLocale。另外指定outputPath用以区分不同语言版本, 这些参数也可以通过cli附加命令的配置项
   ```
    ng build --prod --i18n-file src/locale/messages.fr.xlf --i18n-format xlf --i18n-locale fr
   ```
   ng serve 命令是通过browsertarget:my-project:build使用ng build 的配置，并不直接支持上述用于国际化的参数，而以下面的方式调用
   ```
    ng serve --configuration=fr
   ```
   
   b. 配置JIT编译<br>
   + 载入合适的翻译文件，作为字符串常量
   + 创建相应的translation provider
   + 使用translation provider启动app
  
   main.ts
   ```
    import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT, MissingTranslationStrategy } from '@angular/core';
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

    import { AppModule } from './app/app.module';
    import { environment } from './environments/environment';

    if (environment.production) {
    enableProdMode();
    }

    // use the require method provided by webpack
    declare const require;
    // we use the webpack raw-loader to return the content as a string
    const translations = require('raw-loader!./locale/translate.fr.xlf').default;

    platformBrowserDynamic().bootstrapModule(AppModule,{
    missingTranslation: MissingTranslationStrategy.Error,
    providers: [
        {provide: TRANSLATIONS, useValue: translations},
        {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'}
    ]
    })
    .catch(err => console.error(err));
   ```
   app.module.ts
   ```
    @NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
    bootstrap: [AppComponent]
    })
    export class AppModule { }
   ```

#### 多语言切换 ngx-translate
关于ngx-translate {% post_link Ngx-translate Ngx-translate文章 %}
