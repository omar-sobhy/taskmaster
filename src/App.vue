<template>
  <div>
    <div id="login-container" v-if="store.username !== ''">
      Logged in as {{ store.username }}
      <a href="" @click.prevent="logout"> (log out) </a>
      <br />
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>
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
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { useErrorStore } from './stores/error';

const store = useUserStore();

const errorStore = useErrorStore();

const route = useRoute();
const router = useRouter();

function logout() {
  store.username = '';
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
</style>
