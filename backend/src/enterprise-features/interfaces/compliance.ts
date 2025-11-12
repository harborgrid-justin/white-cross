import { ComplianceStatus, RegulationStatus, ImpactLevel } from './enums';

export interface HIPAAComplianceCheck {
  id: string;
  area: string;
  status: ComplianceStatus;
  findings: string[];
  recommendations: string[];
  checkedAt: Date;
  checkedBy: string;
  nextCheckDate?: Date;
}

export interface RegulationUpdate {
  id: string;
  state: string;
  category: string;
  title: string;
  description: string;
  effectiveDate: Date;
  impact: ImpactLevel;
  actionRequired: string;
  status: RegulationStatus;
  implementedAt?: Date;
  complianceOfficer: string;
}

export interface ComplianceAuditResult {
  period: {
    startDate: Date;
    endDate: Date;
  };
  overallStatus: ComplianceStatus;
  checks: HIPAAComplianceCheck[];
  recommendations: string[];
  nextAuditDate: Date;
}