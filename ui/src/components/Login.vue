<script setup lang="ts">
import { ref } from 'vue'
import { state } from '../state'

const email = ref('')
const password = ref('')

</script>

<template>
  <h3>Enter your credentials to enter.</h3>
  <input type="email" class="input" v-model="email" placeholder="Email" />
  <input type="password" class="input" v-model="password" placeholder="Password" />
  <button class="form-button">Enter</button>
  <br /><br />
  <div class="link" @click="state.push('/register')">Don't have an account? Register here.</div>
</template>
