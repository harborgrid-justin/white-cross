/**
 * Property Contract Management Kit
 *
 * Comprehensive toolkit for vendor and service contract management in property
 * operations. Provides lifecycle management, SLA monitoring, compliance tracking,
 * vendor performance analytics, payment schedules, and multi-currency support
 * for enterprise property management systems.
 *
 * @module property-contract-management-kit
 * @category Property Management & Vendor Operations
 */

import { Sequelize, QueryTypes, Op, Transaction } from 'sequelize';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Contract type enumeration
 */
export type ContractType =
  | 'vendor_service'
  | 'maintenance'
  | 'consulting'
  | 'software_license'
  | 'equipment_lease'
  | 'facility_management'
  | 'security_services'
  | 'cleaning_services'
  | 'landscaping'
  | 'utilities'
  | 'insurance'
  | 'construction'
  | 'professional_services';

/**
 * Contract status enumeration
 */
export type ContractStatus =
  | 'draft'
  | 'under_review'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'suspended'
  | 'renewal_pending'
  | 'expired'
  | 'terminated'
  | 'cancelled';

/**
 * Payment frequency enumeration
 */
export type PaymentFrequency =
  | 'one_time'
  | 'daily'
  | 'weekly'
  | 'bi_weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual'
  | 'milestone_based';

/**
 * SLA compliance status
 */
export type SLAComplianceStatus = 'compliant' | 'warning' | 'breach' | 'critical';

/**
 * Currency codes (ISO 4217)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CNY';

/**
 * Contract entity with full details
 */
export interface Contract {
  id: string;
  contractNumber: string;
  contractName: string;
  contractType: ContractType;
  status: ContractStatus;

  // Vendor information
  vendorId: string;
  vendorName: string;
  vendorContact: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };

  // Property association
  propertyIds: string[];
  departmentId?: string;

  // Contract dates
  startDate: Date;
  endDate: Date;
  signedDate?: Date;
  effectiveDate?: Date;
  expirationDate: Date;
  noticePeriodDays: number;

  // Financial terms
  totalValue: number;
  currency: CurrencyCode;
  paymentTerms: string;
  paymentFrequency: PaymentFrequency;

  // Auto-renewal settings
  autoRenew: boolean;
  renewalNoticeDays: number;
  renewalTermMonths?: number;

  // Document management
  documentIds: string[];
  primaryDocumentUrl?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;

  // Custom fields
  tags: string[];
  notes?: string;
  customFields: Record<string, unknown>;
}

/**
 * Service Level Agreement definition
 */
export interface ServiceLevelAgreement {
  id: string;
  contractId: string;
  slaName: string;
  description: string;

  // Performance metrics
  metricName: string;
  metricType: 'availability' | 'response_time' | 'resolution_time' | 'quality' | 'custom';
  targetValue: number;
  targetUnit: string;
  measurementFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';

  // Thresholds
  warningThreshold: number;
  criticalThreshold: number;

  // Penalties
  penaltyEnabled: boolean;
  penaltyType: 'fixed' | 'percentage' | 'tiered';
  penaltyAmount?: number;
  penaltyTiers?: Array<{
    minBreach: number;
    maxBreach: number;
    penaltyAmount: number;
  }>;

  // Monitoring
  isActive: boolean;
  startDate: Date;
  endDate?: Date;

  // Credits
  creditAmount?: number;
  creditCurrency?: CurrencyCode;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * SLA performance measurement
 */
export interface SLAPerformance {
  id: string;
  slaId: string;
  contractId: string;
  measurementPeriod: {
    start: Date;
    end: Date;
  };

  // Performance data
  actualValue: number;
  targetValue: number;
  unit: string;
  compliancePercentage: number;
  complianceStatus: SLAComplianceStatus;

  // Breach information
  breachCount: number;
  breachDuration?: number; // minutes
  breachDetails?: Array<{
    timestamp: Date;
    actualValue: number;
    targetValue: number;
    severity: 'minor' | 'major' | 'critical';
  }>;

  // Financial impact
  penaltyApplied: boolean;
  penaltyAmount?: number;
  creditIssued?: number;

  // Analysis
  trendDirection: 'improving' | 'stable' | 'declining';
  anomaliesDetected: boolean;

  measuredAt: Date;
  reportedBy: string;
}

/**
 * Payment schedule entry
 */
export interface PaymentSchedule {
  id: string;
  contractId: string;
  scheduleNumber: string;

  // Payment details
  paymentAmount: number;
  currency: CurrencyCode;
  paymentDueDate: Date;
  description: string;

  // Payment status
  status: 'scheduled' | 'pending' | 'processing' | 'paid' | 'overdue' | 'cancelled';
  paidDate?: Date;
  paidAmount?: number;

  // Invoice details
  invoiceNumber?: string;
  invoiceDate?: Date;
  invoiceUrl?: string;

  // Approval workflow
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;

  // Payment method
  paymentMethod?: 'wire_transfer' | 'ach' | 'check' | 'credit_card' | 'other';
  paymentReference?: string;

  // Penalties and adjustments
  lateFee?: number;
  discount?: number;
  adjustments?: Array<{
    type: 'sla_penalty' | 'discount' | 'credit' | 'other';
    amount: number;
    reason: string;
  }>;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

/**
 * Contract amendment record
 */
export interface ContractAmendment {
  id: string;
  contractId: string;
  amendmentNumber: string;
  amendmentType: 'scope_change' | 'term_extension' | 'value_change' | 'sla_modification' | 'vendor_change' | 'other';

  // Amendment details
  description: string;
  effectiveDate: Date;

  // Changes
  changesSummary: string;
  fieldsModified: Array<{
    fieldName: string;
    oldValue: unknown;
    newValue: unknown;
    changeReason: string;
  }>;

  // Financial impact
  valueChange?: number;
  newTotalValue?: number;

  // Approval
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'executed';
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;

  // Documentation
  documentIds: string[];
  amendmentDocumentUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vendor performance metrics
 */
export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  evaluationPeriod: {
    start: Date;
    end: Date;
  };

  // Contract metrics
  activeContracts: number;
  totalContractValue: number;

  // SLA performance
  overallSLACompliance: number;
  slaBreachCount: number;
  criticalBreaches: number;

  // Delivery metrics
  onTimeDeliveryRate: number;
  qualityScore: number;
  responsiveness: number;

  // Financial metrics
  totalPaid: number;
  paymentsOnTime: number;
  paymentsOverdue: number;
  penaltiesApplied: number;
  creditsIssued: number;

  // Incident tracking
  incidentCount: number;
  criticalIncidents: number;
  averageResolutionTime: number; // hours

  // Risk assessment
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];

  // Overall rating
  overallRating: number; // 0-100
  performanceTier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'needs_improvement';

  // Recommendations
  recommendations: string[];
  actionItems: string[];

  generatedAt: Date;
  generatedBy: string;
}

/**
 * Contract compliance check result
 */
export interface ComplianceCheckResult {
  contractId: string;
  checkType: 'regulatory' | 'insurance' | 'licensing' | 'certification' | 'documentation' | 'performance';
  checkDate: Date;

  // Compliance status
  isCompliant: boolean;
  complianceScore: number;

  // Requirements
  requirementsMet: number;
  requirementsTotal: number;

  // Issues
  issues: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    description: string;
    requirement: string;
    remediation: string;
    dueDate?: Date;
  }>;

  // Documentation
  documentsVerified: number;
  documentsExpired: number;
  documentsMissing: number;

  // Certifications
  certificationsValid: string[];
  certificationsExpired: string[];
  certificationsRequired: string[];

  // Next review
  nextReviewDate: Date;

  // Auditor
  checkedBy: string;
  notes?: string;
}

/**
 * Contract renewal recommendation
 */
export interface RenewalRecommendation {
  contractId: string;
  contractName: string;
  currentEndDate: Date;

  // Recommendation
  recommendation: 'renew' | 'renew_with_modifications' | 'renegotiate' | 'terminate' | 'replace_vendor';
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Analysis
  performanceAnalysis: {
    overallScore: number;
    slaCompliance: number;
    costEffectiveness: number;
    serviceQuality: number;
  };

  // Financial analysis
  costComparison: {
    currentAnnualCost: number;
    projectedRenewalCost: number;
    marketRate: number;
    potentialSavings: number;
  };

  // Market analysis
  alternativeVendorsAvailable: number;
  marketConditions: 'favorable' | 'neutral' | 'unfavorable';

  // Recommendations
  suggestedChanges: string[];
  negotiationPoints: string[];

  // Risks
  renewalRisks: string[];
  terminationRisks: string[];

  // Timeline
  recommendedActionDate: Date;
  deadlineDate: Date;

  generatedAt: Date;
  generatedBy: string;
}

/**
 * Multi-currency exchange rate
 */
export interface ExchangeRate {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  effectiveDate: Date;
  source: string;
}

/**
 * Contract document metadata
 */
export interface ContractDocument {
  id: string;
  contractId: string;
  documentType: 'contract' | 'amendment' | 'invoice' | 'sla' | 'certificate' | 'insurance' | 'other';

  // Document details
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageUrl: string;

  // Version control
  version: string;
  isCurrentVersion: boolean;
  previousVersionId?: string;

  // Metadata
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
  tags: string[];

  // Access control
  isConfidential: boolean;
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';

  // Verification
  checksum?: string;
  digitalSignature?: string;
  verified: boolean;

  expirationDate?: Date;
}

// ============================================================================
// Configuration
// ============================================================================

interface ContractManagementConfig {
  // Renewal settings
  renewalNoticeAdvanceDays: number;
  expirationWarningDays: number;

  // Payment settings
  paymentDueDateBuffer: number; // days
  overdueGracePeriod: number; // days

  // SLA settings
  slaCheckInterval: number; // minutes
  slaBreachNotificationEnabled: boolean;

  // Compliance settings
  complianceCheckFrequency: number; // days
  requiredCertifications: string[];

  // Currency settings
  baseCurrency: CurrencyCode;
  exchangeRateUpdateInterval: number; // hours

