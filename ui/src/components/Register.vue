<script setup lang="ts">
import { ref } from 'vue'
import { state } from '../state'
const email = ref('')
</script>

<template>
  <h3>Let's get you <u>orangepilled</u>.</h3>
  <input type="email" class="input" v-model="email" placeholder="Email" />
  <button class="form-button">Enter</button>
  <br /><br />
  <div class="link" @click="state.push('/login')">Already have an account? Login here.</div>
</template>
