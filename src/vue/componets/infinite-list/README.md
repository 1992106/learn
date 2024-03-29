# 无限滚动：触底加载，滚动到页面底部加载更多数据

## 3种实现方案

### 1、滚动到底部时，则触发加载下一页的数据，新加载的数据与原来的列表合并即可

A、<!-- window.onscroll -->
document.body.scrollTop + document.body.clientHeight + offset >= document.documentElement.scrollHeight
scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight) <= offset

### 2、存储图片信息列表，在回调函数内判断如果当前元素是列表的最后一项，则触发加载下一页的数据，新加载的数据与原来的列表合并即可，加载数据后要监听新附加的元素

A、new MutationObserver()
entries[0].intersectionRatio === 1 // 目标元素是否完全可见

B、<!-- 使用window.onscroll + getBoundingClientRect实现向上滚动触底效果；其中targetEl是最末目标元素，scrollEl是滚动容器元素-->
targetEl.getBoundingClientRect().bottom - document.documentElement.clientHeight <= offset
targetEl.getBoundingClientRect().bottom - scrollEl.getBoundingClientRect().bottom <= offset

### 3、页面加入页尾栏（又称sentinels），一旦页尾栏可见，就表示用户到达了页面底部，从而加载新的数据放在页尾栏前面

A、new MutationObserver()
entries[0].isIntersecting === true // 目标元素与根元素相交

B、<!-- 使用window.onscroll + getBoundingClientRect实现向上滚动懒加载效果；其中targetEl是高度为0的空元素，scrollEl是滚动容器元素 -->
targetEl.getBoundingClientRect().top - document.documentElement.clientHeight <= offset
targetEl.getBoundingClientRect().top - scrollEl.getBoundingClientRect().bottom <= offset
