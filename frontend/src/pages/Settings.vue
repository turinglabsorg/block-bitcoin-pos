<template>
  <div class="loading-parent">
    <loading :active.sync="isLoading" :can-cancel="true"></loading>
    <main-menu></main-menu>
    <div class="page-header clear-filter" filter-color="orange">
        <div class="text-center" style="position:fixed; top:0; left:0; width:100%; padding:20px; ">
          <span style="font-size:14px; position:absolute; top:35px; right:30px">{{ balance }} BTC</span>
        </div>
        <div class="MainWrap text-center">
          Company name:<br>
          <fg-input placeholder="Your company name" v-model="user.company"></fg-input>
          E-Mail:<br>
          <fg-input placeholder="Your e-mail" v-model="user.email"></fg-input>
          Legacy Bitcoin address (not recommended):<br>
          <fg-input placeholder="Your Bitcoin address" v-model="user.address"></fg-input>
          XPUB Bitcoin BIP32/44:<br>
          <fg-input placeholder="Your xpub master key" v-model="user.xpub"></fg-input>
          Preferred currency:<br>
          <select class="form-control" v-model="user.currency">
            <option value="€">€ - EURO</option>
            <option value="$">$ - DOLLAR</option>
            <option value="£">£ - STERLING</option>
            <option value="BTC">BTC - BITCOIN</option>
          </select><br>
          <n-button type="success" v-on:click="editProfile()" block>Edit account</n-button>
        </div>
        <main-footer></main-footer>
    </div>
  </div>
</template>
<script>
import { Button } from '@/components';
import {FormGroupInput as FgInput} from '@/components';
import MainFooter from '@/layout/MainFooter';
import MainMenu from '@/layout/MainMenu';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

export default {
  name: 'register-page',
  bodyClass: 'login-page',
  components: {
    FgInput,
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
        currency: '€',
        xpub: ''
      }
    };
  },
  methods: {
    editProfile: function(){
      var app = this;
      var notify = this.$snotify;
      this.isLoading = true;
      axios.post('https://blockpos.io/account/edit', 
        { token: this.token, company: app.user.company, email: app.user.email, address: app.user.address, currency: app.user.currency, xpub: app.user.xpub })
        .then(()=>{
          this.isLoading = false;
          notify.success('Profile edited!');
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
        if(response.data.data.xpub){
          app.user.xpub = response.data.data.xpub;
        }
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
