import { VueConstructor } from 'vue';

import TaskmasterClient from 'taskmaster-client';

const Plugin = {
  install(Vue: VueConstructor, options: any): void {
    console.log(options);
    // eslint-disable-next-line no-restricted-globals
    const basePath = location.host.startsWith('localhost')
      ? 'http://localhost:3000'
      : 'http://omarsobhy.dev:3000';

    console.log('Base path', basePath);
    // eslint-disable-next-line no-param-reassign
    Vue.$apiClient = new TaskmasterClient(basePath, options);
  },
};

// eslint-disable-next-line import/prefer-default-export
export { Plugin };
