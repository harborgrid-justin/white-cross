/**
 * LOC: CEFMSCEA001
 * File: /reuse/financial/cefms/composites/cefms-capital-equipment-acquisition-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/procurement-contract-management-kit.ts
 *   - ../../../government/capital-asset-planning-kit.ts
 *   - ../../../government/asset-inventory-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS equipment services
 *   - USACE asset management systems
 *   - Equipment tracking modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-capital-equipment-acquisition-composite.ts
 * Locator: WC-CEFMS-CEA-001
 * Purpose: USACE CEFMS Capital Equipment Acquisition - procurement, budgeting, acquisition planning, asset tracking
 *
 * Upstream: Composes utilities from government kits for capital equipment management
 * Downstream: ../../../backend/cefms/*, Equipment controllers, asset tracking, procurement workflow
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 39 composite functions for USACE CEFMS capital equipment operations
 *
 * LLM Context: Production-ready USACE CEFMS capital equipment acquisition system.
 * Comprehensive equipment procurement planning, capital budgeting, acquisition solicitation, bid evaluation,
 * contract awards, asset tagging and registration, installation tracking, warranty management, maintenance scheduling,
 * equipment disposal, surplus property management, and asset lifecycle analytics.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EquipmentRequisitionData {
  requisitionId: string;
  equipmentCategory: string;
  equipmentDescription: string;
  quantity: number;
  estimatedUnitCost: number;
  totalEstimatedCost: number;
  justification: string;
  requestedBy: string;
  requestDate: Date;
  priorityLevel: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface CapitalBudgetData {
  budgetId: string;
  fiscalYear: number;
  budgetCategory: string;
  allocatedAmount: number;
  committedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  departmentCode: string;
}

interface ProcurementSolicitationData {
  solicitationId: string;
  requisitionId: string;
  solicitationType: 'rfp' | 'rfq' | 'itb' | 'sole_source';
  solicitationNumber: string;
  issueDate: Date;
  closeDate: Date;
  description: string;
  estimatedValue: number;
  status: 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';
}

interface BidEvaluationData {
  evaluationId: string;
  solicitationId: string;
  vendorId: string;
  vendorName: string;
  bidAmount: number;
  technicalScore: number;
  priceScore: number;
  totalScore: number;
  evaluatedBy: string;
  evaluationDate: Date;
  recommendation: 'accept' | 'reject' | 'negotiate';
}

interface EquipmentAwardData {
  awardId: string;
  solicitationId: string;
  vendorId: string;
  awardAmount: number;
  awardDate: Date;
  contractNumber: string;
  deliveryDate: Date;
  warrantyPeriod: number;
  status: 'awarded' | 'in_progress' | 'delivered' | 'completed';
}

interface AssetRegistrationData {
  assetId: string;
  awardId: string;
  assetTag: string;
  serialNumber: string;
  equipmentCategory: string;
  description: string;
  acquisitionCost: number;
  acquisitionDate: Date;
  location: string;
  assignedTo: string;
  condition: 'new' | 'good' | 'fair' | 'poor';
  status: 'active' | 'in_service' | 'out_of_service' | 'disposed';
}

interface MaintenanceScheduleData {
  scheduleId: string;
  assetId: string;
  maintenanceType: 'preventive' | 'corrective' | 'inspection';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  lastPerformed?: Date;
  nextDue: Date;
  assignedTo?: string;
}

interface DisposalRequestData {
  disposalId: string;
  assetId: string;
  disposalMethod: 'sale' | 'donation' | 'scrap' | 'trade_in';
  disposalReason: string;
  estimatedValue: number;
  requestedBy: string;
  requestDate: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Equipment Requisitions with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EquipmentRequisition model
 *
 * @example
 * ```typescript
 * const EquipmentRequisition = createEquipmentRequisitionModel(sequelize);
 * const requisition = await EquipmentRequisition.create({
 *   requisitionId: 'REQ-2024-001',
 *   equipmentCategory: 'Heavy Machinery',
 *   equipmentDescription: 'Excavator',
 *   quantity: 2,
 *   estimatedUnitCost: 150000,
 *   totalEstimatedCost: 300000,
 *   priorityLevel: 'high',
 *   status: 'submitted'
 * });
 * ```
 */
export const createEquipmentRequisitionModel = (sequelize: Sequelize) => {
  class EquipmentRequisition extends Model {
    public id!: string;
    public requisitionId!: string;
    public equipmentCategory!: string;
    public equipmentDescription!: string;
    public quantity!: number;
    public estimatedUnitCost!: number;
    public totalEstimatedCost!: number;
    public justification!: string;
    public requestedBy!: string;
    public requestDate!: Date;
    public priorityLevel!: string;
    public status!: string;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public rejectionReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EquipmentRequisition.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      requisitionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Requisition identifier',
      },
      equipmentCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Equipment category',
      },
      equipmentDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Equipment description',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Quantity requested',
        validate: { min: 1 },
      },
      estimatedUnitCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Estimated unit cost',
      },
      totalEstimatedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total estimated cost',
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Justification',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requested by user',
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Request date',
      },
      priorityLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Priority level',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Requisition status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rejection reason',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'equipment_requisitions',
      timestamps: true,
      indexes: [
        { fields: ['requisitionId'], unique: true },
        { fields: ['status'] },
        { fields: ['priorityLevel'] },
        { fields: ['requestDate'] },
      ],
    },
  );

  return EquipmentRequisition;
};

/**
 * Sequelize model for Capital Budgets with tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalBudget model
 */
