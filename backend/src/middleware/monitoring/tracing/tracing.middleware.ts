/**
 * Tracing Middleware
 * 
 * Enterprise-grade distributed tracing middleware with healthcare compliance.
 * Provides request correlation, performance monitoring, and audit trails.
 * 
 * @module TracingMiddleware
 * @version 1.0.0
 */

import { IRequest, IResponse, IMiddleware, MiddlewareContext, HealthcareUser, INextFunction } from '../../utils/types/middleware.types';

/**
 * Trace span interface
 */
export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, any>;
  logs: TraceLog[];
  status: SpanStatus;
  context: SpanContext;
}

/**
 * Trace log entry
 */
export interface TraceLog {
  timestamp: number;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  fields?: Record<string, any>;
}

/**
 * Span status
 */
export enum SpanStatus {
  OK = 'OK',
  CANCELLED = 'CANCELLED',
  UNKNOWN = 'UNKNOWN',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  DEADLINE_EXCEEDED = 'DEADLINE_EXCEEDED',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  FAILED_PRECONDITION = 'FAILED_PRECONDITION',
  ABORTED = 'ABORTED',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  UNIMPLEMENTED = 'UNIMPLEMENTED',
  INTERNAL = 'INTERNAL',
  UNAVAILABLE = 'UNAVAILABLE',
  DATA_LOSS = 'DATA_LOSS'
}

/**
 * Span context for propagation
 */
export interface SpanContext {
  traceId: string;
  spanId: string;
  traceFlags: number;
  baggage: Record<string, string>;
}

/**
 * Configuration interface for tracing middleware
 */
export interface ITracingConfig {
  /** Enable distributed tracing */
  enabled: boolean;
  /** Service name for tracing */
  serviceName: string;
  /** Sampling rate (0.0 to 1.0) */
  sampleRate: number;
  /** Enable healthcare-specific tracing */
  enableHealthcareTracing: boolean;
  /** Enable performance tracing */
  enablePerformanceTracing: boolean;
  /** Enable database query tracing */
  enableDatabaseTracing: boolean;
  /** Enable external service tracing */
  enableExternalServiceTracing: boolean;
  /** Maximum span duration before timeout (ms) */
  maxSpanDuration: number;
  /** Batch export configuration */
  batchExport: {
    maxQueueSize: number;
    batchTimeout: number;
    maxExportBatchSize: number;
  };
  /** Custom tags to include in all spans */
  defaultTags: Record<string, string>;
  /** Sensitive fields to exclude from tracing */
  excludeFields: string[];
  /** Enable HIPAA-compliant tracing */
  hipaaCompliant: boolean;
  /** Trace export endpoint */
  exporterEndpoint?: string;
  /** Headers for trace export */
  exporterHeaders?: Record<string, string>;
}

/**
 * Default configuration for tracing middleware
 */
export const DEFAULT_TRACING_CONFIG: ITracingConfig = {
  enabled: true,
  serviceName: 'white-cross-healthcare',
  sampleRate: 0.1, // 10% sampling
  enableHealthcareTracing: true,
  enablePerformanceTracing: true,
  enableDatabaseTracing: true,
  enableExternalServiceTracing: true,
  maxSpanDuration: 30000, // 30 seconds
  batchExport: {
    maxQueueSize: 2048,
    batchTimeout: 5000, // 5 seconds
    maxExportBatchSize: 512
  },
  defaultTags: {
    service: 'white-cross-healthcare',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  },
  excludeFields: ['password', 'ssn', 'creditCard', 'medicalRecord', 'token'],
  hipaaCompliant: true
};

/**
 * Tracing context for request processing
 */
interface TracingContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  user?: HealthcareUser;
  facility?: string;
  operation: string;
  startTime: number;
  tags: Record<string, any>;
  logs: TraceLog[];
}

/**
 * Span storage for batching and export
 */
class SpanStorage {
  private spans: TraceSpan[] = [];
  private exportTimer?: NodeJS.Timeout;
  private config: ITracingConfig;

