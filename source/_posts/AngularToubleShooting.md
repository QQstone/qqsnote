---
title: Angular Touble Shooting
date: 2019-10-15 17:51:54
tags:
- Angular
---
### 异步响应方法中更新数据，视图无法及时更新
> 解决方法：导入ChangeDetectRef
```
import { ChangeDetectorRef } from '@angular/core';

constructor(
    private changeDetectorRef:ChangeDetectorRef) { 
        // user token updated!
        this.userService.currentUserToken$.subscribe(res=>{
            if(res){
            this.logged = true;
            this.email = res['UserName'].value;
            this.changeDetectorRef.detectChanges()
            }
        })
    }
}
```