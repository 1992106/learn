<template>
  <div class="infinite-list-wrapper" ref="infiniteEl">
    <slot></slot>
    <div v-if="loading && !finished && !error" class="loading-text">{{ loadingText }}</div>
    <div v-if="finished" class="finished-text">{{ finishedText }}</div>
    <div v-if="error" @click="handleError" class="error-text">{{ errorText }}</div>
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
    distance: {
      type: Number,
      default: 0
    }
  },
  emits: ['load', 'update:loading', 'update:error'],
  setup(props, { emit }) {
    const infiniteEl = ref(null);

    const doCheck = () => {
      nextTick(() => {
        if (props.loading || props.finished || props.error) {
          return;
        }
        if (
          infiniteEl.value.scrollHeight -
            (infiniteEl.value.scrollTop + infiniteEl.value.clientHeight) <=
          props.distance
        ) {
          emit('update:loading', true);
          emit('load');
        }
      });
    };

    watch(() => [props.loading, props.finished, props.error], doCheck);

    const handleError = () => {
      emit('update:error', false);
      doCheck();
    };

    onMounted(() => {
      window.addEventListener('scroll', doCheck);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', doCheck);
    });

    return {
      infiniteEl,
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
