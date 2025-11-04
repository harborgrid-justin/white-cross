import {
  EmergencyPlan,
  EmergencyIncident,
  EmergencyContact,
  EmergencyProcedure,
  EmergencyResource,
  EmergencyTraining,
  IncidentTimelineEntry,
} from '../config';

// Mock API functions (replace with actual API calls)
export const mockEmergencyAPI = {
  // Emergency Plans
  getEmergencyPlans: async (filters?: any): Promise<EmergencyPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  },

  getEmergencyPlanById: async (id: string): Promise<EmergencyPlan> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as EmergencyPlan;
  },

  getActivePlans: async (): Promise<EmergencyPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },

  // Emergency Incidents
  getIncidents: async (filters?: any): Promise<EmergencyIncident[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },

  getIncidentById: async (id: string): Promise<EmergencyIncident> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {} as EmergencyIncident;
  },

  getIncidentTimeline: async (id: string): Promise<IncidentTimelineEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [];
  },

  getActiveIncidents: async (): Promise<EmergencyIncident[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [];
  },

  getCriticalIncidents: async (): Promise<EmergencyIncident[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [];
  },

  // Emergency Contacts
  getContacts: async (filters?: any): Promise<EmergencyContact[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },

  getContactById: async (id: string): Promise<EmergencyContact> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return {} as EmergencyContact;
  },

  getPrimaryContacts: async (): Promise<EmergencyContact[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },

  get24x7Contacts: async (): Promise<EmergencyContact[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [];
  },

  // Emergency Procedures
  getProcedures: async (filters?: any): Promise<EmergencyProcedure[]> => {
    await new Promise(resolve => setTimeout(resolve, 450));
    return [];
  },

  getProcedureById: async (id: string): Promise<EmergencyProcedure> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as EmergencyProcedure;
  },

  getProceduresByCategory: async (category: string): Promise<EmergencyProcedure[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },

  // Emergency Resources
  getResources: async (filters?: any): Promise<EmergencyResource[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },

  getResourceById: async (id: string): Promise<EmergencyResource> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return {} as EmergencyResource;
  },

  getAvailableResources: async (type?: string): Promise<EmergencyResource[]> => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [];
  },

  getResourcesByLocation: async (locationId: string): Promise<EmergencyResource[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },

  // Emergency Training
  getTraining: async (filters?: any): Promise<EmergencyTraining[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },

  getTrainingById: async (id: string): Promise<EmergencyTraining> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as EmergencyTraining;
  },

  getUpcomingTraining: async (userId: string): Promise<EmergencyTraining[]> => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [];
  },

  getRequiredTraining: async (userId: string): Promise<EmergencyTraining[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },

  // Analytics and Reports
  getEmergencyDashboard: async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      activeIncidents: 0,
      criticalIncidents: 0,
      activePlans: 0,
      availableResources: 0,
      trainingCompliance: 85,
      lastDrillDate: null,
      nextScheduledDrill: null,
      responseTime: {
        average: 0,
        target: 15
      },
      recentAlerts: []
    };
  },

  getIncidentStatistics: async (timeframe?: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      totalIncidents: 0,
      byType: {},
      bySeverity: {},
      byStatus: {},
      averageResponseTime: 0,
      averageResolutionTime: 0,
      trendsData: []
    };
  },

  getReadinessReport: async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      overallScore: 85,
      plansCoverage: 90,
      resourceAvailability: 80,
      staffReadiness: 85,
      trainingCompliance: 88,
      equipmentStatus: 92,
      communicationReadiness: 78,
      recommendations: []
    };
  },
};
