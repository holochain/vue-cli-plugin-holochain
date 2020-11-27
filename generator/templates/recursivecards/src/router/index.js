import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cards',
    name: '',
    component: () => import('@/layouts/basic/Index.vue'),
    children: [
      {
        path: '',
        name: 'Cards',
        component: () => import('@/views/cards/Index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