export const createCapitalBudgetModel = (sequelize: Sequelize) => {
  class CapitalBudget extends Model {
    public id!: string;
    public budgetId!: string;
    public fiscalYear!: number;
    public budgetCategory!: string;
    public allocatedAmount!: number;
    public committedAmount!: number;
    public spentAmount!: number;
    public remainingAmount!: number;
    public departmentCode!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CapitalBudget.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      budgetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Budget identifier',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      budgetCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Budget category',
      },
      allocatedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Allocated amount',
      },
      committedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed amount',
      },
      spentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Spent amount',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining amount',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Department code',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'capital_budgets',
      timestamps: true,
      indexes: [
        { fields: ['budgetId'], unique: true },
        { fields: ['fiscalYear'] },
        { fields: ['departmentCode'] },
        { fields: ['budgetCategory'] },
      ],
    },
  );

  return CapitalBudget;
};

/**
 * Sequelize model for Procurement Solicitations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProcurementSolicitation model
 */
export const createProcurementSolicitationModel = (sequelize: Sequelize) => {
  class ProcurementSolicitation extends Model {
    public id!: string;
    public solicitationId!: string;
    public requisitionId!: string;
    public solicitationType!: string;
    public solicitationNumber!: string;
    public issueDate!: Date;
    public closeDate!: Date;
    public description!: string;
    public estimatedValue!: number;
    public status!: string;
    public bidsReceived!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProcurementSolicitation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      solicitationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Solicitation identifier',
      },
      requisitionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related requisition',
      },
      solicitationType: {
        type: DataTypes.ENUM('rfp', 'rfq', 'itb', 'sole_source'),
        allowNull: false,
        comment: 'Solicitation type',
      },
      solicitationNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Solicitation number',
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Issue date',
      },
      closeDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Close date',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Solicitation description',
      },
      estimatedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Estimated value',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'closed', 'awarded', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Solicitation status',
      },
      bidsReceived: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of bids received',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'procurement_solicitations',
      timestamps: true,
      indexes: [
        { fields: ['solicitationId'], unique: true },
        { fields: ['solicitationNumber'], unique: true },
        { fields: ['requisitionId'] },
        { fields: ['status'] },
        { fields: ['closeDate'] },
      ],
    },
  );

  return ProcurementSolicitation;
};

/**
 * Sequelize model for Bid Evaluations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BidEvaluation model
 */
export const createBidEvaluationModel = (sequelize: Sequelize) => {
  class BidEvaluation extends Model {
    public id!: string;
    public evaluationId!: string;
    public solicitationId!: string;
    public vendorId!: string;
    public vendorName!: string;
    public bidAmount!: number;
    public technicalScore!: number;
    public priceScore!: number;
    public totalScore!: number;
    public evaluatedBy!: string;
    public evaluationDate!: Date;
    public recommendation!: string;
    public comments!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BidEvaluation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      evaluationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Evaluation identifier',
      },
      solicitationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related solicitation',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Vendor ID',
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name',
      },
      bidAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Bid amount',
      },
      technicalScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Technical score',
        validate: { min: 0, max: 100 },
      },
      priceScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Price score',
        validate: { min: 0, max: 100 },
      },
      totalScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Total score',
        validate: { min: 0, max: 100 },
      },
      evaluatedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Evaluated by user',
      },
      evaluationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Evaluation date',
      },
      recommendation: {
        type: DataTypes.ENUM('accept', 'reject', 'negotiate'),
        allowNull: false,
        comment: 'Recommendation',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Evaluation comments',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'bid_evaluations',
      timestamps: true,
      indexes: [
        { fields: ['evaluationId'], unique: true },
        { fields: ['solicitationId'] },
        { fields: ['vendorId'] },
        { fields: ['recommendation'] },
      ],
    },
  );

  return BidEvaluation;
};

/**
 * Sequelize model for Equipment Awards.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EquipmentAward model
 */
export const createEquipmentAwardModel = (sequelize: Sequelize) => {
  class EquipmentAward extends Model {
    public id!: string;
    public awardId!: string;
    public solicitationId!: string;
    public vendorId!: string;
    public awardAmount!: number;
    public awardDate!: Date;
    public contractNumber!: string;
    public deliveryDate!: Date;
    public warrantyPeriod!: number;
    public status!: string;
    public actualDeliveryDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EquipmentAward.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Award identifier',
      },
      solicitationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related solicitation',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Vendor ID',
      },
      awardAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Award amount',
      },
      awardDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Award date',
      },
      contractNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Contract number',
      },
      deliveryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Expected delivery date',
      },
      warrantyPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 12,
        comment: 'Warranty period (months)',
      },
      status: {
        type: DataTypes.ENUM('awarded', 'in_progress', 'delivered', 'completed'),
        allowNull: false,
        defaultValue: 'awarded',
        comment: 'Award status',
      },
      actualDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual delivery date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'equipment_awards',
      timestamps: true,
      indexes: [
        { fields: ['awardId'], unique: true },
        { fields: ['contractNumber'], unique: true },
        { fields: ['solicitationId'] },
        { fields: ['status'] },
        { fields: ['deliveryDate'] },
      ],
    },
  );

  return EquipmentAward;
};

/**
 * Sequelize model for Asset Registration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetRegistration model
 */
