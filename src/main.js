import Vue from 'vue'
import App from './app.vue'
import Multiselect from 'vue-multiselect'

// register globally
Vue.component('multiselect', Multiselect);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