  constructor(
    config: ITracingConfig,
    private onExport: (spans: TraceSpan[]) => Promise<void>
  ) {
    this.config = config;
    this.startExportTimer();
  }

  public addSpan(span: TraceSpan): void {
    // Filter sensitive data if HIPAA compliance is enabled
    if (this.config.hipaaCompliant) {
      span = this.sanitizeSpan(span);
    }

    this.spans.push(span);

    // Export if queue is full
    if (this.spans.length >= this.config.batchExport.maxQueueSize) {
      this.export();
    }
  }

  private startExportTimer(): void {
    this.exportTimer = setInterval(() => {
      if (this.spans.length > 0) {
        this.export();
      }
    }, this.config.batchExport.batchTimeout);
  }

  private async export(): Promise<void> {
    if (this.spans.length === 0) return;

    const batchSize = Math.min(
      this.spans.length, 
      this.config.batchExport.maxExportBatchSize
    );
    
    const spansToExport = this.spans.splice(0, batchSize);

    try {
      await this.onExport(spansToExport);
    } catch (error) {
      console.error('[SpanStorage] Error exporting spans:', error);
      // Re-add spans for retry (simple strategy)
      this.spans.unshift(...spansToExport);
    }
  }

  private sanitizeSpan(span: TraceSpan): TraceSpan {
    const sanitized = { ...span };

    // Sanitize tags
    sanitized.tags = this.sanitizeObject(span.tags);

    // Sanitize logs
    sanitized.logs = span.logs.map(log => ({
      ...log,
      fields: log.fields ? this.sanitizeObject(log.fields) : undefined
    }));

    return sanitized;
  }

  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (this.config.excludeFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      )) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  public async forceExport(): Promise<void> {
    await this.export();
  }

  public destroy(): void {
    if (this.exportTimer) {
      clearInterval(this.exportTimer);
    }
    this.export(); // Final export
  }
}

/**
 * Trace ID generator
 */
class TraceIdGenerator {
  /**
   * Generate a new trace ID
   */
  public static generateTraceId(): string {
    return this.generateId(32);
  }

  /**
   * Generate a new span ID
   */
  public static generateSpanId(): string {
    return this.generateId(16);
  }

  /**
   * Generate random hex ID
   */
  private static generateId(length: number): string {
    let result = '';
    const chars = '0123456789abcdef';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}

/**
 * Healthcare-specific trace utilities
 */
class HealthcareTraceUtils {
  /**
   * Extract healthcare context from request
   */
  public static extractHealthcareContext(req: IRequest, user?: HealthcareUser): Record<string, any> {
    const context: Record<string, any> = {};

    if (user) {
      context['healthcare.user.id'] = user.userId;
      context['healthcare.user.role'] = user.role;
      context['healthcare.facility.id'] = user.facilityId || 'unknown';
      
      if (user.npiNumber) {
        context['healthcare.provider.npi'] = user.npiNumber;
      }
    }

    // Extract patient context from URL or headers
    const patientId = this.extractPatientId(req);
    if (patientId) {
      context['healthcare.patient.id'] = patientId;
    }

    // Detect PHI access
    if (this.isPhiAccess(req.path)) {
      context['healthcare.phi.access'] = true;
      context['healthcare.access.type'] = this.getAccessType(req.path);
    }

    // Emergency access detection
    if (this.isEmergencyAccess(req.path)) {
      context['healthcare.emergency.access'] = true;
    }

    return context;
  }

  /**
   * Extract patient ID from request
   */
  private static extractPatientId(req: IRequest): string | null {
    // Check URL path
    const pathMatch = req.path.match(/\/patients\/([^\/]+)/);
    if (pathMatch) {
      return pathMatch[1];
    }

    // Check query parameters
    if (req.query.patientId) {
      return req.query.patientId;
    }

    // Check headers
    const patientHeader = req.headers['x-patient-id'];
    if (patientHeader) {
      return Array.isArray(patientHeader) ? patientHeader[0] : patientHeader;
    }

    return null;
  }