export const createAssetRegistrationModel = (sequelize: Sequelize) => {
  class AssetRegistration extends Model {
    public id!: string;
    public assetId!: string;
    public awardId!: string;
    public assetTag!: string;
    public serialNumber!: string;
    public equipmentCategory!: string;
    public description!: string;
    public acquisitionCost!: number;
    public acquisitionDate!: Date;
    public location!: string;
    public assignedTo!: string;
    public condition!: string;
    public status!: string;
    public depreciationRate!: number;
    public currentValue!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AssetRegistration.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Asset identifier',
      },
      awardId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related award',
      },
      assetTag: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Asset tag number',
      },
      serialNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Serial number',
      },
      equipmentCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Equipment category',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Equipment description',
      },
      acquisitionCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Acquisition cost',
      },
      acquisitionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Acquisition date',
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Current location',
      },
      assignedTo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Assigned to user',
      },
      condition: {
        type: DataTypes.ENUM('new', 'good', 'fair', 'poor'),
        allowNull: false,
        defaultValue: 'new',
        comment: 'Condition',
      },
      status: {
        type: DataTypes.ENUM('active', 'in_service', 'out_of_service', 'disposed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Status',
      },
      depreciationRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 10,
        comment: 'Annual depreciation rate (%)',
      },
      currentValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current value',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'asset_registrations',
      timestamps: true,
      indexes: [
        { fields: ['assetId'], unique: true },
        { fields: ['assetTag'], unique: true },
        { fields: ['awardId'] },
        { fields: ['status'] },
        { fields: ['location'] },
        { fields: ['assignedTo'] },
      ],
    },
  );

  return AssetRegistration;
};

/**
 * Sequelize model for Disposal Requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DisposalRequest model
 */
export const createDisposalRequestModel = (sequelize: Sequelize) => {
  class DisposalRequest extends Model {
    public id!: string;
    public disposalId!: string;
    public assetId!: string;
    public disposalMethod!: string;
    public disposalReason!: string;
    public estimatedValue!: number;
    public requestedBy!: string;
    public requestDate!: Date;
    public approvalStatus!: string;
    public approvedBy!: string | null;
    public approvalDate!: Date | null;
    public actualDisposalDate!: Date | null;
    public actualValue!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DisposalRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      disposalId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Disposal identifier',
      },
      assetId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related asset',
      },
      disposalMethod: {
        type: DataTypes.ENUM('sale', 'donation', 'scrap', 'trade_in'),
        allowNull: false,
        comment: 'Disposal method',
      },
      disposalReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Disposal reason',
      },
      estimatedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Estimated value',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requested by user',
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Request date',
      },
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Approval status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      actualDisposalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual disposal date',
      },
      actualValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Actual value realized',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'disposal_requests',
      timestamps: true,
      indexes: [
        { fields: ['disposalId'], unique: true },
        { fields: ['assetId'] },
        { fields: ['approvalStatus'] },
        { fields: ['requestDate'] },
      ],
    },
  );

  return DisposalRequest;
};

// ============================================================================
// REQUISITION MANAGEMENT (1-5)
// ============================================================================

/**
 * Creates equipment requisition.
 *
 * @param {EquipmentRequisitionData} requisitionData - Requisition data
 * @param {Model} EquipmentRequisition - EquipmentRequisition model
 * @returns {Promise<any>} Created requisition
 */
export const createEquipmentRequisition = async (
  requisitionData: EquipmentRequisitionData,
  EquipmentRequisition: any,
): Promise<any> => {
  return await EquipmentRequisition.create(requisitionData);
};

/**
 * Approves or rejects requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {boolean} approved - Approval decision
 * @param {string} approverId - Approver ID
 * @param {string} [rejectionReason] - Rejection reason
 * @param {Model} EquipmentRequisition - EquipmentRequisition model
 * @returns {Promise<any>} Updated requisition
 */
export const approveRequisition = async (
  requisitionId: string,
  approved: boolean,
  approverId: string,
  rejectionReason: string | undefined,
  EquipmentRequisition: any,
): Promise<any> => {
  const requisition = await EquipmentRequisition.findOne({ where: { requisitionId } });
  if (!requisition) throw new Error('Requisition not found');

  requisition.status = approved ? 'approved' : 'rejected';
  requisition.approvedBy = approverId;
  requisition.approvalDate = new Date();
  if (!approved && rejectionReason) {
    requisition.rejectionReason = rejectionReason;
  }
  await requisition.save();

  return requisition;
};

/**
 * Retrieves pending requisitions by priority.
 *
 * @param {Model} EquipmentRequisition - EquipmentRequisition model
 * @returns {Promise<any[]>} Pending requisitions
 */
export const getPendingRequisitions = async (
  EquipmentRequisition: any,
): Promise<any[]> => {
  return await EquipmentRequisition.findAll({
    where: { status: 'submitted' },
    order: [
      ['priorityLevel', 'DESC'],
      ['requestDate', 'ASC'],
    ],
  });
};

/**
 * Validates requisition against capital budget.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {Model} EquipmentRequisition - EquipmentRequisition model
 * @param {Model} CapitalBudget - CapitalBudget model
 * @returns {Promise<{ fundingAvailable: boolean; remainingBudget: number }>}
 */
export const validateRequisitionBudget = async (
  requisitionId: string,
  EquipmentRequisition: any,
  CapitalBudget: any,
): Promise<{ fundingAvailable: boolean; remainingBudget: number }> => {
  const requisition = await EquipmentRequisition.findOne({ where: { requisitionId } });
  if (!requisition) throw new Error('Requisition not found');

  const budget = await CapitalBudget.findOne({
    where: { budgetCategory: requisition.equipmentCategory },
  });

  if (!budget) {
    return { fundingAvailable: false, remainingBudget: 0 };
  }

  const remainingBudget = parseFloat(budget.remainingAmount);
  return {
    fundingAvailable: remainingBudget >= requisition.totalEstimatedCost,
    remainingBudget,
  };
};

/**
 * Generates requisition summary report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} EquipmentRequisition - EquipmentRequisition model
 * @returns {Promise<any>} Requisition summary
 */
