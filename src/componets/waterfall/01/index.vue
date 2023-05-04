<template>
  <div ref="waterfall" class="waterfall-wrapper">
    <div
      class="waterfall-container"
      :style="{
        width: colWidth * cols + 'px',
        left: '50%',
        marginLeft: (-1 * colWidth * cols) / 2 + 'px'
      }">
      <div
        ref="cols"
        class="waterfall-cell"
        v-for="(item, index) in colsData"
        :key="index"
        :style="{ width: colWidth }">
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
                height: item._height + 'px'
              }">
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
    // 每次加载的数量
    onceCount: {
      type: Number,
      default: 12
    },
    // 图片的key
    imgKey: {
      type: String,
      default: 'src'
    },
    reachBottomDistance: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      loopCount: 0,
      colsHeight: [],
      isLoading: false,
      cols: 0,
      colsData: [] // 渲染数据
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
      if (
        newVal.length < this.colsData.length ||
        (this.colsData.length > 0 && newVal[0] && newVal[0]._height == null)
      ) {
        this.reset();
      }
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
      this.isLoading = true;
      for (let i = 0; i < this.onceCount; i++) {
        const record = this.data[i];
        if (!record) {
          this.$emit('preloaded');
          return;
        }
        // 有图片时，先预加载图片
        if (record[this.imgKey]) {
          const img = new Image();
          img.src = record[this.imgKey];
          img.onload = img.onerror = () => {
            this.data[i]._height = Math.round(this.colWidth * (img.height / img.width));
            if (this.onceCount === i) {
              this.$emit('preloaded');
            }
          };
        } else {
          // 无图时，直接跳过
          this.data[i]._height = 0;
          if (this.onceCount === i) {
            this.$emit('preloaded');
          }
        }
      }
    },
    waterfall() {
      if (!this.$refs['cols']) return;
      let top,
        left,
        startIndex = this.loopCount * this.onceCount;
      for (let i = startIndex; i < this.colsData.length; i++) {
        const colHeight = this.$refs['cols'][i].offsetHeight;
        if (i < this.cols) {
          // 第一行
          top = 0;
          left = i * (this.colWidth + this.colGap);
          this.colsHeight.push(colHeight);
        } else {
          // 其他行
          // 找出最小高度列和索引，假设最小高度是第一个元素
          let minHeight = this.colsHeight[0];
          let minIndex = 0;
          for (let j = 0; j < this.colsHeight.length; j++) {
            const height = this.colsHeight[j];
            if (minHeight > height) {
              minHeight = height;
              minIndex = j;
            }
          }
          // let minHeight = Math.min.apply(null, this.colsHeight);
          // let minIndex = this.colsHeightArr.indexOf(minHeight)

          top = minHeight + this.rowGap;
          left = minIndex * (this.colWidth + this.colGap);

          // 修改最小列的高度
          this.colsHeight[minIndex] = colHeight + minHeight + rowGap;
        }

        this.$refs['cols'][i].style.top = top + 'px';
        this.$refs['cols'][i].style.left = left + 'px';
      }
      this.isLoading = false;
      this.loopCount++;
    },
    scrollFn() {
      if (this.isLoading) return;
      let waterfallEl = this.$refs.waterfall;
      let minHeight = Math.min.apply(null, this.colsHeight);
      if (waterfallEl.scrollTop + waterfallEl.offsetHeight > minHeight - this.reachBottomDistance) {
        if (this.colsData.length < this.data.length) {
          this.preload();
        } else {
          this.$emit('scrollReachBottom'); // 滚动触底
        }
      }
    },
    resizeFn() {
      let old = this.cols;
      this.cols = this.calcCols();
      if (old === this.cols) return; // 列数不变直接退出
      this.loopCount = 0;
      this.colsHeight = [];
      this.$nextTick(() => {
        this.waterfall();
      });
    },
    reset() {
      this.loopCount = 0;
      this.colsHeight = [];
      this.isLoading = false;
      this.colsData = [];
    }
  },
  mounted() {
    this.cols = this.calcCols();
    this.preload();
    this.$on('preloaded', () => {
      const data = this.data.slice(
        this.loopCount * this.onceCount,
        (this.loopCount + 1) * this.onceCount
      );
      this.colsData = this.colsData.concat(data);
      this.$nextTick(() => {
        this.waterfall();
      });
    });
    // 注册scroll事件
    this.$refs.waterfall.addEventListener('scroll', this.scrollFn);
    // 注册resize事件
    window.addEventListener('resize', this.resizeFn);
    // 使用$once和hook实现注销事件
    this.$once('hook:beforeDestroy', () => {
      this.$refs.waterfall.removeEventListener('scroll', this.scrollFn);
      window.removeEventListener('resize', this.resizeFn);
    });
  }
};
</script>

<style lang="scss" scoped>
.waterfall-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

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