  /**
   * Check if request involves PHI access
   */
  private static isPhiAccess(path: string): boolean {
    const phiPaths = [
      '/api/patients',
      '/api/health-records',
      '/api/medical-history',
      '/api/medications',
      '/api/immunizations',
      '/api/allergies',
      '/api/diagnoses'
    ];
    
    return phiPaths.some(phiPath => path.startsWith(phiPath));
  }

  /**
   * Get access type from path
   */
  private static getAccessType(path: string): string {
    if (path.includes('/emergency')) return 'emergency';
    if (path.includes('/break-glass')) return 'break-glass';
    return 'routine';
  }

  /**
   * Check if request is emergency access
   */
  private static isEmergencyAccess(path: string): boolean {
    return path.includes('/emergency') || path.includes('/break-glass');
  }
}

/**
 * Enterprise tracing middleware with healthcare compliance
 */
export class TracingMiddleware implements IMiddleware {
  public readonly name = 'TracingMiddleware';
  public readonly version = '1.0.0';
  
  private config: ITracingConfig;
  private spanStorage: SpanStorage;
  private activeSpans: Map<string, TracingContext> = new Map();

  constructor(config: Partial<ITracingConfig> = {}) {
    this.config = { ...DEFAULT_TRACING_CONFIG, ...config };
    
    if (this.config.enabled) {
      this.spanStorage = new SpanStorage(
        this.config,
        this.onSpanExport.bind(this)
      );
    }
  }

  /**
   * Required execute method for IMiddleware interface
   */
  public async execute(
    request: IRequest, 
    response: IResponse, 
    next: INextFunction, 
    _context: MiddlewareContext
  ): Promise<void> {
    if (!this.config.enabled || !this.shouldSample()) {
      next.call();
      return;
    }

    const tracingContext = this.createTracingContext(request);
    
    try {
      // Start the span
      this.startSpan(tracingContext);
      
      // Add tracing headers to request
      this.injectTracingHeaders(request, tracingContext);
      
      // Instrument response to complete span
      this.instrumentResponse(response, tracingContext);
      
      next.call();
    } catch (error) {
      this.recordError(tracingContext, error as Error);
      next.call(error as Error);
    }
  }

  /**
   * Create tracing context from request
   */
  private createTracingContext(req: IRequest): TracingContext {
    const user = req.user as HealthcareUser | undefined;
    const traceId = this.extractOrGenerateTraceId(req);
    const spanId = TraceIdGenerator.generateSpanId();
    const parentSpanId = this.extractParentSpanId(req);

    // Build operation name from request
    const operation = this.buildOperationName(req);

    // Extract healthcare context
    const healthcareContext = this.config.enableHealthcareTracing 
      ? HealthcareTraceUtils.extractHealthcareContext(req, user)
      : {};

    const tags = {
      ...this.config.defaultTags,
      'http.method': req.method,
      'http.url': req.url,
      'http.path': req.path,
      'user.agent': req.headers['user-agent'] || 'unknown',
      'client.ip': this.getClientIP(req),
      ...healthcareContext
    };

    // Add user context if available
    if (user) {
      tags['user.id'] = user.userId;
      tags['user.role'] = user.role;
    }

    return {
      traceId,
      spanId,
      parentSpanId,
      user,
      facility: user?.facilityId,
      operation,
      startTime: Date.now(),
      tags,
      logs: []
    };
  }

  /**
   * Extract or generate trace ID
   */
  private extractOrGenerateTraceId(req: IRequest): string {
    // Check for existing trace ID in headers
    const traceHeader = req.headers['x-trace-id'] || 
                       req.headers['traceparent'] ||
                       req.headers['x-request-id'];

    if (traceHeader) {
      const traceId = Array.isArray(traceHeader) ? traceHeader[0] : traceHeader;
      
      // Parse W3C trace context if present
      if (traceId.startsWith('00-')) {
        return traceId.split('-')[1];
      }
      
      return traceId;
    }

    return TraceIdGenerator.generateTraceId();
  }

