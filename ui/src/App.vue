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
const isMenuOpen = ref(false)

</script>
<template>
  <div>
    <h4 class="headline">
      <div @click="state.push('/')" class="logo-title">
        <img src="./assets/bitcoin.png" class="logo" />Block!POS
      </div>
      <div class="nav-buttons">
        <button v-if="!session" @click="state.push('/login')" class="start-button">Start</button>
        <button v-if="session" @click="isMenuOpen = !isMenuOpen" class="nav-button"><i
            class="lni lni-menu-hamburger-1"></i></button>
      </div>
      <div class="menu" :class="{ open: isMenuOpen }">
        <img src="./assets/bitcoin.png" class="logo-menu" />
        <button v-if="session" @click="isMenuOpen = !isMenuOpen" class="close-button"><i
          class="lni lni-menu-hamburger-1"></i></button>
        <div class="menu-buttons">
          <button @click="state.push('/'); isMenuOpen = false" class="nav-button"><i
              class="lni lni-calculator-2"></i> POS</button>
          <button @click="state.push('/settings'); isMenuOpen = false" class="nav-button"><i
              class="lni lni-gear-1"></i> Settings</button>
          <button @click="state.logout(); isMenuOpen = false" class="nav-button"><i
              class="lni lni-exit"></i> Exit</button>
        </div>
      </div>
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
