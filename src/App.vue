<template>
  <div>
    <div id="loginContainer" v-if="this.$store.state.username !== ''">
      Logged in as {{ this.$store.state.username }}
      <a href="" @click.prevent="logout">
        (log out)
      </a>
      <br>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

// for some reason using vue-property-decorator here
// doesn't work -- `this` is null in the template
export default Vue.extend({
  methods: {
    logout() {
      this.$cookies.remove('state');
      this.$store.commit('logout');
      if (this.$route.name !== 'Home') {
        this.$router.push('/');
      }
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#loginContainer {
  padding-top: 30px;
  padding-left: 30px;
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
