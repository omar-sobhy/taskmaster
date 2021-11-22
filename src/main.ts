import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import './plugins/bootstrap-vue';

import { BootstrapVue } from 'bootstrap-vue';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueCookies);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
