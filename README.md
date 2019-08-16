# 前端搜索引擎组件

## 使用环境

油猴子插件

## 注册的控制台 API：

| api | type | effect |
|--|--|--|
| engine | object | 显示所有可用的搜索引擎，使用 `engine.load() `可初始化引擎 |
| baidu / github / maven / ... | function | args1 = 关键字，args2 = 是否在新窗口打开，如 `github('mybatis', true)` |

显示所有可用的搜索引擎
```javascript
// 向控制台输入 engine，显示结果如下
{
    baidu: "https://www.baidu.com/s?wd=%s",
    extension: "https://chrome.google.com/webstore/search/%s?hl=zh-CN",
    github: "https://github.com/search?q=%s",
    maven: "https://mvnrepository.com/search?q=%s",
    douban: "https://www.douban.com/search?q=%s",
    load: function() { /* ... */ }
}
```
在控制台使用搜索引擎，以百度为例
```javascript
baidu()                 // 打开百度搜索首页
baidu(true)             // 在新窗口打开百度搜索
baidu('hello world')    // 在当前页打开百度搜索，关键字为 ‘hello world’
baidu('hello world')    // 在新窗口搜索
```
自定义搜索引擎
```javascript
// 一次性，页面重载后会被重置
engine.bing = 'https://cn.bing.com/search?q=%s'
engine.load()
bing('hello world')

// 永久性
// 直接修改源码的 engine 变量
```

## 可视化组件

* 使用 `ctrl + shift + f` 快捷键可显示或隐藏搜索框
* 使用 `esc` 快捷键可隐藏搜索框
* 在搜索框中使用 `tab` 可切换搜索引擎，使用 `shift + tab` 可向前切换，使用 `enter` 可执行搜索，搜索时默认打开一个新的窗口


## 其他

* 提供了一个超链接的变量 url，可根据需要自定义

```javascript
// 向控制台输入 url，显示结果如下
{
    github: "https://github.com/free-myself",
    spring_cloud: "https://www.fangzhipeng.com/spring-cloud.html",
    localhost: {
        url: "http://localhost",
        port: [80, 4000, 8080]
    }
}
```