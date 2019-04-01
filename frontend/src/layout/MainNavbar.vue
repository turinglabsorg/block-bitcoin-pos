<template>
    <navbar position="fixed"
            type="primary"
            :transparent="transparent"
            :color-on-scroll="colorOnScroll"
            menu-classes="ml-auto">
        <template slot-scope="{toggle, isToggled}">
						<router-link to="/">
								<img v-lazy="'img/now-logo.png'" height="35" alt="">
						</router-link>
        </template>
        <template slot="navbar-menu">
            <li class="nav-item">
                <router-link class="nav-link" to="/login">
                    <p>LOGIN</p>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link btn btn-neutral" to="/register">
                    <p>REGISTER</p>
                </router-link>
            </li>
        </template>
    </navbar>
</template>

<script>
import { DropDown, NavbarToggleButton, Navbar, NavLink } from '@/components';
import { Popover } from 'element-ui';
export default {
  name: 'main-navbar',
  props: {
    transparent: Boolean,
    colorOnScroll: Number
  },
  components: {
    DropDown,
    Navbar,
    NavbarToggleButton,
    NavLink,
    [Popover.name]: Popover
  }
};
</script>

<style scoped>
</style>
