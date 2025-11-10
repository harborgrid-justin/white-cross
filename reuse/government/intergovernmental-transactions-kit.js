"use strict";
/**
 * LOC: GOV-IGT-TRX-001
 * File: /reuse/government/intergovernmental-transactions-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *
 * DOWNSTREAM (imported by):
 *   - Intergovernmental transaction services
 *   - Revenue sharing controllers
 *   - Joint venture management modules
 *   - Regional authority integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingCycle = exports.DistributionMethod = exports.AgreementStatus = exports.TransferStatus = exports.TransferType = exports.EntityType = void 0;
exports.createIntergovernmentalEntity = createIntergovernmentalEntity;
exports.getActiveEntities = getActiveEntities;
exports.updateEntityContact = updateEntityContact;
exports.createIntergovernmentalAgreement = createIntergovernmentalAgreement;
exports.getEntityAgreements = getEntityAgreements;
exports.terminateAgreement = terminateAgreement;
exports.getExpiringAgreements = getExpiringAgreements;
exports.createIntergovernmentalTransfer = createIntergovernmentalTransfer;
exports.approveTransfer = approveTransfer;
exports.completeTransfer = completeTransfer;
exports.getEntityTransfers = getEntityTransfers;
exports.calculateTotalTransfers = calculateTotalTransfers;
exports.createRevenueSharing = createRevenueSharing;
exports.calculatePerCapitaSharing = calculatePerCapitaSharing;
exports.calculatePercentageSharing = calculatePercentageSharing;
exports.approveRevenueSharing = approveRevenueSharing;
exports.createGrantPassThrough = createGrantPassThrough;
exports.getSubRecipientPassThroughs = getSubRecipientPassThroughs;
exports.calculateTotalPassThrough = calculateTotalPassThrough;
exports.createIntergovernmentalInvoice = createIntergovernmentalInvoice;
exports.recordInvoicePayment = recordInvoicePayment;
exports.getOutstandingInvoices = getOutstandingInvoices;
exports.createCostAllocation = createCostAllocation;
exports.calculateUsageBasedAllocation = calculateUsageBasedAllocation;
exports.approveCostAllocation = approveCostAllocation;
exports.createJointVenture = createJointVenture;
exports.addJointVentureParticipant = addJointVentureParticipant;
exports.createConsortium = createConsortium;
exports.addConsortiumMember = addConsortiumMember;
exports.createInterEntityLoan = createInterEntityLoan;
exports.recordLoanPayment = recordLoanPayment;
exports.calculateLoanBalance = calculateLoanBalance;
exports.createStateAidCalculation = createStateAidCalculation;
exports.approveStateAid = approveStateAid;
exports.createFederalReimbursement = createFederalReimbursement;
exports.approveFederalReimbursement = approveFederalReimbursement;
exports.createCollaborativeProject = createCollaborativeProject;
exports.createIntergovernmentalReconciliation = createIntergovernmentalReconciliation;
exports.resolveReconciliation = resolveReconciliation;
/**
 * File: /reuse/government/intergovernmental-transactions-kit.ts
 * Locator: WC-GOV-IGT-TRX-001
 * Purpose: Intergovernmental Transactions Kit - Comprehensive intergovernmental financial operations
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/swagger, class-validator
 * Downstream: Intergovernmental services, revenue sharing, joint ventures, regional authorities, cost allocation
 * Dependencies: Sequelize v6.x, NestJS v10.x, Node 18+, TypeScript 5.x
 * Exports: 50+ functions for intergovernmental transactions, revenue sharing, transfers, billing, cost allocation, consortium management
 *
 * LLM Context: Enterprise-grade intergovernmental transactions for government entities managing federal, state, and local transfers.
 * Provides utilities for intergovernmental revenue tracking, shared revenue allocation, grant pass-through, revenue sharing formulas,
 * intergovernmental billing, cost allocation between entities, joint venture accounting, consortium management, state aid calculations,
 * federal reimbursement tracking, regional service agreements, inter-entity loans, collaborative project funding, cross-jurisdictional
 * reporting, intergovernmental reconciliation, multi-entity budget consolidation, and shared service cost allocation.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Entity type enumeration
 */
var EntityType;
(function (EntityType) {
    EntityType["FEDERAL"] = "FEDERAL";
    EntityType["STATE"] = "STATE";
    EntityType["COUNTY"] = "COUNTY";
    EntityType["CITY"] = "CITY";
    EntityType["TOWNSHIP"] = "TOWNSHIP";
    EntityType["SCHOOL_DISTRICT"] = "SCHOOL_DISTRICT";
    EntityType["SPECIAL_DISTRICT"] = "SPECIAL_DISTRICT";
    EntityType["REGIONAL_AUTHORITY"] = "REGIONAL_AUTHORITY";
    EntityType["CONSORTIUM"] = "CONSORTIUM";
})(EntityType || (exports.EntityType = EntityType = {}));
/**
 * Transfer type enumeration
 */
var TransferType;
(function (TransferType) {
    TransferType["REVENUE_SHARING"] = "REVENUE_SHARING";
    TransferType["GRANT_PASSTHROUGH"] = "GRANT_PASSTHROUGH";
    TransferType["REIMBURSEMENT"] = "REIMBURSEMENT";
    TransferType["STATE_AID"] = "STATE_AID";
    TransferType["FEDERAL_AID"] = "FEDERAL_AID";
    TransferType["PAYMENT_IN_LIEU"] = "PAYMENT_IN_LIEU";
    TransferType["SHARED_SERVICE"] = "SHARED_SERVICE";
    TransferType["JOINT_VENTURE"] = "JOINT_VENTURE";
    TransferType["LOAN_PAYMENT"] = "LOAN_PAYMENT";
    TransferType["RECIPROCAL_BILLING"] = "RECIPROCAL_BILLING";
})(TransferType || (exports.TransferType = TransferType = {}));
/**
 * Transfer status enumeration
 */
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["PENDING"] = "PENDING";
    TransferStatus["APPROVED"] = "APPROVED";
    TransferStatus["IN_TRANSIT"] = "IN_TRANSIT";
    TransferStatus["COMPLETED"] = "COMPLETED";
    TransferStatus["REJECTED"] = "REJECTED";
    TransferStatus["REVERSED"] = "REVERSED";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
/**
 * Agreement status enumeration
 */
var AgreementStatus;
(function (AgreementStatus) {
    AgreementStatus["DRAFT"] = "DRAFT";
    AgreementStatus["ACTIVE"] = "ACTIVE";
    AgreementStatus["SUSPENDED"] = "SUSPENDED";
    AgreementStatus["EXPIRED"] = "EXPIRED";
    AgreementStatus["TERMINATED"] = "TERMINATED";
})(AgreementStatus || (exports.AgreementStatus = AgreementStatus = {}));
/**
 * Distribution method enumeration
 */
var DistributionMethod;
(function (DistributionMethod) {
    DistributionMethod["EQUAL"] = "EQUAL";
    DistributionMethod["PERCENTAGE"] = "PERCENTAGE";
    DistributionMethod["FORMULA"] = "FORMULA";
    DistributionMethod["PER_CAPITA"] = "PER_CAPITA";
    DistributionMethod["ASSESSED_VALUE"] = "ASSESSED_VALUE";
    DistributionMethod["USAGE_BASED"] = "USAGE_BASED";
    DistributionMethod["COST_BASED"] = "COST_BASED";
})(DistributionMethod || (exports.DistributionMethod = DistributionMethod = {}));
/**
 * Billing cycle enumeration
 */
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "MONTHLY";
    BillingCycle["QUARTERLY"] = "QUARTERLY";
    BillingCycle["SEMI_ANNUAL"] = "SEMI_ANNUAL";
    BillingCycle["ANNUAL"] = "ANNUAL";
    BillingCycle["ON_DEMAND"] = "ON_DEMAND";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