export const generateRequisitionSummary = async (
  startDate: Date,
  endDate: Date,
  EquipmentRequisition: any,
): Promise<any> => {
  const requisitions = await EquipmentRequisition.findAll({
    where: {
      requestDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const statusCounts = requisitions.reduce((acc: any, req: any) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});

  const totalValue = requisitions.reduce((sum: number, req: any) => sum + parseFloat(req.totalEstimatedCost), 0);

  return {
    period: { startDate, endDate },
    totalRequisitions: requisitions.length,
    totalValue,
    byStatus: statusCounts,
  };
};

// ============================================================================
// CAPITAL BUDGET MANAGEMENT (6-10)
// ============================================================================

/**
 * Creates capital budget allocation.
 *
 * @param {CapitalBudgetData} budgetData - Budget data
 * @param {Model} CapitalBudget - CapitalBudget model
 * @returns {Promise<any>} Created budget
 */
export const createCapitalBudget = async (
  budgetData: CapitalBudgetData,
  CapitalBudget: any,
): Promise<any> => {
  return await CapitalBudget.create({
    ...budgetData,
    remainingAmount: budgetData.allocatedAmount,
  });
};

/**
 * Commits budget for requisition.
 *
 * @param {string} budgetId - Budget ID
 * @param {number} amount - Amount to commit
 * @param {Model} CapitalBudget - CapitalBudget model
 * @returns {Promise<any>} Updated budget
 */
export const commitCapitalBudget = async (
  budgetId: string,
  amount: number,
  CapitalBudget: any,
): Promise<any> => {
  const budget = await CapitalBudget.findOne({ where: { budgetId } });
  if (!budget) throw new Error('Budget not found');

  if (parseFloat(budget.remainingAmount) < amount) {
    throw new Error('Insufficient budget');
  }

  budget.committedAmount = parseFloat(budget.committedAmount) + amount;
  budget.remainingAmount = parseFloat(budget.allocatedAmount) - parseFloat(budget.committedAmount) - parseFloat(budget.spentAmount);
  await budget.save();

  return budget;
};

/**
 * Releases committed budget.
 *
 * @param {string} budgetId - Budget ID
 * @param {number} amount - Amount to release
 * @param {Model} CapitalBudget - CapitalBudget model
 * @returns {Promise<any>} Updated budget
 */
export const releaseCommittedBudget = async (
  budgetId: string,
  amount: number,
  CapitalBudget: any,
): Promise<any> => {
  const budget = await CapitalBudget.findOne({ where: { budgetId } });
  if (!budget) throw new Error('Budget not found');

  budget.committedAmount = parseFloat(budget.committedAmount) - amount;
  budget.remainingAmount = parseFloat(budget.allocatedAmount) - parseFloat(budget.committedAmount) - parseFloat(budget.spentAmount);
  await budget.save();

  return budget;
};

/**
 * Records actual expenditure against budget.
 *
 * @param {string} budgetId - Budget ID
 * @param {number} amount - Expenditure amount
 * @param {Model} CapitalBudget - CapitalBudget model
 * @returns {Promise<any>} Updated budget
 */
export const recordBudgetExpenditure = async (
  budgetId: string,
  amount: number,
  CapitalBudget: any,
): Promise<any> => {
  const budget = await CapitalBudget.findOne({ where: { budgetId } });
  if (!budget) throw new Error('Budget not found');

  budget.spentAmount = parseFloat(budget.spentAmount) + amount;
  budget.committedAmount = parseFloat(budget.committedAmount) - amount;
  budget.remainingAmount = parseFloat(budget.allocatedAmount) - parseFloat(budget.committedAmount) - parseFloat(budget.spentAmount);
  await budget.save();

  return budget;
};

/**
 * Generates capital budget utilization report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} CapitalBudget - CapitalBudget model
 * @returns {Promise<any>} Utilization report
 */
export const generateBudgetUtilizationReport = async (
  fiscalYear: number,
  CapitalBudget: any,
): Promise<any> => {
  const budgets = await CapitalBudget.findAll({ where: { fiscalYear } });

  const totalAllocated = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.allocatedAmount), 0);
  const totalCommitted = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.committedAmount), 0);
  const totalSpent = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.spentAmount), 0);
  const totalRemaining = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.remainingAmount), 0);

  return {
    fiscalYear,
    totalAllocated,
    totalCommitted,
    totalSpent,
    totalRemaining,
    utilizationRate: totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0,
    categories: budgets.map((b: any) => ({
      category: b.budgetCategory,
      allocated: b.allocatedAmount,
      spent: b.spentAmount,
      remaining: b.remainingAmount,
    })),
  };
};

// ============================================================================
// PROCUREMENT & SOLICITATION (11-17)
// ============================================================================

/**
 * Creates procurement solicitation.
 *
 * @param {ProcurementSolicitationData} solicitationData - Solicitation data
 * @param {Model} ProcurementSolicitation - ProcurementSolicitation model
 * @returns {Promise<any>} Created solicitation
 */
export const createProcurementSolicitation = async (
  solicitationData: ProcurementSolicitationData,
  ProcurementSolicitation: any,
): Promise<any> => {
  return await ProcurementSolicitation.create(solicitationData);
};

/**
 * Publishes solicitation to vendors.
 *
 * @param {string} solicitationId - Solicitation ID
 * @param {Model} ProcurementSolicitation - ProcurementSolicitation model
 * @returns {Promise<any>} Published solicitation
 */
