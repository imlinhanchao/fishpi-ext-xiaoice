<template>
  <div id="app">
    <router-view v-if="this.$root.info"/>
  </div>
</template>

<script>
export default {
  async mounted() {
    // eslint-disable-next-line no-undef
    let info = await $ipc?.invoke('fishpi.info.get');
    this.$root.info = info || {};
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
