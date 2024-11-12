<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { state } from '../state'

const isLoading = ref(false)
const errored = ref(false)
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL

const email = ref('')
const password = ref('')

const login = async () => {
  isLoading.value = true
  const res = await axios.post(`${apiUrl}/users/login`, {
    email: email.value,
    password: password.value,
  })
  if (res.data.error) {
    errored.value = true
    message.value = res.data.message
  } else {
    state.login(res.data.session)
  }
}
</script>

<template>
  <h3>Enter your credentials to enter.</h3>
  <input type="email" class="input" v-model="email" placeholder="Email" />
  <input type="password" class="input" v-model="password" placeholder="Password" />
  <button class="form-button" @click="login">Enter</button>
  <br /><br />
  <div class="link" @click="state.push('/register')">Don't have an account? Register here.</div>
</template>
