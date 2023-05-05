<template>
  <div class="infinite-list-wrapper" ref="infiniteEl">
    <div v-for="(item, index) in list" :key="index" class="infinite-cell">
      <slot :record="item"></slot>
    </div>
  </div>
</template>
<script>
import { onMounted, onBeforeUnmount, defineComponent, watch, ref, nextTick } from 'vue';
import { checkIntersectionObserver } from '../util';
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => []
    },
    // 首屏并行渲染数量
    firstPageCount: {
      type: Number,
      default: 12
    },
    rootMargin: {
      type: String,
      default: '0px 0px 400px 0px'
    },
    reachBottomDistance: {
      type: Number,
      default: 400
    }
  },
  emits: ['intersect'],
  setup(props, { emit }) {
    let isIntersectionObserver = checkIntersectionObserver();
    let observer = null;
    let innerData = [];
    let count = 0;

    const infiniteEl = ref(null);

    const list = ref([]);
    const appendColData = () => {
      const data = innerData.shift();
      list.value.push(data);
    };

    const startObserver = () => {
      const nodes = infiniteEl.value.querySelectorAll('.infinite-cell');
      const target = nodes[nodes.length - 1];
      // 观察目标元素
      observer.observe(target);
    };

    const startScroll = () => {
      const nodes = infiniteEl.value.querySelectorAll('.infinite-cell');
      const target = nodes[nodes.length - 1];
      if (
        target.getBoundingClientRect().top <
        document.documentElement.clientHeight + props.reachBottomDistance
      ) {
        if (innerData.length) {
          init();
        } else {
          emit('scrollReachBottom');
        }
      }
    };

    watch(props.data, val => {
      innerData = [...innerData, ...val];
      init();
    });

    const init = () => {
      appendColData();
      // 首次开启并行渲染
      if (++count < props.firstPageCount) {
        nextTick(() => {
          init();
        });
      } else {
        nextTick(() => {
          if (isIntersectionObserver) {
            startObserver();
          } else {
            startScroll();
          }
        });
      }
    };

    onMounted(() => {
      if (isIntersectionObserver) {
        // 构建观察器
        observer = new IntersectionObserver(
          ([entry]) => {
            const { target, isIntersecting } = entry || {};
            // 目标元素与根元素相交
            if (isIntersecting) {
              if (innerData.length) {
                init();
              } else {
                emit('scrollReachBottom');
              }
              // 停止观察，防止回拉时二次触发监听逻辑
              observer.unobserve(target);
            }
          },
          { rootMargin: props.rootMargin }
        );
      } else {
        window.addEventListener('scroll', startScroll);
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', startScroll);
    });

    return {
      infiniteEl,
      list
    };
  }
});
</script>
<style lang="less" scoped>
.infinite-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
