import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_CONFIG } from '../constants/config';
import { API_ENDPOINTS } from '../constants/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'NURSE' | 'STAFF' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'COUNSELOR' | 'VIEWER';
  permissions: string[];
  schoolId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const responseData = await response.json();

          // Backend returns { success: true, data: { user, token } }
          const { user, token } = responseData.data || responseData;

          // Store token directly in localStorage for axios interceptor compatibility
          if (token) {
            localStorage.setItem('auth_token', token);
          }

          // Store user object separately for Cypress tests that check localStorage.user.role
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }

          set({
            user: user,
            token: token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Clear all storage locations
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`;
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false, token: null });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, token: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state: any) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
