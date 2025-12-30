import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AircraftList from '../views/AircraftList.vue'
import FlightsList from '../views/FlightsList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/aircraft',
      name: 'aircraft',
      component: AircraftList
    },
    {
      path: '/flights',
      name: 'flights',
      component: FlightsList
    }
  ]
})

export default router