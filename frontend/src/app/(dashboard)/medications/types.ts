import { z } from 'zod';

// Medication Types
export type MedicationType = 
  | 'prescription' 
  | 'over_the_counter' 
  | 'supplement' 
  | 'emergency' 
  | 'inhaler' 
  | 'epipen' 
  | 'insulin'
  | 'controlled_substance';

export type MedicationStatus = 
  | 'active' 
  | 'discontinued' 
  | 'expired' 
  | 'on_hold' 
  | 'completed' 
  | 'cancelled';

export type AdministrationRoute = 
  | 'oral' 
  | 'injection' 
  | 'topical' 
  | 'inhaled' 
  | 'nasal' 
  | 'rectal' 
  | 'sublingual' 
  | 'transdermal';

export type MedicationFrequency = 
  | 'as_needed' 
  | 'once_daily' 
  | 'twice_daily' 
  | 'three_times_daily' 
  | 'four_times_daily' 
  | 'every_4_hours' 
  | 'every_6_hours' 
  | 'every_8_hours' 
  | 'every_12_hours' 
  | 'weekly' 
  | 'monthly' 
  | 'custom';

export type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

// Core Medication Interfaces
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  ndc?: string; // National Drug Code
  type: MedicationType;
  status: MedicationStatus;
  
  // Dosage Information
  strength: string;
  dosageForm: string; // tablet, capsule, liquid, etc.
  administrationRoute: AdministrationRoute;
  
  // Prescription Details
  prescriberId?: string;
  prescriberName?: string;
  prescriptionNumber?: string;
  prescribedDate?: Date;
  
  // Administration Schedule
  frequency: MedicationFrequency;
  dosageInstructions: string;
  maxDailyDose?: number;
  
  // Dates
  startDate: Date;
  endDate?: Date;
  lastAdministered?: Date;
  nextDue?: Date;
  
  // Storage and Handling
  storageRequirements?: string;
  specialInstructions?: string;
  
  // Safety Information
  warnings?: string[];
  contraindications?: string[];
  sideEffects?: string[];
  interactions?: MedicationInteraction[];
  
  // Tracking
  studentId: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Compliance
  isControlled: boolean;
  requiresParentConsent: boolean;
  requiresPhysicianOrder: boolean;
  
  // Notes
  notes?: string;
  internalNotes?: string;
}

export interface MedicationInteraction {
  id: string;
  interactingMedicationId?: string;
  interactingMedicationName: string;
  interactionType: 'major' | 'moderate' | 'minor';
  description: string;
  recommendations: string;
}

export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  
  // Administration Details
  administeredBy: string;
  administeredDate: Date;
  dosageGiven: string;
  administrationRoute: AdministrationRoute;
  
  // Verification
  witnessedBy?: string;
  parentNotified?: boolean;
  
  // Outcome
  administrationStatus: 'completed' | 'refused' | 'missed' | 'partial';
  refusalReason?: string;
  adverseReaction?: boolean;
  reactionDescription?: string;
  
  // Documentation
  notes?: string;
  attachments?: string[];
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationAlert {
  id: string;
  medicationId?: string;
  studentId?: string;
  type: 'expiration' | 'interaction' | 'allergy' | 'refill' | 'missed_dose' | 'adverse_reaction';
  level: AlertLevel;
  title: string;
  description: string;
  
  // Alert Timing
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  
  // Actions
  recommendedActions?: string[];
  isActive: boolean;
}

export interface MedicationInventory {
  id: string;
  medicationId: string;
  
  // Inventory Details
  lotNumber?: string;
  expirationDate: Date;
  quantityInStock: number;
  minimumQuantity: number;
  unitType: string; // tablets, ml, doses, etc.
  
  // Cost and Ordering
  costPerUnit?: number;
  supplier?: string;
  lastOrderDate?: Date;
  nextOrderDate?: Date;
  
  // Storage
  storageLocation: string;
  storageConditions: string;
  
  // Tracking
  createdAt: Date;
  updatedAt: Date;
}

// Filtering and Search
export interface MedicationFilters {
  studentId?: string;
  type?: MedicationType[];
  status?: MedicationStatus[];
  administrationRoute?: AdministrationRoute[];
  frequency?: MedicationFrequency[];
  prescriberId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  searchQuery?: string;
  isControlled?: boolean;
  requiresRefill?: boolean;
  hasAlerts?: boolean;
}

