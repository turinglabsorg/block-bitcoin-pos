<script setup lang="ts">
import { ref } from 'vue'
import Enter from './components/Enter.vue'
import Settings from './components/Settings.vue'
import Pos from './components/Pos.vue'
import Request from './components/Request.vue'
import Public from './components/Public.vue'
import Splash from './components/Splash.vue'
import Activate from './components/Activate.vue'
import Transactions from './components/Transactions.vue'
import Init from './components/Init.vue'
import { state } from './state'

const session = ref(state.session)
const isMenuOpen = ref(false)
const userUsername = ref('')
state.getUser().then((user) => {
  userUsername.value = user?.username
})

</script>
<template>
  <div>
    <div class="headline">
      <div @click="state.push('/')" class="logo-title">
        <img src="./assets/bitcoin.png" class="logo" />Block!POS
      </div>
      <div class="nav-buttons">
        <button v-if="!session" @click="state.push('/enter')" class="start-button">Enter</button>
        <button v-if="session" @click="isMenuOpen = !isMenuOpen" class="nav-button"><i
            class="lni lni-menu-hamburger-1"></i></button>
      </div>
    </div>
    <div class="menu" :class="{ open: isMenuOpen }">
      <img src="./assets/bitcoin.png" class="logo-menu" />
      <button v-if="session" @click="isMenuOpen = !isMenuOpen" class="close-button"><i
          class="lni lni-menu-hamburger-1"></i></button>
      <div class="menu-buttons">
        <button v-if="userUsername" @click="state.push('/' + userUsername); isMenuOpen = false" class="nav-button"><i
            class="lni lni-megaphone-1"></i>
          Your page</button>
        <button @click="state.push('/'); isMenuOpen = false" class="nav-button"><i class="lni lni-calculator-2"></i>
          POS</button>
        <button @click="state.push('/transactions'); isMenuOpen = false" class="nav-button"><i
            class="lni lni-search-text"></i>
          Transactions</button>
        <button @click="state.push('/settings'); isMenuOpen = false" class="nav-button"><i class="lni lni-gear-1"></i>
          Settings</button>
        <button @click="state.logout(); isMenuOpen = false" class="nav-button"><i class="lni lni-exit"></i>
          Exit</button>
      </div>
    </div>
    <div class="footer">
      Open-source project on <a href="https://github.com/turinglabsorg/block-bitcoin-pos" target="_blank">GitHub</a>.
    </div>
    <Settings v-if="state.route === 'settings'" />
    <Enter v-if="state.route === 'enter'" />
    <Request v-if="state.route === 'request'" />
    <Activate v-if="state.route === 'activate'" />
    <Transactions v-if="state.route === 'transactions'" />
    <Splash v-if="state.route === '' && !session" />
    <Pos v-if="state.route === '' && session" />
    <Init v-if="state.route === 'init'" />
    <Public v-if="state.route !== 'enter' &&
      state.route !== 'activate' &&
      state.route !== 'settings' &&
      state.route !== 'request' &&
      state.route !== 'init' &&
      state.route !== 'transactions' &&
      state.route !== ''" />
  </div>
</template>
