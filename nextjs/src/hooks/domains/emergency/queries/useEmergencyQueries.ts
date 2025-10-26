import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyPlan,
  EmergencyIncident,
  EmergencyContact,
  EmergencyProcedure,
  EmergencyResource,
  EmergencyTraining,
  IncidentTimelineEntry,
} from '../config';

// Mock API functions (replace with actual API calls)
const mockEmergencyAPI = {
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

// Emergency Plans Queries
export const useEmergencyPlans = (
  filters?: any,
  options?: UseQueryOptions<EmergencyPlan[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.emergencyPlansList(filters),
    queryFn: () => mockEmergencyAPI.getEmergencyPlans(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.EMERGENCY_PLANS_STALE_TIME,
    ...options,
  });
};

export const useEmergencyPlanDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyPlan, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.emergencyPlanDetails(id),
    queryFn: () => mockEmergencyAPI.getEmergencyPlanById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.EMERGENCY_PLANS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useActivePlans = (
  options?: UseQueryOptions<EmergencyPlan[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'plans', 'active'],
    queryFn: () => mockEmergencyAPI.getActivePlans(),
    staleTime: EMERGENCY_CACHE_CONFIG.EMERGENCY_PLANS_STALE_TIME,
    ...options,
  });
};

// Emergency Incidents Queries
export const useIncidents = (
  filters?: any,
  options?: UseQueryOptions<EmergencyIncident[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.incidentsList(filters),
    queryFn: () => mockEmergencyAPI.getIncidents(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    refetchInterval: 30000, // Real-time updates every 30 seconds
    ...options,
  });
};

export const useIncidentDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyIncident, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(id),
    queryFn: () => mockEmergencyAPI.getIncidentById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    enabled: !!id,
    refetchInterval: 15000, // Frequent updates for active incidents
    ...options,
  });
};

export const useIncidentTimeline = (
  id: string,
  options?: UseQueryOptions<IncidentTimelineEntry[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.incidentTimeline(id),
    queryFn: () => mockEmergencyAPI.getIncidentTimeline(id),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    enabled: !!id,
    refetchInterval: 10000, // Very frequent updates for timeline
    ...options,
  });
};

export const useActiveIncidents = (
  options?: UseQueryOptions<EmergencyIncident[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'incidents', 'active'],
    queryFn: () => mockEmergencyAPI.getActiveIncidents(),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    refetchInterval: 15000, // Real-time monitoring
    ...options,
  });
};

export const useCriticalIncidents = (
  options?: UseQueryOptions<EmergencyIncident[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'incidents', 'critical'],
    queryFn: () => mockEmergencyAPI.getCriticalIncidents(),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    refetchInterval: 10000, // Very frequent for critical incidents
    ...options,
  });
};

// Emergency Contacts Queries
export const useContacts = (
  filters?: any,
  options?: UseQueryOptions<EmergencyContact[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.contactsList(filters),
    queryFn: () => mockEmergencyAPI.getContacts(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    ...options,
  });
};

export const useContactDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyContact, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.contactDetails(id),
    queryFn: () => mockEmergencyAPI.getContactById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const usePrimaryContacts = (
  options?: UseQueryOptions<EmergencyContact[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'contacts', 'primary'],
    queryFn: () => mockEmergencyAPI.getPrimaryContacts(),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    ...options,
  });
};

export const use24x7Contacts = (
  options?: UseQueryOptions<EmergencyContact[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'contacts', '24x7'],
    queryFn: () => mockEmergencyAPI.get24x7Contacts(),
    staleTime: EMERGENCY_CACHE_CONFIG.CONTACTS_STALE_TIME,
    ...options,
  });
};

// Emergency Procedures Queries
export const useProcedures = (
  filters?: any,
  options?: UseQueryOptions<EmergencyProcedure[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.proceduresList(filters),
    queryFn: () => mockEmergencyAPI.getProcedures(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
    ...options,
  });
};

export const useProcedureDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyProcedure, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.procedureDetails(id),
    queryFn: () => mockEmergencyAPI.getProcedureById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useProceduresByCategory = (
  category: string,
  options?: UseQueryOptions<EmergencyProcedure[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'procedures', 'category', category],
    queryFn: () => mockEmergencyAPI.getProceduresByCategory(category),
    staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
    enabled: !!category,
    ...options,
  });
};

// Emergency Resources Queries
export const useResources = (
  filters?: any,
  options?: UseQueryOptions<EmergencyResource[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.resourcesList(filters),
    queryFn: () => mockEmergencyAPI.getResources(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    ...options,
  });
};

export const useResourceDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyResource, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.resourceDetails(id),
    queryFn: () => mockEmergencyAPI.getResourceById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useAvailableResources = (
  type?: string,
  options?: UseQueryOptions<EmergencyResource[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'resources', 'available', type],
    queryFn: () => mockEmergencyAPI.getAvailableResources(type),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    ...options,
  });
};

export const useResourcesByLocation = (
  locationId: string,
  options?: UseQueryOptions<EmergencyResource[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'resources', 'location', locationId],
    queryFn: () => mockEmergencyAPI.getResourcesByLocation(locationId),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    enabled: !!locationId,
    ...options,
  });
};

// Emergency Training Queries
export const useTraining = (
  filters?: any,
  options?: UseQueryOptions<EmergencyTraining[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.trainingList(filters),
    queryFn: () => mockEmergencyAPI.getTraining(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    ...options,
  });
};

export const useTrainingDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyTraining, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.trainingDetails(id),
    queryFn: () => mockEmergencyAPI.getTrainingById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useUpcomingTraining = (
  userId: string,
  options?: UseQueryOptions<EmergencyTraining[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'training', 'upcoming', userId],
    queryFn: () => mockEmergencyAPI.getUpcomingTraining(userId),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

export const useRequiredTraining = (
  userId: string,
  options?: UseQueryOptions<EmergencyTraining[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'training', 'required', userId],
    queryFn: () => mockEmergencyAPI.getRequiredTraining(userId),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

// Analytics and Dashboard Queries
export const useEmergencyDashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'dashboard'],
    queryFn: () => mockEmergencyAPI.getEmergencyDashboard(),
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    refetchInterval: 60000, // Refresh every minute
    ...options,
  });
};

export const useIncidentStatistics = (
  timeframe?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'statistics', 'incidents', timeframe],
    queryFn: () => mockEmergencyAPI.getIncidentStatistics(timeframe),
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

export const useReadinessReport = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'readiness'],
    queryFn: () => mockEmergencyAPI.getReadinessReport(),
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

// Bulk query for emergency overview
export const useEmergencyOverview = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'overview'],
    queryFn: async () => {
      const [dashboard, activeIncidents, criticalIncidents, activePlans] = await Promise.all([
        mockEmergencyAPI.getEmergencyDashboard(),
        mockEmergencyAPI.getActiveIncidents(),
        mockEmergencyAPI.getCriticalIncidents(),
        mockEmergencyAPI.getActivePlans(),
      ]);

      return {
        dashboard,
        activeIncidents: activeIncidents.slice(0, 5),
        criticalIncidents: criticalIncidents.slice(0, 3),
        activePlans: activePlans.slice(0, 5),
        alerts: [
          ...criticalIncidents.map(incident => ({
            type: 'critical_incident',
            message: `Critical incident: ${incident.title}`,
            timestamp: incident.reportedAt,
          })),
        ],
      };
    },
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    refetchInterval: 30000, // Frequent updates for overview
    ...options,
  });
};
