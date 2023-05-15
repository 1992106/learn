<template>
  <div class="infinite-list-wrapper" ref="infiniteEl">
    <slot></slot>
    <div v-if="loading && !finished && !error">{{ loadingText }}</div>
    <div v-if="finished">{{ finishedText }}</div>
    <div v-if="error" @click="handleError">{{ errorText }}</div>
  </div>
</template>
<script>
import { onMounted, onUnmount, defineComponent, watch, ref, nextTick } from 'vue';
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
      default: 400
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
          infiniteEl.value.scrollTop + infiniteEl.value.clientHeight >=
          document.documentElement.scrollHeight - props.distance
        ) {
          emit('update:loading', true);
          emit('load');
        }
      });
    };

    watch(() => [props.loading, props.finished, props.error], doCheck);

    const handleError = () => {
      emit('update:error', false);
      doCheck()
    }

    onMounted(() => {
      window.addEventListener('scroll', doCheck);
    });

    onUnmount(() => {
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
}
</style>
