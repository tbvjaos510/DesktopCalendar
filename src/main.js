import "@vuikit/theme/dist/vuikit.min.css";
import "uikit/dist/css/uikit.min.css";
import "vue-datetime/dist/vue-datetime.css";
import VuikitIcons from "@vuikit/icons";
import axios from "axios";
import $ from "jquery";
import { Settings } from "luxon";
import Vue from "vue";
import VueBus from "vue-bus";
import Datetime from "vue-datetime";
import linkify from "vue-linkify";
import Vuikit from "vuikit";

import App from "./App";
import router from "./router";
import store from "./store";

window.$ = $;

// datepicker Locale 설정
Settings.defaultLocale = "ko";

// CurrentWindow 사용
const win = require("electron").remote.getCurrentWindow();
const app = require("electron").remote.app;
const enableMouse = function(e) {
  win.setIgnoreMouseEvents(false);
};
const disableMouse = function(e) {
  if (e) {
    const pos = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX > pos.left &&
      e.clientY > pos.top &&
      e.clientX < pos.left + pos.width &&
      e.clientY < pos.top + pos.height
    )
      return true;
  }
  win.setIgnoreMouseEvents(true, { forward: true });
};
Vue.use(Vuikit);
Vue.use(VuikitIcons);
Vue.use(VueBus);
Vue.use(Datetime);
Vue.directive("linkified", linkify);

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.DevMode = Vue.prototype.DevMode = () =>
  process.env.NODE_ENV === "development";
Vue.setIgnore = Vue.prototype.setIgnore = enableMouse;
Vue.disableIgnore = Vue.prototype.disableIgnore = disableMouse;
window.appdata = Vue.appdata = Vue.prototype.appdata = app.getPath("userData");
/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  render: h => h(App),
  store,
  template: "<App/>"
}).$mount("#app");
