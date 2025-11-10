/**
 * LOC: APIGATEWAY001
 * File: /reuse/threat/composites/downstream/api-gateway-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-intelligence-api-composite
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/throttler
 *
 * DOWNSTREAM (imported by):
 *   - API gateway infrastructure
 *   - Load balancers
 *   - Rate limiting services
 *   - Request routing systems
 */

/**
 * File: /reuse/threat/composites/downstream/api-gateway-services.ts
 * Locator: WC-DOWNSTREAM-APIGATEWAY-001
 * Purpose: API Gateway Services - Enterprise-grade API gateway with rate limiting, authentication, and routing
 *
 * Upstream: threat-intelligence-api-composite
 * Downstream: Gateway infrastructure, Load balancers, Security middleware
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, @nestjs/throttler
 * Exports: Comprehensive API gateway service with advanced routing, rate limiting, and security
 *
 * LLM Context: Production-ready API gateway service for White Cross healthcare threat intelligence platform.
 * Provides enterprise-grade API gateway functionality including request routing, rate limiting, authentication,
 * authorization, request/response transformation, circuit breakers, health checks, service discovery,
 * and comprehensive logging. HIPAA-compliant with audit trails and security monitoring.
 */

import { Injectable, Logger, NestMiddleware, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';

// Import from threat intelligence API composite
import {
  initializeThreatApiGateway,
  validateApiAuthentication,
  applyApiRateLimit,
  deliverWebhookEvent,
  manageApiVersionLifecycle,
  transformApiRequestBetweenVersions,
  sanitizeApiResponseForVersion,
  trackApiUsageMetrics,
  detectApiUsageAnomalies,
  type ThreatApiConfig,
  type ApiContext,
  type RateLimitConfig,
} from '../threat-intelligence-api-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Gateway configuration
 */
export interface GatewayConfig {
  port: number;
  host: string;
  basePath: string;
  cors: CORSConfig;
  rateLimit: RateLimitConfig;
  authentication: AuthenticationConfig;
  routes: GatewayRoute[];
  circuitBreaker: CircuitBreakerConfig;
  healthCheck: HealthCheckConfig;
}

/**
 * CORS configuration
 */
export interface CORSConfig {
  enabled: boolean;
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
  preflightContinue: boolean;
}

/**
 * Authentication configuration
 */
export interface AuthenticationConfig {
  enabled: boolean;
  type: 'jwt' | 'api_key' | 'oauth2' | 'mutual_tls';
  jwtSecret?: string;
  jwtExpiration?: number;
  apiKeyHeader?: string;
  oauth2Config?: OAuth2Config;
}

/**
 * OAuth2 configuration
 */
export interface OAuth2Config {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
}

/**
 * Gateway route configuration
 */
export interface GatewayRoute {
  path: string;
  methods: string[];
  upstream: UpstreamService;
  middleware: string[];
  rateLimit?: RateLimitConfig;
  authentication?: boolean;
  transformation?: RouteTransformation;
  caching?: CachingConfig;
}

/**
 * Upstream service configuration
 */
export interface UpstreamService {
  name: string;
  url: string;
  timeout: number;
  retries: number;
  healthCheck: string;
  loadBalancing: LoadBalancingStrategy;
  instances: ServiceInstance[];
}

/**
 * Service instance
 */
export interface ServiceInstance {
  id: string;
  url: string;
  weight: number;
  healthy: boolean;
  lastHealthCheck?: Date;
}

/**
 * Load balancing strategy
 */
export type LoadBalancingStrategy = 'round_robin' | 'least_connections' | 'random' | 'weighted';

/**
 * Route transformation
 */
export interface RouteTransformation {
  requestTransform?: RequestTransform;
  responseTransform?: ResponseTransform;
}

/**
 * Request transformation
 */
export interface RequestTransform {
  addHeaders?: Record<string, string>;
  removeHeaders?: string[];
  modifyPath?: PathModification;
  modifyBody?: BodyModification;
}

/**
 * Response transformation
 */
export interface ResponseTransform {
  addHeaders?: Record<string, string>;
  removeHeaders?: string[];
  modifyBody?: BodyModification;
  statusCodeMapping?: Record<number, number>;
}

/**
 * Path modification
 */
export interface PathModification {
  prefix?: string;
  suffix?: string;
  replace?: { pattern: string; replacement: string };
}

/**
 * Body modification
 */
export interface BodyModification {
  addFields?: Record<string, any>;
  removeFields?: string[];
  transformFields?: Record<string, (value: any) => any>;
}

/**
 * Caching configuration
 */
export interface CachingConfig {
  enabled: boolean;
  ttl: number;
  keyGenerator: (req: any) => string;
  excludePaths?: string[];
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
}

/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half_open';
  failures: number;
  successes: number;
  lastFailure?: Date;
  nextReset?: Date;
}

