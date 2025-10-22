import { QueryClient } from '@tanstack/react-query';

// Query Keys for Emergency Domain
export const EMERGENCY_QUERY_KEYS = {
  // Emergency Plans
  emergencyPlans: ['emergency', 'plans'] as const,
  emergencyPlansList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.emergencyPlans, 'list', filters] as const,
  emergencyPlanDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.emergencyPlans, 'detail', id] as const,
  
  // Emergency Incidents
  incidents: ['emergency', 'incidents'] as const,
  incidentsList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.incidents, 'list', filters] as const,
  incidentDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.incidents, 'detail', id] as const,
  incidentTimeline: (id: string) => [...EMERGENCY_QUERY_KEYS.incidents, id, 'timeline'] as const,
  
  // Emergency Contacts
  contacts: ['emergency', 'contacts'] as const,
  contactsList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.contacts, 'list', filters] as const,
  contactDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.contacts, 'detail', id] as const,
  
  // Emergency Procedures
  procedures: ['emergency', 'procedures'] as const,
  proceduresList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.procedures, 'list', filters] as const,
  procedureDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.procedures, 'detail', id] as const,
  
  // Emergency Resources
  resources: ['emergency', 'resources'] as const,
  resourcesList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.resources, 'list', filters] as const,
  resourceDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.resources, 'detail', id] as const,
  
  // Emergency Training
  training: ['emergency', 'training'] as const,
  trainingList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.training, 'list', filters] as const,
  trainingDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.training, 'detail', id] as const,
} as const;

// Cache Configuration
export const EMERGENCY_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  EMERGENCY_PLANS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  INCIDENTS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (real-time data)
  CONTACTS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  PROCEDURES_STALE_TIME: 60 * 60 * 1000, // 1 hour
  RESOURCES_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  TRAINING_STALE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;

// TypeScript Interfaces
export interface EmergencyPlan {
  id: string;
  name: string;
  description: string;
  category: EmergencyPlanCategory;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  version: string;
  effectiveDate: string;
  reviewDate: string;
  procedures: EmergencyProcedure[];
  contacts: EmergencyContact[];
  resources: EmergencyResource[];
  activationCriteria: string[];
  escalationMatrix: EscalationLevel[];
  communicationPlan: CommunicationStep[];
  recoveryPlan: RecoveryStep[];
  createdBy: EmergencyUser;
  updatedBy?: EmergencyUser;
  createdAt: string;
  updatedAt: string;
  lastActivated?: string;
  activationCount: number;
}

export interface EmergencyPlanCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export interface EmergencyIncident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'INVESTIGATING' | 'RESPONDING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
  location: IncidentLocation;
  reportedBy: EmergencyUser;
  assignedTo?: EmergencyUser;
  incidentCommander?: EmergencyUser;
  affectedAreas: string[];
  estimatedAffected: number;
  actualAffected?: number;
  responseTeam: EmergencyUser[];
  relatedPlans: EmergencyPlan[];
  timeline: IncidentTimelineEntry[];
  resources: EmergencyResource[];
  communications: IncidentCommunication[];
  damages?: IncidentDamage;
  lessons: string[];
  reportedAt: string;
  acknowledgedAt?: string;
  respondedAt?: string;
  containedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentType {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: string;
  responseTime: number; // minutes
  escalationRules: EscalationRule[];
}

export interface IncidentLocation {
  id: string;
  name: string;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  floor?: string;
  room?: string;
  zone?: string;
  capacity?: number;
}

export interface IncidentTimelineEntry {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  user: EmergencyUser;
  status?: string;
  attachments?: string[];
}

export interface IncidentCommunication {
  id: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'PUBLIC' | 'REGULATORY';
  channel: 'EMAIL' | 'SMS' | 'PHONE' | 'RADIO' | 'SOCIAL' | 'WEBSITE';
  recipients: string[];
  message: string;
  sentBy: EmergencyUser;
  sentAt: string;
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'FAILED';
}

export interface IncidentDamage {
  property: number;
  equipment: number;
  business: number;
  environmental: number;
  reputation: number;
  currency: string;
  notes: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  title: string;
  organization?: string;
  department?: string;
  contactType: 'INTERNAL' | 'EXTERNAL' | 'VENDOR' | 'AGENCY' | 'MEDIA';
  priority: number;
  isOn24x7: boolean;
  isPrimary: boolean;
  phone: string;
  mobile?: string;
  email: string;
  alternativeEmail?: string;
  address?: ContactAddress;
  specializations: string[];
  availability: ContactAvailability;
  notes?: string;
  lastContacted?: string;
  isActive: boolean;
  createdBy: EmergencyUser;
  createdAt: string;
  updatedAt: string;
}

