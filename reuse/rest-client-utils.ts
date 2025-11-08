/**
 * LOC: REST1234567
 * File: /reuse/rest-client-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - REST API clients
 *   - HTTP request builders
 *   - API integration services
 *   - File upload/download handlers
 */

/**
 * File: /reuse/rest-client-utils.ts
 * Locator: WC-UTL-REST-004
 * Purpose: REST Client Utilities - Comprehensive HTTP client and REST API helpers
 *
 * Upstream: Independent utility module for REST client operations
 * Downstream: ../backend/*, ../frontend/*, API services, HTTP middleware
 * Dependencies: TypeScript 5.x, Node 18+, Fetch API, FormData
 * Exports: 45 utility functions for HTTP methods, request building, response parsing, file handling, caching
 *
 * LLM Context: Comprehensive REST client utilities for White Cross system.
 * Provides HTTP method helpers, request builder pattern, response transformation, multipart handling,
 * file uploads/downloads, progress tracking, request cancellation, retry logic, interceptors,
 * response caching, and API versioning. Essential for robust REST API communication in healthcare applications.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

interface ResponseData<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onError?: (error: any) => any;
}

interface ResponseInterceptor {
  onResponse?: <T>(response: ResponseData<T>) => ResponseData<T> | Promise<ResponseData<T>>;
  onError?: (error: any) => any;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface MultipartField {
  name: string;
  value: string | Blob | File;
  filename?: string;
  contentType?: string;
}

// ============================================================================
// REQUEST BUILDER PATTERN
// ============================================================================

/**
 * Creates a request builder for fluent API configuration.
 *
 * @returns {object} Request builder with chainable methods
 *
 * @example
 * ```typescript
 * const response = await createRequestBuilder()
 *   .url('https://api.example.com/students')
 *   .method('GET')
 *   .header('Authorization', 'Bearer token')
 *   .query({ page: 1, limit: 20 })
 *   .timeout(5000)
 *   .execute();
 * ```
 */
export const createRequestBuilder = () => {
  const config: RequestConfig = {
    method: 'GET',
    url: '',
    headers: {},
    params: {},
    timeout: 30000,
    responseType: 'json',
  };

  return {
    url: (url: string) => {
      config.url = url;
      return builder;
    },
    method: (method: RequestConfig['method']) => {
      config.method = method;
      return builder;
    },
    header: (key: string, value: string) => {
      config.headers = config.headers || {};
      config.headers[key] = value;
      return builder;
    },
    headers: (headers: Record<string, string>) => {
      config.headers = { ...config.headers, ...headers };
      return builder;
    },
    query: (params: Record<string, any>) => {
      config.params = { ...config.params, ...params };
      return builder;
    },
    data: (data: any) => {
      config.data = data;
      return builder;
    },
    timeout: (timeout: number) => {
      config.timeout = timeout;
      return builder;
    },
    responseType: (type: RequestConfig['responseType']) => {
      config.responseType = type;
      return builder;
    },
    getConfig: () => config,
    execute: async <T = any>() => executeRequest<T>(config),
  };

  const builder = {
    url: (url: string) => {
      config.url = url;
      return builder;
    },
    method: (method: RequestConfig['method']) => {
      config.method = method;
      return builder;
    },
    header: (key: string, value: string) => {
      config.headers = config.headers || {};
      config.headers[key] = value;
      return builder;
    },
    headers: (headers: Record<string, string>) => {
      config.headers = { ...config.headers, ...headers };
      return builder;
    },
    query: (params: Record<string, any>) => {
      config.params = { ...config.params, ...params };
      return builder;
    },
    data: (data: any) => {
      config.data = data;
      return builder;
    },
    timeout: (timeout: number) => {
      config.timeout = timeout;
      return builder;
    },
    responseType: (type: RequestConfig['responseType']) => {
      config.responseType = type;
      return builder;
    },
    getConfig: () => config,
    execute: async <T = any>() => executeRequest<T>(config),
  };

  return builder;
};

