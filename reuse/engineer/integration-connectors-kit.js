"use strict";
/**
 * LOC: INTCON123
 * File: /reuse/engineer/integration-connectors-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Integration services and controllers
 *   - External API adapters
 *   - Webhook handlers and processors
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulePeriodicSync = exports.performBulkSync = exports.createSyncConfig = exports.createQuotaTracker = exports.logIntegrationActivity = exports.createIntegrationDashboard = exports.createPerformanceMonitor = exports.checkAPIHealth = exports.handleRateLimitResponse = exports.createRateLimiter = exports.getRateLimitStatus = exports.enforceRateLimit = exports.initializeRateLimitState = exports.createCircuitBreaker = exports.executeWithRetry = exports.calculateRetryDelay = exports.isRetryableError = exports.createIntegrationError = exports.createTransformFunctions = exports.setNestedValue = exports.getNestedValue = exports.applyDataMappings = exports.createDataMapping = exports.generateWebhookSecret = exports.deliverWebhook = exports.validateWebhookSignature = exports.generateWebhookSignature = exports.createWebhookConfig = exports.generateRandomState = exports.validateOAuth2Token = exports.refreshOAuth2Token = exports.exchangeOAuth2Code = exports.generateOAuth2AuthorizationURL = exports.validateConnectorConfig = exports.applyAuthentication = exports.buildRequestURL = exports.executeAPIRequest = exports.createAPIConnector = void 0;
const crypto_1 = require("crypto");
// ============================================================================
// 1. GENERIC API CONNECTOR FRAMEWORK
// ============================================================================
/**
 * 1. Creates a generic API connector with configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     APIConnectorConfig:
 *       type: object
 *       required:
 *         - name
 *         - baseURL
 *       properties:
 *         name:
 *           type: string
 *           description: Connector name
 *         baseURL:
 *           type: string
 *           description: Base URL for API
 *         timeout:
 *           type: number
 *           description: Request timeout in milliseconds
 *         headers:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         auth:
 *           $ref: '#/components/schemas/AuthConfig'
 *
 * @param {APIConnectorConfig} config - Connector configuration
 * @returns {any} API connector instance
 *
 * @example
 * ```typescript
 * const connector = createAPIConnector({
 *   name: 'ehr-system',
 *   baseURL: 'https://api.ehrsystem.com',
 *   auth: { type: 'bearer', credentials: { token: 'abc123' } }
 * });
 * ```
 */
const createAPIConnector = (config) => {
    const connector = {
        config,
        rateLimitState: (0, exports.initializeRateLimitState)(config.rateLimitConfig),
        async request(request) {
            // Check rate limit
            if (config.rateLimitConfig) {
                await (0, exports.enforceRateLimit)(connector.rateLimitState, config.rateLimitConfig);
            }
            const startTime = Date.now();
            let lastError;
            const retryConfig = config.retryConfig || {
                maxRetries: 3,
                retryDelay: 1000,
                backoffStrategy: 'exponential',
            };
            for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
                try {
                    const response = await (0, exports.executeAPIRequest)(config, request);
                    response.responseTime = Date.now() - startTime;
                    return response;
                }
                catch (error) {
                    lastError = error;
                    if (attempt < retryConfig.maxRetries && (0, exports.isRetryableError)(error, retryConfig)) {
                        const delay = (0, exports.calculateRetryDelay)(attempt, retryConfig);
                        await sleep(delay);
                        continue;
                    }
                    throw (0, exports.createIntegrationError)(error, request);
                }
            }
            throw lastError;
        },
        async get(endpoint, params) {
            return this.request({ method: 'GET', endpoint, params });
        },
        async post(endpoint, data) {
            return this.request({ method: 'POST', endpoint, data });
        },
        async put(endpoint, data) {
            return this.request({ method: 'PUT', endpoint, data });
        },
        async patch(endpoint, data) {
            return this.request({ method: 'PATCH', endpoint, data });
        },
        async delete(endpoint) {
            return this.request({ method: 'DELETE', endpoint });
        },
        async healthCheck() {
            return (0, exports.checkAPIHealth)(config);
        },
    };
    return connector;
};
exports.createAPIConnector = createAPIConnector;
/**
 * 2. Executes an API request with authentication and headers.
 *
 * @param {APIConnectorConfig} config - Connector configuration
 * @param {APIRequest} request - Request details
 * @returns {Promise<APIResponse>} API response
 *
 * @example
 * ```typescript
 * const response = await executeAPIRequest(config, {
 *   method: 'GET',
 *   endpoint: '/patients',
 *   params: { status: 'active' }
 * });
 * ```
 */
const executeAPIRequest = async (config, request) => {
    const url = (0, exports.buildRequestURL)(config.baseURL, request.endpoint, request.params);
    const headers = {
        ...config.headers,
        ...request.headers,
        'Content-Type': 'application/json',
    };
    // Apply authentication
    if (config.auth) {
        (0, exports.applyAuthentication)(headers, config.auth);
    }
    // Placeholder for actual HTTP request - would use axios or fetch
    const response = {
        status: 200,
        statusText: 'OK',
        data: { message: 'Mock response' },
        headers: {},
        responseTime: 0,
    };
    return response;
};
exports.executeAPIRequest = executeAPIRequest;
/**
 * 3. Builds full request URL with parameters.
 *
 * @param {string} baseURL - Base URL
 * @param {string} endpoint - Endpoint path
 * @param {Record<string, any>} [params] - Query parameters
 * @returns {string} Full URL
 *
 * @example
 * ```typescript
 * const url = buildRequestURL('https://api.example.com', '/users', { page: 1 });
 * // Returns: "https://api.example.com/users?page=1"
 * ```
 */
