<script setup lang="ts">
import { ref } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Settings from './components/Settings.vue'
import Pos from './components/Pos.vue'
import Request from './components/Request.vue'
import Public from './components/Public.vue'
import Splash from './components/Splash.vue'
import Activate from './components/Activate.vue'
import Init from './components/Init.vue'
import { state } from './state'

const session = ref(state.session)

</script>
<template>
  <div>
    <h4 class="headline">
      <div @click="state.push('/')" class="logo-title">
        <img src="./assets/bitcoin.png" class="logo" />Block!
      </div>
      <button v-if="!session" @click="state.push('/login')" class="nav-button">Start</button>
      <button v-if="session" @click="state.logout()" class="nav-button">Exit</button>
    </h4>
    <Login v-if="state.route === 'login'" />
    <Settings v-if="state.route === 'settings'" />
    <Register v-if="state.route === 'register'" />
    <Public v-if="state.route === 'public'" />
    <Request v-if="state.route === 'request'" />
    <Activate v-if="state.route === 'activate'" />
    <Splash v-if="state.route === '' && !session" />
    <Pos v-if="state.route === '' && session" />
    <Init v-if="state.route === 'init'" />
    <div class="footer">
      Open-source project on <a href="https://github.com/turinglabsorg/block-bitcoin-pos">GitHub</a>.
    </div>
  </div>
</template>
