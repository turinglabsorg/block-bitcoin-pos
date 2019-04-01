<template>
  <div class="loading-parent">
    <loading :active.sync="isLoading" :can-cancel="true"></loading>
    <detect-network v-on:detected-condition="detected">
      <div slot="online">
        <main-menu></main-menu>
        <div class="page-header clear-filter" filter-color="orange">
            <div class="text-center" style="position:fixed; top:0; left:0; width:100%; padding:20px; ">
              <span style="font-size:14px; position:absolute; top:35px; right:30px">{{ balance }} BTC</span>
            </div>
            <router-link to="/settings">
              <div class="text-center" v-if="addresserror" style="position:fixed; bottom:0; color:#fff; background:#f00; z-index:999; left:0; width:100%; padding:20px; ">
                You have to confiugure your Bitcoin address!
              </div>
            </router-link>
            <div class="Calculator">
                <header class="Calculator-header animated" v-bind:class="{ shake: states.shaking }"  style="padding:10px;">
                  <div class="Calculator-operands">
                    <span class="Calculator-currentCurrency" style="font-size: 40px; font-weight: 200;">{{ currency }}</span>
                    <span class="Calculator-currentOperand" style="font-size: 40px; font-weight: 200;">{{ amount }}</span>
                  </div>
                </header>
                <div class="Calculator-body">
                  <div class="Calculator-buttonsContainer">
                      <div class="Calculator-button" v-on:click="changeValue(7)"><span class="btest">7</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(8)"><span class="btest">8</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(9)"><span class="btest">9</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(4)"><span class="btest">4</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(5)"><span class="btest">5</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(6)"><span class="btest">6</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(1)"><span class="btest">1</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(2)"><span class="btest">2</span></div>
                      <div class="Calculator-button" v-on:click="changeValue(3)"><span class="btest">3</span></div>
                      <div class="Calculator-button" v-on:click="deleteValue()"><span class="btest ion-ios-arrow-back"></span></div>
                      <div class="Calculator-button" v-on:click="changeValue(0)"><span class="btest">0</span></div>
                      <div class="Calculator-button" v-on:click="changeValue('.')"><span class="btest">.</span></div>
                    </div>
                </div>
                <div class="Calculator-button Calculator-equals text-center" v-on:click="initPayment()" style="font-weight:400; padding:5px 0; cursor:pointer"><span style="font-size:20px">CHARGE</span></div>
            </div>
            <div class="PaymentWrapper" v-bind:class="{ paymentActive: states.payment }">
              <span class="btest ion-ios-close" v-on:click="hidePayment()" style="font-size:35px; position:absolute; top:17px; left:34px"></span>
              <span class="btest ion-ios-share" v-on:click="sharePage()" style="font-size:35px; position:absolute; top:17px; right:34px"></span>
              <div class="QRWrapper">
                <qrcode v-bind:value="payment.uri" :options="{ size: 300 }" style="width:100%"></qrcode><br><br>
                <img src="img/red_load.png" width="30" height="30" class="fa-spin"><br><br>
                Waiting for payment at<br><small>{{ payment.address }}</small><br>
                please send {{ payment.amount }} BTC<br>
                <small>BTC price is: {{ payment.btcprice }} {{ currency }}</small>
              </div>
            </div>
            <main-footer></main-footer>
        </div>
      </div>
      <div slot="offline">
        <div class="MainWrap" style="background:#fff; text-align:center; padding:10px; border-radius:5px; margin:10% 0; ">
          <card style="width: 100%; text-align:center; color:#000">
              <br><img src="img/notransactions.png" width="100"><br><br>
              It seems you're offline!<br>
              Please connect your device and reload the page!<br><br>
          </card>
        </div>
      </div>
    </detect-network>

  </div>
</template>
<script>
import MainFooter from '@/layout/MainFooter';
import detectNetwork from 'v-offline';
import MainMenu from '@/layout/MainMenu';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

