<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { state } from '../state'

const xpub = ref('')
const currency = ref('usd')
const slippage = ref(0.5)
const allowUnconfirmed = ref(true)
const username = ref('')
const description = ref('')

state.getUser().then((user) => {
  if (!user?.xpub) {
    state.push('/init')
  }
  currency.value = user?.currency
  slippage.value = user?.slippage
  allowUnconfirmed.value = !user?.onlyConfirmed
  xpub.value = user?.xpub
  username.value = user?.username
  description.value = user?.metadata?.description
})

const isLoading = ref(false)
const errored = ref(false)
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL

const setup = async () => {
  if (!xpub.value) {
    errored.value = true
    message.value = 'Xpub or Zpub is required.'
    return
  }
  isLoading.value = true
  errored.value = false
  message.value = ''
  const res = await axios.put(`${apiUrl}/users`, {
    xpub: xpub.value,
    currency: currency.value,
    onlyConfirmed: !allowUnconfirmed.value,
    slippage: slippage.value,
    username: username.value,
    metadata: {
      description: description.value
    }
  },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.session}`
      },
    }
  )
  isLoading.value = false
  if (res.data.error) {
    errored.value = true
    message.value = res.data.message
  } else {
    message.value = 'Account setup, redirecting...'
    setTimeout(() => {
      state.push('/')
    }, 3500)
  }
}
</script>

<template>
  <div class="settings">
    <h3>Point of Sale settings</h3>
    <div class="label">Xpub or Zpub </div>
    <textarea v-model="xpub" class="input" placeholder="Paste your xpub or zpub here" />
    <div class="label">Currency</div>
    <select class="input" v-model="currency">
      <option value="usd">USD</option>
      <option value="eur">EUR</option>
      <option value="gbp">GBP</option>
    </select>
    <div class="label">Slippage</div>
    <input type="number" class="input" v-model="slippage" placeholder="Slippage" />
    <div class="checkbox">
      <input type="checkbox" v-model="allowUnconfirmed" />
      <label>Allow unconfirmed transactions</label>
    </div>
    <hr />
    <h3>Public page informations</h3>
    <div class="label">Username</div>
    <input type="text" v-model="username" class="input" placeholder="Public username" />
    <div class="label">Description</div>
    <textarea v-model="description" class="input" placeholder="Public description" />
    <button :disabled="isLoading" @click="setup" class="form-button">Save</button>
    <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
  </div>
</template>
