/**
 * Emergency Domain Configuration Module
 *
 * Centralized configuration for emergency management system including query keys,
 * cache strategies, TypeScript types, and utility functions for TanStack Query integration.
 *
 * @module hooks/domains/emergency/config
 *
 * @remarks
 * This module provides the foundational configuration for the emergency management system:
 *
 * **Query Keys**:
 * - Hierarchical key structure for efficient cache management
 * - Supports filtering and detail views for all emergency entities
 * - Enables precise cache invalidation strategies
 *
 * **Cache Configuration**:
 * - Real-time data (incidents): 2-minute stale time with automatic refetch
 * - Static data (procedures): 1-hour stale time for reduced network traffic
 * - Balanced caching for contacts, resources, and training data
 *
 * **Type System**:
 * - Comprehensive TypeScript interfaces for all emergency entities
 * - Support for complex workflows (escalation, communication, recovery)
 * - Interoperability with incident reporting and healthcare compliance
 *
 * **HIPAA Compliance**:
 * - Audit trail support through user tracking in all entities
 * - PHI handling guidelines for emergency contacts
 * - Secure communication channel specifications
 *
 * @example
 * ```typescript
 * // Use query keys for cache management
 * import { EMERGENCY_QUERY_KEYS } from '@/hooks/domains/emergency/config';
 *
 * const queryKey = EMERGENCY_QUERY_KEYS.incidentDetails('incident-123');
 * queryClient.invalidateQueries({ queryKey });
 * ```
 *
 * @example
 * ```typescript
 * // Apply cache configuration
 * import { EMERGENCY_CACHE_CONFIG } from '@/hooks/domains/emergency/config';
 *
 * useQuery({
 *   queryKey: ['emergency-data'],
 *   queryFn: fetchData,
 *   staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
 * });
 * ```
 *
 * @see {@link useEmergencyQueries} for query hook implementations
 * @see {@link useEmergencyMutations} for mutation hook implementations
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Emergency Domain Query Keys Factory
 *
 * Hierarchical query key structure for TanStack Query cache management.
 * Enables precise cache invalidation and efficient query matching.
 *
 * @constant
 *
 * @property {readonly ['emergency', 'plans']} emergencyPlans - Base key for all emergency plans
 * @property {Function} emergencyPlansList - List query key with optional filters
 * @property {Function} emergencyPlanDetails - Detail query key for specific plan
 * @property {readonly ['emergency', 'incidents']} incidents - Base key for all incidents
 * @property {Function} incidentsList - List query key with optional filters
 * @property {Function} incidentDetails - Detail query key for specific incident
 * @property {Function} incidentTimeline - Timeline query key for incident history
 * @property {readonly ['emergency', 'contacts']} contacts - Base key for all emergency contacts
 * @property {Function} contactsList - List query key with optional filters
 * @property {Function} contactDetails - Detail query key for specific contact
 * @property {readonly ['emergency', 'procedures']} procedures - Base key for all procedures
 * @property {Function} proceduresList - List query key with optional filters
 * @property {Function} procedureDetails - Detail query key for specific procedure
 * @property {readonly ['emergency', 'resources']} resources - Base key for all resources
 * @property {Function} resourcesList - List query key with optional filters
 * @property {Function} resourceDetails - Detail query key for specific resource
 * @property {readonly ['emergency', 'training']} training - Base key for all training
 * @property {Function} trainingList - List query key with optional filters
 * @property {Function} trainingDetails - Detail query key for specific training
 *
 * @remarks
 * Query keys follow the pattern: `[domain, entity, operation?, identifier?, filters?]`
 *
 * This structure enables:
 * - **Precise invalidation**: Invalidate specific entity or all related queries
 * - **Efficient matching**: TanStack Query matches keys using structural sharing
 * - **Filter support**: Different filter combinations create unique cache entries
 *
 * **Cache Invalidation Examples**:
 * ```typescript
 * // Invalidate all emergency plans
 * queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlans });
 *
 * // Invalidate specific plan
 * queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlanDetails('plan-123') });
 *
 * // Invalidate filtered list
 * queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentsList({ status: 'ACTIVE' }) });
 * ```
 *
 * @example
 * ```typescript
 * // Use in query hooks
 * const { data } = useQuery({
 *   queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(incidentId),
 *   queryFn: () => fetchIncident(incidentId),
 * });
 * ```
 *
 * @see {@link EMERGENCY_CACHE_CONFIG} for cache timing configuration
 */
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

