
export enum ChangeRequestStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  IMPACT_ANALYSIS = 'impact_analysis',
  PRICING = 'pricing',
  NEGOTIATION = 'negotiation',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  EXECUTED = 'executed',
}

export enum ChangeOrderType {
  OWNER_INITIATED = 'owner_initiated',
  CONTRACTOR_PROPOSED = 'contractor_proposed',
  ARCHITECT_DIRECTED = 'architect_directed',
  DESIGN_ERROR = 'design_error',
  UNFORESEEN_CONDITIONS = 'unforeseen_conditions',
  REGULATORY_REQUIREMENT = 'regulatory_requirement',
  VALUE_ENGINEERING = 'value_engineering',
  SCHEDULE_DRIVEN = 'schedule_driven',
}

export enum ChangeCategory {
  SCOPE_ADDITION = 'scope_addition',
  SCOPE_DELETION = 'scope_deletion',
  SCOPE_MODIFICATION = 'scope_modification',
  MATERIAL_SUBSTITUTION = 'material_substitution',
  DESIGN_CLARIFICATION = 'design_clarification',
  SCHEDULE_ACCELERATION = 'schedule_acceleration',
  SCHEDULE_EXTENSION = 'schedule_extension',
  QUALITY_IMPROVEMENT = 'quality_improvement',
  COST_REDUCTION = 'cost_reduction',
}

export enum ImpactSeverity {
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  SIGNIFICANT = 'significant',
  CRITICAL = 'critical',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DEFERRED = 'deferred',
}

export enum PricingMethod {
  LUMP_SUM = 'lump_sum',
  UNIT_PRICE = 'unit_price',
  TIME_AND_MATERIALS = 'time_and_materials',
  COST_PLUS = 'cost_plus',
  NOT_TO_EXCEED = 'not_to_exceed',
}
