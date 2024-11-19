<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import axios from "axios";
import { state } from "../state";
import { startRegistration } from "@simplewebauthn/browser";

// Define state variables and reactive properties for the component
const xpub = ref("");
const currency = ref("usd");
const slippage = ref(0.5);
const allowUnconfirmed = ref(true);
const username = ref("");
const email = ref("");
const description = ref("");
const passkeys: any[] = reactive([]);
const products: any[] = reactive([]);
const newProduct = reactive({
  _id: "",
  name: "",
  price: 0,
  color: "",
});

// Color Options
const colorOptions = [
  { name: "Red", value: "#FF0000" },
  { name: "Green", value: "#078129" },
  { name: "Blue", value: "#0000FF" },
  { name: "Orange", value: "#ff5b00" },
  { name: "Purple", value: "#800080" },
];

// Function to get the currency symbol
const currencySymbol = computed(() => {
  switch (currency.value) {
    case "usd":
      return "$";
    case "eur":
      return "€";
    case "gbp":
      return "£";
    default:
      return "$"; // Default
  }
});

// Initialize user and product data when the user is authenticated
state.getUser().then((user) => {
  if (!user?.xpub) {
    state.push("/init");
  }
  currency.value = user?.currency;
  slippage.value = user?.slippage;
  email.value = user?.email;
  allowUnconfirmed.value = !user?.onlyConfirmed;
  xpub.value = user?.xpub;
  username.value = user?.username;
  description.value = user?.metadata?.description;
  for (const passkey of user?.passkeys) {
    passkeys.push(passkey);
  }
  for (const product of user.products) {
    products.push(product);
  }
});

// Feedback Variables
const isLoading = ref(false);
const errored = ref(false);
const message = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

// Helper function for managing user feedback messages
const setMessage = (msg: string, isError: boolean = false, timeout: number = 2500) => {
  message.value = msg;
  errored.value = isError;
  if (timeout) {
    setTimeout(() => {
      message.value = "";
      errored.value = false;
    }, timeout);
  }
};

