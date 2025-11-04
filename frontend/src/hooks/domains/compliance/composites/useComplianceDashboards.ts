import { useMemo } from 'react';
import {
  useAudits,
  usePolicies,
  useTraining,
  useUserTraining,
  useIncidents,
  useRiskAssessments,
  useComplianceDashboard,
  useComplianceStats,
} from '../queries/useComplianceQueries';
import { ComplianceAudit, ComplianceIncident } from '../config';

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
