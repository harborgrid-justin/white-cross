
export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
  CLOSED = 'closed',
}

export enum ContractType {
  LUMP_SUM = 'lump_sum',
  UNIT_PRICE = 'unit_price',
  COST_PLUS = 'cost_plus',
  TIME_AND_MATERIALS = 'time_and_materials',
  GUARANTEED_MAXIMUM_PRICE = 'guaranteed_maximum_price',
  DESIGN_BUILD = 'design_build',
}

export enum PaymentStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
}

export enum AmendmentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXECUTED = 'executed',
}

export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
  OVERDUE = 'overdue',
}

export enum InsuranceType {
  GENERAL_LIABILITY = 'general_liability',
  WORKERS_COMPENSATION = 'workers_compensation',
  PROFESSIONAL_LIABILITY = 'professional_liability',
  BUILDERS_RISK = 'builders_risk',
  UMBRELLA = 'umbrella',
  AUTO = 'auto',
}

export enum BondType {
  BID_BOND = 'bid_bond',
  PERFORMANCE_BOND = 'performance_bond',
  PAYMENT_BOND = 'payment_bond',
  MAINTENANCE_BOND = 'maintenance_bond',
}

export enum ContractDocumentType {
  CONTRACT_AGREEMENT = 'contract_agreement',
  GENERAL_CONDITIONS = 'general_conditions',
  SPECIAL_CONDITIONS = 'special_conditions',
  TECHNICAL_SPECIFICATIONS = 'technical_specifications',
  DRAWINGS = 'drawings',
  ADDENDUM = 'addendum',
  AMENDMENT = 'amendment',
  EXHIBIT = 'exhibit',
}