export interface MedicationSearchResult {
  medications: Medication[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: MedicationSummary;
}

export interface MedicationSummary {
  totalMedications: number;
  activeMedications: number;
  controlledSubstances: number;
  expiringSoon: number;
  requiresRefill: number;
  activeAlerts: number;
  administrationsToday: number;
  administrationsByType: Record<MedicationType, number>;
}

// Validation Schemas
export const MedicationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  genericName: z.string().optional(),
  brandName: z.string().optional(),
  ndc: z.string().optional(),
  type: z.enum(['prescription', 'over_the_counter', 'supplement', 'emergency', 'inhaler', 'epipen', 'insulin', 'controlled_substance']),
  status: z.enum(['active', 'discontinued', 'expired', 'on_hold', 'completed', 'cancelled']),
  strength: z.string().min(1),
  dosageForm: z.string().min(1),
  administrationRoute: z.enum(['oral', 'injection', 'topical', 'inhaled', 'nasal', 'rectal', 'sublingual', 'transdermal']),
  frequency: z.enum(['as_needed', 'once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'every_4_hours', 'every_6_hours', 'every_8_hours', 'every_12_hours', 'weekly', 'monthly', 'custom']),
  dosageInstructions: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().optional(),
  studentId: z.string().uuid(),
  createdBy: z.string().uuid(),
  isControlled: z.boolean(),
  requiresParentConsent: z.boolean(),
  requiresPhysicianOrder: z.boolean(),
});

export const MedicationAdministrationSchema = z.object({
  id: z.string().uuid(),
  medicationId: z.string().uuid(),
  studentId: z.string().uuid(),
  administeredBy: z.string().uuid(),
  administeredDate: z.date(),
  dosageGiven: z.string().min(1),
  administrationRoute: z.enum(['oral', 'injection', 'topical', 'inhaled', 'nasal', 'rectal', 'sublingual', 'transdermal']),
  administrationStatus: z.enum(['completed', 'refused', 'missed', 'partial']),
  adverseReaction: z.boolean().optional(),
});

export const MedicationFiltersSchema = z.object({
  studentId: z.string().uuid().optional(),
  type: z.array(z.enum(['prescription', 'over_the_counter', 'supplement', 'emergency', 'inhaler', 'epipen', 'insulin', 'controlled_substance'])).optional(),
  status: z.array(z.enum(['active', 'discontinued', 'expired', 'on_hold', 'completed', 'cancelled'])).optional(),
  administrationRoute: z.array(z.enum(['oral', 'injection', 'topical', 'inhaled', 'nasal', 'rectal', 'sublingual', 'transdermal'])).optional(),
  frequency: z.array(z.enum(['as_needed', 'once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'every_4_hours', 'every_6_hours', 'every_8_hours', 'every_12_hours', 'weekly', 'monthly', 'custom'])).optional(),
  searchQuery: z.string().optional(),
  isControlled: z.boolean().optional(),
});

// Utility Functions
export const medicationUtils = {
  // Status helpers
  isActive: (medication: Medication): boolean => 
    medication.status === 'active',
  
  isExpired: (medication: Medication): boolean => 
    medication.status === 'expired' || Boolean(medication.endDate && new Date() > medication.endDate),
  
  isExpiringSoon: (medication: Medication, days: number = 7): boolean => {
    if (!medication.endDate) return false;
    const daysUntilExpiration = Math.ceil((medication.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= days && daysUntilExpiration > 0;
  },
  
  requiresRefill: (medication: Medication, inventory?: MedicationInventory): boolean => {
    if (!inventory) return false;
    return inventory.quantityInStock <= inventory.minimumQuantity;
  },
  
  // Administration helpers
  isDue: (medication: Medication): boolean => {
    if (!medication.nextDue) return false;
    return new Date() >= medication.nextDue;
  },
  
  isOverdue: (medication: Medication, hours: number = 2): boolean => {
    if (!medication.nextDue) return false;
    const hoursOverdue = (new Date().getTime() - medication.nextDue.getTime()) / (1000 * 60 * 60);
    return hoursOverdue > hours;
  },
  
  getNextDueTime: (medication: Medication, lastAdministered?: Date): Date | null => {
    const baseDate = lastAdministered || medication.lastAdministered || medication.startDate;
    
    switch (medication.frequency) {
      case 'once_daily':
        return new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
      case 'twice_daily':
        return new Date(baseDate.getTime() + 12 * 60 * 60 * 1000);
      case 'three_times_daily':
        return new Date(baseDate.getTime() + 8 * 60 * 60 * 1000);
      case 'four_times_daily':
        return new Date(baseDate.getTime() + 6 * 60 * 60 * 1000);
      case 'every_4_hours':
        return new Date(baseDate.getTime() + 4 * 60 * 60 * 1000);
      case 'every_6_hours':
        return new Date(baseDate.getTime() + 6 * 60 * 60 * 1000);
      case 'every_8_hours':
        return new Date(baseDate.getTime() + 8 * 60 * 60 * 1000);
      case 'every_12_hours':
        return new Date(baseDate.getTime() + 12 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return null; // For 'as_needed' and 'custom'
    }
  },
  
  // Display formatting
  formatFrequency: (frequency: MedicationFrequency): string => {
    const frequencyMap = {
      as_needed: 'As Needed',
      once_daily: 'Once Daily',
      twice_daily: 'Twice Daily',
      three_times_daily: '3x Daily',
      four_times_daily: '4x Daily',
      every_4_hours: 'Every 4 Hours',
      every_6_hours: 'Every 6 Hours',
      every_8_hours: 'Every 8 Hours',
      every_12_hours: 'Every 12 Hours',
      weekly: 'Weekly',
      monthly: 'Monthly',
      custom: 'Custom Schedule',
    };
    return frequencyMap[frequency];
  },
  
  formatAdministrationRoute: (route: AdministrationRoute): string => {
    const routeMap = {
      oral: 'Oral',
      injection: 'Injection',
      topical: 'Topical',
      inhaled: 'Inhaled',
      nasal: 'Nasal',
      rectal: 'Rectal',
      sublingual: 'Sublingual',
      transdermal: 'Transdermal',
    };
    return routeMap[route];
  },
  
  formatDateTime: (date: Date): string => 
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
  
  // Status styling
  getStatusColor: (status: MedicationStatus): string => {
    const colors = {
      active: 'text-green-600 bg-green-50',
      discontinued: 'text-gray-600 bg-gray-50',
      expired: 'text-red-600 bg-red-50',
      on_hold: 'text-yellow-600 bg-yellow-50',
      completed: 'text-blue-600 bg-blue-50',
      cancelled: 'text-red-600 bg-red-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  },
  
  getTypeColor: (type: MedicationType): string => {
    const colors = {
      prescription: 'text-blue-600 bg-blue-50',
      over_the_counter: 'text-green-600 bg-green-50',
      supplement: 'text-purple-600 bg-purple-50',
      emergency: 'text-red-600 bg-red-50',
      inhaler: 'text-cyan-600 bg-cyan-50',
      epipen: 'text-orange-600 bg-orange-50',
      insulin: 'text-pink-600 bg-pink-50',
      controlled_substance: 'text-red-600 bg-red-50 border border-red-200',
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  },
  
  getAlertLevelColor: (level: AlertLevel): string => {
    const colors = {
      low: 'text-blue-600 bg-blue-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50',
    };
    return colors[level] || 'text-gray-600 bg-gray-50';
  },
  
  // Search and filtering
  matchesSearchQuery: (medication: Medication, query: string): boolean => {
    if (!query) return true;
    
    const searchText = query.toLowerCase();
    return Boolean(
      medication.name.toLowerCase().includes(searchText) ||
      (medication.genericName && medication.genericName.toLowerCase().includes(searchText)) ||
      (medication.brandName && medication.brandName.toLowerCase().includes(searchText)) ||
      medication.type.toLowerCase().includes(searchText) ||
      medication.status.toLowerCase().includes(searchText) ||
      (medication.notes && medication.notes.toLowerCase().includes(searchText))
    );
  },
  
  applyFilters: (medications: Medication[], filters: MedicationFilters): Medication[] => {
    return medications.filter(medication => {
      // Student filter
      if (filters.studentId && medication.studentId !== filters.studentId) {
        return false;
      }
      
      // Type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(medication.type)) {
          return false;
        }
      }
      
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(medication.status)) {
          return false;
        }
      }
      
      // Administration route filter
      if (filters.administrationRoute && filters.administrationRoute.length > 0) {
        if (!filters.administrationRoute.includes(medication.administrationRoute)) {
          return false;
        }
      }
      
      // Frequency filter
      if (filters.frequency && filters.frequency.length > 0) {
        if (!filters.frequency.includes(medication.frequency)) {
          return false;
        }
      }
      
      // Controlled substance filter
      if (filters.isControlled !== undefined && medication.isControlled !== filters.isControlled) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange) {
        const medicationDate = new Date(medication.startDate);
        if (medicationDate < filters.dateRange.startDate || medicationDate > filters.dateRange.endDate) {
          return false;
        }
      }
      
      // Search query
      if (filters.searchQuery && !medicationUtils.matchesSearchQuery(medication, filters.searchQuery)) {
        return false;
      }
      
      return true;
    });
  },
  
  // Summary calculations
  calculateSummary: (medications: Medication[], administrations: MedicationAdministration[] = []): MedicationSummary => {
    const active = medications.filter(m => medicationUtils.isActive(m));
    const controlled = medications.filter(m => m.isControlled);
    const expiringSoon = medications.filter(m => medicationUtils.isExpiringSoon(m));
    
    // Count administrations by type
    const administrationsByType = medications.reduce((acc, med) => {
      acc[med.type] = (acc[med.type] || 0) + 1;
      return acc;
    }, {} as Record<MedicationType, number>);
    
    // Administrations today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const administrationsToday = administrations.filter(admin => {
      const adminDate = new Date(admin.administeredDate);
      return adminDate >= today && adminDate < tomorrow;
    }).length;
    
    return {
      totalMedications: medications.length,
      activeMedications: active.length,
      controlledSubstances: controlled.length,
      expiringSoon: expiringSoon.length,
      requiresRefill: 0, // Would need inventory data to calculate
      activeAlerts: 0, // Would need alerts data to calculate
      administrationsToday,
      administrationsByType,
    };
  },
};

// Mock data for development
export const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Albuterol Inhaler',
    genericName: 'Albuterol Sulfate',
    brandName: 'ProAir HFA',
    ndc: '49502-497-17',
    type: 'inhaler',
    status: 'active',
    strength: '90 mcg',
    dosageForm: 'Metered Dose Inhaler',
    administrationRoute: 'inhaled',
    frequency: 'as_needed',
    dosageInstructions: '2 puffs as needed for asthma symptoms, not to exceed 8 puffs per day',
    maxDailyDose: 8,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-09-01'),
    studentId: 'student-1',
    createdBy: 'nurse-1',
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-01'),
    isControlled: false,
    requiresParentConsent: true,
    requiresPhysicianOrder: true,
    specialInstructions: 'Shake well before use. Rinse mouth after administration.',
    warnings: ['May cause nervousness, shakiness, or fast heartbeat'],
  },
  {
    id: '2',
    name: 'EpiPen Jr',
    genericName: 'Epinephrine',
    brandName: 'EpiPen Jr',
    type: 'epipen',
    status: 'active',
    strength: '0.15 mg',
    dosageForm: 'Auto-Injector',
    administrationRoute: 'injection',
    frequency: 'as_needed',
    dosageInstructions: 'Inject into outer thigh for severe allergic reactions. Call 911 immediately.',
    startDate: new Date('2024-08-15'),
    endDate: new Date('2025-08-15'),
    studentId: 'student-2',
    createdBy: 'nurse-2',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-15'),
    isControlled: false,
    requiresParentConsent: true,
    requiresPhysicianOrder: true,
    specialInstructions: 'Keep at room temperature. Do not refrigerate or freeze.',
    warnings: ['For emergency use only', 'May cause rapid heart rate and anxiety'],
    contraindications: ['No known contraindications in emergency situations'],
  },
];

export const mockMedicationAdministrations: MedicationAdministration[] = [
  {
    id: '1',
    medicationId: '1',
    studentId: 'student-1',
    administeredBy: 'nurse-1',
    administeredDate: new Date('2024-10-31T10:30:00'),
    dosageGiven: '2 puffs',
    administrationRoute: 'inhaled',
    administrationStatus: 'completed',
    parentNotified: true,
    notes: 'Student reported difficulty breathing during PE class',
    createdAt: new Date('2024-10-31T10:30:00'),
    updatedAt: new Date('2024-10-31T10:30:00'),
  },
];