import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Trackmania from '@/views/Trackmania.vue'
import BallGame from '@/views/BallGame.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/trackmania',
      name: 'trackmania',
      component: Trackmania
    },
    {
      path: '/ball-game',
      name: 'ball-game',
      component: BallGame
    }
  ]
})

export default router
