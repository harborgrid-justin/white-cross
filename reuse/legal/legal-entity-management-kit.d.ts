/**
 * LOC: LEGAL_ENTITY_MGMT_KIT_001
 * File: /reuse/legal/legal-entity-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal entity modules
 *   - Corporate structure controllers
 *   - Ownership tracking services
 *   - Compliance calendar services
 *   - Entity search services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model, Sequelize } from 'sequelize-typescript';
/**
 * Legal entity status lifecycle
 */
export declare enum EntityStatus {
    PLANNED = "planned",
    FORMATION_IN_PROGRESS = "formation_in_progress",
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    DISSOLVED = "dissolved",
    MERGED = "merged",
    ACQUIRED = "acquired",
    BANKRUPTCY = "bankruptcy",
    GOOD_STANDING = "good_standing",
    NOT_IN_GOOD_STANDING = "not_in_good_standing",
    REVOKED = "revoked",
    WITHDRAWN = "withdrawn"
}
/**
 * Legal entity type categories
 */
export declare enum EntityType {
    CORPORATION = "corporation",
    LLC = "llc",
    LLP = "llp",
    PARTNERSHIP = "partnership",
    SOLE_PROPRIETORSHIP = "sole_proprietorship",
    NONPROFIT = "nonprofit",
    PROFESSIONAL_CORPORATION = "professional_corporation",
    S_CORPORATION = "s_corporation",
    C_CORPORATION = "c_corporation",
    BENEFIT_CORPORATION = "benefit_corporation",
    COOPERATIVE = "cooperative",
    JOINT_VENTURE = "joint_venture",
    TRUST = "trust",
    HOLDING_COMPANY = "holding_company",
    SUBSIDIARY = "subsidiary",
    BRANCH = "branch",
    DIVISION = "division",
    OTHER = "other"
}
/**
 * Tax classification types
 */
export declare enum TaxClassification {
    C_CORP = "c_corp",
    S_CORP = "s_corp",
    PARTNERSHIP = "partnership",
    DISREGARDED_ENTITY = "disregarded_entity",
    TRUST = "trust",
    NONPROFIT_501C3 = "nonprofit_501c3",
    NONPROFIT_501C4 = "nonprofit_501c4",
    NONPROFIT_501C6 = "nonprofit_501c6",
    OTHER = "other"
}
/**
 * Officer/Director role types
 */
export declare enum OfficerRole {
    CEO = "ceo",
    CFO = "cfo",
    COO = "coo",
    CTO = "cto",
    PRESIDENT = "president",
    VICE_PRESIDENT = "vice_president",
    SECRETARY = "secretary",
    TREASURER = "treasurer",
    DIRECTOR = "director",
    BOARD_CHAIR = "board_chair",
    MANAGING_MEMBER = "managing_member",
    MEMBER = "member",
    PARTNER = "partner",
    MANAGING_PARTNER = "managing_partner",
    GENERAL_PARTNER = "general_partner",
    LIMITED_PARTNER = "limited_partner",
    REGISTERED_AGENT = "registered_agent",
    OTHER = "other"
}
/**
 * Compliance event types
 */
export declare enum ComplianceEventType {
    ANNUAL_REPORT = "annual_report",
    TAX_FILING = "tax_filing",
    FRANCHISE_TAX = "franchise_tax",
    REGISTRATION_RENEWAL = "registration_renewal",
    LICENSE_RENEWAL = "license_renewal",
    BOARD_MEETING = "board_meeting",
    SHAREHOLDER_MEETING = "shareholder_meeting",
    REGULATORY_FILING = "regulatory_filing",
    AUDIT = "audit",
    PERMIT_RENEWAL = "permit_renewal",
    INSURANCE_RENEWAL = "insurance_renewal",
    ACCREDITATION_RENEWAL = "accreditation_renewal",
    CERTIFICATION_RENEWAL = "certification_renewal",
    OTHER = "other"
}
/**
 * Compliance event status
 */
export declare enum ComplianceStatus {
    UPCOMING = "upcoming",
    DUE_SOON = "due_soon",
    OVERDUE = "overdue",
    COMPLETED = "completed",
    FILED = "filed",
    WAIVED = "waived",
    NOT_APPLICABLE = "not_applicable"
}
/**
 * Ownership type
 */