export interface ContactAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactAvailability {
  weekdays: { start: string; end: string };
  weekends: { start: string; end: string };
  holidays: { available: boolean; contact?: string };
  timezone: string;
}

export interface EmergencyProcedure {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: ProcedureStep[];
  estimatedDuration: number; // minutes
  requiredRoles: string[];
  requiredResources: string[];
  triggers: string[];
  dependencies: string[];
  checklist: ChecklistItem[];
  documents: ProcedureDocument[];
  lastReviewed: string;
  reviewedBy: EmergencyUser;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: number;
  isRequired: boolean;
  assignedRole?: string;
  prerequisites: string[];
  verification: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  item: string;
  isRequired: boolean;
  assignedRole?: string;
  verificationMethod: string;
}

export interface ProcedureDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  description?: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: ResourceType;
  category: string;
  description: string;
  location: IncidentLocation;
  quantity: number;
  availableQuantity: number;
  unit: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'UNAVAILABLE';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  lastInspected?: string;
  inspectedBy?: EmergencyUser;
  maintenanceSchedule?: MaintenanceSchedule;
  supplier?: ResourceSupplier;
  cost?: number;
  purchaseDate?: string;
  warrantyExpiry?: string;
  specifications?: Record<string, any>;
  operatingInstructions?: string;
  safetyNotes?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceType {
  id: string;
  name: string;
  category: string;
  description: string;
  standardSpecs: Record<string, any>;
}

export interface MaintenanceSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  lastMaintenance?: string;
  nextMaintenance: string;
  maintenanceNotes?: string;
}

export interface ResourceSupplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  supportHours: string;
}

export interface EmergencyTraining {
  id: string;
  title: string;
  description: string;
  type: 'ORIENTATION' | 'DRILL' | 'TABLETOP' | 'FULL_SCALE' | 'CERTIFICATION';
  category: string;
  duration: number; // minutes
  frequency: TrainingFrequency;
  requiredFor: string[]; // roles
  prerequisites: string[];
  objectives: string[];
  curriculum: TrainingModule[];
  instructor?: EmergencyUser;
  location?: IncidentLocation;
  maxParticipants?: number;
  materials: TrainingMaterial[];
  assessments: TrainingAssessment[];
  certificationRequired: boolean;
  certificationValidity?: number; // months
  isActive: boolean;
  createdBy: EmergencyUser;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingFrequency {
  type: 'ONE_TIME' | 'RECURRING';
  interval?: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  intervalCount?: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  topics: string[];
  activities: TrainingActivity[];
}

export interface TrainingActivity {
  id: string;
  name: string;
  type: 'LECTURE' | 'DEMO' | 'EXERCISE' | 'DISCUSSION' | 'SIMULATION';
  duration: number;
  description: string;
  materials: string[];
}

export interface TrainingMaterial {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'VIDEO' | 'PRESENTATION' | 'HANDBOOK' | 'CHECKLIST';
  url: string;
  description?: string;
}

export interface TrainingAssessment {
  id: string;
  name: string;
  type: 'QUIZ' | 'PRACTICAL' | 'OBSERVATION' | 'CERTIFICATION';
  passingScore: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'PRACTICAL';
  options?: string[];
  correctAnswer: string;
  points: number;
}

export interface EscalationLevel {
  level: number;
  title: string;
  criteria: string;
  contacts: EmergencyContact[];
  actions: string[];
  timeframe: number; // minutes
}

export interface EscalationRule {
  condition: string;
  timeLimit: number;
  nextLevel: string;
  notifications: string[];
}

export interface CommunicationStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  audience: string;
  channels: string[];
  timing: string;
  template?: string;
  responsible: string;
}

export interface RecoveryStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: number;
  dependencies: string[];
  responsible: string;
  verification: string;
}

export interface EmergencyUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  department?: string;
  role: string;
  isEmergencyContact: boolean;
  specializations: string[];
  certifications: string[];
  availability: ContactAvailability;
}

// Utility Functions
export const invalidateEmergencyPlansQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlans });
};

export const invalidateIncidentsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidents });
};

export const invalidateContactsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.contacts });
};

export const invalidateProceduresQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.procedures });
};

export const invalidateResourcesQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.resources });
};

export const invalidateTrainingQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.training });
};

export const invalidateAllEmergencyQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['emergency'] });
};
