<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import QRCode from 'qrcode'

const errored = ref(false)
const completed = ref(false)
const checkInterval: any = ref()
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL
const request: any = ref({})
const payment: any = ref({})
const fullfillmentPercentage = ref(0)
const qr = ref('')

const fetchPayment = async () => {
  const url = new URL(window.location.href)
  const uuid = url.pathname.split('/').pop()
  const res = await axios.get(`${apiUrl}/requests/${uuid}`)
  if (res.data.error) {
    errored.value = true
    message.value = res.data.message
  } else {
    request.value = res.data.request
    qr.value = await QRCode.toDataURL(res.data.request.address, { width: 600, margin: 2 })
    checkPayment()
    checkInterval.value = setInterval(checkPayment, 5000)
  }
}
fetchPayment()

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
  <div v-if="!request.uuid">
    <div class="step-text">
      Loading request...
    </div>
  </div>
  <div v-if="request.uuid && !completed">
    <h3>Send {{ request?.amountCrypto }} BTC to:</h3>
    <img width="300" :src="qr" />
    <div class="address" @click="copyToClipboard(request.address)">{{ request.address }}</div>
    BTC price: {{ request.price }} {{ request.currency.toUpperCase() }}<br>
    <hr>
    <div v-if="payment.uuid" style="margin-top: 20px;">
      Waiting for payment confirmation...
      <div class="fulfillment">{{ fullfillmentPercentage }}% received</div>
    </div>
  </div>
  <div v-if="request.uuid && completed">
    <div class="confirmation-text">
      <div style="font-size: 120px;">🤘</div>
      <br>Payment completed!<br>
    </div>
  </div>
</template>
