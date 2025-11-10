/**
 * LOC: DOC-CLM-001
 * File: /reuse/document/document-contract-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *   - date-fns
 *   - nanoid
 *
 * DOWNSTREAM (imported by):
 *   - Contract management controllers
 *   - Legal services
 *   - Vendor management modules
 *   - Procurement systems
 */
import { Sequelize } from 'sequelize';
/**
 * Contract status types
 */
export type ContractStatus = 'draft' | 'in_negotiation' | 'pending_approval' | 'approved' | 'active' | 'expiring_soon' | 'expired' | 'terminated' | 'renewed';
/**
 * Contract type classifications
 */
export type ContractType = 'vendor_agreement' | 'service_level_agreement' | 'master_service_agreement' | 'purchase_order' | 'lease_agreement' | 'employment_contract' | 'nda' | 'baa' | 'insurance_contract' | 'license_agreement' | 'partnership_agreement';
/**
 * Clause category types
 */
export type ClauseCategory = 'payment_terms' | 'termination' | 'liability' | 'indemnification' | 'confidentiality' | 'data_protection' | 'hipaa_compliance' | 'intellectual_property' | 'dispute_resolution' | 'force_majeure' | 'warranties' | 'service_levels';
/**
 * Negotiation status
 */
export type NegotiationStatus = 'initiated' | 'in_progress' | 'pending_response' | 'accepted' | 'rejected' | 'countered' | 'completed';
/**
 * Obligation status
 */
export type ObligationStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'waived' | 'disputed';
/**
 * Approval status
 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated' | 'withdrawn';
/**
 * Risk level assessment
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
/**
 * Contract party information
 */
export interface ContractParty {
    id?: string;
    name: string;
    type: 'vendor' | 'customer' | 'partner' | 'internal';
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    taxId?: string;
    businessLicense?: string;
    role: 'primary' | 'secondary' | 'witness' | 'guarantor';
}
/**
 * Financial terms
 */
export interface FinancialTerms {
    totalValue: number;
    currency: string;
    paymentSchedule: Array<{
        dueDate: Date;
        amount: number;
        description: string;
        status?: 'pending' | 'paid' | 'overdue';
    }>;
    paymentTerms?: string;
    lateFeePercentage?: number;
    discountTerms?: string;
    taxRate?: number;
    budgetCode?: string;
}
/**
 * Service level agreement terms
 */
export interface SLATerms {
    uptime?: number;
    responseTime?: number;
    resolutionTime?: number;
    availabilityPercentage?: number;
    penaltyClause?: string;
    creditPercentage?: number;
    measurementPeriod?: string;
    reportingFrequency?: string;
}
/**
 * Contract metadata
 */
export interface ContractMetadata {
    department?: string;
    businessUnit?: string;
    category?: string;
    tags?: string[];
    customFields?: Record<string, any>;
    governingLaw?: string;
    jurisdiction?: string;
    language?: string;
    confidentialityLevel?: 'public' | 'internal' | 'confidential' | 'highly_confidential';
}
/**
 * Contract clause definition
 */
export interface ContractClauseDefinition {
    id?: string;
    title: string;
    category: ClauseCategory;
    content: string;
    isStandard?: boolean;
    isMandatory?: boolean;
    riskLevel?: RiskLevel;
    suggestedPosition?: number;
    alternativeVersions?: string[];
    relatedClauses?: string[];
    complianceRequirements?: string[];
    variables?: Array<{
        name: string;
        type: 'string' | 'number' | 'date' | 'boolean';
        defaultValue?: any;
        required: boolean;
    }>;
}
/**
 * Negotiation change request
 */
export interface NegotiationChange {
    id?: string;
    clauseId?: string;
    section?: string;
    changeType: 'addition' | 'modification' | 'deletion' | 'comment';
    originalText?: string;
    proposedText?: string;
    reason?: string;
    proposedBy: string;
    proposedAt: Date;
    status: NegotiationStatus;
    respondedBy?: string;
    respondedAt?: Date;
    response?: string;
}
/**
 * Contract obligation
 */
export interface ContractObligation {
    id?: string;
    description: string;
    responsibleParty: string;
    dueDate: Date;
    status: ObligationStatus;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    relatedClause?: string;
    dependencies?: string[];
    completedDate?: Date;
    completedBy?: string;
    notes?: string;
    attachments?: string[];
}
/**
 * Contract milestone
 */
export interface ContractMilestone {
    id?: string;
    name: string;
    description?: string;
    targetDate: Date;
    actualDate?: Date;
    status: 'pending' | 'completed' | 'missed' | 'waived';
    deliverables?: string[];
    paymentTrigger?: boolean;
    paymentAmount?: number;
}
/**
 * Approval workflow stage
 */
export interface ApprovalStage {
    id?: string;
    stageName: string;
    approvers: string[];
    requiredApprovals: number;
    order: number;
    status: ApprovalStatus;
    approvedBy?: string[];
    rejectedBy?: string[];
    comments?: Array<{
        userId: string;
        comment: string;
        timestamp: Date;
    }>;
    deadline?: Date;
}
/**
 * Contract renewal configuration
 */
export interface RenewalConfig {
    autoRenew: boolean;
    renewalNoticeDays: number;
    renewalTerm?: number;
    renewalTermUnit?: 'days' | 'months' | 'years';
    maxRenewals?: number;
    renewalCount?: number;
    priceAdjustment?: {
        type: 'fixed' | 'percentage' | 'cpi' | 'custom';
        value: number;
    };
    renewalApprovalRequired?: boolean;
    renewalContacts?: string[];
}
/**
 * Contract analytics metrics
 */
export interface ContractAnalytics {
    totalValue: number;
    averageValue: number;
    totalActive: number;
    expiringIn30Days: number;
    expiringIn60Days: number;
    expiringIn90Days: number;
    expiredCount: number;
    byStatus: Record<ContractStatus, number>;
    byType: Record<ContractType, number>;
    byDepartment: Record<string, number>;
    topVendors: Array<{
        vendorName: string;
        contractCount: number;
        totalValue: number;
    }>;
    obligationStats: {
        pending: number;
        overdue: number;
        completed: number;
    };
    riskDistribution: Record<RiskLevel, number>;
}
/**
 * Contract search filters
 */