/**
 * Health check configuration
 */
export interface HealthCheckConfig {
  enabled: boolean;
  interval: number;
  timeout: number;
  unhealthyThreshold: number;
  healthyThreshold: number;
  endpoints: HealthCheckEndpoint[];
}

/**
 * Health check endpoint
 */
export interface HealthCheckEndpoint {
  name: string;
  url: string;
  method: string;
  expectedStatus: number;
  timeout: number;
}

/**
 * Gateway metrics
 */
export interface GatewayMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  p95Latency: number;
  p99Latency: number;
  rateLimitedRequests: number;
  authenticationFailures: number;
  circuitBreakerTrips: number;
  cacheHits: number;
  cacheMisses: number;
}

// ============================================================================
// NESTJS SERVICE - API GATEWAY
// ============================================================================

@Injectable()
@ApiTags('API Gateway Services')
export class ApiGatewayService {
  private readonly logger = new Logger(ApiGatewayService.name);
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private metrics: GatewayMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageLatency: 0,
    p95Latency: 0,
    p99Latency: 0,
    rateLimitedRequests: 0,
    authenticationFailures: 0,
    circuitBreakerTrips: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  constructor(private readonly gatewayConfig: GatewayConfig) {}

  /**
   * Initialize API gateway
   */
  @ApiOperation({ summary: 'Initialize API gateway with configuration' })
  @ApiResponse({ status: 200, description: 'Gateway initialized successfully' })
  async initialize(config: ThreatApiConfig): Promise<void> {
    this.logger.log('Initializing API gateway');

    try {
      // Initialize threat API gateway
      const { apiKey, rateLimiter, version } = await initializeThreatApiGateway(config);

      this.logger.log(`API gateway initialized with version ${version.version}`);

      // Initialize circuit breakers for each upstream service
      for (const route of this.gatewayConfig.routes) {
        this.initializeCircuitBreaker(route.upstream.name);
      }

      // Start health checks
      if (this.gatewayConfig.healthCheck.enabled) {
        this.startHealthChecks();
      }

      this.logger.log('API gateway initialization complete');
    } catch (error) {
      this.logger.error(`Failed to initialize API gateway: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process incoming request through gateway
   */
  @ApiOperation({ summary: 'Process request through API gateway' })
  @ApiResponse({ status: 200, description: 'Request processed successfully' })
  async processRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.metrics.totalRequests++;

      // Find matching route
      const route = this.findMatchingRoute(req.path, req.method);
      if (!route) {
        res.status(404).json({ error: 'Route not found' });
        return;
      }

      // Apply authentication
      if (route.authentication !== false) {
        const authResult = await this.authenticateRequest(req);
        if (!authResult.valid) {
          this.metrics.authenticationFailures++;
          res.status(401).json({ error: 'Authentication failed', details: authResult.errors });
          return;
        }
      }

      // Apply rate limiting
      const rateLimitResult = await this.applyRateLimiting(req, route);
      if (!rateLimitResult.allowed) {
        this.metrics.rateLimitedRequests++;
        res.status(429).json({ error: 'Rate limit exceeded', retryAfter: rateLimitResult.resetAt });
        return;
      }

      // Check cache
      if (route.caching?.enabled && req.method === 'GET') {
        const cachedResponse = this.getFromCache(route.caching.keyGenerator(req));
        if (cachedResponse) {
          this.metrics.cacheHits++;
          res.json(cachedResponse);
          return;
        }
        this.metrics.cacheMisses++;
      }

      // Check circuit breaker
      const circuitBreaker = this.circuitBreakers.get(route.upstream.name);
      if (circuitBreaker && circuitBreaker.state === 'open') {
        this.metrics.circuitBreakerTrips++;
        res.status(503).json({ error: 'Service temporarily unavailable' });
        return;
      }

      // Transform request
      if (route.transformation?.requestTransform) {
        this.transformRequest(req, route.transformation.requestTransform);
      }

      // Forward to upstream service
      const upstreamResponse = await this.forwardToUpstream(req, route);

      // Transform response
      if (route.transformation?.responseTransform) {
        this.transformResponse(upstreamResponse, route.transformation.responseTransform);
      }

      // Cache response if configured
      if (route.caching?.enabled && req.method === 'GET') {
        this.setCache(route.caching.keyGenerator(req), upstreamResponse.data, route.caching.ttl);
      }

      // Record success
      this.recordCircuitBreakerSuccess(route.upstream.name);
      this.metrics.successfulRequests++;

      // Send response
      res.status(upstreamResponse.status).json(upstreamResponse.data);

      // Record metrics
      const latency = Date.now() - startTime;
      this.updateMetrics(latency);

    } catch (error) {
      this.logger.error(`Request processing failed: ${error.message}`);
      this.metrics.failedRequests++;

      // Record circuit breaker failure
      const route = this.findMatchingRoute(req.path, req.method);
      if (route) {
        this.recordCircuitBreakerFailure(route.upstream.name);
      }

      res.status(500).json({ error: 'Internal gateway error', requestId });
    }
  }

  /**
   * Apply rate limiting to request
   */
  @ApiOperation({ summary: 'Apply rate limiting to API request' })
  async applyRateLimiting(req: Request, route: GatewayRoute): Promise<any> {
    const rateLimitConfig = route.rateLimit || this.gatewayConfig.rateLimit;
    const apiKeyId = this.extractApiKey(req) || req.ip;

    return await applyApiRateLimit(rateLimitConfig, apiKeyId, Date.now());
  }

  /**
   * Authenticate incoming request
   */
  @ApiOperation({ summary: 'Authenticate API request' })
  async authenticateRequest(req: Request): Promise<{ valid: boolean; errors: string[] }> {
    const apiKey = this.extractApiKey(req);
    if (!apiKey) {
      return { valid: false, errors: ['API key not provided'] };
    }

    // Extract required permissions from route
    const requiredPermissions = this.extractRequiredPermissions(req.path);

    return await validateApiAuthentication(apiKey, requiredPermissions);
  }

  /**
   * Forward request to upstream service
   */
  @ApiOperation({ summary: 'Forward request to upstream service' })
  async forwardToUpstream(req: Request, route: GatewayRoute): Promise<any> {
    const instance = this.selectUpstreamInstance(route.upstream);

    if (!instance) {
      throw new Error('No healthy upstream instances available');
    }

    try {
      // Use native fetch or axios
      const response = await fetch(`${instance.url}${req.path}`, {
        method: req.method,
        headers: this.prepareUpstreamHeaders(req),
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.json();

      return {
        status: response.status,
        data,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error) {
      this.logger.error(`Upstream request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Select upstream instance based on load balancing strategy
   */
  private selectUpstreamInstance(upstream: UpstreamService): ServiceInstance | null {
    const healthyInstances = upstream.instances.filter(i => i.healthy);

    if (healthyInstances.length === 0) {
      return null;
    }

    switch (upstream.loadBalancing) {
      case 'round_robin':
        return this.roundRobinSelection(healthyInstances);
      case 'random':
        return healthyInstances[Math.floor(Math.random() * healthyInstances.length)];
      case 'weighted':
        return this.weightedSelection(healthyInstances);
      case 'least_connections':
        return this.leastConnectionsSelection(healthyInstances);
      default:
        return healthyInstances[0];
    }
  }

  /**
   * Transform request according to configuration
   */
  private transformRequest(req: Request, transform: RequestTransform): void {
    // Add headers
    if (transform.addHeaders) {
      for (const [key, value] of Object.entries(transform.addHeaders)) {
        req.headers[key.toLowerCase()] = value;
      }
    }

    // Remove headers
    if (transform.removeHeaders) {
      for (const header of transform.removeHeaders) {
        delete req.headers[header.toLowerCase()];
      }
    }

    // Modify path
    if (transform.modifyPath) {
      if (transform.modifyPath.prefix) {
        req.url = transform.modifyPath.prefix + req.url;
      }
      if (transform.modifyPath.suffix) {
        req.url = req.url + transform.modifyPath.suffix;
      }
      if (transform.modifyPath.replace) {
        req.url = req.url.replace(
          new RegExp(transform.modifyPath.replace.pattern),
          transform.modifyPath.replace.replacement
        );
      }
    }

    // Modify body
    if (transform.modifyBody && req.body) {
      if (transform.modifyBody.addFields) {
        req.body = { ...req.body, ...transform.modifyBody.addFields };
      }
      if (transform.modifyBody.removeFields) {
        for (const field of transform.modifyBody.removeFields) {
          delete req.body[field];
        }
      }
    }
  }

  /**
   * Transform response according to configuration
   */
  private transformResponse(response: any, transform: ResponseTransform): void {
    // Add headers
    if (transform.addHeaders) {
      response.headers = { ...response.headers, ...transform.addHeaders };
    }

    // Remove headers
    if (transform.removeHeaders) {
      for (const header of transform.removeHeaders) {
        delete response.headers[header];
      }
    }

    // Modify body
    if (transform.modifyBody && response.data) {
      if (transform.modifyBody.addFields) {
        response.data = { ...response.data, ...transform.modifyBody.addFields };
      }
      if (transform.modifyBody.removeFields) {
        for (const field of transform.modifyBody.removeFields) {
          delete response.data[field];
        }
      }
    }

    // Map status code
    if (transform.statusCodeMapping && response.status in transform.statusCodeMapping) {
      response.status = transform.statusCodeMapping[response.status];
    }
  }

  /**
   * Initialize circuit breaker for service
   */
  private initializeCircuitBreaker(serviceName: string): void {
    this.circuitBreakers.set(serviceName, {
      state: 'closed',
      failures: 0,
      successes: 0,
    });
  }

  /**
   * Record circuit breaker success
   */
  private recordCircuitBreakerSuccess(serviceName: string): void {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) return;

    breaker.successes++;
    breaker.failures = 0;

    if (breaker.state === 'half_open' &&
        breaker.successes >= this.gatewayConfig.circuitBreaker.successThreshold) {
      breaker.state = 'closed';
      this.logger.log(`Circuit breaker for ${serviceName} closed`);
    }
  }

  /**
   * Record circuit breaker failure
   */
  private recordCircuitBreakerFailure(serviceName: string): void {
    const breaker = this.circuitBreakers.get(serviceName);
    if (!breaker) return;

    breaker.failures++;
    breaker.lastFailure = new Date();

    if (breaker.failures >= this.gatewayConfig.circuitBreaker.failureThreshold) {
      breaker.state = 'open';
      breaker.nextReset = new Date(Date.now() + this.gatewayConfig.circuitBreaker.resetTimeout);
      this.logger.warn(`Circuit breaker for ${serviceName} opened`);

      // Schedule half-open transition
      setTimeout(() => {
        if (breaker.state === 'open') {
          breaker.state = 'half_open';
          breaker.successes = 0;
          this.logger.log(`Circuit breaker for ${serviceName} half-open`);
        }
      }, this.gatewayConfig.circuitBreaker.resetTimeout);
    }
  }

  /**
   * Start health checks for upstream services
   */
  private startHealthChecks(): void {
    this.logger.log('Starting health checks');

    setInterval(async () => {
      for (const route of this.gatewayConfig.routes) {
        for (const instance of route.upstream.instances) {
          const healthy = await this.checkInstanceHealth(instance, route.upstream.healthCheck);
          instance.healthy = healthy;
          instance.lastHealthCheck = new Date();
        }
      }
    }, this.gatewayConfig.healthCheck.interval);
  }

  /**
   * Check health of service instance
   */
  private async checkInstanceHealth(instance: ServiceInstance, healthCheckPath: string): Promise<boolean> {
    try {
      const response = await fetch(`${instance.url}${healthCheckPath}`, {
        method: 'GET',
        signal: AbortSignal.timeout(this.gatewayConfig.healthCheck.timeout),
      });

      return response.ok;
    } catch (error) {
      this.logger.warn(`Health check failed for instance ${instance.id}: ${error.message}`);
      return false;
    }
  }

  /**
   * Get cached response
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cached response
   */
  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  /**
   * Find matching route for request
   */
  private findMatchingRoute(path: string, method: string): GatewayRoute | null {
    for (const route of this.gatewayConfig.routes) {
      if (this.pathMatches(path, route.path) && route.methods.includes(method)) {
        return route;
      }
    }
    return null;
  }

  /**
   * Check if path matches route pattern
   */
  private pathMatches(path: string, pattern: string): boolean {
    const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '$');
    return regex.test(path);
  }

  /**
   * Extract API key from request
   */
  private extractApiKey(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const apiKeyHeader = this.gatewayConfig.authentication.apiKeyHeader || 'x-api-key';
    return (req.headers[apiKeyHeader.toLowerCase()] as string) || null;
  }

  /**
   * Extract required permissions from path
   */
  private extractRequiredPermissions(path: string): string[] {
    // Extract permissions based on path pattern
    if (path.includes('/admin/')) return ['admin'];
    if (path.includes('/threats/')) return ['read:threats'];
    if (path.includes('/feeds/')) return ['read:feeds'];
    return ['read'];
  }

  /**
   * Prepare headers for upstream request
   */
  private prepareUpstreamHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Host': req.hostname,
      'X-Forwarded-Proto': req.protocol,
    };

