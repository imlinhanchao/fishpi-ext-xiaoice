<template>
  <div class="layout">
    <div class="login" v-if="!isLogin">
      <div class="content form">
        <p>准备好冒险了吗？{{$root.info?.userNickname || ''}}</p>
        <p class="form-item" v-if="!$root.info.userNickname" style="padding-right: 30px">
          <label for="username" class="fa fa-user form-icon"></label>
          <input type="text" @keydown.enter="login" id="username" placeholder="摸鱼派用户名" class="form-input" v-model="userName"/>
        </p>
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
      userName: this.$root.info?.userName || localStorage.getItem('user', this.userName) || '',
      passwd: '',
      msg: '',
      messages: []
    }
  },
  computed: {
    info () {
      return this.$root.info;
    },
    ck() {
      return this.$root.cookies[this.$root.info.oId] ? this.$root.cookies[this.$root.info.oId].ck : null;
    },
  },
  mounted() {
    this.Init();
    if (!this.$root.info.oId) return;
    console.dir(this.$root.cookies[this.$root.info.oId])
    if (this.ck) this.isLogin = true;
    setTimeout(() => this.setUser(), 500);
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
          console.log('websocket error', e.message);
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
          this.$set(this.$root.cookies, this.$root.info.oId, {
            ck: msg.ck,
            passwd: this.passwd
          });
          localStorage.setItem('cks', JSON.stringify(this.$root.cookies));
          localStorage.setItem('lastInfo', JSON.stringify(this.$root.info));
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
    setUser() {
      if (this.$root.info.userName) {
        this.send({
          ck: this.ck,
          type: "setUser",
          uid: this.$root.info.oId,
          user: this.$root.info.userName,
        })
      }
      else if(this.userName) {
        return fetch(`http://cors.librejo.cn/?url=https://fishpi.cn/user/${this.userName}`).then(res => res.json()).then(res => {
          if (!res.code) {
            this.$root.info = res;
            return this.send({
              ck: this.ck,
              type: "setUser",
              uid: this.$root.info.oId,
              user: this.$root.info.userName,
            })
          }
        })
      }
    },
    async login() {
      this.userName && localStorage.setItem('user', this.userName);
      this.send({
        ck: null,
        type: "login",
        msg: `登录 ${this.passwd}`,
      })
    },
    async send(data) {
      await this.rws.send(JSON.stringify(data))
      if (data.type == "gameMsg") this.messages.unshift({...data, isSend: true, index: this.messages.length});
    },
    sendMessage() {
      this.send({
        ck: this.ck || null,
        type: this.msg.startsWith('登录') ? 'login' : 'gameMsg',
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

