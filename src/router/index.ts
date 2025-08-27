import { defineRouter } from '#q-app/wrappers';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import routes from './routes';
import { authMiddleware } from 'src/middlewares/auth.middleware';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Global navigation guard
  Router.beforeEach((to, from, next) => {
    try {
      const { isAuthenticated, to: nextTo } = authMiddleware.execute({ to, from, next });
      if (isAuthenticated) {
        next();
        return;
      } else if (to.name !== 'login') {
        next(nextTo);
        return;
      }
    } catch (error) {
      if (to.name !== 'login') {
        next({ path: '/login', query: { redirect: to.fullPath } });
      }
    }
  });

  return Router;
});
