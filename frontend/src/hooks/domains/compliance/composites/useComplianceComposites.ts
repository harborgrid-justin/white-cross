import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  useAudits,
  useAuditDetails,
  usePolicies,
  usePolicyDetails,
  useTraining,
  useTrainingDetails,
  useUserTraining,
  useIncidents,
  useIncidentDetails,
  useRiskAssessments,
  useRiskAssessmentDetails,
  useComplianceDashboard,
  useComplianceStats,
} from '../queries/useComplianceQueries';
import {
  useCreateAudit,
  useUpdateAudit,
  useDeleteAudit,
  useCreatePolicy,
  useUpdatePolicy,
  useApprovePolicy,
  useCreateTraining,
  useUpdateTraining,
  useEnrollUserInTraining,
  useCompleteTraining,
  useCreateIncident,
  useUpdateIncident,
  useResolveIncident,
  useCreateRiskAssessment,
  useUpdateRiskAssessment,
  useApproveRiskAssessment,
} from '../mutations/useComplianceMutations';
import { ComplianceAudit, CompliancePolicy, ComplianceIncident } from '../config';

// Composite hook for managing audit workflows
export const useAuditWorkflow = (auditId?: string) => {
  const auditQuery = useAuditDetails(auditId!, { enabled: !!auditId });
  const updateAuditMutation = useUpdateAudit();
  const deleteAuditMutation = useDeleteAudit();
  
  const audit = auditQuery.data;
  
  const actions = useMemo(() => ({
    updateAudit: (data: Partial<ComplianceAudit>) => 
      updateAuditMutation.mutate({ id: auditId!, data }),
    deleteAudit: () => deleteAuditMutation.mutate(auditId!),
    canEdit: audit?.status === 'SCHEDULED' || audit?.status === 'IN_PROGRESS',
    canDelete: audit?.status === 'SCHEDULED',
    isCompleted: audit?.status === 'COMPLETED',
  }), [audit, auditId, updateAuditMutation, deleteAuditMutation]);

  return {
    audit,
    isLoading: auditQuery.isLoading,
    error: auditQuery.error,
    actions,
    mutations: {
      update: updateAuditMutation,
      delete: deleteAuditMutation,
    },
  };
};

// Composite hook for policy management workflow
export const usePolicyWorkflow = (policyId?: string) => {
  const policyQuery = usePolicyDetails(policyId!, { enabled: !!policyId });
  const updatePolicyMutation = useUpdatePolicy();
  const approvePolicyMutation = useApprovePolicy();
  
  const policy = policyQuery.data;
  
  const actions = useMemo(() => ({
    updatePolicy: (data: Partial<CompliancePolicy>) =>
      updatePolicyMutation.mutate({ id: policyId!, data }),
    approvePolicy: () => approvePolicyMutation.mutate(policyId!),
    canEdit: policy?.status === 'DRAFT' || policy?.status === 'UNDER_REVIEW',
    canApprove: policy?.status === 'UNDER_REVIEW',
    isActive: policy?.status === 'ACTIVE',
    needsReview: policy && new Date(policy.reviewDate) < new Date(),
  }), [policy, policyId, updatePolicyMutation, approvePolicyMutation]);

  return {
    policy,
    isLoading: policyQuery.isLoading,
    error: policyQuery.error,
    actions,
    mutations: {
      update: updatePolicyMutation,
      approve: approvePolicyMutation,
    },
  };
};

// Composite hook for training enrollment and completion
export const useTrainingEnrollment = (userId: string, trainingId?: string) => {
  const userTrainingQuery = useUserTraining(userId);
  const trainingQuery = useTrainingDetails(trainingId!, { enabled: !!trainingId });
  const enrollMutation = useEnrollUserInTraining();
  const completeMutation = useCompleteTraining();
  
  const userTraining = userTrainingQuery.data;
  const training = trainingQuery.data;
  const userTrainingRecord = userTraining?.find(record => record.trainingId === trainingId);
  
  const actions = useMemo(() => ({
    enroll: () => enrollMutation.mutate({ trainingId: trainingId!, userId }),
    complete: (completionData: any) =>
      completeMutation.mutate({ trainingId: trainingId!, userId, data: completionData }),
    isEnrolled: !!userTrainingRecord,
    isCompleted: userTrainingRecord?.status === 'COMPLETED',
    isExpired: userTrainingRecord?.status === 'EXPIRED',
    needsRetake: userTrainingRecord?.status === 'EXPIRED' || userTrainingRecord?.status === 'FAILED',
    progress: userTrainingRecord?.status === 'IN_PROGRESS' ? 50 : 
             userTrainingRecord?.status === 'COMPLETED' ? 100 : 0,
  }), [userTrainingRecord, trainingId, userId, enrollMutation, completeMutation]);

  return {
    training,
    userTrainingRecord,
    isLoading: trainingQuery.isLoading || userTrainingQuery.isLoading,
    error: trainingQuery.error || userTrainingQuery.error,
    actions,
    mutations: {
      enroll: enrollMutation,
      complete: completeMutation,
    },
  };
};