// ============================================================================
// INTERGOVERNMENTAL ENTITY MANAGEMENT
// ============================================================================
/**
 * Creates an intergovernmental entity record.
 * Registers a government entity for intergovernmental transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityCode - Unique entity code
 * @param {string} entityName - Entity name
 * @param {EntityType} entityType - Type of entity
 * @param {string} jurisdiction - Jurisdiction area
 * @param {string} fipsCode - FIPS code (if applicable)
 * @param {string} contactName - Primary contact name
 * @param {string} contactEmail - Contact email
 * @param {string} contactPhone - Contact phone
 * @param {string} address - Entity address
 * @returns {Promise<IIntergovernmentalEntity>} Created entity
 *
 * @example
 * ```typescript
 * const entity = await createIntergovernmentalEntity(sequelize,
 *   'STATE-CA', 'State of California', EntityType.STATE,
 *   'California', '06', 'John Doe', 'john@ca.gov',
 *   '916-555-1234', '1315 10th Street, Sacramento, CA 95814');
 * ```
 */
async function createIntergovernmentalEntity(sequelize, entityCode, entityName, entityType, jurisdiction, fipsCode, contactName, contactEmail, contactPhone, address) {
    const Entity = getIntergovernmentalEntityModel(sequelize);
    const entity = await Entity.create({
        entityCode,
        entityName,
        entityType,
        jurisdiction,
        fipsCode,
        contactName,
        contactEmail,
        contactPhone,
        address,
        status: 'ACTIVE',
    });
    return entity.toJSON();
}
/**
 * Retrieves all active intergovernmental entities.
 * Returns entities available for transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EntityType} entityType - Optional entity type filter
 * @returns {Promise<IIntergovernmentalEntity[]>} Active entities
 *
 * @example
 * ```typescript
 * const entities = await getActiveEntities(sequelize, EntityType.COUNTY);
 * ```
 */
async function getActiveEntities(sequelize, entityType) {
    const Entity = getIntergovernmentalEntityModel(sequelize);
    const where = { status: 'ACTIVE' };
    if (entityType) {
        where.entityType = entityType;
    }
    const entities = await Entity.findAll({ where });
    return entities.map(e => e.toJSON());
}
/**
 * Updates entity contact information.
 * Modifies entity contact details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @param {string} contactName - Contact name
 * @param {string} contactEmail - Contact email
 * @param {string} contactPhone - Contact phone
 * @returns {Promise<IIntergovernmentalEntity>} Updated entity
 *
 * @example
 * ```typescript
 * const updated = await updateEntityContact(sequelize, 'entity-001',
 *   'Jane Smith', 'jane@ca.gov', '916-555-5678');
 * ```
 */
async function updateEntityContact(sequelize, entityId, contactName, contactEmail, contactPhone) {
    const Entity = getIntergovernmentalEntityModel(sequelize);
    const entity = await Entity.findByPk(entityId);
    if (!entity) {
        throw new Error(`Entity ${entityId} not found`);
    }
    entity.contactName = contactName;
    entity.contactEmail = contactEmail;
    entity.contactPhone = contactPhone;
    await entity.save();
    return entity.toJSON();
}
// ============================================================================
// INTERGOVERNMENTAL AGREEMENTS
// ============================================================================
/**
 * Creates an intergovernmental agreement.
 * Establishes formal agreement between entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} agreementNumber - Agreement number
 * @param {string} agreementName - Agreement name
 * @param {TransferType} agreementType - Type of agreement
 * @param {string[]} parties - Participating entity IDs
 * @param {string} leadEntityId - Lead entity ID
 * @param {Date} effectiveDate - Effective date
 * @param {Date} expirationDate - Expiration date
 * @param {boolean} autoRenew - Auto-renewal flag
 * @param {string} terms - Agreement terms
 * @param {number} totalAmount - Total agreement amount
 * @returns {Promise<IIntergovernmentalAgreement>} Created agreement
 *
 * @example
 * ```typescript
 * const agreement = await createIntergovernmentalAgreement(sequelize,
 *   'IGA-2024-001', 'Regional Transit Authority Agreement',
 *   TransferType.SHARED_SERVICE, ['entity-001', 'entity-002'],
 *   'entity-001', new Date('2024-01-01'), new Date('2029-12-31'),
 *   true, 'Terms and conditions...', 10000000);
 * ```
 */
async function createIntergovernmentalAgreement(sequelize, agreementNumber, agreementName, agreementType, parties, leadEntityId, effectiveDate, expirationDate, autoRenew, terms, totalAmount) {
    const Agreement = getIntergovernmentalAgreementModel(sequelize);
    const agreement = await Agreement.create({
        agreementNumber,
        agreementName,
        agreementType,
        parties,
        leadEntityId,
        effectiveDate,
        expirationDate,
        autoRenew,
        terms,
        totalAmount,
        status: AgreementStatus.ACTIVE,
    });
    return agreement.toJSON();
}
/**
 * Retrieves active agreements for an entity.
 * Returns all active agreements involving the entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @returns {Promise<IIntergovernmentalAgreement[]>} Active agreements
 *
 * @example
 * ```typescript
 * const agreements = await getEntityAgreements(sequelize, 'entity-001');
 * ```
 */
async function getEntityAgreements(sequelize, entityId) {
    const Agreement = getIntergovernmentalAgreementModel(sequelize);
    const agreements = await Agreement.findAll({
        where: {
            status: AgreementStatus.ACTIVE,
            [sequelize_1.Op.or]: [
                { parties: { [sequelize_1.Op.contains]: [entityId] } },
                { leadEntityId: entityId },
            ],
        },
    });
    return agreements.map(a => a.toJSON());
}
/**
 * Terminates an intergovernmental agreement.
 * Ends agreement before expiration date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} agreementId - Agreement ID
 * @param {string} reason - Termination reason
 * @returns {Promise<IIntergovernmentalAgreement>} Terminated agreement
 *
 * @example
 * ```typescript
 * const terminated = await terminateAgreement(sequelize, 'agreement-001',
 *   'Budget constraints');
 * ```
 */
async function terminateAgreement(sequelize, agreementId, reason) {
    const Agreement = getIntergovernmentalAgreementModel(sequelize);
    const agreement = await Agreement.findByPk(agreementId);
    if (!agreement) {
        throw new Error(`Agreement ${agreementId} not found`);
    }
    agreement.status = AgreementStatus.TERMINATED;
    await agreement.save();
    return agreement.toJSON();
}
/**
 * Retrieves expiring agreements.
 * Identifies agreements expiring within timeframe.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<IIntergovernmentalAgreement[]>} Expiring agreements
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringAgreements(sequelize, 90);
 * ```
 */
async function getExpiringAgreements(sequelize, daysAhead) {
    const Agreement = getIntergovernmentalAgreementModel(sequelize);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const agreements = await Agreement.findAll({
        where: {
            status: AgreementStatus.ACTIVE,
            expirationDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
            autoRenew: false,
        },
    });
    return agreements.map(a => a.toJSON());
}
// ============================================================================
// INTERGOVERNMENTAL TRANSFERS
// ============================================================================
/**
 * Creates an intergovernmental transfer.
 * Records transfer between government entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferNumber - Transfer number
 * @param {TransferType} transferType - Type of transfer
 * @param {string} fromEntityId - Sending entity ID
 * @param {string} toEntityId - Receiving entity ID
 * @param {string} agreementId - Related agreement ID
 * @param {number} amount - Transfer amount
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Period (e.g., 'Q1', 'Q2')
 * @param {string} description - Transfer description
 * @param {Date} transferDate - Transfer date
 * @returns {Promise<IIntergovernmentalTransfer>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createIntergovernmentalTransfer(sequelize,
 *   'TRF-2024-0001', TransferType.STATE_AID, 'state-001',
 *   'city-001', 'agreement-001', 500000, 2024, 'Q1',
 *   'State aid payment Q1', new Date());
 * ```
 */
