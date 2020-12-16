---
title: Jasmine
date: 2020-12-11 14:12:55
tags:
- Jasmine
categories: 
- 工具
---
测试驱动开发(Test Driven Development, TDD)和行为驱动开发(Behavior Driven Development, BDD)
Jasmine 通过用自然语言书写非程序员可读的测试用例扩展了测试驱动开发方法, 行为驱动开发人员使用混合了领域中统一的语言的母语语言来描述他们的代码的目的

被测系统(System under test, SUT)

> 单测不负责检查跨类或者跨系统的交互逻辑，那都是集成测试的范围

> 单测不能受到外界环境的影响, 依赖需要用本地实现注入，或者提供一个mock(桩对象)

> 单测需要能快速执行，有必要在每次修改代码时运行单测

> 单测应随编码进行，补单测是没有意义的

```
├───lib
│   └───jasmine-3.4.0
│           boot.js
│           jasmine-html.js
│           jasmine.css
│           jasmine.js
│           jasmine_favicon.png
├───spec
│       PlayerSpec.js
│       SpecHelper.js
└───src
        Player.js
        Song.js
```
spec + src文件夹是栗子
```
describe("Player", function() {
  var player;
  var song;

  beforeEach(function() {
    player = new Player();
    song = new Song();
  });

  it("should be able to play a Song", function() {
    player.play(song);
    expect(player.currentlyPlayingSong).toEqual(song);

    //demonstrates use of custom matcher
    expect(player).toBePlaying(song);
  });

  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });
});
```
init with Node.js
```
npm install --save-dev jasmine
npx jasmine init
```
#### describe
以describe分组specs,它代表一组相似的测试用例,通常有 2 个参数：字符串和方法。字符串作为特定 Suite 的名字和标题。方法是包含实现的代码。
```
describe ('HeroesService (with spies)', () => {
    ...
});
describe('HeroesService (with mocks)', () => {
    ...
});
```
#### it 和 specs
specs即specification(规则)，它们是一个个断言，可以是 true 或者 false。当每个 Spec 中的所有 expectations 都是 true，则通过测试。以it函数定义，与describe类似的，有 2 个参数：标题和方法。
#### expect tobe
```
 expect(true).toBe(true);
 expect(false).not.toBe(true); 
```
#### 断言
+ toBe 和 toEqual 前者相当于比较运算符=== 后者比较字面量的值(对于对象进行属性的比较)
+ toMatch
+ toBeDefined 和 toBeNull
+ toContain
+ toBeGreaterThan 和 toBeLessThan
+ toBeCloseTo
+ toThrow
#### beforeEach和afterEach
分别在每个it断言测试前/后调用
#### spy
存根(stub)和跟踪(track)任意函数
```
  spyOn(foo, 'setBar');
    foo.setBar(123);
    foo.setBar(456, 'another param');
  });
  it("tracks that the spy was called", function() {
    expect(foo.setBar).toHaveBeenCalled();
  });
  it("tracks that the spy was called x times", function() {
    expect(foo.setBar).toHaveBeenCalledTimes(2);
  });
  it("tracks all the arguments of its calls", function() {
    expect(foo.setBar).toHaveBeenCalledWith(123);
    expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
  });
```
spy一个foo对象上的setBar方法，分别断言该方法被调用、被调用若干次、被以某某参数调用
很多时候用spy对应模拟对象
