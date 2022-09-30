<template>
  <div id="app" v-if="$root.info">
    <router-view/>
  </div>
</template>

<script>
export default {
  async mounted() {
    // eslint-disable-next-line no-undef
    let info = await $ipc.invoke('fishpi.info.get');
    this.$root.info = info;
  }
}
</script>

<style lang="less">
</style>
