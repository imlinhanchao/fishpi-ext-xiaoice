<template>
  <div class="login">
    <form class="content form">
      <p class="form-item">
        <label for="password" class="fa fa-lock form-icon"></label>
        <input type="password" id="password" placeholder="密码" class="form-input"/>
        <button class="form-button form-submit-append"><i class="fa fa-send"></i></button>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  components: {
    
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;;
}
</style>
