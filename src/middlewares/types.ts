import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

export interface MiddlewareContext {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
}

export interface MiddlewareResult {
  isAuthenticated: boolean;
  to: RouteLocationRaw;
}

export interface Middleware {
  name: string;
  execute: (context: MiddlewareContext) => Promise<MiddlewareResult> | MiddlewareResult;
  priority?: number;
}

export interface RouteMeta {
  requiresAuth?: boolean;
  requiresGuest?: boolean;
  requiresRole?: string | string[];
  requiresPermission?: string | string[];
  middleware?: string | string[];
  redirectTo?: string;
  title?: string;
  layout?: string;
}

export interface AuthPayload {
  uid: number;
  role: string;
  permissions: string[];
  exp: number;
}
