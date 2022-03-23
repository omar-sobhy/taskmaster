import { VueConstructor } from 'vue';

import TaskmasterClient from 'taskmaster-client';

const Plugin = {
  install(Vue: VueConstructor, options: any): void {
    console.log(options);
    // eslint-disable-next-line no-param-reassign
    Vue.$apiClient = new TaskmasterClient('http://localhost:3000', options);
  },
};

// eslint-disable-next-line import/prefer-default-export
export { Plugin };
