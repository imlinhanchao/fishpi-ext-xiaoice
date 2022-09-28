<template>
  <div class="layout">
    <div class="login" v-if="!isLogin">
      <div class="content form">
        <p>准备好冒险了吗？{{$root.info.userNickname}}</p>
        <p class="form-item">
          <label for="password" class="fa fa-lock form-icon"></label>
          <input type="password" @keydown.enter="login" id="password" placeholder="小冰游戏密码" class="form-input" v-model="passwd"/>
          <button class="form-button form-submit-append" @click.stop="login"><i class="fa fa-send"></i></button>
        </p>
      </div>
    </div>
    <div class="message" v-if="isLogin">
      <div class="content form">
        <p class="form-item sender">
          <input @keydown.enter="sendMessage" type="text" id="message" placeholder="开始游戏" class="form-input" v-model="msg"/>
          <button class="form-button form-submit-append" @click.stop="sendMessage"><i class="fa fa-send"></i></button>
        </p>
        <div class="msg-list">
          <div class="msg-item" :class="{'msg-current': m.isSend}" v-for="(m, i) in messages" v-bind:key="i">
            <div class="msg-item-content" v-html="m.msg"></div>
          </div>
        </div>
      </div>
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
      passwd: '',
      msg: '',
      messages: []
    }
  },
  computed: {
    ck() {
      return this.$root.cookies[this.$root.info.oId] ? this.$root.cookies[this.$root.info.oId].ck : null;
    }
  },
  mounted() {
    this.Init()
    console.dir(this.$root.cookies[this.$root.info.oId])
    if (this.ck) this.isLogin = true;
    this.send({
      ck: this.ck,
      type: "setUser",
      uid: this.$root.info.oId,
      user: this.$root.info.userName,
    })
  },
  methods: {
    Init() {
      let that = this;
      this.rws = new ReconnectingWebSocket(`wss://game.yuis.cc/wss`);
      this.rws.onopen = () => {
          setInterval(() => {
              that.rws.send('{"type":"hb"}') // 心跳包
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
          this.messages = [];
          this.messages.push(msg);
          this.isLogin = true;
          break;
        case 'gameMsg':
          if (msg.msg.indexOf('你还未登录') >= 0) this.isLogin = false;
          this.messages.unshift({...msg, index: this.messages.length});
          break;
      }
    },
    login() {
      this.send({
        ck: null,
        type: "login",
        msg: `登录 ${this.passwd}`,
      })
    },
    send(data) {
      this.rws.send(JSON.stringify(data))
      if (data.type == "gameMsg") this.messages.unshift({...data, isSend: true, index: this.messages.length});
    },
    sendMessage() {
      this.send({
        ck: this.ck,
        type: 'gameMsg',
        msg: this.msg
      })
      this.msg = '';
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sender {
  position: absolute;
  top: .5em;
}
.msg-list {
  margin: 0 2em;
  margin-top: 4em;
  display: flex;
  flex-direction: column;
  .msg-item-content {
    display: inline-block;
    border-radius: 5px;
    margin: .5em;
    padding: .5em;
    background: var(--main-chatroom-message-background-color);
    color: var(--main-chatroom-message-color);
    position: relative;
    &::before {
      font: normal normal normal 1.5em FontAwesome;
      content: "\f0d9";
      color: var(--main-chatroom-message-background-color);
      position: absolute;
      left: -.3em;
      top: .5em;
    }
  }
  .msg-current{
    text-align: right;
    .msg-item-content {
      background: var(--main-chatroom-plusone-background-color);
      color: var(--main-chatroom-user-message-color);
      &::before {
        right: -.3em;
        left: auto;
        content: "\f0da";
        color: var(--main-chatroom-plusone-background-color);
      }
    }
  }
}
</style>

