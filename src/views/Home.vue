<template>
  <div>
    <div class="container card" v-if="!this.$cookies.get('state')">
      <div class="row" id="header">
        <div class="col"
          v-bind:class="{ inactive: activeColumn !== 0 }"
          v-on:click="activeColumn = 0"
        >Log in</div>
        <div class="col"
          v-bind:class="{ inactive: activeColumn !== 1 }"
          v-on:click="activeColumn = 1"
        >Sign up</div>
      </div>

      <div v-if="activeColumn === 0" class="pb-2 pt-2">
        <log-in-component
          @login='handleLogin'
          @login-success='handleLoginSuccess'
          @login-error='handleLoginError'
        />
      </div>
      <div v-else class="pb-2 pt-2">
        <sign-up-component />
      </div>
    </div>
    <div class="container" style="text-align: center;" v-else>
      You are logged in! Click on Dashboard to continue.
    </div>
    <b-modal
      id="loading-modal"
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      hide-header-close
      centered
    >
      <b-container style="background: white;">
        <b-spinner label="Loading spinner"/>
      </b-container>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from 'taskmaster-client';
import SignUpComponent from '../components/SignUpComponent.vue';
import LogInComponent from '../components/LogInComponent.vue';

@Component({
  components: {
    SignUpComponent,
    LogInComponent,
  },
})
export default class Home extends Vue {
  activeColumn = 0

  handleLogin(): void {
    this.$bvModal.show('loading-modal');
  }

  handleLoginSuccess(user: User): void {
    this.$store.commit('setLoggedInUser', user);
    this.$cookies.set('state', this.$store.state);

    this.$router.push('/dashboard');
    this.$bvModal.hide('loading-modal');
  }

  handleLoginError(): void {
    this.$bvModal.hide('loading-modal');
  }
}
</script>

<style scoped>
.container {
  background: #C4C4C4;
}

.inactive {
  background: #DDDDDD;
}

#header {
  cursor: pointer;
}
</style>
