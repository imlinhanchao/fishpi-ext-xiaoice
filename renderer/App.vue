<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  async mounted() {
    let info = await parent.$webviewIpc.send('fishpi.info.get');
    this.$root.info = info;
    if (!this.$root.cookies[info.oId]) this.$router.replace('login');
  }
}
</script>

<style lang="less">
</style>
