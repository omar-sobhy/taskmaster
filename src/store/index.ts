import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
    email: '',
  },
  mutations: {
    setLoggedInUser(state, payload) {
      state.username = payload.username;
      state.email = payload.email;
    },
    setState(state, payload) {
      Object.assign(state, payload);
    },
    logout(state) {
      state.username = '';
      state.email = '';
    },
  },
  actions: {
  },
  modules: {
  },
});
