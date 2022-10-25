---
title: 相机标定
date: 2022-02-18 10:23:25
tags:
---
输入棋盘图片路径 棋盘角点数（横纵方格数减1）
```
def calibratePos(imgPath, w, h):
    chessboardImg = cv2.imread(imgPath)
    chessboardImg = cv2.cvtColor(chessboardImg, cv2.COLOR_BGR2GRAY)
    ret, chessboard = cv2.findChessboardCorners(chessboardImg, (w, h), None)
    cv2.drawChessboardCorners(chessboardImg, (w, h), chessboard, ret)
    # cv2.imwrite('calibrated_image.jpg', chessboardImg)
    cv2.imshow('calibrated image', chessboardImg)
    cv2.waitKey(0)
```