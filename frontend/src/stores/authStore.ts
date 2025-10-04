import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApi, User, LoginCredentials, RegisterData } from '../services/modules/authApi';
import toast from 'react-hot-toast';
import moment from 'moment';
import debug from 'debug';

const log = debug('whitecross:auth-store');

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authApi.login(credentials);

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success(`Welcome back, ${response.user.firstName}!`);
          } catch (error: any) {
            const errorMessage = error.message || 'Login failed';

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });

            toast.error(errorMessage);
            throw error;
          }
        },

        register: async (userData: RegisterData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authApi.register(userData);

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success(`Welcome, ${response.user.firstName}! Your account has been created.`);
          } catch (error: any) {
            const errorMessage = error.message || 'Registration failed';

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });

            toast.error(errorMessage);
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });

          try {
            await authApi.logout();

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });

            toast.success('You have been logged out successfully');
          } catch (error: any) {
            // Even if server logout fails, clear local state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });

            toast.success('You have been logged out successfully');
          }
        },

        refreshUser: async () => {
          try {
            const user = await authApi.verifyToken();

            set({
              user,
              isAuthenticated: true,
              error: null,
            });
          } catch (error: any) {
            // If token verification fails, logout user
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            });

            // Don't show toast for silent refresh failures
            console.warn('Token verification failed during refresh');
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user,
            error: null,
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Selectors for common state access
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Action hooks for easier component usage
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  refreshUser: state.refreshUser,
  clearError: state.clearError,
  setUser: state.setUser,
}));
