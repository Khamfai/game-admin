export interface User {
  id: number;
  username: string;
  email?: string | null;
  phone?: string | null;
  roleId: number;
  percent: number;
  userKey?: string | null;
  balance: number;
  callBackUrl?: string | null;
  isEnable: boolean;
  isDelete: boolean;
  createdAt?: number | null;
  updatedAt?: number | null;
  role?: string | null;
  permissions?: string[] | null;
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
  code: number;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: Partial<User> & { role: string; permissions: string[] };
  };
}
