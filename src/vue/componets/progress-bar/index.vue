<!-- https://juejin.cn/post/7225417805855916087 -->
<template>
  <div class="progress-bar">
    <div class="bg"></div>
    <div class="bar" :style="{ width: progress + '%' }"></div>
    <div class="label">{{ progress }}%</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0,
      isPlaying: false,
      isCompleted: false
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      this.isPlaying = true;
      this.animateProgress(90)
        .then(() => {
          if (!this.isCompleted) {
            this.animateProgress(100);
          }
        })
        .catch(error => {
          console.error('Progress error', error);
        });
    },
    animateProgress(target) {
      return new Promise((resolve, reject) => {
        let start = this.progress;
        const end = target;
        const duration = (target - start) * 150;

        const doAnimation = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          this.progress = start + (end - start) * progress;

          if (progress === 1) {
            resolve();
          } else if (this.isCompleted) {
            resolve();
          } else {
            requestAnimationFrame(doAnimation);
          }
        };

        const startTime = Date.now();
        requestAnimationFrame(doAnimation);
      });
    },
    finish() {
      this.isCompleted = true;
      this.progress = 100;
    }
  }
};
</script>

<style scoped>
.progress-bar {
  position: relative;
  height: 8px;
  margin: 10px 0;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ccc;
  border-radius: 5px;
}
.bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 5px;
  background-color: #409eff;
  transition: width 0.5s;
}
.label {
  position: absolute;
  top: -20px;
  left: calc(100% + 5px);
  color: #333;
  font-size: 12px;
}
</style>
