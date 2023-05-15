<template>
  <div ref="waterfall" class="waterfall-wrapper">
    <div
      class="waterfall-container"
      :style="{
        width: colWidth * cols + 'px',
        left: '50%',
        marginLeft: (-1 * colWidth * cols) / 2 + 'px'
      }"
    >
      <div
        ref="cols"
        class="waterfall-cell"
        v-for="(item, index) in colsData"
        :key="index"
        :style="{ width: colWidth }"
      >
        <slot :record="item">
          <div class="waterfall-card">
            <div v-if="hasHeaderSlot" class="card-header">
              <slot name="header" :record="item" />
            </div>
            <div
              v-if="item[imgKey]"
              class="card-box"
              :style="{
                width: '100%',
                height: (item._height || 0) + 'px'
              }"
            >
              <img class="waterfall-img" :src="item[imgKey]" />
            </div>
            <div v-if="hasFooterSlot" class="card-footer">
              <slot name="footer" :record="item" />
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
let colsHeight = []; // 每列的高度
let innerData = []; // 瀑布流数据队列
let count = 0; // 已经渲染的数量
let loading = false;
export default {
  props: {
    // 瀑布流数据
    data: {
      type: Array,
      default: () => []
    },
    // 列宽度
    colWidth: {
      type: Number,
      default: 240
    },
    // 最大列数
    maxCols: {
      type: Number,
      default: 6
    },
    // 行、列间距
    gap: {
      type: [Array, Number],
      default: () => [10, 10]
    },
    // 图片的key
    imgKey: {
      type: String,
      default: 'src'
    },
    distance: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      cols: 0, // 列数
      colsData: [] // 真实渲染的数据
    };
  },
  computed: {
    hasHeaderSlot() {
      return !!this.$scopedSlots.header;
    },
    hasFooterSlot() {
      return !!this.$scopedSlots.footer;
    },
    rowGap() {
      return Array.isArray(this.gap) ? this.gap[0] : this.gap;
    },
    colGap() {
      return Array.isArray(this.gap) ? this.gap[1] : this.gap;
    }
  },
  watch: {
    data(newVal) {
      if (newVal.length === 0) {
        loading = false
        return
      }
      innerData = [...newVal];
      this.preload();
    }
  },
  methods: {
    calcCols() {
      let waterfallWidth = this.$refs['waterfall'].offsetWidth || window.innerWidth;
      let cols = Math.max(parseInt(waterfallWidth / this.colWidth), 1);
      return Math.min(cols, this.maxCols);
    },
    preload() {
      let index = 0
      for (let i = 0; i < innerData.length; i++) {
        const record = innerData[i];
        const imgUrl = record[this.imgKey]
        // 有图片时，先预加载图片获取图片宽高
        if (imgUrl) {
          const img = new Image();
          img.src = imgUrl;
          img.onload = img.onerror = () => {
            index++
            innerData[i]._height = Math.round(this.colWidth * (img.height / img.width));
            if (index === i) {
              this.$emit('preloaded');
            }
          };
        } else {
          index++
          innerData[i]._height = 0;
          // 无图或无数据时，直接跳过预加载
          if (index === i) {
            this.$emit('preloaded');
          }
        }
      }
    },
    waterfall() {
      let top, left;
      for (let i = count; i < this.colsData.length; i++) {
        const colHeight = this.$refs['cols'][i].offsetHeight;
        if (i < this.cols) {
          // 第一行
          top = 0;
          left = i * (this.colWidth + this.colGap);
          colsHeight.push(colHeight);
        } else {
          // 其他行
          // 找出最小高度列和索引，假设最小高度是第一个元素
          let minHeight = colsHeight[0];
          let minIndex = 0;
          for (let j = 0; j < colsHeight.length; j++) {
            const height = colsHeight[j];
            if (minHeight > height) {
              minHeight = height;
              minIndex = j;
            }
          }
          // let minHeight = Math.min.apply(null, colsHeight);
          // let minIndex = colsHeight.indexOf(minHeight)

          top = minHeight + this.rowGap;
          left = minIndex * (this.colWidth + this.colGap);

          // 修改最小列的高度
          colsHeight[minIndex] = colHeight + minHeight + rowGap;
        }

        this.$refs['cols'][i].style.top = top + 'px';
        this.$refs['cols'][i].style.left = left + 'px';
      }
      count = this.colsData.length;
    },
    scrollFn() {
      if (loading) return
      let waterfallEl = this.$refs['waterfall'];
      let minHeight = Math.min.apply(null, colsHeight); // minHeight约等于document.body.scrollHeight
      // document.body.scrollTop + document.body.clientHeight >= document.documentElement.scrollHeight
      if (waterfallEl.scrollTop + waterfallEl.clientHeight >= minHeight - this.distance) {
        loading = true;
        this.$emit('load'); // 滚动触底
      }
    },
    resizeFn() {
      let old = this.cols;
      this.cols = this.calcCols();
      if (old === this.cols) return; // 列数不变直接退出
      count = 0;
      colsHeight = [];
      this.$nextTick(() => {
        this.waterfall();
      });
    }
  },
  mounted() {
    loading = true;
    this.cols = this.calcCols();
    this.$on('preloaded', () => {
      const data = innerData.splice(0);
      this.colsData = this.colsData.concat(data);
      this.$nextTick(() => {
        loading = false
        this.waterfall();
      });
    });
    // 注册scroll事件
    window.addEventListener('scroll', this.scrollFn);
    // 注册resize事件
    window.addEventListener('resize', this.resizeFn);
    // 使用$once和hook实现注销事件
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', this.scrollFn);
      window.removeEventListener('resize', this.resizeFn);
    });
  }
};
</script>

<style lang="scss" scoped>
.waterfall-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  .waterfall-container {
    width: 100%;
    position: absolute;
  }

  .waterfall-cell {
    position: absolute;
    .waterfall-img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}
</style>
