import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/main',
      name: 'Main-page',
      component: require('@/components/Main').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
