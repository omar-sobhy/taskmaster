<template>
  <div class="">
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Email"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        />
      </b-form-group>

      <b-form-group id="input-group-2" label="Username" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.username"
          placeholder="Enter username"
          required
        />
      </b-form-group>

      <b-form-group id="input-group-3" label="Password" label-for="input-3">
        <b-form-input
          id="input-3"
          type="password"
          v-model="form.password"
          placeholder="Enter password"
          required
        />
      </b-form-group>

      <b-form-group id="input-group-4" label="Password" label-for="input-4">
        <b-form-input
          id="input-4"
          type="password"
          v-model="form.password2"
          placeholder="Enter password again"
          required
        />
        <b-form-invalid-feedback :state="validation">
          Entered passwords do not match.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SignUpComponent extends Vue {
  form = {
    email: '',
    username: '',
    password: '',
    password2: '',
  };

  onSubmit(event: Event): void {
    event.preventDefault();
    alert(JSON.stringify(this.form));
  }

  get validation(): boolean {
    if (this.form.password2 === '') return true;

    Vue.$api_client;

    return this.form.password === this.form.password2;
  }
}
</script>
