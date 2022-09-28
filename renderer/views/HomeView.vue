<template>
  <div class="layout">
    <div class="login" v-if="!isLogin">
      <form class="content form">
        <p>准备好冒险了吗？{{$root.info.userNickname}}</p>
        <p class="form-item">
          <label for="password" class="fa fa-lock form-icon"></label>
          <input type="password" id="password" placeholder="小冰游戏密码" class="form-input" v-model="passwd"/>
          <button class="form-button form-submit-append" @click="login"><i class="fa fa-send"></i></button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import ReconnectingWebSocket from "reconnecting-websocket";
export default {
  name: 'HomeView',
  components: {
    
  },
  data() {
    return {
      isLogin: false,
      rws: null,
      passwd: ''
    }
  },
  mounted() {
    this.Init()
    console.dir(this.$root.cookies[this.$root.info.oId])
    this.rws.send(JSON.stringify({
      ck: this.$root.cookies[this.$root.info.oId] ? this.$root.cookies[this.$root.info.oId].ck : null,
      type: "setUser",
      uid: this.$root.info.oId,
      user: this.$root.info.userName,
    }))
  },
  methods: {
    Init() {
      let that = this;
      this.rws = new ReconnectingWebSocket(`wss://game.yuis.cc/wss`);
      this.rws.onopen = () => {
          setInterval(() => {
              that.rws.send('hb') // 心跳包
          }, 3 * 60 * 1000)
      }
      this.rws.onmessage = (e) => {
          that.pushMessage(e)
      }
      this.rws.onerror = (e) => {
          console.log('rws error', e.message);
      }
      this.rws.onclose = (e) => {
        console.dir(e)
      }
    },
    pushMessage(e) {
      console.dir(e);
      let msg = JSON.parse(e.data);
      switch(msg.type) {
        case 'setCK':       
        this.$root.cookies[this.$root.info.oId] = {
          ck: msg.ck,
          passwd: this.passwd
        }
        localStorage.setItem('cks', JSON.stringify(this.$root.cookies));
        break;
      }
    },
    login() {
      this.rws.send(JSON.stringify({
        ck: null,
        type: "login",
        msg: `登录 ${this.passwd}`,
      }))
    }
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

