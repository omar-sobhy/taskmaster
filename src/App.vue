<template>
  <div class="h-100">
    <div id="login-container" v-if="store.username !== ''">
      Logged in as {{ store.username }}
      <a href="" @click.prevent="logout"> (log out) </a>
      <br />
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span v-if="store.username !== ''">
        | <router-link to="/dashboard">Dashboard</router-link></span
      >
    </div>
    <router-view />
    <div class="modal" id="error-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="model-header">
            <div class="modal-title"><h5>An error occurred.</h5></div>
          </div>
          <div class="model-body">{{ errorStore.message }}</div>
          <div class="modal-footer">
            <button class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
          </div>
        </div>
      </div>
    </div>
    <div id="loading-modal" class="loading-modal">
      <div class="loading-modal-content h-25 rounded-3">
        <div class="loading-modal-body d-flex align-items-center justify-content-center h-100">
          Loading... &nbsp;
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { useErrorStore } from './stores/error';
import { useCookies } from 'vue3-cookies';

const store = useUserStore();

const errorStore = useErrorStore();

const route = useRoute();
const router = useRouter();

const { cookies } = useCookies();

function logout() {
  store.username = '';
  cookies.remove('username');
  cookies.remove('Authorization');

  if (route.name !== 'Home') {
    router.push('/');
  } else {
    window.location.reload();
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#login-container {
  padding-left: 30px;
  padding-top: 10px;
}

#nav {
  padding: 30px;
  padding-top: 0;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#loading-modal {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.4);
}

.loading-modal-content {
  margin: 15% auto;
  width: 20%;
  background-color: white;
}
</style>
