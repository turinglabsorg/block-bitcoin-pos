<script setup lang="ts">
import { state } from '../state'
import { ref } from 'vue'

const session = state.session
if (!session) {
  state.push('/login')
}
const user = await state.getUser()
if (!user?.xpub) {
  state.push('/init')
}
const isLoading = ref(false)
const errored = ref(false)
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL
const amount = ref('0')
const identifier = ref('')

const addDigit = (digit: string) => {
  if (amount.value === '0') {
    amount.value = digit
  } else {
    amount.value = amount.value.toString() + digit.toString()
  }
}

const removeDigit = () => {
  amount.value = amount.value.slice(0, -1)
}

const init = async () => {
  isLoading.value = true
}
</script>

<template>
  <div>
    <div class="amount">{{ amount }}</div>
    <button @click="addDigit('1')" class="pin-button">1</button>
    <button @click="addDigit('2')" class="pin-button">2</button>
    <button @click="addDigit('3')" class="pin-button">3</button>
    <button @click="addDigit('4')" class="pin-button">4</button>
    <button @click="addDigit('5')" class="pin-button">5</button>
    <button @click="addDigit('6')" class="pin-button">6</button>
    <button @click="addDigit('7')" class="pin-button">7</button>
    <button @click="addDigit('8')" class="pin-button">8</button>
    <button @click="addDigit('9')" class="pin-button">9</button>
    <button @click="addDigit('0')" class="pin-button">0</button>
    <button @click="addDigit('.')" class="pin-button">.</button>
    <button @click="removeDigit()" class="pin-button">DEL</button>
    <button @click="init" :disabled="isLoading" class="init-button">Init payment</button>
  </div>
</template>