const buildRequestURL = (baseURL, endpoint, params) => {
    const url = new URL(endpoint, baseURL);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return url.toString();
};
exports.buildRequestURL = buildRequestURL;
/**
 * 4. Applies authentication to request headers.
 *
 * @param {Record<string, string>} headers - Request headers
 * @param {AuthConfig} auth - Authentication configuration
 *
 * @example
 * ```typescript
 * const headers = {};
 * applyAuthentication(headers, {
 *   type: 'bearer',
 *   credentials: { token: 'abc123' }
 * });
 * // headers.Authorization = "Bearer abc123"
 * ```
 */
const applyAuthentication = (headers, auth) => {
    switch (auth.type) {
        case 'basic':
            if (auth.credentials?.username && auth.credentials?.password) {
                const encoded = Buffer.from(`${auth.credentials.username}:${auth.credentials.password}`).toString('base64');
                headers['Authorization'] = `Basic ${encoded}`;
            }
            break;
        case 'bearer':
            if (auth.credentials?.token) {
                headers['Authorization'] = `Bearer ${auth.credentials.token}`;
            }
            break;
        case 'api-key':
            if (auth.credentials?.apiKey) {
                const headerName = auth.credentials.apiKeyHeader || 'X-API-Key';
                headers[headerName] = auth.credentials.apiKey;
            }
            break;
    }
};
exports.applyAuthentication = applyAuthentication;
/**
 * 5. Validates API connector configuration.
 *
 * @param {APIConnectorConfig} config - Configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateConnectorConfig(config);
 * if (!validation.valid) {
 *   console.error('Config errors:', validation.errors);
 * }
 * ```
 */
