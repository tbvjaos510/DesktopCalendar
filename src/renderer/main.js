import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

// Vuikit 사용
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme/dist/vuikit.min.css'

// Vue-bus 사용
import VueBus from 'vue-bus'

// Vue-linkify 사용
import linkify from 'vue-linkify'

Vue.use(Vuikit)
Vue.use(VuikitIcons)
Vue.use(VueBus)

Vue.directive('linkified', linkify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  render: h => h(App),
  store,
  template: '<App/>'
}).$mount('#app')
