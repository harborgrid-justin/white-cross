// Compliance module barrel exports

export { default as ComplianceCard } from './ComplianceCard'
export { default as ComplianceHeader } from './ComplianceHeader'
export { default as ComplianceList } from './ComplianceList'
export { default as ComplianceDetail } from './ComplianceDetail'
export { default as ComplianceAudit } from './ComplianceAudit'
export { default as ComplianceRisk } from './ComplianceRisk'
export { default as ComplianceTraining } from './ComplianceTraining'
export { default as ComplianceReports } from './ComplianceReports'
export { default as ComplianceEvidence } from './ComplianceEvidence'
export { default as ComplianceWorkflow } from './ComplianceWorkflow'

// Re-export types from each component
export type { 
  ComplianceRequirement,
  ComplianceStatus,
  ComplianceCategory,
  CompliancePriority
} from './ComplianceCard'

export type {
  AuditStatus,
  AuditType,
  AuditPriority,
  FindingSeverity,
  ComplianceAudit as ComplianceAuditData,
  AuditFinding
} from './ComplianceAudit'

export type {
  RiskSeverity,
  RiskStatus,
  RiskCategory,
  RiskLikelihood,
  MitigationStrategy,
  RiskImpact,
  ComplianceRisk as ComplianceRiskData,
  ComplianceRiskProps
} from './ComplianceRisk'
