import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

// // Vuetify 사용
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Vuikit 사용
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme/dist/vuikit.min.css'

// JQuery
// import $ from 'jquery'
// window.$ = global.$ = $

// Vue-jquery
// import vuejquery from 'vue-jquery'

// Dayspan-vuetify 사용
// import DaySpanVuetify from 'dayspan-vuetify'

// Vue-Fullcalendar 사용
// import fullCalendar from 'vue-full-calendar'
// Vue.use(fullCalendar)

// Vue.use(vuejquery)

Vue.use(Vuikit)
Vue.use(VuikitIcons)
// Vue.use(Vuetify)
// Vue.use(DaySpanVuetify)
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
