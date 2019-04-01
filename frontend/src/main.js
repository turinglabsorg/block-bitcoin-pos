import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Snotify, { SnotifyPosition } from 'vue-snotify'
import 'vue-snotify/styles/material.css';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';
import NowUiKit from './plugins/now-ui-kit';
import VueQrcode from '@xkeshi/vue-qrcode';

Vue.config.productionTip = false;

var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

Vue.use(NowUiKit);
Vue.component(VueQrcode.name, VueQrcode);

Vue.use(Snotify, {
  toast: {
    position: SnotifyPosition.rightTop
  }
});

Vue.use(Loading);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
