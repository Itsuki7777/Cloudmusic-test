import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import { Tabbar, TabbarItem } from "vant";
Vue.use(Tabbar).use(TabbarItem);
import { Search } from "vant";
Vue.use(Search);
import { Tab, Tabs } from 'vant';
Vue.use(Tab);
Vue.use(Tabs);
import { Swipe, SwipeItem } from "vant";
Vue.use(Swipe);
Vue.use(SwipeItem);
import { Popup } from "vant";
Vue.use(Popup);
import { Toast } from 'vant';
Vue.use(Toast);

import axios from "axios";
Vue.prototype.axios = axios;
axios.defaults.baseURL = '/api'

new Vue({
  router,
  store,
  render: h => h(App)  //把App放入容器中
}).$mount('#app')
