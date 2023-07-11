import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Dashboard from '../views/DashboardView.vue';
import Project from '../views/ProjectView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/projects/:projectId',
      name: 'project',
      component: () => import('../views/ProjectView.vue'),
    },
  ],
});

export default router;