const validateConnectorConfig = (config) => {
    const errors = [];
    if (!config.name)
        errors.push('Connector name is required');
    if (!config.baseURL)
        errors.push('Base URL is required');
    if (config.baseURL && !isValidURL(config.baseURL)) {
        errors.push('Base URL is not valid');
    }
    if (config.auth?.type === 'oauth2' && !config.auth.oauth2) {
        errors.push('OAuth2 configuration is required when auth type is oauth2');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateConnectorConfig = validateConnectorConfig;
// ============================================================================
// 2. OAUTH2 INTEGRATION HELPERS
// ============================================================================
/**
 * 6. Generates OAuth2 authorization URL.
 *
 * @swagger
 * components:
 *   schemas:
 *     OAuth2Config:
 *       type: object
 *       required:
 *         - clientId
 *         - authorizationURL
 *         - redirectURL
 *       properties:
 *         clientId:
 *           type: string
 *         clientSecret:
 *           type: string
 *         authorizationURL:
 *           type: string
 *         tokenURL:
 *           type: string
 *         redirectURL:
 *           type: string
 *         scope:
 *           type: array
 *           items:
 *             type: string
 *
 * @param {OAuth2Config} config - OAuth2 configuration
 * @returns {string} Authorization URL
 *
 * @example
 * ```typescript
 * const authURL = generateOAuth2AuthorizationURL({
 *   clientId: 'client123',
 *   authorizationURL: 'https://auth.example.com/authorize',
 *   redirectURL: 'https://app.example.com/callback',
 *   scope: ['read', 'write']
 * });
 * ```
 */
const generateOAuth2AuthorizationURL = (config) => {
    const url = new URL(config.authorizationURL);
    const state = config.state || (0, exports.generateRandomState)();
    url.searchParams.append('client_id', config.clientId);
    url.searchParams.append('redirect_uri', config.redirectURL);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('state', state);
    if (config.scope && config.scope.length > 0) {
        url.searchParams.append('scope', config.scope.join(' '));
    }
    if (config.pkce) {
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        url.searchParams.append('code_challenge', codeChallenge);
        url.searchParams.append('code_challenge_method', 'S256');
        // Store codeVerifier for later use
    }
    return url.toString();
};
exports.generateOAuth2AuthorizationURL = generateOAuth2AuthorizationURL;
/**
 * 7. Exchanges authorization code for access token.
 *
 * @param {OAuth2Config} config - OAuth2 configuration
 * @param {string} authorizationCode - Authorization code from callback
 * @returns {Promise<OAuth2TokenResponse>} Token response
 *
 * @example
 * ```typescript
 * const tokens = await exchangeOAuth2Code(oauth2Config, 'auth_code_123');
 * console.log('Access token:', tokens.access_token);
 * ```
 */
const exchangeOAuth2Code = async (config, authorizationCode) => {
    const tokenData = {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: config.redirectURL,
        client_id: config.clientId,
        client_secret: config.clientSecret,
    };
    // Placeholder for actual token exchange - would use axios or fetch
    const now = new Date();
    const expiresIn = 3600;
    return {
        access_token: 'mock_access_token',
        token_type: 'Bearer',
        expires_in: expiresIn,
        refresh_token: 'mock_refresh_token',
        scope: config.scope?.join(' '),
        issued_at: now,
        expires_at: new Date(now.getTime() + expiresIn * 1000),
    };
};
exports.exchangeOAuth2Code = exchangeOAuth2Code;
/**
 * 8. Refreshes OAuth2 access token using refresh token.
 *
 * @param {OAuth2Config} config - OAuth2 configuration
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<OAuth2TokenResponse>} New token response
 *
 * @example
 * ```typescript
 * const newTokens = await refreshOAuth2Token(config, 'refresh_token_123');
 * ```
 */
const refreshOAuth2Token = async (config, refreshToken) => {
    const tokenData = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
    };
    // Placeholder for actual token refresh
    const now = new Date();
    const expiresIn = 3600;
    return {
        access_token: 'new_access_token',
        token_type: 'Bearer',
        expires_in: expiresIn,
        refresh_token: refreshToken,
        issued_at: now,
        expires_at: new Date(now.getTime() + expiresIn * 1000),
    };
};
exports.refreshOAuth2Token = refreshOAuth2Token;
/**
 * 9. Validates OAuth2 token expiration.
 *
 * @param {OAuth2TokenResponse} token - Token to validate
 * @param {number} [bufferSeconds] - Buffer time in seconds before expiration
 * @returns {boolean} True if token is valid
 *
 * @example
 * ```typescript
 * if (!validateOAuth2Token(token, 300)) {
 *   // Token expires in less than 5 minutes, refresh it
 *   token = await refreshOAuth2Token(config, token.refresh_token);
 * }
 * ```
 */
const validateOAuth2Token = (token, bufferSeconds = 60) => {
    const now = new Date();
    const expiresAt = new Date(token.expires_at);
    const bufferMs = bufferSeconds * 1000;
    return expiresAt.getTime() - now.getTime() > bufferMs;
};
exports.validateOAuth2Token = validateOAuth2Token;
/**
 * 10. Generates random state for OAuth2 CSRF protection.
 *
 * @returns {string} Random state string
 *
 * @example
 * ```typescript
 * const state = generateRandomState();
 * ```
 */
const generateRandomState = () => {
    return (0, crypto_1.randomBytes)(32).toString('hex');
};
exports.generateRandomState = generateRandomState;
// ============================================================================
// 3. WEBHOOK MANAGEMENT AND VALIDATION
// ============================================================================
/**
 * 11. Creates a webhook configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     WebhookConfig:
 *       type: object
 *       required:
 *         - id
 *         - url
 *         - events
 *         - secret
 *       properties:
 *         id:
 *           type: string
 *         url:
 *           type: string
 *         events:
 *           type: array
 *           items:
 *             type: string
 *         secret:
 *           type: string
 *         active:
 *           type: boolean
 *
 * @param {Partial<WebhookConfig>} config - Webhook configuration
 * @returns {WebhookConfig} Complete webhook configuration
 *
 * @example
 * ```typescript
 * const webhook = createWebhookConfig({
 *   url: 'https://app.example.com/webhooks/events',
 *   events: ['patient.created', 'appointment.updated'],
 *   secret: 'webhook_secret_key'
 * });
 * ```
 */
const createWebhookConfig = (config) => {
    return {
        id: config.id || `webhook-${Date.now()}`,
        url: config.url || '',
        events: config.events || [],
        secret: config.secret || (0, exports.generateWebhookSecret)(),
        active: config.active !== false,
        retryConfig: config.retryConfig,
        headers: config.headers,
        signatureHeader: config.signatureHeader || 'X-Webhook-Signature',
        signatureAlgorithm: config.signatureAlgorithm || 'sha256',
    };
};
exports.createWebhookConfig = createWebhookConfig;
/**
 * 12. Generates webhook signature for payload.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @param {string} [algorithm] - Signature algorithm
 * @returns {string} Signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, 'secret123', 'sha256');
 * ```
 */
const generateWebhookSignature = (payload, secret, algorithm = 'sha256') => {
    const payloadString = JSON.stringify(payload);
    const hmac = (0, crypto_1.createHmac)(algorithm, secret);
    hmac.update(payloadString);
    return hmac.digest('hex');
};
exports.generateWebhookSignature = generateWebhookSignature;
/**
 * 13. Validates webhook signature.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} receivedSignature - Signature from header
 * @param {string} secret - Webhook secret
 * @param {string} [algorithm] - Signature algorithm
 * @returns {WebhookValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateWebhookSignature(
 *   payload,
 *   req.headers['x-webhook-signature'],
 *   'secret123'
 * );
 * if (!validation.valid) {
 *   throw new Error('Invalid webhook signature');
 * }
 * ```
 */
const validateWebhookSignature = (payload, receivedSignature, secret, algorithm = 'sha256') => {
    const expectedSignature = (0, exports.generateWebhookSignature)(payload, secret, algorithm);
    const valid = secureCompare(receivedSignature, expectedSignature);
    return {
        valid,
        signature: expectedSignature,
        errors: valid ? undefined : ['Signature mismatch'],
    };
};
exports.validateWebhookSignature = validateWebhookSignature;
/**
 * 14. Delivers webhook payload to URL.
 *
 * @param {WebhookConfig} config - Webhook configuration
 * @param {WebhookPayload} payload - Payload to send
 * @returns {Promise<{ success: boolean; response?: any; error?: any }>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhook(webhookConfig, {
 *   event: 'patient.created',
 *   timestamp: new Date(),
 *   data: patientData
 * });
 * ```
 */
const deliverWebhook = async (config, payload) => {
    const signature = (0, exports.generateWebhookSignature)(payload, config.secret, config.signatureAlgorithm);
    const headers = {
        'Content-Type': 'application/json',
        [config.signatureHeader]: signature,
        ...config.headers,
    };
    try {
        // Placeholder for actual HTTP POST - would use axios or fetch
        return { success: true, response: { status: 200 } };
    }
    catch (error) {
        return { success: false, error };
    }
};
exports.deliverWebhook = deliverWebhook;
/**
 * 15. Generates secure webhook secret.
 *
 * @returns {string} Webhook secret
 *
 * @example
 * ```typescript
 * const secret = generateWebhookSecret();
 * ```
 */
const generateWebhookSecret = () => {
    return (0, crypto_1.randomBytes)(32).toString('base64');
};
exports.generateWebhookSecret = generateWebhookSecret;
// ============================================================================
// 4. DATA TRANSFORMATION AND MAPPING
// ============================================================================
/**
 * 16. Creates a data mapping configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     DataMapping:
 *       type: object
 *       required:
 *         - sourceField
 *         - targetField
 *       properties:
 *         sourceField:
 *           type: string
 *         targetField:
 *           type: string
 *         defaultValue:
 *           type: any
 *         required:
 *           type: boolean
 *
 * @param {Partial<DataMapping>} mapping - Mapping configuration
 * @returns {DataMapping} Complete mapping
 *
 * @example
 * ```typescript
 * const mapping = createDataMapping({
 *   sourceField: 'patient_name',
 *   targetField: 'name',
 *   transform: (value) => value.toUpperCase(),
 *   required: true
 * });
 * ```
 */
const createDataMapping = (mapping) => {
    return {
        sourceField: mapping.sourceField || '',
        targetField: mapping.targetField || '',
        transform: mapping.transform,
        defaultValue: mapping.defaultValue,
        required: mapping.required || false,
    };
};
exports.createDataMapping = createDataMapping;
/**
 * 17. Applies data mappings to transform source to target.
 *
 * @param {Record<string, any>} source - Source data
 * @param {DataMapping[]} mappings - Mapping configurations
 * @param {Record<string, any>} [options] - Transformation options
 * @returns {Record<string, any>} Transformed data
 *
 * @example
 * ```typescript
 * const transformed = applyDataMappings(sourceData, [
 *   { sourceField: 'first_name', targetField: 'firstName' },
 *   { sourceField: 'last_name', targetField: 'lastName' }
 * ]);
 * ```
 */
const applyDataMappings = (source, mappings, options) => {
    const target = {};
    const context = {
        source,
        target,
        options,
    };
    mappings.forEach((mapping) => {
        let value = (0, exports.getNestedValue)(source, mapping.sourceField);
        // Apply default value if source is undefined/null
        if (value === undefined || value === null) {
            if (mapping.defaultValue !== undefined) {
                value = mapping.defaultValue;
            }
            else if (mapping.required) {
                throw new Error(`Required field ${mapping.sourceField} is missing`);
            }
            else {
                return; // Skip this mapping
            }
        }
        // Apply transformation if provided
        if (mapping.transform) {
            value = mapping.transform(value, context);
        }
        (0, exports.setNestedValue)(target, mapping.targetField, value);
    });
    return target;
};
exports.applyDataMappings = applyDataMappings;
/**
 * 18. Gets nested value from object using dot notation.
 *
 * @param {Record<string, any>} obj - Source object
 * @param {string} path - Dot-notation path
 * @returns {any} Value at path
 *
 * @example
 * ```typescript
 * const value = getNestedValue({ user: { name: 'John' } }, 'user.name');
 * // Returns: "John"
 * ```
 */
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};
exports.getNestedValue = getNestedValue;
/**
 * 19. Sets nested value in object using dot notation.
 *
 * @param {Record<string, any>} obj - Target object
 * @param {string} path - Dot-notation path
 * @param {any} value - Value to set
 *
 * @example
 * ```typescript
 * const obj = {};
 * setNestedValue(obj, 'user.profile.name', 'John');
 * // obj = { user: { profile: { name: 'John' } } }
 * ```
 */