    // Copy relevant headers
    const allowedHeaders = ['accept', 'accept-language', 'user-agent'];
    for (const header of allowedHeaders) {
      if (req.headers[header]) {
        headers[header] = req.headers[header] as string;
      }
    }

    return headers;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Round-robin instance selection
   */
  private roundRobinSelection(instances: ServiceInstance[]): ServiceInstance {
    // Simple round-robin - in production, maintain a counter
    return instances[Math.floor(Date.now() / 1000) % instances.length];
  }

  /**
   * Weighted instance selection
   */
  private weightedSelection(instances: ServiceInstance[]): ServiceInstance {
    const totalWeight = instances.reduce((sum, i) => sum + i.weight, 0);
    let random = Math.random() * totalWeight;

    for (const instance of instances) {
      random -= instance.weight;
      if (random <= 0) {
        return instance;
      }
    }

    return instances[0];
  }

  /**
   * Least connections instance selection
   */
  private leastConnectionsSelection(instances: ServiceInstance[]): ServiceInstance {
    // In production, track active connections per instance
    return instances[0];
  }

  /**
   * Update gateway metrics
   */
  private updateMetrics(latency: number): void {
    // Update average latency
    this.metrics.averageLatency =
      (this.metrics.averageLatency * (this.metrics.totalRequests - 1) + latency) /
      this.metrics.totalRequests;
  }

  /**
   * Get gateway metrics
   */
  @ApiOperation({ summary: 'Get API gateway metrics' })
  @ApiResponse({ status: 200, description: 'Gateway metrics retrieved' })
  getMetrics(): GatewayMetrics {
    return { ...this.metrics };
  }
}

// ============================================================================
// GATEWAY MIDDLEWARE
// ============================================================================

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(private readonly gatewayService: ApiGatewayService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.gatewayService.processRequest(req, res, next);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ApiGatewayService;
