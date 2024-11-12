<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { state } from '../state'
import { validatePassword } from '../utils'

const password = ref('')
const passwordConfirm = ref('')

const isLoading = ref(false)
const errored = ref(false)
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL

const activate = async () => {
  if (password.value !== passwordConfirm.value) {
    errored.value = true
    message.value = 'Passwords do not match.'
    return
  }
  if (!validatePassword(password.value)) {
    errored.value = true
    message.value = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    return
  }
  isLoading.value = true
  errored.value = false
  message.value = ''
  const res = await axios.post(`${apiUrl}/users/recover-password`, {
    token: state.getRouteParams('token'),
    email: state.getRouteParams('email'),
    password: password.value,
  })
  if (res.data.error) {
    errored.value = true
    message.value = res.data.message
  } else {
    message.value = 'Account activated, redirecting to login...'
    setTimeout(() => {
      state.push('/login')
    }, 3500)
  }
}
</script>

<template>
  <h3>Please choose a strong password.</h3>
  <input type="password" class="input" v-model="password" placeholder="Password" />
  <input type="password" class="input" v-model="passwordConfirm" placeholder="Confirm password" />
  <button :disabled="isLoading" @click="activate" class="form-button">Activate account</button>
  <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
  <br /><br />
  <div class="link" @click="state.push('/login')">Already have an account? Login here.</div>
</template>
