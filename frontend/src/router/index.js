import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AircraftList from '../views/AircraftList.vue'
import FlightsList from '../views/FlightsList.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

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
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})

export default router