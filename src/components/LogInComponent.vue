<template>
  <div>
    <form @submit="submit">
      <div class="input-group mb-3">
        <span class="input-group-text" id="username-label">Username</span>
        <input
          type="text"
          class="form-control"
          placeholder="Username"
          aria-label="Username"
          aria-describedby="username-label"
          v-model="form.username"
          required
        />
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="password-label">Password</span>
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          aria-label="Password"
          aria-describedby="password-label invalid-feedback"
          v-model="form.password"
          required
        />
        <div id="invalid-feedback" class="invalid-feedback">Invalid username or password.</div>
      </div>
      <button class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Client from 'taskmaster-client';
import { inject } from 'vue';

const emit = defineEmits(['login', 'login-success', 'login-error']);

const form = {
  username: '',
  password: '',
};

const apiClient: Client = inject('$apiClient')!;

async function submit(event: Event): Promise<void> {
  event.preventDefault();
  emit('login');

  const result = await apiClient.login(form.username, form.password);
  if (result.type === 'success') {
    emit('login-success', result.data);
  } else {
    emit('login-error');
    document.querySelectorAll('form>div>input').forEach((el) => {
      el.classList.add('is-invalid');
    });
  }
}
</script>
