/**
 * @fileoverview Health Check Types
 * @module infrastructure/monitoring/types
 * @description Type definitions for enhanced health monitoring
 */

import { HealthCheckResponse, HealthStatus } from '../interfaces/health-check.interface';

export interface EnhancedHealthCheckConfig {
  timeout: number;
  retries: number;
  interval: number;
  gracefulShutdownTimeout: number;
  resourceThresholds: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface ResourceHealthInfo {
  cpu: {
    usage: number;
    load: number[];
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    usage: number;
    heap: {
      used: number;
      total: number;
    };
  };
  disk: {
    used: number;
    total: number;
    usage: number;
    path: string;
  };
  network: {
    connections: number;
    bytesIn: number;
    bytesOut: number;
  };
}

export interface ExternalServiceHealthInfo {
  name: string;
  url: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime: number;
  lastChecked: Date;
  lastError?: string;
  consecutiveFailures: number;
}

export interface DetailedHealthMetrics {
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  averageResponseTime: number;
  uptime: number;
  availability: number;
  lastFailure?: Date;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
}

export interface EnhancedHealthCheckResponse extends HealthCheckResponse {
  resources: ResourceHealthInfo;
  externalServices: ExternalServiceHealthInfo[];
  metrics: DetailedHealthMetrics;
  performance: {
    responseTime: number;
    totalDuration: number;
  };
  security: {
    threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    activeSessions: number;
    recentFailedLogins: number;
  };
}

export interface HealthTrends {
  availabilityTrend: number[];
  responseTimeTrend: number[];
  errorSpikes: { timestamp: Date; errors: string[] }[];
}

export interface ReadinessCheckResult {
  ready: boolean;
  timestamp: string;
  checks: Record<string, any>;
  resources: {
    cpu: boolean;
    memory: boolean;
    disk: boolean;
  };
}

export interface LivenessCheckResult {
  alive: boolean;
  timestamp: string;
  uptime: number;
  pid: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
  };
  eventLoop: {
    delay: number;
  };
}