/**
 * Emergency Domain Cache Configuration
 *
 * Defines stale time and cache time strategies for different types of emergency data.
 * Balances real-time requirements with network efficiency and server load.
 *
 * @constant
 *
 * @property {number} DEFAULT_STALE_TIME - 5 minutes (300,000ms) - General purpose caching
 * @property {number} DEFAULT_CACHE_TIME - 10 minutes (600,000ms) - General purpose cache retention
 * @property {number} EMERGENCY_PLANS_STALE_TIME - 15 minutes (900,000ms) - Plans change infrequently
 * @property {number} INCIDENTS_STALE_TIME - 2 minutes (120,000ms) - Critical real-time data
 * @property {number} CONTACTS_STALE_TIME - 30 minutes (1,800,000ms) - Contacts change rarely
 * @property {number} PROCEDURES_STALE_TIME - 60 minutes (3,600,000ms) - Procedures are static
 * @property {number} RESOURCES_STALE_TIME - 15 minutes (900,000ms) - Resource availability updates moderately
 * @property {number} TRAINING_STALE_TIME - 30 minutes (1,800,000ms) - Training schedules change occasionally
 *
 * @remarks
 * **Stale Time Strategy**:
 *
 * Stale time determines when cached data is considered outdated and a background refetch is triggered:
 *
 * - **Critical Real-Time (2 min)**: Active incidents, emergency alerts - requires frequent updates
 * - **Moderate Updates (15 min)**: Emergency plans, resources - balance between freshness and efficiency
 * - **Infrequent Changes (30-60 min)**: Contacts, procedures, training - optimize network usage
 *
 * **Cache Timing vs. Refetch Intervals**:
 *
 * Stale time works in conjunction with refetch intervals defined in query hooks:
 * - Incidents: 2-minute stale + 15-second refetch interval = near real-time monitoring
 * - Dashboard: 5-minute stale + 60-second refetch interval = periodic updates
 * - Static data: Long stale time + no refetch interval = manual refresh only
 *
 * **HIPAA Compliance**:
 *
 * Cache timing affects audit trail accuracy:
 * - Shorter stale times ensure recent PHI access is logged
 * - Automatic refetch intervals capture emergency status changes
 * - Cache invalidation on mutations maintains data integrity
 *
 * @example
 * ```typescript
 * // Use in incident queries (real-time requirement)
 * useQuery({
 *   queryKey: ['incident', id],
 *   queryFn: () => fetchIncident(id),
 *   staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
 *   refetchInterval: 15000, // 15 seconds for active monitoring
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Use in procedure queries (static data)
 * useQuery({
 *   queryKey: ['procedure', id],
 *   queryFn: () => fetchProcedure(id),
 *   staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
 *   // No refetch interval - procedures rarely change
 * });
 * ```
 *
 * @see {@link EMERGENCY_QUERY_KEYS} for query key structure
 * @see {@link useEmergencyQueries} for query implementations with cache config
 */
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

/**
 * TypeScript Type Definitions for Emergency Domain
 *
 * Comprehensive type system supporting emergency management workflows including
 * plans, incidents, contacts, procedures, resources, and training.
 */