export default {
  name: 'register-page',
  bodyClass: 'login-page',
  components: {
    MainFooter,
    Loading,
    detectNetwork,
    MainMenu
  },
  data: function() {
    return {
      isLoading: false,
      fullPage: true,
      amount: '0.00',
      currency: '',
      state: null,
      balance: 0,
      xpub: '',
      address: '',
      token: '',
      addresserror: false,
      states: {
        shaking: false,
        payment: false
      },
      payment: {
        address: '',
        uri: '',
        rid: '',
        amount: 0,
        btcprice: 0
      }
    };
  },
  methods: {
    detected(e) {
      this.state = e;
    },
    sharePage: function(){
      window.open('/#/request/'+this.payment.rid, '_blank');
    },
    checkLogin: function(){
      var token = this.$cookie.get('cookielogin');
      var notify = this.$snotify;
      const app = this
      if(token){
        //this.isLoading=true;
        this.token = token;
        axios.post('https://blockpos.io/account/getinfo', { token: this.token })
          .then((response)=>{
            app.addresserror=true;
            if(response.data.data.address.length > 0){
              app.addresserror=false;
            }
            if(response.data.data.xpub.length > 0){
              app.addresserror=false;
            }
            if(response.data.data.address !== ''){
              app.address=response.data.data.address;
            }
            if(response.data.data.currency !== ''){
              app.currency=response.data.data.currency;
            }else{
              app.currency='€';
            }
            if(response.data.data.xpub !== ''){
              app.xpub=response.data.data.xpub;
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if(error.response){
              if(error.response.data.status == 401){
                this.doLogout();
              }
            }
          });
      }else{
        this.$router.push('/login');
        notify.error('Make the login first!');
      }
    },
    doLogout: function(){
      this.$cookie.delete('cookielogin');
      this.$router.push('/login');
    },
    changeValue: function(number){
      if(this.amount!=0){
        this.amount = String(this.amount) + String(number);
      }else{
        this.amount = String(number);
      }
    },
    deleteValue: function(){
      this.amount = this.amount.substring(0, this.amount.length - 1);
      if(this.amount == ''){
        this.amount = 0;
      }
    },
    initPayment: async function(){
      var notify = this.$snotify;
      var app = this;
      
      if(this.amount > 0){
        this.isLoading = true;
        axios.post('https://blockpos.io/payments/init', {amount: this.amount, token: this.token, currency: this.currency})
          .then((response)=>{
            if(response.data.status == 200){
              app.isLoading = false;
              app.payment.address=response.data.data.address;
              app.payment.amount=response.data.data.amount;
              app.payment.uri=response.data.data.URI;
              app.payment.rid=response.data.data.rid;
              app.payment.btcprice=response.data.data.price;
              app.states.payment = true;
              setInterval(function () {
                app.checkRequest();
              }, 15000);
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if(error.response){
              notify.error(error.response.data.error);
              if(error.response.data.status == 401){
                this.doLogout();
              }
            }
          });
        
      }else{
        app.states.shaking = true;
        setTimeout(function(){
          app.states.shaking = false;
        },450);
      }
    },
    checkRequest: function(){
      var app = this;
      var notify = this.$snotify;
      if(app.payment.rid != ''){
      axios.post('https://blockpos.io/payments/check', {rid: app.payment.rid, token: this.token})
        .then((response)=>{
          if(response.data.data.status == 'Paid'){
            app.states.payment = false;
            app.payment.address = '';
            app.payment.rid = '';
            app.payment.uri = '';
            app.payment.amount = 0;
            app.payment.btcprice = 0;
            app.amount = 0;
            notify.success('Payment received!');
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
          }
        })
        .catch((error) => {
          this.isLoading = false;
          if(error.response){
            notify.error(error.response.data.error);
            if(error.response.data.status == 401){
              this.doLogout();
            }
          }
        });
      }
    },
    hidePayment: function(){
      var app = this;
      axios.post('https://blockpos.io/payments/cancel', {rid: app.payment.rid, token: this.token});
      this.states.payment = false;
      this.payment.address = '';
      this.payment.rid = '';
      this.payment.uri = '';
      this.payment.amount = 0;
      this.payment.btcprice = 0;
      this.amount = 0;
    }
  },
  beforeMount(){
    this.checkLogin();
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
      }).then(function () {

      });
  }
};
</script>
<style>
  .loading-parent {
    position: relative;
  }
</style>