async function createIntergovernmentalTransfer(sequelize, transferNumber, transferType, fromEntityId, toEntityId, agreementId, amount, fiscalYear, period, description, transferDate) {
    const Transfer = getIntergovernmentalTransferModel(sequelize);
    const transfer = await Transfer.create({
        transferNumber,
        transferType,
        fromEntityId,
        toEntityId,
        agreementId,
        amount,
        fiscalYear,
        period,
        description,
        transferDate,
        status: TransferStatus.PENDING,
    });
    return transfer.toJSON();
}
/**
 * Approves an intergovernmental transfer.
 * Authorizes transfer for processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<IIntergovernmentalTransfer>} Approved transfer
 *
 * @example
 * ```typescript
 * const approved = await approveTransfer(sequelize, 'transfer-001',
 *   'user-123');
 * ```
 */
async function approveTransfer(sequelize, transferId, approvedBy) {
    const Transfer = getIntergovernmentalTransferModel(sequelize);
    const transfer = await Transfer.findByPk(transferId);
    if (!transfer) {
        throw new Error(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== TransferStatus.PENDING) {
        throw new Error(`Transfer cannot be approved from status ${transfer.status}`);
    }
    transfer.status = TransferStatus.APPROVED;
    await transfer.save();
    return transfer.toJSON();
}
/**
 * Completes an intergovernmental transfer.
 * Marks transfer as completed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} referenceNumber - Payment reference number
 * @returns {Promise<IIntergovernmentalTransfer>} Completed transfer
 *
 * @example
 * ```typescript
 * const completed = await completeTransfer(sequelize, 'transfer-001',
 *   'ACH-20240115-001');
 * ```
 */
async function completeTransfer(sequelize, transferId, referenceNumber) {
    const Transfer = getIntergovernmentalTransferModel(sequelize);
    const transfer = await Transfer.findByPk(transferId);
    if (!transfer) {
        throw new Error(`Transfer ${transferId} not found`);
    }
    transfer.status = TransferStatus.COMPLETED;
    transfer.referenceNumber = referenceNumber;
    await transfer.save();
    return transfer.toJSON();
}
/**
 * Retrieves transfers for an entity.
 * Returns transfers sent or received by entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {string} direction - 'SENT' or 'RECEIVED'
 * @returns {Promise<IIntergovernmentalTransfer[]>} Transfers
 *
 * @example
 * ```typescript
 * const received = await getEntityTransfers(sequelize, 'entity-001',
 *   2024, 'RECEIVED');
 * ```
 */
async function getEntityTransfers(sequelize, entityId, fiscalYear, direction) {
    const Transfer = getIntergovernmentalTransferModel(sequelize);
    const where = {
        fiscalYear,
        [direction === 'SENT' ? 'fromEntityId' : 'toEntityId']: entityId,
    };
    const transfers = await Transfer.findAll({ where });
    return transfers.map(t => t.toJSON());
}
/**
 * Calculates total transfers by type.
 * Sums transfers by transfer type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {TransferType} transferType - Transfer type
 * @returns {Promise<number>} Total transfer amount
 *
 * @example
 * ```typescript
 * const totalAid = await calculateTotalTransfers(sequelize,
 *   'entity-001', 2024, TransferType.STATE_AID);
 * console.log(`Total state aid: $${totalAid}`);
 * ```
 */
async function calculateTotalTransfers(sequelize, entityId, fiscalYear, transferType) {
    const Transfer = getIntergovernmentalTransferModel(sequelize);
    const transfers = await Transfer.findAll({
        where: {
            toEntityId: entityId,
            fiscalYear,
            transferType,
            status: TransferStatus.COMPLETED,
        },
    });
    return transfers.reduce((sum, t) => sum + parseFloat(t.amount), 0);
}
// ============================================================================
// REVENUE SHARING
// ============================================================================
/**
 * Creates a revenue sharing distribution.
 * Allocates shared revenue among entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sharingProgramId - Sharing program ID
 * @param {string} programName - Program name
 * @param {string} revenueSource - Revenue source
 * @param {number} fiscalYear - Fiscal year
 * @param {number} totalRevenue - Total revenue to share
 * @param {DistributionMethod} distributionMethod - Distribution method
 * @param {string} distributionFormula - Formula description
 * @param {IRevenueAllocation[]} allocations - Revenue allocations
 * @param {Date} distributionDate - Distribution date
 * @returns {Promise<IRevenueSharing>} Created revenue sharing
 *
 * @example
 * ```typescript
 * const sharing = await createRevenueSharing(sequelize,
 *   'PROG-001', 'Sales Tax Revenue Sharing', 'Sales Tax',
 *   2024, 10000000, DistributionMethod.PER_CAPITA,
 *   'Distributed based on population', allocations, new Date());
 * ```
 */
async function createRevenueSharing(sequelize, sharingProgramId, programName, revenueSource, fiscalYear, totalRevenue, distributionMethod, distributionFormula, allocations, distributionDate) {
    const RevenueSharing = getRevenueSharingModel(sequelize);
    const sharing = await RevenueSharing.create({
        sharingProgramId,
        programName,
        revenueSource,
        fiscalYear,
        totalRevenue,
        distributionMethod,
        distributionFormula,
        allocations,
        distributionDate,
        status: 'CALCULATED',
    });
    return sharing.toJSON();
}
/**
 * Calculates per capita revenue sharing.
 * Distributes revenue based on population.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} totalRevenue - Total revenue to distribute
 * @param {Array<{entityId: string, entityName: string, population: number}>} entities - Entities with population
 * @returns {Promise<IRevenueAllocation[]>} Calculated allocations
 *
 * @example
 * ```typescript
 * const allocations = await calculatePerCapitaSharing(sequelize,
 *   1000000, [{entityId: 'city-001', entityName: 'City A', population: 50000}]);
 * ```
 */
async function calculatePerCapitaSharing(sequelize, totalRevenue, entities) {
    const totalPopulation = entities.reduce((sum, e) => sum + e.population, 0);
    const perCapitaAmount = totalRevenue / totalPopulation;
    return entities.map(entity => ({
        entityId: entity.entityId,
        entityName: entity.entityName,
        allocationBasis: `${entity.population} residents`,
        allocationPercent: (entity.population / totalPopulation) * 100,
        allocatedAmount: entity.population * perCapitaAmount,
        adjustments: 0,
        finalAmount: entity.population * perCapitaAmount,
    }));
}
/**
 * Calculates percentage-based revenue sharing.
 * Distributes revenue by fixed percentages.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} totalRevenue - Total revenue to distribute
 * @param {Array<{entityId: string, entityName: string, percentage: number}>} entities - Entities with percentages
 * @returns {Promise<IRevenueAllocation[]>} Calculated allocations
 *
 * @example
 * ```typescript
 * const allocations = await calculatePercentageSharing(sequelize,
 *   1000000, [{entityId: 'city-001', entityName: 'City A', percentage: 40}]);
 * ```
 */
async function calculatePercentageSharing(sequelize, totalRevenue, entities) {
    const totalPercent = entities.reduce((sum, e) => sum + e.percentage, 0);
    if (Math.abs(totalPercent - 100) > 0.01) {
        throw new Error(`Percentages must total 100%, got ${totalPercent}%`);
    }
    return entities.map(entity => ({
        entityId: entity.entityId,
        entityName: entity.entityName,
        allocationBasis: `${entity.percentage}% share`,
        allocationPercent: entity.percentage,
        allocatedAmount: (totalRevenue * entity.percentage) / 100,
        adjustments: 0,
        finalAmount: (totalRevenue * entity.percentage) / 100,
    }));
}
/**
 * Approves revenue sharing distribution.
 * Authorizes revenue distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sharingId - Revenue sharing ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<IRevenueSharing>} Approved revenue sharing
 *
 * @example
 * ```typescript
 * const approved = await approveRevenueSharing(sequelize,
 *   'sharing-001', 'user-123');
 * ```
 */
async function approveRevenueSharing(sequelize, sharingId, approvedBy) {
    const RevenueSharing = getRevenueSharingModel(sequelize);
    const sharing = await RevenueSharing.findByPk(sharingId);
    if (!sharing) {
        throw new Error(`Revenue sharing ${sharingId} not found`);
    }
    sharing.status = 'APPROVED';
    await sharing.save();
    return sharing.toJSON();
}
// ============================================================================
// GRANT PASS-THROUGH
// ============================================================================
/**
 * Creates a grant pass-through record.
 * Establishes sub-award from prime recipient to sub-recipient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} passthroughNumber - Pass-through number
 * @param {string} primaryGrantId - Primary grant ID
 * @param {string} primeRecipientId - Prime recipient entity ID
 * @param {string} subRecipientId - Sub-recipient entity ID
 * @param {number} passthroughAmount - Pass-through amount
 * @param {number} federalShare - Federal share
 * @param {number} stateShare - State share
 * @param {number} localMatch - Local match
 * @param {string} cfda - CFDA number
 * @param {string} programName - Program name
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<IGrantPassThrough>} Created pass-through
 *
 * @example
 * ```typescript
 * const passthrough = await createGrantPassThrough(sequelize,
 *   'PT-2024-001', 'grant-001', 'state-001', 'city-001',
 *   500000, 400000, 75000, 25000, '93.558',
 *   'TANF Block Grant', new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
async function createGrantPassThrough(sequelize, passthroughNumber, primaryGrantId, primeRecipientId, subRecipientId, passthroughAmount, federalShare, stateShare, localMatch, cfda, programName, periodStart, periodEnd) {
    const GrantPassThrough = getGrantPassThroughModel(sequelize);
    const passthrough = await GrantPassThrough.create({
        passthroughNumber,
        primaryGrantId,
        primeRecipientId,
        subRecipientId,
        passthroughAmount,
        federalShare,
        stateShare,
        localMatch,
        cfda,
        programName,
        periodStart,
        periodEnd,
        status: 'ACTIVE',
    });
    return passthrough.toJSON();
}
/**
 * Retrieves pass-through grants for sub-recipient.
 * Returns all pass-through awards to entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} subRecipientId - Sub-recipient entity ID
 * @returns {Promise<IGrantPassThrough[]>} Pass-through grants
 *
 * @example
 * ```typescript
 * const passthroughs = await getSubRecipientPassThroughs(sequelize,
 *   'city-001');
 * ```
 */
async function getSubRecipientPassThroughs(sequelize, subRecipientId) {
    const GrantPassThrough = getGrantPassThroughModel(sequelize);
    const passthroughs = await GrantPassThrough.findAll({
        where: {
            subRecipientId,
            status: 'ACTIVE',
        },
    });
    return passthroughs.map(p => p.toJSON());
}
/**
 * Calculates total pass-through funding.
 * Sums all pass-through amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} primeRecipientId - Prime recipient ID
 * @param {string} primaryGrantId - Primary grant ID
 * @returns {Promise<number>} Total pass-through amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalPassThrough(sequelize,
 *   'state-001', 'grant-001');
 * console.log(`Total pass-through: $${total}`);
 * ```
 */
async function calculateTotalPassThrough(sequelize, primeRecipientId, primaryGrantId) {
    const GrantPassThrough = getGrantPassThroughModel(sequelize);
    const passthroughs = await GrantPassThrough.findAll({
        where: {
            primeRecipientId,
            primaryGrantId,
            status: 'ACTIVE',
        },
    });
    return passthroughs.reduce((sum, p) => sum + parseFloat(p.passthroughAmount), 0);
}
// ============================================================================
// INTERGOVERNMENTAL BILLING
// ============================================================================
/**
 * Creates an intergovernmental invoice.
 * Bills one entity for services provided by another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} invoiceNumber - Invoice number
 * @param {string} billingEntityId - Billing entity ID
 * @param {string} billedEntityId - Billed entity ID
 * @param {BillingCycle} billingCycle - Billing cycle
 * @param {string} serviceDescription - Service description
 * @param {Date} periodStart - Billing period start
 * @param {Date} periodEnd - Billing period end
 * @param {IBillingLineItem[]} lineItems - Line items
 * @param {number} adjustments - Total adjustments
 * @param {Date} dueDate - Payment due date
 * @returns {Promise<IIntergovernmentalBilling>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createIntergovernmentalInvoice(sequelize,
 *   'INV-2024-001', 'county-001', 'city-001',
 *   BillingCycle.QUARTERLY, 'Emergency Services',
 *   new Date('2024-01-01'), new Date('2024-03-31'),
 *   lineItems, 0, new Date('2024-04-30'));
 * ```
 */
async function createIntergovernmentalInvoice(sequelize, invoiceNumber, billingEntityId, billedEntityId, billingCycle, serviceDescription, periodStart, periodEnd, lineItems, adjustments, dueDate) {
    const Billing = getIntergovernmentalBillingModel(sequelize);
    const subtotal = lineItems.reduce((sum, item) => sum + item.totalCost, 0);
    const totalAmount = subtotal + adjustments;
    const invoice = await Billing.create({
        invoiceNumber,
        billingEntityId,
        billedEntityId,
        billingCycle,
        serviceDescription,
        periodStart,
        periodEnd,
        lineItems,
        subtotal,
        adjustments,
        totalAmount,
        dueDate,
        status: 'ISSUED',
    });
    return invoice.toJSON();
}
/**
 * Records invoice payment.
 * Marks invoice as paid.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} invoiceId - Invoice ID
 * @param {Date} paidDate - Payment date
 * @param {string} paymentReference - Payment reference
 * @returns {Promise<IIntergovernmentalBilling>} Paid invoice
 *
 * @example
 * ```typescript
 * const paid = await recordInvoicePayment(sequelize, 'invoice-001',
 *   new Date(), 'CHK-20240115-001');
 * ```
 */
async function recordInvoicePayment(sequelize, invoiceId, paidDate, paymentReference) {
    const Billing = getIntergovernmentalBillingModel(sequelize);
    const invoice = await Billing.findByPk(invoiceId);
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    invoice.status = 'PAID';
    invoice.paidDate = paidDate;
    await invoice.save();
    return invoice.toJSON();
}
/**
 * Retrieves outstanding invoices.
 * Returns unpaid invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billedEntityId - Billed entity ID
 * @returns {Promise<IIntergovernmentalBilling[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoices(sequelize, 'city-001');
 * ```
 */
async function getOutstandingInvoices(sequelize, billedEntityId) {
    const Billing = getIntergovernmentalBillingModel(sequelize);
    const invoices = await Billing.findAll({
        where: {
            billedEntityId,
            status: {
                [sequelize_1.Op.in]: ['ISSUED', 'OVERDUE'],
            },
        },
    });
    return invoices.map(i => i.toJSON());
}
// ============================================================================
// COST ALLOCATION
// ============================================================================
/**
 * Creates a cost allocation.
 * Allocates shared costs among entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} allocationId - Allocation ID
 * @param {string} costPoolName - Cost pool name
 * @param {number} totalCost - Total cost to allocate
 * @param {DistributionMethod} allocationMethod - Allocation method
 * @param {string} allocationBasis - Allocation basis
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Period
 * @param {ICostAllocationDetail[]} allocations - Cost allocations
 * @returns {Promise<ICostAllocation>} Created cost allocation
 *
 * @example
 * ```typescript
 * const allocation = await createCostAllocation(sequelize,
 *   'ALLOC-2024-001', 'IT Services', 500000,
 *   DistributionMethod.USAGE_BASED, 'User count',
 *   2024, 'Q1', allocationDetails);
 * ```
 */
async function createCostAllocation(sequelize, allocationId, costPoolName, totalCost, allocationMethod, allocationBasis, fiscalYear, period, allocations) {
    const CostAllocation = getCostAllocationModel(sequelize);
    const allocation = await CostAllocation.create({
        allocationId,
        costPoolName,
        totalCost,
        allocationMethod,
        allocationBasis,
        fiscalYear,
        period,
        allocations,
        status: 'DRAFT',
    });
    return allocation.toJSON();
}
/**
 * Calculates usage-based cost allocation.
 * Allocates costs based on usage metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} totalCost - Total cost to allocate
 * @param {Array<{entityId: string, entityName: string, usage: number, accountCode: string}>} entities - Entities with usage
 * @returns {Promise<ICostAllocationDetail[]>} Calculated allocations
 *
 * @example
 * ```typescript
 * const allocations = await calculateUsageBasedAllocation(sequelize,
 *   100000, [{entityId: 'city-001', entityName: 'City A', usage: 500, accountCode: '5000'}]);
 * ```
 */
async function calculateUsageBasedAllocation(sequelize, totalCost, entities) {
    const totalUsage = entities.reduce((sum, e) => sum + e.usage, 0);
    if (totalUsage === 0) {
        throw new Error('Total usage cannot be zero');
    }
    return entities.map(entity => ({
        entityId: entity.entityId,
        entityName: entity.entityName,
        allocationBasis: entity.usage,
        allocationPercent: (entity.usage / totalUsage) * 100,
        allocatedCost: (totalCost * entity.usage) / totalUsage,
        accountCode: entity.accountCode,
    }));
}
/**
 * Approves cost allocation.
 * Authorizes cost allocation posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} allocationId - Cost allocation ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<ICostAllocation>} Approved allocation
 *
 * @example
 * ```typescript
 * const approved = await approveCostAllocation(sequelize,
 *   'alloc-001', 'user-123');
 * ```
 */
async function approveCostAllocation(sequelize, allocationId, approvedBy) {
    const CostAllocation = getCostAllocationModel(sequelize);
    const allocation = await CostAllocation.findByPk(allocationId);
    if (!allocation) {
        throw new Error(`Cost allocation ${allocationId} not found`);
    }
    allocation.status = 'APPROVED';
    await allocation.save();
    return allocation.toJSON();
}
// ============================================================================
// JOINT VENTURES
// ============================================================================
/**
 * Creates a joint venture.
 * Establishes joint venture between entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ventureName - Venture name
 * @param {string} ventureNumber - Venture number
 * @param {IJointVentureParticipant[]} participants - Participants
 * @param {string} purposeDescription - Purpose description
 * @param {number} totalBudget - Total budget
 * @param {number} fiscalYear - Fiscal year
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} fiscalAgent - Fiscal agent entity ID
 * @returns {Promise<IJointVenture>} Created joint venture
 *
 * @example
 * ```typescript
 * const venture = await createJointVenture(sequelize,
 *   'Regional Water Authority', 'JV-2024-001',
 *   participants, 'Water infrastructure project',
 *   5000000, 2024, new Date('2024-01-01'),
 *   new Date('2029-12-31'), 'county-001');
 * ```
 */
async function createJointVenture(sequelize, ventureName, ventureNumber, participants, purposeDescription, totalBudget, fiscalYear, startDate, endDate, fiscalAgent) {
    const JointVenture = getJointVentureModel(sequelize);
    const venture = await JointVenture.create({
        ventureName,
        ventureNumber,
        participants,
        purposeDescription,
        totalBudget,
        fiscalYear,
        startDate,
        endDate,
        fiscalAgent,
        status: AgreementStatus.ACTIVE,
    });
    return venture.toJSON();
}
/**
 * Adds participant to joint venture.
 * Includes new entity in existing venture.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ventureId - Joint venture ID
 * @param {IJointVentureParticipant} participant - New participant
 * @returns {Promise<IJointVenture>} Updated joint venture
 *
 * @example
 * ```typescript
 * const updated = await addJointVentureParticipant(sequelize,
 *   'venture-001', participant);
 * ```
 */
async function addJointVentureParticipant(sequelize, ventureId, participant) {
    const JointVenture = getJointVentureModel(sequelize);
    const venture = await JointVenture.findByPk(ventureId);
    if (!venture) {
        throw new Error(`Joint venture ${ventureId} not found`);
    }
    const participants = venture.participants;
    participants.push(participant);
    venture.participants = participants;
    await venture.save();
    return venture.toJSON();
}
// ============================================================================
// CONSORTIUM MANAGEMENT
// ============================================================================
/**
 * Creates a consortium.
 * Establishes multi-entity consortium.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} consortiumName - Consortium name
 * @param {string} consortiumNumber - Consortium number
 * @param {string} consortiumType - Consortium type
 * @param {IConsortiumMember[]} members - Initial members
 * @param {string} chairEntityId - Chair entity ID
 * @param {Date} foundedDate - Founded date
 * @param {string} fiscalAgent - Fiscal agent entity ID
 * @param {string[]} services - Services provided
 * @returns {Promise<IConsortium>} Created consortium
 *
 * @example
 * ```typescript
 * const consortium = await createConsortium(sequelize,
 *   'Regional Planning Consortium', 'CONS-2024-001',
 *   'Planning', members, 'county-001', new Date('2024-01-01'),
 *   'county-001', ['Planning', 'Development']);
 * ```
 */
async function createConsortium(sequelize, consortiumName, consortiumNumber, consortiumType, members, chairEntityId, foundedDate, fiscalAgent, services) {
    const Consortium = getConsortiumModel(sequelize);
    const consortium = await Consortium.create({
        consortiumName,
        consortiumNumber,
        consortiumType,
        members,
        chairEntityId,
        foundedDate,
        fiscalAgent,
        services,
        status: AgreementStatus.ACTIVE,
    });
    return consortium.toJSON();
}
/**
 * Adds consortium member.
 * Includes new entity in consortium.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} consortiumId - Consortium ID
 * @param {IConsortiumMember} member - New member
 * @returns {Promise<IConsortium>} Updated consortium
 *
 * @example
 * ```typescript
 * const updated = await addConsortiumMember(sequelize,
 *   'consortium-001', member);
 * ```
 */
async function addConsortiumMember(sequelize, consortiumId, member) {
    const Consortium = getConsortiumModel(sequelize);
    const consortium = await Consortium.findByPk(consortiumId);
    if (!consortium) {
        throw new Error(`Consortium ${consortiumId} not found`);
    }
    const members = consortium.members;
    members.push(member);
    consortium.members = members;
    await consortium.save();
    return consortium.toJSON();
}
// ============================================================================
// INTER-ENTITY LOANS
// ============================================================================
/**
 * Creates an inter-entity loan.
 * Establishes loan between government entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} loanNumber - Loan number
 * @param {string} lenderEntityId - Lender entity ID
 * @param {string} borrowerEntityId - Borrower entity ID
 * @param {number} principalAmount - Principal amount
 * @param {number} interestRate - Annual interest rate
 * @param {Date} originationDate - Origination date
 * @param {Date} maturityDate - Maturity date
 * @param {ILoanPayment[]} paymentSchedule - Payment schedule
 * @returns {Promise<IInterEntityLoan>} Created loan
 *
 * @example
 * ```typescript
 * const loan = await createInterEntityLoan(sequelize,
 *   'LOAN-2024-001', 'county-001', 'city-001',
 *   1000000, 2.5, new Date('2024-01-01'),
 *   new Date('2034-01-01'), paymentSchedule);
 * ```
 */
async function createInterEntityLoan(sequelize, loanNumber, lenderEntityId, borrowerEntityId, principalAmount, interestRate, originationDate, maturityDate, paymentSchedule) {
    const InterEntityLoan = getInterEntityLoanModel(sequelize);
    const loan = await InterEntityLoan.create({
        loanNumber,
        lenderEntityId,
        borrowerEntityId,
        principalAmount,
        interestRate,
        originationDate,
        maturityDate,
        paymentSchedule,
        outstandingPrincipal: principalAmount,
        outstandingInterest: 0,
        status: 'ACTIVE',
    });
    return loan.toJSON();
}
/**
 * Records loan payment.
 * Applies payment to loan balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} loanId - Loan ID
 * @param {number} paymentNumber - Payment number
 * @param {Date} paidDate - Payment date
 * @param {number} paidAmount - Amount paid
 * @returns {Promise<IInterEntityLoan>} Updated loan
 *
 * @example
 * ```typescript
 * const updated = await recordLoanPayment(sequelize, 'loan-001',
 *   1, new Date(), 10000);
 * ```
 */
async function recordLoanPayment(sequelize, loanId, paymentNumber, paidDate, paidAmount) {
    const InterEntityLoan = getInterEntityLoanModel(sequelize);
    const loan = await InterEntityLoan.findByPk(loanId);
    if (!loan) {
        throw new Error(`Loan ${loanId} not found`);
    }
    const schedule = loan.paymentSchedule;
    const payment = schedule.find(p => p.paymentNumber === paymentNumber);
    if (!payment) {
        throw new Error(`Payment ${paymentNumber} not found in schedule`);
    }
    payment.paidDate = paidDate;
    payment.paidAmount = paidAmount;
    payment.status = 'PAID';
    loan.outstandingPrincipal -= payment.principalAmount;
    loan.outstandingInterest -= payment.interestAmount;
    loan.paymentSchedule = schedule;
    await loan.save();
    return loan.toJSON();
}
/**
 * Calculates outstanding loan balance.
 * Returns total outstanding principal and interest.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} loanId - Loan ID
 * @returns {Promise<{principal: number, interest: number, total: number}>} Outstanding balance
 *
 * @example
 * ```typescript
 * const balance = await calculateLoanBalance(sequelize, 'loan-001');
 * console.log(`Outstanding: $${balance.total}`);
 * ```
 */
async function calculateLoanBalance(sequelize, loanId) {
    const InterEntityLoan = getInterEntityLoanModel(sequelize);
    const loan = await InterEntityLoan.findByPk(loanId);
    if (!loan) {
        throw new Error(`Loan ${loanId} not found`);
    }
    const principal = parseFloat(loan.outstandingPrincipal);
    const interest = parseFloat(loan.outstandingInterest);
    return {
        principal,
        interest,
        total: principal + interest,
    };
}
// ============================================================================
// STATE AID CALCULATIONS
// ============================================================================
/**
 * Creates a state aid calculation.
 * Calculates state aid for recipient entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} calculationId - Calculation ID
 * @param {string} aidProgramName - Aid program name
 * @param {string} recipientEntityId - Recipient entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {string} calculationMethod - Calculation method
 * @param {number} baseAmount - Base amount
 * @param {IAidAdjustment[]} adjustments - Adjustments
 * @param {Date[]} distributionSchedule - Distribution schedule
 * @returns {Promise<IStateAidCalculation>} Created calculation
 *
 * @example
 * ```typescript
 * const calculation = await createStateAidCalculation(sequelize,
 *   'CALC-2024-001', 'School Aid Formula', 'district-001',
 *   2024, 'Per-pupil allocation', 5000000, adjustments, dates);
 * ```
 */
async function createStateAidCalculation(sequelize, calculationId, aidProgramName, recipientEntityId, fiscalYear, calculationMethod, baseAmount, adjustments, distributionSchedule) {
    const StateAidCalculation = getStateAidCalculationModel(sequelize);
    const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const calculatedAmount = baseAmount + totalAdjustments;
    const calculation = await StateAidCalculation.create({
        calculationId,
        aidProgramName,
        recipientEntityId,
        fiscalYear,
        calculationMethod,
        baseAmount,
        adjustments,
        calculatedAmount,
        approvedAmount: calculatedAmount,
        distributionSchedule,
        status: 'CALCULATED',
    });
    return calculation.toJSON();
}
/**
 * Approves state aid calculation.
 * Authorizes state aid distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} calculationId - Calculation ID
 * @param {number} approvedAmount - Approved amount
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<IStateAidCalculation>} Approved calculation
 *
 * @example
 * ```typescript
 * const approved = await approveStateAid(sequelize, 'calc-001',
 *   5000000, 'user-123');
 * ```
 */
async function approveStateAid(sequelize, calculationId, approvedAmount, approvedBy) {
    const StateAidCalculation = getStateAidCalculationModel(sequelize);
    const calculation = await StateAidCalculation.findByPk(calculationId);
    if (!calculation) {
        throw new Error(`State aid calculation ${calculationId} not found`);
    }
    calculation.approvedAmount = approvedAmount;
    calculation.status = 'APPROVED';
    await calculation.save();
    return calculation.toJSON();
}
// ============================================================================
// FEDERAL REIMBURSEMENT TRACKING
// ============================================================================
/**
 * Creates a federal reimbursement request.
 * Requests federal reimbursement for eligible expenses.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reimbursementNumber - Reimbursement number
 * @param {string} federalProgramId - Federal program ID
 * @param {string} programName - Program name
 * @param {string} cfda - CFDA number
 * @param {string} recipientEntityId - Recipient entity ID
 * @param {number} requestedAmount - Requested amount
 * @param {number} federalShare - Federal share percent
 * @param {number} stateShare - State share percent
 * @param {number} localShare - Local share percent
 * @returns {Promise<IFederalReimbursement>} Created reimbursement request
 *
 * @example
 * ```typescript
 * const reimbursement = await createFederalReimbursement(sequelize,
 *   'FR-2024-001', 'prog-001', 'Medicaid', '93.778',
 *   'state-001', 1000000, 75, 15, 10);
 * ```
 */
async function createFederalReimbursement(sequelize, reimbursementNumber, federalProgramId, programName, cfda, recipientEntityId, requestedAmount, federalShare, stateShare, localShare) {
    const FederalReimbursement = getFederalReimbursementModel(sequelize);
    const federalAmount = (requestedAmount * federalShare) / 100;
    const stateAmount = (requestedAmount * stateShare) / 100;
    const localAmount = (requestedAmount * localShare) / 100;
    const reimbursement = await FederalReimbursement.create({
        reimbursementNumber,
        federalProgramId,
        programName,
        cfda,
        recipientEntityId,
        requestedAmount,
        eligibleAmount: requestedAmount,
        approvedAmount: 0,
        federalShare: federalAmount,
        stateShare: stateAmount,
        localShare: localAmount,
        requestDate: new Date(),
        status: TransferStatus.PENDING,
    });
    return reimbursement.toJSON();
}
/**
 * Approves federal reimbursement.
 * Authorizes federal reimbursement payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reimbursementId - Reimbursement ID
 * @param {number} approvedAmount - Approved amount
 * @param {Date} approvalDate - Approval date
 * @returns {Promise<IFederalReimbursement>} Approved reimbursement
 *
 * @example
 * ```typescript
 * const approved = await approveFederalReimbursement(sequelize,
 *   'reimb-001', 950000, new Date());
 * ```
 */
async function approveFederalReimbursement(sequelize, reimbursementId, approvedAmount, approvalDate) {
    const FederalReimbursement = getFederalReimbursementModel(sequelize);
    const reimbursement = await FederalReimbursement.findByPk(reimbursementId);
    if (!reimbursement) {
        throw new Error(`Federal reimbursement ${reimbursementId} not found`);
    }
    reimbursement.approvedAmount = approvedAmount;
    reimbursement.approvalDate = approvalDate;
    reimbursement.status = TransferStatus.APPROVED;
    await reimbursement.save();
    return reimbursement.toJSON();
}
// ============================================================================
// COLLABORATIVE PROJECTS
// ============================================================================
/**
 * Creates a collaborative project.
 * Establishes multi-entity collaborative project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} projectNumber - Project number
 * @param {string} projectName - Project name
 * @param {string} projectDescription - Project description
 * @param {string} projectType - Project type
 * @param {IProjectPartner[]} partners - Project partners
 * @param {number} totalBudget - Total budget
 * @param {IProjectFunding[]} fundingSources - Funding sources
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} projectManager - Project manager
 * @returns {Promise<ICollaborativeProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await createCollaborativeProject(sequelize,
 *   'PROJ-2024-001', 'Regional Infrastructure',
 *   'Joint infrastructure improvements', 'Infrastructure',
 *   partners, 10000000, funding, new Date('2024-01-01'),
 *   new Date('2026-12-31'), 'user-123');
 * ```
 */
async function createCollaborativeProject(sequelize, projectNumber, projectName, projectDescription, projectType, partners, totalBudget, fundingSources, startDate, endDate, projectManager) {
    const CollaborativeProject = getCollaborativeProjectModel(sequelize);
    const project = await CollaborativeProject.create({
        projectNumber,
        projectName,
        projectDescription,
        projectType,
        partners,
        totalBudget,
        fundingSources,
        startDate,
        endDate,
        projectManager,
        status: 'ACTIVE',
    });
    return project.toJSON();
}
// ============================================================================
// INTERGOVERNMENTAL RECONCILIATION
// ============================================================================
/**
 * Creates an intergovernmental reconciliation.
 * Reconciles transactions between two entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reconciliationId - Reconciliation ID
 * @param {Date} reconciliationDate - Reconciliation date
 * @param {string} entity1Id - First entity ID
 * @param {string} entity2Id - Second entity ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {number} entity1Balance - Entity 1 balance
 * @param {number} entity2Balance - Entity 2 balance
 * @param {IReconcilingItem[]} reconcilingItems - Reconciling items
 * @returns {Promise<IIntergovernmentalReconciliation>} Created reconciliation
 *
 * @example
 * ```typescript
 * const reconciliation = await createIntergovernmentalReconciliation(
 *   sequelize, 'RECON-2024-001', new Date(), 'entity-001',
 *   'entity-002', new Date('2024-01-01'), new Date('2024-03-31'),
 *   100000, 99500, reconcilingItems);
 * ```
 */
async function createIntergovernmentalReconciliation(sequelize, reconciliationId, reconciliationDate, entity1Id, entity2Id, periodStart, periodEnd, entity1Balance, entity2Balance, reconcilingItems) {
    const Reconciliation = getIntergovernmentalReconciliationModel(sequelize);
    const variance = Math.abs(entity1Balance - entity2Balance);
    const reconciliation = await Reconciliation.create({
        reconciliationId,
        reconciliationDate,
        entity1Id,
        entity2Id,
        periodStart,
        periodEnd,
        entity1Balance,
        entity2Balance,
        reconcilingItems,
        variance,
        resolved: variance === 0,
    });
    return reconciliation.toJSON();
}
/**
 * Resolves reconciliation.
 * Marks reconciliation as resolved.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reconciliationId - Reconciliation ID
 * @param {Date} resolvedDate - Resolved date
 * @returns {Promise<IIntergovernmentalReconciliation>} Resolved reconciliation
 *
 * @example
 * ```typescript
 * const resolved = await resolveReconciliation(sequelize,
 *   'recon-001', new Date());
 * ```
 */
async function resolveReconciliation(sequelize, reconciliationId, resolvedDate) {
    const Reconciliation = getIntergovernmentalReconciliationModel(sequelize);
    const reconciliation = await Reconciliation.findByPk(reconciliationId);
    if (!reconciliation) {
        throw new Error(`Reconciliation ${reconciliationId} not found`);
    }
    reconciliation.resolved = true;
    reconciliation.resolvedDate = resolvedDate;
    await reconciliation.save();
    return reconciliation.toJSON();
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
function getIntergovernmentalEntityModel(sequelize) {
    if (sequelize.models.IntergovernmentalEntity)
        return sequelize.models.IntergovernmentalEntity;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        entityCode: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        entityName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        entityType: { type: sequelize_1.DataTypes.ENUM(...Object.values(EntityType)), allowNull: false },
        jurisdiction: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        fipsCode: { type: sequelize_1.DataTypes.STRING(10), allowNull: true },
        contactName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        contactEmail: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        contactPhone: { type: sequelize_1.DataTypes.STRING(20), allowNull: false },
        address: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
    };
    return sequelize.define('IntergovernmentalEntity', attributes, {
        sequelize,
        modelName: 'IntergovernmentalEntity',
        tableName: 'intergovernmental_entities',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['entity_code'], unique: true },
            { fields: ['entity_type'] },
            { fields: ['status'] },
        ],
    });
}
function getIntergovernmentalAgreementModel(sequelize) {
    if (sequelize.models.IntergovernmentalAgreement)
        return sequelize.models.IntergovernmentalAgreement;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        agreementNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        agreementName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        agreementType: { type: sequelize_1.DataTypes.ENUM(...Object.values(TransferType)), allowNull: false },
        parties: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID), allowNull: false },
        leadEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        effectiveDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        expirationDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
        autoRenew: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        terms: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        totalAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: true },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(AgreementStatus)), allowNull: false },
    };
    return sequelize.define('IntergovernmentalAgreement', attributes, {
        sequelize,
        modelName: 'IntergovernmentalAgreement',
        tableName: 'intergovernmental_agreements',
        timestamps: true,
        underscored: true,
        indexes: [{ fields: ['agreement_number'], unique: true }, { fields: ['status'] }],
    });
}
function getIntergovernmentalTransferModel(sequelize) {
    if (sequelize.models.IntergovernmentalTransfer)
        return sequelize.models.IntergovernmentalTransfer;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        transferNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        transferType: { type: sequelize_1.DataTypes.ENUM(...Object.values(TransferType)), allowNull: false },
        fromEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        toEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        agreementId: { type: sequelize_1.DataTypes.UUID, allowNull: true },
        amount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        fiscalYear: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        period: { type: sequelize_1.DataTypes.STRING(20), allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        transferDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(TransferStatus)), allowNull: false },
        referenceNumber: { type: sequelize_1.DataTypes.STRING(100), allowNull: true },
    };
    return sequelize.define('IntergovernmentalTransfer', attributes, {
        sequelize,
        modelName: 'IntergovernmentalTransfer',
        tableName: 'intergovernmental_transfers',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['transfer_number'], unique: true },
            { fields: ['from_entity_id'] },
            { fields: ['to_entity_id'] },
            { fields: ['fiscal_year'] },
        ],
    });
}
function getRevenueSharingModel(sequelize) {
    if (sequelize.models.RevenueSharing)
        return sequelize.models.RevenueSharing;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        sharingProgramId: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
        programName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        revenueSource: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        fiscalYear: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        totalRevenue: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        distributionMethod: { type: sequelize_1.DataTypes.ENUM(...Object.values(DistributionMethod)), allowNull: false },
        distributionFormula: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        allocations: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        distributionDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        status: {
            type: sequelize_1.DataTypes.ENUM('CALCULATED', 'APPROVED', 'DISTRIBUTED', 'COMPLETED'),
            allowNull: false,
        },
    };
    return sequelize.define('RevenueSharing', attributes, {
        sequelize,
        modelName: 'RevenueSharing',
        tableName: 'revenue_sharing',
        timestamps: true,
        underscored: true,
    });
}
function getGrantPassThroughModel(sequelize) {
    if (sequelize.models.GrantPassThrough)
        return sequelize.models.GrantPassThrough;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        passthroughNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        primaryGrantId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        primeRecipientId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        subRecipientId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        passthroughAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        federalShare: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        stateShare: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        localMatch: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        cfda: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
        programName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        periodStart: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        periodEnd: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'CLOSED'), allowNull: false },
    };
    return sequelize.define('GrantPassThrough', attributes, {
        sequelize,
        modelName: 'GrantPassThrough',
        tableName: 'grant_pass_through',
        timestamps: true,
        underscored: true,
    });
}
function getIntergovernmentalBillingModel(sequelize) {
    if (sequelize.models.IntergovernmentalBilling)
        return sequelize.models.IntergovernmentalBilling;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        invoiceNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        billingEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        billedEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        billingCycle: { type: sequelize_1.DataTypes.ENUM(...Object.values(BillingCycle)), allowNull: false },
        serviceDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        periodStart: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        periodEnd: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        lineItems: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        subtotal: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        adjustments: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
        totalAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        dueDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        paidDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED'),
            allowNull: false,
        },
    };
    return sequelize.define('IntergovernmentalBilling', attributes, {
        sequelize,
        modelName: 'IntergovernmentalBilling',
        tableName: 'intergovernmental_billing',
        timestamps: true,
        underscored: true,
    });
}
function getCostAllocationModel(sequelize) {
    if (sequelize.models.CostAllocation)
        return sequelize.models.CostAllocation;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        allocationId: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        costPoolName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        totalCost: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        allocationMethod: { type: sequelize_1.DataTypes.ENUM(...Object.values(DistributionMethod)), allowNull: false },
        allocationBasis: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        fiscalYear: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        period: { type: sequelize_1.DataTypes.STRING(20), allowNull: false },
        allocations: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'), allowNull: false },
    };
    return sequelize.define('CostAllocation', attributes, {
        sequelize,
        modelName: 'CostAllocation',
        tableName: 'cost_allocations',
        timestamps: true,
        underscored: true,
    });
}
function getJointVentureModel(sequelize) {
    if (sequelize.models.JointVenture)
        return sequelize.models.JointVenture;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        ventureName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        ventureNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        participants: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        purposeDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        totalBudget: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        fiscalYear: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        startDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        endDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
        fiscalAgent: { type: sequelize_1.DataTypes.UUID, allowNull: true },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(AgreementStatus)), allowNull: false },
    };
    return sequelize.define('JointVenture', attributes, {
        sequelize,
        modelName: 'JointVenture',
        tableName: 'joint_ventures',
        timestamps: true,
        underscored: true,
    });
}
function getConsortiumModel(sequelize) {
    if (sequelize.models.Consortium)
        return sequelize.models.Consortium;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        consortiumName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        consortiumNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        consortiumType: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        members: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        chairEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        foundedDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        fiscalAgent: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        services: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(AgreementStatus)), allowNull: false },
    };
    return sequelize.define('Consortium', attributes, {
        sequelize,
        modelName: 'Consortium',
        tableName: 'consortiums',
        timestamps: true,
        underscored: true,
    });
}
function getInterEntityLoanModel(sequelize) {
    if (sequelize.models.InterEntityLoan)
        return sequelize.models.InterEntityLoan;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        loanNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        lenderEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        borrowerEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        principalAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        interestRate: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
        originationDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        maturityDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        paymentSchedule: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        outstandingPrincipal: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        outstandingInterest: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        status: {
            type: sequelize_1.DataTypes.ENUM('ACTIVE', 'PAID', 'DEFAULT', 'RESTRUCTURED'),
            allowNull: false,
        },
    };
    return sequelize.define('InterEntityLoan', attributes, {
        sequelize,
        modelName: 'InterEntityLoan',
        tableName: 'inter_entity_loans',
        timestamps: true,
        underscored: true,
    });
}
function getStateAidCalculationModel(sequelize) {
    if (sequelize.models.StateAidCalculation)
        return sequelize.models.StateAidCalculation;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        calculationId: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        aidProgramName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        recipientEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        fiscalYear: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        calculationMethod: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        baseAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        adjustments: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        calculatedAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        approvedAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        distributionSchedule: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.DATE), allowNull: false },
        status: {
            type: sequelize_1.DataTypes.ENUM('CALCULATED', 'APPROVED', 'DISTRIBUTED'),
            allowNull: false,
        },
    };
    return sequelize.define('StateAidCalculation', attributes, {
        sequelize,
        modelName: 'StateAidCalculation',
        tableName: 'state_aid_calculations',
        timestamps: true,
        underscored: true,
    });
}
function getFederalReimbursementModel(sequelize) {
    if (sequelize.models.FederalReimbursement)
        return sequelize.models.FederalReimbursement;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        reimbursementNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        federalProgramId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        programName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        cfda: { type: sequelize_1.DataTypes.STRING(20), allowNull: false },
        recipientEntityId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        requestedAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        eligibleAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        approvedAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        federalShare: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        stateShare: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        localShare: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        requestDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        approvalDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        disbursementDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(TransferStatus)), allowNull: false },
    };
    return sequelize.define('FederalReimbursement', attributes, {
        sequelize,
        modelName: 'FederalReimbursement',
        tableName: 'federal_reimbursements',
        timestamps: true,
        underscored: true,
    });
}
function getCollaborativeProjectModel(sequelize) {
    if (sequelize.models.CollaborativeProject)
        return sequelize.models.CollaborativeProject;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        projectNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        projectName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        projectDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        projectType: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        partners: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        totalBudget: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        fundingSources: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        startDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        endDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        projectManager: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        status: {
            type: sequelize_1.DataTypes.ENUM('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
            allowNull: false,
        },
    };
    return sequelize.define('CollaborativeProject', attributes, {
        sequelize,
        modelName: 'CollaborativeProject',
        tableName: 'collaborative_projects',
        timestamps: true,
        underscored: true,
    });
}
function getIntergovernmentalReconciliationModel(sequelize) {
    if (sequelize.models.IntergovernmentalReconciliation)
        return sequelize.models.IntergovernmentalReconciliation;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        reconciliationId: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        reconciliationDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        entity1Id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        entity2Id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        periodStart: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        periodEnd: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        entity1Balance: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        entity2Balance: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        reconcilingItems: { type: sequelize_1.DataTypes.JSON, allowNull: false },
        variance: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        resolved: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        resolvedDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    };
    return sequelize.define('IntergovernmentalReconciliation', attributes, {
        sequelize,
        modelName: 'IntergovernmentalReconciliation',
        tableName: 'intergovernmental_reconciliations',
        timestamps: true,
        underscored: true,
    });
}
exports.default = {
    createIntergovernmentalEntity,
    getActiveEntities,
    updateEntityContact,
    createIntergovernmentalAgreement,
    getEntityAgreements,
    terminateAgreement,
    getExpiringAgreements,
    createIntergovernmentalTransfer,
    approveTransfer,
    completeTransfer,
    getEntityTransfers,
    calculateTotalTransfers,
    createRevenueSharing,
    calculatePerCapitaSharing,
    calculatePercentageSharing,
    approveRevenueSharing,
    createGrantPassThrough,
    getSubRecipientPassThroughs,
    calculateTotalPassThrough,
    createIntergovernmentalInvoice,
    recordInvoicePayment,
    getOutstandingInvoices,
    createCostAllocation,
    calculateUsageBasedAllocation,
    approveCostAllocation,
    createJointVenture,
    addJointVentureParticipant,
    createConsortium,
    addConsortiumMember,
    createInterEntityLoan,
    recordLoanPayment,
    calculateLoanBalance,
    createStateAidCalculation,
    approveStateAid,
    createFederalReimbursement,
    approveFederalReimbursement,
    createCollaborativeProject,
    createIntergovernmentalReconciliation,
    resolveReconciliation,
};
//# sourceMappingURL=intergovernmental-transactions-kit.js.map