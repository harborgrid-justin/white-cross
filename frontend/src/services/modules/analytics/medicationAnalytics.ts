/**
 * @fileoverview Medication Analytics API Module for Medication Management Insights
 * @module services/modules/analytics/medicationAnalytics
 * @category Services - Analytics
 *
 * Provides comprehensive medication analytics including usage patterns, adherence tracking,
 * compliance monitoring, and stock management for school health medication administration.
 *
 * ## Healthcare Application
 *
 * **Primary Use Cases**:
 * - **Adherence Monitoring**: Track medication administration compliance for chronic conditions
 * - **Usage Pattern Analysis**: Identify medication usage trends and patterns
 * - **Stock Management**: Monitor medication inventory and prevent shortages
 * - **Compliance Reporting**: Document administration rates for regulatory compliance
 * - **Cost Analysis**: Track medication costs and identify optimization opportunities
 * - **Safety Monitoring**: Identify potential medication administration issues
 *
 * **Healthcare Benefits**:
 * - Improved medication adherence through pattern-based interventions
 * - Reduced medication errors through systematic monitoring
 * - Optimized medication inventory management
 * - Enhanced chronic condition management outcomes
 * - Evidence-based medication policy decisions
 * - Regulatory compliance through comprehensive documentation
 *
 * ## Key Features
 *
 * **Usage Analytics**:
 * - Medication administration frequency and timing
 * - Medication type distribution (prescribed, PRN, emergency)
 * - Student population medication usage patterns
 * - Seasonal usage variations (asthma inhalers, EpiPens, etc.)
 * - School-specific and system-wide analytics
 *
 * **Adherence Tracking**:
 * - Scheduled dose administration rates
 * - Missed dose identification and patterns
 * - Student-specific adherence metrics
 * - Time-of-day administration compliance
 * - Chronic condition medication adherence
 *
 * **Stock and Inventory**:
 * - Medication usage rates for inventory planning
 * - Expiration tracking and waste reduction
 * - Cost per student analysis
 * - Reorder point recommendations
 * - Emergency medication availability monitoring
 *
 * **Performance Optimization**:
 * - 5-minute cache for usage metrics (balance freshness and performance)
 * - No caching for adherence data (requires real-time accuracy for interventions)
 * - Efficient cache key generation
 * - Automatic cache invalidation on data updates
 *
 * ## Architecture
 *
 * This module implements the medication management analytics pattern:
 * 1. **ApiClient Integration**: Authenticated requests with retry logic
 * 2. **Selective Caching**: Usage data cached, adherence data real-time
 * 3. **Type Safety**: Strongly typed medication data and metrics
 * 4. **Privacy Compliance**: Aggregated data protects student PHI
 * 5. **Real-time Adherence**: No caching for intervention-critical data
 *
 * ## Privacy and Compliance
 *
 * **HIPAA Considerations**:
 * - Medication data is PHI and requires appropriate authorization
 * - Aggregated usage data protects individual student privacy
 * - Student-specific adherence queries require proper authorization
 * - PHI never exposed in cache keys
 * - Audit trails maintained for all medication data access
 *
 * ## Usage Patterns
 *
 * @example
 * **Medication Usage Overview**
 * ```typescript
 * import { medicationAnalytics } from '@/services/modules/analytics';
 *
 * // Get system-wide medication usage analytics
 * const usage = await medicationAnalytics.getMedicationUsage({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 *
 * // Display key medication metrics
 * usage.forEach(med => {
 *   console.log(`${med.medicationName}:`);
 *   console.log(`  Administrations: ${med.administrationCount}`);
 *   console.log(`  Unique students: ${med.studentCount}`);
 *   console.log(`  Avg daily use: ${(med.administrationCount / 31).toFixed(1)}`);
 *   console.log(`  Cost: $${med.totalCost.toFixed(2)}`);
 * });
 * ```
 *
 * @example
 * **Adherence Monitoring for Interventions**
 * ```typescript
 * // Monitor adherence to identify students needing support
 * const adherence = await medicationAnalytics.getMedicationAdherence({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   schoolId: 'school-123'
 * });
 *
 * // Identify students with poor adherence
 * const poorAdherence = adherence.filter(record =>
 *   record.adherenceRate < 0.80  // Less than 80% adherence
 * );
 *
 * console.log(`Students needing adherence support: ${poorAdherence.length}`);
 * poorAdherence.forEach(record => {
 *   console.log(`\nStudent ${record.studentId}:`);
 *   console.log(`  Medication: ${record.medicationName}`);
 *   console.log(`  Adherence: ${(record.adherenceRate * 100).toFixed(1)}%`);
 *   console.log(`  Missed doses: ${record.missedDoses}/${record.scheduledDoses}`);
 *   console.log(`  Action: ${record.adherenceRate < 0.70 ? 'URGENT intervention needed' : 'Follow up with parent/guardian'}`);
 * });
 * ```
 *
 * @example
 * **Inventory Planning Based on Usage**
 * ```typescript
 * // Analyze usage to optimize inventory
 * const usage = await medicationAnalytics.getMedicationUsage({
 *   startDate: '2024-09-01',
 *   endDate: '2025-05-31',  // Full school year
 *   schoolId: 'school-123'
 * });
 *
 * // Calculate reorder points
 * usage.forEach(med => {
 *   const daysOfData = 273;  // Days in school year
 *   const avgDailyUse = med.administrationCount / daysOfData;
 *   const monthlyUse = avgDailyUse * 30;
 *   const reorderPoint = monthlyUse * 1.5;  // 1.5 month buffer
 *
 *   console.log(`\n${med.medicationName}:`);
 *   console.log(`  Avg daily use: ${avgDailyUse.toFixed(2)} doses`);
 *   console.log(`  Monthly estimate: ${monthlyUse.toFixed(0)} doses`);
 *   console.log(`  Recommended stock: ${reorderPoint.toFixed(0)} doses`);
 *   console.log(`  Current stock: ${med.currentStock}`);
 *
 *   if (med.currentStock < reorderPoint) {
 *     console.warn(`  ⚠️  REORDER NEEDED - stock below recommended level`);
 *   }
 * });
 * ```
 *
 * @example
 * **Chronic Condition Medication Management**
 * ```typescript
 * // Monitor adherence for students with chronic conditions
 * const asthmaAdherence = await medicationAnalytics.getMedicationAdherence({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   medicationId: 'albuterol-inhaler'
 * });
 *
 * // Identify patterns
 * const avgAdherence = asthmaAdherence.reduce((sum, r) => sum + r.adherenceRate, 0) / asthmaAdherence.length;
 * console.log(`Average asthma medication adherence: ${(avgAdherence * 100).toFixed(1)}%`);
 *
 * // Find students with concerning patterns
 * const concerningCases = asthmaAdherence.filter(r =>
 *   r.adherenceRate < 0.75 && r.emergencyUseCount > 2
 * );
 *
 * console.log(`\nStudents with poor adherence + emergency use: ${concerningCases.length}`);
 * concerningCases.forEach(student => {
 *   console.log(`  Student ${student.studentId}: ${(student.adherenceRate * 100).toFixed(1)}% adherence, ${student.emergencyUseCount} emergency uses`);
 *   console.log(`  Action: Schedule asthma action plan review`);
 * });
 * ```
 *
 * @example
 * **Cost Analysis and Optimization**
 * ```typescript
 * // Analyze medication costs for budgeting
 * const usage = await medicationAnalytics.getMedicationUsage({
 *   startDate: '2024-09-01',
 *   endDate: '2025-05-31'
 * });
 *
 * // Calculate total costs
 * const totalCost = usage.reduce((sum, med) => sum + med.totalCost, 0);
 * const sortedByCost = usage.sort((a, b) => b.totalCost - a.totalCost);
 *
 * console.log(`Total medication cost: $${totalCost.toFixed(2)}`);
 * console.log(`\nTop 5 medications by cost:`);
 * sortedByCost.slice(0, 5).forEach((med, index) => {
 *   const percentOfTotal = (med.totalCost / totalCost * 100);
 *   console.log(`${index + 1}. ${med.medicationName}: $${med.totalCost.toFixed(2)} (${percentOfTotal.toFixed(1)}%)`);
 *   console.log(`   Per student: $${(med.totalCost / med.studentCount).toFixed(2)}`);
 * });
 * ```
 *
 * @example
 * **TanStack Query Integration**
 * ```typescript
 * import { useQuery } from '@tanstack/react-query';
 * import { medicationAnalytics } from '@/services/modules/analytics';
 *
 * function MedicationDashboard({ schoolId, dateRange }) {
 *   // Load usage data with caching
 *   const { data: usage, isLoading: usageLoading } = useQuery({
 *     queryKey: ['analytics', 'medication-usage', schoolId, dateRange],
 *     queryFn: () => medicationAnalytics.getMedicationUsage({
 *       ...dateRange,
 *       schoolId
 *     }),
 *     staleTime: 300000 // 5 minutes
 *   });
 *
 *   // Load adherence data (no caching - always fresh for interventions)
 *   const { data: adherence, isLoading: adherenceLoading } = useQuery({
 *     queryKey: ['analytics', 'medication-adherence', schoolId, dateRange],
 *     queryFn: () => medicationAnalytics.getMedicationAdherence({
 *       ...dateRange,
 *       schoolId
 *     }),
 *     staleTime: 0 // Always fetch fresh data for intervention decisions
 *   });
 *
 *   if (usageLoading || adherenceLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <UsageChart data={usage} />
 *       <AdherenceAlerts data={adherence} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link HealthAnalytics} for health-related metrics
 * @see {@link DashboardAnalytics} for dashboard-specific medication summaries
 * @see {@link ReportsAnalytics} for detailed medication reports
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse } from '../../utils/apiUtils';
import {
  MedicationUsage,
  MedicationAdherence
} from '../../types';
import { analyticsCache, CacheKeys, CacheTTL } from './cacheUtils';

/**
 * Medication Analytics API Service
 *
 * @class
 * @classdesc Provides comprehensive medication analytics for school health medication management
 * including usage patterns, adherence tracking, and compliance monitoring with selective caching.
 *
 * **Service Architecture**:
 * - Usage data cached for performance (5-minute TTL)
 * - Adherence data always fresh (no caching for intervention decisions)
 * - Type-safe API with comprehensive error handling
 * - HIPAA-compliant aggregated reporting
 *
 * **Medication Management Context**:
 * - Supports chronic condition medication compliance
 * - Enables inventory optimization and cost management
 * - Facilitates adherence interventions
 * - Provides safety monitoring and error prevention
 *
 * **Caching Strategy**:
 * - Medication usage: 5-minute cache (CacheTTL.METRICS)
 * - Adherence data: No caching (requires real-time accuracy for interventions)
 * - Cache keys include all parameters
 * - Automatic expiration after TTL
 *
 * **Privacy Protection**:
 * - Aggregated data prevents student identification
 * - PHI never exposed in cache keys
 * - Authorization enforced at API level
 * - Audit trails for all medication data access
 *
 * @example
 * **Medication Management**
 * ```typescript
 * const medicationAnalytics = new MedicationAnalytics(apiClient);
 *
 * // Monitor usage for inventory planning
 * const usage = await medicationAnalytics.getMedicationUsage({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 *
 * // Alert on low stock
 * usage.forEach(med => {
 *   const daysRemaining = med.currentStock / (med.administrationCount / 31);
 *   if (daysRemaining < 30) {
 *     console.warn(`${med.medicationName}: Only ${daysRemaining.toFixed(0)} days of stock remaining`);
 *   }
 * });
 * ```
 */
