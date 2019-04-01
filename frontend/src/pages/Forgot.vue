<template>
    <div class="page-header clear-filter" filter-color="orange">
        <div class="page-header-image"
             style="background-image: url('img/login.jpg')">
        </div>
        <div class="content">
            <div class="container">
                <div class="col-md-5 ml-auto mr-auto">
                    <card type="login" plain>
                        <div slot="header" class="logo-container">
                            <img v-lazy="'img/now-logo.png'" alt=""><br><span style="color:#fff; font-weight:600; font-size:18px">Block!</span>
                        </div>

                        <fg-input class="no-border input-lg"
                                  addon-left-icon="now-ui-icons users_circle-08"
                                  placeholder="E-Mail">
                        </fg-input>
                        <template slot="raw-content">
                            <div class="card-footer text-center">
                                <a href="#" class="btn btn-primary btn-round btn-lg btn-block">Restore Password</a>
                            </div>
                            <div class="text-center">
                                <router-link to="/login">
                                  <h6>
                                      <a href="#" class="link footer-link">Go to login</a>
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
</template>
<script>
import { Card, Button, FormGroupInput } from '@/components';
import MainFooter from '@/layout/MainFooter';
export default {
  name: 'login-page',
  bodyClass: 'login-page',
  components: {
    Card,
    MainFooter,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput
  }
};
</script>
<style>
</style>