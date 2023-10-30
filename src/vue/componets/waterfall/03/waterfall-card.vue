<template>
  <div class="waterfall-card">
    <img class="waterfall-img" :src="item.src" />
    <p>{{ item.title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
  .waterfall-card {
    background: #fff;
  }
</style>
