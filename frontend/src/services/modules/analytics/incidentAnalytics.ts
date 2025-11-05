/**
 * @fileoverview Incident Analytics API Module for School Safety Management
 * @module services/modules/analytics/incidentAnalytics
 * @category Services - Analytics
 *
 * Provides comprehensive incident analytics including trend analysis, location-based hotspot
 * identification, and safety metrics for proactive school safety management.
 *
 * ## Healthcare Application
 *
 * **Primary Use Cases**:
 * - **Safety Monitoring**: Track incident frequency and severity across schools
 * - **Hotspot Identification**: Identify high-risk locations for targeted interventions
 * - **Trend Analysis**: Detect patterns in incident types and timing
 * - **Preventive Planning**: Data-driven allocation of safety resources
 * - **Compliance Reporting**: Document incidents for regulatory requirements
 * - **Risk Assessment**: Evaluate overall school safety performance
 *
 * **Healthcare Safety Benefits**:
 * - Early identification of dangerous locations or situations
 * - Evidence-based allocation of supervision and safety resources
 * - Reduced injury rates through targeted interventions
 * - Improved emergency response planning
 * - Enhanced student and staff safety outcomes
 * - Regulatory compliance through comprehensive documentation
 *
 * ## Key Features
 *
 * **Incident Trend Analysis**:
 * - Time-series incident data with period aggregation
 * - Incident type distribution (injury, illness, behavioral)
 * - Severity level tracking (minor, moderate, severe)
 * - Time-based patterns (time of day, day of week, seasonal)
 * - Year-over-year comparison capabilities
 *
 * **Location-Based Analytics**:
 * - Incident frequency by location (playground, cafeteria, gym, classroom)
 * - Hotspot identification for targeted supervision
 * - Geographic distribution analysis
 * - Location-type correlation (outdoor vs indoor)
 * - Risk level mapping by area
 *
 * **Safety Metrics**:
 * - Incident rates per student population
 * - Response time tracking
 * - Injury severity distribution
 * - Repeat incident analysis
 * - Staff intervention effectiveness
 *
 * **Performance Optimization**:
 * - 10-minute cache for trend data (stable aggregate data)
 * - No caching for location data (requires current accuracy)
 * - Efficient cache key generation
 * - Automatic cache invalidation on updates
 *
 * ## Architecture
 *
 * This module implements the school safety analytics pattern:
 * 1. **ApiClient Integration**: Authenticated requests with retry logic
 * 2. **Caching Layer**: Shared analytics cache for trends only
 * 3. **Type Safety**: Strongly typed incident data and metrics
 * 4. **Real-time Location Data**: No caching for hotspot identification
 * 5. **Privacy Compliance**: Incident data aggregated to protect student identity
 *
 * ## Privacy and Compliance
 *
 * **Privacy Considerations**:
 * - Aggregated incident data protects student identity
 * - Location data anonymized at appropriate granularity
 * - Student-identifiable information requires authorization
 * - Audit trails maintained for all incident data access
 *
 * ## Usage Patterns
 *
 * @example
 * **School Safety Dashboard**
 * ```typescript
 * import { incidentAnalytics } from '@/services/modules/analytics';
 *
 * // Get incident trends to identify safety patterns
 * const trends = await incidentAnalytics.getIncidentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly',
 *   schoolId: 'school-123'
 * });
 *
 * // Display key safety metrics
 * console.log(`Total incidents: ${trends.totalCount}`);
 * console.log(`Injury rate: ${trends.injuryRate.toFixed(2)} per 100 students`);
 * console.log(`Average severity: ${trends.averageSeverity.toFixed(1)}/10`);
 *
 * // Identify concerning weeks
 * trends.periods.forEach(week => {
 *   if (week.count > trends.averageCount * 1.5) {
 *     console.warn(`Week ${week.label}: ${week.count} incidents (${((week.count / trends.averageCount - 1) * 100).toFixed(0)}% above average)`);
 *   }
 * });
 * ```
 *
 * @example
 * **Hotspot Identification for Targeted Interventions**
 * ```typescript
 * // Identify high-risk locations requiring increased supervision
 * const locationData = await incidentAnalytics.getIncidentsByLocation({
 *   startDate: '2024-09-01',
 *   endDate: '2025-05-31',
 *   schoolId: 'school-123'
 * });
 *
 * // Sort by incident frequency to find hotspots
 * const hotspots = locationData
 *   .sort((a, b) => b.count - a.count)
 *   .slice(0, 5);
 *
 * console.log('Top 5 incident hotspots requiring attention:');
 * hotspots.forEach((location, index) => {
 *   console.log(`${index + 1}. ${location.locationName}: ${location.count} incidents`);
 *   console.log(`   Severity: ${location.averageSeverity.toFixed(1)}/10`);
 *   console.log(`   Most common type: ${location.mostCommonType}`);
 *   console.log(`   Recommendation: ${location.count > 10 ? 'Increase supervision' : 'Monitor closely'}`);
 * });
 * ```
 *
 * @example
 * **Incident Type Analysis**
 * ```typescript
 * // Analyze incident types to allocate resources
 * const trends = await incidentAnalytics.getIncidentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'monthly'
 * });
 *
 * // Break down by incident type
 * const typeDistribution = trends.byType;
 * const total = trends.totalCount;
 *
 * console.log('Incident Type Distribution:');
 * console.log(`  Injuries: ${(typeDistribution.injury / total * 100).toFixed(1)}%`);
 * console.log(`  Illness: ${(typeDistribution.illness / total * 100).toFixed(1)}%`);
 * console.log(`  Behavioral: ${(typeDistribution.behavioral / total * 100).toFixed(1)}%`);
 * console.log(`  Other: ${(typeDistribution.other / total * 100).toFixed(1)}%`);
 * ```
 *
 * @example
 * **Seasonal Safety Pattern Detection**
 * ```typescript
 * // Compare incident rates across school year to identify seasonal patterns
 * const fallData = await incidentAnalytics.getIncidentTrends({
 *   startDate: '2024-09-01',
 *   endDate: '2024-11-30',
 *   period: 'monthly'
 * });
 *
 * const springData = await incidentAnalytics.getIncidentTrends({
 *   startDate: '2025-03-01',
 *   endDate: '2025-05-31',
 *   period: 'monthly'
 * });
 *
 * const fallAvg = fallData.totalCount / fallData.periods.length;
 * const springAvg = springData.totalCount / springData.periods.length;
 *
 * console.log(`Fall average: ${fallAvg.toFixed(1)} incidents/month`);
 * console.log(`Spring average: ${springAvg.toFixed(1)} incidents/month`);
 *
 * if (springAvg > fallAvg * 1.2) {
 *   console.warn('Spring shows 20%+ increase - likely due to outdoor activities');
 *   console.log('Recommendation: Increase playground supervision in spring months');
 * }
 * ```
 *
 * @example
 * **TanStack Query Integration**
 * ```typescript
 * import { useQuery } from '@tanstack/react-query';
 * import { incidentAnalytics } from '@/services/modules/analytics';
 *
 * function SafetyDashboard({ schoolId, dateRange }) {
 *   // Load incident trends with caching
 *   const { data: trends, isLoading: trendsLoading } = useQuery({
 *     queryKey: ['analytics', 'incident-trends', schoolId, dateRange],
 *     queryFn: () => incidentAnalytics.getIncidentTrends({
 *       ...dateRange,
 *       schoolId,
 *       period: 'weekly'
 *     }),
 *     staleTime: 600000 // 10 minutes
 *   });
 *
 *   // Load location hotspots (no caching - always fresh)
 *   const { data: hotspots, isLoading: hotspotsLoading } = useQuery({
 *     queryKey: ['analytics', 'incident-locations', schoolId, dateRange],
 *     queryFn: () => incidentAnalytics.getIncidentsByLocation({
 *       ...dateRange,
 *       schoolId
 *     }),
 *     staleTime: 0 // Always fetch fresh data for safety decisions
 *   });
 *
 *   if (trendsLoading || hotspotsLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <TrendsChart data={trends} />
 *       <HotspotMap locations={hotspots} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link HealthAnalytics} for health-related incident data
 * @see {@link DashboardAnalytics} for dashboard-specific incident summaries
 * @see {@link ReportsAnalytics} for detailed incident reports
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  IncidentTrends,
  IncidentLocationData
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Incident Analytics API Service
 *
 * @class
 * @classdesc Provides comprehensive incident analytics for school safety management including
 * trend analysis, hotspot identification, and safety metrics with intelligent caching.
 *
 * **Service Architecture**:
 * - Trend data cached for performance (10-minute TTL)
 * - Location data always fresh (no caching for safety decisions)
 * - Type-safe API with comprehensive error handling
 * - Privacy-compliant aggregated reporting
 *
 * **School Safety Context**:
 * - Supports proactive safety management
 * - Enables data-driven resource allocation
 * - Facilitates hotspot identification
 * - Provides early warning for safety issues
 *
 * **Caching Strategy**:
 * - Incident trends: 10-minute cache (CacheTTL.TRENDS)
 * - Location data: No caching (requires real-time accuracy for safety)
 * - Cache keys include all parameters
 * - Automatic expiration after TTL
 *
 * **Privacy Protection**:
 * - Aggregated data prevents student identification
 * - Location granularity protects privacy
 * - Authorization enforced at API level
 * - Audit trails for all incident data access
 *
 * @example
 * **Safety Monitoring**
 * ```typescript
 * const incidentAnalytics = new IncidentAnalytics(apiClient);
 *
 * // Monitor incident trends
 * const trends = await incidentAnalytics.getIncidentTrends({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   period: 'weekly'
 * });
 *
 * // Alert on elevated incident rates
 * if (trends.totalCount > trends.expectedCount * 1.3) {
 *   console.warn('Incident rate 30% above expected - investigate causes');
 * }
 * ```
 */
