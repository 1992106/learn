<template>
  <div class="infinite-list-wrapper" ref="infiniteEl">
    <slot></slot>
    <div v-if="loading && !finished && !error" class="loading-text">{{ loadingText }}</div>
    <div v-if="finished" class="finished-text">{{ finishedText }}</div>
    <div v-if="error" @click="handleError" class="error-text">{{ errorText }}</div>
    <div ref="targetEl" class="placeholder"></div>
  </div>
</template>
<script>
import { onMounted, onUnmounted, defineComponent, watch, ref, nextTick } from 'vue';
export default defineComponent({
  props: {
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
      default: '0px 0px 30px 0px'
    },
    distance: {
      type: Number,
      default: 30
    }
  },
  emits: ['load', 'update:loading', 'update:error'],
  setup(props, { emit }) {
    let observerObj = null;
    const infiniteEl = ref(null);
    const targetEl = ref(null);

    const load = () => {
      emit('update:loading', true);
      emit('load');
    };

    const doCheck = () => {
      nextTick(() => {
        if (props.loading || props.finished || props.error) {
          return;
        }
        // targetEl.value.getBoundingClientRect().bottom - infiniteEl.value.getBoundingClientRect().bottom <= props.distance
        if (
          targetEl.value.getBoundingClientRect().top - document.documentElement.clientHeight <= props.distance
        ) {
          load();
        }
      });
    };

    watch(() => [props.loading, props.finished, props.error], doCheck);

    const handleError = () => {
      emit('update:error', false);
      load();
    };

    onMounted(() => {
      try {
        // 构建观察器
        observerObj = new IntersectionObserver(
          ([entry]) => {
            if (props.loading || props.finished || props.error) {
              return;
            }
            // 目标元素与根元素相交
            if (entry && entry.isIntersecting) {
              load();
            }
          },
          { rootMargin: props.rootMargin }
        );

        // 观察目标元素
        observerObj.observe(targetEl.value);
      } catch (e) {
        window.addEventListener('scroll', doCheck);
      }
    });

    // 组件销毁前停止监听
    onUnmounted(() => {
      if (observerObj) {
        observerObj.disconnect();
      } else {
        window.removeEventListener('scroll', doCheck);
      }
    });

    return {
      infiniteEl,
      targetEl,
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

  .placeholder {
    height: 0;
    pointer-events: none;
  }
}
</style>