// Composite hook for incident management workflow
export const useIncidentWorkflow = (incidentId?: string) => {
  const incidentQuery = useIncidentDetails(incidentId!, { enabled: !!incidentId });
  const updateIncidentMutation = useUpdateIncident();
  const resolveIncidentMutation = useResolveIncident();
  
  const incident = incidentQuery.data;
  
  const actions = useMemo(() => ({
    updateIncident: (data: Partial<ComplianceIncident>) =>
      updateIncidentMutation.mutate({ id: incidentId!, data }),
    resolveIncident: (resolution: string) =>
      resolveIncidentMutation.mutate({ id: incidentId!, resolution }),
    canEdit: incident?.status !== 'CLOSED',
    canResolve: incident?.status === 'INVESTIGATING',
    isCritical: incident?.severity === 'CRITICAL' || incident?.severity === 'HIGH',
    isOverdue: incident && !incident.resolvedAt && 
               new Date() > new Date(new Date(incident.reportedAt).getTime() + 7 * 24 * 60 * 60 * 1000),
  }), [incident, incidentId, updateIncidentMutation, resolveIncidentMutation]);

  return {
    incident,
    isLoading: incidentQuery.isLoading,
    error: incidentQuery.error,
    actions,
    mutations: {
      update: updateIncidentMutation,
      resolve: resolveIncidentMutation,
    },
  };
};

