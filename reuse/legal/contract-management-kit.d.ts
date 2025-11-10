/**
 * LOC: CONTRACT_MGMT_KIT_001
 * File: /reuse/legal/contract-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - diff
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - Contract workflow controllers
 *   - Clause library services
 *   - Obligation tracking services
 *   - Contract analytics services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Contract status lifecycle
 */
export declare enum ContractStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    IN_NEGOTIATION = "in_negotiation",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    ACTIVE = "active",
    EXPIRED = "expired",
    TERMINATED = "terminated",
    RENEWED = "renewed",
    ARCHIVED = "archived"
}
/**
 * Contract type categories
 */
export declare enum ContractType {
    PROVIDER_AGREEMENT = "provider_agreement",
    VENDOR_CONTRACT = "vendor_contract",
    SERVICE_AGREEMENT = "service_agreement",
    PATIENT_CONSENT = "patient_consent",
    INSURANCE_CONTRACT = "insurance_contract",
    EMPLOYMENT_CONTRACT = "employment_contract",
    NDA = "nda",
    SLA = "sla",
    LEASE_AGREEMENT = "lease_agreement",
    LICENSING_AGREEMENT = "licensing_agreement",
    PARTNERSHIP_AGREEMENT = "partnership_agreement",
    OTHER = "other"
}
/**
 * Clause category types
 */
export declare enum ClauseCategory {
    PAYMENT_TERMS = "payment_terms",
    CONFIDENTIALITY = "confidentiality",
    LIABILITY = "liability",
    INDEMNIFICATION = "indemnification",
    TERMINATION = "termination",
    DISPUTE_RESOLUTION = "dispute_resolution",
    INTELLECTUAL_PROPERTY = "intellectual_property",
    DATA_PROTECTION = "data_protection",
    COMPLIANCE = "compliance",
    FORCE_MAJEURE = "force_majeure",
    GOVERNING_LAW = "governing_law",
    AMENDMENT = "amendment",
    RENEWAL = "renewal",
    ASSIGNMENT = "assignment",
    NOTICES = "notices",
    HIPAA_COMPLIANCE = "hipaa_compliance",
    OTHER = "other"
}
/**
 * Obligation status tracking
 */
export declare enum ObligationStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    OVERDUE = "overdue",
    WAIVED = "waived",
    DISPUTED = "disputed"
}
/**
 * Obligation priority levels
 */
export declare enum ObligationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Contract party role types
 */
export declare enum PartyRole {
    PROVIDER = "provider",
    CLIENT = "client",
    VENDOR = "vendor",
    PATIENT = "patient",
    INSURER = "insurer",
    EMPLOYER = "employer",
    EMPLOYEE = "employee",
    LICENSOR = "licensor",
    LICENSEE = "licensee",
    PARTNER = "partner",
    OTHER = "other"
}
/**
 * Contract version action types
 */
export declare enum VersionAction {
    CREATED = "created",
    UPDATED = "updated",
    AMENDED = "amended",
    RESTORED = "restored",
    ARCHIVED = "archived"
}
/**
 * Contract approval decision
 */
export declare enum ApprovalDecision {
    APPROVED = "approved",
    REJECTED = "rejected",
    REQUIRES_CHANGES = "requires_changes"
}
/**
 * Base contract entity interface
 */
