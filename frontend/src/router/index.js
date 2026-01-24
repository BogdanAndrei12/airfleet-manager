import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../config/firebase'
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
      component: AircraftList,
      meta: { requiresAuth: true }
    },
    {
      path: '/flights',
      name: 'flights',
      component: FlightsList,
      meta: { requiresAuth: true }
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

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router