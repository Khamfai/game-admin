import { useAuthStore, type AuthTokens } from 'src/stores/auth-store';
import { LoginCredentials, LoginResponse, UserRegister } from '../interfaces/user';
import { api } from 'src/boot/axios';
import useProfileStore from 'src/stores/profile-store';
const authStore = useAuthStore();
const profileStore = useProfileStore();
const version = '/v1';

export const auth_service = () => ({
  register: async (body: UserRegister): Promise<any> => {
    try {
      const { status, data } = await api.post(`${version}/register`, { data: body });
      return data;
    } catch (error) {
      throw new Error('Register failed: ' + (error as Error).message);
    }
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const { status, data } = await api.post<LoginResponse>(`${version}/login`, credentials);

      // Store tokens
      const tokens: AuthTokens = {
        accessToken: data.data.token,
        refreshToken: data.data.refreshToken || null,
      };

      authStore.setTokens(tokens);
      profileStore.setProfile(data.data.user);

      return data;
    } catch (error) {
      throw new Error('Login failed: ' + (error as Error).message);
    }
  },

  logout: async (): Promise<void> => {
    try {
      const { status, data } = await api.post(`${version}/logout`);
      if (status === 200 && data.status === 'success') {
        authStore.logout();
      }
      return data;
    } catch (error) {
      throw new Error('Logout failed: ' + (error as Error).message);
    }
  },

  refreshToken: async (): Promise<string> => {
    try {
      return await authStore.refreshAccessToken();
    } catch (error) {
      throw new Error('Token refresh failed: ' + (error as Error).message);
    }
  },

  getUserProfile: async () => {
    try {
      return await api.get(`${version}/profile`);
    } catch (error) {
      throw new Error('Failed to get user profile: ' + (error as Error).message);
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      return await api.post(`${version}/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw new Error('Failed to change password: ' + (error as Error).message);
    }
  },
});
