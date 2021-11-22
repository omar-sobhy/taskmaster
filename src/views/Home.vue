<template>
  <div class="container">
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
      <log-in-component />
    </div>
    <div v-else class="pb-2 pt-2">
      <sign-up-component />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
