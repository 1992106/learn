<template>
  <div ref="target" class="observer">{{ statusText[status] || '' }}</div>
</template>
<script>
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
export default defineComponent({
  props: {
    status: {
      type: String,
      validator(value) {
        return ['', 'success', 'error', 'loading', 'end'].includes(value);
      },
      required: true,
      default: ''
    },
    statusText: {
      type: Object,
      default: () => ({
        error: '加载失败',
        loading: '加载中...',
        end: '—— 到底了 ——'
      })
    },
    rootMargin: {
      type: String,
      default: '0px 0px 20px 0px'
    },
    reachBottomDistance: {
      type: Number,
      default: 20
    }
  },
  emits: ['intersect'],
  setup(props, { emit }) {
    let observerObj = null;
    const target = ref(null);

    const scrollFn = () => {
      if (
        target.value.getBoundingClientRect().top <
          document.documentElement.clientHeight + props.reachBottomDistance &&
        props.status !== 'end'
      ) {
        emit('intersect');
      }
    };

    onMounted(() => {
      try {
        // 构建观察器
        observerObj = new IntersectionObserver(
          ([entry]) => {
            // 目标元素与根元素相交
            if (entry && entry.isIntersecting && props.status !== 'end') {
              emit('intersect');
            }
          },
          { rootMargin: props.rootMargin }
        );

        // 观察目标元素
        observerObj.observe(target.value);
      } catch (e) {
        window.addEventListener('scroll', scrollFn);
      }
    });

    // 组件销毁前停止监听
    onBeforeUnmount(() => {
      if (observerObj) {
        observer.disconnect();
      } else {
        window.removeEventListener('scroll', scrollFn);
      }
    });

    return {
      target
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
