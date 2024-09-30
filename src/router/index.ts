import { createRouter, createWebHistory } from 'vue-router'
import ClubsView from '../views/ClubsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'clubs',
      component: ClubsView
    },
    {
      path: '/clubs/:id',
      name: 'club-detail',
      component: () => import('../views/ClubDetailView.vue'),
    },
    {
      path: '/trainers',
      name: 'trainers',
      component: () => import('../views/TrainersView.vue')
    },
    {
      path: '/trainers/:id',
      name: 'trainer-detail',
      component: () => import('../views/TrainerDetailView.vue'),
    },
    {
      path: '/areas',
      name: 'areas',
      component: () => import('../views/AreasView.vue')
    },
    {
      path: '/areas/:id',
      name: 'area-detail',
      component: () => import('../views/AreaDetailView.vue'),
    },
  ]
})

export default router
