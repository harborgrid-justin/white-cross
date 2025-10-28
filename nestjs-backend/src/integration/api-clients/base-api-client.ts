import { Injectable, Logger } from '@nestjs/common';
import { IApiClient, ApiClientConfig, ApiResponse } from '../interfaces/api-client.interface';

@Injectable()
export class BaseApiClient implements IApiClient {
  private readonly logger = new Logger(BaseApiClient.name);

  constructor(private readonly config: ApiClientConfig) {}

  async get<T = any>(
    path: string,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, config);
  }

  async post<T = any>(
    path: string,
    data: any,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data, config);
  }

  async put<T = any>(
    path: string,
    data: any,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data, config);
  }

  async delete<T = any>(
    path: string,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, config);
  }

  private async request<T>(
    method: string,
    path: string,
    data?: any,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>> {
    const mergedConfig = { ...this.config, ...config };
    const url = `${mergedConfig.baseUrl}${path}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...mergedConfig.headers,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    let lastError: Error | null = null;
    const maxAttempts = (mergedConfig.retryAttempts || 0) + 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        return {
          data: responseData as T,
          status: response.status,
          headers,
        };
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Request attempt ${attempt + 1}/${maxAttempts} failed: ${error}`,
        );

        if (attempt < maxAttempts - 1) {
          await this.delay(mergedConfig.retryDelay || 1000);
        }
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
