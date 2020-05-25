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
使用 PO Loader<br>
官方提供给的 @biesbjerg/ngx-translate-po-http-loader，很遗憾，并不好使，或许是因为新版本的gettext-parser将msgctxt（信息上下文）作为一级父节点，而ngx-translate-po-http-loader一直没有更新使支持msgctxt<br>
部分zh_CN.po文件:
```
msgid ""
msgstr ""
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Plural-Forms: nplurals=1; plural=0;\n"
"X-Language: zh_CN\n"
"X-Qt-Contexts: true\n"

#: ../scanflow/res/qml/Dialog/AboutDialog.qml:25
msgctxt "AboutDialog|"
msgid "About"
msgstr "关于"

#: ../scanflow/res/qml/Dialog/AboutDialog.qml:52
msgctxt "AboutDialog|"
msgid "Product Version"
msgstr "产品版本"
```
通过上文“翻译格式”可知，ngx-translate允许多级属性mapping，如
```
<h1>{{ "AboutDialog|.About" |translate}}</h1>
```
原理见@ngx-translate/core/fesm2015/ngx-translate-core.js
```
getValue(target, key) {
    /** @type {?} */
    let keys = typeof key === 'string' ? key.split('.') : [key];
    key = '';
    do {
        key += keys.shift();
        if (isDefined(target) && isDefined(target[key]) && (typeof target[key] === 'object' || !keys.length)) {
            target = target[key];
            key = '';
        }
        else if (!keys.length) {
            target = undefined;
        }
        else {
            key += '.';
        }
    } while (keys.length);
    return target;
}
```
结合ngx-translate解析翻译时的逻辑，在实现PO Loader的getTranslation方法（关于自定义loader的继承和实现，ngx-translate有指引 -> [link](https://github.com/ngx-translate/core#write--use-your-own-loader)）时，应将msgctxt，msgid转为父子属性形式
```
public getTranslation(lang: string): Observable<any> {
    return this._http
        .get(`${this._prefix}/${lang}${this._suffix}`, { responseType: 'text' })
        .pipe(
            map((contents: string) => this.parse(contents)));
}

/**
* Parse po file
* @param contents
* @returns {any}
*/
public parse(contents: string): any {
    let translations: { [key: string]: object | string } = {};

    const po = gettext.po.parse(contents, 'utf-8');
    if (!po.translations.hasOwnProperty(this.domain)) {
        return translations;
    }

    Object.keys(po.translations)
        .forEach(domain => {
            if (domain.length === 0) { return; }
            if (po.translations[domain].msgstr) { // there is no msgctxt
                translations[domain] = po.translations[domain].msgstr;
            } else {
                // context
                translations[domain] = {};
                Object.keys(po.translations[domain]).forEach(key => {
                    let translation: string | Array<string> = po.translations[domain][key].msgstr.pop();
                    if (translation instanceof Array && translation.length > 0) {
                        translation = translation[0];
                    }
                    if (key.length > 0 && translation.length > 0) {
                        translations[domain][key] = translation;
                    }
                });
            }
        });
    return translations;
}
```
引入自己的 loader module
```
import { TranslatePoHttpLoader } from './edited-po-loader';
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