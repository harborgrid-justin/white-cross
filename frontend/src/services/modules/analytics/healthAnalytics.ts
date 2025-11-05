/**
 * @fileoverview Health Analytics API Module for Student Population Health Management
 * @module services/modules/analytics/healthAnalytics
 * @category Services - Analytics
 *
 * Provides comprehensive health metrics tracking, trend analysis, and population health insights
 * for student populations with intelligent caching and drill-down capabilities.
 *
 * ## Healthcare Application
 *
 * **Primary Use Cases**:
 * - **Population Health Monitoring**: Track overall health status across student populations
 * - **Chronic Condition Management**: Monitor students with ongoing health conditions
 * - **Preventive Care Planning**: Identify health trends requiring preventive interventions
 * - **Health Screening Programs**: Analyze screening compliance and results
 * - **Medication Adherence**: Track medication administration patterns
 * - **Vital Signs Monitoring**: Analyze vital sign trends for early intervention
 *
 * **Healthcare Benefits**:
 * - Early identification of health deterioration patterns
 * - Data-driven resource allocation for nursing staff
 * - Improved chronic condition management outcomes
 * - Evidence-based preventive care program planning
 * - Enhanced health screening program effectiveness
 * - HIPAA-compliant aggregated health reporting
 *
 * ## Key Features
 *
 * **Health Metrics Tracking**:
 * - Vital signs distribution and trends (blood pressure, heart rate, temperature, BMI)
 * - Chronic condition prevalence and management
 * - Medication administration rates and adherence
 * - Health screening completion rates
 * - Immunization coverage statistics
 * - Visit frequency patterns
 *
 * **Trend Analysis**:
 * - Time-series health data with period aggregation
 * - Year-over-year comparison capabilities
 * - Seasonal pattern identification (flu season, allergies)
 * - Cohort comparison (grade level, school)
 * - Risk stratification trends
 *
 * **Drill-Down Capabilities**:
 * - System-wide → School-specific → Student-specific
 * - Time period filtering with flexible date ranges
 * - Health metric type filtering
 * - Population segmentation by demographics
 *
 * **Performance Optimization**:
 * - 5-minute cache for general health metrics
 * - 10-minute cache for trend data
 * - Efficient cache key generation with parameter hashing
 * - Automatic cache invalidation on data updates
 *
 * ## Architecture
 *
 * This module implements the healthcare analytics pattern:
 * 1. **ApiClient Integration**: Authenticated requests with retry logic
 * 2. **Caching Layer**: Shared analytics cache for performance
 * 3. **Type Safety**: Strongly typed health metrics and responses
 * 4. **Privacy Compliance**: Aggregated data to protect PHI
 * 5. **Drill-Down Pattern**: Hierarchical data access (system → school → student)
 *
 * ## Privacy and Compliance
 *
 * **HIPAA Considerations**:
 * - Aggregated metrics protect individual student privacy
 * - Student-specific queries require appropriate authorization
 * - PHI is never exposed in cached data keys
 * - Audit trails maintained for all health data access
 *
 * ## Usage Patterns
 *
 * @example
 * **Population Health Overview**
 * ```typescript
 * import { healthAnalytics } from '@/services/modules/analytics';
 *
 * // Get overall health metrics for all schools
 * const metrics = await healthAnalytics.getHealthMetrics({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 *
 * // Display key health indicators
 * console.log(`Total health visits: ${metrics.totalVisits}`);
 * console.log(`Students with chronic conditions: ${metrics.chronicConditionCount}`);
 * console.log(`Medication adherence rate: ${(metrics.medicationAdherence * 100).toFixed(1)}%`);
 * console.log(`Immunization coverage: ${(metrics.immunizationCoverage * 100).toFixed(1)}%`);
 * ```
 *
 * @example
 * **School-Specific Health Trends**
 * ```typescript
 * // Analyze health trends for a specific school
 * const trends = await healthAnalytics.getHealthTrends({
 *   startDate: '2024-09-01',
 *   endDate: '2025-05-31',
 *   period: 'monthly',
 *   includeComparison: true,
 *   comparisonPeriod: 'PREVIOUS_YEAR'
 * });
 *
 * // Identify concerning trends
 * trends.periods.forEach(month => {
 *   const visitChange = month.comparisonData?.percentChange;
 *   if (visitChange && visitChange > 20) {
 *     console.warn(`${month.label}: ${visitChange}% increase in visits - investigate cause`);
 *   }
 * });
 * ```
 *
 * @example
 * **Student-Specific Health Monitoring**
 * ```typescript
 * // Monitor a student's health metrics over time
 * const studentMetrics = await healthAnalytics.getStudentHealthMetrics('student-123', {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   metricType: 'vital_signs'
 * });
 *
 * // Check for vital sign trends
 * studentMetrics.forEach(metric => {
 *   if (metric.type === 'blood_pressure' && metric.value > 130) {
 *     console.warn(`Elevated blood pressure on ${metric.date}: ${metric.value}`);
 *   }
 * });
 * ```
 *
 * @example
 * **Chronic Condition Management Dashboard**
 * ```typescript
 * // Get school-level chronic condition data
 * const schoolMetrics = await healthAnalytics.getSchoolHealthMetrics('school-123', {
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   metricType: 'chronic_conditions'
 * });
 *
 * // Identify most prevalent conditions
 * const conditions = schoolMetrics
 *   .sort((a, b) => b.count - a.count)
 *   .slice(0, 5);
 *
 * console.log('Top 5 chronic conditions:');
 * conditions.forEach(condition => {
 *   console.log(`  ${condition.name}: ${condition.count} students`);
 * });
 * ```
 *
 * @example
 * **TanStack Query Integration with Drill-Down**
 * ```typescript
 * import { useQuery } from '@tanstack/react-query';
 * import { healthAnalytics } from '@/services/modules/analytics';
 *
 * function HealthMetricsDashboard({ schoolId, studentId }) {
 *   // System-wide or school-specific metrics
 *   const { data: overallMetrics } = useQuery({
 *     queryKey: ['analytics', 'health-metrics', schoolId],
 *     queryFn: () => schoolId
 *       ? healthAnalytics.getSchoolHealthMetrics(schoolId, { metricType: 'all' })
 *       : healthAnalytics.getHealthMetrics({ metricType: 'all' }),
 *     staleTime: 300000 // 5 minutes
 *   });
 *
 *   // Student-specific drill-down (if selected)
 *   const { data: studentMetrics, isLoading } = useQuery({
 *     queryKey: ['analytics', 'student-health', studentId],
 *     queryFn: () => healthAnalytics.getStudentHealthMetrics(studentId),
 *     enabled: !!studentId,
 *     staleTime: 180000 // 3 minutes
 *   });
 *
 *   return <HealthDashboard overall={overallMetrics} student={studentMetrics} />;
 * }
 * ```
 *
 * @see {@link AppointmentAnalytics} for appointment-related health data
 * @see {@link MedicationAnalytics} for medication-specific analytics
 * @see {@link DashboardAnalytics} for dashboard-specific health data
 * @see {@link ReportsAnalytics} for custom health reports
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  HealthMetrics,
  HealthTrends,
  ComparisonPeriod
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Health Analytics API Service
 *
 * @class
 * @classdesc Provides comprehensive health analytics for student populations including
 * metrics tracking, trend analysis, and drill-down capabilities with intelligent caching.
 *
 * **Service Architecture**:
 * - Hierarchical data access: System → School → Student
 * - Intelligent caching with differentiated TTLs
 * - Type-safe API with comprehensive error handling
 * - HIPAA-compliant aggregated reporting
 *
 * **Healthcare Context**:
 * - Supports population health management
 * - Enables chronic condition monitoring
 * - Facilitates preventive care planning
 * - Provides early warning system for health deterioration
 *
 * **Caching Strategy**:
 * - General metrics: 5-minute cache (CacheTTL.METRICS)
 * - Trend data: 10-minute cache (CacheTTL.TRENDS)
 * - Student-specific: No caching (privacy/real-time needs)
 * - School-specific: No caching (real-time needs)
 *
 * **Privacy Protection**:
 * - Aggregated data prevents individual identification
 * - PHI never exposed in cache keys
 * - Authorization enforced at API level
 * - Audit trails for all data access
 *
 * @example
 * **Population Health Monitoring**
 * ```typescript
 * const healthAnalytics = new HealthAnalytics(apiClient);
 *
 * // Get system-wide health metrics
 * const metrics = await healthAnalytics.getHealthMetrics({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 *
 * // Identify areas requiring attention
 * if (metrics.medicationAdherence < 0.85) {
 *   console.warn('Low medication adherence - review adherence programs');
 * }
 * ```
 */