  /**
   * Extract parent span ID from headers
   */
  private extractParentSpanId(req: IRequest): string | undefined {
    const parentSpanHeader = req.headers['x-parent-span-id'];
    
    if (parentSpanHeader) {
      return Array.isArray(parentSpanHeader) ? parentSpanHeader[0] : parentSpanHeader;
    }

    // Parse from W3C trace context
    const traceparent = req.headers['traceparent'];
    if (traceparent) {
      const tp = Array.isArray(traceparent) ? traceparent[0] : traceparent;
      const parts = tp.split('-');
      if (parts.length >= 3) {
        return parts[2];
      }
    }

    return undefined;
  }

  /**
   * Build operation name from request
   */
  private buildOperationName(req: IRequest): string {
    const method = req.method.toLowerCase();
    const path = this.normalizePath(req.path);
    
    return `${method} ${path}`;
  }

  /**
   * Normalize path for consistent operation naming
   */
  private normalizePath(path: string): string {
    return path
      .replace(/\/\d+/g, '/:id')
      .replace(/\/[a-f0-9-]{36}/gi, '/:uuid')
      .replace(/\/[a-f0-9]{24}/gi, '/:objectid');
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: IRequest): string {
    return (
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.headers['x-real-ip']?.toString() ||
      req.ip ||
      'unknown'
    );
  }

  /**
   * Check if request should be sampled
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Start a new span
   */
  private startSpan(context: TracingContext): void {
    this.activeSpans.set(context.spanId, context);
    
    // Log span start
    this.addLog(context, 'INFO', 'Span started', {
      operation: context.operation,
      traceId: context.traceId,
      spanId: context.spanId
    });
  }

  /**
   * Inject tracing headers into request
   */
  private injectTracingHeaders(req: IRequest, context: TracingContext): void {
    // Add trace context to request metadata for downstream services
    req.setMetadata('traceId', context.traceId);
    req.setMetadata('spanId', context.spanId);
    req.setMetadata('tracingContext', context);
  }

  /**
   * Instrument response to complete span on finish
   */
  private instrumentResponse(response: IResponse, context: TracingContext): void {
    const originalEnd = response.end;
    const originalJson = response.json;

    // Wrap response.end
    response.end = function(this: any, ...args: any[]) {
      const endTime = Date.now();
      context.tags['http.status_code'] = response.statusCode;
      
      // Determine span status from HTTP status
      const status = this.determineSpanStatus(response.statusCode);
      
      // Complete the span
      this.completeSpan(context, endTime, status);
      
      return originalEnd.apply(this, args);
    }.bind(this);

    // Wrap response.json
    response.json = function(this: any, data: any) {
      // Log response data size
      const responseSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
      context.tags['http.response.size'] = responseSize;
      
      return originalJson.call(this, data);
    };
  }

  /**
   * Determine span status from HTTP status code
   */
  private determineSpanStatus(statusCode: number): SpanStatus {
    if (statusCode >= 200 && statusCode < 400) {
      return SpanStatus.OK;
    } else if (statusCode === 401) {
      return SpanStatus.UNAUTHENTICATED;
    } else if (statusCode === 403) {
      return SpanStatus.PERMISSION_DENIED;
    } else if (statusCode === 404) {
      return SpanStatus.NOT_FOUND;
    } else if (statusCode === 408 || statusCode === 504) {
      return SpanStatus.DEADLINE_EXCEEDED;
    } else if (statusCode >= 400 && statusCode < 500) {
      return SpanStatus.INVALID_ARGUMENT;
    } else if (statusCode >= 500) {
      return SpanStatus.INTERNAL;
    }
    
    return SpanStatus.UNKNOWN;
  }

  /**
   * Complete a span
   */
  private completeSpan(context: TracingContext, endTime: number, status: SpanStatus): void {
    const duration = endTime - context.startTime;
    
    // Add final tags
    context.tags['span.duration'] = duration;
    context.tags['span.status'] = status;

    // Create completed span
    const span: TraceSpan = {
      traceId: context.traceId,
      spanId: context.spanId,
      parentSpanId: context.parentSpanId,
      operationName: context.operation,
      startTime: context.startTime,
      endTime,
      duration,
      tags: context.tags,
      logs: context.logs,
      status,
      context: {
        traceId: context.traceId,
        spanId: context.spanId,
        traceFlags: 1,
        baggage: {}
      }
    };

    // Log span completion
    this.addLog(context, 'INFO', 'Span completed', {
      duration,
      status,
      endTime
    });

    // Store span for export
    if (this.spanStorage) {
      this.spanStorage.addSpan(span);
    }

    // Remove from active spans
    this.activeSpans.delete(context.spanId);
  }