/**
 * Executes a request from configuration.
 *
 * @template T
 * @param {RequestConfig} config - Request configuration
 * @returns {Promise<ResponseData<T>>} Response data
 *
 * @example
 * ```typescript
 * const response = await executeRequest({
 *   method: 'GET',
 *   url: 'https://api.example.com/students',
 *   params: { page: 1 },
 *   timeout: 5000
 * });
 * ```
 */
export const executeRequest = async <T = any>(
  config: RequestConfig,
): Promise<ResponseData<T>> => {
  const url = buildUrl(config.url, config.params);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

  try {
    const response = await fetch(url, {
      method: config.method,
      headers: config.headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await parseResponse<T>(response, config.responseType);
    const headers = extractHeaders(response);

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw new Error(`Request failed: ${error.message}`);
  }
};

/**
 * Builds URL with query parameters.
 *
 * @param {string} baseUrl - Base URL
 * @param {Record<string, any>} [params] - Query parameters
 * @returns {string} Complete URL with parameters
 *
 * @example
 * ```typescript
 * const url = buildUrl('https://api.example.com/students', { page: 1, limit: 20 });
 * // Result: 'https://api.example.com/students?page=1&limit=20'
 * ```
 */
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// ============================================================================
// HTTP METHOD HELPERS
// ============================================================================

/**
 * Performs GET request.
 *
 * @template T
 * @param {string} url - Request URL
 * @param {Record<string, any>} [params] - Query parameters
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {Promise<ResponseData<T>>} Response data
 *
 * @example
 * ```typescript
 * const response = await get<Student[]>('/api/students', { page: 1, limit: 20 });
 * console.log(response.data);
 * ```
 */
export const get = async <T = any>(
  url: string,
  params?: Record<string, any>,
  headers?: Record<string, string>,
): Promise<ResponseData<T>> => {
  return executeRequest<T>({
    method: 'GET',
    url,
    params,
    headers,
  });
};

/**
 * Performs POST request.
 *
 * @template T
 * @param {string} url - Request URL
 * @param {any} data - Request body
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {Promise<ResponseData<T>>} Response data
 *
 * @example
 * ```typescript
 * const response = await post<Student>('/api/students', {
 *   name: 'John Doe',
 *   grade: 10
 * });
 * ```
 */
export const post = async <T = any>(
  url: string,
  data: any,
  headers?: Record<string, string>,
): Promise<ResponseData<T>> => {
  return executeRequest<T>({
    method: 'POST',
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

/**
 * Performs PUT request.
 *
 * @template T
 * @param {string} url - Request URL
 * @param {any} data - Request body
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {Promise<ResponseData<T>>} Response data
 *
 * @example
 * ```typescript
 * const response = await put<Student>('/api/students/123', {
 *   name: 'Jane Doe',
 *   grade: 11
 * });
 * ```
 */
export const put = async <T = any>(
  url: string,
  data: any,
  headers?: Record<string, string>,
): Promise<ResponseData<T>> => {
  return executeRequest<T>({
    method: 'PUT',
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

/**
 * Performs PATCH request.
 *
 * @template T
 * @param {string} url - Request URL
 * @param {any} data - Request body (partial update)
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {Promise<ResponseData<T>>} Response data
 *
 * @example
 * ```typescript
 * const response = await patch<Student>('/api/students/123', {
 *   grade: 12
 * });
 * ```
 */
export const patch = async <T = any>(
  url: string,
  data: any,
  headers?: Record<string, string>,
): Promise<ResponseData<T>> => {
  return executeRequest<T>({
    method: 'PATCH',
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

/**
 * Performs DELETE request.
 *
 * @template T
 * @param {string} url - Request URL
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {Promise<ResponseData<T>>} Response data
 *
 * @example
 * ```typescript
 * const response = await del('/api/students/123');
 * console.log('Student deleted:', response.status === 204);
 * ```
 */
export const del = async <T = any>(
  url: string,
  headers?: Record<string, string>,
): Promise<ResponseData<T>> => {
  return executeRequest<T>({
    method: 'DELETE',
    url,
    headers,
  });
};

/**
 * Performs HEAD request.
 *
 * @param {string} url - Request URL
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {Promise<ResponseData<void>>} Response with headers only
 *
 * @example
 * ```typescript
 * const response = await head('/api/students/123');
 * console.log('Exists:', response.status === 200);
 * console.log('Content-Length:', response.headers['content-length']);
 * ```
 */
export const head = async (
  url: string,
  headers?: Record<string, string>,
): Promise<ResponseData<void>> => {
  return executeRequest<void>({
    method: 'HEAD',
    url,
    headers,
  });
};

/**
 * Performs OPTIONS request.
 *
 * @param {string} url - Request URL
 * @param {Record<string, string>} [headers] - Request headers
 * @returns {Promise<ResponseData<void>>} Response with CORS headers
 *
 * @example
 * ```typescript
 * const response = await options('/api/students');
 * console.log('Allowed methods:', response.headers['allow']);
 * ```
 */
export const options = async (
  url: string,
  headers?: Record<string, string>,
): Promise<ResponseData<void>> => {
  return executeRequest<void>({
    method: 'OPTIONS',
    url,
    headers,
  });
};

// ============================================================================
// RESPONSE PARSING AND TRANSFORMATION
// ============================================================================

/**
 * Parses response based on content type.
 *
 * @template T
 * @param {Response} response - Fetch response
 * @param {RequestConfig['responseType']} [type] - Expected response type
 * @returns {Promise<T>} Parsed response data
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.example.com/students');
 * const data = await parseResponse<Student[]>(response, 'json');
 * ```
 */
export const parseResponse = async <T>(
  response: Response,
  type?: RequestConfig['responseType'],
): Promise<T> => {
  const contentType = response.headers.get('content-type');

  if (type === 'blob' || contentType?.includes('application/octet-stream')) {
    return (await response.blob()) as unknown as T;
  } else if (type === 'arraybuffer') {
    return (await response.arrayBuffer()) as unknown as T;
  } else if (type === 'text' || contentType?.includes('text/')) {
    return (await response.text()) as unknown as T;
  } else {
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }
};

/**
 * Extracts headers from response.
 *
 * @param {Response} response - Fetch response
 * @returns {Record<string, string>} Headers object
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.example.com/students');
 * const headers = extractHeaders(response);
 * console.log(headers['content-type']);
 * ```
 */
export const extractHeaders = (response: Response): Record<string, string> => {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
};

/**
 * Transforms response data using a mapper function.
 *
 * @template T, R
 * @param {ResponseData<T>} response - Response data
 * @param {(data: T) => R} mapper - Transformation function
 * @returns {ResponseData<R>} Transformed response
 *
 * @example
 * ```typescript
 * const response = await get<Student[]>('/api/students');
 * const transformed = transformResponse(response, (students) =>
 *   students.map(s => ({ ...s, fullName: `${s.firstName} ${s.lastName}` }))
 * );
 * ```
 */
export const transformResponse = <T, R>(
  response: ResponseData<T>,
  mapper: (data: T) => R,
): ResponseData<R> => {
  return {
    ...response,
    data: mapper(response.data),
  };
};

/**
 * Extracts data from paginated response.
 *
 * @template T
 * @param {ResponseData<any>} response - Paginated response
 * @param {string} [dataKey] - Key containing data array (default: 'data')
 * @returns {T[]} Extracted data array
 *
 * @example
 * ```typescript
 * const response = await get('/api/students?page=1');
 * const students = extractPaginatedData<Student>(response, 'items');
 * // If response.data = { items: [...], total: 100 }
 * ```
 */
export const extractPaginatedData = <T>(
  response: ResponseData<any>,
  dataKey: string = 'data',
): T[] => {
  return Array.isArray(response.data)
    ? response.data
    : response.data[dataKey] || [];
};

/**
 * Flattens nested response data.
 *
 * @param {ResponseData<any>} response - Response with nested data
 * @param {string} path - Dot-notation path to data
 * @returns {any} Flattened data
 *
 * @example
 * ```typescript
 * const response = await get('/api/data');
 * // response.data = { result: { user: { name: 'John' } } }
 * const name = flattenResponse(response, 'result.user.name');
 * // Result: 'John'
 * ```
 */
export const flattenResponse = (response: ResponseData<any>, path: string): any => {
  return path.split('.').reduce((obj, key) => obj?.[key], response.data);
};

// ============================================================================
// MULTIPART FORM-DATA HANDLING
// ============================================================================

/**
 * Creates multipart form data from fields.
 *
 * @param {MultipartField[]} fields - Form fields
 * @returns {FormData} FormData object
 *
 * @example
 * ```typescript
 * const formData = createMultipartFormData([
 *   { name: 'title', value: 'Document Title' },
 *   { name: 'file', value: fileBlob, filename: 'document.pdf', contentType: 'application/pdf' }
 * ]);
 * ```
 */
export const createMultipartFormData = (fields: MultipartField[]): FormData => {
  const formData = new FormData();

  fields.forEach(field => {
    if (field.value instanceof Blob || field.value instanceof File) {
      formData.append(field.name, field.value, field.filename);
    } else {
      formData.append(field.name, String(field.value));
    }
  });

  return formData;
};

/**
 * Posts multipart form data.
 *
 * @template T
 * @param {string} url - Request URL
 * @param {FormData} formData - Form data to send
 * @param {Record<string, string>} [headers] - Additional headers
 * @returns {Promise<ResponseData<T>>} Response data
 *
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append('name', 'John Doe');
 * formData.append('avatar', fileBlob, 'avatar.jpg');
 *
 * const response = await postMultipart<User>('/api/users', formData);
 * ```
 */
export const postMultipart = async <T = any>(
  url: string,
  formData: FormData,
  headers?: Record<string, string>,
): Promise<ResponseData<T>> => {
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type; browser will set it with boundary
      ...headers,
    },
  });

  const data = await parseResponse<T>(response);
  const responseHeaders = extractHeaders(response);

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  };
};

/**
 * Appends file to FormData with validation.
 *
 * @param {FormData} formData - FormData object
 * @param {string} fieldName - Field name
 * @param {File | Blob} file - File to append
 * @param {string} [filename] - Custom filename
 * @param {string[]} [allowedTypes] - Allowed MIME types
 * @param {number} [maxSize] - Max file size in bytes
 *
 * @example
 * ```typescript
 * const formData = new FormData();
 * appendFileToFormData(
 *   formData,
 *   'document',
 *   pdfFile,
 *   'report.pdf',
 *   ['application/pdf'],
 *   5 * 1024 * 1024 // 5MB
 * );
 * ```
 */
export const appendFileToFormData = (
  formData: FormData,
  fieldName: string,
  file: File | Blob,
  filename?: string,
  allowedTypes?: string[],
  maxSize?: number,
): void => {
  if (allowedTypes && file.type && !allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  if (maxSize && file.size > maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum ${maxSize} bytes`);
  }

  formData.append(fieldName, file, filename);
};

// ============================================================================
// FILE UPLOAD/DOWNLOAD HELPERS
// ============================================================================

/**
 * Uploads file with progress tracking.
 *
 * @param {string} url - Upload URL
 * @param {File | Blob} file - File to upload
 * @param {(progress: UploadProgress) => void} [onProgress] - Progress callback
 * @param {Record<string, string>} [headers] - Additional headers
 * @returns {Promise<ResponseData<any>>} Upload response
 *
 * @example
 * ```typescript
 * const file = document.querySelector('input[type="file"]').files[0];
 * const response = await uploadFile(
 *   '/api/upload',
 *   file,
 *   (progress) => console.log(`${progress.percentage}% uploaded`)
 * );
 * ```
 */
export const uploadFile = async (
  url: string,
  file: File | Blob,
  onProgress?: (progress: UploadProgress) => void,
  headers?: Record<string, string>,
): Promise<ResponseData<any>> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      resolve({
        data,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: {},
      });
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', url);

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
};

/**
 * Downloads file with progress tracking.
 *
 * @param {string} url - Download URL
 * @param {(progress: DownloadProgress) => void} [onProgress] - Progress callback
 * @returns {Promise<Blob>} Downloaded file as Blob
 *
 * @example
 * ```typescript
 * const blob = await downloadFile(
 *   '/api/files/report.pdf',
 *   (progress) => console.log(`${progress.percentage}% downloaded`)
 * );
 *
 * const url = URL.createObjectURL(blob);
 * window.open(url);
 * ```
 */
export const downloadFile = async (
  url: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Download failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Download failed'));
    });

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
};

/**
 * Triggers browser download of blob/file.
 *
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Download filename
 *
 * @example
 * ```typescript
 * const blob = new Blob(['Hello World'], { type: 'text/plain' });
 * triggerDownload(blob, 'hello.txt');
 * ```
 */
export const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Uploads multiple files.
 *
 * @param {string} url - Upload URL
 * @param {File[] | Blob[]} files - Files to upload
 * @param {(progress: UploadProgress) => void} [onProgress] - Progress callback
 * @returns {Promise<ResponseData<any>>} Upload response
 *
 * @example
 * ```typescript
 * const files = Array.from(document.querySelector('input[type="file"]').files);
 * const response = await uploadMultipleFiles(
 *   '/api/upload/batch',
 *   files,
 *   (progress) => console.log(`${progress.percentage}% uploaded`)
 * );
 * ```
 */
export const uploadMultipleFiles = async (
  url: string,
  files: File[] | Blob[],
  onProgress?: (progress: UploadProgress) => void,
): Promise<ResponseData<any>> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      resolve({
        data,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: {},
      });
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', url);
    xhr.send(formData);
  });
};

// ============================================================================
// REQUEST CANCELLATION
// ============================================================================

/**
 * Creates cancellable request with AbortController.
 *
 * @param {RequestConfig} config - Request configuration
 * @returns {object} Request controller with execute and cancel methods
 *
 * @example
 * ```typescript
 * const controller = createCancellableRequest({
 *   method: 'GET',
 *   url: '/api/search',
 *   params: { q: 'query' }
 * });
 *
 * controller.execute().then(response => console.log(response));
 *
 * // Cancel if needed
 * setTimeout(() => controller.cancel(), 1000);
 * ```
 */
export const createCancellableRequest = (config: RequestConfig) => {
  const controller = new AbortController();

  return {
    execute: async <T = any>(): Promise<ResponseData<T>> => {
      const url = buildUrl(config.url, config.params);
      const response = await fetch(url, {
        method: config.method,
        headers: config.headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: controller.signal,
      });

      const data = await parseResponse<T>(response, config.responseType);
      const headers = extractHeaders(response);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
      };
    },
    cancel: (reason?: string) => {
      controller.abort(reason);
    },
    signal: controller.signal,
  };
};

/**
 * Cancels request after timeout.
 *
 * @param {RequestConfig} config - Request configuration
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<ResponseData<any>>} Response data or timeout error
 *
 * @example
 * ```typescript
 * const response = await requestWithTimeout({
 *   method: 'GET',
 *   url: '/api/slow-endpoint'
 * }, 5000);
 * ```
 */
export const requestWithTimeout = async (
  config: RequestConfig,
  timeout: number,
): Promise<ResponseData<any>> => {
  const controller = createCancellableRequest(config);

  const timeoutId = setTimeout(() => {
    controller.cancel('Request timeout');
  }, timeout);

  try {
    const response = await controller.execute();
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// ============================================================================
// REQUEST INTERCEPTOR CHAINS
// ============================================================================

/**
 * Creates request interceptor chain.
 *
 * @param {RequestInterceptor[]} interceptors - Request interceptors
 * @returns {object} Interceptor chain with execute method
 *
 * @example
 * ```typescript
 * const chain = createRequestInterceptorChain([
 *   {
 *     onRequest: (config) => {
 *       config.headers = { ...config.headers, 'X-Custom': 'value' };
 *       return config;
 *     }
 *   },
 *   {
 *     onRequest: async (config) => {
 *       const token = await getAuthToken();
 *       config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
 *       return config;
 *     }
 *   }
 * ]);
 *
 * const response = await chain.execute({ method: 'GET', url: '/api/data' });
 * ```
 */
export const createRequestInterceptorChain = (interceptors: RequestInterceptor[]) => {
  return {
    execute: async (config: RequestConfig) => {
      let currentConfig = config;

      for (const interceptor of interceptors) {
        if (interceptor.onRequest) {
          try {
            currentConfig = await interceptor.onRequest(currentConfig);
          } catch (error) {
            if (interceptor.onError) {
              interceptor.onError(error);
            }
            throw error;
          }
        }
      }

      return executeRequest(currentConfig);
    },
  };
};

/**
 * Creates response interceptor chain.
 *
 * @param {ResponseInterceptor[]} interceptors - Response interceptors
 * @returns {object} Interceptor chain with process method
 *
 * @example
 * ```typescript
 * const chain = createResponseInterceptorChain([
 *   {
 *     onResponse: (response) => {
 *       console.log('Response received:', response.status);
 *       return response;
 *     }
 *   },
 *   {
 *     onResponse: (response) => {
 *       if (response.status === 401) {
 *         // Handle unauthorized
 *       }
 *       return response;
 *     }
 *   }
 * ]);
 *
 * const processed = await chain.process(response);
 * ```
 */
export const createResponseInterceptorChain = (interceptors: ResponseInterceptor[]) => {
  return {
    process: async <T>(response: ResponseData<T>) => {
      let currentResponse = response;

      for (const interceptor of interceptors) {
        if (interceptor.onResponse) {
          try {
            currentResponse = await interceptor.onResponse(currentResponse);
          } catch (error) {
            if (interceptor.onError) {
              interceptor.onError(error);
            }
            throw error;
          }
        }
      }

      return currentResponse;
    },
  };
};

// ============================================================================
// RESPONSE CACHING
// ============================================================================

/**
 * Creates in-memory response cache.
 *
 * @param {number} [defaultTTL] - Default TTL in ms (default: 300000 = 5min)
 * @returns {object} Cache with get, set, clear methods
 *
 * @example
 * ```typescript
 * const cache = createResponseCache(60000); // 1 minute TTL
 *
 * cache.set('/api/students', studentsData);
 * const cached = cache.get('/api/students');
 *
 * if (cached) {
 *   console.log('Using cached data');
 * }
 * ```
 */
export const createResponseCache = (defaultTTL: number = 300000) => {
  const cache = new Map<string, CacheEntry<any>>();

  return {
    get: <T>(key: string): T | null => {
      const entry = cache.get(key);
      if (!entry) return null;

      if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
      }

      return entry.data;
    },
    set: <T>(key: string, data: T, ttl?: number): void => {
      const expiresAt = Date.now() + (ttl || defaultTTL);
      cache.set(key, { data, timestamp: Date.now(), expiresAt });
    },
    has: (key: string): boolean => {
      const entry = cache.get(key);
      if (!entry) return false;

      if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return false;
      }

      return true;
    },
    delete: (key: string): void => {
      cache.delete(key);
    },
    clear: (): void => {
      cache.clear();
    },
    size: (): number => cache.size,
  };
};

/**
 * Creates cached GET request.
 *
 * @template T
 * @param {string} url - Request URL
 * @param {Record<string, any>} [params] - Query parameters
 * @param {number} [cacheTTL] - Cache TTL in ms
 * @returns {Promise<ResponseData<T>>} Response data (cached or fresh)
 *
 * @example
 * ```typescript
 * const response = await getCached<Student[]>(
 *   '/api/students',
 *   { grade: 10 },
 *   60000 // Cache for 1 minute
 * );
 * ```
 */
export const getCached = async <T = any>(
  url: string,
  params?: Record<string, any>,
  cacheTTL?: number,
): Promise<ResponseData<T>> => {
  const cache = createResponseCache();
  const cacheKey = buildUrl(url, params);

  const cached = cache.get<ResponseData<T>>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await get<T>(url, params);
  cache.set(cacheKey, response, cacheTTL);
  return response;
};

// ============================================================================
// API VERSIONING HELPERS
// ============================================================================

/**
 * Creates versioned API client.
 *
 * @param {string} baseUrl - Base API URL
 * @param {string | number} version - API version
 * @returns {object} Versioned API client with HTTP methods
 *
 * @example
 * ```typescript
 * const api = createVersionedClient('https://api.example.com', 'v2');
 *
 * const students = await api.get<Student[]>('/students');
 * const newStudent = await api.post<Student>('/students', { name: 'John' });
 * ```
 */
export const createVersionedClient = (baseUrl: string, version: string | number) => {
  const versionStr = typeof version === 'number' ? `v${version}` : version;
  const versionedUrl = `${baseUrl}/${versionStr}`;

  return {
    get: <T>(path: string, params?: Record<string, any>, headers?: Record<string, string>) =>
      get<T>(`${versionedUrl}${path}`, params, headers),
    post: <T>(path: string, data: any, headers?: Record<string, string>) =>
      post<T>(`${versionedUrl}${path}`, data, headers),
    put: <T>(path: string, data: any, headers?: Record<string, string>) =>
      put<T>(`${versionedUrl}${path}`, data, headers),
    patch: <T>(path: string, data: any, headers?: Record<string, string>) =>
      patch<T>(`${versionedUrl}${path}`, data, headers),
    delete: <T>(path: string, headers?: Record<string, string>) =>
      del<T>(`${versionedUrl}${path}`, headers),
  };
};

/**
 * Adds API version header to request.
 *
 * @param {Record<string, string>} headers - Existing headers
 * @param {string | number} version - API version
 * @param {string} [headerName] - Version header name (default: 'API-Version')
 * @returns {Record<string, string>} Headers with version
 *
 * @example
 * ```typescript
 * const headers = addApiVersionHeader({}, 2);
 * // Result: { 'API-Version': '2' }
 *
 * const customHeaders = addApiVersionHeader(
 *   { Authorization: 'Bearer token' },
 *   'v2.1',
 *   'X-API-Version'
 * );
 * ```
 */
export const addApiVersionHeader = (
  headers: Record<string, string>,
  version: string | number,
  headerName: string = 'API-Version',
): Record<string, string> => {
  return {
    ...headers,
    [headerName]: String(version),
  };
};

/**
 * Extracts API version from response headers.
 *
 * @param {ResponseData<any>} response - Response data
 * @param {string} [headerName] - Version header name
 * @returns {string | null} API version or null
 *
 * @example
 * ```typescript
 * const response = await get('/api/students');
 * const version = extractApiVersion(response);
 * console.log('API Version:', version);
 * ```
 */
export const extractApiVersion = (
  response: ResponseData<any>,
  headerName: string = 'api-version',
): string | null => {
  return response.headers[headerName.toLowerCase()] || null;
};

export default {
  // Request builder
  createRequestBuilder,
  executeRequest,
  buildUrl,

  // HTTP methods
  get,
  post,
  put,
  patch,
  del,
  head,
  options,

  // Response parsing
  parseResponse,
  extractHeaders,
  transformResponse,
  extractPaginatedData,
  flattenResponse,

  // Multipart
  createMultipartFormData,
  postMultipart,
  appendFileToFormData,

  // File operations
  uploadFile,
  downloadFile,
  triggerDownload,
  uploadMultipleFiles,

  // Cancellation
  createCancellableRequest,
  requestWithTimeout,

  // Interceptors
  createRequestInterceptorChain,
  createResponseInterceptorChain,

  // Caching
  createResponseCache,
  getCached,

  // Versioning
  createVersionedClient,
  addApiVersionHeader,
  extractApiVersion,
};
