"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractApiVersion = exports.addApiVersionHeader = exports.createVersionedClient = exports.getCached = exports.createResponseCache = exports.createResponseInterceptorChain = exports.createRequestInterceptorChain = exports.requestWithTimeout = exports.createCancellableRequest = exports.uploadMultipleFiles = exports.triggerDownload = exports.downloadFile = exports.uploadFile = exports.appendFileToFormData = exports.postMultipart = exports.createMultipartFormData = exports.flattenResponse = exports.extractPaginatedData = exports.transformResponse = exports.extractHeaders = exports.parseResponse = exports.options = exports.head = exports.del = exports.patch = exports.put = exports.post = exports.get = exports.buildUrl = exports.executeRequest = exports.createRequestBuilder = void 0;
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
const createRequestBuilder = () => {
    const config = {
        method: 'GET',
        url: '',
        headers: {},
        params: {},
        timeout: 30000,
        responseType: 'json',
    };
    return {
        url: (url) => {
            config.url = url;
            return builder;
        },
        method: (method) => {
            config.method = method;
            return builder;
        },
        header: (key, value) => {
            config.headers = config.headers || {};
            config.headers[key] = value;
            return builder;
        },
        headers: (headers) => {
            config.headers = { ...config.headers, ...headers };
            return builder;
        },
        query: (params) => {
            config.params = { ...config.params, ...params };
            return builder;
        },
        data: (data) => {
            config.data = data;
            return builder;
        },
        timeout: (timeout) => {
            config.timeout = timeout;
            return builder;
        },
        responseType: (type) => {
            config.responseType = type;
            return builder;
        },
        getConfig: () => config,
        execute: async () => (0, exports.executeRequest)(config),
    };
    const builder = {
        url: (url) => {
            config.url = url;
            return builder;
        },
        method: (method) => {
            config.method = method;
            return builder;
        },
        header: (key, value) => {
            config.headers = config.headers || {};
            config.headers[key] = value;
            return builder;
        },
        headers: (headers) => {
            config.headers = { ...config.headers, ...headers };
            return builder;
        },
        query: (params) => {
            config.params = { ...config.params, ...params };
            return builder;
        },
        data: (data) => {
            config.data = data;
            return builder;
        },
        timeout: (timeout) => {
            config.timeout = timeout;
            return builder;
        },
        responseType: (type) => {
            config.responseType = type;
            return builder;
        },
        getConfig: () => config,
        execute: async () => (0, exports.executeRequest)(config),
    };
    return builder;
};
exports.createRequestBuilder = createRequestBuilder;
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
const executeRequest = async (config) => {
    const url = (0, exports.buildUrl)(config.url, config.params);
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
        const data = await (0, exports.parseResponse)(response, config.responseType);
        const headers = (0, exports.extractHeaders)(response);
        return {
            data,
            status: response.status,
            statusText: response.statusText,
            headers,
        };
    }
    catch (error) {
        clearTimeout(timeoutId);
        throw new Error(`Request failed: ${error.message}`);
    }
};
exports.executeRequest = executeRequest;
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
const buildUrl = (baseUrl, params) => {
    if (!params || Object.keys(params).length === 0) {
        return baseUrl;
    }
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(key, String(v)));
            }
            else {
                searchParams.append(key, String(value));
            }
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
exports.buildUrl = buildUrl;
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
const get = async (url, params, headers) => {
    return (0, exports.executeRequest)({
        method: 'GET',
        url,
        params,
        headers,
    });
};
exports.get = get;
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
const post = async (url, data, headers) => {
    return (0, exports.executeRequest)({
        method: 'POST',
        url,
        data,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
};
exports.post = post;
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
const put = async (url, data, headers) => {
    return (0, exports.executeRequest)({
        method: 'PUT',
        url,
        data,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
};
exports.put = put;
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
const patch = async (url, data, headers) => {
    return (0, exports.executeRequest)({
        method: 'PATCH',
        url,
        data,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
};
exports.patch = patch;
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
const del = async (url, headers) => {
    return (0, exports.executeRequest)({
        method: 'DELETE',
        url,
        headers,
    });
};
exports.del = del;
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
const head = async (url, headers) => {
    return (0, exports.executeRequest)({
        method: 'HEAD',
        url,
        headers,
    });
};
exports.head = head;
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
const options = async (url, headers) => {
    return (0, exports.executeRequest)({
        method: 'OPTIONS',
        url,
        headers,
    });
};
exports.options = options;
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
const parseResponse = async (response, type) => {
    const contentType = response.headers.get('content-type');
    if (type === 'blob' || contentType?.includes('application/octet-stream')) {
        return (await response.blob());
    }
    else if (type === 'arraybuffer') {
        return (await response.arrayBuffer());
    }
    else if (type === 'text' || contentType?.includes('text/')) {
        return (await response.text());
    }
    else {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    }
};
exports.parseResponse = parseResponse;
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
const extractHeaders = (response) => {
    const headers = {};
    response.headers.forEach((value, key) => {
        headers[key] = value;
    });
    return headers;
};
exports.extractHeaders = extractHeaders;
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
const transformResponse = (response, mapper) => {
    return {
        ...response,
        data: mapper(response.data),
    };
};
exports.transformResponse = transformResponse;
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
const extractPaginatedData = (response, dataKey = 'data') => {
    return Array.isArray(response.data)
        ? response.data
        : response.data[dataKey] || [];
};
exports.extractPaginatedData = extractPaginatedData;
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
const flattenResponse = (response, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], response.data);
};
exports.flattenResponse = flattenResponse;
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
const createMultipartFormData = (fields) => {
    const formData = new FormData();
    fields.forEach(field => {
        if (field.value instanceof Blob || field.value instanceof File) {
            formData.append(field.name, field.value, field.filename);
        }
        else {
            formData.append(field.name, String(field.value));
        }
    });
    return formData;
};
exports.createMultipartFormData = createMultipartFormData;
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
const postMultipart = async (url, formData, headers) => {
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            // Don't set Content-Type; browser will set it with boundary
            ...headers,
        },
    });
    const data = await (0, exports.parseResponse)(response);
    const responseHeaders = (0, exports.extractHeaders)(response);
    return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    };
};
exports.postMultipart = postMultipart;
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
const appendFileToFormData = (formData, fieldName, file, filename, allowedTypes, maxSize) => {
    if (allowedTypes && file.type && !allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    if (maxSize && file.size > maxSize) {
        throw new Error(`File size ${file.size} exceeds maximum ${maxSize} bytes`);
    }
    formData.append(fieldName, file, filename);
};
exports.appendFileToFormData = appendFileToFormData;
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
const uploadFile = async (url, file, onProgress, headers) => {
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
exports.uploadFile = uploadFile;
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
const downloadFile = async (url, onProgress) => {
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
            }
            else {
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
exports.downloadFile = downloadFile;
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
const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
exports.triggerDownload = triggerDownload;
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
const uploadMultipleFiles = async (url, files, onProgress) => {
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
exports.uploadMultipleFiles = uploadMultipleFiles;
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
const createCancellableRequest = (config) => {
    const controller = new AbortController();
    return {
        execute: async () => {
            const url = (0, exports.buildUrl)(config.url, config.params);
            const response = await fetch(url, {
                method: config.method,
                headers: config.headers,
                body: config.data ? JSON.stringify(config.data) : undefined,
                signal: controller.signal,
            });
            const data = await (0, exports.parseResponse)(response, config.responseType);
            const headers = (0, exports.extractHeaders)(response);
            return {
                data,
                status: response.status,
                statusText: response.statusText,
                headers,
            };
        },
        cancel: (reason) => {
            controller.abort(reason);
        },
        signal: controller.signal,
    };
};
exports.createCancellableRequest = createCancellableRequest;
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
const requestWithTimeout = async (config, timeout) => {
    const controller = (0, exports.createCancellableRequest)(config);
    const timeoutId = setTimeout(() => {
        controller.cancel('Request timeout');
    }, timeout);
    try {
        const response = await controller.execute();
        clearTimeout(timeoutId);
        return response;
    }
    catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};
exports.requestWithTimeout = requestWithTimeout;
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
const createRequestInterceptorChain = (interceptors) => {
    return {
        execute: async (config) => {
            let currentConfig = config;
            for (const interceptor of interceptors) {
                if (interceptor.onRequest) {
                    try {
                        currentConfig = await interceptor.onRequest(currentConfig);
                    }
                    catch (error) {
                        if (interceptor.onError) {
                            interceptor.onError(error);
                        }
                        throw error;
                    }
                }
            }
            return (0, exports.executeRequest)(currentConfig);
        },
    };
};
exports.createRequestInterceptorChain = createRequestInterceptorChain;
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
const createResponseInterceptorChain = (interceptors) => {
    return {
        process: async (response) => {
            let currentResponse = response;
            for (const interceptor of interceptors) {
                if (interceptor.onResponse) {
                    try {
                        currentResponse = await interceptor.onResponse(currentResponse);
                    }
                    catch (error) {
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
exports.createResponseInterceptorChain = createResponseInterceptorChain;
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
const createResponseCache = (defaultTTL = 300000) => {
    const cache = new Map();
    return {
        get: (key) => {
            const entry = cache.get(key);
            if (!entry)
                return null;
            if (Date.now() > entry.expiresAt) {
                cache.delete(key);
                return null;
            }
            return entry.data;
        },
        set: (key, data, ttl) => {
            const expiresAt = Date.now() + (ttl || defaultTTL);
            cache.set(key, { data, timestamp: Date.now(), expiresAt });
        },
        has: (key) => {
            const entry = cache.get(key);
            if (!entry)
                return false;
            if (Date.now() > entry.expiresAt) {
                cache.delete(key);
                return false;
            }
            return true;
        },
        delete: (key) => {
            cache.delete(key);
        },
        clear: () => {
            cache.clear();
        },
        size: () => cache.size,
    };
};
exports.createResponseCache = createResponseCache;
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
const getCached = async (url, params, cacheTTL) => {
    const cache = (0, exports.createResponseCache)();
    const cacheKey = (0, exports.buildUrl)(url, params);
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }
    const response = await (0, exports.get)(url, params);
    cache.set(cacheKey, response, cacheTTL);
    return response;
};
exports.getCached = getCached;
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
const createVersionedClient = (baseUrl, version) => {
    const versionStr = typeof version === 'number' ? `v${version}` : version;
    const versionedUrl = `${baseUrl}/${versionStr}`;
    return {
        get: (path, params, headers) => (0, exports.get)(`${versionedUrl}${path}`, params, headers),
        post: (path, data, headers) => (0, exports.post)(`${versionedUrl}${path}`, data, headers),
        put: (path, data, headers) => (0, exports.put)(`${versionedUrl}${path}`, data, headers),
        patch: (path, data, headers) => (0, exports.patch)(`${versionedUrl}${path}`, data, headers),
        delete: (path, headers) => (0, exports.del)(`${versionedUrl}${path}`, headers),
    };
};
exports.createVersionedClient = createVersionedClient;
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
const addApiVersionHeader = (headers, version, headerName = 'API-Version') => {
    return {
        ...headers,
        [headerName]: String(version),
    };
};
exports.addApiVersionHeader = addApiVersionHeader;
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
const extractApiVersion = (response, headerName = 'api-version') => {
    return response.headers[headerName.toLowerCase()] || null;
};
exports.extractApiVersion = extractApiVersion;
exports.default = {
    // Request builder
    createRequestBuilder: exports.createRequestBuilder,
    executeRequest: exports.executeRequest,
    buildUrl: exports.buildUrl,
    // HTTP methods
    get: exports.get,
    post: exports.post,
    put: exports.put,
    patch: exports.patch,
    del: exports.del,
    head: exports.head,
    options: exports.options,
    // Response parsing
    parseResponse: exports.parseResponse,
    extractHeaders: exports.extractHeaders,
    transformResponse: exports.transformResponse,
    extractPaginatedData: exports.extractPaginatedData,
    flattenResponse: exports.flattenResponse,
    // Multipart
    createMultipartFormData: exports.createMultipartFormData,
    postMultipart: exports.postMultipart,
    appendFileToFormData: exports.appendFileToFormData,
    // File operations
    uploadFile: exports.uploadFile,
    downloadFile: exports.downloadFile,
    triggerDownload: exports.triggerDownload,
    uploadMultipleFiles: exports.uploadMultipleFiles,
    // Cancellation
    createCancellableRequest: exports.createCancellableRequest,
    requestWithTimeout: exports.requestWithTimeout,
    // Interceptors
    createRequestInterceptorChain: exports.createRequestInterceptorChain,
    createResponseInterceptorChain: exports.createResponseInterceptorChain,
    // Caching
    createResponseCache: exports.createResponseCache,
    getCached: exports.getCached,
    // Versioning
    createVersionedClient: exports.createVersionedClient,
    addApiVersionHeader: exports.addApiVersionHeader,
    extractApiVersion: exports.extractApiVersion,
};
//# sourceMappingURL=rest-client-utils.js.map