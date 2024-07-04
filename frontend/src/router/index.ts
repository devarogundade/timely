import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ExplorerView from '../views/ExplorerView.vue';
import ExplorerIdentifierView from '../views/ExplorerIdentifierView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/explorer',
      name: 'explorer',
      component: ExplorerView
    },
    {
      path: '/explorer/:id',
      name: 'explorer-identifier',
      component: ExplorerIdentifierView
    }]
});

export default router;
