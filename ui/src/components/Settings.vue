<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import { state } from "../state";
import { startRegistration } from "@simplewebauthn/browser";

const xpub = ref("");
const currency = ref("usd");
const slippage = ref(0.5);
const allowUnconfirmed = ref(true);
const username = ref("");
const email = ref("");
const description = ref("");
const passkeys: any[] = reactive([]);

// Variables for products
const products: any[] = reactive([]);
const newProduct = reactive({
  _id: "",
  name: "",
  price: 0,
  color: "",
});

// Define available color categories
const colorOptions = [
  { name: "Red", value: "#FF0000" },
  { name: "Green", value: "#078129" },
  { name: "Blue", value: "#0000FF" },
  { name: "Orange", value: "#ff5b00" },
  { name: "Purple", value: "#800080" },
];

state.getUser().then((user) => {
  console.log("Completamente caricato utente:", user);
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
  // Manage products
  for (const product of user.products) {
    products.push(product);
  }
});

const isLoading = ref(false);
const errored = ref(false);
const message = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

const setup = async () => {
  if (!xpub.value) {
    errored.value = true;
    message.value = "Xpub or Zpub is required.";
    return;
  }
  isLoading.value = true;
  errored.value = false;
  message.value = "";
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
    errored.value = true;
    message.value = res.data.message;
  } else {
    message.value = "Account saved.";
  }
};

const addPasskey = async () => {
  const addRes = await axios.post(
    `${apiUrl}/users/passkeys/add`,
    {
      email,
    },
    {
      headers: {
        Authorization: `Bearer ${state.session}`,
      },
    }
  );
  let attResp;
  try {
    // Pass the options to the authenticator and wait for a response
    attResp = await startRegistration({ optionsJSON: addRes.data.options });
  } catch (error: any) {
    // Some basic error handling
    if (error.name === "InvalidStateError") {
      message.value = "Error: Authenticator was probably already registered by user";
    } else {
      message.value = error;
    }
    throw error;
  }
  const verifyRes = await axios.post(`${apiUrl}/users/passkeys/verify`, attResp, {
    headers: {
      Authorization: `Bearer ${state.session}`,
    },
  });
  if (verifyRes.data.error) {
    message.value = verifyRes.data.message;
    errored.value = true;
    setTimeout(() => {
      errored.value = false;
    }, 1000);
  } else {
    for (const passkey of verifyRes.data.passkeys) {
      passkeys.push(passkey);
    }
    message.value = "Passkey added.";
    setTimeout(() => {
      message.value = "";
    }, 1000);
  }
};

const pendingDeletion = ref("");

const initiateRemove = (id: string) => {
  pendingDeletion.value = id;
};

const cancelRemove = () => {
  pendingDeletion.value = "";
};

const removePasskey = async (id: string) => {
  if (!id) return;
  if (isLoading.value) return;
  isLoading.value = true;
  const res = await axios.delete(`${apiUrl}/users/passkeys/remove`, {
    headers: { Authorization: `Bearer ${state.session}` },
    data: { id },
  });
  isLoading.value = false;
  pendingDeletion.value = "";
  if (!res.data.error) {
    message.value = "Passkey removed.";
    const index = passkeys.findIndex((p) => p.id === id);
    if (index > -1) {
      passkeys.splice(index, 1);
    }
    setTimeout(() => {
      message.value = "";
    }, 1000);
  } else {
    errored.value = true;
    message.value = res.data.message;
    setTimeout(() => {
      errored.value = false;
    }, 1000);
  }
};

// Add product
const addProduct = async () => {
  if (!newProduct.name || newProduct.price <= 0 || !newProduct.color) {
    message.value = "All product fields are required.";
    errored.value = true;
    return;
  }
  try {
    const res = await axios.post(`${apiUrl}/users/products/add`, newProduct, {
      headers: { Authorization: `Bearer ${state.session}` },
    });
    if (!res.data.error && res.data.product) {
      const addedProduct = res.data.product;
      if (addedProduct && addedProduct._id) {
        // Update the products array reactively

        products.push(addedProduct);
        errored.value = false;
        message.value = "Product added successfully.";
      } else {
        message.value = "Product data is missing required fields.";
        errored.value = true;
      }
    } else {
      message.value = res.data.message;
      errored.value = true;
    }
  } catch (error) {
    message.value = "An error occurred while adding the product.";
    errored.value = true;
  }
};

// Remove product
const removeProduct = async (id: string) => {
  if (!id) return;
  try {
    const res = await axios.delete(`${apiUrl}/users/products/remove`, {
      headers: { Authorization: `Bearer ${state.session}` },
      data: { productId: id },
    });
    if (!res.data.error) {
      const index = products.findIndex((p) => p._id === id);
      if (index > -1) {
        products.splice(index, 1);
      }
      message.value = "Product removed.";
    } else {
      message.value = res.data.message;
      errored.value = true;
    }
  } catch (error) {
    message.value = "An error occurred while removing the product.";
    errored.value = true;
  }
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
      <div class="label">Product Name</div>
      <input type="text" v-model="newProduct.name" class="input" placeholder="Product name" />
      <div class="label">Product Price</div>
      <input type="number" v-model="newProduct.price" class="input" placeholder="Product price" />
      <div class="label">Product Color</div>
      <select v-model="newProduct.color" class="input">
        <option v-for="color in colorOptions" :key="color.value" :value="color.value">{{ color.name }}</option>
      </select>
      <button @click="addProduct" class="form-button">Add Product</button>

      <div v-if="products.length > 0" class="products-list">
        <div v-for="product in products" :key="product._id" class="product-item" :style="{ backgroundColor: product.color }">
          <ul class="product-item">
            <li>{{ product.name }}</li>
            <li>${{ product.price }}</li>
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
