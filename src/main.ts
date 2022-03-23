import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import './plugins/bootstrap-vue';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import { Plugin as ApiPlugin } from './plugins/api-client/api-client';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueCookies);

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    const state = this.$cookies.get('state');

    const taskmasterClientOptions = {
      authorizationCookie: this.$cookies.get('Authorization'),
    };

    if (state) {
      this.$store.commit('setState', state);
    }

    Vue.use(ApiPlugin, taskmasterClientOptions);
  },
  data: {},
  methods: {},
}).$mount('#app');