const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        return current[key];
    }, obj);
    target[lastKey] = value;
};
exports.setNestedValue = setNestedValue;
/**
 * 20. Creates common data transformation functions.
 *
 * @returns {Record<string, TransformFunction>} Transform functions
 *
 * @example
 * ```typescript
 * const transforms = createTransformFunctions();
 * const upperName = transforms.toUpperCase('john');
 * ```
 */
const createTransformFunctions = () => {
    return {
        toUpperCase: (value) => String(value).toUpperCase(),
        toLowerCase: (value) => String(value).toLowerCase(),
        trim: (value) => String(value).trim(),
        toNumber: (value) => Number(value),
        toBoolean: (value) => Boolean(value),
        toDate: (value) => new Date(value),
        toString: (value) => String(value),
        parseJSON: (value) => JSON.parse(value),
        stringifyJSON: (value) => JSON.stringify(value),
        splitString: (value, delimiter = ',') => String(value).split(delimiter),
        joinArray: (value, delimiter = ',') => value.join(delimiter),
    };
};
exports.createTransformFunctions = createTransformFunctions;
// ============================================================================
// 5. INTEGRATION ERROR HANDLING AND RETRY LOGIC
// ============================================================================
/**
 * 21. Creates an integration error object.
 *
 * @swagger
 * components:
 *   schemas:
 *     IntegrationError:
 *       type: object
 *       required:
 *         - code
 *         - message
 *         - retryable
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         retryable:
 *           type: boolean
 *         details:
 *           type: object
 *
 * @param {any} error - Original error
 * @param {any} [context] - Error context
 * @returns {IntegrationError} Integration error
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall();
 * } catch (err) {
 *   throw createIntegrationError(err, { endpoint: '/patients' });
 * }
 * ```
 */