export interface Contract {
    id: string;
    contractNumber: string;
    title: string;
    description?: string;
    contractType: ContractType;
    status: ContractStatus;
    version: number;
    effectiveDate: Date;
    expirationDate?: Date;
    autoRenew: boolean;
    renewalNoticeDays?: number;
    terminationNoticeDays?: number;
    totalValue?: number;
    currency?: string;
    parties: ContractParty[];
    clauses: ContractClause[];
    obligations: ContractObligation[];
    metadata: ContractMetadata;
    templateId?: string;
    parentContractId?: string;
    documentUrl?: string;
    signedDocumentUrl?: string;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Contract metadata
 */
export interface ContractMetadata {
    tags: string[];
    category?: string;
    department?: string;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    complianceFlags: string[];
    customFields: Record<string, any>;
    attachments: ContractAttachment[];
    relatedContracts: string[];
    notes?: string;
}
/**
 * Contract party information
 */
export interface ContractParty {
    id: string;
    contractId: string;
    role: PartyRole;
    entityType: 'individual' | 'organization';
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    organizationId?: string;
    userId?: string;
    signatureRequired: boolean;
    signedAt?: Date;
    signatureUrl?: string;
    isPrimary: boolean;
    metadata: Record<string, any>;
}
/**
 * Contract clause entity
 */
export interface ContractClause {
    id: string;
    contractId?: string;
    libraryClauseId?: string;
    category: ClauseCategory;
    title: string;
    content: string;
    order: number;
    required: boolean;
    editable: boolean;
    variables: ClauseVariable[];
    metadata: Record<string, any>;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Clause variable definition
 */
export interface ClauseVariable {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
    value?: any;
    required: boolean;
    defaultValue?: any;
    validation?: string;
    description?: string;
}
/**
 * Contract obligation entity
 */
export interface ContractObligation {
    id: string;
    contractId: string;
    title: string;
    description: string;
    responsibleParty: PartyRole;
    assignedTo?: string;
    dueDate: Date;
    completedDate?: Date;
    status: ObligationStatus;
    priority: ObligationPriority;
    recurring: boolean;
    recurrencePattern?: string;
    reminderDays: number[];
    dependencies: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Contract template entity
 */
export interface ContractTemplate {
    id: string;
    name: string;
    description?: string;
    contractType: ContractType;
    content: string;
    variables: TemplateVariable[];
    defaultClauses: string[];
    requiredClauses: string[];
    version: number;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Template variable definition
 */
export interface TemplateVariable {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'party' | 'clause';
    required: boolean;
    defaultValue?: any;
    validation?: string;
    description?: string;
    options?: any[];
}
/**
 * Contract version history
 */
export interface ContractVersion {
    id: string;
    contractId: string;
    version: number;
    action: VersionAction;
    content: string;
    changes: VersionChange[];
    checksum: string;
    createdBy: string;
    createdAt: Date;
    metadata: Record<string, any>;
}
/**
 * Version change tracking
 */
export interface VersionChange {
    field: string;
    oldValue: any;
    newValue: any;
    changeType: 'added' | 'modified' | 'removed';
}
/**
 * Contract comparison result
 */
export interface ContractComparison {
    contractId1: string;
    contractId2: string;
    version1: number;
    version2: number;
    differences: ContractDifference[];
    similarity: number;
    comparedAt: Date;
}
/**
 * Contract difference detail
 */
export interface ContractDifference {
    section: string;
    type: 'added' | 'removed' | 'modified';
    content1?: string;
    content2?: string;
    severity: 'minor' | 'moderate' | 'major';
}
/**
 * Contract attachment
 */
export interface ContractAttachment {
    id: string;
    name: string;
    url: string;
    mimeType: string;
    size: number;
    uploadedBy: string;
    uploadedAt: Date;
}
/**
 * Contract search filters
 */
export interface ContractSearchFilters {
    query?: string;
    contractTypes?: ContractType[];
    statuses?: ContractStatus[];
    parties?: string[];
    tags?: string[];
    effectiveDateFrom?: Date;
    effectiveDateTo?: Date;
    expirationDateFrom?: Date;
    expirationDateTo?: Date;
    minValue?: number;
    maxValue?: number;
    riskLevels?: string[];
    departments?: string[];
    tenantId?: string;
}
/**
 * Obligation reminder configuration
 */
export interface ObligationReminder {
    obligationId: string;
    daysBeforeDue: number;
    recipients: string[];
    sent: boolean;
    sentAt?: Date;
    nextReminderDate?: Date;
}
/**
 * Contract approval workflow
 */
export interface ContractApproval {
    id: string;
    contractId: string;
    approverUserId: string;
    approverRole: string;
    decision?: ApprovalDecision;
    comments?: string;
    decidedAt?: Date;
    order: number;
    required: boolean;
}
/**
 * Contract renewal configuration
 */
export interface ContractRenewal {
    contractId: string;
    autoRenew: boolean;
    renewalTerm: number;
    renewalTermUnit: 'days' | 'months' | 'years';
    noticePeriodDays: number;
    renewalDate?: Date;
    renewedContractId?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
}
/**
 * Contract creation schema
 */
export declare const ContractCreateSchema: any;
/**
 * Contract party schema
 */
export declare const ContractPartySchema: any;
/**
 * Clause creation schema
 */
export declare const ClauseCreateSchema: any;
/**
 * Obligation creation schema
 */
export declare const ObligationCreateSchema: any;
/**
 * Template variable schema
 */
export declare const TemplateVariableSchema: any;
/**
 * Contract Sequelize Model
 */
export declare class ContractModel extends Model {
    id: string;
    contractNumber: string;
    title: string;
    description?: string;
    contractType: ContractType;
    status: ContractStatus;
    version: number;
    effectiveDate: Date;
    expirationDate?: Date;
    autoRenew: boolean;
    renewalNoticeDays?: number;
    terminationNoticeDays?: number;
    totalValue?: number;
    currency?: string;
    metadata: ContractMetadata;
    templateId?: string;
    parentContractId?: string;
    documentUrl?: string;
    signedDocumentUrl?: string;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    parties: ContractPartyModel[];
    clauses: ContractClauseModel[];
    obligations: ContractObligationModel[];
    versions: ContractVersionModel[];
}
/**
 * Contract Party Sequelize Model
 */
export declare class ContractPartyModel extends Model {
    id: string;
    contractId: string;
    role: PartyRole;
    entityType: 'individual' | 'organization';
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    organizationId?: string;
    userId?: string;
    signatureRequired: boolean;
    signedAt?: Date;
    signatureUrl?: string;
    isPrimary: boolean;
    metadata: Record<string, any>;
    contract: ContractModel;
}
/**
 * Contract Clause Sequelize Model
 */
export declare class ContractClauseModel extends Model {
    id: string;
    contractId?: string;
    libraryClauseId?: string;
    category: ClauseCategory;
    title: string;
    content: string;
    order: number;
    required: boolean;
    editable: boolean;
    variables: ClauseVariable[];
    metadata: Record<string, any>;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    contract?: ContractModel;
}
/**
 * Contract Obligation Sequelize Model
 */
export declare class ContractObligationModel extends Model {
    id: string;
    contractId: string;
    title: string;
    description: string;
    responsibleParty: PartyRole;
    assignedTo?: string;
    dueDate: Date;
    completedDate?: Date;
    status: ObligationStatus;
    priority: ObligationPriority;
    recurring: boolean;
    recurrencePattern?: string;
    reminderDays: number[];
    dependencies: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    contract: ContractModel;
}
/**
 * Contract Template Sequelize Model
 */
export declare class ContractTemplateModel extends Model {
    id: string;
    name: string;
    description?: string;
    contractType: ContractType;
    content: string;
    variables: TemplateVariable[];
    defaultClauses: string[];
    requiredClauses: string[];
    version: number;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Contract Version Sequelize Model
 */
export declare class ContractVersionModel extends Model {
    id: string;
    contractId: string;
    version: number;
    action: VersionAction;
    content: string;
    changes: VersionChange[];
    checksum: string;
    createdBy: string;
    createdAt: Date;
    metadata: Record<string, any>;
    contract: ContractModel;
}
/**
 * Register contract management configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerContractConfig()],
 * })
 * ```
 */
export declare function registerContractConfig(): any;
/**
 * Create contract management configuration module
 *
 * @returns DynamicModule for contract config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createContractConfigModule()],
 * })
 * export class ContractModule {}
 * ```
 */
export declare function createContractConfigModule(): DynamicModule;
/**
 * Generate unique contract number
 *
 * @param configService - Configuration service
 * @returns Unique contract number
 *
 * @example
 * ```typescript
 * const contractNumber = await generateContractNumber(configService);
 * // 'CTR-2025-001234'
 * ```
 */
export declare function generateContractNumber(configService: ConfigService): Promise<string>;
/**
 * Create new contract from template or scratch
 *
 * @param data - Contract creation data
 * @param userId - User creating the contract
 * @param configService - Configuration service
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContract({
 *   title: 'Provider Service Agreement',
 *   contractType: ContractType.PROVIDER_AGREEMENT,
 *   effectiveDate: new Date('2025-01-01'),
 *   templateId: 'tmpl_123',
 * }, 'user_456', configService);
 * ```
 */
export declare function createContract(data: z.infer<typeof ContractCreateSchema>, userId: string, configService: ConfigService): Promise<Contract>;
/**
 * Create contract from template with variable substitution
 *
 * @param templateId - Template ID
 * @param variables - Template variable values
 * @param userId - User creating contract
 * @param repository - Template repository
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContractFromTemplate(
 *   'tmpl_provider_agreement',
 *   {
 *     providerName: 'Dr. John Smith',
 *     effectiveDate: new Date(),
 *     annualFee: 50000,
 *   },
 *   'user_123',
 *   templateRepo
 * );
 * ```
 */
export declare function createContractFromTemplate(templateId: string, variables: Record<string, any>, userId: string, repository: any): Promise<Contract>;
/**
 * Validate template variables against requirements
 *
 * @param templateVars - Template variable definitions
 * @param providedVars - Provided variable values
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * await validateTemplateVariables(template.variables, userProvidedVars);
 * ```
 */
export declare function validateTemplateVariables(templateVars: TemplateVariable[], providedVars: Record<string, any>): Promise<void>;
/**
 * Substitute variables in template content
 *
 * @param content - Template content
 * @param variables - Variable values
 * @returns Content with substituted variables
 *
 * @example
 * ```typescript
 * const result = substituteTemplateVariables(
 *   'Provider: {{providerName}}, Fee: {{annualFee}}',
 *   { providerName: 'Dr. Smith', annualFee: 50000 }
 * );
 * // 'Provider: Dr. Smith, Fee: 50000'
 * ```
 */
export declare function substituteTemplateVariables(content: string, variables: Record<string, any>): string;
/**
 * Create clause in library
 *
 * @param data - Clause creation data
 * @param userId - User creating clause
 * @returns Created clause
 *
 * @example
 * ```typescript
 * const clause = await createClause({
 *   category: ClauseCategory.PAYMENT_TERMS,
 *   title: 'Standard Payment Terms',
 *   content: 'Payment due within 30 days...',
 * }, 'user_123');
 * ```
 */
export declare function createClause(data: z.infer<typeof ClauseCreateSchema>, userId: string): Promise<ContractClause>;
/**
 * Add clause to contract
 *
 * @param contractId - Contract ID
 * @param clauseId - Clause ID from library
 * @param order - Clause order in contract
 * @param repository - Clause repository
 * @returns Added clause
 *
 * @example
 * ```typescript
 * const clause = await addClauseToContract(
 *   'contract_123',
 *   'clause_456',
 *   2,
 *   clauseRepo
 * );
 * ```
 */
export declare function addClauseToContract(contractId: string, clauseId: string, order: number, repository: any): Promise<ContractClause>;
/**
 * Search clauses by category and keywords
 *
 * @param category - Clause category
 * @param keywords - Search keywords
 * @param repository - Clause repository
 * @returns Matching clauses
 *
 * @example
 * ```typescript
 * const clauses = await searchClauses(
 *   ClauseCategory.PAYMENT_TERMS,
 *   'net 30',
 *   clauseRepo
 * );
 * ```
 */
export declare function searchClauses(category: ClauseCategory | undefined, keywords: string | undefined, repository: any): Promise<ContractClause[]>;
/**
 * Detect conflicting clauses in contract
 *
 * @param clauses - Contract clauses
 * @returns Array of potential conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectClauseConflicts(contract.clauses);
 * if (conflicts.length > 0) {
 *   console.warn('Clause conflicts detected:', conflicts);
 * }
 * ```
 */
export declare function detectClauseConflicts(clauses: ContractClause[]): Array<{
    clause1: string;
    clause2: string;
    reason: string;
}>;
/**
 * Create new version of contract
 *
 * @param contractId - Contract ID
 * @param content - Updated contract content
 * @param changes - Description of changes
 * @param userId - User making changes
 * @returns Contract version
 *
 * @example
 * ```typescript
 * const version = await createContractVersion(
 *   'contract_123',
 *   updatedContent,
 *   'Updated payment terms',
 *   'user_456'
 * );
 * ```
 */
export declare function createContractVersion(contractId: string, content: string, changes: VersionChange[], userId: string): Promise<ContractVersion>;
/**
 * Get version history for contract
 *
 * @param contractId - Contract ID
 * @param repository - Version repository
 * @returns Array of versions
 *
 * @example
 * ```typescript
 * const history = await getContractVersionHistory('contract_123', versionRepo);
 * ```
 */
export declare function getContractVersionHistory(contractId: string, repository: any): Promise<ContractVersion[]>;
/**
 * Compare two contract versions
 *
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison result with differences
 *
 * @example
 * ```typescript
 * const comparison = await compareContractVersions(v1, v2);
 * console.log(`Similarity: ${comparison.similarity}%`);
 * ```
 */
export declare function compareContractVersions(version1: ContractVersion, version2: ContractVersion): Promise<ContractComparison>;
/**
 * Restore contract to specific version
 *
 * @param contractId - Contract ID
 * @param versionNumber - Version number to restore
 * @param userId - User performing restoration
 * @param repository - Version repository
 *
 * @example
 * ```typescript
 * await restoreContractVersion('contract_123', 3, 'user_456', versionRepo);
 * ```
 */
export declare function restoreContractVersion(contractId: string, versionNumber: number, userId: string, repository: any): Promise<void>;
/**
 * Create contract obligation
 *
 * @param contractId - Contract ID
 * @param data - Obligation creation data
 * @param userId - User creating obligation
 * @returns Created obligation
 *
 * @example
 * ```typescript
 * const obligation = await createObligation('contract_123', {
 *   title: 'Monthly Report Submission',
 *   description: 'Submit monthly performance report',
 *   responsibleParty: PartyRole.PROVIDER,
 *   dueDate: new Date('2025-02-01'),
 *   priority: ObligationPriority.HIGH,
 *   recurring: true,
 *   recurrencePattern: 'monthly',
 * }, 'user_456');
 * ```
 */
export declare function createObligation(contractId: string, data: z.infer<typeof ObligationCreateSchema>, userId: string): Promise<ContractObligation>;
/**
 * Get upcoming obligations within date range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param repository - Obligation repository
 * @returns Array of obligations
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingObligations(
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   obligationRepo
 * );
 * ```
 */
export declare function getUpcomingObligations(startDate: Date, endDate: Date, repository: any): Promise<ContractObligation[]>;
/**
 * Get overdue obligations
 *
 * @param repository - Obligation repository
 * @returns Array of overdue obligations
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueObligations(obligationRepo);
 * ```
 */
export declare function getOverdueObligations(repository: any): Promise<ContractObligation[]>;
/**
 * Complete obligation
 *
 * @param obligationId - Obligation ID
 * @param userId - User completing obligation
 * @param repository - Obligation repository
 *
 * @example
 * ```typescript
 * await completeObligation('obligation_123', 'user_456', obligationRepo);
 * ```
 */
export declare function completeObligation(obligationId: string, userId: string, repository: any): Promise<void>;
/**
 * Send obligation reminders for upcoming deadlines
 *
 * @param daysAhead - Days to look ahead
 * @param repository - Obligation repository
 * @returns Number of reminders sent
 *
 * @example
 * ```typescript
 * const count = await sendObligationReminders(7, obligationRepo);
 * ```
 */
export declare function sendObligationReminders(daysAhead: number, repository: any): Promise<number>;
/**
 * Search contracts with filters
 *
 * @param filters - Search filters
 * @param repository - Contract repository
 * @returns Matching contracts
 *
 * @example
 * ```typescript
 * const contracts = await searchContracts({
 *   query: 'provider agreement',
 *   contractTypes: [ContractType.PROVIDER_AGREEMENT],
 *   statuses: [ContractStatus.ACTIVE],
 *   effectiveDateFrom: new Date('2025-01-01'),
 * }, contractRepo);
 * ```
 */
export declare function searchContracts(filters: ContractSearchFilters, repository: any): Promise<Contract[]>;
/**
 * Get contract by contract number
 *
 * @param contractNumber - Contract number
 * @param repository - Contract repository
 * @returns Contract
 *
 * @example
 * ```typescript
 * const contract = await getContractByNumber('CTR-2025-001234', contractRepo);
 * ```
 */
export declare function getContractByNumber(contractNumber: string, repository: any): Promise<Contract>;
/**
 * Get contracts expiring soon
 *
 * @param daysAhead - Days to look ahead
 * @param repository - Contract repository
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getContractsExpiringSoon(30, contractRepo);
 * ```
 */
export declare function getContractsExpiringSoon(daysAhead: number, repository: any): Promise<Contract[]>;
/**
 * Contract Management Service
 * NestJS service for contract operations with dependency injection
 */
export declare class ContractManagementService {
    private contractRepo;
    private clauseRepo;
    private obligationRepo;
    private versionRepo;
    private configService;
    private readonly logger;
    constructor(contractRepo: typeof ContractModel, clauseRepo: typeof ContractClauseModel, obligationRepo: typeof ContractObligationModel, versionRepo: typeof ContractVersionModel, configService: ConfigService);
    /**
     * Create new contract
     */
    create(data: z.infer<typeof ContractCreateSchema>, userId: string): Promise<Contract>;
    /**
     * Get contract by ID
     */
    findById(id: string): Promise<Contract>;
    /**
     * Search contracts
     */
    search(filters: ContractSearchFilters): Promise<Contract[]>;
    /**
     * Update contract status
     */
    updateStatus(id: string, status: ContractStatus, userId: string): Promise<void>;
    /**
     * Add clause to contract
     */
    addClause(contractId: string, clauseId: string, order: number): Promise<ContractClause>;
    /**
     * Create obligation
     */
    createObligation(contractId: string, data: z.infer<typeof ObligationCreateSchema>, userId: string): Promise<ContractObligation>;
    /**
     * Get version history
     */
    getVersionHistory(contractId: string): Promise<ContractVersion[]>;
}
/**
 * Contract DTO for API documentation
 */
export declare class ContractDto {
    id: string;
    contractNumber: string;
    title: string;
    description?: string;
    contractType: ContractType;
    status: ContractStatus;
    version: number;
    effectiveDate: Date;
    expirationDate?: Date;
    autoRenew: boolean;
    totalValue?: number;
    currency?: string;
}
/**
 * Create Contract DTO
 */
export declare class CreateContractDto {
    title: string;
    description?: string;
    contractType: ContractType;
    effectiveDate: Date;
    expirationDate?: Date;
    autoRenew?: boolean;
    totalValue?: number;
    currency?: string;
    templateId?: string;
}
/**
 * Obligation DTO
 */
export declare class ObligationDto {
    id: string;
    contractId: string;
    title: string;
    description: string;
    responsibleParty: PartyRole;
    dueDate: Date;
    status: ObligationStatus;
    priority: ObligationPriority;
    recurring: boolean;
}
declare const _default: {
    registerContractConfig: typeof registerContractConfig;
    createContractConfigModule: typeof createContractConfigModule;
    generateContractNumber: typeof generateContractNumber;
    createContract: typeof createContract;
    createContractFromTemplate: typeof createContractFromTemplate;
    validateTemplateVariables: typeof validateTemplateVariables;
    substituteTemplateVariables: typeof substituteTemplateVariables;
    createClause: typeof createClause;
    addClauseToContract: typeof addClauseToContract;
    searchClauses: typeof searchClauses;
    detectClauseConflicts: typeof detectClauseConflicts;
    createContractVersion: typeof createContractVersion;
    getContractVersionHistory: typeof getContractVersionHistory;
    compareContractVersions: typeof compareContractVersions;
    restoreContractVersion: typeof restoreContractVersion;
    createObligation: typeof createObligation;
    getUpcomingObligations: typeof getUpcomingObligations;
    getOverdueObligations: typeof getOverdueObligations;
    completeObligation: typeof completeObligation;
    sendObligationReminders: typeof sendObligationReminders;
    searchContracts: typeof searchContracts;
    getContractByNumber: typeof getContractByNumber;
    getContractsExpiringSoon: typeof getContractsExpiringSoon;
    ContractManagementService: typeof ContractManagementService;
};
export default _default;
//# sourceMappingURL=contract-management-kit.d.ts.map