import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useErrorStore = defineStore('user', () => {
  const message = ref('');

  return { message };
});
