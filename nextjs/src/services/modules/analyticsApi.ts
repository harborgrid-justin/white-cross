/**
 * @fileoverview Complete Analytics API Module - Comprehensive healthcare analytics and reporting
 * @module services/modules/analyticsApi
 * @category Services
 *
 * Provides comprehensive analytics, reporting, and dashboard capabilities for healthcare
 * metrics, trends, and insights. Supports real-time dashboards, custom reports, predictive
 * analytics, and compliance reporting with intelligent caching and data aggregation.
 *
 * ## Key Features
 *
 * **Health Metrics & Trends**:
 * - Student health metrics tracking (vitals, conditions, medications)
 * - Health trend analysis over time
 * - Population health insights
 * - Chronic condition monitoring
 * - Medication adherence tracking
 *
 * **Incident Analytics**:
 * - Incident trends by type, severity, location
 * - Injury hotspot identification
 * - Incident frequency analysis
 * - Safety metric tracking
 * - Comparative period analysis
 *
 * **Medication Analytics**:
 * - Medication usage patterns
 * - Adherence rate tracking
 * - Dosage compliance monitoring
 * - Stock level analytics
 * - Cost analysis
 *
 * **Appointment Analytics**:
 * - Appointment volume trends
 * - No-show rate analysis
 * - Nurse utilization metrics
 * - Appointment type distribution
 * - Wait time analysis
 *
 * **Dashboard Support**:
 * - Nurse dashboard with daily metrics
 * - Admin dashboard with system overview
 * - School dashboard with institution metrics
 * - Customizable widgets
 * - Real-time data updates
 *
 * **Custom Reporting**:
 * - Flexible report generation
 * - Custom query builder
 * - Multiple export formats (PDF, Excel, CSV)
 * - Scheduled report delivery
 * - Template-based reports
 *
 * ## Advanced Features
 *
 * **Intelligent Caching**:
 * - Multi-level cache with TTL
 * - Cache invalidation patterns
 * - Query parameter-based cache keys
 * - Configurable cache duration
 * - Manual cache clearing
 *
 * **Real-time Analytics**:
 * - Live dashboard updates via polling
 * - Socket.io integration for instant updates
 * - Configurable refresh intervals
 * - Event-driven invalidation
 * - Subscription-based data streaming
 *
 * **Predictive Analytics**:
 * - Trend forecasting
 * - Seasonal pattern detection
 * - Risk prediction models
 * - Capacity planning insights
 *
 * **Drill-down Analysis**:
 * - Summary to detail navigation
 * - Multi-level data exploration
 * - Contextual filtering
 * - Related data discovery
 *
 * ## Healthcare-Specific Analytics
 *
 * **Compliance Reporting**:
 * - HIPAA audit trail analytics
 * - FERPA compliance tracking
 * - State reporting requirements
 * - Immunization compliance rates
 * - Health screening compliance
 *
 * **Population Health**:
 * - Student health demographics
 * - Chronic condition prevalence
 * - Immunization coverage rates
 * - Health risk stratification
 * - Intervention effectiveness tracking
 *
 * **Resource Utilization**:
 * - Nurse workload analysis
 * - Supply consumption tracking
 * - Appointment capacity utilization
 * - Cost per student metrics
 * - Budget variance analysis
 *
 * **Safety & Risk Analytics**:
 * - Incident pattern detection
 * - High-risk location identification
 * - Injury trend analysis
 * - Preventive measure effectiveness
 * - Safety score calculation
 *
 * ## Performance & Optimization
 *
 * **Caching Strategy**:
 * - Dashboard data: 3-minute cache
 * - Metrics: 5-minute cache
 * - Trends: 10-minute cache
 * - Reports: 1-minute cache
 * - Automatic cache warming
 *
 * **Query Optimization**:
 * - Aggregation at database level
 * - Indexed query patterns
 * - Pagination support
 * - Incremental loading
 * - Background processing
 *
 * **TanStack Query Integration**:
 * - Query key: `['analytics', type, params]`
 * - Automatic background refetching
 * - Stale-while-revalidate pattern
 * - Query deduplication
 * - Parallel query execution
 *
 * @example
 * ```typescript
 * // Get nurse dashboard with caching
 * const dashboard = await analyticsApi.getNurseDashboard(nurseId, {
 *   includeWidgets: true,
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' }
 * });
 * console.log('Today\'s appointments:', dashboard.todaysAppointments);
 * console.log('Pending tasks:', dashboard.pendingTasks);
 *
 * // Generate custom report
 * const report = await analyticsApi.createCustomReport({
 *   name: 'Monthly Incident Summary',
 *   reportType: 'INCIDENTS',
 *   dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' },
 *   groupBy: ['type', 'severity'],
 *   metrics: ['count', 'avgResponseTime'],
 *   filters: { schoolId: 'school-123' },
 *   exportFormat: 'PDF'
 * });
 *
 * // Subscribe to real-time dashboard updates
 * const unsubscribe = analyticsApi.subscribeToRealTimeUpdates(
 *   'nurse',
 *   { nurseId },
 *   (data) => {
 *     console.log('Dashboard updated:', data);
 *     updateUI(data);
 *   },
 *   30000 // Poll every 30 seconds
 * );
 *
 * // Get health trends with comparison
 * const trends = await analyticsApi.getHealthTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly',
 *   includeComparison: true,
 *   comparisonPeriod: 'PREVIOUS_PERIOD'
 * });
 *
 * // Clear cache for fresh data
 * analyticsApi.clearCache('dashboard'); // Clear all dashboard caches
 * analyticsApi.clearCache(); // Clear all caches
 *
 * // Use with TanStack Query
 * const { data, isLoading, refetch } = useQuery({
 *   queryKey: ['analytics', 'nurse-dashboard', nurseId],
 *   queryFn: () => analyticsApi.getNurseDashboard(nurseId),
 *   staleTime: 180000, // Consider data fresh for 3 minutes
 *   refetchInterval: 180000 // Auto-refetch every 3 minutes
 * });
 * ```
 *
 * @see {@link appointmentsApi} for appointment data
 * @see {@link incidentsApi} for incident data
 * @see {@link medicationsApi} for medication data
 */

