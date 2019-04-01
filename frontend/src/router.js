import Vue from 'vue';
import Router from 'vue-router';
import Index from './pages/Index.vue';
import Login from './pages/Login.vue';
import Dashboard from './pages/Dashboard.vue';
import Settings from './pages/Settings.vue';
import History from './pages/History.vue';
import Register from './pages/Register.vue';
import Request from './pages/Request.vue';
import Api from './pages/Api.vue';
import Forgot from './pages/Forgot.vue';
import MainNavbar from './layout/MainNavbar.vue';
import MainFooter from './layout/MainFooter.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      components: { default: Index, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      components: { default: Dashboard, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    },
    {
      path: '/history',
      name: 'history',
      components: { default: History, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    },
    {
      path: '/api',
      name: 'api',
      components: { default: Api, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    },
    {
      path: '/settings',
      name: 'settings',
      components: { default: Settings, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: 'black' }
      }
    },
    {
      path: '/login',
      name: 'login',
      components: { default: Login, header: MainNavbar },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: '/register',
      name: 'register',
      components: { default: Register, header: MainNavbar },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: '/request/:id',
      name: 'request',
      components: { default: Request, header: MainNavbar },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: '/forgot',
      name: 'forgot',
      components: { default: Forgot, header: MainNavbar },
      props: {
        header: { colorOnScroll: 400 }
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
