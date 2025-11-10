/**
 * LOC: USACE-CONSTR-INSP-001
 * File: /reuse/frontend/composites/usace/downstream/inspection-tracking-systems.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTracking } from '../../analytics-tracking-kit';
import {
  useQCQAInspections,
  type QCQAInspection,
  type DeficiencySeverity,
} from '../usace-construction-projects-composites';

export function useInspectionManagementSystem(projectId: string) {
  const {
    inspections,
    createInspection,
    getOpenDeficiencies,
    getCriticalDeficiencies,
  } = useQCQAInspections(projectId);
  
  const [selectedInspection, setSelectedInspection] = useState<QCQAInspection | null>(null);
  const [inspectionFilters, setInspectionFilters] = useState({
    inspectionType: undefined as string | undefined,
    conformsToSpecs: undefined as boolean | undefined,
    hasDeficiencies: undefined as boolean | undefined,
  });
  const { track } = useTracking();

  const filteredInspections = useMemo(() => {
    return inspections.filter(insp => {
      if (inspectionFilters.inspectionType && insp.inspectionType !== inspectionFilters.inspectionType) {
        return false;
      }
      if (inspectionFilters.conformsToSpecs !== undefined && insp.conformsToSpecs !== inspectionFilters.conformsToSpecs) {
        return false;
      }
      if (inspectionFilters.hasDeficiencies !== undefined) {
        const hasDeficiencies = insp.deficiencies.length > 0;
        if (hasDeficiencies !== inspectionFilters.hasDeficiencies) {
          return false;
        }
      }
      return true;
    });
  }, [inspections, inspectionFilters]);

  const inspectionStats = useMemo(() => {
    const total = inspections.length;
    const passed = inspections.filter(i => i.conformsToSpecs).length;
    const withDeficiencies = inspections.filter(i => i.deficiencies.length > 0).length;
    const criticalDeficiencies = getCriticalDeficiencies().length;
    
    return {
      total,
      passed,
      failed: total - passed,
      passRate: total > 0 ? (passed / total) * 100 : 0,
      withDeficiencies,
      criticalDeficiencies,
    };
  }, [inspections, getCriticalDeficiencies]);

  const scheduleInspection = useCallback((inspectionData: Partial<QCQAInspection>) => {
    track('inspection_schedule', { project_id: projectId, type: inspectionData.inspectionType });
    return createInspection(inspectionData);
  }, [projectId, createInspection, track]);

  const exportInspectionReport = useCallback((format: 'pdf' | 'excel') => {
    track('inspection_report_export', { project_id: projectId, format });
    return `inspection_report_${projectId}.${format}`;
  }, [projectId, track]);

  return {
    inspections: filteredInspections,
    selectedInspection,
    setSelectedInspection,
    inspectionFilters,
    setInspectionFilters,
    inspectionStats,
    scheduleInspection,
    getOpenDeficiencies,
    getCriticalDeficiencies,
    exportInspectionReport,
  };
}

export function useDeficiencyTracking(projectId: string) {
  const { getOpenDeficiencies, getCriticalDeficiencies } = useQCQAInspections(projectId);
  const { track } = useTracking();

  const deficiencySummary = useMemo(() => {
    const openDeficiencies = getOpenDeficiencies();
    const criticalDeficiencies = getCriticalDeficiencies();
    
    const bySeverity = {
      minor: openDeficiencies.filter(d => d.severity === 'minor').length,
      major: openDeficiencies.filter(d => d.severity === 'major').length,
      critical: openDeficiencies.filter(d => d.severity === 'critical').length,
      safety_critical: openDeficiencies.filter(d => d.severity === 'safety_critical').length,
    };
    
    return {
      total: openDeficiencies.length,
      critical: criticalDeficiencies.length,
      bySeverity,
    };
  }, [getOpenDeficiencies, getCriticalDeficiencies]);

  const generateDeficiencyReport = useCallback(() => {
    track('deficiency_report_generate', { project_id: projectId });
    return {
      projectId,
      reportDate: new Date(),
      summary: deficiencySummary,
      deficiencies: getOpenDeficiencies(),
    };
  }, [projectId, deficiencySummary, getOpenDeficiencies, track]);

  return {
    deficiencySummary,
    generateDeficiencyReport,
  };
}

export default {
  useInspectionManagementSystem,
  useDeficiencyTracking,
};