/**
 * Emergency Plan Interface
 *
 * Defines comprehensive emergency response plan with activation criteria,
 * escalation matrix, communication plan, and recovery procedures.
 *
 * @interface
 *
 * @property {string} id - Unique plan identifier
 * @property {string} name - Plan name
 * @property {string} description - Detailed plan description
 * @property {EmergencyPlanCategory} category - Plan categorization (fire, medical, etc.)
 * @property {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} priority - Plan priority level
 * @property {'DRAFT'|'ACTIVE'|'INACTIVE'|'ARCHIVED'} status - Current plan status
 * @property {string} version - Plan version number
 * @property {string} effectiveDate - ISO 8601 date when plan becomes effective
 * @property {string} reviewDate - ISO 8601 date for next review
 * @property {EmergencyProcedure[]} procedures - Associated emergency procedures
 * @property {EmergencyContact[]} contacts - Emergency contacts for this plan
 * @property {EmergencyResource[]} resources - Required resources
 * @property {string[]} activationCriteria - Conditions triggering plan activation
 * @property {EscalationLevel[]} escalationMatrix - Escalation hierarchy
 * @property {CommunicationStep[]} communicationPlan - Communication workflow
 * @property {RecoveryStep[]} recoveryPlan - Recovery procedures
 * @property {EmergencyUser} createdBy - User who created the plan
 * @property {EmergencyUser} [updatedBy] - User who last updated the plan
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last update timestamp
 * @property {string} [lastActivated] - ISO 8601 last activation timestamp
 * @property {number} activationCount - Number of times plan has been activated
 *
 * @remarks
 * **Plan Lifecycle**:
 * - DRAFT: Plan under development, not yet approved
 * - ACTIVE: Approved and ready for activation
 * - INACTIVE: Temporarily disabled
 * - ARCHIVED: Retired plan, kept for historical reference
 *
 * **Activation Workflow**:
 * 1. Criteria evaluation triggers automatic or manual activation
 * 2. Escalation matrix determines notification hierarchy
 * 3. Communication plan executes notifications
 * 4. Resources allocated per plan requirements
 * 5. Recovery plan guides return to normal operations
 *
 * @example
 * ```typescript
 * const firePlan: EmergencyPlan = {
 *   id: 'plan-123',
 *   name: 'Building Fire Response',
 *   priority: 'CRITICAL',
 *   status: 'ACTIVE',
 *   activationCriteria: [
 *     'Fire alarm activation',
 *     'Visual confirmation of fire',
 *     'Smoke detection system alert'
 *   ],
 *   // ... other properties
 * };
 * ```
 */
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

/**
 * Emergency Incident Interface
 *
 * Comprehensive incident tracking with severity levels, status lifecycle,
 * response team coordination, timeline management, and damage assessment.
 *
 * @interface
 *
 * @property {string} id - Unique incident identifier
 * @property {string} title - Incident title/summary
 * @property {string} description - Detailed incident description
 * @property {IncidentType} type - Incident classification (medical, fire, etc.)
 * @property {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} severity - Incident severity level
 * @property {'REPORTED'|'INVESTIGATING'|'RESPONDING'|'CONTAINED'|'RESOLVED'|'CLOSED'} status - Current incident status
 * @property {IncidentLocation} location - Incident location details
 * @property {EmergencyUser} reportedBy - User who reported the incident
 * @property {EmergencyUser} [assignedTo] - User assigned to handle incident
 * @property {EmergencyUser} [incidentCommander] - Incident commander for critical incidents
 * @property {string[]} affectedAreas - List of affected areas/zones
 * @property {number} estimatedAffected - Estimated number of people affected
 * @property {number} [actualAffected] - Actual number of people affected (post-incident)
 * @property {EmergencyUser[]} responseTeam - Team members responding to incident
 * @property {EmergencyPlan[]} relatedPlans - Emergency plans activated for this incident
 * @property {IncidentTimelineEntry[]} timeline - Chronological incident timeline
 * @property {EmergencyResource[]} resources - Resources allocated to incident
 * @property {IncidentCommunication[]} communications - Communication log
 * @property {IncidentDamage} [damages] - Damage assessment
 * @property {string[]} lessons - Lessons learned for future improvement
 * @property {string} reportedAt - ISO 8601 when incident was reported
 * @property {string} [acknowledgedAt] - ISO 8601 when incident was acknowledged
 * @property {string} [respondedAt] - ISO 8601 when response began
 * @property {string} [containedAt] - ISO 8601 when incident was contained
 * @property {string} [resolvedAt] - ISO 8601 when incident was resolved
 * @property {string} [closedAt] - ISO 8601 when incident was officially closed
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last update timestamp
 *
 * @remarks
 * **Incident Lifecycle**:
 * 1. REPORTED: Initial report submitted, awaiting triage
 * 2. INVESTIGATING: Team assessing situation and severity
 * 3. RESPONDING: Active response in progress
 * 4. CONTAINED: Immediate threat contained, cleanup in progress
 * 5. RESOLVED: Incident resolved, monitoring continues
 * 6. CLOSED: Incident officially closed after review
 *
 * **Severity-Based Escalation**:
 * - LOW: Standard response, single responder
 * - MEDIUM: Multiple responders, supervisor notification
 * - HIGH: Response team, management notification, emergency plan consideration
 * - CRITICAL: Full response activation, incident commander assigned, emergency plans activated
 *
 * **Real-Time Monitoring**:
 * - Incidents have 2-minute cache stale time
 * - Active incidents refetch every 15 seconds
 * - Critical incidents refetch every 10 seconds
 * - Timeline updates trigger immediate cache invalidation
 *
 * **HIPAA Compliance**:
 * - All incident access logged for audit trail
 * - PHI in incident descriptions must be appropriately secured
 * - Communication logs track all PHI disclosures
 *
 * @example
 * ```typescript
 * const medicalEmergency: EmergencyIncident = {
 *   id: 'incident-456',
 *   title: 'Student Medical Emergency',
 *   severity: 'CRITICAL',
 *   status: 'RESPONDING',
 *   type: { id: 'medical', name: 'Medical Emergency', category: 'MEDICAL' },
 *   estimatedAffected: 1,
 *   reportedAt: new Date().toISOString(),
 *   // ... other properties
 * };
 * ```
 *
 * @see {@link EmergencyPlan} for emergency plan activation
 * @see {@link IncidentTimelineEntry} for timeline entry structure
 */
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