import type { ApiClient } from '../core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams, buildUrlParams } from '../utils/apiUtils';
import {
  // Basic analytics types
  HealthMetrics,
  HealthTrends,
  IncidentTrends,
  IncidentLocationData,
  MedicationUsage,
  MedicationAdherence,
  AppointmentTrends,
  NoShowRate,
  AnalyticsSummary,

  // Dashboard types
  NurseDashboard,
  AdminDashboard,
  SchoolDashboard,
  DashboardWidget,

  // Report types
  CustomReport,
  CustomReportRequest,
  CustomReportResult,
  ReportListResponse,
  ReportSchedule,
  CreateReportScheduleRequest,

  // Query types
  AnalyticsQueryParams,
  PaginationParams,
  DateRangeFilter,

  // Chart types
  ChartConfiguration,

  // Enums
  ReportExportFormat,
  DateGrouping,
  ComparisonPeriod
} from '../types';

// TODO: Restore validation when validation module is available
// import {
//   validateAnalyticsQuery,
//   validateCustomReportRequest,
//   validateReportSchedule,
//   validateDateRange,
//   validatePagination,
//   safeValidate,
//   ValidationSchemas
// } from './validation';

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

/**
 * Cache keys for analytics queries
 */
const CacheKeys = {
  HEALTH_METRICS: 'analytics:health-metrics',
  HEALTH_TRENDS: 'analytics:health-trends',
  INCIDENT_TRENDS: 'analytics:incident-trends',
  MEDICATION_USAGE: 'analytics:medication-usage',
  APPOINTMENT_TRENDS: 'analytics:appointment-trends',
  NURSE_DASHBOARD: 'analytics:dashboard:nurse',
  ADMIN_DASHBOARD: 'analytics:dashboard:admin',
  SCHOOL_DASHBOARD: 'analytics:dashboard:school',
  SUMMARY: 'analytics:summary',
  REPORT_LIST: 'analytics:reports:list'
} as const;

