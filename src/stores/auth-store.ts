import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { User } from 'src/interfaces/user';
import { ref, computed } from 'vue';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
  userAuth?: {
    uid: number;
    role: string;
    permissions: string[];
  } | null;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const userAuth = ref<{
    uid: number;
    role: string;
    permissions: string[];
  } | null>(null);
  const isRefreshing = ref(false);
  const refreshSubscribers = ref<Array<(token: string) => void>>([]);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value);
  const isTokenExpired = computed(() => {
    if (!accessToken.value) return true;
    const payload = jwtDecode(accessToken.value);
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  });

  // Actions
  const setTokens = (tokens: AuthTokens) => {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken || null;
    userAuth.value = getUser();

    // Store in localStorage
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken || '');
  };

  const getUser = () => {
    if (!accessToken.value) return null;

    if (!userAuth.value) {
      const decoded = jwtDecode(accessToken.value);
      userAuth.value = decoded as {
        uid: number;
        role: string;
        permissions: string[];
      };
    }

    return userAuth.value;
  };

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;

    // Clear from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const loadTokensFromStorage = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && storedRefreshToken) {
      accessToken.value = storedAccessToken;
      refreshToken.value = storedRefreshToken;
      getUser();
    }
  };

  const refreshAccessToken = async (): Promise<string> => {
    if (isRefreshing.value) {
      // If already refreshing, wait for the current refresh to complete
      return new Promise((resolve) => {
        refreshSubscribers.value.push(resolve);
      });
    }

    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    isRefreshing.value = true;

    try {
      const response = await fetch('/api/auth/ref-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newTokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken.value,
      };

      setTokens(newTokens);

      // Resolve all waiting subscribers
      refreshSubscribers.value.forEach((resolve) => resolve(newTokens.accessToken));
      refreshSubscribers.value = [];

      return newTokens.accessToken;
    } catch (error) {
      // Clear tokens on refresh failure
      clearTokens();
      throw error;
    } finally {
      isRefreshing.value = false;
    }
  };

  const logout = () => {
    clearTokens();
    // Additional logout logic can be added here
  };

  // Initialize tokens from storage
  loadTokensFromStorage();

  return {
    // State
    accessToken,
    refreshToken,
    isRefreshing,
    userAuth,

    // Getters
    isAuthenticated,
    isTokenExpired,

    // Actions
    setTokens,
    clearTokens,
    loadTokensFromStorage,
    refreshAccessToken,
    logout,
    getUser,
  };
});