const createIntegrationError = (error, context) => {
    return {
        code: error.code || 'INTEGRATION_ERROR',
        message: error.message || 'An integration error occurred',
        details: { ...error, context },
        retryable: (0, exports.isRetryableError)(error),
        timestamp: new Date(),
        requestId: context?.requestId,
    };
};
exports.createIntegrationError = createIntegrationError;
/**
 * 22. Determines if error is retryable.
 *
 * @param {any} error - Error to check
 * @param {RetryConfig} [config] - Retry configuration
 * @returns {boolean} True if retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error, retryConfig)) {
 *   await retry();
 * }
 * ```
 */
const isRetryableError = (error, config) => {
    // Network errors are usually retryable
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        return true;
    }
    // Check status codes if available
    if (error.response?.status) {
        const status = error.response.status;
        const retryableStatusCodes = config?.retryableStatusCodes || [408, 429, 500, 502, 503, 504];
        return retryableStatusCodes.includes(status);
    }
    // Check custom retryable errors
    if (config?.retryableErrors) {
        return config.retryableErrors.some((code) => error.code === code);
    }
    return false;
};
exports.isRetryableError = isRetryableError;
/**
 * 23. Calculates retry delay with backoff strategy.
 *
 * @param {number} attemptNumber - Current attempt number (0-indexed)
 * @param {RetryConfig} config - Retry configuration
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(2, {
 *   retryDelay: 1000,
 *   backoffStrategy: 'exponential',
 *   maxRetryDelay: 30000
 * });
 * ```
 */
const calculateRetryDelay = (attemptNumber, config) => {
    let delay;
    switch (config.backoffStrategy) {
        case 'exponential':
            delay = config.retryDelay * Math.pow(2, attemptNumber);
            break;
        case 'linear':
            delay = config.retryDelay * (attemptNumber + 1);
            break;
        case 'fixed':
        default:
            delay = config.retryDelay;
    }
    if (config.maxRetryDelay) {
        delay = Math.min(delay, config.maxRetryDelay);
    }
    return delay;
};
exports.calculateRetryDelay = calculateRetryDelay;
/**
 * 24. Executes function with retry logic.
 *
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   () => apiConnector.get('/data'),
 *   { maxRetries: 3, retryDelay: 1000, backoffStrategy: 'exponential' }
 * );
 * ```
 */
const executeWithRetry = async (fn, config) => {
    let lastError;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt < config.maxRetries && (0, exports.isRetryableError)(error, config)) {
                const delay = (0, exports.calculateRetryDelay)(attempt, config);
                await sleep(delay);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
};
exports.executeWithRetry = executeWithRetry;
/**
 * 25. Circuit breaker for failing integrations.
 *
 * @param {string} integrationName - Integration identifier
 * @returns {any} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker('ehr-api');
 * const result = await breaker.execute(() => apiCall());
 * ```
 */
const createCircuitBreaker = (integrationName) => {
    let state = 'closed';
    let failures = 0;
    let lastFailureTime = null;
    const failureThreshold = 5;
    const resetTimeout = 60000; // 1 minute
    return {
        async execute(fn) {
            if (state === 'open') {
                const now = new Date();
                if (lastFailureTime && now.getTime() - lastFailureTime.getTime() > resetTimeout) {
                    state = 'half-open';
                    failures = 0;
                }
                else {
                    throw new Error(`Circuit breaker open for ${integrationName}`);
                }
            }
            try {
                const result = await fn();
                if (state === 'half-open') {
                    state = 'closed';
                    failures = 0;
                }
                return result;
            }
            catch (error) {
                failures++;
                lastFailureTime = new Date();
                if (failures >= failureThreshold) {
                    state = 'open';
                }
                throw error;
            }
        },
        getState: () => state,
        getFailures: () => failures,
    };
};
exports.createCircuitBreaker = createCircuitBreaker;
// ============================================================================
// 6. RATE LIMITING FOR EXTERNAL APIS
// ============================================================================
/**
 * 26. Initializes rate limit state.
 *
 * @param {RateLimitConfig} [config] - Rate limit configuration
 * @returns {RateLimitState} Initial state
 *
 * @example
 * ```typescript
 * const state = initializeRateLimitState({
 *   maxRequests: 100,
 *   windowMs: 60000
 * });
 * ```
 */
