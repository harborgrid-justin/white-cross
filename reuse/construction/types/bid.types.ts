
export enum BidSolicitationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  AWARDED = 'awarded',
}

export enum BidStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  WITHDRAWN = 'withdrawn',
  UNDER_EVALUATION = 'under_evaluation',
  QUALIFIED = 'qualified',
  DISQUALIFIED = 'disqualified',
  AWARDED = 'awarded',
  REJECTED = 'rejected',
}

export enum VendorQualificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CONDITIONAL = 'conditional',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum EvaluationCriteriaType {
  TECHNICAL = 'technical',
  FINANCIAL = 'financial',
  PAST_PERFORMANCE = 'past_performance',
  EXPERIENCE = 'experience',
  SCHEDULE = 'schedule',
  SAFETY = 'safety',
  QUALITY = 'quality',
}

export enum ProcurementMethod {
  COMPETITIVE_SEALED_BID = 'competitive_sealed_bid',
  COMPETITIVE_NEGOTIATION = 'competitive_negotiation',
  SMALL_PURCHASE = 'small_purchase',
  SOLE_SOURCE = 'sole_source',
  EMERGENCY = 'emergency',
}

export enum AwardMethod {
  LOWEST_RESPONSIVE_BID = 'lowest_responsive_bid',
  BEST_VALUE = 'best_value',
  QUALIFICATIONS_BASED = 'qualifications_based',
  TWO_STEP = 'two_step',
}
