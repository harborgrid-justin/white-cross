/**
 * LOC: USACE-CONSTR-QA-001
 * File: /reuse/frontend/composites/usace/downstream/quality-assurance-applications.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTracking } from '../../analytics-tracking-kit';
import {
  useQCQAInspections,
  useConstructionQualityMetrics,
  useConstructionQualityPlan,
  type QCQAInspection,
} from '../usace-construction-projects-composites';

export function useQualityAssuranceWorkflow(projectId: string) {
  const { inspections, createInspection } = useQCQAInspections(projectId);
  const { qualityData, updateMetrics } = useConstructionQualityMetrics(projectId);
  const { qualityPlan, addQualityActivity } = useConstructionQualityPlan(projectId);
  
  const [workflowStep, setWorkflowStep] = useState<'plan' | 'inspect' | 'correct' | 'verify'>('plan');
  const { track } = useTracking();

  const qaMetrics = useMemo(() => {
    return {
      defectsPerInspection: qualityData.defectsPerInspection,
      reworkPercentage: qualityData.reworkPercentage,
      firstTimeQuality: qualityData.firstTimeQuality,
      submittalApprovalRate: qualityData.submittalApprovalRate,
    };
  }, [qualityData]);

  const createQAPlan = useCallback((activityData: any) => {
    track('qa_plan_create', { project_id: projectId });
    addQualityActivity(activityData);
  }, [projectId, addQualityActivity, track]);

  const conductInspection = useCallback((inspectionData: Partial<QCQAInspection>) => {
    track('qa_inspection_conduct', { project_id: projectId });
    const inspection = createInspection({
      ...inspectionData,
      inspectionType: 'government_qa',
    });
    return inspection;
  }, [projectId, createInspection, track]);

  const updateQualityMetrics = useCallback(() => {
    track('qa_metrics_update', { project_id: projectId });
    
    const totalDefects = inspections.reduce((sum, insp) => sum + insp.deficiencies.length, 0);
    const totalInspections = inspections.length;
    
    updateMetrics(
      totalDefects,
      totalInspections,
      0, // rework hours (would come from actual data)
      1000, // total hours (would come from actual data)
      0, // approved submittals (would come from submittal tracking)
      0  // total submittals
    );
  }, [projectId, inspections, updateMetrics, track]);

  const generateQAReport = useCallback(() => {
    track('qa_report_generate', { project_id: projectId });
    
    return {
      projectId,
      reportDate: new Date(),
      metrics: qaMetrics,
      planCompliance: {
        totalActivities: qualityPlan.length,
        completed: 0,
        complianceRate: 0,
      },
      inspectionSummary: {
        total: inspections.length,
        passed: inspections.filter(i => i.conformsToSpecs).length,
        passRate: inspections.length > 0 ?
          (inspections.filter(i => i.conformsToSpecs).length / inspections.length) * 100 : 0,
      },
    };
  }, [projectId, qaMetrics, qualityPlan, inspections, track]);

  return {
    workflowStep,
    setWorkflowStep,
    qualityPlan,
    qaMetrics,
    createQAPlan,
    conductInspection,
    updateQualityMetrics,
    generateQAReport,
  };
}

export function useQualityControlDashboard(projectId: string) {
  const { qualityData } = useConstructionQualityMetrics(projectId);
  const { inspections } = useQCQAInspections(projectId);
  const { track } = useTracking();

  const dashboardData = useMemo(() => {
    const recentInspections = inspections.slice(0, 10);
    
    return {
      qualityScore: qualityData.firstTimeQuality,
      defectRate: qualityData.defectsPerInspection,
      reworkRate: qualityData.reworkPercentage,
      recentInspections,
      trend: 'improving' as 'improving' | 'stable' | 'declining',
    };
  }, [qualityData, inspections]);

  const refreshDashboard = useCallback(() => {
    track('qc_dashboard_refresh', { project_id: projectId });
  }, [projectId, track]);

  return {
    dashboardData,
    refreshDashboard,
  };
}

export default {
  useQualityAssuranceWorkflow,
  useQualityControlDashboard,
};