const initializeRateLimitState = (config) => {
    return {
        requests: [],
        tokens: config?.maxRequests || 100,
        lastRefill: new Date(),
    };
};
exports.initializeRateLimitState = initializeRateLimitState;
/**
 * 27. Enforces rate limit before making request.
 *
 * @param {RateLimitState} state - Current rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Promise<void>} Resolves when request can proceed
 *
 * @example
 * ```typescript
 * await enforceRateLimit(rateLimitState, rateLimitConfig);
 * // Now safe to make API request
 * ```
 */
const enforceRateLimit = async (state, config) => {
    const now = Date.now();
    if (config.strategy === 'token-bucket') {
        // Token bucket algorithm
        const elapsed = now - state.lastRefill.getTime();
        const tokensToAdd = Math.floor((elapsed / config.windowMs) * config.maxRequests);
        if (tokensToAdd > 0) {
            state.tokens = Math.min(config.maxRequests, state.tokens + tokensToAdd);
            state.lastRefill = new Date(now);
        }
        if (state.tokens <= 0) {
            const waitTime = config.windowMs - (now - state.lastRefill.getTime());
            await sleep(waitTime);
            state.tokens = config.maxRequests;
            state.lastRefill = new Date();
        }
        state.tokens--;
    }
    else {
        // Sliding window algorithm
        const windowStart = now - config.windowMs;
        state.requests = state.requests.filter((time) => time > windowStart);
        if (state.requests.length >= config.maxRequests) {
            const oldestRequest = state.requests[0];
            const waitTime = oldestRequest + config.windowMs - now;
            await sleep(waitTime);
            state.requests = state.requests.filter((time) => time > Date.now() - config.windowMs);
        }
        state.requests.push(now);
    }
};
exports.enforceRateLimit = enforceRateLimit;
/**
 * 28. Gets current rate limit status.
 *
 * @param {RateLimitState} state - Rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {any} Rate limit status
 *
 * @example
 * ```typescript
 * const status = getRateLimitStatus(state, config);
 * console.log(`Remaining: ${status.remaining}/${status.limit}`);
 * ```
 */
const getRateLimitStatus = (state, config) => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    if (config.strategy === 'token-bucket') {
        return {
            limit: config.maxRequests,
            remaining: state.tokens,
            resetAt: new Date(state.lastRefill.getTime() + config.windowMs),
        };
    }
    else {
        const activeRequests = state.requests.filter((time) => time > windowStart);
        return {
            limit: config.maxRequests,
            remaining: config.maxRequests - activeRequests.length,
            resetAt: new Date(windowStart + config.windowMs),
        };
    }
};
exports.getRateLimitStatus = getRateLimitStatus;
/**
 * 29. Creates rate limiter middleware.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {any} Rate limiter middleware
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   maxRequests: 1000,
 *   windowMs: 3600000 // 1 hour
 * });
 * ```
 */
const createRateLimiter = (config) => {
    const state = (0, exports.initializeRateLimitState)(config);
    return {
        async checkLimit() {
            await (0, exports.enforceRateLimit)(state, config);
            return true;
        },
        getStatus: () => (0, exports.getRateLimitStatus)(state, config),
    };
};
exports.createRateLimiter = createRateLimiter;
/**
 * 30. Handles rate limit exceeded response.
 *
 * @param {any} response - API response
 * @returns {number} Retry after seconds
 *
 * @example
 * ```typescript
 * const retryAfter = handleRateLimitResponse(response);
 * await sleep(retryAfter * 1000);
 * ```
 */
const handleRateLimitResponse = (response) => {
    if (response.headers['retry-after']) {
        return parseInt(response.headers['retry-after'], 10);
    }
    if (response.headers['x-ratelimit-reset']) {
        const resetTime = parseInt(response.headers['x-ratelimit-reset'], 10);
        const now = Math.floor(Date.now() / 1000);
        return Math.max(0, resetTime - now);
    }
    return 60; // Default to 60 seconds
};
exports.handleRateLimitResponse = handleRateLimitResponse;
// ============================================================================
// 7. INTEGRATION HEALTH MONITORING
// ============================================================================
/**
 * 31. Performs health check on API integration.
 *
 * @swagger
 * /api/integrations/{integrationId}/health:
 *   get:
 *     summary: Check integration health
 *     parameters:
 *       - name: integrationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Health check result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResult'
 *
 * @param {APIConnectorConfig} config - Connector configuration
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const health = await checkAPIHealth(connectorConfig);
 * if (health.status === 'down') {
 *   alert('Integration is down!');
 * }
 * ```
 */
