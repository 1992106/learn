<!-- https://zhuanlan.zhihu.com/p/55575862 -->
<template>
  <div class="waterfall-wrapper">
    <div
      ref="items"
      class="item-wrapper"
      v-for="(item, i) in data"
      :key="i"
      :style="{ width: itemWidth }"
    >
      <slot :item="item" />
    </div>
  </div>
</template>
<script>
// clientWidth 处理兼容性
function getClient() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height:
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
}
export default {
  props: {
    // 瀑布流数据
    data: {
      type: Array,
      default: () => []
    },
    // 行、列间距
    gap: {
      type: Array,
      default: () => [10, 10]
    },
    // 宽度
    itemWidth: {
      type: String,
      default: '25%'
    }
  },
  watch: {
    data: {
      handler: function () {
        this.waterfall()
      }
    }
  },
  methods: {
    calculate() {
      const [rowGap, colGap] = this.gap;
      const items = this.$refs['items'];
      //首先确定列数 = 页面的宽度 / 图片的宽度
      const pageWidth = getClient().width;
      const itemWidth = items[0].offsetWidth;
      const columns = parseInt(pageWidth / (itemWidth + colGap));
      const arr = []; //定义一个数组，用来存储元素的高度
      for (let i = 0; i < items.length; i++) {
        if (i < columns) {
          //满足这个条件则说明在第一行，文章里面有提到
          items[i].style.top = 0;
          items[i].style.left = (itemWidth + colGap) * i + 'px';
          arr.push(items[i].offsetHeight);
        } else {
          //其他行，先找出最小高度列，和索引
          //假设最小高度是第一个元素
          let minHeight = arr[0];
          let index = 0;
          for (var j = 0; j < arr.length; j++) {
            //找出最小高度
            if (minHeight > arr[j]) {
              minHeight = arr[j];
              index = j;
            }
          }
          //设置下一行的第一个盒子的位置
          //top值就是最小列的高度+gap
          items[i].style.top = arr[index] + rowGap + 'px';
          items[i].style.left = items[index].offsetLeft + 'px';

          //修改最小列的高度
          //最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
          arr[index] = arr[index] + items[i].offsetHeight + rowGap;
        }
      }
    },
    waterFall() {
      this.$nextTick(() => this.calculate());
    }
  },
  mounted() {
    this.waterfall();
    window.addEventListener('resize', this.waterFall);
    // 使用$once和hook实现注销事件
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.waterFall);
    });
  }
};
</script>

<style lang="scss" scoped>
.waterfall-wrapper {
  position: relative;

  .item-wrapper {
    position: absolute;
  }
}
</style>
