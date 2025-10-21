/**
 * Administration Domain Types
 * 
 * Type definitions for administrative functionality including
 * organizational management, reporting, and system configuration.
 */

// ==========================================
// ORGANIZATIONAL TYPES
// ==========================================

/**
 * District information
 */
export interface District {
  id: string;
  name: string;
  code: string;
  address: string;
  contactInfo: ContactInfo;
  isActive: boolean;
  settings: DistrictSettings;
}

/**
 * School information
 */
export interface School {
  id: string;
  districtId: string;
  name: string;
  code: string;
  address: string;
  contactInfo: ContactInfo;
  gradeRange: GradeRange;
  isActive: boolean;
  settings: SchoolSettings;
}

/**
 * Contact information
 */
export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

/**
 * Grade range
 */
export interface GradeRange {
  lowest: string;
  highest: string;
}

/**
 * District settings
 */
export interface DistrictSettings {
  timezone: string;
  language: string;
  complianceSettings: ComplianceSettings;
}

/**
 * School settings
 */
export interface SchoolSettings {
  nurseSchedule: Schedule[];
  emergencyContacts: EmergencyContact[];
  medicationPolicies: MedicationPolicy[];
}

// ==========================================
// POLICY TYPES
// ==========================================

/**
 * Schedule entry
 */
export interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

/**
 * Emergency contact
 */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

/**
 * Medication policy
 */
export interface MedicationPolicy {
  type: string;
  requiresParentConsent: boolean;
  nurseAdministrationRequired: boolean;
  storageRequirements: string[];
}

/**
 * Compliance settings
 */
export interface ComplianceSettings {
  hipaaSettings: HIPAASettings;
  ferpaSettings: FERPASettings;
  stateRegulations: StateRegulation[];
}

/**
 * HIPAA settings
 */
export interface HIPAASettings {
  auditLoggingEnabled: boolean;
  dataRetentionPeriod: number;
  encryptionRequired: boolean;
  accessControlEnabled: boolean;
}

/**
 * FERPA settings
 */
export interface FERPASettings {
  directoryInformationOptOut: boolean;
  parentalConsentRequired: boolean;
  recordAccessLogging: boolean;
}

/**
 * State regulation
 */
export interface StateRegulation {
  state: string;
  regulationType: string;
  requirements: string[];
  complianceDeadline?: Date;
}

// ==========================================
// REPORTING TYPES
// ==========================================

/**
 * Report type
 */
export type ReportType = 
  | 'incident_summary'
  | 'medication_compliance'
  | 'appointment_statistics'
  | 'health_trends'
  | 'compliance_audit'
  | 'user_activity'
  | 'system_performance';

/**
 * Report format
 */
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json';

/**
 * Report frequency
 */
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand';

/**
 * Report configuration
 */
export interface ReportConfig {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  frequency: ReportFrequency;
  parameters: Record<string, any>;
  recipients: string[];
  isActive: boolean;
}

// ==========================================
// INVENTORY TYPES
// ==========================================

/**
 * Inventory item type
 */
export type InventoryItemType = 
  | 'medication'
  | 'medical_supply'
  | 'first_aid'
  | 'equipment'
  | 'consumable'
  | 'other';

/**
 * Inventory item
 */
export interface InventoryItem {
  id: string;
  name: string;
  type: InventoryItemType;
  description?: string;
  sku?: string;
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  expirationDate?: Date;
  supplier?: string;
  location: string;
}

/**
 * Inventory alert type
 */
export type InventoryAlertType = 'low_stock' | 'expiring' | 'expired' | 'overstock';

/**
 * Inventory alert
 */
export interface InventoryAlert {
  id: string;
  itemId: string;
  type: InventoryAlertType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  createdAt: Date;
  isResolved: boolean;
}

// ==========================================
// STATISTICS TYPES
// ==========================================

/**
 * Administration statistics
 */
export interface AdministrationStats {
  totalDistricts: number;
  totalSchools: number;
  totalUsers: number;
  activeUsers: number;
}

/**
 * Inventory overview
 */
export interface InventoryOverview {
  totalItems: number;
  lowStockItems: number;
  expiringItems: number;
  value: number;
}

/**
 * Report analytics
 */
export interface ReportAnalytics {
  totalReports: number;
  recentReports: number;
  reportsByType: Record<string, number>;
}

// ==========================================
// HOOK RETURN TYPES
// ==========================================

/**
 * Administration overview hook return type
 */
export interface UseAdministrationOverviewReturn {
  stats: AdministrationStats;
  hierarchy: Record<string, any>;
}

/**
 * Inventory management hook return type
 */
export interface UseInventoryManagementReturn {
  overview: InventoryOverview;
  needsAttention: boolean;
}

/**
 * Report analytics hook return type
 */
export interface UseReportAnalyticsReturn {
  analytics: ReportAnalytics;
}