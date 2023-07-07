<template>
  <div class="">
    <form class="form" @submit="submit">
      <div class="input-group mb-3">
        <span class="input-group-text" id="username-label">Username</span>
        <input type="text"
          class="form-control"
          placeholder="Username"
          aria-label="Username"
          aria-describedby="username-label"
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="password-label">Password</span>
        <input type="password"
          class="form-control"
          placeholder="Password"
          aria-label="Password"
          aria-describedby="password-label"
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="confirm-password-label">Password</span>
        <input type="password"
          class="form-control"
          placeholder="Confirm password"
          aria-label="Password"
          aria-describedby="confirm-password-label"
        />
      </div>
      <button class="btn btn-primary">Sign up</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Client from 'taskmaster-client';
import { inject } from 'vue';

const form = {
  email: '',
  username: '',
  password: '',
  password2: '',
};

const apiClient: Client = inject('$apiClient')!;

function submit(event: Event): void {
  event.preventDefault();
  const result = apiClient.signup(form.username, form.password, form.email);
  result.then((r) => console.log(r));
  
}
</script>