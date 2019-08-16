// ==UserScript==
// @name         console search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在控制台或搜索框使用搜索引擎
// @author       triski
// @include        *
// @grant        none
// ==/UserScript==

(function () {
    'use strict'
    
    /************************************* 常量 *************************************/

    // 搜索引擎
    var engine = {
        baidu: 'https://www.baidu.com/s?wd=%s',
        github: 'https://github.com/search?q=%s',
        maven: 'https://mvnrepository.com/search?q=%s',
        douban: 'https://www.douban.com/search?q=%s',
        extension: 'https://chrome.google.com/webstore/search/%s?hl=zh-CN',
        // 初始化
        load: function () {
            window['engine'] = engine
            for (var key in engine) {
                if ('string' == typeof engine[key]) {
                    eval(`window[key + '0'] = { url: '${engine[key]}', search: engine.search}`)
                    eval(`window[key] = function(keyword, newWin) {${key + '0'}.search(keyword, newWin)}`)
                }
            }
        },
        // 私有搜索函数
        search(keyword, newWin) {
            if (!keyword || 'boolean' == typeof keyword) {
                newWin = keyword
                keyword = ''
            }
            var result = this.url.split('%s').join(keyword)
            if (newWin) {
                open(result)
            } else {
                location = result
            }
        }
    }
    // 超链接
    var url = {
        github: 'https://github.com/free-myself',
        spring_cloud: 'https://www.fangzhipeng.com/spring-cloud.html',
        localhost: {
            url: 'http://localhost',
            port: [80, 4000, 8080]
        }
    }
    // 向控制台注册搜索引擎 api 与 engine 常量
    engine.load()
    // 向控制台注册 url 常量
    window['url'] = url

    /************************************* 页面渲染 *************************************/

    // <select id='engine'/>
    var select = document.createElement('select')
    select.id = 'engine'
    select.style = 'width: 100px'
    for (var key in engine) {
        if ('string' == typeof engine[key]) {
            var option = document.createElement('option')
            option.innerHTML = key
            select.appendChild(option)
        }
    }
    // <input id='keyword' onkeydown='changeWhenTabOrEnter(event)'/>
    var input = document.createElement('input')
    input.id = 'keyword'
    input.style = 'width: 200px'
    input.onkeydown = function (event) {
        var engine = document.getElementById('engine')
        var keyword = document.getElementById('keyword')
        // 按 tab 键更换搜索引擎
        if (event.key == 'Tab') {
            // shift + tab 向上切换
            if (event.shiftKey) {
                if (--engine.selectedIndex < 0) {
                    engine.selectedIndex = engine.length - 1
                }
            }
            // tab 向下切换 
            else if (++engine.selectedIndex >= engine.length) {
                engine.selectedIndex = 0
            }
            // 屏蔽 tab 键切换功能
            event.returnValue = false 
        }
        // 按 enter 键开始搜索
        else if (event.key == 'Enter') {
            eval(`${engine.value}('${keyword.value}', true)`)
            document.getElementById('dialog').style.display = 'none'
        }
    }
    // <bolck id='dialog'/>
    var block = document.createElement('block') // 不使用 div 是为了避免被某些页面的全局样式影响
    block.id = 'dialog'
    block.appendChild(select)
    block.append(' ')
    block.appendChild(input)
    var positionStyle = 'position:fixed; top: 1em; left: 30%;'
    var surfaceStyle = 'background-color: #c9c9ca; width: 500px; text-align: center; padding-top: 20px; padding-bottom: 20px; border-radius:5px;'
    block.style = positionStyle + surfaceStyle + 'display: none; z-index:9999;'
    // <body onkeydown='toggleDialog(event)'/>
    var body = document.getElementsByTagName('body')[0]
    body.appendChild(block)
    body.onkeydown = function (event) {
        var dialog = document.getElementById('dialog')
        // 使用 ctrl + shift + f 显示或隐藏搜索框
        if (event.ctrlKey && event.shiftKey && event.key == 'F') {
            if (dialog.style.display == '') {
                dialog.style.display = 'none'
            } else {
                dialog.style.display = ''
                document.getElementById('keyword').focus()
            }
        }
        // 使用 esc 隐藏搜索框
        else if (event.key == 'Escape') {
            dialog.style.display = 'none'
        }
    }
    // <a/>
    var urlTag = document.createElement('urlTag')
    for (var key in url) {
        if ('string' == typeof url[key]) {
            var a = document.createElement('a')
            a.href = url[key]
            a.innerHTML = underline2blank(key)
            urlTag.appendChild(a)
            urlTag.append(' & ')
        } else if (key == 'localhost') {
            urlTag.append('localhost: ')
            var localhost = url[key]
            localhost.port.forEach(port => {
                var a = document.createElement('a')
                a.href = localhost.url + ':' + port
                a.innerHTML = port
                urlTag.appendChild(a)
                if (port != localhost.port[localhost.port.length - 1]) {
                    urlTag.append(' · ')
                }
            })
        }
    }
    block.appendChild(document.createElement('br'))
    block.appendChild(document.createElement('br'))
    block.appendChild(urlTag)

    /************************************* 辅助函数 *************************************/

    // 下划线 -> 空格
    function underline2blank(str) {
        return str.replace('_', ' ')
    }
})();