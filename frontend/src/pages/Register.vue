<template>
  <div class="loading-parent">
    <loading :active.sync="isLoading" :can-cancel="true"></loading>
    <div class="page-header clear-filter" filter-color="orange">
        <div class="page-header-image"
             style="background-image: url('img/login.jpg')">
        </div>
        <div class="content">
            <div class="container">
                <div class="col-md-5 ml-auto mr-auto">
                    <card type="login" plain>
                        <router-link to="/">
                          <a href="#">
                                <img v-lazy="'img/now-logo.png'" alt="">
                          </a>
                        </router-link>
                        <fg-input class="no-border input-lg" v-model="company"
                                  addon-left-icon="now-ui-icons users_circle-08"
                                  placeholder="Company / Name">
                        </fg-input>

                        <fg-input class="no-border input-lg" v-model="email"
                                  addon-left-icon="now-ui-icons ui-1_email-85"
                                  placeholder="E-Mail" type="email">
                        </fg-input>

                        <fg-input class="no-border input-lg" v-model="password"
                                  addon-left-icon="now-ui-icons ui-1_lock-circle-open"
                                  placeholder="Password" type="password">
                        </fg-input>

                        <template slot="raw-content">
                            <div class="card-footer text-center">
                                <a href="#" v-on:click="registerUser()" class="btn btn-primary btn-round btn-lg btn-block">Register now</a>
                            </div>
                            <div class="text-center">
                                <router-link to="/login">
                                  <h6>
                                      <a href="#" class="link footer-link">Already registered, login?</a>
                                  </h6>
                                </router-link>
                            </div>
                        </template>
                    </card>
                </div>
            </div>
        </div>
        <main-footer></main-footer>
    </div>
  </div>
</template>
<script>
import { Card, Button, FormGroupInput } from '@/components';
import MainFooter from '@/layout/MainFooter';
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

export default {
  name: 'register-page',
  bodyClass: 'login-page',
  components: {
    Card,
    MainFooter,
    Loading,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput
  },
  data: function() {
    return {
      isLoading: false,
      fullPage: true,
      company: '',
      email: '',
      password: ''
    };
  },
  methods: {
      registerUser: function(){
        var notify = this.$snotify;
        if(this.company!='' && this.password!='' && this.email!=''){
        var formdata = {
          name: this.company,
          email: this.email,
          password: this.password,
          service: 'email'
        };
        this.isLoading = true;
        axios.post('https://blockpos.io/users/register', formdata)
        .then((response)=>{
            if(response.data.data){
              this.isLoading = false;
              this.$router.push('/login');
              notify.success(response.data.data);
            }
          })
          .catch((error) => {
            this.isLoading = false;
            if(error.response){
              notify.error(error.response.data.error);
            }
          });
        }else{
          notify.error('Fill all the fields!');
        }
      }
  }
};
</script>
<style>
  .loading-parent {
    position: relative;
  }
  .page-header > .content{margin-top:8%!important}
</style>
