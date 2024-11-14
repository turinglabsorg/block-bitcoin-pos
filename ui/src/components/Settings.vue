<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { state } from '../state'
import { startRegistration } from '@simplewebauthn/browser';


const xpub = ref('')
const currency = ref('usd')
const slippage = ref(0.5)
const allowUnconfirmed = ref(true)
const username = ref('')
const email = ref('')
const description = ref('')
const passkeys: any[] = reactive([])

state.getUser().then((user) => {
  if (!user?.xpub) {
    state.push('/init')
  }
  currency.value = user?.currency
  slippage.value = user?.slippage
  email.value = user?.email
  allowUnconfirmed.value = !user?.onlyConfirmed
  xpub.value = user?.xpub
  username.value = user?.username
  description.value = user?.metadata?.description
  for (const passkey of user?.passkeys) {
    passkeys.push(passkey)
  }
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
    message.value = 'Account saved.'
  }
}

const addPasskey = async () => {
  const addRes = await axios.post(`${apiUrl}/users/passkeys/add`, {
    email
  }, {
    headers: {
      'Authorization': `Bearer ${state.session}`
    },
  })
  let attResp;
  try {
    // Pass the options to the authenticator and wait for a response
    attResp = await startRegistration({ optionsJSON: addRes.data.options });
  } catch (error: any) {
    // Some basic error handling
    if (error.name === 'InvalidStateError') {
      message.value = 'Error: Authenticator was probably already registered by user';
    } else {
      message.value = error;
    }
    throw error;
  }
  const verifyRes = await axios.post(`${apiUrl}/users/passkeys/verify`, attResp, {
    headers: {
      'Authorization': `Bearer ${state.session}`
    },
  })
  if (verifyRes.data.error) {
    message.value = verifyRes.data.message
    errored.value = true
    setTimeout(() => {
      errored.value = false
    }, 1000)
  } else {
    for (const passkey of verifyRes.data.passkeys) {
      passkeys.push(passkey)
    }
    message.value = 'Passkey added.'
    setTimeout(() => {
      message.value = ''
    }, 1000)
  }
}

const activeTab = ref('pos') // possible values: 'pos', 'public', 'passkeys'
</script>

<template>
  <div class="settings-container">
    <div class="settings-tabs">
      <button @click="activeTab = 'pos'" class="tab-button first-tab" :class="{ active: activeTab === 'pos' }">
        POS
      </button>
      <button @click="activeTab = 'public'" class="tab-button" :class="{ active: activeTab === 'public' }">
        Public Info
      </button>
      <button @click="activeTab = 'passkeys'" class="tab-button last-tab" :class="{ active: activeTab === 'passkeys' }">
        Passkeys
      </button>
    </div>

    <!-- POS Settings Tab -->
    <div v-if="activeTab === 'pos'" class="tab-content">
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
    </div>

    <!-- Public Info Tab -->
    <div v-if="activeTab === 'public'" class="tab-content">
      <div class="label">Username</div>
      <input type="text" v-model="username" class="input" placeholder="Public username" />
      <div class="label">Description</div>
      <textarea v-model="description" class="input" placeholder="Public description" />
    </div>

    <!-- Passkeys Tab -->
    <div v-if="activeTab === 'passkeys'" class="tab-content">
      <div v-if="passkeys.length === 0">No passkeys found.</div>
      <div v-if="passkeys.length > 0" class="passkeys-list">
        <div v-for="passkey in passkeys" :key="passkey.id" class="passkey-card">
          <div class="passkey-header">
            <div class="passkey-icon">🔑</div>
            <div class="passkey-details">
              <div class="passkey-id">{{ passkey.id.slice(0, 8) }}...</div>
              <div class="passkey-meta">
                <span class="device-type">{{ passkey.deviceType }}</span>
                <span class="backup-status" :class="{ backed: passkey.backedUp }">
                  {{ passkey.backedUp ? '✓ Backed up' : '⚠️ Not backed up' }}
                </span>
              </div>
            </div>
            <div class="passkey-counter">
              Uses: {{ passkey.counter }}
            </div>
          </div>
        </div>
      </div>
      <br />
      <button @click="addPasskey" class="form-button">Add passkey</button>
      <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
    </div>

    <!-- Save button and message - shown on all tabs -->
    <button v-if="activeTab !== 'passkeys'" :disabled="isLoading" @click="setup" class="form-button">Save</button>
    <div class="message" v-if="message && activeTab !== 'passkeys'" :class="{ error: errored }">{{ message }}</div>
  </div>
</template>

