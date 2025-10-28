/**
 * Administration Module Interfaces
 *
 * TypeScript interfaces for administration operations
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResult;
}

export interface SystemHealthMetrics {
  cpu: number;
  memory: number;
  disk: number;
  database: string;
  apiResponseTime: number;
  uptime: string;
  connections: number;
  errorRate: number;
  queuedJobs: number;
  cacheHitRate: number;
}

export interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  totalDistricts: number;
  totalSchools: number;
}

export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  totalMemoryGB: string;
  freeMemoryGB: string;
  cpuCount: number;
  cpuModel: string;
  processHeapUsedMB: string;
  processHeapTotalMB: string;
}

export interface SystemHealth {
  status: string;
  timestamp: Date;
  metrics: SystemHealthMetrics;
  statistics: SystemStatistics;
  system: SystemInfo;
}
