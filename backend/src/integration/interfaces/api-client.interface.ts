export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * JSON-serializable request body type
 * Excludes functions, symbols, and undefined values
 */
export type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | JsonSerializable[]
  | { [key: string]: JsonSerializable };

export interface IApiClient {
  get<T = unknown>(
    path: string,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
  post<T = unknown>(
    path: string,
    data: JsonSerializable,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
  put<T = unknown>(
    path: string,
    data: JsonSerializable,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
  delete<T = unknown>(
    path: string,
    config?: Partial<ApiClientConfig>,
  ): Promise<ApiResponse<T>>;
}
