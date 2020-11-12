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

// fade动画
const fade = (el, type = 'in') => {
  el.style.opacity = (type === 'in' ? 0 : 1)
  let last = +new Date()
  const tick = () => {
    const opacityValue = (type === 'in'
      ? (+new Date() - last) / 400
      : -(+new Date() - last) / 400)
    el.style.opacity = +el.style.opacity + opacityValue
    last = +new Date()
    if (type === 'in'
      ? (+el.style.opacity < 1)
      : (+el.style.opacity > 0)) {
      requestAnimationFrame(tick)
    }
  }
  tick()
}

// 获取元素类型
const type = obj => Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();


// 判断是否是移动端
const isMobile = () => 'ontouchstart' in window


setTimeout(() => {
  // 插入十万条数据
  const total = 100000
  // 一次插入 20 条，如果觉得性能不好就减少
  const once = 20
  // 渲染数据总共需要几次
  const loopCount = total / once
  let countOfRender = 0
  let ul = document.querySelector('ul')
  function add() {
    // 优化性能，插入不会造成回流
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
  window.requestAnimationFrame(add)
}, 0)
