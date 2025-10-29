import type {
  ComplianceMetrics,
  HIPAAReport,
  AuditLog,
  ComplianceViolation,
  ComplianceAlert,
} from '@/schemas/compliance/compliance.schemas';
import type { Policy, PolicyAcknowledgment } from '@/schemas/compliance/policy.schemas';

/**
 * Compliance Report Generation Utility
 * Generate HIPAA-compliant reports and analytics
 */

interface ReportPeriod {
  start: string;
  end: string;
}

interface ComplianceData {
  auditLogs: AuditLog[];
  violations: ComplianceViolation[];
  alerts: ComplianceAlert[];
  policies: Policy[];
  acknowledgments: PolicyAcknowledgment[];
}

/**
 * Calculate comprehensive compliance metrics
 */
export function calculateComplianceMetrics(
  data: ComplianceData,
  period: ReportPeriod
): ComplianceMetrics {
  const { auditLogs, violations, alerts, policies, acknowledgments } = data;

  // Calculate audit log metrics
  const auditMetrics = {
    total: auditLogs.length,
    byAction: countByField(auditLogs, 'action'),
    bySeverity: countByField(auditLogs, 'severity'),
    phiAccessCount: auditLogs.filter((log) => log.phiAccessed).length,
    failedActions: auditLogs.filter((log) => log.status === 'FAILURE').length,
  };

  // Calculate violation metrics
  const violationMetrics = {
    total: violations.length,
    open: violations.filter((v) => v.status === 'OPEN').length,
    resolved: violations.filter((v) => v.status === 'RESOLVED').length,
    bySeverity: countByField(violations, 'severity'),
  };

  // Calculate alert metrics
  const alertMetrics = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === 'NEW' || a.status === 'ACKNOWLEDGED').length,
    resolved: alerts.filter((a) => a.status === 'RESOLVED').length,
    bySeverity: countByField(alerts, 'severity'),
  };

  // Calculate policy metrics
  const activePolicies = policies.filter((p) => p.status === 'ACTIVE');
  const totalAssignments = acknowledgments.length;
  const acknowledgedCount = acknowledgments.filter((a) => a.acknowledgedAt).length;

  const policyMetrics = {
    total: policies.length,
    active: activePolicies.length,
    acknowledged: acknowledgedCount,
    pending: totalAssignments - acknowledgedCount,
    acknowledgmentRate: totalAssignments > 0
      ? (acknowledgedCount / totalAssignments) * 100
      : 0,
  };

  // Calculate training metrics (mock - would come from training module)
  const trainingMetrics = {
    totalUsers: 100, // Mock data
    completed: 85,
    overdue: 15,
    completionRate: 85,
  };

  // Calculate data retention metrics (mock - would come from data retention system)
  const dataRetentionMetrics = {
    recordsTotal: 50000,
    recordsEligibleForArchival: 5000,
    recordsEligibleForDeletion: 500,
    storageUsed: '150 GB',
  };

  // Calculate risk and compliance scores
  const riskScore = calculateRiskScore({
    violations: violationMetrics,
    alerts: alertMetrics,
    auditLogs: auditMetrics,
  });

  const complianceScore = calculateComplianceScore({
    policies: policyMetrics,
    training: trainingMetrics,
    violations: violationMetrics,
    auditLogs: auditMetrics,
  });

  return {
    period,
    auditLogs: auditMetrics,
    violations: violationMetrics,
    alerts: alertMetrics,
    policies: policyMetrics,
    training: trainingMetrics,
    dataRetention: dataRetentionMetrics,
    riskScore,
    complianceScore,
  };
}

/**
 * Count items by a specific field
 */