// Primary functions for handling user data and interactions
const setup = async () => {
  if (!xpub.value) {
    setMessage("Xpub or Zpub is required.", true);
    return;
  }
  isLoading.value = true;
  const res = await axios.put(
    `${apiUrl}/users`,
    {
      xpub: xpub.value,
      currency: currency.value,
      onlyConfirmed: !allowUnconfirmed.value,
      slippage: slippage.value,
      username: username.value,
      metadata: {
        description: description.value,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.session}`,
      },
    }
  );
  isLoading.value = false;
  if (res.data.error) {
    setMessage(res.data.message, true);
  } else {
    setMessage("Account saved.");
  }
};

const addPasskey = async () => {
  try {
    const addRes = await axios.post(
      `${apiUrl}/users/passkeys/add`,
      { email },
      {
        headers: { Authorization: `Bearer ${state.session}` },
      }
    );
    const attResp = await startRegistration({ optionsJSON: addRes.data.options });
    const verifyRes = await axios.post(`${apiUrl}/users/passkeys/verify`, attResp, {
      headers: { Authorization: `Bearer ${state.session}` },
    });
    if (verifyRes.data.error) {
      setMessage(verifyRes.data.message, true);
    } else {
      passkeys.push(...verifyRes.data.passkeys);
      setMessage("Passkey added.");
    }
  } catch (error: any) {
    setMessage(`Error: ${error.message || "An unexpected error occurred"}`, true);
  }
};

const removePasskey = async (id: string) => {
  if (!id || isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await axios.delete(`${apiUrl}/users/passkeys/remove`, {
      headers: { Authorization: `Bearer ${state.session}` },
      data: { id },
    });
    isLoading.value = false;
    if (res.data.error) {
      setMessage(res.data.message, true);
    } else {
      const index = passkeys.findIndex((p) => p.id === id);
      if (index > -1) passkeys.splice(index, 1);
      setMessage("Passkey removed.");
    }
  } catch {
    setMessage("An error occurred while removing the passkey.", true);
  }
};

const resetNewProduct = () => {
  newProduct.name = "";
  newProduct.price = 0;
  newProduct.color = "";
};

const addProduct = async () => {
  if (!newProduct.name || newProduct.price <= 0 || !newProduct.color) {
    setMessage("All product fields are required.", true);
    return;
  }
  try {
    const res = await axios.post(`${apiUrl}/users/products/add`, newProduct, {
      headers: { Authorization: `Bearer ${state.session}` },
    });
    if (!res.data.error && res.data.product) {
      products.push(res.data.product);
      setMessage("Product added successfully.");
      resetNewProduct();
    } else {
      setMessage(res.data.message, true);
    }
  } catch {
    setMessage("An error occurred while adding the product.", true);
  }
};

const removeProduct = async (id: string) => {
  if (!id) return;
  try {
    const res = await axios.delete(`${apiUrl}/users/products/remove`, {
      headers: { Authorization: `Bearer ${state.session}` },
      data: { productId: id },
    });
    if (res.data.error) {
      setMessage(res.data.message, true);
    } else {
      const index = products.findIndex((p) => p._id === id);
      if (index > -1) products.splice(index, 1);
      setMessage("Product removed.");
    }
  } catch {
    setMessage("An error occurred while removing the product.", true);
  }
};

// Handling the removal process
const pendingDeletion = ref("");

const initiateRemove = (id: string) => {
  pendingDeletion.value = id;
};

const cancelRemove = () => {
  pendingDeletion.value = "";
};

const activeTab = ref("pos"); // possible values: 'pos', 'public', 'passkeys', 'products'
</script>

<template>
  <div class="settings-container">
    <div class="settings-tabs">
      <button @click="activeTab = 'pos'" class="tab-button first-tab" :class="{ active: activeTab === 'pos' }">POS</button>
      <button @click="activeTab = 'public'" class="tab-button" :class="{ active: activeTab === 'public' }">Public Info</button>
      <button @click="activeTab = 'passkeys'" class="tab-button" :class="{ active: activeTab === 'passkeys' }">Passkeys</button>
      <button @click="activeTab = 'products'" class="tab-button last-tab" :class="{ active: activeTab === 'products' }">Products</button>
    </div>

    <!-- POS Settings Tab -->
    <div v-if="activeTab === 'pos'" class="tab-content">
      <div class="label">Xpub or Zpub</div>
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
          <div class="passkey-actions">
            <button v-if="pendingDeletion !== passkey.id" class="passkey-remove" @click="initiateRemove(passkey.id)">Remove</button>
            <div v-else class="passkey-confirm-actions">
              <button class="passkey-confirm" @click="removePasskey(passkey.id)">Confirm</button>
              <button class="passkey-cancel" @click="cancelRemove">Cancel</button>
            </div>
          </div>
          <div class="passkey-header">
            <div class="passkey-top">
              <div class="passkey-icon">🔑</div>
              <div class="passkey-id">{{ passkey.id }}</div>
            </div>
            <div class="passkey-meta">
              <div class="device-type">{{ passkey.deviceType }}</div>
              <div class="backup-status" :class="{ backed: passkey.backedUp }">
                {{ passkey.backedUp ? "✓ Backed up" : "⚠️ Not backed up" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <button @click="addPasskey" class="form-button">Add passkey</button>
      <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
    </div>

    <!-- Products Tab -->
    <div v-if="activeTab === 'products'" class="tab-content">
      <div class="label">Product</div>
      <input type="text" v-model="newProduct.name" class="input" placeholder="Product name" />
      <div class="label">Price</div>
      <input type="number" v-model="newProduct.price" class="input" />
      <div class="label">Color</div>
      <select v-model="newProduct.color" class="input">
        <option value="" disabled selected>Select a Color</option>
        <option v-for="color in colorOptions" :key="color.value" :value="color.value">{{ color.name }}</option>
      </select>
      <button @click="addProduct" class="form-button">Add Product</button>

      <div v-if="products.length > 0" class="products-list">
        <div v-for="product in products" :key="product._id" class="product-item" :style="{ backgroundColor: product.color }">
          <ul class="product-item">
            <li>{{ product.name }}</li>
            <li>{{ currencySymbol }} {{ product.price }}</li>
          </ul>
          <button @click="removeProduct(product._id)">Remove</button>
        </div>
      </div>
    </div>

    <!-- Save button and message -->
    <button v-if="activeTab !== 'passkeys' && activeTab !== 'products'" :disabled="isLoading" @click="setup" class="form-button">Save</button>
    <div class="message" v-if="message && activeTab !== 'passkeys'" :class="{ error: errored }">{{ message }}</div>
  </div>
</template>
