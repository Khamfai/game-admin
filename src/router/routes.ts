import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    meta: {
      title: 'Home',
      layout: 'main',
    },
  },

  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
    meta: {
      title: 'Login',
      layout: 'main',
    },
  },

  {
    path: '/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
    meta: {
      title: 'Sign Up',
      layout: 'main',
    },
  },

  // Admin routes
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'admin',
      title: 'Admin Panel',
      layout: 'admin',
    },
    children: [
      {
        path: '',
        component: () => import('pages/admin/IndexPage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
    ],
  },

  // Unauthorized page
  {
    path: '/unauthorized',
    component: () => import('pages/UnauthorizedPage.vue'),
    meta: {
      title: 'Unauthorized',
      layout: 'main',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      title: 'Page Not Found',
      layout: 'main',
    },
  },
];

export default routes;
