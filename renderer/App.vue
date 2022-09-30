<template>
  <div id="app">
    <router-view v-if="$root.info"/>
    <div v-if="!$root.info && loaded">载入用户信息失败，请尝试切换页面重新载入。</div>
  </div>
</template>

<script>
export default {
  async mounted() {
    // eslint-disable-next-line no-undef
    let info = await $ipc.invoke('fishpi.info.get');
    this.$root.info = info;
    this.loaded = true;
  },
  data() {
    return {
      loaded: false
    }
  }
}
</script>

<style lang="less">
</style>
