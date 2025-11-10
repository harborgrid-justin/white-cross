
export enum SiteStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

export enum AccessLevel {
  FULL = 'full',
  RESTRICTED = 'restricted',
  ESCORT_REQUIRED = 'escort_required',
  PROHIBITED = 'prohibited',
}

export enum IncidentType {
  INJURY = 'injury',
  NEAR_MISS = 'near_miss',
  PROPERTY_DAMAGE = 'property_damage',
  ENVIRONMENTAL = 'environmental',
  SECURITY = 'security',
}

export enum IncidentSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
  FATALITY = 'fatality',
}

export enum InvestigationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum EmergencyType {
  FIRE = 'fire',
  MEDICAL = 'medical',
  WEATHER = 'weather',
  HAZMAT = 'hazmat',
  EVACUATION = 'evacuation',
  SECURITY = 'security',
}

export enum DelayType {
  WEATHER = 'weather',
  MATERIAL = 'material',
  EQUIPMENT = 'equipment',
  LABOR = 'labor',
  PERMIT = 'permit',
  DESIGN = 'design',
  OTHER = 'other',
}

export enum MeetingType {
  SAFETY = 'safety',
  COORDINATION = 'coordination',
  TOOLBOX = 'toolbox',
  PLANNING = 'planning',
  CLOSEOUT = 'closeout',
  OWNER = 'owner',
}

export enum ActionItemStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CommunicationType {
  EMAIL = 'email',
  PHONE = 'phone',
  MEETING = 'meeting',
  RFI = 'rfi',
  SUBMITTAL = 'submittal',
  CHANGE_ORDER = 'change_order',
  NOTICE = 'notice',
}

export enum CommunicationStatus {
  SENT = 'sent',
  RECEIVED = 'received',
  ACKNOWLEDGED = 'acknowledged',
  RESPONDED = 'responded',
  CLOSED = 'closed',
}

export enum SiteInspectionType {
  SAFETY = 'safety',
  QUALITY = 'quality',
  PROGRESS = 'progress',
  COMPLIANCE = 'compliance',
  FINAL = 'final',
}

export enum SiteInspectionStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  CONDITIONAL = 'conditional',
  PENDING = 'pending',
}

export enum DeficiencySeverity {
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical',
}

export enum DeficiencyStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  VERIFIED = 'verified',
}

export enum EquipmentStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  IDLE = 'idle',
  REMOVED = 'removed',
}

export enum MaintenanceType {
  INSPECTION = 'inspection',
  REPAIR = 'repair',
  SERVICE = 'service',
  CALIBRATION = 'calibration',
}
