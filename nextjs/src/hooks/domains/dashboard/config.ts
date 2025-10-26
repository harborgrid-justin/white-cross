/**
 * Dashboard Domain Configuration
 * 
 * Query keys, cache settings, and constants for dashboard-related hooks.
 * 
 * @module hooks/domains/dashboard/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Local type definitions since they don't exist in @/types yet

/**
 * Dashboard query keys for TanStack Query
 */
export const dashboardQueryKeys = {
  // Base keys
  domain: ['dashboard'] as const,
  
  // Statistics keys
  statistics: {
    all: () => [...dashboardQueryKeys.domain, 'statistics'] as const,
    global: (filters?: DashboardStatisticsFilters) => 
      [...dashboardQueryKeys.statistics.all(), 'global', filters] as const,
    appointments: (filters?: any) => 
      [...dashboardQueryKeys.statistics.all(), 'appointments', filters] as const,
    students: (filters?: any) => 
      [...dashboardQueryKeys.statistics.all(), 'students', filters] as const,
    health: (filters?: any) => 
      [...dashboardQueryKeys.statistics.all(), 'health', filters] as const,
    medications: (filters?: any) => 
      [...dashboardQueryKeys.statistics.all(), 'medications', filters] as const,
    inventory: (filters?: any) => 
      [...dashboardQueryKeys.statistics.all(), 'inventory', filters] as const,
    incidents: (filters?: any) => 
      [...dashboardQueryKeys.statistics.all(), 'incidents', filters] as const,
  },
  
  // Overview keys
  overview: {
    all: () => [...dashboardQueryKeys.domain, 'overview'] as const,
    byUser: (userId: string) => 
      [...dashboardQueryKeys.overview.all(), 'user', userId] as const,
    byRole: (role: string) => 
      [...dashboardQueryKeys.overview.all(), 'role', role] as const,
  },
  
  // Analytics keys
  analytics: {
    all: () => [...dashboardQueryKeys.domain, 'analytics'] as const,
    charts: (type: string, filters?: any) => 
      [...dashboardQueryKeys.analytics.all(), 'charts', type, filters] as const,
    metrics: (period: string, filters?: any) => 
      [...dashboardQueryKeys.analytics.all(), 'metrics', period, filters] as const,
  },
  
  // Activities keys
  activities: {
    all: () => [...dashboardQueryKeys.domain, 'activities'] as const,
    recent: (limit?: number) => 
      [...dashboardQueryKeys.activities.all(), 'recent', limit] as const,
    byUser: (userId: string, limit?: number) => 
      [...dashboardQueryKeys.activities.all(), 'user', userId, limit] as const,
  },
  
  // Alerts keys
  alerts: {
    all: () => [...dashboardQueryKeys.domain, 'alerts'] as const,
    critical: () => [...dashboardQueryKeys.alerts.all(), 'critical'] as const,
    byType: (type: string) => 
      [...dashboardQueryKeys.alerts.all(), 'type', type] as const,
  },
} as const;

/**
 * Dashboard cache configuration
 */
export const DASHBOARD_CACHE_CONFIG = {
  statistics: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  overview: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  analytics: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  activities: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  alerts: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  },
  mutations: {
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

/**
 * Dashboard operation constants
 */
export const DASHBOARD_OPERATIONS = {
  REFRESH_ALL: 'refresh_all_dashboard_data',
  EXPORT_DATA: 'export_dashboard_data',
  UPDATE_LAYOUT: 'update_dashboard_layout',
  CLEAR_CACHE: 'clear_dashboard_cache',
} as const;

/**
 * Dashboard error codes
 */
export const DASHBOARD_ERROR_CODES = {
  STATISTICS_FAILED: 'DASHBOARD_STATISTICS_FETCH_FAILED',
  EXPORT_FAILED: 'DASHBOARD_EXPORT_FAILED',
  LAYOUT_UPDATE_FAILED: 'DASHBOARD_LAYOUT_UPDATE_FAILED',
  CACHE_CLEAR_FAILED: 'DASHBOARD_CACHE_CLEAR_FAILED',
} as const;

/**
 * Dashboard default filters
 */
export const DASHBOARD_DEFAULT_FILTERS: DashboardStatisticsFilters = {
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endDate: new Date().toISOString(),
  },
  includeInactive: false,
  groupBy: 'day',
} as const;

/**
 * Dashboard refresh intervals (in milliseconds)
 */
export const DASHBOARD_REFRESH_INTERVALS = {
  REAL_TIME: 30 * 1000, // 30 seconds
  FREQUENT: 2 * 60 * 1000, // 2 minutes
  NORMAL: 5 * 60 * 1000, // 5 minutes
  SLOW: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Dashboard chart types
 */
export const DASHBOARD_CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  SCATTER: 'scatter',
} as const;

/**
 * Dashboard widget types
 */
export const DASHBOARD_WIDGET_TYPES = {
  STATISTICS: 'statistics',
  CHART: 'chart',
  TABLE: 'table',
  ALERT: 'alert',
  ACTIVITY: 'activity',
  QUICK_ACTION: 'quick_action',
} as const;

/**
 * Type definitions for configuration
 */
export interface DashboardStatisticsFilters {
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
  nurseId?: string;
  departmentId?: string;
  includeInactive?: boolean;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}

export interface DashboardLayoutConfig {
  widgets: Array<{
    id: string;
    type: keyof typeof DASHBOARD_WIDGET_TYPES;
    position: { x: number; y: number; w: number; h: number };
    config?: Record<string, any>;
  }>;
  theme?: 'light' | 'dark' | 'auto';
  refreshInterval?: keyof typeof DASHBOARD_REFRESH_INTERVALS;
}

export interface DashboardExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  includeCharts?: boolean;
  includeStatistics?: boolean;
  includeActivities?: boolean;
}
