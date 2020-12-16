---
title: Angular About Test
date: 2020-04-26 13:08:50
tags:
- Angular
categories: 
- 前端技术
---
#### lint
静态代码检查(static code verify)，运行ng lint，根据项目目录下的tslint.json所配置的规则，检查诸如命名，空行，triple-equals等书写规范，在命令行输出违反规范的位置。
加参数--fix可自动修复绝大多数的检查错误

Unfortunately，tslint已于2019宣布停止维护，并迁移至typescript-eslint，见[TSLint in 2019](https://medium.com/palantir/tslint-in-2019-1a144c2317a9)
关于从TSLint到typescript-eslint，参考[Migrate the repo to ESLint](https://github.com/typescript-eslint/tslint-to-eslint-config)
对于Angular，有[angular-eslint plugin](https://github.com/angular-eslint/angular-eslint)支持ng10及以上版本
Angular CLI 会下载并安装试用 Jasmine 测试框架 测试 Angular 应用<br>
X.spec.ts文件用于Jasmine做单元测试
#### Karma 
Karma, 业（佛教观念，个人因果的集合）Karma是测试JavaScript代码而生的自动化测试管理工具，可监控文件的变化，自动执行测试。
```
    "karma": "^5.0.2",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage-istanbul-reporter": "~2.1.0",
    "karma-jasmine": "~2.0.1",
    "karma-jasmine-html-reporter": "^1.4.2",
```
#### Jasmine （Jasminum 茉莉）
见{% postlink Jasmine Jasmine %}
#### 单元测试
> 单元测试（英語：Unit Testing）又称为模块测试，是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。 程序单元是应用的最小可测试部件。 在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。
> 
[栗子](https://angular.cn/generated/live-examples/testing/specs.stackblitz.html)
假设为UserService.ts设计单元测试，须知
```
export class UserService{
  constructor(private commonHTTP:CommonHTTPService){ }

  getUserByID(id:string):Observable<any>{
    return commonHTTP.get(id)
  }
}
```
UserService.spec.ts
```
describe('UserService', ()=>{
  it('getUserByID return stubbed value from a spy', ()=>{
    const commonHTTPSpy = jasmine.createSpyObj('CommonHTTPService', ['get']);
    const stubValue = 'stub value';
    commonHTTPSpy.get.and.returnValue(stubValue);

    const userService = new UserService(commonHTTPSpy);
    expect(userService.getUserByID(1)).toBe(stubValue,'service returned stub value')
  })
});
```
上例待测
#### e2e
ng e2e builds and serves app, then runs end-to-end test with Protractor(端对端测试工具，protractor原意是量角器，Angular是角).
#### 配置使用Headless Chrome
[Angular.cn: 为在 Chrome 中运行 CI 测试而配置 CLI](https://angular.cn/guide/testing#configure-cli-for-ci-testing-in-chrome)
karma.conf.js
```
browsers: ['ChromeHeadlessCI'],
customLaunchers: {
  ChromeHeadlessCI: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
},
```
e2e/protractor.conf.js
```
const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox']
  }
};

exports.config = config;
```
#### code coverage 
```
ng test --code-coverage
```
或-cc输出代码覆盖率报告，其他参数见[Angular Docs](https://angular.io/cli/test)
> Issues:Uncaught NetworkError: Failed to execute 'send' on 'XMLHttpRequest': Failed to load 'ng:///XXXComponent/%C9%B5fac.js'.

使用--source-map=false避免test fail见[StackOverflow:Angular tests failing with Failed to execute 'send' on 'XMLHttpRequest'](https://stackoverflow.com/questions/45399079/angular-tests-failing-with-failed-to-execute-send-on-xmlhttprequest)