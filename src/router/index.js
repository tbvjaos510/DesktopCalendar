import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "MainPage",
      component: () => import("../views/Main.vue")
    },
    {
      path: "/setting",
      name: "SettingPage",
      component: () => import("../views/Setting.vue")
    },
    {
      path: "/setup",
      name: "SetupPage",
      component: () => import("../views/Setup.vue")
    }
  ]
});
