<template>
  <div ref="observerEl" class="observer" @click="handleClick">{{ statusText[status] || '' }}</div>
</template>
<script>
import { onMounted, onUnmount, defineComponent, ref, nextTick } from 'vue';
export default defineComponent({
  props: {
    status: {
      type: String,
      validator(value) {
        return ['', 'loading', 'finished', 'error'].includes(value);
      },
      required: true,
      default: ''
    },
    statusText: {
      type: Object,
      default: () => ({
        loading: '加载中...',
        finished: '—— 到底了 ——',
        error: '加载失败'
      })
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
  emits: ['intersect', 'error'],
  setup(props, { emit }) {
    let observerObj = null;
    const observerEl = ref(null);

    const handleClick = () => {
      if (props.status === 'error') {
        emit('error');
      }
    };

    const doCheck = () => {
      nextTick(() => {
        if (['loading', 'finished', 'error'].includes(props.status)) {
          return;
        }
        if (
          observerEl.value.getBoundingClientRect().top <
          document.documentElement.clientHeight + props.distance
        ) {
          emit('intersect');
        }
      });
    };

    onMounted(() => {
      try {
        // 构建观察器
        observerObj = new IntersectionObserver(
          ([entry]) => {
            if (['loading', 'finished', 'error'].includes(props.status)) {
              return;
            }
            // 目标元素与根元素相交
            if (entry && entry.isIntersecting) {
              emit('intersect');
            }
          },
          { rootMargin: props.rootMargin }
        );

        // 观察目标元素
        observerObj.observe(observerEl.value);
      } catch (e) {
        window.addEventListener('scroll', doCheck);
      }
    });

    // 组件销毁前停止监听
    onUnmount(() => {
      if (observerObj) {
        observerObj.disconnect();
      } else {
        window.removeEventListener('scroll', doCheck);
      }
    });

    return {
      observerEl,
      handleClick
    };
  }
});
</script>
<style lang="less" scoped>
.observer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}
</style>
