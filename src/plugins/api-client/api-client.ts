import { VueConstructor } from 'vue';

import TaskmasterClient from 'taskmaster-client';

const Plugin = {
  install(Vue: VueConstructor, options: any): void {
    console.log(options);
    const baseProtocol = window.location.protocol;

    const baseHost = window.location.host.startsWith('localhost')
      ? 'localhost'
      : 'omarsobhy.dev';

    const basePort = baseProtocol.startsWith('https') ? 3001 : 3000;

    const basePath = `${baseProtocol}//${baseHost}:${basePort}`;
    console.log('Base path', basePath);
    // eslint-disable-next-line no-param-reassign
    Vue.$apiClient = new TaskmasterClient(basePath, options);
  },
};

// eslint-disable-next-line import/prefer-default-export
export { Plugin };
