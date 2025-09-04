import { Permission } from './permission';
import { Role } from './role';

export interface User {
  id?: number | null;
  username: string;
  password?: string | null;
  email?: string | null;
  phone?: string | null;
  roleId: number | null;
  percent: number | null;
  userKey?: string | null;
  balance?: number | null;
  callBackUrl?: string | null;
  isEnable: boolean | null;
  isDelete?: boolean | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  userPermissions?: any[] | null;
  roles?: Partial<Role> | null;
}

export interface UserRegister {
  username: string;
  email?: string | null;
  password: string;
  phone?: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  code: string;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: Partial<User> & { role: string; permissions: string[] };
  };
}
