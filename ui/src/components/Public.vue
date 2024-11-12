<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import QRCode from 'qrcode'

const isLoading = ref(false)
const errored = ref(false)
const userNotFound = ref(false)
const completed = ref(false)
const checkInterval: any = ref()
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL
const amount = ref('')
const identifier = ref('')
const request: any = ref({})
const payment: any = ref({})
const user: any = ref({})
const fullfillmentPercentage = ref(0)
const qr = ref('')

const checkUser = async () => {
  try {
    const username = window.location.pathname.replace("/", "")
    const res = await axios.get(`${apiUrl}/users/${username}`)
    if (res.data.error) {
      userNotFound.value = true
      message.value = res.data.message
    } else {
      user.value = res.data.user
    }
  } catch (e) {
    console.log("ERROR_CHECK_USER", e)
    userNotFound.value = true
    message.value = 'User not found!'
  }
}
checkUser()

const requestPayment = async () => {
  if (amount.value === '0') {
    return
  }
  isLoading.value = true
  try {
    const res = await axios.post(`${apiUrl}/requests`, {
      amount: amount.value.replace(',', '.'),
      identifier: identifier.value,
      network: 'mainnet',
      chain: 'bitcoin',
      username: user.value.username,
    })
    isLoading.value = false
    if (res.data.error) {
      errored.value = true
      message.value = res.data.message
    } else {
      request.value = res.data.request
      qr.value = await QRCode.toDataURL(res.data.request.address, { width: 600, margin: 2 })
      checkInterval.value = setInterval(checkPayment, 5000)
    }
  } catch (e) {
    isLoading.value = false
    errored.value = true
    message.value = 'Error requesting payment, retry..'
  }
}

const resetPayment = () => {
  completed.value = false
  request.value = {}
  payment.value = {}
  fullfillmentPercentage.value = 0
  clearInterval(checkInterval.value)
  amount.value = '0'
  identifier.value = ''
}

const checkPayment = async () => {
  try {
    const res = await axios.get(`${apiUrl}/requests/${request.value.uuid}`)
    if (res.data.error) {
      errored.value = true
      message.value = res.data.message
    } else {
      payment.value = res.data.request
      fullfillmentPercentage.value = res.data.fullfillmentPercentage ?? 0
      if (res.data.request.status === "completed") {
        completed.value = true
        clearInterval(checkInterval.value)
      }
    }
  } catch (e) {
    console.log("ERROR_CHECK_PAYMENT", e)
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div v-if="userNotFound">
    <div class="step-text">{{ message }}</div>
  </div>
  <div v-if="!userNotFound && !user.username">
    <div class="step-text">Loading...</div>
  </div>
  <div class="public-container" v-if="!userNotFound && user.username">
    <div v-if="!request.uuid">
      <div class="public-description">
        <h2>{{ user.username }}</h2>
        <p v-if="user.metadata?.description">{{ user.metadata?.description }}</p>
      </div>
      <div class="label">Amount ({{ user?.currency?.toUpperCase() }})</div>
      <input type="text" class="input" v-model="amount" placeholder="Amount" />
      <div class="label">Message (optional)</div>
      <input type="text" class="input" v-model="identifier" placeholder="Add a message to the payment" />
      <button @click="requestPayment" :disabled="isLoading" class="init-button full">Init payment</button>
      <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
    </div>
    <div v-if="request.uuid && !completed">
      <h3>Send {{ request?.amountCrypto }} BTC ({{ request?.amountFiat }} {{ request.currency.toUpperCase() }}) to:</h3>
      <img width="300" :src="qr" />
      <div class="address" @click="copyToClipboard(request.address)">{{ request.address }}</div>
      BTC price: {{ request.price }} {{ request?.currency?.toUpperCase() }}<br>
      <a :href="`/request/${request.uuid}`" target="_blank">
        <button class="init-button" style="margin-top: 20px;">Share payment</button>
      </a>
      <div class="restart-button" @click="resetPayment">Restart</div>
      <div v-if="payment.uuid" style="margin-top: 20px;">
        Waiting for payment confirmation...
        <div class="fulfillment" v-if="fullfillmentPercentage">{{ fullfillmentPercentage.toFixed(2) }}% received</div>
      </div>
    </div>
    <div v-if="request.uuid && completed">
      <div class="confirmation-text">
        <div style="font-size: 120px;">🤘</div>
        <br>Payment completed!<br>
        <button style="margin-top: 20px;" class="form-button" @click="resetPayment">New payment</button>
      </div>
    </div>
  </div>

</template>
