# 无限滚动：触底加载，滚动到页面底部加载更多数据

## 3种实现方案

### 1、滚动到底部时，则触发加载下一页的数据，新加载的数据与原来的列表合并即可

<!-- window.onscroll -->
A、document.body.scrollTop + document.body.clientHeight >= document.documentElement.scrollHeight

<!-- window.onscroll + getBoundingClientRect -->
B、scrollEl.getBoundingClientRect().bottom < document.documentElement.clientHeight

### 2、存储图片信息列表，在回调函数内判断如果当前元素是列表的最后一项，则触发加载下一页的数据，新加载的数据与原来的列表合并即可，加载数据后要监听新附加的元素

### 3、页面加入页尾栏（又称sentinels），一旦页尾栏可见，就表示用户到达了页面底部，从而加载新的数据放在页尾栏前面

***方案2和方案3都可以使用以下方法实现***

A、new MutationObserver()

<!-- 使用window.onscroll + getBoundingClientRect实现MutationObserver -->
B、targetEl.getBoundingClientRect().top < document.documentElement.clientHeight