export interface ContractSearchFilters {
    status?: ContractStatus[];
    type?: ContractType[];
    parties?: string[];
    dateRange?: {
        start: Date;
        end: Date;
        field: 'startDate' | 'endDate' | 'createdAt' | 'updatedAt';
    };
    valueRange?: {
        min: number;
        max: number;
    };
    department?: string[];
    tags?: string[];
    expiringWithinDays?: number;
    riskLevel?: RiskLevel[];
    hasObligations?: boolean;
}
/**
 * Contract version information
 */
export interface ContractVersion {
    version: number;
    createdAt: Date;
    createdBy: string;
    changes: string;
    documentUrl?: string;
    checksum?: string;
    isPrimary: boolean;
}
/**
 * Compliance check result
 */
export interface ComplianceCheckResult {
    compliant: boolean;
    checks: Array<{
        requirement: string;
        status: 'passed' | 'failed' | 'warning';
        details?: string;
    }>;
    missingClauses?: string[];
    recommendations?: string[];
    riskScore?: number;
}
/**
 * Contract template
 */
export interface ContractTemplate {
    id?: string;
    name: string;
    type: ContractType;
    description?: string;
    clauses: ContractClauseDefinition[];
    approvalWorkflow?: ApprovalStage[];
    defaultTermMonths?: number;
    isActive: boolean;
    category?: string;
    usageCount?: number;
}
/**
 * Contract model attributes
 */