export const publishSolicitation = async (
  solicitationId: string,
  ProcurementSolicitation: any,
): Promise<any> => {
  const solicitation = await ProcurementSolicitation.findOne({ where: { solicitationId } });
  if (!solicitation) throw new Error('Solicitation not found');

  solicitation.status = 'published';
  await solicitation.save();

  return solicitation;
};

/**
 * Records bid submission.
 *
 * @param {string} solicitationId - Solicitation ID
 * @param {Model} ProcurementSolicitation - ProcurementSolicitation model
 * @returns {Promise<any>} Updated solicitation
 */
export const recordBidSubmission = async (
  solicitationId: string,
  ProcurementSolicitation: any,
): Promise<any> => {
  const solicitation = await ProcurementSolicitation.findOne({ where: { solicitationId } });
  if (!solicitation) throw new Error('Solicitation not found');

  solicitation.bidsReceived = solicitation.bidsReceived + 1;
  await solicitation.save();

  return solicitation;
};

/**
 * Closes solicitation for bidding.
 *
 * @param {string} solicitationId - Solicitation ID
 * @param {Model} ProcurementSolicitation - ProcurementSolicitation model
 * @returns {Promise<any>} Closed solicitation
 */
export const closeSolicitation = async (
  solicitationId: string,
  ProcurementSolicitation: any,
): Promise<any> => {
  const solicitation = await ProcurementSolicitation.findOne({ where: { solicitationId } });
  if (!solicitation) throw new Error('Solicitation not found');

  solicitation.status = 'closed';
  await solicitation.save();

  return solicitation;
};

/**
 * Evaluates vendor bid.
 *
 * @param {BidEvaluationData} evaluationData - Evaluation data
 * @param {Model} BidEvaluation - BidEvaluation model
 * @returns {Promise<any>} Created evaluation
 */
export const evaluateVendorBid = async (
  evaluationData: BidEvaluationData,
  BidEvaluation: any,
): Promise<any> => {
  return await BidEvaluation.create(evaluationData);
};

/**
 * Retrieves bid evaluations for solicitation.
 *
 * @param {string} solicitationId - Solicitation ID
 * @param {Model} BidEvaluation - BidEvaluation model
 * @returns {Promise<any[]>} Bid evaluations
 */
export const getBidEvaluations = async (
  solicitationId: string,
  BidEvaluation: any,
): Promise<any[]> => {
  return await BidEvaluation.findAll({
    where: { solicitationId },
    order: [['totalScore', 'DESC']],
  });
};

/**
 * Generates bid comparison matrix.
 *
 * @param {string} solicitationId - Solicitation ID
 * @param {Model} BidEvaluation - BidEvaluation model
 * @returns {Promise<any>} Bid comparison
 */
export const generateBidComparison = async (
  solicitationId: string,
  BidEvaluation: any,
): Promise<any> => {
  const evaluations = await BidEvaluation.findAll({
    where: { solicitationId },
    order: [['totalScore', 'DESC']],
  });

  return {
    solicitationId,
    totalBids: evaluations.length,
    lowestBid: evaluations.length > 0 ? Math.min(...evaluations.map((e: any) => parseFloat(e.bidAmount))) : 0,
    highestBid: evaluations.length > 0 ? Math.max(...evaluations.map((e: any) => parseFloat(e.bidAmount))) : 0,
    averageBid: evaluations.length > 0 ?
      evaluations.reduce((sum: number, e: any) => sum + parseFloat(e.bidAmount), 0) / evaluations.length : 0,
    bids: evaluations.map((e: any) => ({
      vendor: e.vendorName,
      amount: e.bidAmount,
      technicalScore: e.technicalScore,
      priceScore: e.priceScore,
      totalScore: e.totalScore,
      recommendation: e.recommendation,
    })),
  };
};

// ============================================================================
// AWARD & DELIVERY (18-24)
// ============================================================================

/**
 * Creates equipment award.
 *
 * @param {EquipmentAwardData} awardData - Award data
 * @param {Model} EquipmentAward - EquipmentAward model
 * @param {Model} ProcurementSolicitation - ProcurementSolicitation model
 * @returns {Promise<any>} Created award
 */
export const createEquipmentAward = async (
  awardData: EquipmentAwardData,
  EquipmentAward: any,
  ProcurementSolicitation: any,
): Promise<any> => {
  const award = await EquipmentAward.create(awardData);

  // Update solicitation
  const solicitation = await ProcurementSolicitation.findOne({
    where: { solicitationId: awardData.solicitationId },
  });
  if (solicitation) {
    solicitation.status = 'awarded';
    await solicitation.save();
  }

  return award;
};

/**
 * Tracks equipment delivery.
 *
 * @param {string} awardId - Award ID
 * @param {Date} deliveryDate - Actual delivery date
 * @param {Model} EquipmentAward - EquipmentAward model
 * @returns {Promise<any>} Updated award
 */
export const trackEquipmentDelivery = async (
  awardId: string,
  deliveryDate: Date,
  EquipmentAward: any,
): Promise<any> => {
  const award = await EquipmentAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  award.actualDeliveryDate = deliveryDate;
  award.status = 'delivered';
  await award.save();

  return award;
};

/**
 * Validates warranty coverage.
 *
 * @param {string} awardId - Award ID
 * @param {Model} EquipmentAward - EquipmentAward model
 * @returns {Promise<{ active: boolean; expirationDate: Date; daysRemaining: number }>}
 */
