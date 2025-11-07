export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface IApiClient {
  get<T = any>(
    path: string,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
  post<T = any>(
    path: string,
    data: any,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
  put<T = any>(
    path: string,
    data: any,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
  delete<T = any>(
    path: string,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
}
