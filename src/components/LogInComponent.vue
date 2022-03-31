<template>
  <div class="">
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Username"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.username"
          placeholder="Enter username"
          required
        />
      </b-form-group>

      <b-form-group id="input-group-2" label="Password" label-for="input-2">
        <b-form-input
          id="input-2"
          type="password"
          v-model="form.password"
          placeholder="Enter password"
          required
        />
      </b-form-group>

      <b-form-invalid-feedback :state="validation">
        Invalid username or password.
      </b-form-invalid-feedback>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LogInComponent extends Vue {
  form = {
    username: '',
    password: '',
  }

  status: 'Unsubmitted' | 'Submitted' | 'Error' = 'Unsubmitted';

  get validation(): boolean {
    if (this.status === 'Unsubmitted') return true;

    if (this.status === 'Error') return false;

    return true;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.$emit('login');
    const result = await Vue.$apiClient.login(this.form.username, this.form.password);
    if (result.type === 'success') {
      this.$emit('login-success', result.data);
    } else {
      this.$emit('login-error', result.error);
      this.status = 'Error';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  created(): void {
    // if (this.$store.state.username !== '') {
    //   this.$router.push('/dashboard');
    // }
  }
}
</script>
