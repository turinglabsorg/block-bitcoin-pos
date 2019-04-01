<template>
    <Slide noOverlay>
        <router-link to="/dashboard">
          <span>Dashboard</span>
        </router-link>
        <router-link to="/history">
          <span>History</span>
        </router-link>
        <router-link to="/api">
          <span>Request ApiKey</span>
        </router-link>
        <router-link to="/settings">
          <span>Settings</span>
        </router-link>
        <a href="#" v-on:click="doLogout()">
          <span>Logout</span>
        </a>
    </Slide>
</template>
<script>
import { Slide } from 'vue-burger-menu';
export default {
  props: {
    backgroundColor: String,
    type: String
  },
  components:{
    Slide
  },
  methods: {
    doLogout: function(){
      this.$cookie.delete('cookielogin');
      this.$router.push('/login');
    }
  }
};
</script>
<style>
</style>
