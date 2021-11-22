<template>
  <div id="app">
    <div id="loginContainer" v-if="this.$store.state.loggedIn">
      Logged in as {{ this.$store.state.username }} <a href="">(log out)</a><br>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>
    </div>
    <router-view />
  </div>
</template>

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
