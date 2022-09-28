<template>
  <div id="app" v-if="$root.info">
    <router-view/>
  </div>
</template>

<script>
export default {
  async mounted() {
    let info = await parent.$webviewIpc.send('fishpi.info.get');
    this.$root.info = info;
  }
}
</script>

<style lang="less">
</style>
