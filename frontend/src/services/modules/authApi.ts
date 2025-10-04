import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { AuthResponse, User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthApi {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(userData: RegisterData): Promise<{ user: User }>;
  verifyToken(): Promise<User>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthResponse>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

class AuthApiImpl implements AuthApi {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiInstance.post<ApiResponse<AuthResponse>>(
      `${API_ENDPOINTS.AUTH}/login`,
      credentials
    );
    return extractApiData(response);
  }

  async register(userData: RegisterData): Promise<{ user: User }> {
    const response = await apiInstance.post<ApiResponse<{ user: User }>>(
      `${API_ENDPOINTS.AUTH}/register`,
      userData
    );
    return extractApiData(response);
  }

  async verifyToken(): Promise<User> {
    const response = await apiInstance.get<ApiResponse<User>>(
      `${API_ENDPOINTS.AUTH}/verify`
    );
    return extractApiData(response);
  }

  async logout(): Promise<void> {
    await apiInstance.post(`${API_ENDPOINTS.AUTH}/logout`);
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiInstance.post<ApiResponse<AuthResponse>>(
      `${API_ENDPOINTS.AUTH}/refresh`
    );
    return extractApiData(response);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiInstance.post(`${API_ENDPOINTS.AUTH}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiInstance.post(`${API_ENDPOINTS.AUTH}/request-reset`, { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiInstance.post(`${API_ENDPOINTS.AUTH}/reset-password`, {
      token,
      newPassword,
    });
  }
}

export const authApi = new AuthApiImpl();
