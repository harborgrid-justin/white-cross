/**
 * Analytics Engine - Re-export from canonical location
 * 
 * This file re-exports all members from the canonical analyticsEngine
 * located in stores/domains/administration/analytics/analyticsEngine.ts
 */

export {
  // Types
  type HealthMetrics,
  type InventoryHealth,
  type WorkloadMetrics,
  type TrendAnalysis,
  type TrendData,
  type PredictiveInsights,
  type RiskFactor,
  type Recommendation,
  type PredictiveAlert,
  type ComplianceReport,
  type ComplianceCategory,
  type ComplianceItem,
  type ComplianceViolation,
  type AuditEntry,
  
  // Functions
  calculateHealthMetrics,
  generateTrendAnalysis,
  assessStudentRisks,
  generateComplianceReport,
} from '../../stores/domains/administration/analytics/analyticsEngine';
