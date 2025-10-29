/**
 * Monitoring and Analytics Type Definitions
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type EventCategory =
  | 'navigation'
  | 'user_action'
  | 'api_call'
  | 'error'
  | 'performance'
  | 'security'
  | 'healthcare'
  | 'system';

export type HealthcareEventType =
  | 'medication_administered'
  | 'medication_error'
  | 'health_record_accessed'
  | 'health_record_updated'
  | 'emergency_contact_viewed'
  | 'appointment_scheduled'
  | 'appointment_cancelled'
  | 'document_uploaded'
  | 'document_downloaded'
  | 'phi_accessed'
  | 'consent_given'
  | 'consent_revoked';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  category?: EventCategory;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  traceId?: string;
}

export interface AnalyticsEvent {
  name: string;
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
  timestamp: Date;
  context?: Record<string, any>;
}

export interface ErrorReport {
  error: Error;
  errorInfo?: any;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fingerprint?: string[];
}

export interface UserContext {
  id: string;
  role: string;
  districtId?: string;
  schoolId?: string;
  permissions?: string[];
}

export interface SessionInfo {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: number;
}

export interface HealthCheckStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    api: boolean;
    database: boolean;
    cache: boolean;
    websocket?: boolean;
  };
  latency: {
    api: number;
    database: number;
  };
  errors: string[];
  timestamp: Date;
}

export interface AlertConfig {
  id: string;
  name: string;
  type: 'error_rate' | 'performance' | 'security' | 'custom';
  threshold: number;
  window: number; // Time window in seconds
  channels: ('slack' | 'email' | 'pagerduty')[];
  enabled: boolean;
}

export interface CoreWebVitalsMetrics {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
  INP?: number; // Interaction to Next Paint
}

export interface APIMetrics {
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  timestamp: Date;
  error?: string;
}

export interface ComponentMetrics {
  componentName: string;
  renderTime: number;
  rerenderCount: number;
  props?: Record<string, any>;
}

export interface NetworkMetrics {
  requestCount: number;
  totalSize: number;
  cachedRequests: number;
  failedRequests: number;
  averageLatency: number;
}

export interface BundleMetrics {
  totalSize: number;
  gzipSize: number;
  chunks: {
    name: string;
    size: number;
  }[];
  loadTime: number;
}

export interface HealthcareMetrics {
  medicationAdministrations: number;
  healthRecordAccesses: number;
  phiAccesses: number;
  emergencyAlerts: number;
  complianceViolations: number;
  timestamp: Date;
}

export interface MonitoringConfig {
  sentry?: {
    dsn: string;
    environment: string;
    release?: string;
    tracesSampleRate: number;
    replaysSessionSampleRate: number;
    replaysOnErrorSampleRate: number;
  };
  datadog?: {
    applicationId: string;
    clientToken: string;
    site: string;
    service: string;
    env: string;
    version?: string;
    sessionSampleRate: number;
    sessionReplaySampleRate: number;
    trackInteractions: boolean;
    trackResources: boolean;
    trackLongTasks: boolean;
  };
  analytics?: {
    trackPageViews: boolean;
    trackUserActions: boolean;
    trackAPICall: boolean;
    trackErrors: boolean;
    trackPerformance: boolean;
  };
  logging?: {
    level: LogLevel;
    enableConsole: boolean;
    enableRemote: boolean;
    batchSize: number;
    flushInterval: number;
  };
}
