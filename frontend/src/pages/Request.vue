<template>
  <div class="loading-parent">
    <loading :active.sync="isLoading" :can-cancel="true"></loading>
    <detect-network v-on:detected-condition="detected">
      <div slot="online">
        <div class="page-header clear-filter" filter-color="orange">
            <div class="PaymentWrapper WrapperRequest" style="overflow:y:auto!important" v-bind:class="{ paymentActive: states.payment }">
              <div class="QRWrapper" style="margin-top:-30px; margin-bottom:50px">
                <img v-lazy="'img/now-logo.png'" height="140" alt="">
                <qrcode v-bind:value="payment.uri" :options="{ size: 300 }" style="width:100%"></qrcode><br><br>
                <img src="img/red_load.png" width="30" height="30" class="fa-spin"><br><br>
                Waiting for payment at<br><small>{{ payment.address }}</small><br>
                please send {{ payment.amount }} BTC<br>
                <small>BTC price is: {{ payment.btcprice }}{{ payment.currency }}</small>
              </div>
            </div>
            <div class="PaymentWrapper WrapperRequest" v-bind:class="{ paymentActive: states.paymentcompleted }">
              <div class="QRWrapper">
                <img v-lazy="'img/now-logo.png'" alt="" style="margin-bottom:-70px">
                <span class="btest ion-ios-checkmark" style="font-size: 205px;color: #90EE90;line-height: 0px;"></span>
                <h1 style="margin-top:-50px">All done!</h1>
                <h3>You've sent {{ payment.received }} BTC</h3>
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
<style>
  .paymentActive{
    overflow-y:auto!important
  }
</style>
<script>
import MainFooter from '@/layout/MainFooter';
import detectNetwork from 'v-offline';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

export default {
  name: 'register-page',
  bodyClass: 'login-page',
  components: {
    MainFooter,
    Loading,
    detectNetwork
  },
  data: function() {
    return {
      isLoading: false,
      fullPage: true,
      amount: '0.00',
      currency: '',
      state: null,
      balance: 0,
      token: '',
      addresserror: false,
      states: {
        shaking: false,
        payment: false,
        paymentcompleted: false
      },
      payment: {
        address: '',
        uri: '',
        rid: this.$route.params.id,
        amount: 0,
        currency: '',
        received: 0,
        btcprice: 0
      }
    };
  },
  methods: {
    detected(e) {
      this.state = e;
    },
    fetchRequest: function(){
      var notify = this.$snotify;
      var app = this;
      axios.post('https://blockpos.io/payments/fetch', {id: this.payment.rid})
        .then((response)=>{
          if(response.data.status == 200){
            app.isLoading = false;
            app.payment.address=response.data.data.address;
            app.payment.amount=response.data.data.amount;
            app.payment.uri=response.data.data.URI;
            app.payment.rid=response.data.data.rid;
            app.payment.btcprice=response.data.data.price;
            app.payment.currency=response.data.data.currency;
            app.states.payment = true;
            app.checkRequest();
            setInterval(function () {
              app.checkRequest();
            }, 5000);
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
    },
    checkRequest: function(){
      var app = this;
      var notify = this.$snotify;
      if(app.payment.rid != ''){
      axios.post('https://blockpos.io/payments/check', {rid: app.payment.rid, token: this.token})
        .then((response)=>{
          if(response.data.data.status == 'Paid'){
            app.payment.received=response.data.data.received;
            app.states.payment = false;
            app.states.paymentcompleted = true;
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
    }
  },
  beforeMount(){
    this.fetchRequest();
  }
};
</script>
<style>
  .loading-parent {
    position: relative;
  }
  .WrapperRequest{background:none!important}
</style>
