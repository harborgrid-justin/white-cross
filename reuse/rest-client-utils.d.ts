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
export declare const createRequestBuilder: () => {
    url: (url: string) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    method: (method: RequestConfig["method"]) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    header: (key: string, value: string) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    headers: (headers: Record<string, string>) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    query: (params: Record<string, any>) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    data: (data: any) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    timeout: (timeout: number) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    responseType: (type: RequestConfig["responseType"]) => {
        url: (url: string) => /*elided*/ any;
        method: (method: RequestConfig["method"]) => /*elided*/ any;
        header: (key: string, value: string) => /*elided*/ any;
        headers: (headers: Record<string, string>) => /*elided*/ any;
        query: (params: Record<string, any>) => /*elided*/ any;
        data: (data: any) => /*elided*/ any;
        timeout: (timeout: number) => /*elided*/ any;
        responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    getConfig: () => RequestConfig;
    execute: <T = any>() => Promise<ResponseData<T>>;
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
export declare const executeRequest: <T = any>(config: RequestConfig) => Promise<ResponseData<T>>;
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
export declare const buildUrl: (baseUrl: string, params?: Record<string, any>) => string;
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
export declare const get: <T = any>(url: string, params?: Record<string, any>, headers?: Record<string, string>) => Promise<ResponseData<T>>;
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
export declare const post: <T = any>(url: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
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
export declare const put: <T = any>(url: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
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
export declare const patch: <T = any>(url: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
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
export declare const del: <T = any>(url: string, headers?: Record<string, string>) => Promise<ResponseData<T>>;
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
export declare const head: (url: string, headers?: Record<string, string>) => Promise<ResponseData<void>>;
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
export declare const options: (url: string, headers?: Record<string, string>) => Promise<ResponseData<void>>;
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
export declare const parseResponse: <T>(response: Response, type?: RequestConfig["responseType"]) => Promise<T>;
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
export declare const extractHeaders: (response: Response) => Record<string, string>;
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
export declare const transformResponse: <T, R>(response: ResponseData<T>, mapper: (data: T) => R) => ResponseData<R>;
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
export declare const extractPaginatedData: <T>(response: ResponseData<any>, dataKey?: string) => T[];
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
export declare const flattenResponse: (response: ResponseData<any>, path: string) => any;
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
export declare const createMultipartFormData: (fields: MultipartField[]) => FormData;
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
export declare const postMultipart: <T = any>(url: string, formData: FormData, headers?: Record<string, string>) => Promise<ResponseData<T>>;
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
export declare const appendFileToFormData: (formData: FormData, fieldName: string, file: File | Blob, filename?: string, allowedTypes?: string[], maxSize?: number) => void;
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
export declare const uploadFile: (url: string, file: File | Blob, onProgress?: (progress: UploadProgress) => void, headers?: Record<string, string>) => Promise<ResponseData<any>>;
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
export declare const downloadFile: (url: string, onProgress?: (progress: DownloadProgress) => void) => Promise<Blob>;
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
export declare const triggerDownload: (blob: Blob, filename: string) => void;
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
export declare const uploadMultipleFiles: (url: string, files: File[] | Blob[], onProgress?: (progress: UploadProgress) => void) => Promise<ResponseData<any>>;
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
export declare const createCancellableRequest: (config: RequestConfig) => {
    execute: <T = any>() => Promise<ResponseData<T>>;
    cancel: (reason?: string) => void;
    signal: any;
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
export declare const requestWithTimeout: (config: RequestConfig, timeout: number) => Promise<ResponseData<any>>;
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
export declare const createRequestInterceptorChain: (interceptors: RequestInterceptor[]) => {
    execute: (config: RequestConfig) => Promise<ResponseData<any>>;
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
export declare const createResponseInterceptorChain: (interceptors: ResponseInterceptor[]) => {
    process: <T>(response: ResponseData<T>) => Promise<ResponseData<T>>;
};
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
export declare const createResponseCache: (defaultTTL?: number) => {
    get: <T>(key: string) => T | null;
    set: <T>(key: string, data: T, ttl?: number) => void;
    has: (key: string) => boolean;
    delete: (key: string) => void;
    clear: () => void;
    size: () => number;
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
export declare const getCached: <T = any>(url: string, params?: Record<string, any>, cacheTTL?: number) => Promise<ResponseData<T>>;
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
export declare const createVersionedClient: (baseUrl: string, version: string | number) => {
    get: <T>(path: string, params?: Record<string, any>, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    post: <T>(path: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    put: <T>(path: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    patch: <T>(path: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    delete: <T>(path: string, headers?: Record<string, string>) => Promise<ResponseData<T>>;
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
export declare const addApiVersionHeader: (headers: Record<string, string>, version: string | number, headerName?: string) => Record<string, string>;
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
export declare const extractApiVersion: (response: ResponseData<any>, headerName?: string) => string | null;
declare const _default: {
    createRequestBuilder: () => {
        url: (url: string) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        method: (method: RequestConfig["method"]) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        header: (key: string, value: string) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        headers: (headers: Record<string, string>) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        query: (params: Record<string, any>) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        data: (data: any) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        timeout: (timeout: number) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        responseType: (type: RequestConfig["responseType"]) => {
            url: (url: string) => /*elided*/ any;
            method: (method: RequestConfig["method"]) => /*elided*/ any;
            header: (key: string, value: string) => /*elided*/ any;
            headers: (headers: Record<string, string>) => /*elided*/ any;
            query: (params: Record<string, any>) => /*elided*/ any;
            data: (data: any) => /*elided*/ any;
            timeout: (timeout: number) => /*elided*/ any;
            responseType: (type: RequestConfig["responseType"]) => /*elided*/ any;
            getConfig: () => RequestConfig;
            execute: <T = any>() => Promise<ResponseData<T>>;
        };
        getConfig: () => RequestConfig;
        execute: <T = any>() => Promise<ResponseData<T>>;
    };
    executeRequest: <T = any>(config: RequestConfig) => Promise<ResponseData<T>>;
    buildUrl: (baseUrl: string, params?: Record<string, any>) => string;
    get: <T = any>(url: string, params?: Record<string, any>, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    post: <T = any>(url: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    put: <T = any>(url: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    patch: <T = any>(url: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    del: <T = any>(url: string, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    head: (url: string, headers?: Record<string, string>) => Promise<ResponseData<void>>;
    options: (url: string, headers?: Record<string, string>) => Promise<ResponseData<void>>;
    parseResponse: <T>(response: Response, type?: RequestConfig["responseType"]) => Promise<T>;
    extractHeaders: (response: Response) => Record<string, string>;
    transformResponse: <T, R>(response: ResponseData<T>, mapper: (data: T) => R) => ResponseData<R>;
    extractPaginatedData: <T>(response: ResponseData<any>, dataKey?: string) => T[];
    flattenResponse: (response: ResponseData<any>, path: string) => any;
    createMultipartFormData: (fields: MultipartField[]) => FormData;
    postMultipart: <T = any>(url: string, formData: FormData, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    appendFileToFormData: (formData: FormData, fieldName: string, file: File | Blob, filename?: string, allowedTypes?: string[], maxSize?: number) => void;
    uploadFile: (url: string, file: File | Blob, onProgress?: (progress: UploadProgress) => void, headers?: Record<string, string>) => Promise<ResponseData<any>>;
    downloadFile: (url: string, onProgress?: (progress: DownloadProgress) => void) => Promise<Blob>;
    triggerDownload: (blob: Blob, filename: string) => void;
    uploadMultipleFiles: (url: string, files: File[] | Blob[], onProgress?: (progress: UploadProgress) => void) => Promise<ResponseData<any>>;
    createCancellableRequest: (config: RequestConfig) => {
        execute: <T = any>() => Promise<ResponseData<T>>;
        cancel: (reason?: string) => void;
        signal: any;
    };
    requestWithTimeout: (config: RequestConfig, timeout: number) => Promise<ResponseData<any>>;
    createRequestInterceptorChain: (interceptors: RequestInterceptor[]) => {
        execute: (config: RequestConfig) => Promise<ResponseData<any>>;
    };
    createResponseInterceptorChain: (interceptors: ResponseInterceptor[]) => {
        process: <T>(response: ResponseData<T>) => Promise<ResponseData<T>>;
    };
    createResponseCache: (defaultTTL?: number) => {
        get: <T>(key: string) => T | null;
        set: <T>(key: string, data: T, ttl?: number) => void;
        has: (key: string) => boolean;
        delete: (key: string) => void;
        clear: () => void;
        size: () => number;
    };
    getCached: <T = any>(url: string, params?: Record<string, any>, cacheTTL?: number) => Promise<ResponseData<T>>;
    createVersionedClient: (baseUrl: string, version: string | number) => {
        get: <T>(path: string, params?: Record<string, any>, headers?: Record<string, string>) => Promise<ResponseData<T>>;
        post: <T>(path: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
        put: <T>(path: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
        patch: <T>(path: string, data: any, headers?: Record<string, string>) => Promise<ResponseData<T>>;
        delete: <T>(path: string, headers?: Record<string, string>) => Promise<ResponseData<T>>;
    };
    addApiVersionHeader: (headers: Record<string, string>, version: string | number, headerName?: string) => Record<string, string>;
    extractApiVersion: (response: ResponseData<any>, headerName?: string) => string | null;
};
export default _default;
//# sourceMappingURL=rest-client-utils.d.ts.map