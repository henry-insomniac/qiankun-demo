import { createRouter, createWebHistory } from 'vue-router'
import Theme1 from '../views/Theme1.vue'
import Theme2 from '../views/Theme2.vue'
import Theme3 from '../views/Theme3.vue'

const routes = [
  {
    path: '/',
    redirect: '/theme1'
  },
  {
    path: '/theme1',
    name: 'Theme1',
    component: Theme1
  },
  {
    path: '/theme2',
    name: 'Theme2',
    component: Theme2
  },
  {
    path: '/theme3',
    name: 'Theme3',
    component: Theme3
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
