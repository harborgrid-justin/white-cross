/**
 * API Client Helper for Playwright Tests
 * Provides utilities for making authenticated API requests
 */

import { APIRequestContext } from '@playwright/test';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiClient {
  private token: string | null = null;

  constructor(private request: APIRequestContext, private baseURL: string) {}

  /**
   * Login and store authentication token
   */
  async login(email: string, password: string): Promise<string> {
    const response = await this.request.post(`${this.baseURL}/api/auth/login`, {
      data: {
        email,
        password,
      },
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }

    const body = await response.json();
    this.token = body.data?.token || body.token;
    
    if (!this.token) {
      throw new Error('No token received from login response');
    }

    return this.token;
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('No authentication token available. Please login first.');
    }
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make authenticated GET request
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.request.get(`${this.baseURL}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });

    const body = await response.json();
    return {
      success: response.ok(),
      data: body.data || body,
      error: body.error,
      message: body.message,
    };
  }

  /**
   * Make authenticated POST request
   */
  async post<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers: this.getAuthHeaders(),
      data,
    });

    const body = await response.json();
    return {
      success: response.ok(),
      data: body.data || body,
      error: body.error,
      message: body.message,
    };
  }

  /**
   * Make authenticated PUT request
   */
  async put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      headers: this.getAuthHeaders(),
      data,
    });

    const body = await response.json();
    return {
      success: response.ok(),
      data: body.data || body,
      error: body.error,
      message: body.message,
    };
  }

  /**
   * Make authenticated DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });

    const body = await response.json();
    return {
      success: response.ok(),
      data: body.data || body,
      error: body.error,
      message: body.message,
    };
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.token = null;
  }
}
