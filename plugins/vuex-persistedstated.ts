// plugins/vuex-persistedstate.ts
import { Plugin } from '@nuxt/types';
import createPersistedState from 'vuex-persistedstate';

const vuexPersistedState: Plugin = ({ store }) => {
  createPersistedState({
    key: 'virtualaccount',
    paths: ['activeVABank', 'activeVABankResponse'],
  })(store);
};

export default vuexPersistedState;