/**
 * Cache Invalidation Utility Functions
 *
 * Convenience functions for invalidating specific emergency domain query caches.
 * Use after mutations to ensure UI reflects latest server state.
 *
 * @remarks
 * **When to Invalidate**:
 * - After successful mutations (create, update, delete)
 * - After emergency plan activation
 * - After incident status changes
 * - After resource allocation
 *
 * **Invalidation Scope**:
 * - Specific entity functions invalidate all queries for that entity (list + details)
 * - Use `invalidateAllEmergencyQueries` for cross-entity changes
 *
 * **Performance Considerations**:
 * - Invalidation triggers background refetch for all matching queries
 * - Use specific invalidation when possible to minimize refetches
 * - Consider setQueryData for optimistic updates before invalidation
 *
 * @example
 * ```typescript
 * // After creating an emergency plan
 * const { mutate } = useMutation({
 *   mutationFn: createPlan,
 *   onSuccess: () => {
 *     invalidateEmergencyPlansQueries(queryClient);
 *     toast.success('Plan created');
 *   },
 * });
 * ```
 *
 * @see {@link EMERGENCY_QUERY_KEYS} for query key structure
 */

/**
 * Invalidates all emergency plans queries (lists and details)
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All emergency plans lists (with any filters)
 * - All emergency plan detail views
 * - Active plans queries
 *
 * Use after:
 * - Creating new emergency plan
 * - Updating plan status or content
 * - Activating or deactivating plan
 * - Deleting plan
 *
 * @example
 * ```typescript
 * // In a mutation hook
 * onSuccess: () => {
 *   invalidateEmergencyPlansQueries(queryClient);
 * }
 * ```
 */
export const invalidateEmergencyPlansQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlans });
};

/**
 * Invalidates all incidents queries (lists, details, and timelines)
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All incidents lists (with any filters)
 * - All incident detail views
 * - All incident timelines
 * - Active and critical incident queries
 *
 * Use after:
 * - Creating new incident
 * - Updating incident status or severity
 * - Adding timeline entry
 * - Closing incident
 * - Assigning incident commander
 *
 * **Real-Time Considerations**:
 * - Incidents have 2-minute stale time + 15-second refetch intervals
 * - Invalidation provides immediate update beyond automatic refetch
 * - Critical for severity changes and status transitions
 *
 * @example
 * ```typescript
 * // After updating incident severity
 * onSuccess: () => {
 *   invalidateIncidentsQueries(queryClient);
 *   // Also invalidate dashboard for real-time alert updates
 *   queryClient.invalidateQueries({ queryKey: ['emergency', 'dashboard'] });
 * }
 * ```
 */
