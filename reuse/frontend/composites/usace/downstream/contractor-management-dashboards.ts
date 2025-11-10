/**
 * LOC: USACE-CONSTR-CONTR-001
 * File: /reuse/frontend/composites/usace/downstream/contractor-management-dashboards.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTracking } from '../../analytics-tracking-kit';
import {
  useContractorQualification,
  useContractorPerformanceMetrics,
  type ContractorQualification,
} from '../usace-construction-projects-composites';

export function useContractorDashboard(projectId: string) {
  const {
    qualifications,
    evaluateContractor,
    checkDebarment,
  } = useContractorQualification();
  
  const {
    metrics,
    setMetrics,
    calculateOverallRating,
  } = useContractorPerformanceMetrics(projectId);
  
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const { track } = useTracking();

  const contractorSummary = useMemo(() => {
    if (qualifications.length === 0) return null;
    
    return {
      totalContractors: qualifications.length,
      qualified: qualifications.filter(q => q.qualificationStatus === 'qualified').length,
      underReview: qualifications.filter(q => q.qualificationStatus === 'under_review').length,
      notQualified: qualifications.filter(q => q.qualificationStatus === 'not_qualified').length,
    };
  }, [qualifications]);

  const evaluateContractorUI = useCallback((contractor: ContractorQualification) => {
    track('contractor_evaluate_ui', { contractor_id: contractor.contractorId });
    const status = evaluateContractor(contractor);
    return status;
  }, [evaluateContractor, track]);

  const checkContractorCompliance = useCallback(async (contractorId: string) => {
    track('contractor_compliance_check', { contractor_id: contractorId });
    
    const contractor = qualifications.find(q => q.contractorId === contractorId);
    if (!contractor) return { compliant: false, issues: ['Contractor not found'] };
    
    const debarred = await checkDebarment(contractor.cageCode, contractor.dunsBradstreet);
    if (debarred) {
      return { compliant: false, issues: ['Contractor is debarred'] };
    }
    
    const issues: string[] = [];
    
    if (contractor.bondingCapacity < 1000000) {
      issues.push('Bonding capacity below threshold');
    }
    
    if (contractor.safetyRecord.emirRate > 2.0) {
      issues.push('EMIR rate above acceptable threshold');
    }
    
    contractor.certifications.forEach(cert => {
      if (cert.expirationDate < new Date()) {
        issues.push(`Certification ${cert.type} has expired`);
      }
    });
    
    return {
      compliant: issues.length === 0,
      issues,
    };
  }, [qualifications, checkDebarment, track]);

  const updatePerformanceMetrics = useCallback((newMetrics: Partial<typeof metrics>) => {
    track('contractor_performance_update', { project_id: projectId });
    setMetrics(prev => ({ ...prev, ...newMetrics }));
    calculateOverallRating();
  }, [projectId, setMetrics, calculateOverallRating, track]);

  return {
    qualifications,
    contractorSummary,
    selectedContractor,
    setSelectedContractor,
    showQualificationModal,
    setShowQualificationModal,
    evaluateContractorUI,
    checkContractorCompliance,
    performanceMetrics: metrics,
    updatePerformanceMetrics,
  };
}

export function useContractorPerformanceReporting(projectId: string) {
  const { metrics } = useContractorPerformanceMetrics(projectId);
  const { track } = useTracking();

  const generatePerformanceReport = useCallback(() => {
    track('contractor_performance_report', { project_id: projectId });
    
    return {
      projectId,
      reportDate: new Date(),
      overallRating: metrics.overallRating,
      qualityScore: metrics.qualityScore,
      scheduleAdherence: metrics.scheduleAdherence,
      safetyScore: metrics.safetyScore,
      responseTime: metrics.responseTime,
      recommendations: metrics.overallRating >= 4.0 ?
        ['Excellent performance, recommend for future projects'] :
        ['Performance improvement needed in key areas'],
    };
  }, [projectId, metrics, track]);

  return { generatePerformanceReport };
}

export default {
  useContractorDashboard,
  useContractorPerformanceReporting,
};
