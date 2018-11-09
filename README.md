# canvas_handwriting
canvas_学写一个字
用jq与canvas交互, 可以更改书写的颜色以及清空画板, 适配移动设备
运用到移动端的touch事件`touchstart` `touchmove` `touchend`
`e.touches[0]`是第一个手指的触摸事件对象有`clientX` `clientY` `screenX` `screenY` `pageX` `pageY`等属性 这里用到的是 `pageX` `pageY`