// Composite hook for compliance dashboard with aggregated data
export const useComplianceDashboardComposite = () => {
  const dashboardQuery = useComplianceDashboard();
  const statsQuery = useComplianceStats('month');
  const recentAuditsQuery = useAudits({ limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' });
  const openIncidentsQuery = useIncidents({ status: ['REPORTED', 'INVESTIGATING'], limit: 10 });
  const pendingPoliciesQuery = usePolicies({ status: 'UNDER_REVIEW', limit: 5 });
  
  const summary = useMemo(() => {
    if (!dashboardQuery.data || !statsQuery.data) return null;
    
    const { stats } = dashboardQuery.data;
    const monthlyStats = statsQuery.data;
    
    return {
      overview: {
        totalAudits: stats.totalAudits,
        activePolicies: stats.activePolicies,
        openIncidents: stats.openIncidents,
        trainingCompliance: stats.trainingCompliance,
      },
      trends: {
        auditCompletion: monthlyStats.auditStats.completed / 
          (monthlyStats.auditStats.completed + monthlyStats.auditStats.inProgress) * 100,
        incidentResolution: monthlyStats.incidentStats.resolved / 
          monthlyStats.incidentStats.total * 100,
        trainingCompliance: monthlyStats.trainingStats.completionRate,
      },
      alerts: {
        criticalIncidents: openIncidentsQuery.data?.filter(i => i.severity === 'CRITICAL').length || 0,
        overdueTraining: monthlyStats.trainingStats.overdue,
        expiredPolicies: monthlyStats.policyStats.expired,
        highRisks: monthlyStats.riskStats.high,
      },
    };
  }, [dashboardQuery.data, statsQuery.data, openIncidentsQuery.data]);

  return {
    summary,
    recentAudits: recentAuditsQuery.data,
    openIncidents: openIncidentsQuery.data,
    pendingPolicies: pendingPoliciesQuery.data,
    isLoading: dashboardQuery.isLoading || statsQuery.isLoading,
    error: dashboardQuery.error || statsQuery.error,
    queries: {
      dashboard: dashboardQuery,
      stats: statsQuery,
      recentAudits: recentAuditsQuery,
      openIncidents: openIncidentsQuery,
      pendingPolicies: pendingPoliciesQuery,
    },
  };
};

// Composite hook for compliance reporting
export const useComplianceReporting = (type: 'audit' | 'incident' | 'training' | 'policy' | 'risk') => {
  const auditsQuery = useAudits({}, { enabled: type === 'audit' });
  const incidentsQuery = useIncidents({}, { enabled: type === 'incident' });
  const trainingQuery = useTraining({}, { enabled: type === 'training' });
  const policiesQuery = usePolicies({}, { enabled: type === 'policy' });
  const riskAssessmentsQuery = useRiskAssessments({}, { enabled: type === 'risk' });
  
  const reportData = useMemo(() => {
    switch (type) {
      case 'audit':
        return auditsQuery.data;
      case 'incident':
        return incidentsQuery.data;
      case 'training':
        return trainingQuery.data;
      case 'policy':
        return policiesQuery.data;
      case 'risk':
        return riskAssessmentsQuery.data;
      default:
        return null;
    }
  }, [type, auditsQuery.data, incidentsQuery.data, trainingQuery.data, policiesQuery.data, riskAssessmentsQuery.data]);

  const analytics = useMemo(() => {
    if (!reportData) return null;

    switch (type) {
      case 'audit':
        return {
          total: reportData.length,
          completed: reportData.filter((a: ComplianceAudit) => a.status === 'COMPLETED').length,
          inProgress: reportData.filter((a: ComplianceAudit) => a.status === 'IN_PROGRESS').length,
          byType: reportData.reduce((acc: any, audit: ComplianceAudit) => {
            acc[audit.type] = (acc[audit.type] || 0) + 1;
            return acc;
          }, {}),
        };
      case 'incident':
        return {
          total: reportData.length,
          resolved: reportData.filter((i: ComplianceIncident) => i.status === 'RESOLVED').length,
          investigating: reportData.filter((i: ComplianceIncident) => i.status === 'INVESTIGATING').length,
          bySeverity: reportData.reduce((acc: any, incident: ComplianceIncident) => {
            acc[incident.severity] = (acc[incident.severity] || 0) + 1;
            return acc;
          }, {}),
        };
      // Add other analytics as needed
      default:
        return { total: reportData.length };
    }
  }, [type, reportData]);

  return {
    data: reportData,
    analytics,
    isLoading: auditsQuery.isLoading || incidentsQuery.isLoading || 
               trainingQuery.isLoading || policiesQuery.isLoading || 
               riskAssessmentsQuery.isLoading,
    error: auditsQuery.error || incidentsQuery.error || 
           trainingQuery.error || policiesQuery.error || 
           riskAssessmentsQuery.error,
  };
};

// Composite hook for user compliance status
export const useUserComplianceStatus = (userId: string) => {
  const userTrainingQuery = useUserTraining(userId);
  const userIncidentsQuery = useIncidents({ reportedBy: userId });
  
  const complianceStatus = useMemo(() => {
    const training = userTrainingQuery.data || [];
    const incidents = userIncidentsQuery.data || [];
    
    const trainingStats = {
      completed: training.filter(t => t.status === 'COMPLETED').length,
      expired: training.filter(t => t.status === 'EXPIRED').length,
      inProgress: training.filter(t => t.status === 'IN_PROGRESS').length,
      total: training.length,
    };
    
    const complianceScore = training.length > 0 ? 
      (trainingStats.completed / training.length) * 100 : 100;
    
    return {
      trainingStats,
      complianceScore,
      hasExpiredTraining: trainingStats.expired > 0,
      hasIncidents: incidents.length > 0,
      recentIncidents: incidents.filter(i => 
        new Date(i.reportedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      status: complianceScore >= 90 ? 'COMPLIANT' : 
              complianceScore >= 75 ? 'PARTIAL' : 'NON_COMPLIANT',
    };
  }, [userTrainingQuery.data, userIncidentsQuery.data]);

  return {
    complianceStatus,
    training: userTrainingQuery.data,
    incidents: userIncidentsQuery.data,
    isLoading: userTrainingQuery.isLoading || userIncidentsQuery.isLoading,
    error: userTrainingQuery.error || userIncidentsQuery.error,
  };
};