export const validateWarrantyCoverage = async (
  awardId: string,
  EquipmentAward: any,
): Promise<{ active: boolean; expirationDate: Date; daysRemaining: number }> => {
  const award = await EquipmentAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  const deliveryDate = award.actualDeliveryDate || award.deliveryDate;
  const expirationDate = new Date(deliveryDate);
  expirationDate.setMonth(expirationDate.getMonth() + award.warrantyPeriod);

  const now = new Date();
  const daysRemaining = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    active: daysRemaining > 0,
    expirationDate,
    daysRemaining: Math.max(0, daysRemaining),
  };
};

/**
 * Retrieves awards approaching delivery.
 *
 * @param {number} daysThreshold - Days threshold
 * @param {Model} EquipmentAward - EquipmentAward model
 * @returns {Promise<any[]>} Awards approaching delivery
 */
export const getUpcomingDeliveries = async (
  daysThreshold: number,
  EquipmentAward: any,
): Promise<any[]> => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + daysThreshold);

  return await EquipmentAward.findAll({
    where: {
      status: { [Op.in]: ['awarded', 'in_progress'] },
      deliveryDate: { [Op.lte]: threshold },
    },
    order: [['deliveryDate', 'ASC']],
  });
};

/**
 * Identifies delayed deliveries.
 *
 * @param {Model} EquipmentAward - EquipmentAward model
 * @returns {Promise<any[]>} Delayed awards
 */
export const identifyDelayedDeliveries = async (
  EquipmentAward: any,
): Promise<any[]> => {
  return await EquipmentAward.findAll({
    where: {
      status: { [Op.in]: ['awarded', 'in_progress'] },
      deliveryDate: { [Op.lt]: new Date() },
      actualDeliveryDate: null,
    },
    order: [['deliveryDate', 'ASC']],
  });
};

/**
 * Generates delivery tracking report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} EquipmentAward - EquipmentAward model
 * @returns {Promise<any>} Delivery report
 */
