import type Client from 'taskmaster-client';

declare module 'vue' {
  interface ComponentCustomProperties {
    $apiClient: Client;
  }
}
