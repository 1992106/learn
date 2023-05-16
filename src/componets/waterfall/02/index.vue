<template>
  <div class="waterfall-wrapper" :style="{ 'column-gap': gap[1] }">
    <div
      class="col-wrapper"
      ref="cols"
      v-for="(col, i) in colData"
      :key="i"
      :style="{ 'row-gap': gap[0] }"
    >
      <div class="row-wrapper" :class="[animation]" v-for="(row, j) in col" :key="j">
        <slot :record="row" />
      </div>
    </div>
  </div>
</template>

<script>
let minCol = 0; // 最小列索引
const queue = new asyncQueue();

export default {
  props: {
    // 瀑布流数据
    data: {
      type: Array,
      default: () => []
    },
    // 列数
    col: {
      type: Number,
      default: 2
    },
    // 行、列间距
    gap: {
      type: Array,
      default: () => ['0px', '0px']
    },
    animation: {
      type: String,
      default: 'hapi' // hapi|osiris
    },
    distance: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      colData: []
    };
  },
  watch: {
    col: {
      handler: function (val) {
        // 初始化各列数据
        for (let i = 0; i < val; i++) {
          this.$set(this.colData, i, []);
        }
      },
      immediate: true
    },
    data: {
      handler: function (newVal) {
        queue.add(() => this.waterfall(newVal));
      }
    }
  },
  methods: {
    async updateMinCol() {
      await this.$nextTick();
      const heightList = this.$refs['cols'].map(item => item.offsetHeight);
      const minHeight = Math.min(...heightList);
      minCol = heightList.indexOf(minHeight);
    },

    async waterfall(data) {
      for await (const item of data) {
        // 更新瀑布流高度最小列
        await this.updateMinCol();
        // 添加到瀑布流高度最小的那一列
        this.colData[minCol].push(item);
      }
    },

    startScroll() {
      const nodes = this.$refs['cols'][minCol].querySelectorAll('img');
      const target = nodes[nodes.length - 1];
      if (
        target.getBoundingClientRect().bottom - document.documentElement.clientHeight <=
        this.distance
      ) {
        const done = () => {
          this.$emit('load');
        };
        if (target.complete) {
          done();
        } else {
          target.onload = target.onerror = done;
        }
      }
    }
  },
  created() {
    window.addEventListener('scroll', this.startScroll);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', this.startScroll);
    });
  }
};
</script>
<style lang="scss" scoped>
.waterfall-wrapper {
  display: flex;
  align-items: flex-start;
}

.col-wrapper {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
}
</style>
<style lang="scss">
.waterfall-wrapper {
  .hapi {
    .waterfall-card {
      animation: 0.4s hapi-animation linear;
      animation-fill-mode: forwards;
    }

    @keyframes hapi-animation {
      from {
        opacity: 0;
        transform-origin: 50% 50%;
        transform: scale(0);
      }

      to {
        opacity: 1;
        transform-origin: 50% 50%;
        transform: scale(1);
      }
    }
  }

  .osiris {
    .waterfall-card {
      animation: 0.4s osiris-animation linear;
      animation-fill-mode: forwards;
    }

    @keyframes osiris-animation {
      from {
        opacity: 0;
        transform-origin: 50% 50%;
        transform: translateZ(-3000px) rotateY(-1turn);
      }

      to {
        opacity: 1;
        transform-origin: 50% 50%;
        transform: translateZ(0) rotateY(0turn);
      }
    }
  }
}
</style>
