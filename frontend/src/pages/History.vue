<template>
  <div class="loading-parent">
    <loading :active.sync="isLoading" :can-cancel="true"></loading>
    <main-menu></main-menu>
    <div class="page-header clear-filter" filter-color="orange" style="overflow-y:auto">
        <div class="text-center" style="position:fixed; top:0; left:0; width:100%; padding:20px; ">
          <span style="font-size:14px; position:absolute; top:35px; right:30px">{{ balance }} BTC</span>
        </div>
        <div class="MainWrap">
          <card v-if="notransactions" style="width: 100%; text-align:center; color:#000">
              <img src="img/notransactions.png" width="100"><br><br>
              Ops,
              no transactions!
          </card>
          <card style="width: 100%; margin-bottom:110px">
           <ul slot="raw-content" class="list-group list-group-flush">
             <li class="list-group-item" v-for="request in requests" :key="request.rid">
              {{request.date}}<br>
              {{request.received}} BTC
                <a :href="'https://live.blockcypher.com/btc/address/'+request.address+'/'" target="_blank">
                  <badge v-if="request.status === 'Paid'" type="success" style="position:absolute; top:50%; margin-top:-11px; right:10px" class="pull-right">Explorer</badge>
                </a>
             </li>
           </ul>
          </card>
        </div>
        <main-footer></main-footer>
    </div>
  </div>
</template>
<script>
import { Card, Button, Badge } from '@/components';
import MainFooter from '@/layout/MainFooter';
import MainMenu from '@/layout/MainMenu';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

export default {
  name: 'register-page',
  bodyClass: 'login-page',
  components: {
    [Button.name]: Button,
    MainFooter,
    [Badge.name]: Badge,
    Loading,
    Card,
    MainMenu
  },
  data: function() {
    return {
      isLoading: true,
      notransactions: false,
      fullPage: true,
      balance: 0,
      token: '',
      requests: []
    };
  },
  methods: {
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
    axios.post('https://blockpos.io/account/requests', { token: this.token })
      .then((response)=>{
        app.requests = response.data.data;
        if(app.requests.length == 0){
          app.notransactions = true;
        }else{
          app.notransactions = false;
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
