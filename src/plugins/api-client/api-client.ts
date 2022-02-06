/* eslint-disable no-param-reassign */
import { VueConstructor } from 'vue';

const Plugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$api_client = this;
  },

  login() {

  },
};

export default Plugin;
