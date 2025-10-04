import { apiInstance, API_ENDPOINTS, tokenUtils, API_CONFIG } from '../config/apiConfig';
import { z } from 'zod';
import moment from 'moment';
import debug from 'debug';

const log = debug('whitecross:auth-api');

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'NURSE' | 'STAFF';
  schoolId?: string;
  isActive: boolean;
  permissions?: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'NURSE' | 'STAFF';
  schoolId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'NURSE', 'STAFF']),
  schoolId: z.string().optional(),
});

// Auth API class
export class AuthApi {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      loginSchema.parse(credentials);

      const response = await apiInstance.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const { user, token, refreshToken } = response.data;

      // Store tokens
      tokenUtils.setToken(token);
      tokenUtils.setRefreshToken(refreshToken);

      return response.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      registerSchema.parse(userData);

      const response = await apiInstance.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      const { user, token, refreshToken } = response.data;

      // Store tokens
      tokenUtils.setToken(token);
      tokenUtils.setRefreshToken(refreshToken);

      return response.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Verify current token validity
   */
  async verifyToken(): Promise<User> {
    try {
      const response = await apiInstance.post<{ user: User }>(
        API_ENDPOINTS.AUTH.VERIFY
      );

      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiInstance.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      const { token, refreshToken: newRefreshToken } = response.data;

      // Update stored tokens
      tokenUtils.setToken(token);
      tokenUtils.setRefreshToken(newRefreshToken);

      return response.data;
    } catch (error: any) {
      // Clear tokens on refresh failure
      tokenUtils.clearAll();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local logout even if server request fails
      console.warn('Server logout failed, continuing with local logout');
    } finally {
      // Always clear local tokens
      tokenUtils.clearAll();
    }
  }

  /**
   * Get current user from session
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiInstance.get('/auth/me');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  /**
   * Google OAuth login
   */
  async loginWithGoogle(): Promise<void> {
    window.location.href = `${API_CONFIG.BASE_URL.replace('/api', '')}/api/auth/google`;
  }

  /**
   * Microsoft OAuth login
   */
  async loginWithMicrosoft(): Promise<void> {
    window.location.href = `${API_CONFIG.BASE_URL.replace('/api', '')}/api/auth/microsoft`;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiInstance.post<{ message: string }>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await apiInstance.post<{ message: string }>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, password }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = tokenUtils.getToken();
    return !!token;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    try {
      const token = tokenUtils.getToken();
      if (!token) return true;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

// Export singleton instance
export const authApi = new AuthApi();
