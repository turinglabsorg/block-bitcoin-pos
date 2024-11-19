<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { state } from "../state";
import axios from "axios";
import QRCode from "qrcode";

interface Product {
  _id: string;
  name: string;
  price: number;
  color: string;
}

const session = state.session;
if (!session) {
  state.push("/login");
}
const isLoading = ref(false);
const errored = ref(false);
const completed = ref(false);
const checkInterval: any = ref();
const message = ref("");
const currency = ref("");
const apiUrl = import.meta.env.VITE_API_URL;
const amount = ref("0");
const identifier = ref("");
const request: any = ref({});
const payment: any = ref({});
const fullfillmentPercentage = ref(0);
const qr = ref("");
const isManual = ref(true); // Default mode is manual
const products = ref<Product[]>([]);
const selectedProducts = ref<any[]>([]);

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

const productSummary = computed(() => {
  const summary: Record<string, { count: number; totalPrice: number }> = {};
  selectedProducts.value.forEach((product) => {
    if (summary[product.name]) {
      summary[product.name].count++;
      summary[product.name].totalPrice += product.price;
    } else {
      summary[product.name] = {
        count: 1,
        totalPrice: product.price,
      };
    }
  });
  return summary;
});

const removeProduct = (productName: string) => {
  const index = selectedProducts.value.findIndex((product) => product.name === productName);
  if (index !== -1) {
    selectedProducts.value.splice(index, 1);
    updateTotal();
  }
};

state.getUser().then((user) => {
  if (!user?.xpub) {
    state.push("/init");
  }
  currency.value = user?.currency;

  if (user?.products && Array.isArray(user.products)) {
    for (const product of user.products) {
      products.value.push(product);
    }
  }
});

const addDigit = (digit: string) => {
  document.activeElement instanceof HTMLElement && document.activeElement.blur();

  if (amount.value === "0") {
    amount.value = digit;
  } else {
    amount.value = amount.value.toString() + digit.toString();
  }
};

const removeDigit = () => {
  document.activeElement instanceof HTMLElement && document.activeElement.blur();

  if (amount.value.length === 1) {
    amount.value = "0";
  } else {
    amount.value = amount.value.slice(0, -1);
  }
};

const addProductToTotal = (product: Product) => {
  selectedProducts.value.push(product);
  updateTotal();
};

const updateTotal = () => {
  const total = selectedProducts.value.reduce((acc, product) => acc + product.price, 0);
  amount.value = total.toString();
};

const requestPayment = async () => {
  if (amount.value === "0") {
    return;
  }
  isLoading.value = true;
  try {
    const res = await axios.post(
      `${apiUrl}/requests`,
      {
        amount: amount.value,
        identifier: identifier.value,
        network: "mainnet",
        chain: "bitcoin",
      },
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    );
    isLoading.value = false;
    if (res.data.error) {
      errored.value = true;
      message.value = res.data.message;
    } else {
      request.value = res.data.request;
      qr.value = await QRCode.toDataURL(res.data.request.address, { width: 600, margin: 2 });
      checkInterval.value = setInterval(checkPayment, 5000);
    }
  } catch (e) {
    isLoading.value = false;
    errored.value = true;
    message.value = "Error requesting payment, retry..";
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return;
  }

  const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  if (validKeys.includes(event.key)) {
    addDigit(event.key);
    return;
  }

  if (event.key === "Backspace" || event.key === "Delete") {
    removeDigit();
    return;
  }

  if (event.key === "Enter") {
    if (!request.value.uuid) {
      requestPayment();
    }
  }
};

const resetPayment = () => {
  completed.value = false;
  request.value = {};
  payment.value = {};
  fullfillmentPercentage.value = 0;
  clearInterval(checkInterval.value);
  amount.value = "0";
  identifier.value = "";
};

const checkPayment = async () => {
  try {
    const res = await axios.get(`${apiUrl}/requests/${request.value.uuid}`);
    if (res.data.error) {
      errored.value = true;
      message.value = res.data.message;
    } else {
      payment.value = res.data.request;
      fullfillmentPercentage.value = res.data.fullfillmentPercentage;
      if (res.data.request.status === "completed") {
        completed.value = true;
        clearInterval(checkInterval.value);
      }
    }
  } catch (e) {
    console.log("ERROR_CHECK_PAYMENT", e);
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
  <div class="pos-container">
    <div v-if="!request.uuid">
      <div class="settings-tabs">
        <button @click="isManual = true" class="tab-button first-tab" :class="{ active: isManual }">Manual</button>
        <button @click="isManual = false" class="tab-button last-tab" :class="{ active: !isManual }">Products</button>
      </div>

      <!-- Manual Mode -->
      <div v-if="isManual">
        <div class="amount">
          {{ amount }}
          <div class="currency">{{ currency }}</div>
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
        <input type="text" class="input" v-model="identifier" placeholder="Add an identifier for the payment (e.g., order id)" />
        <button @click="requestPayment" :disabled="isLoading" class="init-button">Init payment</button>
        <div class="message" v-if="message" :class="{ error: errored }">{{ message }}</div>
      </div>

      <!-- Products Mode -->
      <div v-else>
        <div class="products-list">
          <div v-for="product in products" :key="product._id" class="product-item" :style="{ backgroundColor: product.color }" @click="addProductToTotal(product)">
            <ul class="product-item">
              <li>{{ product.name }}</li>
              <li>{{ currencySymbol }} {{ product.price }}</li>
            </ul>
          </div>
        </div>

        <!-- Products Summary -->
        <div v-if="Object.keys(productSummary).length > 0" class="selected-products-summary">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, productName) in productSummary" :key="productName">
                <td>{{ productName }}</td>
                <td>{{ product.count }}</td>
                <td>{{ currencySymbol }} {{ product.totalPrice.toFixed(2) }}</td>
                <td>
                  <button @click="removeProduct(productName)" class="remove-product">X</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="amount">
          <div>Total: {{ parseFloat(amount).toFixed(2) }} {{ currencySymbol }}</div>
        </div>
        <button @click="requestPayment" :disabled="isLoading" class="init-button">Init payment</button>
      </div>
    </div>
    <!-- Payment Request -->
    <div v-if="request.uuid && !completed">
      <h3>Send {{ request?.amountCrypto }} BTC ({{ request?.amountFiat }} {{ currency.toUpperCase() }}) to:</h3>
      <img width="300" :src="qr" />
      <div class="address" @click="copyToClipboard(request.address)">{{ request.address }}</div>
      BTC price: {{ request.price }} {{ currency.toUpperCase() }}<br />
      <a :href="`/request/${request.uuid}`" target="_blank">
        <button class="init-button" style="margin-top: 20px">Share payment</button>
      </a>
      <div class="restart-button" @click="resetPayment">Restart</div>
      <div v-if="payment.uuid" style="margin-top: 20px">
        Waiting for payment confirmation...
        <div class="fulfillment">{{ fullfillmentPercentage }}% received</div>
      </div>
    </div>

    <div v-if="request.uuid && completed">
      <div class="confirmation-text">
        <div style="font-size: 120px">🤘</div>
        <br />Payment completed!<br />
        <button style="margin-top: 20px" class="form-button" @click="resetPayment">Restart</button>
      </div>
    </div>
  </div>
</template>