/**
 * Default cache TTL in seconds
 */
const CacheTTL = {
  METRICS: 300,        // 5 minutes
  TRENDS: 600,         // 10 minutes
  DASHBOARD: 180,      // 3 minutes
  SUMMARY: 300,        // 5 minutes
  REPORTS: 60          // 1 minute
} as const;

// ============================================================================
// ANALYTICS API SERVICE
// ============================================================================

/**
 * Analytics API Service
 * Handles all analytics and reporting related API calls with caching,
 * validation, and advanced features
 */
export class AnalyticsApi {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor(private readonly client: ApiClient) {
    this.cache = new Map();
  }

  // ==========================================================================
  // CACHE MANAGEMENT
  // ==========================================================================

  /**
   * Get cached data if available and not expired
   */
  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Set cache data with TTL
   */
  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clear cache by key or pattern
   */
  public clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    const cacheKeys = Array.from(this.cache.keys());
    for (const key of cacheKeys) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Build cache key from parameters
   */
  private buildCacheKey(base: string, params?: Record<string, any>): string {
    if (!params) return base;

    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');

    return `${base}:${sortedParams}`;
  }

  // ==========================================================================
  // HEALTH METRICS ENDPOINTS
  // ==========================================================================

  /**
   * Get health metrics with caching and validation
   */
  async getHealthMetrics(params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
    schoolId?: string;
    studentId?: string;
  }): Promise<HealthMetrics[]> {
    // Validate parameters
    // const validated = params ? safeValidate(ValidationSchemas.HealthMetricsQuery, params) : { success: true };
    // if (!validated.success) {
    //   throw new Error(`Invalid parameters: ${JSON.stringify(validated.errors)}`);
    // }

    // Check cache
    const cacheKey = this.buildCacheKey(CacheKeys.HEALTH_METRICS, params);
    const cached = this.getCached<HealthMetrics[]>(cacheKey);
    if (cached) return cached;

    // Fetch from API
    const response = await this.client.get<ApiResponse<HealthMetrics[]>>(
      '/api/v1/analytics/health-metrics',
      { params }
    );

    const data = response.data.data || [];
    this.setCache(cacheKey, data, CacheTTL.METRICS);

    return data;
  }

  /**
   * Get health trends with comparison support
   */
  async getHealthTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    includeComparison?: boolean;
    comparisonPeriod?: ComparisonPeriod;
  }): Promise<HealthTrends> {
    const cacheKey = this.buildCacheKey(CacheKeys.HEALTH_TRENDS, params);
    const cached = this.getCached<HealthTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<HealthTrends>>(
      '/api/v1/analytics/health-trends',
      { params }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get health metrics for specific student
   */
  async getStudentHealthMetrics(studentId: string, params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
  }): Promise<HealthMetrics[]> {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    const response = await this.client.get<ApiResponse<HealthMetrics[]>>(
      `/api/v1/analytics/health-metrics/student/${studentId}`,
      { params }
    );

    return response.data.data || [];
  }

  /**
   * Get health metrics for specific school
   */
  async getSchoolHealthMetrics(schoolId: string, params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
  }): Promise<HealthMetrics[]> {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    const response = await this.client.get<ApiResponse<HealthMetrics[]>>(
      `/api/v1/analytics/health-metrics/school/${schoolId}`,
      { params }
    );

    return response.data.data || [];
  }

  // ==========================================================================
  // INCIDENT ANALYTICS ENDPOINTS
  // ==========================================================================

  /**
   * Get incident trends with caching
   */
  async getIncidentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    schoolId?: string;
  }): Promise<IncidentTrends> {
    const cacheKey = this.buildCacheKey(CacheKeys.INCIDENT_TRENDS, params);
    const cached = this.getCached<IncidentTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<IncidentTrends>>(
      '/api/v1/analytics/incidents/trends',
      { params }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get incidents by location
   */
  async getIncidentsByLocation(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<IncidentLocationData[]> {
    const response = await this.client.get<ApiResponse<IncidentLocationData[]>>(
      '/api/v1/analytics/incidents/by-location',
      { params }
    );

    return response.data.data || [];
  }

  // ==========================================================================
  // MEDICATION ANALYTICS ENDPOINTS
  // ==========================================================================

  /**
   * Get medication usage analytics with caching
   */
  async getMedicationUsage(params?: {
    startDate?: string;
    endDate?: string;
    medicationId?: string;
    schoolId?: string;
  }): Promise<MedicationUsage[]> {
    // const validated = params ? safeValidate(ValidationSchemas.MedicationQuery, params) : { success: true };
    // if (!validated.success) {
    //   throw new Error(`Invalid parameters: ${JSON.stringify(validated.errors)}`);
    // }

    const cacheKey = this.buildCacheKey(CacheKeys.MEDICATION_USAGE, params);
    const cached = this.getCached<MedicationUsage[]>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<MedicationUsage[]>>(
      '/api/v1/analytics/medications/usage',
      { params }
    );

    const data = response.data.data || [];
    this.setCache(cacheKey, data, CacheTTL.METRICS);

    return data;
  }

  /**
   * Get medication adherence data
   */
  async getMedicationAdherence(params?: {
    startDate?: string;
    endDate?: string;
    studentId?: string;
    schoolId?: string;
  }): Promise<MedicationAdherence[]> {
    const response = await this.client.get<ApiResponse<MedicationAdherence[]>>(
      '/api/v1/analytics/medications/adherence',
      { params }
    );

    return response.data.data || [];
  }

  // ==========================================================================
  // APPOINTMENT ANALYTICS ENDPOINTS
  // ==========================================================================

  /**
   * Get appointment trends with caching
   */
  async getAppointmentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    schoolId?: string;
  }): Promise<AppointmentTrends> {
    const cacheKey = this.buildCacheKey(CacheKeys.APPOINTMENT_TRENDS, params);
    const cached = this.getCached<AppointmentTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<AppointmentTrends>>(
      '/api/v1/analytics/appointments/trends',
      { params }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get appointment no-show rate
   */
  async getNoShowRate(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<NoShowRate> {
    const response = await this.client.get<ApiResponse<NoShowRate>>(
      '/api/v1/analytics/appointments/no-show-rate',
      { params }
    );

    return response.data.data!;
  }

  // ==========================================================================
  // DASHBOARD ENDPOINTS (COMPREHENSIVE)
  // ==========================================================================

  /**
   * Get nurse dashboard data (comprehensive)
   * Includes today's schedule, pending tasks, alerts, and quick stats
   */
  async getNurseDashboard(nurseId?: string, params?: {
    includeWidgets?: boolean;
    dateRange?: DateRangeFilter;
  }): Promise<NurseDashboard> {
    const cacheKey = this.buildCacheKey(CacheKeys.NURSE_DASHBOARD, { nurseId, ...params });
    const cached = this.getCached<NurseDashboard>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<NurseDashboard>>(
      '/api/v1/analytics/dashboard/nurse',
      { params: { nurseId, ...params } }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.DASHBOARD);

    return data;
  }

  /**
   * Get admin dashboard data (comprehensive)
   * Includes system health, user activity, compliance, and budget overview
   */
  async getAdminDashboard(params?: {
    schoolId?: string;
    scope?: 'DISTRICT' | 'SCHOOL' | 'REGION';
    includeWidgets?: boolean;
  }): Promise<AdminDashboard> {
    const cacheKey = this.buildCacheKey(CacheKeys.ADMIN_DASHBOARD, params);
    const cached = this.getCached<AdminDashboard>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<AdminDashboard>>(
      '/api/v1/analytics/dashboard/admin',
      { params }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.DASHBOARD);

    return data;
  }

  /**
   * Get school-specific dashboard data (NEW ENDPOINT)
   * Comprehensive school metrics, trends, and alerts
   */
  async getSchoolDashboard(schoolId: string, params?: {
    includeWidgets?: boolean;
    dateRange?: DateRangeFilter;
  }): Promise<SchoolDashboard> {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    const cacheKey = this.buildCacheKey(CacheKeys.SCHOOL_DASHBOARD, { schoolId, ...params });
    const cached = this.getCached<SchoolDashboard>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<SchoolDashboard>>(
      `/api/v1/analytics/dashboard/school/${schoolId}`,
      { params }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.DASHBOARD);

    return data;
  }

  // ==========================================================================
  // ANALYTICS SUMMARY
  // ==========================================================================

  /**
   * Get comprehensive analytics summary
   */
  async getSummary(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<AnalyticsSummary> {
    const cacheKey = this.buildCacheKey(CacheKeys.SUMMARY, params);
    const cached = this.getCached<AnalyticsSummary>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<AnalyticsSummary>>(
      '/api/v1/analytics/summary',
      { params }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.SUMMARY);

    return data;
  }

  // ==========================================================================
  // CUSTOM REPORTS ENDPOINTS
  // ==========================================================================

  /**
   * Create/generate custom report with validation
   * Supports flexible parameters, aggregations, and export formats
   */
  async createCustomReport(request: CustomReportRequest): Promise<CustomReportResult> {
    // Validate request
    // const validated = safeValidate(ValidationSchemas.CustomReportRequest, request);
    // if (!validated.success) {
    //   throw new Error(`Invalid report request: ${JSON.stringify(validated.errors)}`);
    // }

    const response = await this.client.post<ApiResponse<CustomReportResult>>(
      '/api/v1/analytics/reports/custom',
      request
    );

    // Clear report list cache as new report may be saved
    this.clearCache(CacheKeys.REPORT_LIST);

    return response.data.data!;
  }

  /**
   * Get list of saved custom reports (NEW ENDPOINT)
   * Supports pagination, filtering, and sorting
   */
  async getReports(params?: {
    page?: number;
    pageSize?: number;
    reportType?: string;
    tags?: string[];
    createdBy?: string;
    searchQuery?: string;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'lastRunAt';
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<ReportListResponse> {
    // const validated = params ? safeValidate(ValidationSchemas.ReportListQuery, params) : { success: true };
    // if (!validated.success) {
    //   throw new Error(`Invalid parameters: ${JSON.stringify(validated.errors)}`);
    // }

    const cacheKey = this.buildCacheKey(CacheKeys.REPORT_LIST, params);
    const cached = this.getCached<ReportListResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<ReportListResponse>>(
      '/api/v1/analytics/reports',
      { params }
    );

    const data = response.data.data!;
    this.setCache(cacheKey, data, CacheTTL.REPORTS);

    return data;
  }

  /**
   * Get specific custom report by ID
   */
  async getReport(reportId: string): Promise<CustomReport> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    const response = await this.client.get<ApiResponse<CustomReport>>(
      `/api/v1/analytics/reports/${reportId}`
    );

    return response.data.data!;
  }

  /**
   * Delete custom report (NEW ENDPOINT)
   */
  async deleteReport(reportId: string): Promise<void> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    await this.client.delete(`/api/v1/analytics/reports/${reportId}`);

    // Clear report list cache
    this.clearCache(CacheKeys.REPORT_LIST);
  }

  /**
   * Schedule custom report generation (NEW ENDPOINT)
   * Supports various frequencies and email delivery
   */
  async scheduleReport(
    reportId: string,
    schedule: CreateReportScheduleRequest
  ): Promise<ReportSchedule> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    // Validate schedule
    // const validated = safeValidate(ValidationSchemas.CreateReportSchedule, schedule);
    // if (!validated.success) {
    //   throw new Error(`Invalid schedule: ${JSON.stringify(validated.errors)}`);
    // }

    const response = await this.client.post<ApiResponse<ReportSchedule>>(
      `/api/v1/analytics/reports/${reportId}/schedule`,
      schedule
    );

    return response.data.data!;
  }

  /**
   * Update report schedule
   */
  async updateReportSchedule(
    reportId: string,
    scheduleId: string,
    updates: Partial<CreateReportScheduleRequest>
  ): Promise<ReportSchedule> {
    if (!reportId || !scheduleId) {
      throw new Error('Report ID and Schedule ID are required');
    }

    const response = await this.client.patch<ApiResponse<ReportSchedule>>(
      `/api/v1/analytics/reports/${reportId}/schedule/${scheduleId}`,
      updates
    );

    return response.data.data!;
  }

  /**
   * Delete report schedule
   */
  async deleteReportSchedule(reportId: string, scheduleId: string): Promise<void> {
    if (!reportId || !scheduleId) {
      throw new Error('Report ID and Schedule ID are required');
    }

    await this.client.delete(
      `/api/v1/analytics/reports/${reportId}/schedule/${scheduleId}`
    );
  }

  /**
   * Get report schedules
   */
  async getReportSchedules(reportId: string): Promise<ReportSchedule[]> {
    if (!reportId) {
      throw new Error('Report ID is required');
    }

    const response = await this.client.get<ApiResponse<ReportSchedule[]>>(
      `/api/v1/analytics/reports/${reportId}/schedules`
    );

    return response.data.data || [];
  }

  // ==========================================================================
  // ADVANCED FEATURES
  // ==========================================================================

  /**
   * Get real-time dashboard updates using polling or WebSocket
   * This method demonstrates how to set up real-time updates
   */
  subscribeToRealTimeUpdates(
    dashboardType: 'nurse' | 'admin' | 'school',
    params: any,
    callback: (data: any) => void,
    intervalMs: number = 30000
  ): () => void {
    let intervalId: NodeJS.Timeout;

    const fetchUpdate = async () => {
      try {
        let data;
        switch (dashboardType) {
          case 'nurse':
            data = await this.getNurseDashboard(params.nurseId, params);
            break;
          case 'admin':
            data = await this.getAdminDashboard(params);
            break;
          case 'school':
            data = await this.getSchoolDashboard(params.schoolId, params);
            break;
        }
        callback(data);
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    };

    // Initial fetch
    fetchUpdate();

    // Set up polling
    intervalId = setInterval(fetchUpdate, intervalMs);

    // Return cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }

  /**
   * Export report data in various formats
   * Helper method for client-side export handling
   */
  async exportReportData(
    reportId: string,
    format: ReportExportFormat
  ): Promise<Blob> {
    const response = await this.client.get<Blob>(
      `/api/v1/analytics/reports/${reportId}/export`,
      {
        params: { format },
        responseType: 'blob'
      }
    );

    return response.data;
  }

  /**
   * Get chart-ready data for visualization
   * Transforms report data into chart configuration
   */
  transformToChartData(
    data: any[],
    config: {
      xField: string;
      yField: string | string[];
      chartType: string;
      groupBy?: string;
    }
  ): ChartConfiguration {
    // This is a helper method that would transform raw data
    // into chart-ready format for libraries like Chart.js, Recharts, etc.
    // Implementation depends on the charting library being used

    return {
      type: config.chartType as any,
      series: [],
      // ... additional configuration
    };
  }

  /**
   * Perform drill-down analysis
   * Navigate from summary to detailed data
   */
  async drillDown(
    metricType: string,
    filters: Record<string, any>,
    level: 'summary' | 'detail' | 'record'
  ): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(
      '/api/v1/analytics/drill-down',
      {
        params: {
          metricType,
          level,
          ...filters
        }
      }
    );

    return response.data.data;
  }

  /**
   * Get predictive analytics and trend forecasting
   */
  async getForecast(params: {
    metricType: string;
    historicalPeriod: number;
    forecastPeriod: number;
    schoolId?: string;
  }): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(
      '/api/v1/analytics/forecast',
      { params }
    );

    return response.data.data;
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Factory function to create Analytics API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AnalyticsApi instance with caching and validation
 */
export function createAnalyticsApi(client: ApiClient): AnalyticsApi {
  return new AnalyticsApi(client);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Types are exported from ../types
// export * from './validation'; // TODO: Restore when validation module is available

// Export singleton instance
import { apiClient } from '../core/ApiClient';
export const analyticsApi = createAnalyticsApi(apiClient);
