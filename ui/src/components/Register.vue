<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { state } from '../state'

const email = ref('')
const isLoading = ref(false)
const errored = ref(false)
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL

const register = async () => {
  if (!email.value) return
  if (isLoading.value) return
  isLoading.value = true
  errored.value = false
  message.value = ''
  const res = await axios.post(`${apiUrl}/users`, { email: email.value })
  isLoading.value = false
  message.value = res.data.message
  if (res.data.error) {
    errored.value = true
  }
}
</script>

<template>
  <div v-if="message !== 'User created.'">
    <h3>Let's get you <u>orangepilled</u>.</h3>
    <input type="email" class="input" v-model="email" placeholder="Email" />
    <button :disabled="isLoading" @click="register" class="form-button">Enter</button>
    <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
    <br /><br />
    <div class="link" @click="state.push('/login')">Already have an account? Login here.</div>
  </div>
  <div v-if="message === 'User created.'" class="step-text">
    <h2>Please check your email (also your spam folder) to complete your transition to the future.</h2>
  </div>
</template>
