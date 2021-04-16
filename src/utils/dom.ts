// 创建自定义事件，并派发自定义事件
const triggerEvent = (el, eventType, detail) => el.dispatchEvent(new CustomEvent(eventType, { detail }))

// 获取当前子元素是其父元素下子元素的排位
const getIndex = el => {
  if (!el) {
    return -1
  }
  let index = 0
  do {
    index++
  } while (el = el.previousElementSibling);
  return index
}

// 获取当前元素相对于document的偏移量
const getOffset = el => {
  const {
    top,
    left
  } = el.getBoundingClientRect()
  const {
    scrollTop,
    scrollLeft
  } = document.body
  return {
    top: top + scrollTop,
    left: left + scrollLeft
  }
}

// 获取当前页面的滚动位置
const getScrollPosition = (el) => ({
  x: el.pageXOffset ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset ? el.pageYOffset : el.scrollTop
})

// fade动画
const fade = (el, type = 'in') => {
  el.style.opacity = (type === 'in' ? 0 : 1)
  let last = Number(new Date())
  const tick = () => {
    const opacityValue = (type === 'in'
      ? (Number(new Date()) - last) / 400
      : -(Number(new Date()) - last) / 400)
    el.style.opacity = Number(el.style.opacity) + opacityValue
    last = Number(new Date())
    if (type === 'in'
      ? (Number(el.style.opacity) < 1)
      : (Number(el.style.opacity) > 0)) {
      requestAnimationFrame(tick)
    }
  }
  tick()
}

// 获取元素类型
const type = obj => Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase()


// 判断是否是移动端
const isMobile = () => 'ontouchstart' in window

// 元素是否保护的指定类
const hasClass = (el, className) => el.classList.contains(className)

// 父元素是否包含子元素
const elementContains = (parent, child) => parent !== child && parent.contains(child)

// 元素是否在视口可见
const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) && ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth)) : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
}

// 获取标签内容（包含标签）
function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    let container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

const inBrowser = typeof window !== "undefined"
// const inWeex = typeof WXEnvironment !== "undefined" && !!WXEnvironment.platform
// const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
const UA = inBrowser && window.navigator.userAgent.toLowerCase()

const isIE = UA && /msie|trident/.test(UA)
const isIE9 = UA && UA.indexOf("msie 9.0") > 0
const isEdge = UA && UA.indexOf("edge/") > 0
const isAndroid = (UA && UA.indexOf("android") > 0) || weexPlatform === "android"
const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === "ios"
const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
const isPhantomJS = UA && /phantomjs/.test(UA)
const isFF = UA && UA.match(/firefox\/(\d+)/)

setTimeout(() => {
  // 插入十万条数据
  const total = 100000
  // 一次插入20条，如果觉得性能不好就减少
  const once = 20
  // 渲染数据总共需要几次
  const loopCount = total / once
  let countOfRender = 0
  let ul = document.querySelector('ul')
  function add() {
    // 优化性能，插入不会造成回流
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < once; i++) {
      const li = document.createElement('li')
      li.innerText = String(Math.floor(Math.random() * total))
      fragment.appendChild(li)
    }
    ul.appendChild(fragment)
    countOfRender += 1
    if (countOfRender < loopCount) {
      window.requestAnimationFrame(add)
    }
  }
  add()
  // window.requestAnimationFrame(add)
}, 0)

// 复制
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', 'readonly');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
}
