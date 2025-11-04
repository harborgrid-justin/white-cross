/**
 * @fileoverview Audit Logging and Security Monitoring API service
 * @module services/modules/auditApi
 * @category Services - Audit & Security Monitoring
 *
 * Provides comprehensive audit logging, security monitoring, and compliance reporting
 * capabilities for the White Cross healthcare platform. Implements HIPAA-compliant
 * audit trails, PHI access tracking, security analysis, and anomaly detection.
 *
 * NOTE: This file has been refactored. All implementation has moved to the
 * ./audit/ subdirectory for better organization. This file now serves as a
 * re-export barrel to maintain backward compatibility.
 *
 * Key Features:
 * - Comprehensive audit log retrieval and filtering
 * - PHI (Protected Health Information) access logging
 * - Security incident analysis and monitoring
 * - Anomaly detection and alerting
 * - User activity tracking and reporting
 * - Session-based audit trail analysis
 * - Compliance report generation
 * - Data access logs for specific resources
 * - Audit log export (CSV, PDF, JSON)
 * - Log archival and retention management
 *
 * HIPAA Audit Requirements:
 * - All PHI access must be logged (who, what, when, why)
 * - Minimum 6-year audit trail retention
 * - Access logs must include IP address and user agent
 * - Automatic audit log backup and protection
 * - Tamper-evident logging mechanisms
 * - Regular audit log review workflows
 * - Breach notification support with audit evidence
 *
 * PHI Access Logging:
 * - Automatic logging of all PHI read operations
 * - Access reason documentation (emergency, treatment, administrative)
 * - Data fields accessed tracking
 * - Student-level access aggregation
 * - Unauthorized access attempt detection
 * - Access pattern analysis for anomalies
 *
 * Security Monitoring:
 * - Real-time security incident detection
 * - Failed authentication attempt tracking
 * - Suspicious activity pattern recognition
 * - Privilege escalation detection
 * - Data exfiltration monitoring
 * - Geographic access anomaly detection
 *
 * Audit Log Types:
 * - Authentication events (login, logout, MFA)
 * - Authorization events (permission checks, role changes)
 * - Data access events (read, create, update, delete)
 * - PHI access events (detailed health information access)
 * - Administrative events (user management, configuration changes)
 * - Security events (failed attempts, anomalies, incidents)
 *
 * Compliance Reporting:
 * - HIPAA compliance reports with audit evidence
 * - Access frequency analysis by user and resource
 * - Compliance score calculation based on audit data
 * - Violation detection and reporting
 * - Regulatory audit support with exportable evidence
 *
 * Anomaly Detection:
 * - Unusual access patterns (time, volume, location)
 * - Unauthorized resource access attempts
 * - Privilege abuse detection
 * - Data download anomalies
 * - Session hijacking indicators
 * - Multi-severity classification (LOW, MEDIUM, HIGH, CRITICAL)
 *
 * @example Query PHI access logs
 * ```typescript
 * import { auditApi } from '@/services/modules/auditApi';
 *
 * const phiLogs = await auditApi.getPHIAccessLogs({
 *   studentId: 'student-uuid-123',
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   page: 1,
 *   limit: 50
 * });
 * console.log(`PHI accessed ${phiLogs.total} times this month`);
 * ```
 *
 * @example Run security analysis
 * ```typescript
 * const analysis = await auditApi.runSecurityAnalysis({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * console.log(`Anomalies detected: ${analysis.anomalies.length}`);
 * analysis.anomalies.forEach(anomaly => {
 *   console.log(`${anomaly.severity}: ${anomaly.description}`);
 * });
 * ```
 *
 * @example Export audit logs for compliance
 * ```typescript
 * const blob = await auditApi.exportLogs({
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   format: 'PDF',
 *   filters: { resourceType: 'PHI' }
 * });
 * // Download blob as PDF file for regulatory audit
 * ```
 *
 * @example Track user activity
 * ```typescript
 * const activity = await auditApi.getUserActivity('user-uuid-456', {
 *   startDate: '2025-01-15',
 *   endDate: '2025-01-16'
 * });
 * console.log(`User performed ${activity.totalActions} actions`);
 * ```
 *
 * @see {@link complianceApi} for compliance report management
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations HIPAA Security Rule}
 */

// Re-export everything from the refactored audit module
export * from './audit';
