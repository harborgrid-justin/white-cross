
export enum SubmittalType {
  SHOP_DRAWING = 'shop_drawing',
  PRODUCT_DATA = 'product_data',
  SAMPLE = 'sample',
  TEST_REPORT = 'test_report',
  MATERIAL_CERT = 'material_cert',
  OTHER = 'other',
}

export enum SubmittalStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  APPROVED_AS_NOTED = 'approved_as_noted',
  REVISE_RESUBMIT = 'revise_resubmit',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum SubmittalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ReviewAction {
  APPROVED = 'approved',
  APPROVED_AS_NOTED = 'approved_as_noted',
  REVISE_RESUBMIT = 'revise_resubmit',
  REJECTED = 'rejected',
  NO_EXCEPTION_TAKEN = 'no_exception_taken',
}

export enum WorkflowType {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  HYBRID = 'hybrid',
}

export enum WorkflowStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}