export class MedicationAnalytics {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get medication usage analytics with optional filtering
   *
   * @param {Object} [params] - Query parameters for filtering medication usage
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.medicationId] - Filter by specific medication ID
   * @param {string} [params.schoolId] - Filter by specific school ID
   * @returns {Promise<MedicationUsage[]>} Array of medication usage data with metrics
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid (must be ISO 8601 YYYY-MM-DD)
   *
   * @description
   * Retrieves medication usage analytics with intelligent caching. Results include:
   * - Administration frequency and timing
   * - Student count per medication
   * - Usage patterns and trends
   * - Cost analysis per medication
   * - Stock levels and reorder recommendations
   * - Emergency vs scheduled administration breakdown
   *
   * **Caching Behavior**:
   * - Cached for 5 minutes (CacheTTL.METRICS)
   * - Cache key includes all parameters
   * - Subsequent identical requests return cached data
   *
   * **Use Cases**:
   * - **Inventory Planning**: Calculate reorder points based on usage
   * - **Cost Management**: Analyze medication spending patterns
   * - **Trend Analysis**: Identify seasonal usage variations
   * - **Resource Allocation**: Plan nurse staffing for medication administration
   *
   * @example
   * **Basic Usage Analysis**
   * ```typescript
   * const usage = await medicationAnalytics.getMedicationUsage({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   schoolId: 'school-123'
   * });
   *
   * // Display top administered medications
   * const sorted = usage.sort((a, b) => b.administrationCount - a.administrationCount);
   * console.log('Top 5 medications by administration count:');
   * sorted.slice(0, 5).forEach((med, index) => {
   *   console.log(`${index + 1}. ${med.medicationName}: ${med.administrationCount} administrations`);
   * });
   * ```
   *
   * @example
   * **Inventory Reorder Analysis**
   * ```typescript
   * const usage = await medicationAnalytics.getMedicationUsage({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31'
   * });
   *
   * // Identify medications needing reorder
   * usage.forEach(med => {
   *   const avgDailyUse = med.administrationCount / 31;
   *   const daysOfStock = med.currentStock / avgDailyUse;
   *
   *   if (daysOfStock < 30) {
   *     console.warn(`REORDER: ${med.medicationName}`);
   *     console.log(`  Current stock: ${med.currentStock}`);
   *     console.log(`  Days remaining: ${daysOfStock.toFixed(0)}`);
   *     console.log(`  Recommended order: ${Math.ceil(avgDailyUse * 90)} units (90-day supply)`);
   *   }
   * });
   * ```
   *
   * @see {@link getMedicationAdherence} for adherence tracking
   * @see {@link HealthAnalytics} for health-related medication data
   */
  async getMedicationUsage(params?: {
    startDate?: string;
    endDate?: string;
    medicationId?: string;
    schoolId?: string;
  }): Promise<MedicationUsage[]> {
    const cacheKey = analyticsCache.buildKey(CacheKeys.MEDICATION_USAGE, params);
    const cached = analyticsCache.get<MedicationUsage[]>(cacheKey);
    if (cached) return cached;

    const response = await this.client.get<ApiResponse<MedicationUsage[]>>(
      '/analytics/medications/usage',
      { params }
    );

    const data = response.data.data || [];
    analyticsCache.set(cacheKey, data, CacheTTL.METRICS);

    return data;
  }

  /**
   * Get medication adherence data for intervention planning
   *
   * @param {Object} [params] - Query parameters for adherence tracking
   * @param {string} [params.startDate] - Start date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.endDate] - End date in ISO 8601 format (YYYY-MM-DD)
   * @param {string} [params.studentId] - Filter by specific student ID (requires authorization)
   * @param {string} [params.schoolId] - Filter by specific school ID
   * @returns {Promise<MedicationAdherence[]>} Array of medication adherence data with metrics
   * @throws {Error} If API request fails or network connectivity issues occur
   * @throws {Error} If date format is invalid
   * @throws {Error} If unauthorized to access student-specific data
   *
   * @description
   * Retrieves medication adherence metrics for chronic condition management and intervention
   * planning. Results include:
   * - Adherence rate (scheduled doses administered / scheduled doses)
   * - Missed dose count and timing patterns
   * - Student-specific adherence metrics
   * - Time-of-day administration compliance
   * - Emergency medication use frequency
   *
   * **Caching Behavior**:
   * - **Not cached**: Adherence data requires real-time accuracy for interventions
   * - Fresh data on every request
   * - Use for active adherence monitoring and intervention decisions
   *
   * **Use Cases**:
   * - **Adherence Interventions**: Identify students needing support
   * - **Pattern Analysis**: Detect time-of-day or day-of-week adherence issues
   * - **Care Plan Optimization**: Adjust medication schedules based on adherence
   * - **Parent Communication**: Data-driven discussions about medication compliance
   *
   * **Adherence Thresholds**:
   * - **>= 95%**: Excellent adherence
   * - **85-94%**: Good adherence, monitor
   * - **75-84%**: Concerning, implement basic interventions
   * - **< 75%**: Critical, urgent intervention needed
   *
   * **Privacy Notes**:
   * - Student-specific queries require FERPA/HIPAA authorization
   * - PHI access logged for audit compliance
   * - Real-time data (no caching)
   *
   * @example
   * **Adherence Monitoring Dashboard**
   * ```typescript
   * const adherence = await medicationAnalytics.getMedicationAdherence({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31'
   * });
   *
   * // Categorize by adherence level
   * const excellent = adherence.filter(r => r.adherenceRate >= 0.95);
   * const good = adherence.filter(r => r.adherenceRate >= 0.85 && r.adherenceRate < 0.95);
   * const concerning = adherence.filter(r => r.adherenceRate >= 0.75 && r.adherenceRate < 0.85);
   * const critical = adherence.filter(r => r.adherenceRate < 0.75);
   *
   * console.log('Medication Adherence Summary:');
   * console.log(`  Excellent (>=95%): ${excellent.length} students`);
   * console.log(`  Good (85-94%): ${good.length} students`);
   * console.log(`  Concerning (75-84%): ${concerning.length} students`);
   * console.log(`  Critical (<75%): ${critical.length} students - INTERVENTION NEEDED`);
   * ```
   *
   * @example
   * **Targeted Adherence Interventions**
   * ```typescript
   * const adherence = await medicationAnalytics.getMedicationAdherence({
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   schoolId: 'school-123'
   * });
   *
   * // Identify students needing urgent intervention
   * const urgentCases = adherence.filter(r => r.adherenceRate < 0.75);
   *
   * urgentCases.forEach(student => {
   *   console.log(`\nURGENT: Student ${student.studentId}`);
   *   console.log(`  Medication: ${student.medicationName}`);
   *   console.log(`  Adherence: ${(student.adherenceRate * 100).toFixed(1)}%`);
   *   console.log(`  Missed: ${student.missedDoses}/${student.scheduledDoses} doses`);
   *
   *   // Identify patterns
   *   if (student.missedDosesByTimeOfDay) {
   *     const morningMisses = student.missedDosesByTimeOfDay['morning'] || 0;
   *     const afternoonMisses = student.missedDosesByTimeOfDay['afternoon'] || 0;
   *
   *     if (morningMisses > afternoonMisses * 2) {
   *       console.log(`  Pattern: Primarily morning doses missed`);
   *       console.log(`  Action: Parent reminder system for morning medication`);
   *     }
   *   }
   * });
   * ```
   *
   * @example
   * **Student-Specific Adherence Review**
   * ```typescript
   * // Review adherence for specific student (requires authorization)
   * const studentAdherence = await medicationAnalytics.getMedicationAdherence({
   *   startDate: '2024-09-01',
   *   endDate: '2025-05-31',
   *   studentId: 'student-123'
   * });
   *
   * studentAdherence.forEach(med => {
   *   console.log(`\n${med.medicationName}:`);
   *   console.log(`  Overall adherence: ${(med.adherenceRate * 100).toFixed(1)}%`);
   *   console.log(`  Scheduled doses: ${med.scheduledDoses}`);
   *   console.log(`  Administered: ${med.administeredDoses}`);
   *   console.log(`  Missed: ${med.missedDoses}`);
   *
   *   if (med.adherenceRate < 0.85) {
   *     console.warn(`  ⚠️  Below target adherence - schedule care plan review`);
   *   }
   * });
   * ```
   *
   * @see {@link getMedicationUsage} for usage patterns and inventory
   * @see {@link HealthAnalytics.getStudentHealthMetrics} for overall student health
   */
  async getMedicationAdherence(params?: {
    startDate?: string;
    endDate?: string;
    studentId?: string;
    schoolId?: string;
  }): Promise<MedicationAdherence[]> {
    const response = await this.client.get<ApiResponse<MedicationAdherence[]>>(
      '/analytics/medications/adherence',
      { params }
    );

    return response.data.data || [];
  }
}

/**
 * Factory function to create Medication Analytics instance
 *
 * @param {ApiClient} client - Configured ApiClient instance with authentication
 * @returns {MedicationAnalytics} Configured MedicationAnalytics service instance
 *
 * @description
 * Creates a new MedicationAnalytics instance. Recommended to use the singleton
 * `medicationAnalytics` exported from the analytics module instead.
 *
 * @example
 * **Use Singleton (Recommended)**
 * ```typescript
 * import { medicationAnalytics } from '@/services/modules/analytics';
 * const usage = await medicationAnalytics.getMedicationUsage();
 * ```
 *
 * @see {@link MedicationAnalytics} for the main class documentation
 */
export function createMedicationAnalytics(client: ApiClient): MedicationAnalytics {
  return new MedicationAnalytics(client);
}
