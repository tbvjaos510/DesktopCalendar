import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

// Vuikit 사용
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme/dist/vuikit.min.css'
import 'uikit/dist/css/uikit.min.css'
// Vue-bus 사용
import VueBus from 'vue-bus'

// Vue-linkify 사용
import linkify from 'vue-linkify'

// DatePicker locale 설정
import { Settings } from 'luxon'

import Datetime from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'

// jQuery 사용
import $ from 'jquery'
window.$ = $

// datepicker Locale 설정
Settings.defaultLocale = 'ko'

// CurrentWindow 사용
var win = require('electron').remote.getCurrentWindow()

const enableMouse = function (e) {
  win.setIgnoreMouseEvents(false)
  console.log('enable')
}
const disableMouse = function (e) {
  if (e) {
    const pos = e.currentTarget.getBoundingClientRect()
    if ((e.clientX > pos.left && e.clientY > pos.top) && (e.clientX < pos.left + pos.width && e.clientY < pos.top + pos.height)) return true
  }
  win.setIgnoreMouseEvents(true, { forward: true })
  console.log('disable')
}
Vue.use(Vuikit)
Vue.use(VuikitIcons)
Vue.use(VueBus)
Vue.use(Datetime)
Vue.directive('linkified', linkify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.DevMode = Vue.prototype.DevMode = () => process.env.NODE_ENV === 'development'
Vue.setIgnore = Vue.prototype.setIgnore = enableMouse
Vue.disableIgnore = Vue.prototype.disableIgnore = disableMouse
/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  render: h => h(App),
  store,
  template: '<App/>'
}).$mount('#app')