export interface ContractAttributes {
    id: string;
    contractNumber: string;
    title: string;
    type: ContractType;
    status: ContractStatus;
    description?: string;
    parties: ContractParty[];
    startDate: Date;
    endDate: Date;
    noticeDate?: Date;
    signedDate?: Date;
    effectiveDate?: Date;
    terminationDate?: Date;
    financialTerms?: FinancialTerms;
    slaTerms?: SLATerms;
    metadata?: ContractMetadata;
    renewalConfig?: RenewalConfig;
    currentVersion: number;
    documentUrl?: string;
    signatureUrl?: string;
    templateId?: string;
    parentContractId?: string;
    riskLevel?: RiskLevel;
    complianceStatus?: 'compliant' | 'non_compliant' | 'review_required';
    ownerId: string;
    ownerDepartment?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Contract clause model attributes
 */
export interface ContractClauseAttributes {
    id: string;
    contractId?: string;
    templateId?: string;
    title: string;
    category: ClauseCategory;
    content: string;
    position: number;
    isStandard: boolean;
    isMandatory: boolean;
    isActive: boolean;
    riskLevel?: RiskLevel;
    version: number;
    approvedBy?: string;
    approvedAt?: Date;
    effectiveDate?: Date;
    expirationDate?: Date;
    variables?: Record<string, any>;
    alternativeVersions?: string[];
    relatedClauses?: string[];
    complianceRequirements?: string[];
    tags?: string[];
    usageCount: number;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Contract negotiation model attributes
 */
export interface ContractNegotiationAttributes {
    id: string;
    contractId: string;
    version: number;
    status: NegotiationStatus;
    initiatedBy: string;
    initiatedAt: Date;
    participants: string[];
    changes: NegotiationChange[];
    currentResponder?: string;
    responseDeadline?: Date;
    completedAt?: Date;
    completedBy?: string;
    finalApproval?: boolean;
    approvalDate?: Date;
    notes?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Contract model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ContractAttributes>>} Contract model
 *
 * @example
 * ```typescript
 * const ContractModel = createContractModel(sequelize);
 * const contract = await ContractModel.create({
 *   contractNumber: 'CNT-2025-001',
 *   title: 'Medical Equipment Lease Agreement',
 *   type: 'lease_agreement',
 *   status: 'draft',
 *   parties: [{
 *     name: 'Medical Supplies Inc',
 *     type: 'vendor',
 *     role: 'primary'
 *   }],
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2026-01-01'),
 *   currentVersion: 1,
 *   ownerId: 'user-uuid',
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createContractModel: (sequelize: Sequelize) => any;
/**
 * Creates ContractClause model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ContractClauseAttributes>>} ContractClause model
 *
 * @example
 * ```typescript
 * const ClauseModel = createContractClauseModel(sequelize);
 * const clause = await ClauseModel.create({
 *   contractId: 'contract-uuid',
 *   title: 'HIPAA Compliance Requirements',
 *   category: 'hipaa_compliance',
 *   content: 'Vendor shall comply with all HIPAA regulations...',
 *   position: 5,
 *   isStandard: true,
 *   isMandatory: true,
 *   version: 1,
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createContractClauseModel: (sequelize: Sequelize) => any;
/**
 * Creates ContractNegotiation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ContractNegotiationAttributes>>} ContractNegotiation model
 *
 * @example
 * ```typescript
 * const NegotiationModel = createContractNegotiationModel(sequelize);
 * const negotiation = await NegotiationModel.create({
 *   contractId: 'contract-uuid',
 *   version: 1,
 *   status: 'initiated',
 *   initiatedBy: 'user-uuid',
 *   initiatedAt: new Date(),
 *   participants: ['user-uuid-1', 'user-uuid-2'],
 *   changes: []
 * });
 * ```
 */
export declare const createContractNegotiationModel: (sequelize: Sequelize) => any;
/**
 * 1. Generates unique contract number.
 *
 * @param {ContractType} type - Contract type
 * @param {string} [department] - Department code
 * @returns {Promise<string>} Unique contract number
 *
 * @example
 * ```typescript
 * const contractNumber = await generateContractNumber('vendor_agreement', 'PROC');
 * // Returns: 'CNT-PROC-2025-001'
 * ```
 */
export declare const generateContractNumber: (type: ContractType, department?: string) => Promise<string>;
/**
 * 2. Creates contract from template.
 *
 * @param {ContractTemplate} template - Contract template
 * @param {Partial<ContractAttributes>} overrides - Template overrides
 * @returns {Promise<Partial<ContractAttributes>>} New contract data
 *
 * @example
 * ```typescript
 * const contract = await createContractFromTemplate(vendorTemplate, {
 *   title: 'Medical Equipment Supply Agreement',
 *   parties: [{ name: 'MedTech Inc', type: 'vendor', role: 'primary' }],
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2026-01-01'),
 *   ownerId: 'user-uuid'
 * });
 * ```
 */
export declare const createContractFromTemplate: (template: ContractTemplate, overrides: Partial<ContractAttributes>) => Promise<Partial<ContractAttributes>>;
/**
 * 3. Validates contract data completeness.
 *
 * @param {Partial<ContractAttributes>} contract - Contract data to validate
 * @returns {{ valid: boolean; errors: string[]; warnings: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateContractData(contractData);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateContractData: (contract: Partial<ContractAttributes>) => {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 4. Generates contract metadata from content.
 *
 * @param {string} contractContent - Contract text content
 * @returns {Promise<Partial<ContractMetadata>>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractContractMetadata(contractText);
 * console.log('Governing law:', metadata.governingLaw);
 * console.log('Tags:', metadata.tags);
 * ```
 */
export declare const extractContractMetadata: (contractContent: string) => Promise<Partial<ContractMetadata>>;
/**
 * 5. Sets up approval workflow for contract.
 *
 * @param {string} contractId - Contract ID
 * @param {ContractType} type - Contract type
 * @param {number} value - Contract value
 * @returns {Promise<ApprovalStage[]>} Approval workflow stages
 *
 * @example
 * ```typescript
 * const workflow = await setupApprovalWorkflow('contract-uuid', 'vendor_agreement', 50000);
 * // Returns multi-stage approval workflow based on value
 * ```
 */
export declare const setupApprovalWorkflow: (contractId: string, type: ContractType, value: number) => Promise<ApprovalStage[]>;
/**
 * 6. Duplicates existing contract as new draft.
 *
 * @param {ContractAttributes} sourceContract - Source contract to duplicate
 * @param {Partial<ContractAttributes>} modifications - Modifications for new contract
 * @returns {Promise<Partial<ContractAttributes>>} New contract data
 *
 * @example
 * ```typescript
 * const newContract = await duplicateContract(existingContract, {
 *   title: 'Renewed Medical Equipment Lease',
 *   startDate: new Date('2026-01-01'),
 *   endDate: new Date('2027-01-01')
 * });
 * ```
 */
export declare const duplicateContract: (sourceContract: ContractAttributes, modifications: Partial<ContractAttributes>) => Promise<Partial<ContractAttributes>>;
/**
 * 7. Calculates contract financial summary.
 *
 * @param {FinancialTerms} financialTerms - Financial terms
 * @returns {{ total: number; paid: number; pending: number; overdue: number }} Financial summary
 *
 * @example
 * ```typescript
 * const summary = calculateFinancialSummary(contract.financialTerms);
 * console.log('Total value:', summary.total);
 * console.log('Amount overdue:', summary.overdue);
 * ```
 */
export declare const calculateFinancialSummary: (financialTerms: FinancialTerms) => {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
};
/**
 * 8. Creates standard clause in library.
 *
 * @param {ContractClauseDefinition} clauseData - Clause definition
 * @param {string} createdBy - User ID
 * @returns {Promise<Partial<ContractClauseAttributes>>} Created clause
 *
 * @example
 * ```typescript
 * const clause = await createStandardClause({
 *   title: 'HIPAA Compliance',
 *   category: 'hipaa_compliance',
 *   content: 'Vendor shall comply with all HIPAA regulations...',
 *   isStandard: true,
 *   isMandatory: true,
 *   riskLevel: 'high'
 * }, 'user-uuid');
 * ```
 */
export declare const createStandardClause: (clauseData: ContractClauseDefinition, createdBy: string) => Promise<Partial<ContractClauseAttributes>>;
/**
 * 9. Searches clause library by criteria.
 *
 * @param {object} criteria - Search criteria
 * @param {ClauseCategory[]} [criteria.categories] - Clause categories
 * @param {string} [criteria.searchTerm] - Search term
 * @param {boolean} [criteria.mandatoryOnly] - Only mandatory clauses
 * @param {RiskLevel[]} [criteria.riskLevels] - Risk levels
 * @returns {Promise<ContractClauseAttributes[]>} Matching clauses
 *
 * @example
 * ```typescript
 * const clauses = await searchClauseLibrary({
 *   categories: ['hipaa_compliance', 'data_protection'],
 *   mandatoryOnly: true,
 *   riskLevels: ['high', 'critical']
 * });
 * ```
 */
export declare const searchClauseLibrary: (criteria: {
    categories?: ClauseCategory[];
    searchTerm?: string;
    mandatoryOnly?: boolean;
    riskLevels?: RiskLevel[];
    tags?: string[];
}) => Promise<ContractClauseAttributes[]>;
/**
 * 10. Suggests relevant clauses for contract type.
 *
 * @param {ContractType} contractType - Contract type
 * @param {string[]} [existingClauseIds] - Already included clause IDs
 * @returns {Promise<ContractClauseDefinition[]>} Suggested clauses
 *
 * @example
 * ```typescript
 * const suggestions = await suggestClausesForContract('vendor_agreement', existingIds);
 * // Returns clauses commonly used in vendor agreements
 * ```
 */
export declare const suggestClausesForContract: (contractType: ContractType, existingClauseIds?: string[]) => Promise<ContractClauseDefinition[]>;
/**
 * 11. Validates clause for compliance requirements.
 *
 * @param {ContractClauseDefinition} clause - Clause to validate
 * @param {string[]} requiredCompliance - Required compliance standards
 * @returns {{ compliant: boolean; missing: string[]; suggestions: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateClauseCompliance(clause, ['HIPAA', 'GDPR']);
 * if (!validation.compliant) {
 *   console.log('Missing requirements:', validation.missing);
 * }
 * ```
 */
export declare const validateClauseCompliance: (clause: ContractClauseDefinition, requiredCompliance: string[]) => {
    compliant: boolean;
    missing: string[];
    suggestions: string[];
};
/**
 * 12. Merges clause variations into single clause.
 *
 * @param {ContractClauseDefinition[]} variations - Clause variations to merge
 * @returns {Promise<ContractClauseDefinition>} Merged clause with alternatives
 *
 * @example
 * ```typescript
 * const mergedClause = await mergeClauseVariations([variation1, variation2, variation3]);
 * // Returns primary version with others as alternativeVersions
 * ```
 */
export declare const mergeClauseVariations: (variations: ContractClauseDefinition[]) => Promise<ContractClauseDefinition>;
/**
 * 13. Updates clause usage statistics.
 *
 * @param {string} clauseId - Clause ID
 * @param {string} contractId - Contract where clause was used
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateClauseUsageStats('clause-uuid', 'contract-uuid');
 * // Increments usage count and tracks usage
 * ```
 */
export declare const updateClauseUsageStats: (clauseId: string, contractId: string) => Promise<void>;
/**
 * 14. Exports clause library to template format.
 *
 * @param {ClauseCategory[]} [categories] - Categories to export
 * @returns {Promise<{ clauses: ContractClauseDefinition[]; metadata: any }>} Exported library
 *
 * @example
 * ```typescript
 * const library = await exportClauseLibrary(['hipaa_compliance', 'data_protection']);
 * // Returns structured clause library for import
 * ```
 */
export declare const exportClauseLibrary: (categories?: ClauseCategory[]) => Promise<{
    clauses: ContractClauseDefinition[];
    metadata: any;
}>;
/**
 * 15. Creates new contract version.
 *
 * @param {string} contractId - Contract ID
 * @param {string} changes - Description of changes
 * @param {string} userId - User making changes
 * @returns {Promise<ContractVersion>} New version information
 *
 * @example
 * ```typescript
 * const version = await createContractVersion('contract-uuid', 'Updated payment terms', 'user-uuid');
 * console.log('New version:', version.version);
 * ```
 */
export declare const createContractVersion: (contractId: string, changes: string, userId: string) => Promise<ContractVersion>;
/**
 * 16. Compares two contract versions.
 *
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @param {string} contractId - Contract ID
 * @returns {Promise<{ additions: string[]; deletions: string[]; modifications: string[] }>} Version differences
 *
 * @example
 * ```typescript
 * const diff = await compareContractVersions(1, 2, 'contract-uuid');
 * console.log('Modifications:', diff.modifications);
 * ```
 */
export declare const compareContractVersions: (version1: number, version2: number, contractId: string) => Promise<{
    additions: string[];
    deletions: string[];
    modifications: string[];
}>;
/**
 * 17. Reverts contract to previous version.
 *
 * @param {string} contractId - Contract ID
 * @param {number} targetVersion - Version to revert to
 * @param {string} userId - User performing revert
 * @returns {Promise<ContractVersion>} New version with reverted content
 *
 * @example
 * ```typescript
 * const reverted = await revertToVersion('contract-uuid', 3, 'user-uuid');
 * // Creates new version with content from version 3
 * ```
 */
export declare const revertToVersion: (contractId: string, targetVersion: number, userId: string) => Promise<ContractVersion>;
/**
 * 18. Lists all versions for a contract.
 *
 * @param {string} contractId - Contract ID
 * @returns {Promise<ContractVersion[]>} All contract versions
 *
 * @example
 * ```typescript
 * const versions = await listContractVersions('contract-uuid');
 * versions.forEach(v => console.log(`Version ${v.version}: ${v.changes}`));
 * ```
 */
export declare const listContractVersions: (contractId: string) => Promise<ContractVersion[]>;
/**
 * 19. Generates version checksum for integrity.
 *
 * @param {string} contractContent - Contract content
 * @returns {string} SHA-256 checksum
 *
 * @example
 * ```typescript
 * const checksum = generateVersionChecksum(contractText);
 * // Store checksum to verify document hasn't been tampered with
 * ```
 */
export declare const generateVersionChecksum: (contractContent: string) => string;
/**
 * 20. Validates version integrity.
 *
 * @param {string} contractContent - Contract content
 * @param {string} storedChecksum - Stored checksum
 * @returns {boolean} True if content matches checksum
 *
 * @example
 * ```typescript
 * const isValid = validateVersionIntegrity(contractText, version.checksum);
 * if (!isValid) {
 *   throw new Error('Contract has been tampered with');
 * }
 * ```
 */
export declare const validateVersionIntegrity: (contractContent: string, storedChecksum: string) => boolean;
/**
 * 21. Tracks version change history.
 *
 * @param {string} contractId - Contract ID
 * @param {Date} [fromDate] - Start date filter
 * @param {Date} [toDate] - End date filter
 * @returns {Promise<Array<{ version: number; changes: string; timestamp: Date; user: string }>>} Change history
 *
 * @example
 * ```typescript
 * const history = await getVersionChangeHistory('contract-uuid',
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * ```
 */
export declare const getVersionChangeHistory: (contractId: string, fromDate?: Date, toDate?: Date) => Promise<Array<{
    version: number;
    changes: string;
    timestamp: Date;
    user: string;
}>>;
/**
 * 22. Initiates contract negotiation.
 *
 * @param {string} contractId - Contract ID
 * @param {string[]} participants - Participant user IDs
 * @param {string} initiatedBy - Initiating user ID
 * @returns {Promise<Partial<ContractNegotiationAttributes>>} Created negotiation
 *
 * @example
 * ```typescript
 * const negotiation = await initiateNegotiation('contract-uuid',
 *   ['user-1', 'user-2', 'user-3'],
 *   'user-1'
 * );
 * ```
 */
export declare const initiateNegotiation: (contractId: string, participants: string[], initiatedBy: string) => Promise<Partial<ContractNegotiationAttributes>>;
/**
 * 23. Proposes change in negotiation.
 *
 * @param {string} negotiationId - Negotiation ID
 * @param {NegotiationChange} change - Proposed change
 * @returns {Promise<NegotiationChange>} Created change with ID
 *
 * @example
 * ```typescript
 * const change = await proposeNegotiationChange('negotiation-uuid', {
 *   clauseId: 'clause-uuid',
 *   changeType: 'modification',
 *   originalText: 'Payment within 60 days',
 *   proposedText: 'Payment within 30 days',
 *   reason: 'Improve cash flow',
 *   proposedBy: 'user-uuid',
 *   proposedAt: new Date(),
 *   status: 'pending_response'
 * });
 * ```
 */
export declare const proposeNegotiationChange: (negotiationId: string, change: NegotiationChange) => Promise<NegotiationChange>;
/**
 * 24. Responds to negotiation change.
 *
 * @param {string} negotiationId - Negotiation ID
 * @param {string} changeId - Change ID
 * @param {object} response - Response data
 * @param {NegotiationStatus} response.status - Response status
 * @param {string} [response.counterProposal] - Counter proposal text
 * @param {string} [response.comment] - Response comment
 * @param {string} response.respondedBy - Responding user ID
 * @returns {Promise<NegotiationChange>} Updated change
 *
 * @example
 * ```typescript
 * const updated = await respondToNegotiationChange('negotiation-uuid', 'change-uuid', {
 *   status: 'accepted',
 *   comment: 'Agreed to 30-day payment terms',
 *   respondedBy: 'user-uuid'
 * });
 * ```
 */
export declare const respondToNegotiationChange: (negotiationId: string, changeId: string, response: {
    status: NegotiationStatus;
    counterProposal?: string;
    comment?: string;
    respondedBy: string;
}) => Promise<NegotiationChange>;
/**
 * 25. Gets negotiation status summary.
 *
 * @param {string} negotiationId - Negotiation ID
 * @returns {Promise<{ total: number; pending: number; accepted: number; rejected: number; countered: number }>} Status summary
 *
 * @example
 * ```typescript
 * const summary = await getNegotiationStatus('negotiation-uuid');
 * console.log(`${summary.accepted}/${summary.total} changes accepted`);
 * ```
 */
export declare const getNegotiationStatus: (negotiationId: string) => Promise<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    countered: number;
}>;
/**
 * 26. Completes negotiation and applies changes.
 *
 * @param {string} negotiationId - Negotiation ID
 * @param {string} completedBy - User completing negotiation
 * @returns {Promise<{ version: number; appliedChanges: number }>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeNegotiation('negotiation-uuid', 'user-uuid');
 * console.log(`Created version ${result.version} with ${result.appliedChanges} changes`);
 * ```
 */
export declare const completeNegotiation: (negotiationId: string, completedBy: string) => Promise<{
    version: number;
    appliedChanges: number;
}>;
/**
 * 27. Generates negotiation report.
 *
 * @param {string} negotiationId - Negotiation ID
 * @returns {Promise<string>} JSON report with negotiation details
 *
 * @example
 * ```typescript
 * const report = await generateNegotiationReport('negotiation-uuid');
 * // Returns detailed report of all proposed changes and responses
 * ```
 */
export declare const generateNegotiationReport: (negotiationId: string) => Promise<string>;
/**
 * 28. Creates contract obligation.
 *
 * @param {string} contractId - Contract ID
 * @param {ContractObligation} obligation - Obligation details
 * @returns {Promise<ContractObligation>} Created obligation with ID
 *
 * @example
 * ```typescript
 * const obligation = await createContractObligation('contract-uuid', {
 *   description: 'Submit quarterly compliance report',
 *   responsibleParty: 'vendor-id',
 *   dueDate: new Date('2025-03-31'),
 *   status: 'pending',
 *   priority: 'high',
 *   category: 'compliance'
 * });
 * ```
 */
export declare const createContractObligation: (contractId: string, obligation: ContractObligation) => Promise<ContractObligation>;
/**
 * 29. Lists obligations for contract.
 *
 * @param {string} contractId - Contract ID
 * @param {object} [filters] - Filter options
 * @param {ObligationStatus[]} [filters.statuses] - Status filter
 * @param {string} [filters.responsibleParty] - Responsible party filter
 * @param {boolean} [filters.overdueOnly] - Only overdue obligations
 * @returns {Promise<ContractObligation[]>} Filtered obligations
 *
 * @example
 * ```typescript
 * const overdue = await listContractObligations('contract-uuid', {
 *   overdueOnly: true,
 *   statuses: ['pending', 'in_progress']
 * });
 * ```
 */
export declare const listContractObligations: (contractId: string, filters?: {
    statuses?: ObligationStatus[];
    responsibleParty?: string;
    overdueOnly?: boolean;
}) => Promise<ContractObligation[]>;
/**
 * 30. Updates obligation status.
 *
 * @param {string} obligationId - Obligation ID
 * @param {ObligationStatus} status - New status
 * @param {string} [completedBy] - User completing obligation
 * @param {string} [notes] - Update notes
 * @returns {Promise<ContractObligation>} Updated obligation
 *
 * @example
 * ```typescript
 * const updated = await updateObligationStatus('obligation-uuid', 'completed', 'user-uuid',
 *   'Report submitted and reviewed'
 * );
 * ```
 */
export declare const updateObligationStatus: (obligationId: string, status: ObligationStatus, completedBy?: string, notes?: string) => Promise<ContractObligation>;
/**
 * 31. Sends obligation reminder notifications.
 *
 * @param {string[]} obligationIds - Obligation IDs to remind
 * @param {number} [daysBefore] - Days before due date to remind
 * @returns {Promise<{ sent: number; failed: number }>} Notification results
 *
 * @example
 * ```typescript
 * const result = await sendObligationReminders(['obl-1', 'obl-2'], 7);
 * console.log(`Sent ${result.sent} reminders`);
 * ```
 */
export declare const sendObligationReminders: (obligationIds: string[], daysBefore?: number) => Promise<{
    sent: number;
    failed: number;
}>;
/**
 * 32. Generates obligation compliance report.
 *
 * @param {string} contractId - Contract ID
 * @param {Date} [fromDate] - Start date
 * @param {Date} [toDate] - End date
 * @returns {Promise<string>} JSON compliance report
 *
 * @example
 * ```typescript
 * const report = await generateObligationComplianceReport('contract-uuid',
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * ```
 */
export declare const generateObligationComplianceReport: (contractId: string, fromDate?: Date, toDate?: Date) => Promise<string>;
/**
 * 33. Links obligation to milestone.
 *
 * @param {string} obligationId - Obligation ID
 * @param {string} milestoneId - Milestone ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await linkObligationToMilestone('obligation-uuid', 'milestone-uuid');
 * // Obligation completion will trigger milestone progress
 * ```
 */
export declare const linkObligationToMilestone: (obligationId: string, milestoneId: string) => Promise<void>;
/**
 * 34. Calculates obligation dependency chain.
 *
 * @param {string} obligationId - Obligation ID
 * @returns {Promise<{ dependencies: string[]; dependents: string[]; critical: boolean }>} Dependency analysis
 *
 * @example
 * ```typescript
 * const analysis = await calculateObligationDependencies('obligation-uuid');
 * if (analysis.critical) {
 *   console.log('This obligation blocks:', analysis.dependents);
 * }
 * ```
 */
export declare const calculateObligationDependencies: (obligationId: string) => Promise<{
    dependencies: string[];
    dependents: string[];
    critical: boolean;
}>;
/**
 * 35. Configures automatic contract renewal.
 *
 * @param {string} contractId - Contract ID
 * @param {RenewalConfig} config - Renewal configuration
 * @returns {Promise<RenewalConfig>} Applied renewal configuration
 *
 * @example
 * ```typescript
 * const config = await configureAutoRenewal('contract-uuid', {
 *   autoRenew: true,
 *   renewalNoticeDays: 90,
 *   renewalTerm: 12,
 *   renewalTermUnit: 'months',
 *   maxRenewals: 3,
 *   priceAdjustment: { type: 'percentage', value: 3 },
 *   renewalApprovalRequired: true
 * });
 * ```
 */
export declare const configureAutoRenewal: (contractId: string, config: RenewalConfig) => Promise<RenewalConfig>;
/**
 * 36. Identifies contracts eligible for renewal.
 *
 * @param {number} daysThreshold - Days until expiration threshold
 * @param {ContractStatus[]} [statuses] - Contract statuses to include
 * @returns {Promise<Array<{ contractId: string; daysUntilExpiration: number; autoRenew: boolean }>>} Eligible contracts
 *
 * @example
 * ```typescript
 * const eligible = await identifyRenewalEligibleContracts(90, ['active']);
 * // Returns contracts expiring in next 90 days
 * ```
 */
export declare const identifyRenewalEligibleContracts: (daysThreshold: number, statuses?: ContractStatus[]) => Promise<Array<{
    contractId: string;
    daysUntilExpiration: number;
    autoRenew: boolean;
}>>;
/**
 * 37. Generates renewal contract from original.
 *
 * @param {string} originalContractId - Original contract ID
 * @param {Partial<ContractAttributes>} renewalOverrides - Renewal modifications
 * @returns {Promise<Partial<ContractAttributes>>} Renewal contract data
 *
 * @example
 * ```typescript
 * const renewal = await generateRenewalContract('contract-uuid', {
 *   startDate: new Date('2026-01-01'),
 *   endDate: new Date('2027-01-01'),
 *   financialTerms: {
 *     ...originalTerms,
 *     totalValue: originalTerms.totalValue * 1.03 // 3% increase
 *   }
 * });
 * ```
 */
export declare const generateRenewalContract: (originalContractId: string, renewalOverrides: Partial<ContractAttributes>) => Promise<Partial<ContractAttributes>>;
/**
 * 38. Sends renewal notification to stakeholders.
 *
 * @param {string} contractId - Contract ID
 * @param {string[]} recipients - Recipient user IDs
 * @param {number} daysUntilExpiration - Days until contract expires
 * @returns {Promise<{ sent: boolean; messageId: string }>} Notification result
 *
 * @example
 * ```typescript
 * const result = await sendRenewalNotification('contract-uuid',
 *   ['owner-id', 'manager-id'],
 *   60
 * );
 * ```
 */
export declare const sendRenewalNotification: (contractId: string, recipients: string[], daysUntilExpiration: number) => Promise<{
    sent: boolean;
    messageId: string;
}>;
/**
 * 39. Calculates renewal price with adjustments.
 *
 * @param {FinancialTerms} originalTerms - Original financial terms
 * @param {RenewalConfig['priceAdjustment']} adjustment - Price adjustment configuration
 * @returns {{ newTotalValue: number; adjustmentAmount: number; adjustmentPercentage: number }} Calculated renewal price
 *
 * @example
 * ```typescript
 * const pricing = calculateRenewalPrice(originalTerms, {
 *   type: 'percentage',
 *   value: 5
 * });
 * console.log('New annual value:', pricing.newTotalValue);
 * ```
 */
export declare const calculateRenewalPrice: (originalTerms: FinancialTerms, adjustment?: RenewalConfig["priceAdjustment"]) => {
    newTotalValue: number;
    adjustmentAmount: number;
    adjustmentPercentage: number;
};
/**
 * 40. Tracks renewal history for contract.
 *
 * @param {string} contractId - Original contract ID
 * @returns {Promise<Array<{ renewalNumber: number; contractId: string; startDate: Date; endDate: Date; value: number }>>} Renewal history
 *
 * @example
 * ```typescript
 * const history = await getRenewalHistory('original-contract-uuid');
 * console.log(`Contract renewed ${history.length} times`);
 * ```
 */
export declare const getRenewalHistory: (contractId: string) => Promise<Array<{
    renewalNumber: number;
    contractId: string;
    startDate: Date;
    endDate: Date;
    value: number;
}>>;
/**
 * 41. Validates renewal eligibility.
 *
 * @param {string} contractId - Contract ID
 * @returns {Promise<{ eligible: boolean; reasons: string[]; checks: Record<string, boolean> }>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateRenewalEligibility('contract-uuid');
 * if (!eligibility.eligible) {
 *   console.log('Renewal blocked:', eligibility.reasons);
 * }
 * ```
 */
export declare const validateRenewalEligibility: (contractId: string) => Promise<{
    eligible: boolean;
    reasons: string[];
    checks: Record<string, boolean>;
}>;
/**
 * 42. Generates contract analytics dashboard data.
 *
 * @param {ContractSearchFilters} [filters] - Analytics filters
 * @returns {Promise<ContractAnalytics>} Analytics metrics
 *
 * @example
 * ```typescript
 * const analytics = await generateContractAnalytics({
 *   dateRange: {
 *     start: new Date('2025-01-01'),
 *     end: new Date('2025-12-31'),
 *     field: 'createdAt'
 *   },
 *   department: ['procurement', 'legal']
 * });
 * ```
 */
export declare const generateContractAnalytics: (filters?: ContractSearchFilters) => Promise<ContractAnalytics>;
/**
 * 43. Analyzes contract risk factors.
 *
 * @param {string} contractId - Contract ID
 * @returns {Promise<{ overallRisk: RiskLevel; factors: Array<{ factor: string; risk: RiskLevel; impact: string }> }>} Risk analysis
 *
 * @example
 * ```typescript
 * const riskAnalysis = await analyzeContractRisk('contract-uuid');
 * console.log('Overall risk:', riskAnalysis.overallRisk);
 * riskAnalysis.factors.forEach(f => console.log(`${f.factor}: ${f.risk}`));
 * ```
 */
export declare const analyzeContractRisk: (contractId: string) => Promise<{
    overallRisk: RiskLevel;
    factors: Array<{
        factor: string;
        risk: RiskLevel;
        impact: string;
    }>;
}>;
/**
 * 44. Generates contract spend analysis.
 *
 * @param {object} criteria - Analysis criteria
 * @param {Date} criteria.startDate - Start date
 * @param {Date} criteria.endDate - End date
 * @param {string} [criteria.groupBy] - Group by field (department, vendor, type)
 * @returns {Promise<{ total: number; byPeriod: any[]; byCategory: any[] }>} Spend analysis
 *
 * @example
 * ```typescript
 * const spendAnalysis = await generateContractSpendAnalysis({
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   groupBy: 'department'
 * });
 * ```
 */
export declare const generateContractSpendAnalysis: (criteria: {
    startDate: Date;
    endDate: Date;
    groupBy?: string;
}) => Promise<{
    total: number;
    byPeriod: any[];
    byCategory: any[];
}>;
/**
 * 45. Generates contract compliance summary.
 *
 * @param {string[]} [contractIds] - Specific contract IDs (empty for all)
 * @returns {Promise<{ compliant: number; nonCompliant: number; needsReview: number; issues: Array<{ contractId: string; issue: string; severity: string }> }>} Compliance summary
 *
 * @example
 * ```typescript
 * const compliance = await generateComplianceSummary();
 * console.log(`${compliance.compliant} contracts fully compliant`);
 * console.log(`${compliance.nonCompliant} contracts have compliance issues`);
 * ```
 */
export declare const generateComplianceSummary: (contractIds?: string[]) => Promise<{
    compliant: number;
    nonCompliant: number;
    needsReview: number;
    issues: Array<{
        contractId: string;
        issue: string;
        severity: string;
    }>;
}>;
/**
 * Contract Management Controller
 * Provides REST API endpoints for contract lifecycle management
 */
export declare class ContractsController {
    /**
     * Create new contract from template
     */
    createContract(createDto: {
        templateId?: string;
        title: string;
        type: ContractType;
        parties: ContractParty[];
        startDate: Date;
        endDate: Date;
        financialTerms?: FinancialTerms;
        ownerId: string;
    }): Promise<any>;
    /**
     * Get contract by ID
     */
    getContract(id: string): Promise<any>;
    /**
     * Search contracts
     */
    searchContracts(status?: ContractStatus, type?: ContractType, expiringInDays?: number): Promise<any>;
    /**
     * Update contract
     */
    updateContract(id: string, updateDto: Partial<ContractAttributes>): Promise<any>;
    /**
     * Get contract analytics
     */
    getAnalytics(): Promise<ContractAnalytics>;
}
/**
 * Contract Clauses Controller
 * Manages clause library and contract clauses
 */
export declare class ContractClausesController {
    /**
     * Add clause to contract
     */
    addClause(contractId: string, clauseDto: ContractClauseDefinition): Promise<any>;
    /**
     * Get contract clauses
     */
    getClauses(contractId: string): Promise<any>;
    /**
     * Suggest clauses for contract
     */
    getSuggestions(contractId: string, type: ContractType): Promise<any>;
}
/**
 * Contract Negotiations Controller
 * Handles contract negotiation workflows
 */
export declare class ContractNegotiationsController {
    /**
     * Initiate negotiation
     */
    initiateNegotiation(contractId: string, dto: {
        participants: string[];
        initiatedBy: string;
    }): Promise<any>;
    /**
     * Propose change
     */
    proposeChange(negotiationId: string, change: NegotiationChange): Promise<any>;
    /**
     * Respond to change
     */
    respondToChange(negotiationId: string, changeId: string, response: {
        status: NegotiationStatus;
        comment?: string;
        respondedBy: string;
    }): Promise<any>;
}
/**
 * Contract Obligations Controller
 * Manages contract obligations and milestones
 */
export declare class ContractObligationsController {
    /**
     * Create obligation
     */
    createObligation(contractId: string, obligation: ContractObligation): Promise<any>;
    /**
     * List obligations
     */
    listObligations(contractId: string, status?: ObligationStatus, overdueOnly?: boolean): Promise<any>;
    /**
     * Update obligation status
     */
    updateStatus(obligationId: string, dto: {
        status: ObligationStatus;
        completedBy?: string;
        notes?: string;
    }): Promise<any>;
}
/**
 * Contract Renewals Controller
 * Handles contract renewal workflows
 */
export declare class ContractRenewalsController {
    /**
     * Configure auto-renewal
     */
    configureRenewal(contractId: string, config: RenewalConfig): Promise<any>;
    /**
     * Generate renewal contract
     */
    generateRenewal(contractId: string, overrides: Partial<ContractAttributes>): Promise<any>;
    /**
     * Get renewal eligibility
     */
    checkEligibility(contractId: string): Promise<any>;
}
declare const _default: {
    createContractModel: (sequelize: Sequelize) => any;
    createContractClauseModel: (sequelize: Sequelize) => any;
    createContractNegotiationModel: (sequelize: Sequelize) => any;
    generateContractNumber: (type: ContractType, department?: string) => Promise<string>;
    createContractFromTemplate: (template: ContractTemplate, overrides: Partial<ContractAttributes>) => Promise<Partial<ContractAttributes>>;
    validateContractData: (contract: Partial<ContractAttributes>) => {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    extractContractMetadata: (contractContent: string) => Promise<Partial<ContractMetadata>>;
    setupApprovalWorkflow: (contractId: string, type: ContractType, value: number) => Promise<ApprovalStage[]>;
    duplicateContract: (sourceContract: ContractAttributes, modifications: Partial<ContractAttributes>) => Promise<Partial<ContractAttributes>>;
    calculateFinancialSummary: (financialTerms: FinancialTerms) => {
        total: number;
        paid: number;
        pending: number;
        overdue: number;
    };
    createStandardClause: (clauseData: ContractClauseDefinition, createdBy: string) => Promise<Partial<ContractClauseAttributes>>;
    searchClauseLibrary: (criteria: {
        categories?: ClauseCategory[];
        searchTerm?: string;
        mandatoryOnly?: boolean;
        riskLevels?: RiskLevel[];
        tags?: string[];
    }) => Promise<ContractClauseAttributes[]>;
    suggestClausesForContract: (contractType: ContractType, existingClauseIds?: string[]) => Promise<ContractClauseDefinition[]>;
    validateClauseCompliance: (clause: ContractClauseDefinition, requiredCompliance: string[]) => {
        compliant: boolean;
        missing: string[];
        suggestions: string[];
    };
    mergeClauseVariations: (variations: ContractClauseDefinition[]) => Promise<ContractClauseDefinition>;
    updateClauseUsageStats: (clauseId: string, contractId: string) => Promise<void>;
    exportClauseLibrary: (categories?: ClauseCategory[]) => Promise<{
        clauses: ContractClauseDefinition[];
        metadata: any;
    }>;
    createContractVersion: (contractId: string, changes: string, userId: string) => Promise<ContractVersion>;
    compareContractVersions: (version1: number, version2: number, contractId: string) => Promise<{
        additions: string[];
        deletions: string[];
        modifications: string[];
    }>;
    revertToVersion: (contractId: string, targetVersion: number, userId: string) => Promise<ContractVersion>;
    listContractVersions: (contractId: string) => Promise<ContractVersion[]>;
    generateVersionChecksum: (contractContent: string) => string;
    validateVersionIntegrity: (contractContent: string, storedChecksum: string) => boolean;
    getVersionChangeHistory: (contractId: string, fromDate?: Date, toDate?: Date) => Promise<Array<{
        version: number;
        changes: string;
        timestamp: Date;
        user: string;
    }>>;
    initiateNegotiation: (contractId: string, participants: string[], initiatedBy: string) => Promise<Partial<ContractNegotiationAttributes>>;
    proposeNegotiationChange: (negotiationId: string, change: NegotiationChange) => Promise<NegotiationChange>;
    respondToNegotiationChange: (negotiationId: string, changeId: string, response: {
        status: NegotiationStatus;
        counterProposal?: string;
        comment?: string;
        respondedBy: string;
    }) => Promise<NegotiationChange>;
    getNegotiationStatus: (negotiationId: string) => Promise<{
        total: number;
        pending: number;
        accepted: number;
        rejected: number;
        countered: number;
    }>;
    completeNegotiation: (negotiationId: string, completedBy: string) => Promise<{
        version: number;
        appliedChanges: number;
    }>;
    generateNegotiationReport: (negotiationId: string) => Promise<string>;
    createContractObligation: (contractId: string, obligation: ContractObligation) => Promise<ContractObligation>;
    listContractObligations: (contractId: string, filters?: {
        statuses?: ObligationStatus[];
        responsibleParty?: string;
        overdueOnly?: boolean;
    }) => Promise<ContractObligation[]>;
    updateObligationStatus: (obligationId: string, status: ObligationStatus, completedBy?: string, notes?: string) => Promise<ContractObligation>;
    sendObligationReminders: (obligationIds: string[], daysBefore?: number) => Promise<{
        sent: number;
        failed: number;
    }>;
    generateObligationComplianceReport: (contractId: string, fromDate?: Date, toDate?: Date) => Promise<string>;
    linkObligationToMilestone: (obligationId: string, milestoneId: string) => Promise<void>;
    calculateObligationDependencies: (obligationId: string) => Promise<{
        dependencies: string[];
        dependents: string[];
        critical: boolean;
    }>;
    configureAutoRenewal: (contractId: string, config: RenewalConfig) => Promise<RenewalConfig>;
    identifyRenewalEligibleContracts: (daysThreshold: number, statuses?: ContractStatus[]) => Promise<Array<{
        contractId: string;
        daysUntilExpiration: number;
        autoRenew: boolean;
    }>>;
    generateRenewalContract: (originalContractId: string, renewalOverrides: Partial<ContractAttributes>) => Promise<Partial<ContractAttributes>>;
    sendRenewalNotification: (contractId: string, recipients: string[], daysUntilExpiration: number) => Promise<{
        sent: boolean;
        messageId: string;
    }>;
    calculateRenewalPrice: (originalTerms: FinancialTerms, adjustment?: RenewalConfig["priceAdjustment"]) => {
        newTotalValue: number;
        adjustmentAmount: number;
        adjustmentPercentage: number;
    };
    getRenewalHistory: (contractId: string) => Promise<Array<{
        renewalNumber: number;
        contractId: string;
        startDate: Date;
        endDate: Date;
        value: number;
    }>>;
    validateRenewalEligibility: (contractId: string) => Promise<{
        eligible: boolean;
        reasons: string[];
        checks: Record<string, boolean>;
    }>;
    generateContractAnalytics: (filters?: ContractSearchFilters) => Promise<ContractAnalytics>;
    analyzeContractRisk: (contractId: string) => Promise<{
        overallRisk: RiskLevel;
        factors: Array<{
            factor: string;
            risk: RiskLevel;
            impact: string;
        }>;
    }>;
    generateContractSpendAnalysis: (criteria: {
        startDate: Date;
        endDate: Date;
        groupBy?: string;
    }) => Promise<{
        total: number;
        byPeriod: any[];
        byCategory: any[];
    }>;
    generateComplianceSummary: (contractIds?: string[]) => Promise<{
        compliant: number;
        nonCompliant: number;
        needsReview: number;
        issues: Array<{
            contractId: string;
            issue: string;
            severity: string;
        }>;
    }>;
};
export default _default;
//# sourceMappingURL=document-contract-management-kit.d.ts.map