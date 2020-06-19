import './set-public-path';
import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import VueCompositionApi from '@vue/composition-api';
import { printLog } from '@/utils';
import App from './App.vue';

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true;
}

const provide = {
  useSingleSpa: Boolean((window as any).singleSpaNavigate),
};

// ============= 非 single-spa 单独启动 =============
if (!(window as any).singleSpaNavigate) {
  new Vue({
    provide,
    render: (h: any) => h(App),
  }).$mount('#clock');
}

// ============= single-spa 模式启动 =============
const vueLifeCycles = singleSpaVue({
  Vue,
  appOptions: {
    provide,
    el: '#app-clock',
    render: (h: any) => h(App),
  },
});

// 主应用使用 Parcel 方式手动挂载
export const name = 'parcel-clock';

export function bootstrap(props: any) {
  printLog('vue-clock', 'single-spa 模式', 'primary');
  return vueLifeCycles.bootstrap(props);
}

export function mount(props: object) {
  console.log('mount: ', props);
  return vueLifeCycles.mount(props);
}

export function unmount(props: object) {
  return vueLifeCycles.unmount(props);
}
