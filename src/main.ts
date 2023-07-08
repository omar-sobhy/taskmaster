import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'fontawesome-free/css/all.min.css';
import '@vuepic/vue-datepicker/dist/main.css';

import { createApp, h } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useCookies } from 'vue3-cookies';
import Client from 'taskmaster-client';
import { useUserStore } from './stores/user';
import { Modal } from 'bootstrap';
import { useErrorStore } from './stores/error';

function makeClient(options: { authorizationCookie?: string }) {
  const baseProtocol = window.location.protocol;

  const baseHost = window.location.host.startsWith('localhost') ? 'localhost' : 'omarsobhy.dev';

  const basePort = baseProtocol.startsWith('https') ? 3001 : 3000;

  const basePath = `${baseProtocol}//${baseHost}:${basePort}`;
  console.log('Base path', basePath);

  return new Client(basePath, options);
}

const app = createApp({
  created() {
    const { cookies } = useCookies();

    const username = cookies.get('username');

    if (username) {
      const store = useUserStore();

      store.username = username;
    }

    const client = makeClient({
      authorizationCookie: cookies.get('Authorization'),
    });

    app.provide('$apiClient', client);

    app.provide('showError', (message: string) => {
      const el = document.querySelector('#error-modal');

      const errorStore = useErrorStore();
      errorStore.message = message;
      if (!el) {
        alert('An error occurred.');
      } else {
        const modal = Modal.getOrCreateInstance(el);
        modal.show();
      }
    });
  },
  render() {
    return h(App);
  },
});

app.use(createPinia());
app.use(router);

app.mount('#app');
