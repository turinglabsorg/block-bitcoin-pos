<script setup lang="ts">
import { state } from '../state'
import { ref } from 'vue'
import axios from 'axios'
import QRCode from 'qrcode'

const session = state.session
if (!session) {
  state.push('/login')
}
const isLoading = ref(false)
const errored = ref(false)
const completed = ref(false)
const checkInterval: any = ref()
const message = ref('')
const currency = ref('')
const apiUrl = import.meta.env.VITE_API_URL
const amount = ref('0')
const identifier = ref('')
const request: any = ref({})
const payment: any = ref({})
const fullfillmentPercentage = ref(0)
const qr = ref('')

state.getUser().then((user) => {
  if (!user?.xpub) {
    state.push('/init')
  }
  currency.value = user?.currency
})
const addDigit = (digit: string) => {
  if (amount.value === '0') {
    amount.value = digit
  } else {
    amount.value = amount.value.toString() + digit.toString()
  }
}

const removeDigit = () => {
  if (amount.value.length === 1) {
    amount.value = '0'
  } else {
    amount.value = amount.value.slice(0, -1)
  }
}

const requestPayment = async () => {
  if (amount.value === '0') {
    return
  }
  isLoading.value = true
  try {
    const res = await axios.post(`${apiUrl}/requests`, {
      amount: amount.value,
      identifier: identifier.value,
      network: 'mainnet',
      chain: 'bitcoin',
    }, {
      headers: {
        'Authorization': `Bearer ${session}`
      }
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
      fullfillmentPercentage.value = res.data.fullfillmentPercentage
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
  <div class="pos-container">
    <div v-if="!request.uuid">
      <div class="amount">{{ amount }} <div class="currency">{{ currency }}</div>
      </div>
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
      <input type="text" class="input" v-model="identifier"
        placeholder="Add an identifier for the payment (eg. order id)" />
      <button @click="requestPayment" :disabled="isLoading" class="init-button">Init payment</button>
      <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
    </div>
    <div v-if="request.uuid && !completed">
      <h3>Send {{ request?.amountCrypto }} BTC ({{ request?.amountFiat }} {{ currency.toUpperCase() }}) to:</h3>
      <img width="300" :src="qr" />
      <div class="address" @click="copyToClipboard(request.address)">{{ request.address }}</div>
      BTC price: {{ request.price }} {{ currency.toUpperCase() }}<br>
      <a :href="`/request/${request.uuid}`" target="_blank">
        <button class="init-button" style="margin-top: 20px;">Share payment</button>
      </a>
      <div class="restart-button" @click="resetPayment">Restart</div>
      <div v-if="payment.uuid" style="margin-top: 20px;">
        Waiting for payment confirmation...
        <div class="fulfillment">{{ fullfillmentPercentage }}% received</div>
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