function countByField<T>(items: T[], field: keyof T): Record<string, number> {
  return items.reduce((acc, item) => {
    const key = String(item[field]);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate risk score (0-100, higher = more risk)
 */
function calculateRiskScore(data: {
  violations: { total: number; open: number; bySeverity: Record<string, number> };
  alerts: { total: number; active: number; bySeverity: Record<string, number> };
  auditLogs: { total: number; failedActions: number };
}): number {
  let score = 0;

  // Violation scoring (max 40 points)
  const criticalViolations = data.violations.bySeverity['CRITICAL'] || 0;
  const highViolations = data.violations.bySeverity['HIGH'] || 0;
  const openViolations = data.violations.open;

  score += Math.min(criticalViolations * 10, 20); // Up to 20 points
  score += Math.min(highViolations * 5, 10); // Up to 10 points
  score += Math.min(openViolations * 2, 10); // Up to 10 points

  // Alert scoring (max 30 points)
  const criticalAlerts = data.alerts.bySeverity['CRITICAL'] || 0;
  const highAlerts = data.alerts.bySeverity['HIGH'] || 0;
  const activeAlerts = data.alerts.active;

  score += Math.min(criticalAlerts * 8, 15); // Up to 15 points
  score += Math.min(highAlerts * 4, 10); // Up to 10 points
  score += Math.min(activeAlerts * 1, 5); // Up to 5 points

  // Failed actions scoring (max 30 points)
  const failureRate = data.auditLogs.failedActions / Math.max(data.auditLogs.total, 1);
  score += Math.min(failureRate * 100, 30); // Up to 30 points

  return Math.min(Math.round(score), 100);
}

/**
 * Calculate compliance score (0-100, higher = better compliance)
 */
function calculateComplianceScore(data: {
  policies: { acknowledgmentRate: number };
  training: { completionRate: number };
  violations: { total: number; resolved: number };
  auditLogs: { total: number; failedActions: number };
}): number {
  let score = 100;

  // Policy acknowledgment (max -25 points)
  const policyGap = 100 - data.policies.acknowledgmentRate;
  score -= Math.min(policyGap * 0.25, 25);

  // Training completion (max -25 points)
  const trainingGap = 100 - data.training.completionRate;
  score -= Math.min(trainingGap * 0.25, 25);

  // Unresolved violations (max -30 points)
  const unresolvedViolations = data.violations.total - data.violations.resolved;
  score -= Math.min(unresolvedViolations * 3, 30);

  // Failed audit actions (max -20 points)
  const failureRate = data.auditLogs.failedActions / Math.max(data.auditLogs.total, 1);
  score -= Math.min(failureRate * 100, 20);

  return Math.max(Math.round(score), 0);
}

/**
 * Generate HIPAA Security Risk Assessment Report
 */
export function generateSecurityRiskAssessment(
  data: ComplianceData,
  period: ReportPeriod,
  generatedBy: string
): HIPAAReport {
  const metrics = calculateComplianceMetrics(data, period);

  const findings = [
    ...assessAccessControl(data.auditLogs),
    ...assessAuditControls(data.auditLogs),
    ...assessDataIntegrity(data.auditLogs),
    ...assessTransmissionSecurity(data.auditLogs),
    ...assessPhysicalSafeguards(data.violations),
  ];

  const recommendations = generateRecommendations(findings, metrics);

  return {
    id: crypto.randomUUID(),
    reportType: 'SECURITY_RISK_ASSESSMENT',
    period,
    generatedBy,
    generatedAt: new Date().toISOString(),
    status: 'DRAFT',
    metrics,
    findings,
    recommendations,
  };
}

/**
 * Assess access control compliance
 */
function assessAccessControl(auditLogs: AuditLog[]): Array<{
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}> {
  const findings = [];

  const failedLogins = auditLogs.filter((log) => log.action === 'LOGIN_FAILED');
  if (failedLogins.length > 100) {
    findings.push({
      category: 'Access Control',
      severity: 'HIGH' as const,
      description: `Detected ${failedLogins.length} failed login attempts, indicating potential brute force attacks.`,
      recommendation: 'Implement account lockout policies and multi-factor authentication.',
      status: 'OPEN' as const,
    });
  }

  const afterHoursAccess = auditLogs.filter((log) => {
    const hour = new Date(log.timestamp).getHours();
    return (hour < 6 || hour > 22) && log.phiAccessed;
  });

  if (afterHoursAccess.length > 50) {
    findings.push({
      category: 'Access Control',
      severity: 'MEDIUM' as const,
      description: `${afterHoursAccess.length} PHI access events occurred outside normal business hours.`,
      recommendation: 'Review after-hours access patterns and implement additional authorization requirements.',
      status: 'OPEN' as const,
    });
  }

  return findings;
}

/**
 * Assess audit controls compliance
 */
function assessAuditControls(auditLogs: AuditLog[]): Array<{
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}> {
  const findings = [];

  // Check for gaps in audit log chain
  const sortedLogs = [...auditLogs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  let chainIntegrityIssues = 0;
  for (let i = 1; i < sortedLogs.length; i++) {
    if (sortedLogs[i].previousHash !== sortedLogs[i - 1].verificationHash) {
      chainIntegrityIssues++;
    }
  }

  if (chainIntegrityIssues > 0) {
    findings.push({
      category: 'Audit Controls',
      severity: 'CRITICAL' as const,
      description: `Detected ${chainIntegrityIssues} audit log chain integrity violations. Logs may have been tampered with.`,
      recommendation: 'Investigate potential security breach and restore audit log integrity.',
      status: 'OPEN' as const,
    });
  }

  return findings;
}

/**
 * Assess data integrity compliance
 */
function assessDataIntegrity(auditLogs: AuditLog[]): Array<{
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}> {
  const findings = [];

  const deleteActions = auditLogs.filter(
    (log) => log.action === 'PHI_DELETE' || log.action === 'RECORD_DELETE'
  );

  if (deleteActions.length > 100) {
    findings.push({
      category: 'Data Integrity',
      severity: 'MEDIUM' as const,
      description: `High volume of deletion operations detected (${deleteActions.length}).`,
      recommendation: 'Review deletion policies and implement soft-delete where appropriate.',
      status: 'OPEN' as const,
    });
  }

  return findings;
}

/**
 * Assess transmission security
 */
function assessTransmissionSecurity(auditLogs: AuditLog[]): Array<{
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}> {
  const findings = [];

  const exports = auditLogs.filter(
    (log) => log.action === 'PHI_EXPORT' || log.action === 'DOCUMENT_DOWNLOAD'
  );

  if (exports.length > 200) {
    findings.push({
      category: 'Transmission Security',
      severity: 'HIGH' as const,
      description: `${exports.length} data export operations detected. High volume may indicate data exfiltration risk.`,
      recommendation: 'Implement DLP controls and review export policies.',
      status: 'OPEN' as const,
    });
  }

  return findings;
}

/**
 * Assess physical safeguards
 */
function assessPhysicalSafeguards(violations: ComplianceViolation[]): Array<{
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}> {
  const findings = [];

  const physicalViolations = violations.filter(
    (v) => v.violationType === 'IMPROPER_DISPOSAL'
  );

  if (physicalViolations.length > 0) {
    findings.push({
      category: 'Physical Safeguards',
      severity: 'HIGH' as const,
      description: `${physicalViolations.length} improper disposal violations detected.`,
      recommendation: 'Implement secure disposal procedures and staff training.',
      status: 'OPEN' as const,
    });
  }

  return findings;
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(
  findings: Array<{ severity: string; category: string }>,
  metrics: ComplianceMetrics
): string[] {
  const recommendations: string[] = [];

  // Based on findings
  const criticalFindings = findings.filter((f) => f.severity === 'CRITICAL');
  if (criticalFindings.length > 0) {
    recommendations.push(
      'Immediate action required: Address all CRITICAL findings within 24 hours.'
    );
  }

  // Based on compliance score
  if (metrics.complianceScore < 70) {
    recommendations.push(
      'Compliance score is below acceptable threshold. Implement comprehensive remediation plan.'
    );
  }

  // Based on risk score
  if (metrics.riskScore > 50) {
    recommendations.push(
      'Elevated risk level detected. Conduct thorough security review and implement additional controls.'
    );
  }

  // Based on policy acknowledgment
  if (metrics.policies.acknowledgmentRate < 95) {
    recommendations.push(
      'Increase policy acknowledgment rate through targeted training and reminders.'
    );
  }

  // Based on violations
  if (metrics.violations.open > 5) {
    recommendations.push(
      'Prioritize resolution of open compliance violations to reduce organizational risk.'
    );
  }

  // Default recommendations
  if (recommendations.length === 0) {
    recommendations.push(
      'Continue monitoring compliance metrics and maintain current security posture.'
    );
  }

  return recommendations;
}

/**
 * Generate access control report
 */
export function generateAccessControlReport(
  auditLogs: AuditLog[],
  period: ReportPeriod
): {
  summary: string;
  userAccessPatterns: Array<{
    userId: string;
    userName: string;
    totalAccess: number;
    phiAccess: number;
    failedAttempts: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
  recommendations: string[];
} {
  const userAccessMap = new Map<
    string,
    {
      userName: string;
      totalAccess: number;
      phiAccess: number;
      failedAttempts: number;
    }
  >();

  auditLogs.forEach((log) => {
    const existing = userAccessMap.get(log.userId) || {
      userName: log.userName,
      totalAccess: 0,
      phiAccess: 0,
      failedAttempts: 0,
    };

    existing.totalAccess++;
    if (log.phiAccessed) existing.phiAccess++;
    if (log.status === 'FAILURE') existing.failedAttempts++;

    userAccessMap.set(log.userId, existing);
  });

  const userAccessPatterns = Array.from(userAccessMap.entries()).map(
    ([userId, data]) => ({
      userId,
      userName: data.userName,
      totalAccess: data.totalAccess,
      phiAccess: data.phiAccess,
      failedAttempts: data.failedAttempts,
      riskLevel: calculateUserRiskLevel(data) as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    })
  );

  const highRiskUsers = userAccessPatterns.filter((u) => u.riskLevel === 'HIGH' || u.riskLevel === 'CRITICAL');

  const summary = `Access Control Report for ${period.start} to ${period.end}.
    Total users: ${userAccessPatterns.length},
    High-risk users: ${highRiskUsers.length},
    Total PHI access events: ${auditLogs.filter((l) => l.phiAccessed).length}`;

  const recommendations = [
    highRiskUsers.length > 0
      ? `Review access patterns for ${highRiskUsers.length} high-risk users.`
      : 'No high-risk access patterns detected.',
    'Ensure all users complete annual security awareness training.',
    'Review and update role-based access controls quarterly.',
  ];

  return { summary, userAccessPatterns, recommendations };
}

/**
 * Calculate user risk level based on access patterns
 */
function calculateUserRiskLevel(data: {
  totalAccess: number;
  phiAccess: number;
  failedAttempts: number;
}): string {
  const phiAccessRatio = data.phiAccess / Math.max(data.totalAccess, 1);
  const failureRate = data.failedAttempts / Math.max(data.totalAccess, 1);

  if (failureRate > 0.2 || data.failedAttempts > 10) return 'CRITICAL';
  if (phiAccessRatio > 0.8 && data.totalAccess > 100) return 'HIGH';
  if (data.failedAttempts > 5) return 'MEDIUM';
  return 'LOW';
}

/**
 * Generate data integrity report
 */
export function generateDataIntegrityReport(
  auditLogs: AuditLog[],
  period: ReportPeriod
): {
  summary: string;
  integrityViolations: number;
  unverifiedLogs: number;
  recommendations: string[];
} {
  let integrityViolations = 0;
  let unverifiedLogs = 0;

  const sortedLogs = [...auditLogs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (let i = 1; i < sortedLogs.length; i++) {
    if (!sortedLogs[i].verificationHash) {
      unverifiedLogs++;
    } else if (sortedLogs[i].previousHash !== sortedLogs[i - 1].verificationHash) {
      integrityViolations++;
    }
  }

  const summary = `Data Integrity Report for ${period.start} to ${period.end}.
    Total logs analyzed: ${auditLogs.length},
    Integrity violations: ${integrityViolations},
    Unverified logs: ${unverifiedLogs}`;

  const recommendations = [
    integrityViolations > 0
      ? 'URGENT: Investigate audit log tampering. Potential security breach.'
      : 'Audit log integrity verified.',
    unverifiedLogs > 0
      ? 'Update all systems to generate cryptographic verification hashes.'
      : 'All logs include verification hashes.',
    'Implement automated integrity monitoring and alerting.',
  ];

  return { summary, integrityViolations, unverifiedLogs, recommendations };
}
