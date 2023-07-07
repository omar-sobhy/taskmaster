import { type App } from 'vue';

import TaskmasterClient from 'taskmaster-client';

const ApiClient = {
  install(app: App, options: any): void {
    console.log(options);
    const baseProtocol = window.location.protocol;

    const baseHost = window.location.host.startsWith('localhost') ? 'localhost' : 'omarsobhy.dev';

    const basePort = baseProtocol.startsWith('https') ? 3001 : 3000;

    const basePath = `${baseProtocol}//${baseHost}:${basePort}`;
    console.log('Base path', basePath);

    app.config.globalProperties.$apiClient = new TaskmasterClient(basePath, options);
  },
};

// eslint-disable-next-line import/prefer-default-export
export { ApiClient };

export default ApiClient;
