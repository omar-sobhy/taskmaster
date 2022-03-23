// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';

import TaskmasterClient from 'taskmaster-client';

declare module 'vue/types/vue' {
  interface VueConstructor {
    // eslint-disable-next-line camelcase
    $apiClient: TaskmasterClient
  }
}
