/**
 * Healthcare Domain Hooks
 * 
 * Custom hooks for healthcare-related functionality including medications,
 * appointments, health records, and incident reports.
 */

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import {
  selectStudentHealthOverview,
  selectMedicationsDueToday,
  selectMedicationAdherenceStats,
  selectAppointmentStats,
  selectIncidentTrends,
  selectHealthAlerts,
  selectHealthcareDashboard,
  selectHIPAACompliance,
} from './selectors';

// Import actions from slices
import {
  fetchIncidentReports,
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport,
} from '../../slices/incidentReportsSlice';

// ==========================================
// STUDENT HEALTH HOOKS
// ==========================================

/**
 * Hook for student health overview
 */
export const useStudentHealth = (studentId: string) => {
  const healthOverview = useAppSelector((state) => 
    selectStudentHealthOverview(state, studentId)
  );

  return {
    overview: healthOverview,
    hasActiveConditions: healthOverview.hasActiveConditions,
    medicationCount: healthOverview.medicationCount,
    upcomingAppointments: healthOverview.upcomingAppointments,
    recentIncidents: healthOverview.recentIncidents,
  };
};

// ==========================================
// MEDICATION MANAGEMENT HOOKS
// ==========================================

/**
 * Hook for medication management
 */
export const useMedications = () => {
  const medicationsDueToday = useAppSelector(selectMedicationsDueToday);
  const adherenceStats = useAppSelector(selectMedicationAdherenceStats);

  return {
    medicationsDueToday,
    adherenceStats,
    // Add medication-related actions as needed
  };
};

/**
 * Hook for medication adherence tracking
 */
export const useMedicationAdherence = () => {
  const adherenceStats = useAppSelector(selectMedicationAdherenceStats);

  return {
    stats: adherenceStats,
    adherenceRate: adherenceStats.adherenceRate,
    isGoodAdherence: adherenceStats.adherenceRate >= 80,
    needsAttention: adherenceStats.overdue > 0,
  };
};

// ==========================================
// APPOINTMENT MANAGEMENT HOOKS
// ==========================================

/**
 * Hook for appointment management
 */
export const useAppointments = () => {
  const appointmentStats = useAppSelector(selectAppointmentStats);

  return {
    stats: appointmentStats,
    hasUpcoming: appointmentStats.upcoming > 0,
    completionRate: appointmentStats.total > 0 
      ? (appointmentStats.completed / appointmentStats.total) * 100 
      : 0,
  };
};

// ==========================================
// INCIDENT REPORT HOOKS
// ==========================================

/**
 * Hook for incident report management
 */
export const useIncidentReports = () => {
  const dispatch = useAppDispatch();
  const incidentTrends = useAppSelector(selectIncidentTrends);

  const createIncident = useCallback(
    (incidentData: any) => {
      return dispatch(createIncidentReport(incidentData));
    },
    [dispatch]
  );

  const updateIncident = useCallback(
    (id: string, data: any) => {
      return dispatch(updateIncidentReport({ id, data }));
    },
    [dispatch]
  );

  const deleteIncident = useCallback(
    (id: string) => {
      return dispatch(deleteIncidentReport(id));
    },
    [dispatch]
  );

  const fetchIncidents = useCallback(
    (filters?: any) => {
      return dispatch(fetchIncidentReports(filters));
    },
    [dispatch]
  );

  return {
    trends: incidentTrends,
    actions: {
      create: createIncident,
      update: updateIncident,
      delete: deleteIncident,
      fetch: fetchIncidents,
    },
    isIncreasingTrend: incidentTrends.trend === 'increasing',
  };
};

// ==========================================
// HEALTH ALERTS HOOKS
// ==========================================

/**
 * Hook for health alerts and notifications
 */
export const useHealthAlerts = () => {
  const alerts = useAppSelector(selectHealthAlerts);

  const alertCount = Object.values(alerts).flat().length;
  const hasCriticalAlerts = alerts.criticalMedications.length > 0 || 
                           alerts.severeIncidents.length > 0;

  return {
    alerts,
    alertCount,
    hasCriticalAlerts,
    hasAnyAlerts: alertCount > 0,
    criticalCount: alerts.criticalMedications.length + alerts.severeIncidents.length,
  };
};

// ==========================================
// DASHBOARD HOOKS
// ==========================================

/**
 * Hook for healthcare dashboard data
 */
export const useHealthcareDashboard = () => {
  const dashboard = useAppSelector(selectHealthcareDashboard);

  return {
    dashboard,
    overview: dashboard.overview,
    needsAttention: dashboard.alerts.criticalMedications.length > 0 ||
                   dashboard.alerts.severeIncidents.length > 0,
  };
};

// ==========================================
// COMPLIANCE HOOKS
// ==========================================

/**
 * Hook for HIPAA compliance monitoring
 */
export const useHIPAACompliance = () => {
  const compliance = useAppSelector(selectHIPAACompliance);

  return {
    compliance,
    isCompliant: compliance.complianceScore >= 95,
    complianceScore: compliance.complianceScore,
    needsAttention: compliance.complianceScore < 95,
  };
};

// ==========================================
// COMPOSITE HEALTHCARE HOOKS
// ==========================================

/**
 * Hook that combines all healthcare data for a nurse dashboard
 */
export const useNurseDashboard = () => {
  const medicationsToday = useAppSelector(selectMedicationsDueToday);
  const alerts = useAppSelector(selectHealthAlerts);
  const appointments = useAppSelector(selectAppointmentStats);
  const incidents = useAppSelector(selectIncidentTrends);

  const urgentTasks = [
    ...alerts.criticalMedications,
    ...alerts.missedAppointments,
    ...alerts.severeIncidents,
  ];

  return {
    medicationsToday: medicationsToday.length,
    appointmentsToday: appointments.upcoming,
    recentIncidents: incidents.thisMonth,
    urgentTasks: urgentTasks.length,
    hasUrgentTasks: urgentTasks.length > 0,
    overview: {
      medicationsToday,
      alerts,
      appointments,
      incidents,
    },
  };
};

/**
 * Hook for healthcare data analysis
 */
export const useHealthcareAnalytics = () => {
  const medicationStats = useAppSelector(selectMedicationAdherenceStats);
  const appointmentStats = useAppSelector(selectAppointmentStats);
  const incidentTrends = useAppSelector(selectIncidentTrends);

  return {
    medication: {
      adherenceRate: medicationStats.adherenceRate,
      totalMedications: medicationStats.totalMedications,
    },
    appointments: {
      completionRate: appointmentStats.total > 0 
        ? (appointmentStats.completed / appointmentStats.total) * 100 
        : 0,
      noShowRate: appointmentStats.total > 0
        ? (appointmentStats.noShows / appointmentStats.total) * 100
        : 0,
    },
    incidents: {
      trend: incidentTrends.trend,
      monthlyChange: incidentTrends.thisMonth - incidentTrends.lastMonth,
      byType: incidentTrends.byType,
    },
  };
};