  /**
   * Record an error in the span
   */
  private recordError(context: TracingContext, error: Error): void {
    context.tags['error'] = true;
    context.tags['error.message'] = error.message;
    context.tags['error.name'] = error.name;
    
    if (error.stack) {
      context.tags['error.stack'] = error.stack;
    }

    this.addLog(context, 'ERROR', 'Error occurred', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  }

  /**
   * Add log entry to span
   */
  private addLog(
    context: TracingContext, 
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', 
    message: string, 
    fields?: Record<string, any>
  ): void {
    context.logs.push({
      timestamp: Date.now(),
      level,
      message,
      fields
    });
  }

  /**
   * Handle span export
   */
  private async onSpanExport(spans: TraceSpan[]): Promise<void> {
    try {
      // In production, this would export to a tracing service like Jaeger, Zipkin, etc.
      console.log(`[TracingMiddleware] Exporting ${spans.length} spans`);
      
      // Group spans by trace for structured logging
      const groupedSpans = this.groupSpansByTrace(spans);
      
      for (const [traceId, traceSpans] of Object.entries(groupedSpans)) {
        console.log(`[TRACE][${traceId}] ${traceSpans.length} spans:`, 
          JSON.stringify(traceSpans, null, 2));
      }
      
      // If exporter endpoint is configured, send spans there
      if (this.config.exporterEndpoint) {
        await this.exportToEndpoint(spans);
      }
      
    } catch (error) {
      console.error('[TracingMiddleware] Error in span export:', error);
      throw error;
    }
  }

  /**
   * Group spans by trace ID
   */
  private groupSpansByTrace(spans: TraceSpan[]): Record<string, TraceSpan[]> {
    return spans.reduce((groups, span) => {
      const traceId = span.traceId;
      if (!groups[traceId]) {
        groups[traceId] = [];
      }
      groups[traceId].push(span);
      return groups;
    }, {} as Record<string, TraceSpan[]>);
  }

  /**
   * Export spans to external endpoint
   */
  private async exportToEndpoint(spans: TraceSpan[]): Promise<void> {
    if (!this.config.exporterEndpoint) return;

    const exportData = {
      spans,
      service: this.config.serviceName,
      timestamp: new Date().toISOString()
    };

    // In a real implementation, you'd use fetch or http client
    console.log(`[TracingMiddleware] Would export to ${this.config.exporterEndpoint}:`, 
      JSON.stringify(exportData));
  }

  /**
   * Get tracing summary
   */
  public getTracingSummary(): any {
    return {
      activeSpans: this.activeSpans.size,
      config: this.config,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.spanStorage) {
      this.spanStorage.destroy();
    }
    this.activeSpans.clear();
  }
}

/**
 * Factory function to create tracing middleware with healthcare defaults
 */
export function createTracingMiddleware(config: Partial<ITracingConfig> = {}): TracingMiddleware {
  const healthcareConfig: Partial<ITracingConfig> = {
    enabled: true,
    serviceName: 'white-cross-healthcare',
    sampleRate: 0.1, // 10% sampling for production
    enableHealthcareTracing: true,
    enablePerformanceTracing: true,
    hipaaCompliant: true, // Critical for healthcare compliance
    excludeFields: [
      'password', 'ssn', 'creditCard', 'bankAccount', 
      'medicalRecord', 'patientData', 'token', 'jwt'
    ],
    defaultTags: {
      service: 'white-cross-healthcare',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      compliance: 'hipaa'
    },
    ...config
  };

  return new TracingMiddleware(healthcareConfig);
}

export default TracingMiddleware;