const checkAPIHealth = async (config) => {
    const startTime = Date.now();
    try {
        const endpoint = config.healthCheckEndpoint || '/health';
        // Placeholder for actual health check request
        const latency = Date.now() - startTime;
        return {
            healthy: true,
            status: latency < 1000 ? 'operational' : 'degraded',
            latency,
            lastChecked: new Date(),
            details: {
                endpoint,
                baseURL: config.baseURL,
            },
        };
    }
    catch (error) {
        return {
            healthy: false,
            status: 'down',
            lastChecked: new Date(),
            errors: [error.message],
        };
    }
};
exports.checkAPIHealth = checkAPIHealth;
/**
 * 32. Monitors integration performance metrics.
 *
 * @param {string} integrationName - Integration identifier
 * @returns {any} Performance monitor
 *
 * @example
 * ```typescript
 * const monitor = createPerformanceMonitor('ehr-api');
 * monitor.recordRequest(200, 250);
 * const metrics = monitor.getMetrics();
 * ```
 */
const createPerformanceMonitor = (integrationName) => {
    const metrics = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalLatency: 0,
        requestsByStatus: new Map(),
    };
    return {
        recordRequest(statusCode, latency) {
            metrics.totalRequests++;
            metrics.totalLatency += latency;
            if (statusCode >= 200 && statusCode < 300) {
                metrics.successfulRequests++;
            }
            else {
                metrics.failedRequests++;
            }
            const count = metrics.requestsByStatus.get(statusCode) || 0;
            metrics.requestsByStatus.set(statusCode, count + 1);
        },
        getMetrics() {
            return {
                integrationName,
                totalRequests: metrics.totalRequests,
                successRate: metrics.totalRequests > 0
                    ? (metrics.successfulRequests / metrics.totalRequests) * 100
                    : 0,
                averageLatency: metrics.totalRequests > 0 ? metrics.totalLatency / metrics.totalRequests : 0,
                requestsByStatus: Object.fromEntries(metrics.requestsByStatus),
            };
        },
        reset() {
            metrics.totalRequests = 0;
            metrics.successfulRequests = 0;
            metrics.failedRequests = 0;
            metrics.totalLatency = 0;
            metrics.requestsByStatus.clear();
        },
    };
};
exports.createPerformanceMonitor = createPerformanceMonitor;
/**
 * 33. Creates integration status dashboard data.
 *
 * @param {HealthCheckResult[]} healthChecks - Health check results
 * @returns {any} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = createIntegrationDashboard([health1, health2, health3]);
 * ```
 */
const createIntegrationDashboard = (healthChecks) => {
    const total = healthChecks.length;
    const healthy = healthChecks.filter((h) => h.healthy).length;
    const operational = healthChecks.filter((h) => h.status === 'operational').length;
    const degraded = healthChecks.filter((h) => h.status === 'degraded').length;
    const down = healthChecks.filter((h) => h.status === 'down').length;
    return {
        summary: {
            total,
            healthy,
            healthyPercentage: (healthy / total) * 100,
        },
        statusBreakdown: {
            operational,
            degraded,
            down,
        },
        integrations: healthChecks,
    };
};
exports.createIntegrationDashboard = createIntegrationDashboard;
/**
 * 34. Logs integration activity.
 *
 * @param {string} integrationName - Integration identifier
 * @param {string} action - Action performed
 * @param {any} [details] - Additional details
 *
 * @example
 * ```typescript
 * logIntegrationActivity('ehr-api', 'patient_fetch', {
 *   patientId: '12345',
 *   status: 'success'
 * });
 * ```
 */
const logIntegrationActivity = (integrationName, action, details) => {
    const logEntry = {
        timestamp: new Date(),
        integration: integrationName,
        action,
        details,
    };
    console.log('[Integration Activity]', JSON.stringify(logEntry));
};
exports.logIntegrationActivity = logIntegrationActivity;
/**
 * 35. Tracks integration quota usage.
 *
 * @param {string} integrationName - Integration identifier
 * @param {number} quota - Total quota
 * @returns {any} Quota tracker
 *
 * @example
 * ```typescript
 * const tracker = createQuotaTracker('api', 10000);
 * tracker.increment(10);
 * console.log(tracker.getUsage());
 * ```
 */
const createQuotaTracker = (integrationName, quota) => {
    let used = 0;
    return {
        increment(amount = 1) {
            used += amount;
            if (used > quota) {
                throw new Error(`Quota exceeded for ${integrationName}`);
            }
        },
        getUsage() {
            return {
                quota,
                used,
                remaining: quota - used,
                percentageUsed: (used / quota) * 100,
            };
        },
        reset() {
            used = 0;
        },
    };
};
exports.createQuotaTracker = createQuotaTracker;
// ============================================================================
// 8. BULK DATA SYNC UTILITIES
// ============================================================================
/**
 * 36. Creates a data synchronization configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     SyncConfig:
 *       type: object
 *       required:
 *         - source
 *         - target
 *         - batchSize
 *         - syncMode
 *         - mappings
 *       properties:
 *         source:
 *           type: string
 *         target:
 *           type: string
 *         batchSize:
 *           type: number
 *         syncMode:
 *           type: string
 *           enum: [full, incremental, delta]
 *
 * @param {Partial<SyncConfig>} config - Sync configuration
 * @returns {SyncConfig} Complete sync configuration
 *
 * @example
 * ```typescript
 * const syncConfig = createSyncConfig({
 *   source: 'external-ehr',
 *   target: 'local-db',
 *   batchSize: 100,
 *   syncMode: 'incremental',
 *   mappings: [...]
 * });
 * ```
 */
