---
title: Angular About Test
date: 2020-04-26 13:08:50
tags:
- Angular
categories: 
- 前端技术
---
Angular CLI 会下载并安装试用 Jasmine 测试框架 测试 Angular 应用<br>
X.spec.ts文件用于Jasmine做单元测试
#### 单元测试
> 单元测试（英語：Unit Testing）又称为模块测试，是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。 程序单元是应用的最小可测试部件。 在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。

#### Jasmine （Jasminum 茉莉）
download ZIP
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
#### Karma 
Karma, 业（佛教观念，个人因果的集合）