export const generateDeliveryReport = async (
  startDate: Date,
  endDate: Date,
  EquipmentAward: any,
): Promise<any> => {
  const awards = await EquipmentAward.findAll({
    where: {
      awardDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const delivered = awards.filter((a: any) => a.status === 'delivered' || a.status === 'completed');
  const onTime = delivered.filter((a: any) => a.actualDeliveryDate <= a.deliveryDate);

  return {
    period: { startDate, endDate },
    totalAwards: awards.length,
    delivered: delivered.length,
    onTime: onTime.length,
    onTimeRate: delivered.length > 0 ? (onTime.length / delivered.length) * 100 : 0,
  };
};

/**
 * Updates award contract modifications.
 *
 * @param {string} awardId - Award ID
 * @param {string} modificationType - Modification type
 * @param {string} description - Modification description
 * @param {Model} EquipmentAward - EquipmentAward model
 * @returns {Promise<any>} Updated award
 */
export const updateAwardModification = async (
  awardId: string,
  modificationType: string,
  description: string,
  EquipmentAward: any,
): Promise<any> => {
  const award = await EquipmentAward.findOne({ where: { awardId } });
  if (!award) throw new Error('Award not found');

  award.metadata = {
    ...award.metadata,
    modifications: [
      ...(award.metadata.modifications || []),
      {
        type: modificationType,
        description,
        date: new Date().toISOString(),
      },
    ],
  };
  await award.save();

  return award;
};

// ============================================================================
// ASSET REGISTRATION & TRACKING (25-31)
// ============================================================================

/**
 * Registers equipment asset.
 *
 * @param {AssetRegistrationData} assetData - Asset data
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any>} Created asset
 */
export const registerEquipmentAsset = async (
  assetData: AssetRegistrationData,
  AssetRegistration: any,
): Promise<any> => {
  return await AssetRegistration.create({
    ...assetData,
    currentValue: assetData.acquisitionCost,
  });
};

/**
 * Transfers asset to new location or owner.
 *
 * @param {string} assetId - Asset ID
 * @param {string} newLocation - New location
 * @param {string} newAssignedTo - New assigned user
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any>} Updated asset
 */
export const transferAsset = async (
  assetId: string,
  newLocation: string,
  newAssignedTo: string,
  AssetRegistration: any,
): Promise<any> => {
  const asset = await AssetRegistration.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  const oldLocation = asset.location;
  const oldAssignedTo = asset.assignedTo;

  asset.location = newLocation;
  asset.assignedTo = newAssignedTo;
  asset.metadata = {
    ...asset.metadata,
    transfers: [
      ...(asset.metadata.transfers || []),
      {
        date: new Date().toISOString(),
        fromLocation: oldLocation,
        toLocation: newLocation,
        fromUser: oldAssignedTo,
        toUser: newAssignedTo,
      },
    ],
  };
  await asset.save();

  return asset;
};

/**
 * Updates asset condition.
 *
 * @param {string} assetId - Asset ID
 * @param {string} condition - New condition
 * @param {string} notes - Condition notes
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any>} Updated asset
 */
export const updateAssetCondition = async (
  assetId: string,
  condition: string,
  notes: string,
  AssetRegistration: any,
): Promise<any> => {
  const asset = await AssetRegistration.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  asset.condition = condition;
  asset.metadata = {
    ...asset.metadata,
    conditionHistory: [
      ...(asset.metadata.conditionHistory || []),
      {
        date: new Date().toISOString(),
        condition,
        notes,
      },
    ],
  };
  await asset.save();

  return asset;
};

/**
 * Calculates asset depreciation.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<{ currentValue: number; totalDepreciation: number; yearsInService: number }>}
 */
export const calculateAssetDepreciation = async (
  assetId: string,
  AssetRegistration: any,
): Promise<{ currentValue: number; totalDepreciation: number; yearsInService: number }> => {
  const asset = await AssetRegistration.findOne({ where: { assetId } });
  if (!asset) throw new Error('Asset not found');

  const now = new Date();
  const yearsInService = (now.getTime() - asset.acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  const depreciationRate = parseFloat(asset.depreciationRate) / 100;
  const totalDepreciation = parseFloat(asset.acquisitionCost) * depreciationRate * yearsInService;
  const currentValue = Math.max(0, parseFloat(asset.acquisitionCost) - totalDepreciation);

  asset.currentValue = currentValue;
  await asset.save();

  return {
    currentValue,
    totalDepreciation,
    yearsInService,
  };
};

/**
 * Retrieves assets by location.
 *
 * @param {string} location - Location
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any[]>} Assets at location
 */
export const getAssetsByLocation = async (
  location: string,
  AssetRegistration: any,
): Promise<any[]> => {
  return await AssetRegistration.findAll({
    where: {
      location,
      status: { [Op.in]: ['active', 'in_service'] },
    },
    order: [['assetTag', 'ASC']],
  });
};

/**
 * Generates asset inventory report.
 *
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any>} Inventory report
 */
export const generateAssetInventoryReport = async (
  AssetRegistration: any,
): Promise<any> => {
  const assets = await AssetRegistration.findAll();

  const totalAssets = assets.length;
  const activeAssets = assets.filter((a: any) => a.status === 'active' || a.status === 'in_service').length;
  const totalValue = assets.reduce((sum: number, a: any) => sum + parseFloat(a.currentValue), 0);

  const byCategory = assets.reduce((acc: any, asset: any) => {
    const category = asset.equipmentCategory;
    if (!acc[category]) {
      acc[category] = { count: 0, value: 0 };
    }
    acc[category].count += 1;
    acc[category].value += parseFloat(asset.currentValue);
    return acc;
  }, {});

  return {
    totalAssets,
    activeAssets,
    totalValue,
    byCategory: Object.entries(byCategory).map(([category, data]: [string, any]) => ({
      category,
      count: data.count,
      value: data.value,
    })),
  };
};

/**
 * Exports asset inventory to CSV.
 *
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportAssetInventoryCSV = async (
  AssetRegistration: any,
): Promise<Buffer> => {
  const assets = await AssetRegistration.findAll();

  const csv = 'Asset ID,Asset Tag,Category,Description,Location,Assigned To,Acquisition Cost,Current Value,Status\n' +
    assets.map((asset: any) =>
      `${asset.assetId},${asset.assetTag},${asset.equipmentCategory},${asset.description},${asset.location},${asset.assignedTo},${asset.acquisitionCost},${asset.currentValue},${asset.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// DISPOSAL MANAGEMENT (32-39)
// ============================================================================

/**
 * Creates disposal request.
 *
 * @param {DisposalRequestData} disposalData - Disposal data
 * @param {Model} DisposalRequest - DisposalRequest model
 * @returns {Promise<any>} Created disposal request
 */
export const createDisposalRequest = async (
  disposalData: DisposalRequestData,
  DisposalRequest: any,
): Promise<any> => {
  return await DisposalRequest.create(disposalData);
};

/**
 * Approves or rejects disposal request.
 *
 * @param {string} disposalId - Disposal ID
 * @param {boolean} approved - Approval decision
 * @param {string} approverId - Approver ID
 * @param {Model} DisposalRequest - DisposalRequest model
 * @returns {Promise<any>} Updated disposal request
 */
export const approveDisposalRequest = async (
  disposalId: string,
  approved: boolean,
  approverId: string,
  DisposalRequest: any,
): Promise<any> => {
  const disposal = await DisposalRequest.findOne({ where: { disposalId } });
  if (!disposal) throw new Error('Disposal request not found');

  disposal.approvalStatus = approved ? 'approved' : 'rejected';
  disposal.approvedBy = approverId;
  disposal.approvalDate = new Date();
  await disposal.save();

  return disposal;
};

/**
 * Records disposal completion.
 *
 * @param {string} disposalId - Disposal ID
 * @param {Date} disposalDate - Disposal date
 * @param {number} actualValue - Actual value realized
 * @param {Model} DisposalRequest - DisposalRequest model
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any>} Completed disposal
 */
export const recordDisposalCompletion = async (
  disposalId: string,
  disposalDate: Date,
  actualValue: number,
  DisposalRequest: any,
  AssetRegistration: any,
): Promise<any> => {
  const disposal = await DisposalRequest.findOne({ where: { disposalId } });
  if (!disposal) throw new Error('Disposal request not found');

  disposal.actualDisposalDate = disposalDate;
  disposal.actualValue = actualValue;
  await disposal.save();

  // Update asset
  const asset = await AssetRegistration.findOne({ where: { assetId: disposal.assetId } });
  if (asset) {
    asset.status = 'disposed';
    await asset.save();
  }

  return disposal;
};

/**
 * Retrieves pending disposal requests.
 *
 * @param {Model} DisposalRequest - DisposalRequest model
 * @returns {Promise<any[]>} Pending disposals
 */
export const getPendingDisposals = async (
  DisposalRequest: any,
): Promise<any[]> => {
  return await DisposalRequest.findAll({
    where: { approvalStatus: 'pending' },
    order: [['requestDate', 'ASC']],
  });
};

/**
 * Generates surplus property report.
 *
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any[]>} Surplus assets
 */
export const generateSurplusPropertyReport = async (
  AssetRegistration: any,
): Promise<any[]> => {
  return await AssetRegistration.findAll({
    where: {
      status: 'out_of_service',
      condition: { [Op.in]: ['fair', 'poor'] },
    },
    order: [['acquisitionDate', 'ASC']],
  });
};

/**
 * Generates disposal value analysis.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DisposalRequest - DisposalRequest model
 * @returns {Promise<any>} Disposal analysis
 */
export const generateDisposalAnalysis = async (
  startDate: Date,
  endDate: Date,
  DisposalRequest: any,
): Promise<any> => {
  const disposals = await DisposalRequest.findAll({
    where: {
      actualDisposalDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalEstimatedValue = disposals.reduce((sum: number, d: any) => sum + parseFloat(d.estimatedValue), 0);
  const totalActualValue = disposals.reduce((sum: number, d: any) => sum + (parseFloat(d.actualValue) || 0), 0);

  const byMethod = disposals.reduce((acc: any, disposal: any) => {
    const method = disposal.disposalMethod;
    if (!acc[method]) {
      acc[method] = { count: 0, value: 0 };
    }
    acc[method].count += 1;
    acc[method].value += parseFloat(disposal.actualValue) || 0;
    return acc;
  }, {});

  return {
    period: { startDate, endDate },
    totalDisposals: disposals.length,
    totalEstimatedValue,
    totalActualValue,
    valueRecoveryRate: totalEstimatedValue > 0 ? (totalActualValue / totalEstimatedValue) * 100 : 0,
    byMethod: Object.entries(byMethod).map(([method, data]: [string, any]) => ({
      method,
      count: data.count,
      value: data.value,
    })),
  };
};

/**
 * Identifies assets eligible for disposal.
 *
 * @param {number} yearsOld - Years old threshold
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any[]>} Assets eligible for disposal
 */
export const identifyDisposalEligibleAssets = async (
  yearsOld: number,
  AssetRegistration: any,
): Promise<any[]> => {
  const threshold = new Date();
  threshold.setFullYear(threshold.getFullYear() - yearsOld);

  return await AssetRegistration.findAll({
    where: {
      acquisitionDate: { [Op.lt]: threshold },
      status: { [Op.in]: ['active', 'in_service', 'out_of_service'] },
    },
    order: [['acquisitionDate', 'ASC']],
  });
};

/**
 * Generates equipment lifecycle analytics.
 *
 * @param {string} equipmentCategory - Equipment category
 * @param {Model} AssetRegistration - AssetRegistration model
 * @returns {Promise<any>} Lifecycle analytics
 */
export const generateLifecycleAnalytics = async (
  equipmentCategory: string,
  AssetRegistration: any,
): Promise<any> => {
  const assets = await AssetRegistration.findAll({
    where: { equipmentCategory },
  });

  const averageAge = assets.reduce((sum: number, asset: any) => {
    const age = (new Date().getTime() - asset.acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return sum + age;
  }, 0) / assets.length;

  const averageCost = assets.reduce((sum: number, asset: any) => sum + parseFloat(asset.acquisitionCost), 0) / assets.length;

  return {
    category: equipmentCategory,
    totalAssets: assets.length,
    averageAge,
    averageCost,
    totalValue: assets.reduce((sum: number, a: any) => sum + parseFloat(a.currentValue), 0),
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSCapitalEquipmentService {
  constructor(private readonly sequelize: Sequelize) {}

  async createRequisition(requisitionData: EquipmentRequisitionData) {
    const EquipmentRequisition = createEquipmentRequisitionModel(this.sequelize);
    return createEquipmentRequisition(requisitionData, EquipmentRequisition);
  }

  async createSolicitation(solicitationData: ProcurementSolicitationData) {
    const ProcurementSolicitation = createProcurementSolicitationModel(this.sequelize);
    return createProcurementSolicitation(solicitationData, ProcurementSolicitation);
  }

  async registerAsset(assetData: AssetRegistrationData) {
    const AssetRegistration = createAssetRegistrationModel(this.sequelize);
    return registerEquipmentAsset(assetData, AssetRegistration);
  }

  async getInventoryReport() {
    const AssetRegistration = createAssetRegistrationModel(this.sequelize);
    return generateAssetInventoryReport(AssetRegistration);
  }
}

export default {
  // Models
  createEquipmentRequisitionModel,
  createCapitalBudgetModel,
  createProcurementSolicitationModel,
  createBidEvaluationModel,
  createEquipmentAwardModel,
  createAssetRegistrationModel,
  createDisposalRequestModel,

  // Requisitions
  createEquipmentRequisition,
  approveRequisition,
  getPendingRequisitions,
  validateRequisitionBudget,
  generateRequisitionSummary,

  // Budgets
  createCapitalBudget,
  commitCapitalBudget,
  releaseCommittedBudget,
  recordBudgetExpenditure,
  generateBudgetUtilizationReport,

  // Procurement
  createProcurementSolicitation,
  publishSolicitation,
  recordBidSubmission,
  closeSolicitation,
  evaluateVendorBid,
  getBidEvaluations,
  generateBidComparison,

  // Awards & Delivery
  createEquipmentAward,
  trackEquipmentDelivery,
  validateWarrantyCoverage,
  getUpcomingDeliveries,
  identifyDelayedDeliveries,
  generateDeliveryReport,
  updateAwardModification,

  // Assets
  registerEquipmentAsset,
  transferAsset,
  updateAssetCondition,
  calculateAssetDepreciation,
  getAssetsByLocation,
  generateAssetInventoryReport,
  exportAssetInventoryCSV,

  // Disposal
  createDisposalRequest,
  approveDisposalRequest,
  recordDisposalCompletion,
  getPendingDisposals,
  generateSurplusPropertyReport,
  generateDisposalAnalysis,
  identifyDisposalEligibleAssets,
  generateLifecycleAnalytics,

  // Service
  CEFMSCapitalEquipmentService,
};