export const invalidateIncidentsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidents });
};

/**
 * Invalidates all emergency contacts queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All contacts lists
 * - All contact details
 * - Primary contacts queries
 * - 24x7 contacts queries
 *
 * Use after:
 * - Creating new emergency contact
 * - Updating contact information
 * - Changing contact priority
 * - Activating or deactivating contact
 * - Updating availability schedule
 *
 * @example
 * ```typescript
 * // After updating contact availability
 * onSuccess: () => {
 *   invalidateContactsQueries(queryClient);
 * }
 * ```
 */
export const invalidateContactsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.contacts });
};

/**
 * Invalidates all emergency procedures queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All procedures lists
 * - All procedure details
 * - Category-specific procedure queries
 *
 * Use after:
 * - Creating new procedure
 * - Updating procedure steps
 * - Changing procedure version
 * - Activating or archiving procedure
 * - Updating required resources or roles
 *
 * @example
 * ```typescript
 * // After updating evacuation procedure
 * onSuccess: () => {
 *   invalidateProceduresQueries(queryClient);
 * }
 * ```
 */
export const invalidateProceduresQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.procedures });
};

/**
 * Invalidates all emergency resources queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All resources lists
 * - All resource details
 * - Available resources queries
 * - Location-specific resource queries
 *
 * Use after:
 * - Creating new resource
 * - Updating resource status or availability
 * - Allocating resource to incident
 * - Completing maintenance
 * - Changing resource location
 *
 * **Resource Availability Tracking**:
 * - Invalidation ensures accurate available quantity
 * - Critical for resource allocation decisions
 * - Supports multi-location resource management
 *
 * @example
 * ```typescript
 * // After allocating resource to incident
 * onSuccess: () => {
 *   invalidateResourcesQueries(queryClient);
 *   // Also invalidate incident to show allocated resources
 *   queryClient.invalidateQueries({
 *     queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(incidentId)
 *   });
 * }
 * ```
 */
export const invalidateResourcesQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.resources });
};

/**
 * Invalidates all emergency training queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All training lists
 * - All training details
 * - Upcoming training queries
 * - Required training queries
 *
 * Use after:
 * - Creating new training
 * - Updating training schedule
 * - Completing training session
 * - Updating training requirements
 * - Issuing certifications
 *
 * @example
 * ```typescript
 * // After completing training drill
 * onSuccess: () => {
 *   invalidateTrainingQueries(queryClient);
 * }
 * ```
 */
export const invalidateTrainingQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.training });
};

/**
 * Invalidates ALL emergency domain queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * **Use Sparingly**: This invalidates every emergency-related query in the cache.
 *
 * Triggers refetch for:
 * - All emergency plans
 * - All incidents
 * - All contacts
 * - All procedures
 * - All resources
 * - All training
 * - Dashboard and analytics
 *
 * Use only after:
 * - System-wide configuration changes
 * - Emergency plan activation (affects multiple entities)
 * - Major incident declaration (cascading effects)
 * - Database restoration or sync
 *
 * **Performance Impact**:
 * - Triggers multiple simultaneous refetches
 * - Can cause temporary UI loading states
 * - Prefer specific invalidation when possible
 *
 * @example
 * ```typescript
 * // After activating emergency plan (affects plans, resources, contacts)
 * onSuccess: () => {
 *   invalidateAllEmergencyQueries(queryClient);
 *   toast.success('Emergency plan activated - refreshing all data');
 * }
 * ```
 *
 * @see {@link invalidateEmergencyPlansQueries} for plan-specific invalidation
 * @see {@link invalidateIncidentsQueries} for incident-specific invalidation
 */
export const invalidateAllEmergencyQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['emergency'] });
};