export declare enum OwnershipType {
    COMMON_STOCK = "common_stock",
    PREFERRED_STOCK = "preferred_stock",
    MEMBERSHIP_INTEREST = "membership_interest",
    PARTNERSHIP_INTEREST = "partnership_interest",
    EQUITY_OPTION = "equity_option",
    WARRANT = "warrant",
    CONVERTIBLE_NOTE = "convertible_note",
    OTHER = "other"
}
/**
 * Entity relationship types
 */
export declare enum EntityRelationshipType {
    PARENT = "parent",
    SUBSIDIARY = "subsidiary",
    AFFILIATE = "affiliate",
    SISTER_COMPANY = "sister_company",
    PREDECESSOR = "predecessor",
    SUCCESSOR = "successor",
    MERGED_INTO = "merged_into",
    ACQUIRED_BY = "acquired_by",
    JOINT_VENTURE_PARTNER = "joint_venture_partner",
    OTHER = "other"
}
/**
 * Base legal entity interface
 */
export interface LegalEntity {
    id: string;
    entityNumber: string;
    legalName: string;
    dbaName?: string;
    entityType: EntityType;
    status: EntityStatus;
    taxClassification?: TaxClassification;
    taxId?: string;
    incorporationJurisdiction: string;
    incorporationDate?: Date;
    dissolutionDate?: Date;
    fiscalYearEnd?: string;
    businessPurpose?: string;
    registeredAgentName?: string;
    registeredAgentAddress?: string;
    principalAddress: EntityAddress;
    mailingAddress?: EntityAddress;
    phoneNumber?: string;
    email?: string;
    website?: string;
    parentEntityId?: string;
    metadata: EntityMetadata;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Entity address structure
 */
export interface EntityAddress {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
/**
 * Entity metadata
 */
export interface EntityMetadata {
    tags: string[];
    industry?: string;
    naicsCode?: string;
    sicCode?: string;
    employeeCount?: number;
    annualRevenue?: number;
    customFields: Record<string, any>;
    notes?: string;
    externalIds: Record<string, string>;
}
/**
 * Corporate structure relationship
 */
export interface EntityRelationship {
    id: string;
    parentEntityId: string;
    childEntityId: string;
    relationshipType: EntityRelationshipType;
    ownershipPercentage?: number;
    effectiveDate: Date;
    endDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Ownership stake information
 */
export interface OwnershipStake {
    id: string;
    entityId: string;
    ownerType: 'individual' | 'entity';
    ownerId: string;
    ownerName: string;
    ownershipType: OwnershipType;
    sharesOwned?: number;
    percentageOwned?: number;
    votingRights: boolean;
    votingPercentage?: number;
    acquisitionDate?: Date;
    acquisitionPrice?: number;
    currentValue?: number;
    restrictions?: string;
    vestingSchedule?: VestingSchedule;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Vesting schedule
 */
export interface VestingSchedule {
    startDate: Date;
    cliffMonths?: number;
    vestingMonths: number;
    vestedPercentage: number;
    accelerationClauses?: string[];
}
/**
 * Corporate officer/director
 */
export interface EntityOfficer {
    id: string;
    entityId: string;
    personId?: string;
    name: string;
    role: OfficerRole;
    appointmentDate: Date;
    termEndDate?: Date;
    resignationDate?: Date;
    compensation?: number;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compliance calendar event
 */
export interface ComplianceEvent {
    id: string;
    entityId: string;
    eventType: ComplianceEventType;
    title: string;
    description?: string;
    dueDate: Date;
    completionDate?: Date;
    status: ComplianceStatus;
    jurisdiction?: string;
    filingNumber?: string;
    filingUrl?: string;
    assignedTo?: string;
    reminderDays: number[];
    recurring: boolean;
    recurrenceRule?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    penalties?: string;
    estimatedCost?: number;
    actualCost?: number;
    documents: ComplianceDocument[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compliance document
 */
export interface ComplianceDocument {
    id: string;
    name: string;
    documentType: string;
    fileUrl: string;
    uploadedAt: Date;
    uploadedBy: string;
}
/**
 * Entity formation request
 */
export interface EntityFormationRequest {
    legalName: string;
    dbaName?: string;
    entityType: EntityType;
    incorporationJurisdiction: string;
    businessPurpose: string;
    registeredAgentName: string;
    registeredAgentAddress: EntityAddress;
    principalAddress: EntityAddress;
    taxClassification?: TaxClassification;
    fiscalYearEnd?: string;
    initialOfficers: Omit<EntityOfficer, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>[];
    initialOwners: Omit<OwnershipStake, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>[];
    parentEntityId?: string;
    metadata?: Partial<EntityMetadata>;
}
/**
 * Entity search criteria
 */
export interface EntitySearchCriteria {
    query?: string;
    entityType?: EntityType[];
    status?: EntityStatus[];
    jurisdiction?: string[];
    taxClassification?: TaxClassification[];
    parentEntityId?: string;
    hasParent?: boolean;
    tags?: string[];
    createdAfter?: Date;
    createdBefore?: Date;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Entity health metrics
 */
export interface EntityHealthMetrics {
    entityId: string;
    overallHealth: 'healthy' | 'warning' | 'critical';
    complianceScore: number;
    overdueCompliance: number;
    upcomingDeadlines: number;
    activeOfficers: number;
    goodStanding: boolean;
    lastFilingDate?: Date;
    issues: HealthIssue[];
}
/**
 * Health issue
 */
export interface HealthIssue {
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    remediation?: string;
}
/**
 * Entity address validation schema
 */
export declare const EntityAddressSchema: any;
/**
 * Entity formation request validation schema
 */
export declare const EntityFormationRequestSchema: any;
/**
 * Compliance event creation schema
 */
export declare const ComplianceEventSchema: any;
/**
 * Entity search criteria schema
 */
export declare const EntitySearchCriteriaSchema: any;
/**
 * Legal Entity Sequelize Model
 */
export declare class LegalEntityModel extends Model {
    id: string;
    entityNumber: string;
    legalName: string;
    dbaName?: string;
    entityType: EntityType;
    status: EntityStatus;
    taxClassification?: TaxClassification;
    taxId?: string;
    incorporationJurisdiction: string;
    incorporationDate?: Date;
    dissolutionDate?: Date;
    fiscalYearEnd?: string;
    businessPurpose?: string;
    registeredAgentName?: string;
    registeredAgentAddress?: string;
    principalAddress: EntityAddress;
    mailingAddress?: EntityAddress;
    phoneNumber?: string;
    email?: string;
    website?: string;
    parentEntityId?: string;
    parentEntity?: LegalEntityModel;
    subsidiaries?: LegalEntityModel[];
    childRelationships?: EntityRelationshipModel[];
    parentRelationships?: EntityRelationshipModel[];
    ownershipStakes?: OwnershipStakeModel[];
    officers?: EntityOfficerModel[];
    complianceEvents?: ComplianceEventModel[];
    metadata: EntityMetadata;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Entity Relationship Sequelize Model
 */
export declare class EntityRelationshipModel extends Model {
    id: string;
    parentEntityId: string;
    parentEntity?: LegalEntityModel;
    childEntityId: string;
    childEntity?: LegalEntityModel;
    relationshipType: EntityRelationshipType;
    ownershipPercentage?: number;
    effectiveDate: Date;
    endDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Ownership Stake Sequelize Model
 */
export declare class OwnershipStakeModel extends Model {
    id: string;
    entityId: string;
    entity?: LegalEntityModel;
    ownerType: 'individual' | 'entity';
    ownerId: string;
    ownerName: string;
    ownershipType: OwnershipType;
    sharesOwned?: number;
    percentageOwned?: number;
    votingRights: boolean;
    votingPercentage?: number;
    acquisitionDate?: Date;
    acquisitionPrice?: number;
    currentValue?: number;
    restrictions?: string;
    vestingSchedule?: VestingSchedule;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Entity Officer Sequelize Model
 */
export declare class EntityOfficerModel extends Model {
    id: string;
    entityId: string;
    entity?: LegalEntityModel;
    personId?: string;
    name: string;
    role: OfficerRole;
    appointmentDate: Date;
    termEndDate?: Date;
    resignationDate?: Date;
    compensation?: number;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compliance Event Sequelize Model
 */
export declare class ComplianceEventModel extends Model {
    id: string;
    entityId: string;
    entity?: LegalEntityModel;
    eventType: ComplianceEventType;
    title: string;
    description?: string;
    dueDate: Date;
    completionDate?: Date;
    status: ComplianceStatus;
    jurisdiction?: string;
    filingNumber?: string;
    filingUrl?: string;
    assignedTo?: string;
    reminderDays: number[];
    recurring: boolean;
    recurrenceRule?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    penalties?: string;
    estimatedCost?: number;
    actualCost?: number;
    documents: ComplianceDocument[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Legal Entity Management Service
 */
export declare class LegalEntityManagementService {
    private readonly sequelize;
    private readonly configService;
    private readonly logger;
    constructor(sequelize: Sequelize, configService: ConfigService);
    /**
     * 1. Create new legal entity with formation details
     *
     * @param request Entity formation request
     * @param userId User creating the entity
     * @param tenantId Optional tenant ID for multi-tenancy
     * @returns Created legal entity
     */
    formNewEntity(request: EntityFormationRequest, userId: string, tenantId?: string): Promise<LegalEntity>;
    /**
     * 2. Update entity status
     *
     * @param entityId Entity ID
     * @param status New status
     * @param userId User making the update
     * @param notes Optional notes about status change
     * @returns Updated entity
     */
    updateEntityStatus(entityId: string, status: EntityStatus, userId: string, notes?: string): Promise<LegalEntity>;
    /**
     * 3. Dissolve/terminate entity
     *
     * @param entityId Entity ID
     * @param dissolutionDate Date of dissolution
     * @param userId User performing dissolution
     * @param reason Reason for dissolution
     * @returns Dissolved entity
     */
    dissolveEntity(entityId: string, dissolutionDate: Date, userId: string, reason?: string): Promise<LegalEntity>;
    /**
     * 4. Convert entity type
     *
     * @param entityId Entity ID
     * @param newEntityType New entity type
     * @param effectiveDate Effective date of conversion
     * @param userId User performing conversion
     * @returns Updated entity
     */
    convertEntityType(entityId: string, newEntityType: EntityType, effectiveDate: Date, userId: string): Promise<LegalEntity>;
    /**
     * 5. Create entity relationship (parent-child, affiliate, etc.)
     *
     * @param parentEntityId Parent entity ID
     * @param childEntityId Child entity ID
     * @param relationshipType Type of relationship
     * @param ownershipPercentage Optional ownership percentage
     * @param effectiveDate Effective date of relationship
     * @returns Created relationship
     */
    createEntityRelationship(parentEntityId: string, childEntityId: string, relationshipType: EntityRelationshipType, ownershipPercentage?: number, effectiveDate?: Date): Promise<EntityRelationship>;
    /**
     * 6. Get entity corporate structure (hierarchy)
     *
     * @param entityId Root entity ID
     * @param depth Maximum depth to traverse
     * @returns Corporate structure tree
     */
    getEntityStructure(entityId: string, depth?: number): Promise<any>;
    /**
     * 7. Get all subsidiaries of an entity
     *
     * @param parentEntityId Parent entity ID
     * @param includeIndirect Include indirect subsidiaries
     * @returns List of subsidiaries
     */
    getSubsidiaries(parentEntityId: string, includeIndirect?: boolean): Promise<LegalEntity[]>;
    /**
     * 8. Get parent entities
     *
     * @param childEntityId Child entity ID
     * @returns List of parent entities
     */
    getParentEntities(childEntityId: string): Promise<LegalEntity[]>;
    /**
     * 9. Add ownership stake
     *
     * @param entityId Entity ID
     * @param stake Ownership stake details
     * @returns Created ownership stake
     */
    addOwnershipStake(entityId: string, stake: Omit<OwnershipStake, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>): Promise<OwnershipStake>;
    /**
     * 10. Update ownership stake
     *
     * @param stakeId Stake ID
     * @param updates Updates to apply
     * @returns Updated ownership stake
     */
    updateOwnershipStake(stakeId: string, updates: Partial<OwnershipStake>): Promise<OwnershipStake>;
    /**
     * 11. Get ownership breakdown for entity
     *
     * @param entityId Entity ID
     * @returns Ownership breakdown
     */
    getOwnershipBreakdown(entityId: string): Promise<{
        entity: LegalEntity;
        stakes: OwnershipStake[];
        totalPercentage: number;
        ownerCount: number;
    }>;
    /**
     * 12. Generate cap table
     *
     * @param entityId Entity ID
     * @returns Cap table with equity distribution
     */
    generateCapTable(entityId: string): Promise<{
        entity: LegalEntity;
        equity: {
            ownerName: string;
            ownerType: 'individual' | 'entity';
            ownershipType: OwnershipType;
            sharesOwned?: number;
            percentageOwned?: number;
            votingPercentage?: number;
            currentValue?: number;
        }[];
        totalShares?: number;
        totalValue?: number;
        fullyDilutedShares?: number;
    }>;
    /**
     * 13. Transfer ownership stake
     *
     * @param stakeId Stake ID to transfer
     * @param newOwnerId New owner ID
     * @param newOwnerName New owner name
     * @param transferDate Transfer date
     * @param transferPrice Transfer price
     * @returns Updated stake
     */
    transferOwnershipStake(stakeId: string, newOwnerId: string, newOwnerName: string, transferDate: Date, transferPrice?: number): Promise<OwnershipStake>;
    /**
     * 14. Add officer/director
     *
     * @param entityId Entity ID
     * @param officer Officer details
     * @returns Created officer
     */
    addOfficer(entityId: string, officer: Omit<EntityOfficer, 'id' | 'entityId' | 'createdAt' | 'updatedAt'>): Promise<EntityOfficer>;
    /**
     * 15. Remove/terminate officer
     *
     * @param officerId Officer ID
     * @param resignationDate Resignation date
     * @returns Updated officer
     */
    terminateOfficer(officerId: string, resignationDate: Date): Promise<EntityOfficer>;
    /**
     * 16. Get active officers for entity
     *
     * @param entityId Entity ID
     * @returns List of active officers
     */
    getActiveOfficers(entityId: string): Promise<EntityOfficer[]>;
    /**
     * 17. Update officer role/compensation
     *
     * @param officerId Officer ID
     * @param updates Updates to apply
     * @returns Updated officer
     */
    updateOfficer(officerId: string, updates: Partial<EntityOfficer>): Promise<EntityOfficer>;
    /**
     * 18. Create compliance event
     *
     * @param event Compliance event details
     * @returns Created compliance event
     */
    createComplianceEvent(event: Omit<ComplianceEvent, 'id' | 'status' | 'documents' | 'createdAt' | 'updatedAt'>): Promise<ComplianceEvent>;
    /**
     * 19. Update compliance event status
     *
     * @param eventId Event ID
     * @param status New status
     * @param completionDate Completion date if completed
     * @returns Updated event
     */
    updateComplianceStatus(eventId: string, status: ComplianceStatus, completionDate?: Date): Promise<ComplianceEvent>;
    /**
     * 20. Get upcoming compliance events
     *
     * @param entityId Optional entity ID filter
     * @param daysAhead Number of days to look ahead
     * @returns Upcoming compliance events
     */
    getUpcomingComplianceEvents(entityId?: string, daysAhead?: number): Promise<ComplianceEvent[]>;
    /**
     * 21. Get overdue compliance events
     *
     * @param entityId Optional entity ID filter
     * @returns Overdue compliance events
     */
    getOverdueComplianceEvents(entityId?: string): Promise<ComplianceEvent[]>;
    /**
     * 22. Add document to compliance event
     *
     * @param eventId Event ID
     * @param document Document details
     * @returns Updated event
     */
    addComplianceDocument(eventId: string, document: ComplianceDocument): Promise<ComplianceEvent>;
    /**
     * 23. Update compliance event reminder settings
     *
     * @param eventId Event ID
     * @param reminderDays Days before due date to send reminders
     * @returns Updated event
     */
    updateComplianceReminders(eventId: string, reminderDays: number[]): Promise<ComplianceEvent>;
    /**
     * 24. Get compliance calendar for entity
     *
     * @param entityId Entity ID
     * @param startDate Start date
     * @param endDate End date
     * @returns Compliance events in date range
     */
    getComplianceCalendar(entityId: string, startDate: Date, endDate: Date): Promise<ComplianceEvent[]>;
    /**
     * 25. Search entities by criteria
     *
     * @param criteria Search criteria
     * @returns Matching entities and total count
     */
    searchEntities(criteria: EntitySearchCriteria): Promise<{
        entities: LegalEntity[];
        total: number;
    }>;
    /**
     * 26. Get entity by ID with full details
     *
     * @param entityId Entity ID
     * @returns Entity with related data
     */
    getEntityById(entityId: string): Promise<{
        entity: LegalEntity;
        officers: EntityOfficer[];
        ownershipStakes: OwnershipStake[];
        subsidiaries: LegalEntity[];
        parents: LegalEntity[];
        upcomingCompliance: ComplianceEvent[];
    }>;
    /**
     * 27. Get entity by entity number
     *
     * @param entityNumber Entity number
     * @returns Entity
     */
    getEntityByNumber(entityNumber: string): Promise<LegalEntity>;
    /**
     * 28. Search entities by jurisdiction
     *
     * @param jurisdiction Jurisdiction code
     * @returns Entities in jurisdiction
     */
    getEntitiesByJurisdiction(jurisdiction: string): Promise<LegalEntity[]>;
    /**
     * 29. Get entity health metrics
     *
     * @param entityId Entity ID
     * @returns Health metrics
     */
    getEntityHealthMetrics(entityId: string): Promise<EntityHealthMetrics>;
    /**
     * 30. Monitor entity compliance status
     *
     * @param entityId Entity ID
     * @returns Compliance monitoring report
     */
    monitorEntityCompliance(entityId: string): Promise<{
        entity: LegalEntity;
        overdue: ComplianceEvent[];
        dueSoon: ComplianceEvent[];
        upcoming: ComplianceEvent[];
        completed: number;
        totalEvents: number;
    }>;
    /**
     * 31. Generate entity portfolio report
     *
     * @param tenantId Optional tenant ID filter
     * @returns Portfolio summary
     */
    generatePortfolioReport(tenantId?: string): Promise<{
        totalEntities: number;
        byType: Record<EntityType, number>;
        byStatus: Record<EntityStatus, number>;
        byJurisdiction: Record<string, number>;
        overdueCompliance: number;
        entitiesAtRisk: number;
    }>;
    /**
     * 32. Get entities requiring annual filings
     *
     * @param monthsAhead Months to look ahead
     * @returns Entities with upcoming annual filings
     */
    getEntitiesRequiringAnnualFilings(monthsAhead?: number): Promise<{
        entity: LegalEntity;
        dueDate: Date;
        filingType: string;
    }[]>;
    /**
     * 33. Generate unique entity number
     *
     * @param entityType Entity type
     * @returns Generated entity number
     */
    generateEntityNumber(entityType: EntityType): Promise<string>;
    /**
     * 34. Validate entity in good standing
     *
     * @param entityId Entity ID
     * @returns Whether entity is in good standing
     */
    validateGoodStanding(entityId: string): Promise<boolean>;
    /**
     * 35. Merge entities
     *
     * @param sourceEntityId Entity being merged (will be marked as merged)
     * @param targetEntityId Entity to merge into
     * @param mergerDate Date of merger
     * @param userId User performing merger
     * @returns Updated entities
     */
    mergeEntities(sourceEntityId: string, targetEntityId: string, mergerDate: Date, userId: string): Promise<{
        source: LegalEntity;
        target: LegalEntity;
    }>;
    /**
     * 36. Bulk update entity metadata
     *
     * @param entityIds Array of entity IDs
     * @param metadataUpdates Metadata updates to apply
     * @param userId User performing update
     * @returns Number of entities updated
     */
    bulkUpdateEntityMetadata(entityIds: string[], metadataUpdates: Partial<EntityMetadata>, userId: string): Promise<number>;
    private getEntityTypePrefix;
    private checkCircularRelationship;
    private buildEntityTree;
    private createInitialComplianceEvents;
}
/**
 * Legal Entity Management Configuration
 */
export declare const legalEntityManagementConfig: any;
/**
 * Legal Entity Management Module
 */
export declare class LegalEntityManagementModule {
    static forRoot(options?: {
        sequelize?: Sequelize;
    }): DynamicModule;
}
export declare class CreateEntityDto {
    legalName: string;
    dbaName?: string;
    entityType: EntityType;
    incorporationJurisdiction: string;
    businessPurpose: string;
    registeredAgentName: string;
    registeredAgentAddress: EntityAddress;
    principalAddress: EntityAddress;
}
export declare class EntityResponseDto {
    id: string;
    entityNumber: string;
    legalName: string;
    entityType: EntityType;
    status: EntityStatus;
    createdAt: Date;
}
export declare class ComplianceEventDto {
    entityId: string;
    eventType: ComplianceEventType;
    title: string;
    dueDate: Date;
    status: ComplianceStatus;
}
//# sourceMappingURL=legal-entity-management-kit.d.ts.map