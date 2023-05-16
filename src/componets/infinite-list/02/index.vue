<template>
  <div class="infinite-list-wrapper" ref="infiniteEl">
    <div v-for="(item, index) in list" :key="index" class="infinite-cell">
      <slot :record="item"></slot>
    </div>
    <div v-if="loading && !finished && !error" class="loading-text">{{ loadingText }}</div>
    <div v-if="finished" class="finished-text">{{ finishedText }}</div>
    <div v-if="error" @click="handleError" class="error-text">{{ errorText }}</div>
  </div>
</template>
<script>
import { onMounted, onMounted, defineComponent, watch, ref, nextTick } from 'vue';
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    finished: {
      type: Boolean,
      default: false
    },
    finishedText: {
      type: String,
      default: '—— 到底了 ——'
    },
    error: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: '加载失败'
    },
    rootMargin: {
      type: String,
      default: '0px 0px 0px 0px'
    },
    distance: {
      type: Number,
      default: 0
    }
  },
  emits: ['load', 'update:loading', 'update:error'],
  setup(props, { emit }) {
    let observerObj = null;
    let innerData = [];

    const infiniteEl = ref(null);
    const list = ref([]);

    const load = () => {
      emit('update:loading', true);
      emit('load');
    };

    const startObserver = () => {
      const nodes = infiniteEl.value.querySelectorAll('.infinite-cell');
      const targetEl = nodes[nodes.length - 1];
      // 观察最末尾元素
      observerObj.observe(targetEl);
    };

    const startScroll = () => {
      if (props.loading || props.finished || props.error) {
        return;
      }
      // 判断最末尾元素是否触底
      const nodes = infiniteEl.value.querySelectorAll('.infinite-cell');
      const targetEl = nodes[nodes.length - 1];
      // targetEl.getBoundingClientRect().bottom - infiniteEl.value.getBoundingClientRect().bottom <= props.distance
      if (
        targetEl.getBoundingClientRect().bottom - document.documentElement.clientHeight <=
        props.distance
      ) {
        load();
      }
    };

    watch(props.data, val => {
      innerData = [...val];
      init();
    });

    const init = () => {
      const data = innerData.splice(0);
      list.value.push(...data);
      nextTick(() => {
        if (observerObj) {
          startObserver();
        } else {
          startScroll();
        }
      });
    };

    const handleError = () => {
      emit('update:error', false);
      load();
    };

    onMounted(() => {
      try {
        // 构建观察器
        observerObj = new IntersectionObserver(
          ([entry]) => {
            const { target, intersectionRatio  } = entry || {};
            // 目标元素完全可见
            if (intersectionRatio === 1) {
              load();
              // 停止观察，防止回拉时二次触发监听逻辑
              observerObj.unobserve(target);
            }
          },
          { rootMargin: props.rootMargin }
        );
      } catch (e) {
        window.addEventListener('scroll', startScroll);
      }
    });

    onMounted(() => {
      if (observerObj) {
        observerObj.disconnect();
      } else {
        window.removeEventListener('scroll', startScroll);
      }
    });

    return {
      infiniteEl,
      list,
      handleError
    };
  }
});
</script>
<style lang="less" scoped>
.infinite-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .loading-text,
  .finished-text,
  .error-text {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
  }
}
</style>