export class HealthAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get aggregated health metrics with optional filtering
   *
   * @param {Object} [params] - Query parameters for filtering health metrics
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.metricType] - Filter by metric type (vital_signs, chronic_conditions, medications, etc.)
   * @param {string} [params.schoolId] - Filter by specific school ID
   * @param {string} [params.studentId] - Filter by specific student ID (requires authorization)
   * @returns {Promise<HealthMetrics[]>} Array of health metrics matching the criteria
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid (must be ISO 8601 YYYY-MM-DD)
   * @throws {Error} If unauthorized to access student-specific data
   *
   * @description
   * Retrieves aggregated health metrics with intelligent caching. Results include:
   * - Vital signs distribution (BP, HR, temp, BMI)
   * - Chronic condition prevalence
   * - Medication administration rates
   * - Health screening completion
   * - Immunization coverage
   * - Visit frequency patterns
   *
   * **Caching Behavior**:
   * - Cached for 5 minutes (CacheTTL.METRICS)
   * - Cache key includes all parameters
   * - Automatic expiration after TTL
   *
   * **Privacy Notes**:
   * - Aggregated data protects student privacy
   * - Student-specific queries require proper authorization
   * - PHI never exposed in cache keys
   *
   * @example
   * **System-Wide Health Overview**
   * ```typescript
   * const metrics = await healthAnalytics.getHealthMetrics({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31'
   * });
   *
   * // Analyze overall health status
   * metrics.forEach(metric => {
   *   console.log(`${metric.type}: ${metric.value} ${metric.unit}`);
   * });
   * ```
   *
   * @example
   * **Vital Signs Monitoring**
   * ```typescript
   * const vitalSigns = await healthAnalytics.getHealthMetrics({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   metricType: 'vital_signs',
   *   schoolId: 'school-123'
   * });
   *
   * // Check for abnormal trends
   * const highBP = vitalSigns.filter(m =>
   *   m.type === 'blood_pressure' && m.value > 130
   * );
   * if (highBP.length > 0) {
   *   console.warn(`${highBP.length} high BP readings require follow-up`);
   * }
   * ```
   *
   * @see {@link getHealthTrends} for time-series health trend analysis
   * @see {@link getStudentHealthMetrics} for student-specific metrics
   * @see {@link getSchoolHealthMetrics} for school-specific metrics
   */
  async getHealthMetrics(params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
    schoolId?: string;
    studentId?: string;
  }): Promise<HealthMetrics[]> {
    // Check cache
    const cacheKey = analyticsCache.buildKey(CacheKeys.HEALTH_METRICS, params);
    const cached = analyticsCache.get<HealthMetrics[]>(cacheKey);
    if (cached) return cached;

    // Fetch from API
    const response = await this.client.get<ApiResponse<HealthMetrics[]>>(
      '/analytics/health-metrics',
      { params }
    );

    const data = response.data.data || [];
    analyticsCache.set(cacheKey, data, CacheTTL.METRICS);

    return data;
  }

  /**
   * Get health trends over time with optional comparison
   *
   * @param {Object} [params] - Query parameters for health trend analysis
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {'daily' | 'weekly' | 'monthly'} [params.period='weekly'] - Aggregation period
   * @param {boolean} [params.includeComparison=false] - Include comparison to previous period
   * @param {ComparisonPeriod} [params.comparisonPeriod='PREVIOUS_PERIOD'] - Comparison period type
   * @returns {Promise<HealthTrends>} Health trends with period breakdowns and optional comparison
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid
   *
   * @description
   * Analyzes health metrics over time to identify trends, patterns, and anomalies.
   * Supports year-over-year comparison for seasonal pattern detection.
   *
   * **Caching Behavior**: Cached for 10 minutes (CacheTTL.TRENDS)
   *
   * **Use Cases**:
   * - Seasonal illness pattern detection (flu, allergies)
   * - Long-term health outcome trends
   * - Program effectiveness evaluation
   * - Early warning system for outbreaks
   *
   * @example
   * **Seasonal Pattern Detection**
   * ```typescript
   * const trends = await healthAnalytics.getHealthTrends({
   *   startDate: '2024-01-01',
   *   endDate: '2024-12-31',
   *   period: 'monthly',
   *   includeComparison: true,
   *   comparisonPeriod: 'PREVIOUS_YEAR'
   * });
   *
   * // Identify flu season impact
   * const winterMonths = trends.periods.filter(p =>
   *   ['January', 'February', 'December'].includes(p.label)
   * );
   * console.log('Winter health visit increase:',
   *   winterMonths.reduce((sum, m) => sum + m.comparisonData.percentChange, 0) / 3
   * );
   * ```
   *
   * @see {@link getHealthMetrics} for point-in-time metrics
   */
  async getHealthTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    includeComparison?: boolean;
    comparisonPeriod?: ComparisonPeriod;
  }): Promise<HealthTrends> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.HEALTH_TRENDS, params);
    const cached = analyticsCache.get<HealthTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<HealthTrends>>(
      '/analytics/health-trends',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get health metrics for a specific student
   *
   * @param {string} studentId - Student identifier (required)
   * @param {Object} [params] - Additional query parameters
   * @param {string} [params.startDate] - Start date in ISO 8601 format
   * @param {string} [params.endDate] - End date in ISO 8601 format
   * @param {string} [params.metricType] - Filter by specific metric type
   * @returns {Promise<HealthMetrics[]>} Student-specific health metrics
   * @throws {Error} If studentId is not provided or empty
   * @throws {Error} If unauthorized to access student data
   * @throws {Error} If API request fails
   *
   * @description
   * Retrieves health metrics for an individual student. Requires appropriate authorization.
   * **Not cached** to ensure real-time accuracy for patient care decisions.
   *
   * **Privacy & Authorization**:
   * - Requires FERPA/HIPAA compliant authorization
   * - PHI access logged for audit compliance
   * - Real-time data (no caching)
   *
   * @example
   * **Student Health Monitoring**
   * ```typescript
   * const metrics = await healthAnalytics.getStudentHealthMetrics('student-123', {
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   metricType: 'vital_signs'
   * });
   *
   * // Monitor for concerning trends
   * const recentBP = metrics
   *   .filter(m => m.type === 'blood_pressure')
   *   .sort((a, b) => new Date(b.date) - new Date(a.date))
   *   .slice(0, 3);
   *
   * if (recentBP.every(m => m.value > 130)) {
   *   console.warn('Consistent elevated BP - schedule follow-up');
   * }
   * ```
   *
   * @see {@link getSchoolHealthMetrics} for school-level aggregation
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
      `/analytics/health-metrics/student/${studentId}`,
      { params }
    );

    return response.data.data || [];
  }

  /**
   * Get aggregated health metrics for a specific school
   *
   * @param {string} schoolId - School identifier (required)
   * @param {Object} [params] - Additional query parameters
   * @param {string} [params.startDate] - Start date in ISO 8601 format
   * @param {string} [params.endDate] - End date in ISO 8601 format
   * @param {string} [params.metricType] - Filter by specific metric type
   * @returns {Promise<HealthMetrics[]>} School-aggregated health metrics
   * @throws {Error} If schoolId is not provided or empty
   * @throws {Error} If API request fails
   *
   * @description
   * Retrieves aggregated health metrics for a specific school.
   * **Not cached** to ensure current data for school health reporting.
   *
   * **Use Cases**:
   * - School health program evaluation
   * - Inter-school comparison
   * - Resource allocation planning
   * - Compliance reporting
   *
   * @example
   * **School Health Program Evaluation**
   * ```typescript
   * const metrics = await healthAnalytics.getSchoolHealthMetrics('school-123', {
   *   startDate: '2024-09-01',
   *   endDate: '2025-05-31'
   * });
   *
   * // Calculate key performance indicators
   * const totalVisits = metrics.reduce((sum, m) => sum + m.count, 0);
   * const avgPerStudent = totalVisits / schoolEnrollment;
   * console.log(`Average visits per student: ${avgPerStudent.toFixed(2)}`);
   * ```
   *
   * @see {@link getStudentHealthMetrics} for individual student data
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
      `/analytics/health-metrics/school/${schoolId}`,
      { params }
    );

    return response.data.data || [];
  }
}

/**
 * Factory function to create Health Analytics instance
 *
 * @param {ApiClient} client - Configured ApiClient instance with authentication
 * @returns {HealthAnalytics} Configured HealthAnalytics service instance
 *
 * @description
 * Creates a new HealthAnalytics instance. Recommended to use the singleton
 * `healthAnalytics` exported from the analytics module instead.
 *
 * @example
 * **Use Singleton (Recommended)**
 * ```typescript
 * import { healthAnalytics } from '@/services/modules/analytics';
 * const metrics = await healthAnalytics.getHealthMetrics();
 * ```
 *
 * @see {@link HealthAnalytics} for the main class documentation
 */
export function createHealthAnalytics(client: ApiClient): HealthAnalytics {
  return new HealthAnalytics(client);
}
