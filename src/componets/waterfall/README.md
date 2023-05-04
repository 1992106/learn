# 瀑布流
// 瀑布流是无限滚动的一种特殊场景
// 瀑布流三种布局方式: 卡片流、固定式瀑布流、交错式瀑布流；第一种和第二种场景图片高度固定，实现相对简单，直接使用无限加载组件即可。
<!-- 卡片流以一个下拉列表的形式呈现 -->
<!-- 固定式瀑布流图片区域大小高度保持不变。统一的高度会使整个界面看起来比较整齐，视觉上不乱。 -->
<!-- 交错式瀑布流视觉表现为宽度相等、高度不定的元素组成参差不齐的多栏布局 -->

## 2种布局方案

1、绝对定位（通过已知宽度计算出列数）【固定宽度/百分比宽度】 => 一维数组
<!-- https://zhuanlan.zhihu.com/p/55575862 -->
<!-- https://juejin.cn/post/7026253551361851405
https://github.com/parrot-design/parrot-ve-waterfall -->
<!-- https://github.com/MopTym/vue-waterfall 
http://app.moptym.com/vue-waterfall/demo/vertical-line.html-->

2、多列（通过已知列数计算出宽度）【百分比宽度/Flex布局】 => 二维数组
<!-- https://zhuanlan.zhihu.com/p/498417458 -->
<!-- https://github.com/AwesomeDevin/vue-waterfall2
https://codesandbox.io/embed/vue-template-99ps6 -->


### 瀑布流逻辑实现

1、 新建 image 对象，onload 时先获取图片的原始宽高，再根据瀑布流分配的宽度计算出实际渲染的高度，作为内联样式挂载到 DOM 上
// 不支持懒加载

2、直接在接口返回的图片url中拼接图片的宽高信息，提前布局。
// 图片加载前就可以开始进行排版，方便简单，也支持懒加载，用户体验也好；但这种场景需要进行一些改造，比如在图片入库前将图片信息拼接到url上，或者后端接口读取图片对象，然后将图片信息返回给前端。要么改造成本较大，要么会增加服务器压力，并不太适合我们业务。

3、IntersectionObserver 监听图片元素，出现在视图当中开始从瀑布流数据队列的列头中取出一个数据并渲染到当前瀑布流的最低列，如此循环往复实现瀑布流的懒加载