export class IncidentAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get incident trends over time with aggregation and analysis
   *
   * @param {Object} [params] - Query parameters for filtering incident trends
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {'daily' | 'weekly' | 'monthly'} [params.period='weekly'] - Aggregation period for trend data
   * @param {string} [params.schoolId] - Filter by specific school ID
   * @returns {Promise<IncidentTrends>} Incident trends with period breakdowns, types, and metrics
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid (must be ISO 8601 YYYY-MM-DD)
   *
   * @description
   * Retrieves incident trends aggregated by period with detailed metrics. Results include:
   * - Total incident count for the date range
   * - Period-by-period breakdown (daily/weekly/monthly)
   * - Incident type distribution (injury, illness, behavioral, other)
   * - Severity metrics (average, distribution)
   * - Time-of-day and day-of-week patterns
   * - Year-over-year comparison (optional)
   *
   * **Caching Behavior**:
   * - Cached for 10 minutes (CacheTTL.TRENDS)
   * - Cache key includes all parameters
   * - Subsequent identical requests return cached data
   *
   * **Safety Use Cases**:
   * - **Pattern Detection**: Identify temporal patterns in incidents
   * - **Resource Planning**: Allocate supervision based on high-incident periods
   * - **Intervention Effectiveness**: Measure impact of safety programs
   * - **Compliance**: Document incident rates for regulatory reporting
   *
   * @example
   * **Weekly Incident Monitoring**
   * ```typescript
   * const trends = await incidentAnalytics.getIncidentTrends({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   period: 'weekly',
   *   schoolId: 'school-123'
   * });
   *
   * console.log(`Total incidents: ${trends.totalCount}`);
   * trends.periods.forEach(week => {
   *   console.log(`${week.label}: ${week.count} incidents`);
   *   if (week.severity.average > 5) {
   *     console.warn(`  High severity week: ${week.severity.average.toFixed(1)}/10`);
   *   }
   * });
   * ```
   *
   * @example
   * **Incident Type Analysis for Resource Allocation**
   * ```typescript
   * const trends = await incidentAnalytics.getIncidentTrends({
   *   startDate: '2024-09-01',
   *   endDate: '2025-05-31',
   *   period: 'monthly'
   * });
   *
   * // Analyze predominant incident type
   * const byType = trends.byType;
   * const total = trends.totalCount;
   *
   * if (byType.injury / total > 0.6) {
   *   console.warn('Injuries account for 60%+ of incidents');
   *   console.log('Recommendation: Review safety equipment and supervision protocols');
   * } else if (byType.illness / total > 0.4) {
   *   console.log('Illness-heavy profile - ensure adequate health screening');
   * }
   * ```
   *
   * @see {@link getIncidentsByLocation} for location-based hotspot analysis
   * @see {@link DashboardAnalytics.getSchoolDashboard} for school-specific incident summaries
   */
  async getIncidentTrends(params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    schoolId?: string;
  }): Promise<IncidentTrends> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.INCIDENT_TRENDS, params);
    const cached = analyticsCache.get<IncidentTrends>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<IncidentTrends>>(
      '/analytics/incidents/trends',
      { params }
    );

    const data = response.data.data!;
    analyticsCache.set(cacheKey, data, CacheTTL.TRENDS);

    return data;
  }

  /**
   * Get incidents by location to identify safety hotspots
   *
   * @param {Object} [params] - Query parameters for location-based analysis
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.schoolId] - Filter by specific school ID
   * @returns {Promise<IncidentLocationData[]>} Array of incident data by location with hotspot metrics
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid
   *
   * @description
   * Retrieves incident distribution by location for hotspot identification and targeted
   * safety interventions. Results include:
   * - Incident count per location
   * - Average severity by location
   * - Most common incident types per location
   * - Time-of-day patterns by location
   * - Risk level categorization
   *
   * **Caching Behavior**:
   * - **Not cached**: Location data requires real-time accuracy for safety decisions
   * - Fresh data on every request
   * - Use for active safety management and supervision allocation
   *
   * **Safety Use Cases**:
   * - **Hotspot Identification**: Find high-risk locations requiring increased supervision
   * - **Resource Allocation**: Deploy staff to locations with highest incident rates
   * - **Facility Planning**: Identify areas needing safety improvements
   * - **Supervision Scheduling**: Allocate coverage to high-incident times/locations
   *
   * **Privacy Notes**:
   * - Location data aggregated to prevent student identification
   * - Granularity appropriate for safety without compromising privacy
   *
   * @example
   * **Identify High-Risk Locations**
   * ```typescript
   * const locationData = await incidentAnalytics.getIncidentsByLocation({
   *   startDate: '2024-09-01',
   *   endDate: '2025-05-31',
   *   schoolId: 'school-123'
   * });
   *
   * // Sort by risk level (incident count * average severity)
   * const riskScore = locationData.map(loc => ({
   *   ...loc,
   *   risk: loc.count * loc.averageSeverity
   * })).sort((a, b) => b.risk - a.risk);
   *
   * console.log('High-Risk Locations Requiring Attention:');
   * riskScore.slice(0, 5).forEach(location => {
   *   console.log(`\n${location.locationName}:`);
   *   console.log(`  Incidents: ${location.count}`);
   *   console.log(`  Avg Severity: ${location.averageSeverity.toFixed(1)}/10`);
   *   console.log(`  Risk Score: ${location.risk.toFixed(1)}`);
   *   console.log(`  Action: ${location.risk > 50 ? 'URGENT - Increase supervision immediately' : 'Monitor closely'}`);
   * });
   * ```
   *
   * @example
   * **Allocate Supervision Resources**
   * ```typescript
   * const locations = await incidentAnalytics.getIncidentsByLocation({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31'
   * });
   *
   * // Group locations by supervision needs
   * const highRisk = locations.filter(l => l.count > 10);
   * const mediumRisk = locations.filter(l => l.count >= 5 && l.count <= 10);
   * const lowRisk = locations.filter(l => l.count < 5);
   *
   * console.log('\nSupervision Allocation Recommendations:');
   * console.log(`High-risk locations (>10 incidents): ${highRisk.length}`);
   * highRisk.forEach(l => console.log(`  - ${l.locationName}: 2+ staff members`));
   *
   * console.log(`\nMedium-risk locations (5-10 incidents): ${mediumRisk.length}`);
   * mediumRisk.forEach(l => console.log(`  - ${l.locationName}: 1-2 staff members`));
   *
   * console.log(`\nLow-risk locations (<5 incidents): ${lowRisk.length}`);
   * console.log('  Standard supervision protocols');
   * ```
   *
   * @example
   * **Time-of-Day Safety Planning**
   * ```typescript
   * const locations = await incidentAnalytics.getIncidentsByLocation({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31'
   * });
   *
   * // Analyze playground incidents by time
   * const playground = locations.find(l => l.locationName === 'Playground');
   * if (playground && playground.byTimeOfDay) {
   *   const peakTime = Object.entries(playground.byTimeOfDay)
   *     .sort(([,a], [,b]) => b - a)[0];
   *
   *   console.log(`Playground peak incident time: ${peakTime[0]} (${peakTime[1]} incidents)`);
   *   console.log('Recommendation: Schedule additional supervision during this period');
   * }
   * ```
   *
   * @see {@link getIncidentTrends} for overall incident trend analysis
   * @see {@link HealthAnalytics} for injury-specific health data
   */
  async getIncidentsByLocation(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): Promise<IncidentLocationData[]> {
    const response = await this.client.get<ApiResponse<IncidentLocationData[]>>(
      '/analytics/incidents/by-location',
      { params }
    );

    return response.data.data || [];
  }
}

/**
 * Factory function to create Incident Analytics instance
 *
 * @param {ApiClient} client - Configured ApiClient instance with authentication
 * @returns {IncidentAnalytics} Configured IncidentAnalytics service instance
 *
 * @description
 * Creates a new IncidentAnalytics instance. Recommended to use the singleton
 * `incidentAnalytics` exported from the analytics module instead.
 *
 * @example
 * **Use Singleton (Recommended)**
 * ```typescript
 * import { incidentAnalytics } from '@/services/modules/analytics';
 * const trends = await incidentAnalytics.getIncidentTrends();
 * ```
 *
 * @see {@link IncidentAnalytics} for the main class documentation
 */
export function createIncidentAnalytics(client: ApiClient): IncidentAnalytics {
  return new IncidentAnalytics(client);
}
