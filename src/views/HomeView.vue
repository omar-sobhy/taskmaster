<template>
  <div>
    <div class="container card" v-if="userStore.username === ''">
      <div class="row" id="header">
        <div
          class="col"
          v-bind:class="{ inactive: activeColumn !== 0 }"
          v-on:click="activeColumn = 0"
        >
          Log in
        </div>
        <div
          class="col"
          v-bind:class="{ inactive: activeColumn !== 1 }"
          v-on:click="activeColumn = 1"
        >
          Sign up
        </div>
      </div>

      <div v-if="activeColumn === 0" class="pb-2 pt-2">
        <log-in-component
          @login="handleLogin"
          @login-success="handleLoginSuccess"
          @login-error="handleLoginError"
        />
      </div>
      <div v-else class="pb-2 pt-2">
        <sign-up-component />
      </div>
    </div>
    <div class="container" style="text-align: center" v-else>
      You are logged in! Click on Dashboard to continue.
    </div>
    <div class="modal" id="loading-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Loading...</h5>
          </div>
          <div class="modal-body" style="background: white">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import SignUpComponent from '../components/SignUpComponent.vue';
import LogInComponent from '../components/LogInComponent.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useCookies } from 'vue3-cookies';
import type { User } from 'taskmaster-client';

const userStore = useUserStore();

const activeColumn = ref(0);

const router = useRouter();

const { cookies } = useCookies();

function handleLogin() {
  const modal = new Modal(document.getElementById('loading-modal')!);
  modal.show();
}

function handleLoginSuccess(user: User) {
  userStore.$state.username = user.username;
  cookies.set('username', user.username);

  debugger;

  const modal = Modal.getInstance(document.getElementById('loading-modal')!)!;
  modal.hide();

  router.push('/dashboard');
}

function handleLoginError() {
  const modal = Modal.getInstance(document.getElementById('loading-modal')!)!;
  modal.hide();
}
</script>

<style scoped>
.container {
  background: #c4c4c4;
}

.inactive {
  background: #dddddd;
}

#header {
  cursor: pointer;
}
</style>
