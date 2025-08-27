import { useAuthStore } from 'src/stores/auth-store';
import type { AuthPayload, Middleware, MiddlewareContext } from './types';
import { jwtDecode } from 'jwt-decode';

export class AuthMiddleware implements Middleware {
  name = 'auth';
  priority = 100;

  execute(context: MiddlewareContext) {
    const { to } = context;
    try {
      const authStore = useAuthStore();

      if (!to.meta?.requiresAuth) {
        return { isAuthenticated: false, to: { name: 'login', path: '/login', query: { redirect: to.fullPath } } };
      }

      if (!authStore.isAuthenticated || !authStore.accessToken) {
        return { isAuthenticated: false, to: { name: 'login', path: '/login', query: { redirect: to.fullPath } } };
      }

      const payload: AuthPayload = jwtDecode(authStore.accessToken);

      // Check role requirements
      if (to.meta?.requiresRole) {
        const requiredRoles = Array.isArray(to.meta.requiresRole) ? to.meta.requiresRole : [to.meta.requiresRole];
        if (!requiredRoles.includes(payload.role)) {
          return { isAuthenticated: false, to: { name: 'unauthorized', path: '/unauthorized' } };
        }

        // if (to.name === 'login') {
        //   to.path = to.meta?.requiresRole === 'admin' ? '/admin' : 'user';
        // }
      }

      // Check permission requirements
      if (to.meta?.requiresPermission) {
        const requiredPermissions = Array.isArray(to.meta.requiresPermission)
          ? to.meta.requiresPermission
          : [to.meta.requiresPermission];

        const hasPermission = requiredPermissions.some((permission) => payload.permissions?.includes(permission));

        if (!hasPermission) {
          return { isAuthenticated: false, to: { name: 'unauthorized', path: '/unauthorized' } };
        }
      }

      return { isAuthenticated: true, to: to };
    } catch (error) {
      return { isAuthenticated: false, to: { name: 'login', path: '/login', query: { redirect: to.fullPath } } };
    }
  }
}
export const authMiddleware = new AuthMiddleware();
