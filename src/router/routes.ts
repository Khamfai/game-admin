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
      {
        path: 'roles',
        component: () => import('pages/admin/manages/RolePage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
      {
        path: 'permissions',
        component: () => import('pages/admin/manages/PermissionPage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
      {
        path: 'providers',
        component: () => import('pages/admin/manages/ProviderPage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
      {
        path: 'services',
        component: () => import('pages/admin/manages/ServicePage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
      {
        path: 'packages',
        component: () => import('pages/admin/manages/PackagePage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
      {
        path: 'topups',
        component: () => import('pages/admin/transactions/TopupPage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
      {
        path: 'transactions',
        component: () => import('pages/admin/transactions/TransactionPage.vue'),
        meta: {
          requiresPermission: ['all'],
        },
      },
    ],
  },

  // Auth routes
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: {
      title: 'Login',
    },
  },

  {
    path: '/signup',
    component: () => import('pages/SignupPage.vue'),
    meta: {
      title: 'Sign Up',
    },
  },

  // Unauthorized page
  {
    path: '/unauthorized',
    component: () => import('pages/UnauthorizedPage.vue'),
    meta: {
      title: 'Unauthorized',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      title: 'Page Not Found',
    },
  },
];

export default routes;
