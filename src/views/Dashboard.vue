<template>
  <div class="container">
    <div class="row">
      <div class="col" id="info">
        <h1>Welcome {{ this.$store.state.username }}</h1>
        <h2>{{ date }}</h2>
        <h2>{{ time }}</h2>
      </div>

      <div class="col" id="messageOfTheDay">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import moment from 'moment';

@Component
export default class Dashboard extends Vue {
  date = moment().format('DD MM YYYY')

  time = moment().format('h:mm:ss')

  mounted(): void {
    setInterval(() => {
      this.time = moment().format('h:mm:ss');
    }, 1000);
  }
}
</script>

<style scoped>
#info {
  align-items: right;
  border-right: 1px solid black;
}
</style>
