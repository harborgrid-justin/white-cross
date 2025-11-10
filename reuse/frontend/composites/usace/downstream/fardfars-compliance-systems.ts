/**
 * LOC: USACE-DOWNSTREAM-FAR-001
 * File: /reuse/frontend/composites/usace/downstream/fardfars-compliance-systems.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/composites/usace/usace-contract-management-composites.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE compliance monitoring systems
 *   - Contract review applications
 *   - Audit preparation tools
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/fardfars-compliance-systems.ts
 * Locator: WC-USACE-DS-FAR-001
 * Purpose: FAR/DFARS Compliance Monitoring and Validation Systems
 *
 * Upstream: usace-contract-management-composites.ts, React 18+, Next.js 16+
 * Downstream: USACE compliance officers, contract auditors, legal review teams
 * Dependencies: React 18+, TypeScript 5.x, parent composite
 * Exports: 8 compliance monitoring and validation components
 *
 * LLM Context: Production-ready FAR/DFARS compliance monitoring system for USACE contracts.
 * Provides comprehensive compliance validation, clause verification, audit preparation,
 * and regulatory compliance tracking. Designed for USACE contracting officers and compliance
 * specialists managing federal acquisition regulation adherence with automated validation
 * and real-time compliance scoring.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useContractManagement,
  validateFARCompliance,
  type Contract,
  type ComplianceInfo,
} from '../usace-contract-management-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FARClause {
  clauseNumber: string;
  title: string;
  description: string;
  required: boolean;
  applicableTo: string[];
  prescribedIn: string;
  category: 'mandatory' | 'optional' | 'conditional';
}

export interface DFARSClause {
  clauseNumber: string;
  title: string;
  description: string;
  required: boolean;
  applicableTo: string[];
  prescribedIn: string;
  category: 'mandatory' | 'optional' | 'conditional';
}

export interface ComplianceViolation {
  id: string;
  contractId: string;
  violationType: 'missing_clause' | 'incorrect_clause' | 'missing_provision' | 'documentation_gap';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  recommendation: string;
  clauseReference?: string;
  identifiedDate: Date;
  resolvedDate?: Date;
  status: 'open' | 'in_review' | 'resolved' | 'waived';
}

export interface ComplianceReport {
  reportId: string;
  reportDate: Date;
  contracts: Contract[];
  overallScore: number;
  criticalViolations: number;
  majorViolations: number;
  minorViolations: number;
  compliantContracts: number;
  nonCompliantContracts: number;
  recommendations: string[];
}

// ============================================================================
// FAR/DFARS COMPLIANCE DASHBOARD
// ============================================================================

/**
 * Complete FAR/DFARS compliance monitoring dashboard
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Compliance dashboard
 *
 * @example
 * ```tsx
 * <FARDFARSComplianceDashboard
 *   organizationCode="NAB"
 *   onViolationClick={(violation) => handleViolation(violation)}
 * />
 * ```
 */
