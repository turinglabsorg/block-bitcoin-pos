<template>
    <div class="wrapper">
        <div class="page-header clear-filter" filter-color="orange">
          <router-link to="/">
            <div class="page-header-image"
                 style="background-image: url('img/login.jpg')">
            </div>
          </router-link>
            <div class="container">
                <div class="content-center brand">
                    <img class="n-logo" src="img/now-logo.png" alt="">
                    <br>
                    <router-link to="/register">
                      <div style="width:100%" class="btn btn-xl">REGISTER NOW</div>
                    </router-link><br>
                    <router-link to="/login">
                      <div style="width:100%" class="btn btn-xl btn-primary">LOGIN</div>
                    </router-link><br>
                    <a href="https://project.blockpos.io" style="color:#fff; text-decoration:underline">Discover more about the project</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'index',
  bodyClass: 'index-page',
  components: {
  },
  beforeMount(){
    this.checkLogin();
  },
  methods: {
    checkLogin: function(){
      var token = this.$cookie.get('cookielogin');
      if(token){
        this.$router.push('/dashboard');
      }
    }
  }
};
</script>
<style>
  body, html{overflow: hidden;}
</style>
