<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import * as bip39 from 'bip39'
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import { state } from '../state'

const xpub = ref('')
const currency = ref('usd')
const slippage = ref(0.5)
const allowUnconfirmed = ref(true)
const userChoice = ref('')
const seed = ref('')
const seedConfirm = ref('')
const showMnemonicConfirmation = ref(false)
const seedConfirmed = ref(false)
const theresInternet = ref(true)

const isLoading = ref(false)
const errored = ref(false)
const message = ref('')
const apiUrl = import.meta.env.VITE_API_URL

const checkInternet = async () => {
  try {
    await axios.get(`${apiUrl}`)
    theresInternet.value = true
  } catch (e) {
    if (!seed.value) {
      generateMnemonic()
    }
    theresInternet.value = false
  }
}
setInterval(checkInternet, 1000)

const generateMnemonic = async () => {
  if (theresInternet.value) {
    return
  }
  const mnemonic = bip39.generateMnemonic()
  seed.value = mnemonic
}

const confirmSeed = async () => {
  if (seedConfirm.value === seed.value) {
    const bip32 = BIP32Factory(ecc);
    const recreatedSeed = bip39.mnemonicToSeedSync(seedConfirm.value);
    const node = bip32.fromSeed(recreatedSeed);
    xpub.value = node.neutered().toBase58();
    seed.value = ''
    seedConfirm.value = ''
    seedConfirmed.value = true
  } else {
    errored.value = true
    message.value = 'Mnemonic does not match.'
  }
}

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
    slippage: slippage.value
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
  <div v-if="userChoice === ''">
    <button class="form-choice" @click="userChoice = 'generator'">Generate a new wallet</button>
    <button class="form-choice" @click="userChoice = 'proceed'">Proceed with existing wallet</button>
  </div>
  <div v-if="userChoice === 'generator'">
    <div class="step-text" v-if="theresInternet && !seedConfirmed">
      <h2>Please put your internet connection off to proceed, we want to make sure you're not being watched.</h2>
    </div>
    <div class="step-text" v-if="!theresInternet && seedConfirmed">
      <h2>Please put your internet connection on to proceed.</h2>
    </div>
    <div v-if="!theresInternet && !showMnemonicConfirmation">
      <h3>Now, please write down your mnemonic to a safe place.</h3>
      <h2>{{ seed }}</h2>
      <!-- <button class="form-button" @click="generateMnemonic">Generate new mnemonic</button> -->
      <button class="form-button" v-if="seed" @click="showMnemonicConfirmation = true">Continue</button>
    </div>
    <div v-if="showMnemonicConfirmation && !seedConfirmed">
      <h3>Please confirm your mnemonic.</h3>
      <textarea v-model="seedConfirm" class="input" placeholder="Paste your mnemonic here" />
      <button class="form-button" @click="showMnemonicConfirmation = false">Go back</button>
      <button class="form-button" @click="confirmSeed">Continue</button>
      <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
    </div>
    <div v-if="seedConfirmed && theresInternet">
      <h3>Your wallet is ready, please proceed to the next step.</h3>
      <button class="form-button" @click="userChoice = 'proceed'">Continue</button>
    </div>
  </div>
  <div v-if="userChoice === 'proceed'">
    <h3>Complete your account setup.</h3>
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
    <button :disabled="isLoading" @click="setup" class="form-button">Setup account</button>
  </div>
  <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
</template>
