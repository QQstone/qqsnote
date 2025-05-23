---
title: Qt
date: 2024-03-01 14:06:04
tags:
---
#### 应用及案例
Qt是跨平台UI框架
WPS Autodesk Maya 极品飞车是Qt开发的
医疗设备软件选择Qt开发 缘于极致性能及可靠性
#### slot vs signal
+ connect 
+ function


#### Qt creator

#### Delegate Model
```
ListView {

      id: listview

      Layout.fillWidth: true 

      height: 80

      orientation: ListView.Horizontal

      spacing: 15

      displaced: Transition {

        NumberAnimation {

          properties: "x,y"

          easing.type: Easing.OutQuad

        }

      }
 
      model: DelegateModel {

        id: visualModel

        model: selectedItems

        delegate: DropArea {

          id: delegateRoot

          width: tt.width

          height: tt.height
 
          onEntered: function (drag) {

            visualModel.items.move(drag.source.curIndex, tt.curIndex)

          }

          property int visualIndex: DelegateModel.itemsIndex
 
          DraggableIcon {

            id: tt

            dragParent: listview

            curIndex: delegateRoot.visualIndex

            sourceImg: source

            keyImg: key

          }

        }

      }

    }
 
```
