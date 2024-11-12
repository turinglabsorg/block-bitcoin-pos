<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Settings from './components/Settings.vue'
import Pos from './components/Pos.vue'
import Splash from './components/Splash.vue'
import { state } from './state'

</script>
<template>
  <div>
    <h4 class="headline">
      <div @click="state.push('/')" class="logo-title">
        <img src="./assets/bitcoin.png" class="logo" />Block!
      </div>
      <button @click="state.push('/login')" class="nav-button">Start</button>
    </h4>
    <Pos v-if="state.route === 'pos'" />
    <Login v-if="state.route === 'login'" />
    <Settings v-if="state.route === 'settings'" />
    <Register v-if="state.route === 'register'" />
    <Splash v-if="state.route === ''" />
    <div class="footer">
      Made by contributors on <a href="https://github.com/turinglabsorg/block-bitcoin-pos">GitHub</a>.
    </div>
  </div>
</template>
