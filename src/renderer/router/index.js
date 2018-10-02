import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/',
      name: 'MainPage',
      component: require('@/views/Main').default
    },
    {
      path: '/setting',
      name: 'SettingPage',
      component: require('@/views/Setting').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
