
export enum LaborCraft {
  CARPENTER = 'carpenter',
  ELECTRICIAN = 'electrician',
  PLUMBER = 'plumber',
  HVAC_TECHNICIAN = 'hvac_technician',
  MASON = 'mason',
  IRONWORKER = 'ironworker',
  LABORER = 'laborer',
  EQUIPMENT_OPERATOR = 'equipment_operator',
  FOREMAN = 'foreman',
  SUPERINTENDENT = 'superintendent',
  SAFETY_OFFICER = 'safety_officer',
}

export enum ShiftType {
  DAY = 'day',
  NIGHT = 'night',
  SWING = 'swing',
  OVERTIME = 'overtime',
  WEEKEND = 'weekend',
}

export enum TimesheetStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CERTIFIED = 'certified',
}

export enum PayrollType {
  REGULAR = 'regular',
  OVERTIME = 'overtime',
  DOUBLE_TIME = 'double_time',
  PREVAILING_WAGE = 'prevailing_wage',
}

export enum UnionStatus {
  UNION = 'union',
  NON_UNION = 'non_union',
  APPRENTICE = 'apprentice',
}

export enum CertificationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
