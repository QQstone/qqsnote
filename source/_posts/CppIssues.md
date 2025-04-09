---
title: C++ issues
date: 2022-11-11 15:49:44
tags:
---
#### 悬空指针
即指针指向内容已被销毁
某年月日 考虑到返回空结构体难以判断，遂返回nullptr
```
MyExample::AdjustmentPop(){
    if(list.size>0){
        auto* struct_ptr = &list.back(); // 返回最后一个元素的地址
        list.pop_back();           // 注意：此时 structt_ptr 指向的元素已被移除
        return structt_ptr;   
    }else{
        return nullptr;
    }
}
```
当调用AdjustmentPop并访问指向的结构体内容时，其内容会突变为随机值