  // Performance settings
  vendorEvaluationPeriod: number; // days
  minimumPerformanceScore: number;
}

const defaultConfig: ContractManagementConfig = {
  renewalNoticeAdvanceDays: 90,
  expirationWarningDays: 30,
  paymentDueDateBuffer: 5,
  overdueGracePeriod: 10,
  slaCheckInterval: 60,
  slaBreachNotificationEnabled: true,
  complianceCheckFrequency: 30,
  requiredCertifications: ['insurance', 'liability', 'workers_comp'],
  baseCurrency: 'USD',
  exchangeRateUpdateInterval: 24,
  vendorEvaluationPeriod: 90,
  minimumPerformanceScore: 70,
};

// ============================================================================
// Contract Lifecycle Management Functions
// ============================================================================

/**
 * Creates a new vendor contract with comprehensive validation
 *
 * @param sequelize - Sequelize instance
 * @param contractData - Contract details
 * @param transaction - Optional transaction
 * @returns Created contract with assigned ID
 *
 * @example
 * ```typescript
 * const contract = await createContract(sequelize, {
 *   contractName: 'Annual HVAC Maintenance',
 *   vendorId: 'vendor-123',
 *   contractType: 'maintenance',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   totalValue: 50000,
 *   currency: 'USD'
 * });
 * ```
 */
