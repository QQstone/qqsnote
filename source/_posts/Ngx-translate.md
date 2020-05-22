---
title: Ngx-translate
date: 2020-05-21 16:18:45
tags:
- Angular
categories: 
- 前端技术
---
> [NGX-Translate](https://github.com/ngx-translate/core) is an internationalization library for Angular. NGX-Translate is also extremely modular. It is written in a way that makes it really easy to replace any part with a custom implementation in case the existing one doesn't fit your needs.

> [Why ngx-translate exists if we already have built-in Angular i18n](https://github.com/ngx-translate/core/issues/495#issuecomment-291158036)

#### 关于载入翻译文件
+ [Http Loader](https://github.com/ngx-translate/http-loader): load json translation files with http
+ [Angular Universal Loader](https://gist.github.com/ocombe/593d21598d988bf6a8609ba5fc00b67e): load json translation files with fs instead of http
+ [Po Loader](https://github.com/biesbjerg/ng2-translate-po-loader): load .po files with http

#### 集成步骤
```
npm install @ngx-translate/core @ngx-translate/http-loader --save
```
在模块中引入
```
import {TranslateModule} from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
      },
      defaultLanguage: 'en'
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
组件注入及初始化
```
export class AppComponent {
    constructor(translate: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
         // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
    }
}
```
在模板中使用管道标记待翻译标记
```
<p>{{"sayHi" | translate}}</p>

<p>{{'sayHiWithParameter' | translate:userObj}}</p>

<p>{{ 'ROLES.' + role | uppercase | translate }}</p>
```
翻译文件，对于HTTP Loader是以Locale_ID命名的Json
```
src
├───assets
│   ├───i18n
│   │       en.json
│   │       fr.json
│   │       zh.json
```
翻译格式
```
{
    "introductionHeader":"你好",
    "ROLE":{
        "ADMIN": "管理员"，
        "USER": "用户"
    },
    "sayHiWithParameter":"你好，{{pride}}的{{lastname}}}先生"
}
```
在ts代码中引用翻译
```
translate.get('HELLO', {value: 'world'}).subscribe((res: string) => {
    console.log(res);
    //=> 'hello world'
});
```
使用 PO Loader
```
export function createTranslateLoader(http: HttpClient) {
	return new TranslatePoHttpLoader(http, 'assets/i18n', '.po');
```
缺失的翻译 handle missing translations
```
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        return 'some value';
    }
}
@NgModule({
    imports: [
        BrowserModule,
        TranslateModule.forRoot({
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler},
            useDefaultLang: false
        })
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
#### plural and select
这个库没有相应的api与i18n的 plural / select 模式相对应，对于这些场景需要使用ngIf或ngSwitch指令实现