export function FARDFARSComplianceDashboard({
  organizationCode,
  onViolationClick,
}: {
  organizationCode: string;
  onViolationClick?: (violation: ComplianceViolation) => void;
}) {
  const { contracts, loading } = useContractManagement();
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const complianceStats = useMemo(() => {
    let compliant = 0;
    let nonCompliant = 0;
    const allViolations: ComplianceViolation[] = [];

    contracts.forEach(contract => {
      const validation = validateFARCompliance(contract);

      if (validation.isCompliant) {
        compliant++;
      } else {
        nonCompliant++;

        // Generate violations for missing clauses
        validation.missingClauses.forEach(clause => {
          allViolations.push({
            id: crypto.randomUUID(),
            contractId: contract.id,
            violationType: 'missing_clause',
            severity: 'critical',
            description: `Missing required FAR clause ${clause}`,
            recommendation: `Add FAR clause ${clause} to contract ${contract.contractNumber}`,
            clauseReference: clause,
            identifiedDate: new Date(),
            status: 'open',
          });
        });
      }
    });

    setViolations(allViolations);

    const criticalViolations = allViolations.filter(v => v.severity === 'critical' && v.status === 'open').length;
    const majorViolations = allViolations.filter(v => v.severity === 'major' && v.status === 'open').length;
    const minorViolations = allViolations.filter(v => v.severity === 'minor' && v.status === 'open').length;

    const totalContracts = contracts.length;
    const complianceRate = totalContracts > 0 ? (compliant / totalContracts) * 100 : 100;

    return {
      compliant,
      nonCompliant,
      complianceRate,
      criticalViolations,
      majorViolations,
      minorViolations,
      totalViolations: allViolations.length,
    };
  }, [contracts]);

  const requiredFARClauses: FARClause[] = useMemo(() => [
    {
      clauseNumber: '52.204-7',
      title: 'System for Award Management',
      description: 'Requirement for registration in SAM database',
      required: true,
      applicableTo: ['all_contracts'],
      prescribedIn: 'FAR 4.1105',
      category: 'mandatory',
    },
    {
      clauseNumber: '52.219-8',
      title: 'Utilization of Small Business Concerns',
      description: 'Small business subcontracting plan requirements',
      required: true,
      applicableTo: ['contracts_over_750k'],
      prescribedIn: 'FAR 19.708',
      category: 'mandatory',
    },
    {
      clauseNumber: '52.222-26',
      title: 'Equal Opportunity',
      description: 'Equal opportunity clause requirements',
      required: true,
      applicableTo: ['all_contracts'],
      prescribedIn: 'FAR 22.810',
      category: 'mandatory',
    },
    {
      clauseNumber: '52.232-33',
      title: 'Payment by Electronic Funds Transfer',
      description: 'EFT payment requirements',
      required: true,
      applicableTo: ['all_contracts'],
      prescribedIn: 'FAR 32.1110',
      category: 'mandatory',
    },
    {
      clauseNumber: '52.233-1',
      title: 'Disputes',
      description: 'Contract disputes act procedures',
      required: true,
      applicableTo: ['contracts_over_100k'],
      prescribedIn: 'FAR 33.215',
      category: 'mandatory',
    },
  ], []);

  const requiredDFARSClauses: DFARSClause[] = useMemo(() => [
    {
      clauseNumber: '252.204-7012',
      title: 'Safeguarding Covered Defense Information',
      description: 'Cybersecurity requirements for defense contractors',
      required: true,
      applicableTo: ['dod_contracts'],
      prescribedIn: 'DFARS 204.7303',
      category: 'mandatory',
    },
    {
      clauseNumber: '252.225-7001',
      title: 'Buy American Act and Balance of Payments Program',
      description: 'Domestic preference requirements',
      required: true,
      applicableTo: ['dod_contracts'],
      prescribedIn: 'DFARS 225.1101',
      category: 'mandatory',
    },
    {
      clauseNumber: '252.247-7023',
      title: 'Transportation of Supplies by Sea',
      description: 'US-flag vessel transportation requirements',
      required: true,
      applicableTo: ['dod_contracts_shipping'],
      prescribedIn: 'DFARS 247.573',
      category: 'conditional',
    },
  ], []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading compliance data...</div>
      </div>
    );
  }

  return (
    <div className="fardfars-compliance-dashboard p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">FAR/DFARS Compliance Dashboard</h1>
        <p className="text-gray-600">Organization: {organizationCode}</p>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Compliance Rate</div>
          <div className={`text-3xl font-bold ${
            complianceStats.complianceRate >= 95 ? 'text-green-600' :
            complianceStats.complianceRate >= 85 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {complianceStats.complianceRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Critical Violations</div>
          <div className="text-3xl font-bold text-red-600">
            {complianceStats.criticalViolations}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Compliant Contracts</div>
          <div className="text-3xl font-bold text-green-600">
            {complianceStats.compliant}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Non-Compliant</div>
          <div className="text-3xl font-bold text-orange-600">
            {complianceStats.nonCompliant}
          </div>
        </div>
      </div>

      {/* Violations Summary */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Open Violations by Severity</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-red-600 font-bold text-2xl">
              {complianceStats.criticalViolations}
            </div>
            <div className="text-sm text-gray-700">Critical</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-orange-600 font-bold text-2xl">
              {complianceStats.majorViolations}
            </div>
            <div className="text-sm text-gray-700">Major</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-yellow-600 font-bold text-2xl">
              {complianceStats.minorViolations}
            </div>
            <div className="text-sm text-gray-700">Minor</div>
          </div>
        </div>
      </div>

      {/* Required FAR Clauses */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Required FAR Clauses</h2>
        <div className="space-y-3">
          {requiredFARClauses.map(clause => (
            <div key={clause.clauseNumber} className="border-l-4 border-blue-500 pl-4">
              <div className="font-bold">{clause.clauseNumber}: {clause.title}</div>
              <div className="text-sm text-gray-600">{clause.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                Prescribed in: {clause.prescribedIn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required DFARS Clauses */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Required DFARS Clauses</h2>
        <div className="space-y-3">
          {requiredDFARSClauses.map(clause => (
            <div key={clause.clauseNumber} className="border-l-4 border-purple-500 pl-4">
              <div className="font-bold">{clause.clauseNumber}: {clause.title}</div>
              <div className="text-sm text-gray-600">{clause.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                Prescribed in: {clause.prescribedIn} | Category: {clause.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Violations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Active Violations ({violations.length})</h2>
        </div>
        <div className="divide-y">
          {violations.filter(v => v.status === 'open').map(violation => {
            const contract = contracts.find(c => c.id === violation.contractId);

            return (
              <div
                key={violation.id}
                onClick={() => onViolationClick && onViolationClick(violation)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${
                      violation.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      violation.severity === 'major' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {violation.severity.toUpperCase()}
                    </div>
                    <div className="font-bold text-lg">{violation.description}</div>
                    {contract && (
                      <div className="text-sm text-gray-600">
                        Contract: {contract.contractNumber} - {contract.title}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Recommendation:</span> {violation.recommendation}
                </div>
                <div className="text-xs text-gray-500">
                  Identified: {violation.identifiedDate.toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Contract compliance validator component
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Compliance validator
 *
 * @example
 * ```tsx
 * <ContractComplianceValidator
 *   contract={contract}
 *   onValidationComplete={(result) => console.log('Validation complete', result)}
 * />
 * ```
 */
export function ContractComplianceValidator({
  contract,
  onValidationComplete,
}: {
  contract: Contract;
  onValidationComplete?: (validation: ReturnType<typeof validateFARCompliance>) => void;
}) {
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateFARCompliance> | null>(null);

  useEffect(() => {
    const result = validateFARCompliance(contract);
    setValidationResult(result);
    if (onValidationComplete) {
      onValidationComplete(result);
    }
  }, [contract, onValidationComplete]);

  if (!validationResult) {
    return <div>Validating compliance...</div>;
  }

  return (
    <div className="contract-compliance-validator p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Compliance Validation Results</h2>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Contract Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Contract Number:</span>
            <div className="font-medium">{contract.contractNumber}</div>
          </div>
          <div>
            <span className="text-gray-600">Contract Type:</span>
            <div className="font-medium">{contract.contractType}</div>
          </div>
          <div>
            <span className="text-gray-600">Contractor:</span>
            <div className="font-medium">{contract.contractor.name}</div>
          </div>
          <div>
            <span className="text-gray-600">Contract Value:</span>
            <div className="font-medium">${contract.currentValue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg mb-6 ${
        validationResult.isCompliant ? 'bg-green-100' : 'bg-red-100'
      }`}>
        <div className={`text-2xl font-bold ${
          validationResult.isCompliant ? 'text-green-800' : 'text-red-800'
        }`}>
          {validationResult.isCompliant ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}
        </div>
      </div>

      {validationResult.missingClauses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-red-600">Missing Required Clauses</h3>
          <ul className="list-disc list-inside space-y-2">
            {validationResult.missingClauses.map(clause => (
              <li key={clause} className="text-gray-700">
                FAR {clause}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-600">Included Clauses</h3>
        <ul className="list-disc list-inside space-y-1">
          {validationResult.includedClauses.map(clause => (
            <li key={clause} className="text-gray-700 text-sm">
              FAR {clause}
            </li>
          ))}
        </ul>
      </div>

      {validationResult.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-2">
            {validationResult.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-700">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Compliance audit report generator
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Audit report generator
 *
 * @example
 * ```tsx
 * <ComplianceAuditReportGenerator
 *   contracts={allContracts}
 *   onReportGenerated={(report) => downloadReport(report)}
 * />
 * ```
 */
export function ComplianceAuditReportGenerator({
  contracts,
  onReportGenerated,
}: {
  contracts: Contract[];
  onReportGenerated?: (report: ComplianceReport) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<ComplianceReport | null>(null);

  const generateReport = useCallback(() => {
    setGenerating(true);

    let criticalViolations = 0;
    let majorViolations = 0;
    let minorViolations = 0;
    let compliantContracts = 0;
    let nonCompliantContracts = 0;
    const recommendations: string[] = [];

    contracts.forEach(contract => {
      const validation = validateFARCompliance(contract);

      if (validation.isCompliant) {
        compliantContracts++;
      } else {
        nonCompliantContracts++;
        criticalViolations += validation.missingClauses.length;
        recommendations.push(...validation.recommendations);
      }
    });

    const totalViolations = criticalViolations + majorViolations + minorViolations;
    const overallScore = contracts.length > 0
      ? ((compliantContracts / contracts.length) * 100)
      : 100;

    const newReport: ComplianceReport = {
      reportId: crypto.randomUUID(),
      reportDate: new Date(),
      contracts,
      overallScore,
      criticalViolations,
      majorViolations,
      minorViolations,
      compliantContracts,
      nonCompliantContracts,
      recommendations: Array.from(new Set(recommendations)),
    };

    setReport(newReport);
    setGenerating(false);

    if (onReportGenerated) {
      onReportGenerated(newReport);
    }
  }, [contracts, onReportGenerated]);

  return (
    <div className="compliance-audit-report-generator p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Compliance Audit Report Generator</h2>
        <p className="text-gray-600">
          Generate comprehensive FAR/DFARS compliance audit report
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <button
          onClick={generateReport}
          disabled={generating || contracts.length === 0}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
        >
          {generating ? 'Generating Report...' : 'Generate Audit Report'}
        </button>
      </div>

      {report && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Audit Report</h3>

          <div className="mb-6">
            <div className="text-sm text-gray-600">Report ID: {report.reportId}</div>
            <div className="text-sm text-gray-600">
              Generated: {report.reportDate.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Overall Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {report.overallScore.toFixed(1)}%
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Compliant</div>
              <div className="text-3xl font-bold text-green-600">
                {report.compliantContracts}
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600">Non-Compliant</div>
              <div className="text-3xl font-bold text-red-600">
                {report.nonCompliantContracts}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold mb-2">Violations by Severity</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span>Critical Violations</span>
                <span className="font-bold">{report.criticalViolations}</span>
              </div>
              <div className="flex justify-between p-2 bg-orange-50 rounded">
                <span>Major Violations</span>
                <span className="font-bold">{report.majorViolations}</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span>Minor Violations</span>
                <span className="font-bold">{report.minorViolations}</span>
              </div>
            </div>
          </div>

          {report.recommendations.length > 0 && (
            <div>
              <h4 className="font-bold mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  FARDFARSComplianceDashboard,
  ContractComplianceValidator,
  ComplianceAuditReportGenerator,
};
