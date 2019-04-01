<template>
  <div class="loading-parent">
    <loading :active.sync="isLoading" :can-cancel="true"></loading>
    <main-menu></main-menu>
    <div class="page-header clear-filter" filter-color="orange">
        <div class="text-center" style="position:fixed; top:0; left:0; width:100%; padding:20px; ">
          <span style="font-size:14px; position:absolute; top:35px; right:30px">{{ balance }} BTC</span>
        </div>
        <div class="MainWrap text-center">
          <h2>Private keys</h2>
          In this section you'll be able to request private keys and receive it securely in your e-mail.<br><br>
          Detailed instructions on how to use the API and the "Pay with Bitcoin" button can be found here:<br>
          <a href="https://project.blockpos.io/api">https://project.blockpos.io/api</a>
          <br><br>
          Any help, doubts or suggestions can be sent to <a href="mailto:info@turinglabs.org">info@turinglabs.org</a><br><br>
          <n-button type="success" v-on:click="requestPrivateKey()" block>Request Private Key</n-button>
        </div>
        <main-footer></main-footer>
    </div>
  </div>
</template>
<script>
import { Button } from '@/components';
import MainFooter from '@/layout/MainFooter';
import MainMenu from '@/layout/MainMenu';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

export default {
  name: 'api-page',
  bodyClass: 'login-page',
  components: {
    [Button.name]: Button,
    MainFooter,
    Loading,
    MainMenu
  },
  data: function() {
    return {
      isLoading: true,
      fullPage: true,
      balance: 0,
      token: '',
      user: {
        address: '',
        email: '',
        company: '',
        currency: '€'
      }
    };
  },
  methods: {
    requestPrivateKey: function(){
      var app = this;
      var notify = app.$snotify;
      this.isLoading = true;
      axios.post('https://blockpos.io/api/request', { token: this.token })
        .then(()=>{
          this.isLoading = false;
          notify.success('Key requested!');
        })
        .catch((error) => {
          this.isLoading = false;
          if(error.response){
            if(error.response.data.status == 401){
              this.doLogout();
            }
          }
        });
    },
    checkLogin: function(){
      var token = this.$cookie.get('cookielogin');
      var notify = this.$snotify;
      if(token){
        //this.isLoading=true;
        this.token = token;
      }else{
        this.$router.push('/login');
        notify.error('Make the login first!');
      }
    },
    doLogout: function(){
      this.$cookie.delete('cookielogin');
      this.$router.push('/login');
    }
  },
  beforeMount(){
    this.checkLogin()
  },
  mounted(){
    var app = this;
    axios.post('https://blockpos.io/account/balance', { token: this.token })
      .then((response)=>{
        app.balance = response.data.data;
      })
      .catch((error) => {
        this.isLoading = false;
        if(error.response){
          if(error.response.data.status == 401){
            this.doLogout();
          }
        }
      });
    axios.post('https://blockpos.io/account/getinfo', { token: this.token })
      .then((response)=>{
        app.user.address = response.data.data.address;
        app.user.company = response.data.data.company;
        app.user.email = response.data.data.email;
        if(response.data.data.currency){
          app.user.currency = response.data.data.currency;
        }
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
        if(error.response){
          if(error.response.data.status == 401){
            this.doLogout();
          }
        }
      });
  }
};
</script>
<style>
  .loading-parent {
    position: relative;
  }
</style>
