---
title: ElementUI
date: 2020-03-04 15:41:08
tags:
- ElementUI
---
> [ElementUI](https://element.eleme.cn/), a Vue 2.0 based component library
### Caution! 限定的引入顺序：
UI.css --> template --> vue.js --> UI.js --> vue controller <br>
其中 template 和 vue.js 交换没有影响
#### 响应式栅格布局
基础栅格，基于24划分。
```
<el-row>
  <el-col :span="6">
    <div class="grid-content bg-purple"></div>
  </el-col>
  <el-col :span="6">
    <div class="grid-content bg-purple-light"></div>
  </el-col>
  <el-col :span="6">
    <div class="grid-content bg-purple"></div>
  </el-col>
  <el-col :span="6">
    <div class="grid-content bg-purple-light"></div>
  </el-col>
</el-row>
```
间隔（ :gutter ）<br>
栅格之间的水平间距
```
<el-row :gutter="20">
  ...
</el-col>
```
偏移（ :offset ）
```
<el-col :span="6" :offset="6"><div class="grid-content"></div></el-col>
```
弹性盒子（ flex ）
```
<el-row type="flex" justify="center" align="center">
    ...
</el-row>
```
水平值：start, center, end, space-between, space-around<br>
垂直值：top, middle, bottom<br>

响应式( Responsive )
```
<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
    <div class="grid-content"></div>
</el-col>
```
隐藏
+ hidden-xs-only - 当视口在 xs 尺寸时隐藏
+ hidden-sm-only - 当视口在 sm 尺寸时隐藏
+ hidden-sm-and-down - 当视口在 sm 及以下尺寸时隐藏
+ hidden-sm-and-up - 当视口在 sm 及以上尺寸时隐藏
#### Form表单
```
<div id="app">
    <el-form ref="form" :model="formData" :rules="formValidators" label-width="80px">
        <el-form-item label="title" prop="title">
            <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="Date">
            <el-col :span="11">
                <el-date-picker type="date" placeholder="Pick a date" v-model="formData.date1" style="width: 100%;">
                </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
                <el-time-picker placeholder="Pick a time" v-model="formData.date2" style="width: 100%;">
                </el-time-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="Subscribe">
            <el-switch v-model="formData.isSubscribe"></el-switch>
        </el-form-item>
        <el-form-item label="TAG">
            <el-checkbox-group v-model="formData.tags">
                <el-checkbox label="Activity" name="type"></el-checkbox>
                <el-checkbox label="Bonus" name="type"></el-checkbox>
                <el-checkbox label="Online" name="type"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Comments">
            <el-input type="textarea" v-model="formData.Comments"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
        </el-form-item>
    </el-form>
</div>
```
```
var Main = {
    data() {
        return {
            formData: {
                title: '',
                date1: '',
                date2: '',
                isSubscribe: false,
                tags: [],
                Comments: ''
            },
            formValidators: {
                title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 5,
                        message: '长度在 3 到 5 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(event);
                    console.log(this.formData)
                } else {
                    console.log('validate fail');
                    return false;
                }
            });

        }
    }
}
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
```
以上几乎就是官网的example，官方文档未给出submit事件触发form action的表单提交方式，api文档中未提及action属性。有资料表示存在“ this.$refs.formName.submit ”（QQs未验证）
> 这种方式也造成了做表单校验时，要在提交方法中调用form.validate，form.validate又是个异步操作，后续动作（一般是http post）要放在其回调函数中<br>
而在我大Angular的响应式表单中，ngSubmit监听FormGroup当前值，在校验不通过时将禁用type="submit"提交按钮

如上例所示，表单验证需添加表单的:rules属性，表单项的prop属性（注意在label，值同name），提交方法中调用form.validate

#### Table
```
<template>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="date" label="日期" width="150">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="300">
        </el-table-column>
        <el-table-column prop="zip" label="邮编" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
```
```
var Main = {
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-04',
                name: '王大虎',
                address: '上海市普陀区金沙江路 1517 弄',
                zip: 200333
            }]
        }
    },
    methods: {
        handleClick(row) {
            console.log(row);
        }
    }
}
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
```
比较有意思的是这个el-table-column label可以设置 [多级表头](https://element.eleme.cn/#/zh-CN/component/table#duo-ji-biao-tou)