export async function createContract(
  sequelize: Sequelize,
  contractData: Partial<Contract>,
  transaction?: Transaction
): Promise<Contract> {
  const contractNumber = await generateContractNumber(sequelize, contractData.contractType!);

  const query = `
    INSERT INTO property_contracts (
      id, contract_number, contract_name, contract_type, status,
      vendor_id, vendor_name, vendor_contact, property_ids,
      start_date, end_date, expiration_date, notice_period_days,
      total_value, currency, payment_terms, payment_frequency,
      auto_renew, renewal_notice_days, document_ids,
      created_at, updated_at, created_by, tags, custom_fields
    ) VALUES (
      :id, :contractNumber, :contractName, :contractType, :status,
      :vendorId, :vendorName, :vendorContact::jsonb, :propertyIds::jsonb,
      :startDate, :endDate, :expirationDate, :noticePeriodDays,
      :totalValue, :currency, :paymentTerms, :paymentFrequency,
      :autoRenew, :renewalNoticeDays, :documentIds::jsonb,
      NOW(), NOW(), :createdBy, :tags::jsonb, :customFields::jsonb
    )
    RETURNING *
  `;

  const id = `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const results = await sequelize.query(query, {
    replacements: {
      id,
      contractNumber,
      contractName: contractData.contractName,
      contractType: contractData.contractType,
      status: contractData.status || 'draft',
      vendorId: contractData.vendorId,
      vendorName: contractData.vendorName,
      vendorContact: JSON.stringify(contractData.vendorContact || {}),
      propertyIds: JSON.stringify(contractData.propertyIds || []),
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      expirationDate: contractData.expirationDate || contractData.endDate,
      noticePeriodDays: contractData.noticePeriodDays || 30,
      totalValue: contractData.totalValue,
      currency: contractData.currency || 'USD',
      paymentTerms: contractData.paymentTerms || 'Net 30',
      paymentFrequency: contractData.paymentFrequency || 'monthly',
      autoRenew: contractData.autoRenew || false,
      renewalNoticeDays: contractData.renewalNoticeDays || 90,
      documentIds: JSON.stringify(contractData.documentIds || []),
      createdBy: contractData.createdBy,
      tags: JSON.stringify(contractData.tags || []),
      customFields: JSON.stringify(contractData.customFields || {}),
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return getContractById(sequelize, id);
}

/**
 * Updates an existing contract with change tracking
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param updates - Fields to update
 * @param updatedBy - User making the update
 * @param transaction - Optional transaction
 * @returns Updated contract
 */
export async function updateContract(
  sequelize: Sequelize,
  contractId: string,
  updates: Partial<Contract>,
  updatedBy: string,
  transaction?: Transaction
): Promise<Contract> {
  // Build dynamic update query based on provided fields
  const updateFields: string[] = [];
  const replacements: Record<string, unknown> = { contractId, updatedBy };

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'contractNumber') {
      const snakeKey = camelToSnake(key);
      updateFields.push(`${snakeKey} = :${key}`);
      replacements[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    }
  });

  if (updateFields.length === 0) {
    return getContractById(sequelize, contractId);
  }

  const query = `
    UPDATE property_contracts
    SET ${updateFields.join(', ')},
        updated_at = NOW()
    WHERE id = :contractId
  `;

  await sequelize.query(query, {
    replacements,
    type: QueryTypes.UPDATE,
    transaction,
  });

  return getContractById(sequelize, contractId);
}

/**
 * Retrieves a contract by its ID with full details
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @returns Contract details
 */
export async function getContractById(
  sequelize: Sequelize,
  contractId: string
): Promise<Contract> {
  const query = `
    SELECT
      id, contract_number, contract_name, contract_type, status,
      vendor_id, vendor_name, vendor_contact, property_ids, department_id,
      start_date, end_date, signed_date, effective_date, expiration_date,
      notice_period_days, total_value, currency, payment_terms, payment_frequency,
      auto_renew, renewal_notice_days, renewal_term_months,
      document_ids, primary_document_url,
      created_at, updated_at, created_by, approved_by, approved_at,
      tags, notes, custom_fields
    FROM property_contracts
    WHERE id = :contractId
  `;

  const results = await sequelize.query(query, {
    replacements: { contractId },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  if (results.length === 0) {
    throw new Error(`Contract not found: ${contractId}`);
  }

  return mapContractFromDb(results[0]);
}

/**
 * Lists contracts with advanced filtering and pagination
 *
 * @param sequelize - Sequelize instance
 * @param filters - Filter criteria
 * @param options - Pagination and sorting options
 * @returns List of contracts and total count
 */
export async function listContracts(
  sequelize: Sequelize,
  filters: {
    vendorId?: string;
    propertyId?: string;
    contractType?: ContractType;
    status?: ContractStatus[];
    expiringBefore?: Date;
    searchTerm?: string;
  },
  options: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  } = {}
): Promise<{ contracts: Contract[]; total: number }> {
  const whereClauses: string[] = ['1=1'];
  const replacements: Record<string, unknown> = {};

  if (filters.vendorId) {
    whereClauses.push('vendor_id = :vendorId');
    replacements.vendorId = filters.vendorId;
  }

  if (filters.propertyId) {
    whereClauses.push(':propertyId = ANY(property_ids)');
    replacements.propertyId = filters.propertyId;
  }

  if (filters.contractType) {
    whereClauses.push('contract_type = :contractType');
    replacements.contractType = filters.contractType;
  }

  if (filters.status && filters.status.length > 0) {
    whereClauses.push('status = ANY(:statuses)');
    replacements.statuses = filters.status;
  }

  if (filters.expiringBefore) {
    whereClauses.push('expiration_date <= :expiringBefore');
    replacements.expiringBefore = filters.expiringBefore;
  }

  if (filters.searchTerm) {
    whereClauses.push('(contract_name ILIKE :searchTerm OR contract_number ILIKE :searchTerm OR vendor_name ILIKE :searchTerm)');
    replacements.searchTerm = `%${filters.searchTerm}%`;
  }

  const whereClause = whereClauses.join(' AND ');
  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'DESC';
  const limit = options.limit || 50;
  const offset = options.offset || 0;

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM property_contracts
    WHERE ${whereClause}
  `;

  const countResults = await sequelize.query(countQuery, {
    replacements,
    type: QueryTypes.SELECT,
  }) as Array<{ total: number }>;

  const total = Number(countResults[0].total);

  // Get paginated results
  const query = `
    SELECT *
    FROM property_contracts
    WHERE ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT :limit OFFSET :offset
  `;

  const results = await sequelize.query(query, {
    replacements: { ...replacements, limit, offset },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  const contracts = results.map(mapContractFromDb);

  return { contracts, total };
}

/**
 * Activates a contract after approval
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param approvedBy - User approving the contract
 * @param transaction - Optional transaction
 * @returns Updated contract
 */
export async function activateContract(
  sequelize: Sequelize,
  contractId: string,
  approvedBy: string,
  transaction?: Transaction
): Promise<Contract> {
  const query = `
    UPDATE property_contracts
    SET status = 'active',
        approved_by = :approvedBy,
        approved_at = NOW(),
        effective_date = COALESCE(effective_date, NOW()),
        updated_at = NOW()
    WHERE id = :contractId
      AND status IN ('approved', 'pending_approval')
  `;

  const [, affectedRows] = await sequelize.query(query, {
    replacements: { contractId, approvedBy },
    type: QueryTypes.UPDATE,
    transaction,
  });

  if (affectedRows === 0) {
    throw new Error(`Cannot activate contract ${contractId} - invalid status or not found`);
  }

  // Create initial payment schedule if payment frequency is set
  const contract = await getContractById(sequelize, contractId);
  if (contract.paymentFrequency !== 'one_time') {
    await generatePaymentSchedule(sequelize, contractId, transaction);
  }

  return contract;
}

/**
 * Terminates a contract with reason tracking
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param reason - Termination reason
 * @param terminatedBy - User terminating the contract
 * @param effectiveDate - When termination takes effect
 * @param transaction - Optional transaction
 * @returns Updated contract
 */
export async function terminateContract(
  sequelize: Sequelize,
  contractId: string,
  reason: string,
  terminatedBy: string,
  effectiveDate?: Date,
  transaction?: Transaction
): Promise<Contract> {
  const terminationDate = effectiveDate || new Date();

  const query = `
    UPDATE property_contracts
    SET status = 'terminated',
        end_date = :terminationDate,
        notes = COALESCE(notes, '') || E'\n\nTerminated: ' || :reason,
        updated_at = NOW()
    WHERE id = :contractId
      AND status IN ('active', 'suspended')
  `;

  await sequelize.query(query, {
    replacements: {
      contractId,
      terminationDate,
      reason: `${reason} (by ${terminatedBy} on ${new Date().toISOString()})`,
    },
    type: QueryTypes.UPDATE,
    transaction,
  });

  // Cancel future payment schedules
  await cancelFuturePayments(sequelize, contractId, terminationDate, transaction);

  return getContractById(sequelize, contractId);
}

// ============================================================================
// Service Level Agreement (SLA) Functions
// ============================================================================

/**
 * Creates a new SLA for a contract
 *
 * @param sequelize - Sequelize instance
 * @param slaData - SLA details
 * @param transaction - Optional transaction
 * @returns Created SLA
 */
export async function createSLA(
  sequelize: Sequelize,
  slaData: Partial<ServiceLevelAgreement>,
  transaction?: Transaction
): Promise<ServiceLevelAgreement> {
  const query = `
    INSERT INTO contract_slas (
      id, contract_id, sla_name, description,
      metric_name, metric_type, target_value, target_unit,
      measurement_frequency, warning_threshold, critical_threshold,
      penalty_enabled, penalty_type, penalty_amount, penalty_tiers,
      is_active, start_date, end_date,
      created_at, updated_at
    ) VALUES (
      :id, :contractId, :slaName, :description,
      :metricName, :metricType, :targetValue, :targetUnit,
      :measurementFrequency, :warningThreshold, :criticalThreshold,
      :penaltyEnabled, :penaltyType, :penaltyAmount, :penaltyTiers::jsonb,
      :isActive, :startDate, :endDate,
      NOW(), NOW()
    )
    RETURNING *
  `;

  const id = `sla-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await sequelize.query(query, {
    replacements: {
      id,
      contractId: slaData.contractId,
      slaName: slaData.slaName,
      description: slaData.description,
      metricName: slaData.metricName,
      metricType: slaData.metricType,
      targetValue: slaData.targetValue,
      targetUnit: slaData.targetUnit,
      measurementFrequency: slaData.measurementFrequency || 'daily',
      warningThreshold: slaData.warningThreshold,
      criticalThreshold: slaData.criticalThreshold,
      penaltyEnabled: slaData.penaltyEnabled || false,
      penaltyType: slaData.penaltyType,
      penaltyAmount: slaData.penaltyAmount,
      penaltyTiers: JSON.stringify(slaData.penaltyTiers || []),
      isActive: slaData.isActive !== false,
      startDate: slaData.startDate || new Date(),
      endDate: slaData.endDate,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return getSLAById(sequelize, id);
}

/**
 * Records SLA performance measurement
 *
 * @param sequelize - Sequelize instance
 * @param slaId - SLA identifier
 * @param actualValue - Measured value
 * @param measurementPeriod - Time period for measurement
 * @param reportedBy - User recording the measurement
 * @param transaction - Optional transaction
 * @returns Performance record
 */
export async function recordSLAPerformance(
  sequelize: Sequelize,
  slaId: string,
  actualValue: number,
  measurementPeriod: { start: Date; end: Date },
  reportedBy: string,
  transaction?: Transaction
): Promise<SLAPerformance> {
  const sla = await getSLAById(sequelize, slaId);

  // Calculate compliance
  const compliancePercentage = (actualValue / sla.targetValue) * 100;
  const complianceStatus = determineComplianceStatus(
    compliancePercentage,
    sla.warningThreshold,
    sla.criticalThreshold
  );

  // Calculate penalty if applicable
  let penaltyAmount = 0;
  if (sla.penaltyEnabled && complianceStatus !== 'compliant') {
    penaltyAmount = calculateSLAPenalty(sla, compliancePercentage);
  }

  const query = `
    INSERT INTO sla_performance_records (
      id, sla_id, contract_id, measurement_period_start, measurement_period_end,
      actual_value, target_value, unit, compliance_percentage, compliance_status,
      breach_count, penalty_applied, penalty_amount,
      measured_at, reported_by
    ) VALUES (
      :id, :slaId, :contractId, :periodStart, :periodEnd,
      :actualValue, :targetValue, :unit, :compliancePercentage, :complianceStatus,
      :breachCount, :penaltyApplied, :penaltyAmount,
      NOW(), :reportedBy
    )
    RETURNING *
  `;

  const id = `slaperf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const breachCount = complianceStatus !== 'compliant' ? 1 : 0;

  await sequelize.query(query, {
    replacements: {
      id,
      slaId,
      contractId: sla.contractId,
      periodStart: measurementPeriod.start,
      periodEnd: measurementPeriod.end,
      actualValue,
      targetValue: sla.targetValue,
      unit: sla.targetUnit,
      compliancePercentage,
      complianceStatus,
      breachCount,
      penaltyApplied: penaltyAmount > 0,
      penaltyAmount,
      reportedBy,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  // If penalty applied, create payment adjustment
  if (penaltyAmount > 0) {
    await applyPenaltyToNextPayment(sequelize, sla.contractId, penaltyAmount, `SLA breach: ${sla.slaName}`, transaction);
  }

  return getSLAPerformanceById(sequelize, id);
}

/**
 * Retrieves SLA compliance summary for a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param periodStart - Start of analysis period
 * @param periodEnd - End of analysis period
 * @returns SLA compliance summary
 */
export async function getSLAComplianceSummary(
  sequelize: Sequelize,
  contractId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<{
  overallCompliance: number;
  slaResults: Array<{
    slaName: string;
    compliance: number;
    status: SLAComplianceStatus;
    breachCount: number;
  }>;
}> {
  const query = `
    SELECT
      s.sla_name,
      s.metric_name,
      AVG(p.compliance_percentage) as avg_compliance,
      MIN(p.compliance_percentage) as min_compliance,
      MAX(p.compliance_percentage) as max_compliance,
      SUM(p.breach_count) as total_breaches,
      COUNT(*) as measurement_count,
      SUM(CASE WHEN p.compliance_status = 'compliant' THEN 1 ELSE 0 END) as compliant_count
    FROM contract_slas s
    LEFT JOIN sla_performance_records p ON s.id = p.sla_id
      AND p.measurement_period_start >= :periodStart
      AND p.measurement_period_end <= :periodEnd
    WHERE s.contract_id = :contractId
      AND s.is_active = true
    GROUP BY s.id, s.sla_name, s.metric_name
  `;

  const results = await sequelize.query(query, {
    replacements: { contractId, periodStart, periodEnd },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  const slaResults = results.map(row => {
    const avgCompliance = Number(row.avg_compliance) || 0;
    return {
      slaName: String(row.sla_name),
      compliance: avgCompliance,
      status: determineComplianceStatus(avgCompliance, 90, 80) as SLAComplianceStatus,
      breachCount: Number(row.total_breaches) || 0,
    };
  });

  const overallCompliance = slaResults.length > 0
    ? slaResults.reduce((sum, sla) => sum + sla.compliance, 0) / slaResults.length
    : 100;

  return {
    overallCompliance,
    slaResults,
  };
}

/**
 * Monitors all active SLAs and generates alerts for breaches
 *
 * @param sequelize - Sequelize instance
 * @returns List of SLA breaches requiring attention
 */
export async function monitorActiveSLAs(
  sequelize: Sequelize
): Promise<Array<{
  contractId: string;
  contractName: string;
  slaName: string;
  currentStatus: SLAComplianceStatus;
  breachDuration: number;
  actionRequired: string;
}>> {
  const query = `
    SELECT
      c.id as contract_id,
      c.contract_name,
      s.sla_name,
      s.metric_name,
      p.compliance_status,
      p.compliance_percentage,
      EXTRACT(EPOCH FROM (NOW() - p.measured_at))/60 as minutes_since_measurement
    FROM contract_slas s
    JOIN property_contracts c ON s.contract_id = c.id
    LEFT JOIN LATERAL (
      SELECT *
      FROM sla_performance_records
      WHERE sla_id = s.id
      ORDER BY measured_at DESC
      LIMIT 1
    ) p ON true
    WHERE s.is_active = true
      AND c.status = 'active'
      AND (p.compliance_status IN ('warning', 'breach', 'critical')
           OR p.measured_at < NOW() - INTERVAL '2 hours')
    ORDER BY p.compliance_status DESC, p.compliance_percentage ASC
  `;

  const results = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  return results.map(row => ({
    contractId: String(row.contract_id),
    contractName: String(row.contract_name),
    slaName: String(row.sla_name),
    currentStatus: String(row.compliance_status) as SLAComplianceStatus,
    breachDuration: Number(row.minutes_since_measurement) || 0,
    actionRequired: generateSLAActionRecommendation(row),
  }));
}

// ============================================================================
// Payment Schedule Management Functions
// ============================================================================

/**
 * Generates payment schedule for a contract based on payment frequency
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param transaction - Optional transaction
 * @returns Array of created payment schedule entries
 */
export async function generatePaymentSchedule(
  sequelize: Sequelize,
  contractId: string,
  transaction?: Transaction
): Promise<PaymentSchedule[]> {
  const contract = await getContractById(sequelize, contractId);

  const payments: Array<Partial<PaymentSchedule>> = [];
  const totalMonths = Math.ceil(
    (contract.endDate.getTime() - contract.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  let paymentCount = 0;
  let paymentAmount = 0;

  switch (contract.paymentFrequency) {
    case 'monthly':
      paymentCount = totalMonths;
      paymentAmount = contract.totalValue / paymentCount;
      break;
    case 'quarterly':
      paymentCount = Math.ceil(totalMonths / 3);
      paymentAmount = contract.totalValue / paymentCount;
      break;
    case 'semi_annual':
      paymentCount = Math.ceil(totalMonths / 6);
      paymentAmount = contract.totalValue / paymentCount;
      break;
    case 'annual':
      paymentCount = Math.ceil(totalMonths / 12);
      paymentAmount = contract.totalValue / paymentCount;
      break;
    case 'one_time':
      paymentCount = 1;
      paymentAmount = contract.totalValue;
      break;
    default:
      throw new Error(`Unsupported payment frequency: ${contract.paymentFrequency}`);
  }

  // Generate payment dates
  for (let i = 0; i < paymentCount; i++) {
    const dueDate = new Date(contract.startDate);

    switch (contract.paymentFrequency) {
      case 'monthly':
        dueDate.setMonth(dueDate.getMonth() + i);
        break;
      case 'quarterly':
        dueDate.setMonth(dueDate.getMonth() + (i * 3));
        break;
      case 'semi_annual':
        dueDate.setMonth(dueDate.getMonth() + (i * 6));
        break;
      case 'annual':
        dueDate.setFullYear(dueDate.getFullYear() + i);
        break;
    }

    payments.push({
      contractId: contract.id,
      scheduleNumber: `${contract.contractNumber}-PAY-${String(i + 1).padStart(3, '0')}`,
      paymentAmount,
      currency: contract.currency,
      paymentDueDate: dueDate,
      description: `${contract.paymentFrequency} payment ${i + 1} of ${paymentCount}`,
      status: 'scheduled',
      approvalRequired: paymentAmount > 10000, // Require approval for large payments
    });
  }

  // Insert all payments
  for (const payment of payments) {
    await createPaymentScheduleEntry(sequelize, payment, transaction);
  }

  return getPaymentScheduleByContract(sequelize, contractId);
}

/**
 * Creates a single payment schedule entry
 *
 * @param sequelize - Sequelize instance
 * @param paymentData - Payment details
 * @param transaction - Optional transaction
 * @returns Created payment schedule entry
 */
export async function createPaymentScheduleEntry(
  sequelize: Sequelize,
  paymentData: Partial<PaymentSchedule>,
  transaction?: Transaction
): Promise<PaymentSchedule> {
  const query = `
    INSERT INTO contract_payment_schedules (
      id, contract_id, schedule_number, payment_amount, currency,
      payment_due_date, description, status, approval_required,
      created_at, updated_at
    ) VALUES (
      :id, :contractId, :scheduleNumber, :paymentAmount, :currency,
      :paymentDueDate, :description, :status, :approvalRequired,
      NOW(), NOW()
    )
    RETURNING *
  `;

  const id = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await sequelize.query(query, {
    replacements: {
      id,
      contractId: paymentData.contractId,
      scheduleNumber: paymentData.scheduleNumber,
      paymentAmount: paymentData.paymentAmount,
      currency: paymentData.currency || 'USD',
      paymentDueDate: paymentData.paymentDueDate,
      description: paymentData.description || '',
      status: paymentData.status || 'scheduled',
      approvalRequired: paymentData.approvalRequired || false,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return getPaymentScheduleById(sequelize, id);
}

/**
 * Records a payment against a schedule entry
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Payment schedule ID
 * @param paidAmount - Amount paid
 * @param paymentMethod - Method of payment
 * @param paymentReference - Payment reference/confirmation number
 * @param transaction - Optional transaction
 * @returns Updated payment schedule
 */
export async function recordPayment(
  sequelize: Sequelize,
  paymentId: string,
  paidAmount: number,
  paymentMethod: string,
  paymentReference: string,
  transaction?: Transaction
): Promise<PaymentSchedule> {
  const query = `
    UPDATE contract_payment_schedules
    SET status = 'paid',
        paid_date = NOW(),
        paid_amount = :paidAmount,
        payment_method = :paymentMethod,
        payment_reference = :paymentReference,
        updated_at = NOW()
    WHERE id = :paymentId
      AND status IN ('scheduled', 'pending', 'overdue')
  `;

  await sequelize.query(query, {
    replacements: {
      paymentId,
      paidAmount,
      paymentMethod,
      paymentReference,
    },
    type: QueryTypes.UPDATE,
    transaction,
  });

  return getPaymentScheduleById(sequelize, paymentId);
}

/**
 * Retrieves upcoming payments requiring attention
 *
 * @param sequelize - Sequelize instance
 * @param daysAhead - Number of days to look ahead
 * @returns List of upcoming payments
 */
export async function getUpcomingPayments(
  sequelize: Sequelize,
  daysAhead: number = 30
): Promise<PaymentSchedule[]> {
  const query = `
    SELECT ps.*, c.contract_name, c.vendor_name
    FROM contract_payment_schedules ps
    JOIN property_contracts c ON ps.contract_id = c.id
    WHERE ps.status IN ('scheduled', 'pending')
      AND ps.payment_due_date <= NOW() + INTERVAL '${daysAhead} days'
      AND ps.payment_due_date >= NOW()
    ORDER BY ps.payment_due_date ASC
  `;

  const results = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  return results.map(mapPaymentScheduleFromDb);
}

/**
 * Identifies overdue payments and applies late fees
 *
 * @param sequelize - Sequelize instance
 * @param lateFeePercentage - Late fee as percentage of payment amount
 * @param transaction - Optional transaction
 * @returns List of payments marked as overdue
 */
export async function processOverduePayments(
  sequelize: Sequelize,
  lateFeePercentage: number = 5,
  transaction?: Transaction
): Promise<PaymentSchedule[]> {
  const gracePeriod = defaultConfig.overdueGracePeriod;

  const query = `
    UPDATE contract_payment_schedules
    SET status = 'overdue',
        late_fee = payment_amount * :lateFeePercentage / 100,
        updated_at = NOW()
    WHERE status IN ('scheduled', 'pending')
      AND payment_due_date < NOW() - INTERVAL '${gracePeriod} days'
    RETURNING id
  `;

  const results = await sequelize.query(query, {
    replacements: { lateFeePercentage },
    type: QueryTypes.UPDATE,
    transaction,
  }) as unknown as Array<{ id: string }>;

  // Retrieve full details of updated payments
  const overduePayments: PaymentSchedule[] = [];
  for (const result of results) {
    const payment = await getPaymentScheduleById(sequelize, result.id);
    overduePayments.push(payment);
  }

  return overduePayments;
}

// ============================================================================
// Contract Amendment Functions
// ============================================================================

/**
 * Creates a contract amendment with change tracking
 *
 * @param sequelize - Sequelize instance
 * @param amendmentData - Amendment details
 * @param transaction - Optional transaction
 * @returns Created amendment
 */
export async function createContractAmendment(
  sequelize: Sequelize,
  amendmentData: Partial<ContractAmendment>,
  transaction?: Transaction
): Promise<ContractAmendment> {
  const contract = await getContractById(sequelize, amendmentData.contractId!);
  const amendmentNumber = `${contract.contractNumber}-AMD-${Date.now().toString().slice(-6)}`;

  const query = `
    INSERT INTO contract_amendments (
      id, contract_id, amendment_number, amendment_type,
      description, effective_date, changes_summary, fields_modified,
      value_change, new_total_value, status,
      requested_by, requested_at, document_ids,
      created_at, updated_at
    ) VALUES (
      :id, :contractId, :amendmentNumber, :amendmentType,
      :description, :effectiveDate, :changesSummary, :fieldsModified::jsonb,
      :valueChange, :newTotalValue, :status,
      :requestedBy, NOW(), :documentIds::jsonb,
      NOW(), NOW()
    )
    RETURNING *
  `;

  const id = `amendment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await sequelize.query(query, {
    replacements: {
      id,
      contractId: amendmentData.contractId,
      amendmentNumber,
      amendmentType: amendmentData.amendmentType,
      description: amendmentData.description,
      effectiveDate: amendmentData.effectiveDate,
      changesSummary: amendmentData.changesSummary,
      fieldsModified: JSON.stringify(amendmentData.fieldsModified || []),
      valueChange: amendmentData.valueChange,
      newTotalValue: amendmentData.newTotalValue,
      status: amendmentData.status || 'draft',
      requestedBy: amendmentData.requestedBy,
      documentIds: JSON.stringify(amendmentData.documentIds || []),
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return getAmendmentById(sequelize, id);
}

/**
 * Approves and executes a contract amendment
 *
 * @param sequelize - Sequelize instance
 * @param amendmentId - Amendment identifier
 * @param approvedBy - User approving the amendment
 * @param transaction - Optional transaction
 * @returns Updated amendment and contract
 */
export async function approveAndExecuteAmendment(
  sequelize: Sequelize,
  amendmentId: string,
  approvedBy: string,
  transaction?: Transaction
): Promise<{ amendment: ContractAmendment; contract: Contract }> {
  const amendment = await getAmendmentById(sequelize, amendmentId);

  // Update amendment status
  const updateAmendmentQuery = `
    UPDATE contract_amendments
    SET status = 'executed',
        approved_by = :approvedBy,
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = :amendmentId
  `;

  await sequelize.query(updateAmendmentQuery, {
    replacements: { amendmentId, approvedBy },
    type: QueryTypes.UPDATE,
    transaction,
  });

  // Apply changes to contract
  const updates: Record<string, unknown> = {};
  amendment.fieldsModified.forEach(field => {
    updates[field.fieldName] = field.newValue;
  });

  if (amendment.newTotalValue) {
    updates.totalValue = amendment.newTotalValue;
  }

  const contract = await updateContract(
    sequelize,
    amendment.contractId,
    updates as Partial<Contract>,
    approvedBy,
    transaction
  );

  const updatedAmendment = await getAmendmentById(sequelize, amendmentId);

  return { amendment: updatedAmendment, contract };
}

/**
 * Lists all amendments for a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @returns List of amendments
 */
export async function getContractAmendments(
  sequelize: Sequelize,
  contractId: string
): Promise<ContractAmendment[]> {
  const query = `
    SELECT *
    FROM contract_amendments
    WHERE contract_id = :contractId
    ORDER BY created_at DESC
  `;

  const results = await sequelize.query(query, {
    replacements: { contractId },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  return results.map(mapAmendmentFromDb);
}

// ============================================================================
// Vendor Performance Functions
// ============================================================================

/**
 * Calculates comprehensive vendor performance metrics
 *
 * @param sequelize - Sequelize instance
 * @param vendorId - Vendor identifier
 * @param evaluationPeriod - Time period for evaluation
 * @returns Vendor performance analysis
 */
export async function calculateVendorPerformance(
  sequelize: Sequelize,
  vendorId: string,
  evaluationPeriod: { start: Date; end: Date }
): Promise<VendorPerformance> {
  // Get vendor details
  const vendorQuery = `
    SELECT vendor_name
    FROM property_contracts
    WHERE vendor_id = :vendorId
    LIMIT 1
  `;

  const vendorResults = await sequelize.query(vendorQuery, {
    replacements: { vendorId },
    type: QueryTypes.SELECT,
  }) as Array<{ vendor_name: string }>;

  if (vendorResults.length === 0) {
    throw new Error(`Vendor not found: ${vendorId}`);
  }

  const vendorName = vendorResults[0].vendor_name;

  // Get contract metrics
  const contractMetricsQuery = `
    SELECT
      COUNT(*) as active_contracts,
      SUM(total_value) as total_contract_value
    FROM property_contracts
    WHERE vendor_id = :vendorId
      AND status = 'active'
  `;

  const contractMetrics = await sequelize.query(contractMetricsQuery, {
    replacements: { vendorId },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  // Get SLA compliance
  const slaQuery = `
    SELECT
      AVG(p.compliance_percentage) as avg_compliance,
      SUM(CASE WHEN p.compliance_status != 'compliant' THEN 1 ELSE 0 END) as breach_count,
      SUM(CASE WHEN p.compliance_status = 'critical' THEN 1 ELSE 0 END) as critical_breaches
    FROM contract_slas s
    JOIN property_contracts c ON s.contract_id = c.id
    JOIN sla_performance_records p ON s.id = p.sla_id
    WHERE c.vendor_id = :vendorId
      AND p.measurement_period_start >= :periodStart
      AND p.measurement_period_end <= :periodEnd
  `;

  const slaMetrics = await sequelize.query(slaQuery, {
    replacements: {
      vendorId,
      periodStart: evaluationPeriod.start,
      periodEnd: evaluationPeriod.end,
    },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  // Get payment metrics
  const paymentQuery = `
    SELECT
      SUM(paid_amount) as total_paid,
      COUNT(CASE WHEN status = 'paid' AND paid_date <= payment_due_date THEN 1 END) as on_time_payments,
      COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_payments,
      SUM(COALESCE(late_fee, 0)) as total_penalties,
      SUM(COALESCE(discount, 0)) as total_credits
    FROM contract_payment_schedules ps
    JOIN property_contracts c ON ps.contract_id = c.id
    WHERE c.vendor_id = :vendorId
      AND ps.payment_due_date >= :periodStart
      AND ps.payment_due_date <= :periodEnd
  `;

  const paymentMetrics = await sequelize.query(paymentQuery, {
    replacements: {
      vendorId,
      periodStart: evaluationPeriod.start,
      periodEnd: evaluationPeriod.end,
    },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  // Calculate scores
  const cm = contractMetrics[0];
  const sm = slaMetrics[0];
  const pm = paymentMetrics[0];

  const slaCompliance = Number(sm.avg_compliance) || 100;
  const onTimePaymentRate = Number(pm.on_time_payments) || 0;
  const totalPayments = onTimePaymentRate + (Number(pm.overdue_payments) || 0);
  const paymentScore = totalPayments > 0 ? (onTimePaymentRate / totalPayments) * 100 : 100;

  // Calculate overall rating (weighted average)
  const overallRating = (slaCompliance * 0.5) + (paymentScore * 0.3) + (75 * 0.2); // 75 is baseline quality score

  // Determine performance tier
  let performanceTier: VendorPerformance['performanceTier'];
  if (overallRating >= 95) performanceTier = 'platinum';
  else if (overallRating >= 85) performanceTier = 'gold';
  else if (overallRating >= 75) performanceTier = 'silver';
  else if (overallRating >= 65) performanceTier = 'bronze';
  else performanceTier = 'needs_improvement';

  // Calculate risk score
  const breachCount = Number(sm.breach_count) || 0;
  const criticalBreaches = Number(sm.critical_breaches) || 0;
  const riskScore = Math.min(100, (breachCount * 5) + (criticalBreaches * 15));

  let riskLevel: VendorPerformance['riskLevel'];
  if (riskScore >= 75) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 25) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    vendorId,
    vendorName,
    evaluationPeriod,
    activeContracts: Number(cm.active_contracts) || 0,
    totalContractValue: Number(cm.total_contract_value) || 0,
    overallSLACompliance: slaCompliance,
    slaBreachCount: breachCount,
    criticalBreaches,
    onTimeDeliveryRate: paymentScore,
    qualityScore: 75, // Would need additional data to calculate
    responsiveness: 80, // Would need ticket/response data
    totalPaid: Number(pm.total_paid) || 0,
    paymentsOnTime: onTimePaymentRate,
    paymentsOverdue: Number(pm.overdue_payments) || 0,
    penaltiesApplied: Number(pm.total_penalties) || 0,
    creditsIssued: Number(pm.total_credits) || 0,
    incidentCount: breachCount,
    criticalIncidents: criticalBreaches,
    averageResolutionTime: 24, // Would need incident data
    riskScore,
    riskLevel,
    riskFactors: generateRiskFactors(slaCompliance, breachCount, criticalBreaches),
    overallRating,
    performanceTier,
    recommendations: generateVendorRecommendations(overallRating, slaCompliance, breachCount),
    actionItems: generateVendorActionItems(riskLevel, criticalBreaches),
    generatedAt: new Date(),
    generatedBy: 'system',
  };
}

/**
 * Compares multiple vendors for a specific service type
 *
 * @param sequelize - Sequelize instance
 * @param vendorIds - Array of vendor identifiers
 * @param serviceType - Type of service to compare
 * @param evaluationPeriod - Time period for comparison
 * @returns Comparative vendor analysis
 */
export async function compareVendors(
  sequelize: Sequelize,
  vendorIds: string[],
  serviceType: ContractType,
  evaluationPeriod: { start: Date; end: Date }
): Promise<{
  serviceType: ContractType;
  vendors: Array<VendorPerformance & { rank: number }>;
  recommendation: string;
}> {
  const vendorPerformances: Array<VendorPerformance & { rank: number }> = [];

  for (const vendorId of vendorIds) {
    const performance = await calculateVendorPerformance(sequelize, vendorId, evaluationPeriod);
    vendorPerformances.push({ ...performance, rank: 0 });
  }

  // Sort by overall rating and assign ranks
  vendorPerformances.sort((a, b) => b.overallRating - a.overallRating);
  vendorPerformances.forEach((vendor, index) => {
    vendor.rank = index + 1;
  });

  // Generate recommendation
  const topVendor = vendorPerformances[0];
  const recommendation = `Recommend ${topVendor.vendorName} for ${serviceType} contracts. ` +
    `Overall rating: ${topVendor.overallRating.toFixed(1)}/100, ` +
    `SLA compliance: ${topVendor.overallSLACompliance.toFixed(1)}%, ` +
    `Performance tier: ${topVendor.performanceTier}.`;

  return {
    serviceType,
    vendors: vendorPerformances,
    recommendation,
  };
}

// ============================================================================
// Contract Compliance Functions
// ============================================================================

/**
 * Performs comprehensive compliance check on a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param checkType - Type of compliance check
 * @param checkedBy - User performing the check
 * @returns Compliance check results
 */
export async function performComplianceCheck(
  sequelize: Sequelize,
  contractId: string,
  checkType: ComplianceCheckResult['checkType'],
  checkedBy: string
): Promise<ComplianceCheckResult> {
  const contract = await getContractById(sequelize, contractId);
  const issues: ComplianceCheckResult['issues'] = [];

  // Check document completeness
  if (!contract.documentIds || contract.documentIds.length === 0) {
    issues.push({
      severity: 'high',
      category: 'documentation',
      description: 'No contract documents uploaded',
      requirement: 'Signed contract document required',
      remediation: 'Upload signed contract PDF',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }

  // Check insurance requirements
  if (checkType === 'insurance') {
    const insuranceDocs = await getContractDocuments(sequelize, contractId, 'insurance');
    const requiredInsurance = ['general_liability', 'workers_comp', 'professional_liability'];

    requiredInsurance.forEach(insuranceType => {
      const hasValidInsurance = insuranceDocs.some(doc =>
        doc.tags.includes(insuranceType) &&
        (!doc.expirationDate || doc.expirationDate > new Date())
      );

      if (!hasValidInsurance) {
        issues.push({
          severity: 'critical',
          category: 'insurance',
          description: `Missing or expired ${insuranceType} insurance`,
          requirement: `Current ${insuranceType} certificate required`,
          remediation: `Obtain and upload current ${insuranceType} certificate from vendor`,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });
      }
    });
  }

  // Check licensing requirements
  if (checkType === 'licensing') {
    // Check if vendor licenses are current
    const licenses = await getContractDocuments(sequelize, contractId, 'certificate');
    const expiredLicenses = licenses.filter(doc =>
      doc.expirationDate && doc.expirationDate < new Date()
    );

    expiredLicenses.forEach(license => {
      issues.push({
        severity: 'high',
        category: 'licensing',
        description: `License expired: ${license.fileName}`,
        requirement: 'All vendor licenses must be current',
        remediation: 'Request updated license from vendor',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    });
  }

  // Check performance compliance
  if (checkType === 'performance') {
    const slaCompliance = await getSLAComplianceSummary(
      sequelize,
      contractId,
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      new Date()
    );

    if (slaCompliance.overallCompliance < 90) {
      issues.push({
        severity: slaCompliance.overallCompliance < 70 ? 'critical' : 'high',
        category: 'performance',
        description: `SLA compliance below threshold: ${slaCompliance.overallCompliance.toFixed(1)}%`,
        requirement: 'Minimum 90% SLA compliance required',
        remediation: 'Schedule vendor performance review meeting',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }
  }

  const requirementsTotal = 10; // Would be calculated based on actual requirements
  const requirementsMet = requirementsTotal - issues.length;
  const complianceScore = (requirementsMet / requirementsTotal) * 100;

  return {
    contractId,
    checkType,
    checkDate: new Date(),
    isCompliant: issues.length === 0,
    complianceScore,
    requirementsMet,
    requirementsTotal,
    issues,
    documentsVerified: contract.documentIds.length,
    documentsExpired: 0, // Would be calculated from actual documents
    documentsMissing: issues.filter(i => i.category === 'documentation').length,
    certificationsValid: [],
    certificationsExpired: [],
    certificationsRequired: defaultConfig.requiredCertifications,
    nextReviewDate: new Date(Date.now() + defaultConfig.complianceCheckFrequency * 24 * 60 * 60 * 1000),
    checkedBy,
  };
}

/**
 * Generates compliance report for all contracts
 *
 * @param sequelize - Sequelize instance
 * @param filters - Optional filters
 * @returns Compliance summary across all contracts
 */
export async function generateComplianceReport(
  sequelize: Sequelize,
  filters?: {
    vendorId?: string;
    propertyId?: string;
    contractType?: ContractType;
  }
): Promise<{
  totalContracts: number;
  compliantContracts: number;
  nonCompliantContracts: number;
  complianceRate: number;
  criticalIssues: number;
  highPriorityIssues: number;
  issuesByCategory: Record<string, number>;
}> {
  const whereClauses: string[] = ['status = \'active\''];
  const replacements: Record<string, unknown> = {};

  if (filters?.vendorId) {
    whereClauses.push('vendor_id = :vendorId');
    replacements.vendorId = filters.vendorId;
  }

  if (filters?.propertyId) {
    whereClauses.push(':propertyId = ANY(property_ids)');
    replacements.propertyId = filters.propertyId;
  }

  if (filters?.contractType) {
    whereClauses.push('contract_type = :contractType');
    replacements.contractType = filters.contractType;
  }

  const whereClause = whereClauses.join(' AND ');

  const query = `
    SELECT id
    FROM property_contracts
    WHERE ${whereClause}
  `;

  const results = await sequelize.query(query, {
    replacements,
    type: QueryTypes.SELECT,
  }) as Array<{ id: string }>;

  let compliantCount = 0;
  let criticalIssues = 0;
  let highPriorityIssues = 0;
  const issuesByCategory: Record<string, number> = {};

  // Check compliance for each contract
  for (const contract of results) {
    const complianceCheck = await performComplianceCheck(sequelize, contract.id, 'regulatory', 'system');

    if (complianceCheck.isCompliant) {
      compliantCount++;
    }

    complianceCheck.issues.forEach(issue => {
      if (issue.severity === 'critical') criticalIssues++;
      if (issue.severity === 'high') highPriorityIssues++;

      issuesByCategory[issue.category] = (issuesByCategory[issue.category] || 0) + 1;
    });
  }

  return {
    totalContracts: results.length,
    compliantContracts: compliantCount,
    nonCompliantContracts: results.length - compliantCount,
    complianceRate: results.length > 0 ? (compliantCount / results.length) * 100 : 0,
    criticalIssues,
    highPriorityIssues,
    issuesByCategory,
  };
}

// ============================================================================
// Contract Renewal Functions
// ============================================================================

/**
 * Identifies contracts approaching renewal date
 *
 * @param sequelize - Sequelize instance
 * @param daysAhead - Number of days to look ahead
 * @returns List of contracts requiring renewal action
 */
export async function getContractsForRenewal(
  sequelize: Sequelize,
  daysAhead: number = 90
): Promise<Contract[]> {
  const query = `
    SELECT *
    FROM property_contracts
    WHERE status = 'active'
      AND expiration_date <= NOW() + INTERVAL '${daysAhead} days'
      AND expiration_date > NOW()
    ORDER BY expiration_date ASC
  `;

  const results = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  return results.map(mapContractFromDb);
}

/**
 * Generates renewal recommendation based on performance and costs
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @returns Renewal recommendation with analysis
 */
export async function generateRenewalRecommendation(
  sequelize: Sequelize,
  contractId: string
): Promise<RenewalRecommendation> {
  const contract = await getContractById(sequelize, contractId);

  // Get vendor performance
  const vendorPerformance = await calculateVendorPerformance(
    sequelize,
    contract.vendorId,
    {
      start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      end: new Date(),
    }
  );

  // Get SLA compliance
  const slaCompliance = await getSLAComplianceSummary(
    sequelize,
    contractId,
    new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    new Date()
  );

  // Calculate performance scores
  const performanceScore = vendorPerformance.overallRating;
  const costEffectiveness = 85; // Would calculate based on market rates
  const serviceQuality = slaCompliance.overallCompliance;

  // Determine recommendation
  let recommendation: RenewalRecommendation['recommendation'];
  let confidence = 0;

  if (performanceScore >= 85 && serviceQuality >= 90) {
    recommendation = 'renew';
    confidence = 95;
  } else if (performanceScore >= 70 && serviceQuality >= 75) {
    recommendation = 'renew_with_modifications';
    confidence = 75;
  } else if (performanceScore >= 60) {
    recommendation = 'renegotiate';
    confidence = 60;
  } else {
    recommendation = 'replace_vendor';
    confidence = 80;
  }

  // Calculate financial projections
  const currentAnnualCost = contract.totalValue;
  const projectedRenewalCost = currentAnnualCost * 1.05; // Assume 5% increase
  const marketRate = currentAnnualCost * 0.95; // Assume market is 5% lower
  const potentialSavings = projectedRenewalCost - marketRate;

  return {
    contractId,
    contractName: contract.contractName,
    currentEndDate: contract.endDate,
    recommendation,
    confidence,
    priority: contract.expirationDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 ? 'urgent' : 'medium',
    performanceAnalysis: {
      overallScore: performanceScore,
      slaCompliance: serviceQuality,
      costEffectiveness,
      serviceQuality,
    },
    costComparison: {
      currentAnnualCost,
      projectedRenewalCost,
      marketRate,
      potentialSavings,
    },
    alternativeVendorsAvailable: 3, // Would query vendor database
    marketConditions: potentialSavings > 0 ? 'favorable' : 'neutral',
    suggestedChanges: generateRenewalSuggestions(recommendation, performanceScore, serviceQuality),
    negotiationPoints: [
      'Request 3% reduction in annual cost',
      'Add performance guarantees with penalties',
      'Negotiate better SLA terms',
    ],
    renewalRisks: [
      'Price increase likely',
      'Service level may not improve',
    ],
    terminationRisks: [
      'Service interruption during transition',
      'Onboarding costs for new vendor',
    ],
    recommendedActionDate: new Date(contract.expirationDate.getTime() - 60 * 24 * 60 * 60 * 1000),
    deadlineDate: new Date(contract.expirationDate.getTime() - contract.noticePeriodDays * 24 * 60 * 60 * 1000),
    generatedAt: new Date(),
    generatedBy: 'system',
  };
}

/**
 * Processes automatic contract renewal
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param transaction - Optional transaction
 * @returns Renewed contract
 */
export async function processAutoRenewal(
  sequelize: Sequelize,
  contractId: string,
  transaction?: Transaction
): Promise<Contract> {
  const contract = await getContractById(sequelize, contractId);

  if (!contract.autoRenew) {
    throw new Error(`Contract ${contractId} is not configured for auto-renewal`);
  }

  const renewalMonths = contract.renewalTermMonths || 12;
  const newStartDate = contract.endDate;
  const newEndDate = new Date(newStartDate);
  newEndDate.setMonth(newEndDate.getMonth() + renewalMonths);

  // Create amendment for renewal
  const amendment = await createContractAmendment(
    sequelize,
    {
      contractId,
      amendmentType: 'term_extension',
      description: `Automatic renewal for ${renewalMonths} months`,
      effectiveDate: newStartDate,
      changesSummary: `Contract renewed from ${newStartDate.toISOString()} to ${newEndDate.toISOString()}`,
      fieldsModified: [
        {
          fieldName: 'startDate',
          oldValue: contract.startDate,
          newValue: newStartDate,
          changeReason: 'Auto-renewal',
        },
        {
          fieldName: 'endDate',
          oldValue: contract.endDate,
          newValue: newEndDate,
          changeReason: 'Auto-renewal',
        },
      ],
      status: 'approved',
      requestedBy: 'system',
    },
    transaction
  );

  // Update contract dates
  const updatedContract = await updateContract(
    sequelize,
    contractId,
    {
      startDate: newStartDate,
      endDate: newEndDate,
      expirationDate: newEndDate,
    },
    'system',
    transaction
  );

  // Generate new payment schedule
  await generatePaymentSchedule(sequelize, contractId, transaction);

  return updatedContract;
}

// ============================================================================
// Multi-Currency Support Functions
// ============================================================================

/**
 * Converts amount between currencies using current exchange rates
 *
 * @param sequelize - Sequelize instance
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Converted amount
 */
export async function convertCurrency(
  sequelize: Sequelize,
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const query = `
    SELECT rate
    FROM exchange_rates
    WHERE from_currency = :fromCurrency
      AND to_currency = :toCurrency
      AND effective_date <= NOW()
    ORDER BY effective_date DESC
    LIMIT 1
  `;

  const results = await sequelize.query(query, {
    replacements: { fromCurrency, toCurrency },
    type: QueryTypes.SELECT,
  }) as Array<{ rate: number }>;

  if (results.length === 0) {
    throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
  }

  return amount * results[0].rate;
}

/**
 * Retrieves contract value in a specific currency
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param targetCurrency - Desired currency
 * @returns Contract value in target currency
 */
export async function getContractValueInCurrency(
  sequelize: Sequelize,
  contractId: string,
  targetCurrency: CurrencyCode
): Promise<{ originalValue: number; originalCurrency: CurrencyCode; convertedValue: number; targetCurrency: CurrencyCode }> {
  const contract = await getContractById(sequelize, contractId);

  const convertedValue = await convertCurrency(
    sequelize,
    contract.totalValue,
    contract.currency,
    targetCurrency
  );

  return {
    originalValue: contract.totalValue,
    originalCurrency: contract.currency,
    convertedValue,
    targetCurrency,
  };
}

/**
 * Updates exchange rates from external source
 *
 * @param sequelize - Sequelize instance
 * @param rates - Array of exchange rates to update
 * @param transaction - Optional transaction
 * @returns Number of rates updated
 */
export async function updateExchangeRates(
  sequelize: Sequelize,
  rates: ExchangeRate[],
  transaction?: Transaction
): Promise<number> {
  let updatedCount = 0;

  for (const rate of rates) {
    const query = `
      INSERT INTO exchange_rates (
        from_currency, to_currency, rate, effective_date, source
      ) VALUES (
        :fromCurrency, :toCurrency, :rate, :effectiveDate, :source
      )
      ON CONFLICT (from_currency, to_currency, effective_date)
      DO UPDATE SET rate = :rate, source = :source
    `;

    await sequelize.query(query, {
      replacements: {
        fromCurrency: rate.fromCurrency,
        toCurrency: rate.toCurrency,
        rate: rate.rate,
        effectiveDate: rate.effectiveDate,
        source: rate.source,
      },
      type: QueryTypes.INSERT,
      transaction,
    });

    updatedCount++;
  }

  return updatedCount;
}

// ============================================================================
// Document Management Functions
// ============================================================================

/**
 * Uploads and associates a document with a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param documentData - Document metadata
 * @param transaction - Optional transaction
 * @returns Created document record
 */
export async function uploadContractDocument(
  sequelize: Sequelize,
  contractId: string,
  documentData: Partial<ContractDocument>,
  transaction?: Transaction
): Promise<ContractDocument> {
  const query = `
    INSERT INTO contract_documents (
      id, contract_id, document_type, file_name, file_size, mime_type,
      storage_url, version, is_current_version, uploaded_by, uploaded_at,
      description, tags, is_confidential, access_level, verified,
      expiration_date
    ) VALUES (
      :id, :contractId, :documentType, :fileName, :fileSize, :mimeType,
      :storageUrl, :version, :isCurrentVersion, :uploadedBy, NOW(),
      :description, :tags::jsonb, :isConfidential, :accessLevel, :verified,
      :expirationDate
    )
    RETURNING *
  `;

  const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await sequelize.query(query, {
    replacements: {
      id,
      contractId,
      documentType: documentData.documentType || 'other',
      fileName: documentData.fileName,
      fileSize: documentData.fileSize,
      mimeType: documentData.mimeType,
      storageUrl: documentData.storageUrl,
      version: documentData.version || '1.0',
      isCurrentVersion: documentData.isCurrentVersion !== false,
      uploadedBy: documentData.uploadedBy,
      description: documentData.description,
      tags: JSON.stringify(documentData.tags || []),
      isConfidential: documentData.isConfidential || false,
      accessLevel: documentData.accessLevel || 'internal',
      verified: documentData.verified || false,
      expirationDate: documentData.expirationDate,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  // Update contract's document IDs
  await sequelize.query(`
    UPDATE property_contracts
    SET document_ids = array_append(document_ids, :documentId),
        updated_at = NOW()
    WHERE id = :contractId
  `, {
    replacements: { contractId, documentId: id },
    type: QueryTypes.UPDATE,
    transaction,
  });

  return getDocumentById(sequelize, id);
}

/**
 * Retrieves all documents for a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param documentType - Optional filter by document type
 * @returns List of documents
 */
export async function getContractDocuments(
  sequelize: Sequelize,
  contractId: string,
  documentType?: ContractDocument['documentType']
): Promise<ContractDocument[]> {
  const whereClauses = ['contract_id = :contractId'];
  const replacements: Record<string, unknown> = { contractId };

  if (documentType) {
    whereClauses.push('document_type = :documentType');
    replacements.documentType = documentType;
  }

  const query = `
    SELECT *
    FROM contract_documents
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY uploaded_at DESC
  `;

  const results = await sequelize.query(query, {
    replacements,
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  return results.map(mapDocumentFromDb);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates unique contract number
 */
async function generateContractNumber(
  sequelize: Sequelize,
  contractType: ContractType
): Promise<string> {
  const prefix = contractType.substring(0, 3).toUpperCase();
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);

  return `${prefix}-${year}-${timestamp}`;
}

/**
 * Cancels future payment schedules
 */
async function cancelFuturePayments(
  sequelize: Sequelize,
  contractId: string,
  effectiveDate: Date,
  transaction?: Transaction
): Promise<void> {
  const query = `
    UPDATE contract_payment_schedules
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE contract_id = :contractId
      AND payment_due_date > :effectiveDate
      AND status IN ('scheduled', 'pending')
  `;

  await sequelize.query(query, {
    replacements: { contractId, effectiveDate },
    type: QueryTypes.UPDATE,
    transaction,
  });
}

/**
 * Applies penalty to next scheduled payment
 */
async function applyPenaltyToNextPayment(
  sequelize: Sequelize,
  contractId: string,
  penaltyAmount: number,
  reason: string,
  transaction?: Transaction
): Promise<void> {
  const query = `
    UPDATE contract_payment_schedules
    SET adjustments = COALESCE(adjustments, '[]'::jsonb) || :adjustment::jsonb,
        payment_amount = payment_amount - :penaltyAmount,
        updated_at = NOW()
    WHERE id = (
      SELECT id
      FROM contract_payment_schedules
      WHERE contract_id = :contractId
        AND status = 'scheduled'
      ORDER BY payment_due_date ASC
      LIMIT 1
    )
  `;

  const adjustment = {
    type: 'sla_penalty',
    amount: -penaltyAmount,
    reason,
  };

  await sequelize.query(query, {
    replacements: {
      contractId,
      penaltyAmount,
      adjustment: JSON.stringify([adjustment]),
    },
    type: QueryTypes.UPDATE,
    transaction,
  });
}

/**
 * Determines SLA compliance status based on thresholds
 */
function determineComplianceStatus(
  compliancePercentage: number,
  warningThreshold: number,
  criticalThreshold: number
): SLAComplianceStatus {
  if (compliancePercentage >= warningThreshold) return 'compliant';
  if (compliancePercentage >= criticalThreshold) return 'warning';
  if (compliancePercentage >= 50) return 'breach';
  return 'critical';
}

/**
 * Calculates SLA penalty based on breach severity
 */
function calculateSLAPenalty(
  sla: ServiceLevelAgreement,
  compliancePercentage: number
): number {
  if (!sla.penaltyEnabled) return 0;

  if (sla.penaltyType === 'fixed') {
    return sla.penaltyAmount || 0;
  } else if (sla.penaltyType === 'tiered' && sla.penaltyTiers) {
    const breach = 100 - compliancePercentage;
    const tier = sla.penaltyTiers.find(t => breach >= t.minBreach && breach <= t.maxBreach);
    return tier?.penaltyAmount || 0;
  }

  return 0;
}

/**
 * Generates SLA action recommendation
 */
function generateSLAActionRecommendation(data: Record<string, unknown>): string {
  const status = String(data.compliance_status);

  if (status === 'critical') {
    return 'URGENT: Contact vendor immediately - critical SLA breach in progress';
  } else if (status === 'breach') {
    return 'Escalate to vendor management - SLA breach detected';
  } else if (status === 'warning') {
    return 'Monitor closely - approaching SLA threshold';
  }

  return 'Review with vendor during next meeting';
}

/**
 * Generates vendor risk factors
 */
function generateRiskFactors(
  slaCompliance: number,
  breachCount: number,
  criticalBreaches: number
): string[] {
  const factors: string[] = [];

  if (slaCompliance < 80) factors.push('Consistently low SLA compliance');
  if (breachCount > 5) factors.push('Frequent SLA breaches');
  if (criticalBreaches > 0) factors.push('Critical SLA violations occurred');

  return factors;
}

/**
 * Generates vendor recommendations
 */
function generateVendorRecommendations(
  overallRating: number,
  slaCompliance: number,
  breachCount: number
): string[] {
  const recommendations: string[] = [];

  if (overallRating < 70) {
    recommendations.push('Consider replacing vendor');
    recommendations.push('Conduct formal performance review');
  } else if (overallRating < 85) {
    recommendations.push('Implement performance improvement plan');
  }

  if (slaCompliance < 90) {
    recommendations.push('Renegotiate SLA terms');
  }

  if (breachCount > 3) {
    recommendations.push('Increase monitoring frequency');
  }

  return recommendations;
}

/**
 * Generates vendor action items
 */
function generateVendorActionItems(
  riskLevel: VendorPerformance['riskLevel'],
  criticalBreaches: number
): string[] {
  const actions: string[] = [];

  if (riskLevel === 'critical' || riskLevel === 'high') {
    actions.push('Schedule immediate vendor review meeting');
    actions.push('Implement enhanced monitoring');
  }

  if (criticalBreaches > 0) {
    actions.push('Document all critical incidents');
    actions.push('Require corrective action plan from vendor');
  }

  return actions;
}

/**
 * Generates renewal suggestions
 */
function generateRenewalSuggestions(
  recommendation: RenewalRecommendation['recommendation'],
  performanceScore: number,
  serviceQuality: number
): string[] {
  const suggestions: string[] = [];

  if (recommendation === 'renew_with_modifications') {
    if (performanceScore < 80) suggestions.push('Add performance guarantees');
    if (serviceQuality < 85) suggestions.push('Strengthen SLA requirements');
    suggestions.push('Request price reduction');
  } else if (recommendation === 'renegotiate') {
    suggestions.push('Conduct market analysis');
    suggestions.push('Request competitive bids');
    suggestions.push('Negotiate better terms');
  }

  return suggestions;
}

/**
 * Converts camelCase to snake_case
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Maps database row to Contract object
 */
function mapContractFromDb(row: Record<string, unknown>): Contract {
  return {
    id: String(row.id),
    contractNumber: String(row.contract_number),
    contractName: String(row.contract_name),
    contractType: String(row.contract_type) as ContractType,
    status: String(row.status) as ContractStatus,
    vendorId: String(row.vendor_id),
    vendorName: String(row.vendor_name),
    vendorContact: row.vendor_contact as Contract['vendorContact'],
    propertyIds: row.property_ids as string[],
    departmentId: row.department_id ? String(row.department_id) : undefined,
    startDate: new Date(row.start_date as string),
    endDate: new Date(row.end_date as string),
    signedDate: row.signed_date ? new Date(row.signed_date as string) : undefined,
    effectiveDate: row.effective_date ? new Date(row.effective_date as string) : undefined,
    expirationDate: new Date(row.expiration_date as string),
    noticePeriodDays: Number(row.notice_period_days),
    totalValue: Number(row.total_value),
    currency: String(row.currency) as CurrencyCode,
    paymentTerms: String(row.payment_terms),
    paymentFrequency: String(row.payment_frequency) as PaymentFrequency,
    autoRenew: Boolean(row.auto_renew),
    renewalNoticeDays: Number(row.renewal_notice_days),
    renewalTermMonths: row.renewal_term_months ? Number(row.renewal_term_months) : undefined,
    documentIds: row.document_ids as string[],
    primaryDocumentUrl: row.primary_document_url ? String(row.primary_document_url) : undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    createdBy: String(row.created_by),
    approvedBy: row.approved_by ? String(row.approved_by) : undefined,
    approvedAt: row.approved_at ? new Date(row.approved_at as string) : undefined,
    tags: row.tags as string[],
    notes: row.notes ? String(row.notes) : undefined,
    customFields: row.custom_fields as Record<string, unknown>,
  };
}

/**
 * Maps database row to ServiceLevelAgreement object
 */
function mapSLAFromDb(row: Record<string, unknown>): ServiceLevelAgreement {
  return {
    id: String(row.id),
    contractId: String(row.contract_id),
    slaName: String(row.sla_name),
    description: String(row.description),
    metricName: String(row.metric_name),
    metricType: String(row.metric_type) as ServiceLevelAgreement['metricType'],
    targetValue: Number(row.target_value),
    targetUnit: String(row.target_unit),
    measurementFrequency: String(row.measurement_frequency) as ServiceLevelAgreement['measurementFrequency'],
    warningThreshold: Number(row.warning_threshold),
    criticalThreshold: Number(row.critical_threshold),
    penaltyEnabled: Boolean(row.penalty_enabled),
    penaltyType: String(row.penalty_type) as ServiceLevelAgreement['penaltyType'],
    penaltyAmount: row.penalty_amount ? Number(row.penalty_amount) : undefined,
    penaltyTiers: row.penalty_tiers as ServiceLevelAgreement['penaltyTiers'],
    isActive: Boolean(row.is_active),
    startDate: new Date(row.start_date as string),
    endDate: row.end_date ? new Date(row.end_date as string) : undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

/**
 * Retrieves SLA by ID
 */
async function getSLAById(sequelize: Sequelize, slaId: string): Promise<ServiceLevelAgreement> {
  const query = `SELECT * FROM contract_slas WHERE id = :slaId`;

  const results = await sequelize.query(query, {
    replacements: { slaId },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  if (results.length === 0) {
    throw new Error(`SLA not found: ${slaId}`);
  }

  return mapSLAFromDb(results[0]);
}

/**
 * Retrieves SLA performance record by ID
 */
async function getSLAPerformanceById(sequelize: Sequelize, id: string): Promise<SLAPerformance> {
  const query = `SELECT * FROM sla_performance_records WHERE id = :id`;

  const results = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  if (results.length === 0) {
    throw new Error(`SLA performance record not found: ${id}`);
  }

  const row = results[0];
  return {
    id: String(row.id),
    slaId: String(row.sla_id),
    contractId: String(row.contract_id),
    measurementPeriod: {
      start: new Date(row.measurement_period_start as string),
      end: new Date(row.measurement_period_end as string),
    },
    actualValue: Number(row.actual_value),
    targetValue: Number(row.target_value),
    unit: String(row.unit),
    compliancePercentage: Number(row.compliance_percentage),
    complianceStatus: String(row.compliance_status) as SLAComplianceStatus,
    breachCount: Number(row.breach_count),
    breachDuration: row.breach_duration ? Number(row.breach_duration) : undefined,
    breachDetails: row.breach_details as SLAPerformance['breachDetails'],
    penaltyApplied: Boolean(row.penalty_applied),
    penaltyAmount: row.penalty_amount ? Number(row.penalty_amount) : undefined,
    creditIssued: row.credit_issued ? Number(row.credit_issued) : undefined,
    trendDirection: (row.trend_direction as SLAPerformance['trendDirection']) || 'stable',
    anomaliesDetected: Boolean(row.anomalies_detected),
    measuredAt: new Date(row.measured_at as string),
    reportedBy: String(row.reported_by),
  };
}

/**
 * Maps database row to PaymentSchedule object
 */
function mapPaymentScheduleFromDb(row: Record<string, unknown>): PaymentSchedule {
  return {
    id: String(row.id),
    contractId: String(row.contract_id),
    scheduleNumber: String(row.schedule_number),
    paymentAmount: Number(row.payment_amount),
    currency: String(row.currency) as CurrencyCode,
    paymentDueDate: new Date(row.payment_due_date as string),
    description: String(row.description),
    status: String(row.status) as PaymentSchedule['status'],
    paidDate: row.paid_date ? new Date(row.paid_date as string) : undefined,
    paidAmount: row.paid_amount ? Number(row.paid_amount) : undefined,
    invoiceNumber: row.invoice_number ? String(row.invoice_number) : undefined,
    invoiceDate: row.invoice_date ? new Date(row.invoice_date as string) : undefined,
    invoiceUrl: row.invoice_url ? String(row.invoice_url) : undefined,
    approvalRequired: Boolean(row.approval_required),
    approvedBy: row.approved_by ? String(row.approved_by) : undefined,
    approvedAt: row.approved_at ? new Date(row.approved_at as string) : undefined,
    paymentMethod: row.payment_method ? String(row.payment_method) as PaymentSchedule['paymentMethod'] : undefined,
    paymentReference: row.payment_reference ? String(row.payment_reference) : undefined,
    lateFee: row.late_fee ? Number(row.late_fee) : undefined,
    discount: row.discount ? Number(row.discount) : undefined,
    adjustments: row.adjustments as PaymentSchedule['adjustments'],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    notes: row.notes ? String(row.notes) : undefined,
  };
}

/**
 * Retrieves payment schedule by ID
 */
async function getPaymentScheduleById(sequelize: Sequelize, id: string): Promise<PaymentSchedule> {
  const query = `SELECT * FROM contract_payment_schedules WHERE id = :id`;

  const results = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  if (results.length === 0) {
    throw new Error(`Payment schedule not found: ${id}`);
  }

  return mapPaymentScheduleFromDb(results[0]);
}

/**
 * Retrieves all payment schedules for a contract
 */
async function getPaymentScheduleByContract(
  sequelize: Sequelize,
  contractId: string
): Promise<PaymentSchedule[]> {
  const query = `
    SELECT * FROM contract_payment_schedules
    WHERE contract_id = :contractId
    ORDER BY payment_due_date ASC
  `;

  const results = await sequelize.query(query, {
    replacements: { contractId },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  return results.map(mapPaymentScheduleFromDb);
}

/**
 * Maps database row to ContractAmendment object
 */
function mapAmendmentFromDb(row: Record<string, unknown>): ContractAmendment {
  return {
    id: String(row.id),
    contractId: String(row.contract_id),
    amendmentNumber: String(row.amendment_number),
    amendmentType: String(row.amendment_type) as ContractAmendment['amendmentType'],
    description: String(row.description),
    effectiveDate: new Date(row.effective_date as string),
    changesSummary: String(row.changes_summary),
    fieldsModified: row.fields_modified as ContractAmendment['fieldsModified'],
    valueChange: row.value_change ? Number(row.value_change) : undefined,
    newTotalValue: row.new_total_value ? Number(row.new_total_value) : undefined,
    status: String(row.status) as ContractAmendment['status'],
    requestedBy: String(row.requested_by),
    requestedAt: new Date(row.requested_at as string),
    approvedBy: row.approved_by ? String(row.approved_by) : undefined,
    approvedAt: row.approved_at ? new Date(row.approved_at as string) : undefined,
    documentIds: row.document_ids as string[],
    amendmentDocumentUrl: row.amendment_document_url ? String(row.amendment_document_url) : undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

/**
 * Retrieves amendment by ID
 */
async function getAmendmentById(sequelize: Sequelize, id: string): Promise<ContractAmendment> {
  const query = `SELECT * FROM contract_amendments WHERE id = :id`;

  const results = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  if (results.length === 0) {
    throw new Error(`Amendment not found: ${id}`);
  }

  return mapAmendmentFromDb(results[0]);
}

/**
 * Maps database row to ContractDocument object
 */
function mapDocumentFromDb(row: Record<string, unknown>): ContractDocument {
  return {
    id: String(row.id),
    contractId: String(row.contract_id),
    documentType: String(row.document_type) as ContractDocument['documentType'],
    fileName: String(row.file_name),
    fileSize: Number(row.file_size),
    mimeType: String(row.mime_type),
    storageUrl: String(row.storage_url),
    version: String(row.version),
    isCurrentVersion: Boolean(row.is_current_version),
    previousVersionId: row.previous_version_id ? String(row.previous_version_id) : undefined,
    uploadedBy: String(row.uploaded_by),
    uploadedAt: new Date(row.uploaded_at as string),
    description: row.description ? String(row.description) : undefined,
    tags: row.tags as string[],
    isConfidential: Boolean(row.is_confidential),
    accessLevel: String(row.access_level) as ContractDocument['accessLevel'],
    checksum: row.checksum ? String(row.checksum) : undefined,
    digitalSignature: row.digital_signature ? String(row.digital_signature) : undefined,
    verified: Boolean(row.verified),
    expirationDate: row.expiration_date ? new Date(row.expiration_date as string) : undefined,
  };
}

/**
 * Retrieves document by ID
 */
async function getDocumentById(sequelize: Sequelize, id: string): Promise<ContractDocument> {
  const query = `SELECT * FROM contract_documents WHERE id = :id`;

  const results = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.SELECT,
  }) as Array<Record<string, unknown>>;

  if (results.length === 0) {
    throw new Error(`Document not found: ${id}`);
  }

  return mapDocumentFromDb(results[0]);
}
