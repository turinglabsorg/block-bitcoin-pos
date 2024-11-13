<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { state } from '../state'

const isLoading = ref(false)
const errored = ref(false)
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL

const activate = async () => {
  isLoading.value = true
  errored.value = false
  message.value = ''
  const res = await axios.post(`${apiUrl}/users/login`, {
    token: state.getRouteParams('token'),
    email: state.getRouteParams('email')
  })
  isLoading.value = false
  if (res.data.error) {
    message.value = res.data.message
    setTimeout(() => {
      state.push('/enter')
    }, 3500)
  } else {
    state.login(res.data.session)
  }
}
activate()
</script>

<template>
  <div class="activate-container">
    <div class="step-text">
      <h2 v-if="!message">You're a legend, let me set you up.</h2>
      <h2 v-if="message">{{ message }}</h2>
    </div>
  </div>
</template>