const createSyncConfig = (config) => {
    return {
        source: config.source || '',
        target: config.target || '',
        batchSize: config.batchSize || 100,
        syncMode: config.syncMode || 'incremental',
        conflictResolution: config.conflictResolution || 'latest-wins',
        filters: config.filters,
        mappings: config.mappings || [],
    };
};
exports.createSyncConfig = createSyncConfig;
/**
 * 37. Performs bulk data synchronization.
 *
 * @param {SyncConfig} config - Sync configuration
 * @param {any} sourceConnector - Source API connector
 * @param {any} targetConnector - Target API connector
 * @returns {Promise<SyncResult>} Sync result
 *
 * @example
 * ```typescript
 * const result = await performBulkSync(syncConfig, sourceAPI, targetAPI);
 * console.log(`Synced ${result.recordsProcessed} records`);
 * ```
 */
const performBulkSync = async (config, sourceConnector, targetConnector) => {
    const syncId = `sync-${Date.now()}`;
    const startTime = new Date();
    let recordsProcessed = 0;
    let recordsCreated = 0;
    let recordsUpdated = 0;
    let recordsFailed = 0;
    const errors = [];
    try {
        // Fetch data from source in batches
        let hasMore = true;
        let offset = 0;
        while (hasMore) {
            const batch = await fetchSourceBatch(sourceConnector, offset, config.batchSize);
            if (!batch || batch.length === 0) {
                hasMore = false;
                break;
            }
            // Transform data using mappings
            const transformedBatch = batch.map((record) => (0, exports.applyDataMappings)(record, config.mappings));
            // Sync to target
            for (const record of transformedBatch) {
                try {
                    const result = await syncRecord(targetConnector, record, config.conflictResolution);
                    recordsProcessed++;
                    if (result.created)
                        recordsCreated++;
                    if (result.updated)
                        recordsUpdated++;
                }
                catch (error) {
                    recordsFailed++;
                    errors.push((0, exports.createIntegrationError)(error, { record }));
                }
            }
            offset += config.batchSize;
        }
        return {
            syncId,
            status: recordsFailed === 0 ? 'completed' : 'partial',
            startTime,
            endTime: new Date(),
            recordsProcessed,
            recordsCreated,
            recordsUpdated,
            recordsFailed,
            errors,
        };
    }
    catch (error) {
        return {
            syncId,
            status: 'failed',
            startTime,
            endTime: new Date(),
            recordsProcessed,
            recordsCreated,
            recordsUpdated,
            recordsFailed,
            errors: [(0, exports.createIntegrationError)(error)],
        };
    }
};
exports.performBulkSync = performBulkSync;
/**
 * 38. Fetches batch of records from source.
 *
 * @param {any} connector - Source connector
 * @param {number} offset - Offset for pagination
 * @param {number} limit - Batch size
 * @returns {Promise<any[]>} Batch of records
 */
const fetchSourceBatch = async (connector, offset, limit) => {
    // Placeholder - would make actual API call
    return [];
};
/**
 * 39. Syncs individual record to target with conflict resolution.
 *
 * @param {any} connector - Target connector
 * @param {any} record - Record to sync
 * @param {string} conflictResolution - Conflict resolution strategy
 * @returns {Promise<{ created: boolean; updated: boolean }>} Sync result
 */
const syncRecord = async (connector, record, conflictResolution) => {
    // Placeholder - would implement actual sync logic
    return { created: true, updated: false };
};
/**
 * 40. Schedules periodic data synchronization.
 *
 * @param {SyncConfig} config - Sync configuration
 * @param {string} schedule - Cron schedule expression
 * @returns {any} Scheduled sync job
 *
 * @example
 * ```typescript
 * const job = schedulePeriodicSync(syncConfig, '0 * * * *'); // Every hour
 * ```
 */
const schedulePeriodicSync = (config, schedule) => {
    return {
        config,
        schedule,
        enabled: true,
        lastRun: null,
        nextRun: calculateNextSyncTime(schedule),
        execute: async (sourceConnector, targetConnector) => {
            return (0, exports.performBulkSync)(config, sourceConnector, targetConnector);
        },
        disable() {
            this.enabled = false;
        },
        enable() {
            this.enabled = true;
        },
    };
};
exports.schedulePeriodicSync = schedulePeriodicSync;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Validates URL format.
 */
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
/**
 * Helper: Sleeps for specified milliseconds.
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
/**
 * Helper: Secure string comparison to prevent timing attacks.
 */
const secureCompare = (a, b) => {
    if (a.length !== b.length)
        return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
};
/**
 * Helper: Generates PKCE code verifier.
 */
const generateCodeVerifier = () => {
    return (0, crypto_1.randomBytes)(32).toString('base64url');
};
/**
 * Helper: Generates PKCE code challenge from verifier.
 */
const generateCodeChallenge = (verifier) => {
    return (0, crypto_1.createHash)('sha256').update(verifier).digest('base64url');
};
/**
 * Helper: Calculates next sync time from cron schedule.
 */
const calculateNextSyncTime = (schedule) => {
    // Placeholder - would use cron parser library
    return new Date(Date.now() + 3600000); // 1 hour from now
};
//# sourceMappingURL=integration-connectors-kit.js.map