/**
 * CEFMS Procurement Backend Service
 *
 * This service provides comprehensive backend functionality for procurement and contract
 * accounting operations in the Corps of Engineers Financial Management System (CEFMS).
 * It imports and extends functionality from the procurement-contract-accounting composite.
 *
 * Key Features:
 * - Purchase requisition processing and approval workflows
 * - Purchase order creation, modification, and lifecycle management
 * - Contract obligation tracking and funds control
 * - Procurement compliance and audit trail management
 * - Vendor management and performance tracking
 * - Cost and pricing analysis
 * - Procurement reporting and analytics
 *
 * @module CEFMSProcurementBackendService
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Sequelize, DataTypes, Model, Transaction, Op, QueryTypes } from 'sequelize';
import {
  createPurchaseRequisitionModel,
  createPurchaseOrderModel,
  createContractObligationModel,
  createProcurementLineItemModel,
  createVendorPerformanceModel,
  CEFMSProcurementContractAccountingService
} from '../cefms-procurement-contract-accounting-composite';

/**
 * Procurement document status enumeration
 */
export enum ProcurementStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD'
}

/**
 * Purchase order type enumeration
 */
export enum PurchaseOrderType {
  STANDARD = 'STANDARD',
  BLANKET = 'BLANKET',
  CONTRACT = 'CONTRACT',
  EMERGENCY = 'EMERGENCY',
  SMALL_PURCHASE = 'SMALL_PURCHASE',
  MICRO_PURCHASE = 'MICRO_PURCHASE'
}

/**
 * Contract type enumeration
 */
export enum ContractType {
  FIXED_PRICE = 'FIXED_PRICE',
  COST_PLUS_FIXED_FEE = 'COST_PLUS_FIXED_FEE',
  COST_PLUS_AWARD_FEE = 'COST_PLUS_AWARD_FEE',
  TIME_AND_MATERIALS = 'TIME_AND_MATERIALS',
  INDEFINITE_DELIVERY = 'INDEFINITE_DELIVERY',
  CONSTRUCTION = 'CONSTRUCTION'
}

/**
 * Approval level enumeration
 */
export enum ApprovalLevel {
  SUPERVISOR = 'SUPERVISOR',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  CONTRACTING_OFFICER = 'CONTRACTING_OFFICER',
  FINANCE_DIRECTOR = 'FINANCE_DIRECTOR',
  COMMANDING_OFFICER = 'COMMANDING_OFFICER'
}

/**
 * Funds availability status
 */
export enum FundsAvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  INSUFFICIENT = 'INSUFFICIENT',
  RESERVED = 'RESERVED',
  COMMITTED = 'COMMITTED',
  OBLIGATED = 'OBLIGATED'
}

/**
 * Procurement method enumeration
 */
export enum ProcurementMethod {
  COMPETITIVE_BIDDING = 'COMPETITIVE_BIDDING',
  SOLE_SOURCE = 'SOLE_SOURCE',
  SIMPLIFIED_ACQUISITION = 'SIMPLIFIED_ACQUISITION',
  GSA_SCHEDULE = 'GSA_SCHEDULE',
  GOVERNMENT_WIDE_ACQUISITION = 'GOVERNMENT_WIDE_ACQUISITION'
}

/**
 * Vendor performance rating
 */
export enum VendorPerformanceRating {
  EXCEPTIONAL = 'EXCEPTIONAL',
  VERY_GOOD = 'VERY_GOOD',
  SATISFACTORY = 'SATISFACTORY',
  MARGINAL = 'MARGINAL',
  UNSATISFACTORY = 'UNSATISFACTORY'
}

/**
 * Purchase requisition data interface
 */
export interface PurchaseRequisitionData {
  requisitionNumber: string;
  requestorId: string;
  departmentId: string;
  projectId?: string;
  description: string;
  justification: string;
  estimatedAmount: number;
  urgencyLevel: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  requestedDeliveryDate: Date;
  lineItems: RequisitionLineItemData[];
  accountingCodes: string[];
  fundingSource: string;
  metadata?: Record<string, any>;
}

/**
 * Requisition line item data interface
 */
export interface RequisitionLineItemData {
  lineNumber: number;
  itemDescription: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  accountCode: string;
  notes?: string;
}

/**
 * Purchase order data interface
 */
export interface PurchaseOrderData {
  poNumber: string;
  requisitionId?: string;
  vendorId: string;
  orderType: PurchaseOrderType;
  orderDate: Date;
  deliveryDate: Date;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  netAmount: number;
  paymentTerms: string;
  deliveryAddress: string;
  billingAddress: string;
  lineItems: PurchaseOrderLineItemData[];
  approvedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Purchase order line item data interface
 */
export interface PurchaseOrderLineItemData {
  lineNumber: number;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  accountCode: string;
  deliveryDate: Date;
  notes?: string;
}

/**
 * Contract obligation data interface
 */
export interface ContractObligationData {
  obligationNumber: string;
  contractId: string;
  obligationAmount: number;
  obligationDate: Date;
  fiscalYear: number;
  fundingSource: string;
  accountingCodes: string[];
  description: string;
  effectiveDate: Date;
  expirationDate: Date;
  metadata?: Record<string, any>;
}

/**
 * Approval workflow data interface
 */
export interface ApprovalWorkflowData {
  documentId: string;
  documentType: 'REQUISITION' | 'PURCHASE_ORDER' | 'CONTRACT';
  currentLevel: ApprovalLevel;
  approverId: string;
  comments?: string;
  action: 'APPROVE' | 'REJECT' | 'RETURN';
}

/**
 * Vendor performance data interface
 */
export interface VendorPerformanceData {
  vendorId: string;
  contractId: string;
  evaluationPeriod: string;
  qualityRating: VendorPerformanceRating;
  deliveryRating: VendorPerformanceRating;
  complianceRating: VendorPerformanceRating;
  overallRating: VendorPerformanceRating;
  comments: string;
  evaluatedBy: string;
  evaluationDate: Date;
}

/**
 * Funds availability check result
 */
export interface FundsAvailabilityResult {
  available: boolean;
  status: FundsAvailabilityStatus;
  requestedAmount: number;
  availableAmount: number;
  reservedAmount: number;
  committedAmount: number;
  obligatedAmount: number;
  remainingAmount: number;
  accountBreakdown: AccountFundsBreakdown[];
}

/**
 * Account funds breakdown
 */
export interface AccountFundsBreakdown {
  accountCode: string;
  budgetedAmount: number;
  availableAmount: number;
  reservedAmount: number;
  committedAmount: number;
  obligatedAmount: number;
  expendedAmount: number;
}

/**
 * Procurement requisition approval model
 */
export const createRequisitionApprovalModel = (sequelize: Sequelize) => {
  class RequisitionApproval extends Model {
    public id!: string;
    public requisitionId!: string;
    public approvalLevel!: ApprovalLevel;
    public approverId!: string;
    public approverName!: string;
    public action!: 'APPROVE' | 'REJECT' | 'RETURN';
    public comments!: string;
    public approvalDate!: Date;
    public sequenceNumber!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RequisitionApproval.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the approval record'
      },
      requisitionId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the purchase requisition'
      },
      approvalLevel: {
        type: DataTypes.ENUM(...Object.values(ApprovalLevel)),
        allowNull: false,
        comment: 'Level of approval in the workflow'
      },
      approverId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID of the approver'
      },
      approverName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Full name of the approver'
      },
      action: {
        type: DataTypes.ENUM('APPROVE', 'REJECT', 'RETURN'),
        allowNull: false,
        comment: 'Action taken by the approver'
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Approver comments or notes'
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date and time of approval action'
      },
      sequenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Sequence number in the approval chain'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional metadata for the approval'
      }
    },
    {
      sequelize,
      tableName: 'requisition_approvals',
      timestamps: true,
      indexes: [
        { fields: ['requisitionId'] },
        { fields: ['approverId'] },
        { fields: ['approvalLevel'] },
        { fields: ['approvalDate'] },
        { fields: ['requisitionId', 'sequenceNumber'], unique: true }
      ]
    }
  );

  return RequisitionApproval;
};

/**
 * Purchase order receipt model
 */
export const createPurchaseOrderReceiptModel = (sequelize: Sequelize) => {
  class PurchaseOrderReceipt extends Model {
    public id!: string;
    public receiptNumber!: string;
    public purchaseOrderId!: string;
    public poNumber!: string;
    public lineItemId!: string;
    public receivedDate!: Date;
    public receivedBy!: string;
    public receivedQuantity!: number;
    public acceptedQuantity!: number;
    public rejectedQuantity!: number;
    public damageQuantity!: number;
    public inspectionStatus!: 'PENDING' | 'PASSED' | 'FAILED' | 'CONDITIONAL';
    public inspectionNotes!: string;
    public location!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PurchaseOrderReceipt.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the receipt record'
      },
      receiptNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique receipt number'
      },
      purchaseOrderId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the purchase order'
      },
      poNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Purchase order number for reference'
      },
      lineItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the specific line item received'
      },
      receivedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date items were received'
      },
      receivedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who received the items'
      },
      receivedQuantity: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total quantity received'
      },
      acceptedQuantity: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Quantity accepted after inspection'
      },
      rejectedQuantity: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quantity rejected due to defects'
      },
      damageQuantity: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quantity damaged during shipping'
      },
      inspectionStatus: {
        type: DataTypes.ENUM('PENDING', 'PASSED', 'FAILED', 'CONDITIONAL'),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'Inspection status of received items'
      },
      inspectionNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notes from the receiving inspection'
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Storage location of received items'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional receipt metadata'
      }
    },
    {
      sequelize,
      tableName: 'purchase_order_receipts',
      timestamps: true,
      indexes: [
        { fields: ['receiptNumber'], unique: true },
        { fields: ['purchaseOrderId'] },
        { fields: ['poNumber'] },
        { fields: ['lineItemId'] },
        { fields: ['receivedDate'] },
        { fields: ['inspectionStatus'] }
      ]
    }
  );

  return PurchaseOrderReceipt;
};

/**
 * Contract modification model
 */
export const createContractModificationModel = (sequelize: Sequelize) => {
  class ContractModification extends Model {
    public id!: string;
    public modificationNumber!: string;
    public contractId!: string;
    public contractNumber!: string;
    public modificationType!: 'ADMINISTRATIVE' | 'CHANGE_ORDER' | 'SUPPLEMENTAL' | 'DEFINITIZATION';
    public modificationDate!: Date;
    public effectiveDate!: Date;
    public description!: string;
    public reason!: string;
    public originalAmount!: number;
    public modificationAmount!: number;
    public newTotalAmount!: number;
    public timeExtensionDays!: number;
    public newCompletionDate!: Date;
    public approvedBy!: string;
    public status!: ProcurementStatus;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractModification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the contract modification'
      },
      modificationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique modification number'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract being modified'
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract number for reference'
      },
      modificationType: {
        type: DataTypes.ENUM('ADMINISTRATIVE', 'CHANGE_ORDER', 'SUPPLEMENTAL', 'DEFINITIZATION'),
        allowNull: false,
        comment: 'Type of contract modification'
      },
      modificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date modification was created'
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date modification becomes effective'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of the modification'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for the modification'
      },
      originalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Original contract amount before modification'
      },
      modificationAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount of change (positive or negative)'
      },
      newTotalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'New total contract amount after modification'
      },
      timeExtensionDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of days contract is extended (if applicable)'
      },
      newCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'New contract completion date (if changed)'
      },
      approvedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Name of approving contracting officer'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ProcurementStatus)),
        allowNull: false,
        defaultValue: ProcurementStatus.DRAFT,
        comment: 'Current status of the modification'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional modification metadata'
      }
    },
    {
      sequelize,
      tableName: 'contract_modifications',
      timestamps: true,
      indexes: [
        { fields: ['modificationNumber'], unique: true },
        { fields: ['contractId'] },
        { fields: ['contractNumber'] },
        { fields: ['modificationType'] },
        { fields: ['modificationDate'] },
        { fields: ['status'] }
      ]
    }
  );

  return ContractModification;
};

/**
 * Vendor quotation model
 */
export const createVendorQuotationModel = (sequelize: Sequelize) => {
  class VendorQuotation extends Model {
    public id!: string;
    public quotationNumber!: string;
    public requisitionId!: string;
    public vendorId!: string;
    public vendorName!: string;
    public quotationDate!: Date;
    public validUntilDate!: Date;
    public totalAmount!: number;
    public taxAmount!: number;
    public shippingAmount!: number;
    public discountAmount!: number;
    public netAmount!: number;
    public deliveryDays!: number;
    public paymentTerms!: string;
    public notes!: string;
    public status!: 'PENDING' | 'SELECTED' | 'REJECTED' | 'EXPIRED';
    public lineItems!: Record<string, any>[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  VendorQuotation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the quotation'
      },
      quotationNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique quotation number'
      },
      requisitionId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the purchase requisition'
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the vendor'
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name for quick reference'
      },
      quotationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date quotation was submitted'
      },
      validUntilDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date quotation expires'
      },
      totalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total quoted amount before taxes and fees'
      },
      taxAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount'
      },
      shippingAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Shipping and handling charges'
      },
      discountAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount offered'
      },
      netAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Net amount after all adjustments'
      },
      deliveryDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Promised delivery time in days'
      },
      paymentTerms: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Payment terms offered by vendor'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes or conditions'
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'SELECTED', 'REJECTED', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'Status of the quotation'
      },
      lineItems: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Detailed line items in the quotation'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional quotation metadata'
      }
    },
    {
      sequelize,
      tableName: 'vendor_quotations',
      timestamps: true,
      indexes: [
        { fields: ['quotationNumber'], unique: true },
        { fields: ['requisitionId'] },
        { fields: ['vendorId'] },
        { fields: ['quotationDate'] },
        { fields: ['validUntilDate'] },
        { fields: ['status'] }
      ]
    }
  );

  return VendorQuotation;
};

/**
 * Procurement audit trail model
 */
export const createProcurementAuditTrailModel = (sequelize: Sequelize) => {
  class ProcurementAuditTrail extends Model {
    public id!: string;
    public documentType!: 'REQUISITION' | 'PURCHASE_ORDER' | 'CONTRACT' | 'OBLIGATION' | 'MODIFICATION';
    public documentId!: string;
    public documentNumber!: string;
    public action!: string;
    public performedBy!: string;
    public performedByName!: string;
    public actionDate!: Date;
    public previousValues!: Record<string, any>;
    public newValues!: Record<string, any>;
    public ipAddress!: string;
    public userAgent!: string;
    public reason!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  ProcurementAuditTrail.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the audit record'
      },
      documentType: {
        type: DataTypes.ENUM('REQUISITION', 'PURCHASE_ORDER', 'CONTRACT', 'OBLIGATION', 'MODIFICATION'),
        allowNull: false,
        comment: 'Type of procurement document'
      },
      documentId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the document'
      },
      documentNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Document number for quick reference'
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Action performed (CREATE, UPDATE, DELETE, APPROVE, etc.)'
      },
      performedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID who performed the action'
      },
      performedByName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Full name of user who performed the action'
      },
      actionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date and time action was performed'
      },
      previousValues: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Previous values before the change'
      },
      newValues: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'New values after the change'
      },
      ipAddress: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'IP address of the user'
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'User agent string'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for the action'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional audit metadata'
      }
    },
    {
      sequelize,
      tableName: 'procurement_audit_trail',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['documentType', 'documentId'] },
        { fields: ['documentNumber'] },
        { fields: ['performedBy'] },
        { fields: ['actionDate'] },
        { fields: ['action'] }
      ]
    }
  );

  return ProcurementAuditTrail;
};

/**
 * Main CEFMS Procurement Backend Service
 *
 * Provides comprehensive backend functionality for procurement operations
 * including requisitions, purchase orders, contracts, and compliance management.
 */
@Injectable()
export class CEFMSProcurementBackendService {
  private readonly logger = new Logger(CEFMSProcurementBackendService.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly procurementService: CEFMSProcurementContractAccountingService
  ) {}

  /**
   * Creates a new purchase requisition with validation and workflow initiation
   *
   * @param requisitionData - Purchase requisition data
   * @param userId - ID of the user creating the requisition
   * @returns Created requisition with initial approval workflow
   */
  async createPurchaseRequisition(
    requisitionData: PurchaseRequisitionData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating purchase requisition: ${requisitionData.requisitionNumber}`);

      // Validate requisition data
      await this.validateRequisitionData(requisitionData);

      // Check funds availability
      const fundsCheck = await this.checkFundsAvailability(
        requisitionData.accountingCodes,
        requisitionData.estimatedAmount,
        transaction
      );

      if (!fundsCheck.available) {
        throw new BadRequestException(
          `Insufficient funds available. Requested: $${requisitionData.estimatedAmount}, Available: $${fundsCheck.availableAmount}`
        );
      }

      // Create the requisition using composite service
      const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);
      const requisition = await PurchaseRequisition.create(
        {
          ...requisitionData,
          status: ProcurementStatus.DRAFT,
          createdBy: userId,
          createdAt: new Date()
        },
        { transaction }
      );

      // Reserve funds for the requisition
      await this.reserveFunds(
        requisition.id,
        requisitionData.accountingCodes,
        requisitionData.estimatedAmount,
        transaction
      );

      // Initialize approval workflow
      await this.initiateApprovalWorkflow(requisition.id, requisitionData.estimatedAmount, transaction);

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'REQUISITION',
        requisition.id,
        requisitionData.requisitionNumber,
        'CREATE',
        userId,
        null,
        requisitionData,
        transaction
      );

      await transaction.commit();
      this.logger.log(`Purchase requisition created successfully: ${requisitionData.requisitionNumber}`);

      return requisition;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create purchase requisition: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validates purchase requisition data
   *
   * @param requisitionData - Requisition data to validate
   */
  private async validateRequisitionData(requisitionData: PurchaseRequisitionData): Promise<void> {
    if (!requisitionData.requisitionNumber || requisitionData.requisitionNumber.length === 0) {
      throw new BadRequestException('Requisition number is required');
    }

    if (!requisitionData.description || requisitionData.description.length < 10) {
      throw new BadRequestException('Description must be at least 10 characters');
    }

    if (requisitionData.estimatedAmount <= 0) {
      throw new BadRequestException('Estimated amount must be greater than zero');
    }

    if (!requisitionData.lineItems || requisitionData.lineItems.length === 0) {
      throw new BadRequestException('At least one line item is required');
    }

    // Validate line items sum matches total
    const lineItemsTotal = requisitionData.lineItems.reduce(
      (sum, item) => sum + item.estimatedTotalPrice,
      0
    );

    if (Math.abs(lineItemsTotal - requisitionData.estimatedAmount) > 0.01) {
      throw new BadRequestException(
        `Line items total ($${lineItemsTotal}) does not match estimated amount ($${requisitionData.estimatedAmount})`
      );
    }

    // Check for duplicate requisition number
    const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);
    const existing = await PurchaseRequisition.findOne({
      where: { requisitionNumber: requisitionData.requisitionNumber }
    });

    if (existing) {
      throw new ConflictException(`Requisition number ${requisitionData.requisitionNumber} already exists`);
    }
  }

  /**
   * Checks funds availability for requisition
   *
   * @param accountingCodes - Array of accounting codes
   * @param amount - Amount to check
   * @param transaction - Database transaction
   * @returns Funds availability result
   */
  async checkFundsAvailability(
    accountingCodes: string[],
    amount: number,
    transaction?: Transaction
  ): Promise<FundsAvailabilityResult> {
    this.logger.log(`Checking funds availability for accounts: ${accountingCodes.join(', ')}, amount: $${amount}`);

    // Query budget allocations for the specified accounts
    const accountBreakdown: AccountFundsBreakdown[] = [];
    let totalAvailable = 0;
    let totalReserved = 0;
    let totalCommitted = 0;
    let totalObligated = 0;

    for (const accountCode of accountingCodes) {
      const budget = await this.getBudgetAllocation(accountCode, transaction);

      accountBreakdown.push({
        accountCode,
        budgetedAmount: budget.budgetedAmount,
        availableAmount: budget.availableAmount,
        reservedAmount: budget.reservedAmount,
        committedAmount: budget.committedAmount,
        obligatedAmount: budget.obligatedAmount,
        expendedAmount: budget.expendedAmount
      });

      totalAvailable += budget.availableAmount;
      totalReserved += budget.reservedAmount;
      totalCommitted += budget.committedAmount;
      totalObligated += budget.obligatedAmount;
    }

    const available = totalAvailable >= amount;
    const status = available
      ? FundsAvailabilityStatus.AVAILABLE
      : FundsAvailabilityStatus.INSUFFICIENT;

    return {
      available,
      status,
      requestedAmount: amount,
      availableAmount: totalAvailable,
      reservedAmount: totalReserved,
      committedAmount: totalCommitted,
      obligatedAmount: totalObligated,
      remainingAmount: totalAvailable - amount,
      accountBreakdown
    };
  }

  /**
   * Gets budget allocation for an account
   *
   * @param accountCode - Account code
   * @param transaction - Database transaction
   * @returns Budget allocation details
   */
  private async getBudgetAllocation(
    accountCode: string,
    transaction?: Transaction
  ): Promise<AccountFundsBreakdown> {
    // Query the budget allocation table
    const result = await this.sequelize.query(
      `
      SELECT
        account_code,
        budgeted_amount,
        COALESCE(budgeted_amount - reserved_amount - committed_amount - obligated_amount, 0) as available_amount,
        COALESCE(reserved_amount, 0) as reserved_amount,
        COALESCE(committed_amount, 0) as committed_amount,
        COALESCE(obligated_amount, 0) as obligated_amount,
        COALESCE(expended_amount, 0) as expended_amount
      FROM budget_allocations
      WHERE account_code = :accountCode
        AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
      `,
      {
        replacements: { accountCode },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Budget allocation not found for account code: ${accountCode}`);
    }

    return result[0] as AccountFundsBreakdown;
  }

  /**
   * Reserves funds for a requisition
   *
   * @param requisitionId - Requisition ID
   * @param accountingCodes - Array of accounting codes
   * @param amount - Amount to reserve
   * @param transaction - Database transaction
   */
  private async reserveFunds(
    requisitionId: string,
    accountingCodes: string[],
    amount: number,
    transaction: Transaction
  ): Promise<void> {
    this.logger.log(`Reserving funds for requisition: ${requisitionId}, amount: $${amount}`);

    // Distribute amount across accounts proportionally
    const amountPerAccount = amount / accountingCodes.length;

    for (const accountCode of accountingCodes) {
      await this.sequelize.query(
        `
        UPDATE budget_allocations
        SET reserved_amount = COALESCE(reserved_amount, 0) + :amount
        WHERE account_code = :accountCode
          AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        {
          replacements: { accountCode, amount: amountPerAccount },
          type: QueryTypes.UPDATE,
          transaction
        }
      );

      // Create reservation record
      await this.sequelize.query(
        `
        INSERT INTO funds_reservations (id, requisition_id, account_code, reserved_amount, reservation_date, status)
        VALUES (uuid_generate_v4(), :requisitionId, :accountCode, :amount, CURRENT_TIMESTAMP, 'ACTIVE')
        `,
        {
          replacements: { requisitionId, accountCode, amount: amountPerAccount },
          type: QueryTypes.INSERT,
          transaction
        }
      );
    }
  }

  /**
   * Initiates approval workflow for a requisition
   *
   * @param requisitionId - Requisition ID
   * @param amount - Requisition amount
   * @param transaction - Database transaction
   */
  private async initiateApprovalWorkflow(
    requisitionId: string,
    amount: number,
    transaction: Transaction
  ): Promise<void> {
    this.logger.log(`Initiating approval workflow for requisition: ${requisitionId}`);

    // Determine required approval levels based on amount
    const approvalLevels = this.determineApprovalLevels(amount);

    const RequisitionApproval = createRequisitionApprovalModel(this.sequelize);

    // Create approval records for each level
    for (let i = 0; i < approvalLevels.length; i++) {
      await RequisitionApproval.create(
        {
          requisitionId,
          approvalLevel: approvalLevels[i],
          approverId: '', // Will be assigned by workflow
          approverName: '',
          action: 'APPROVE',
          comments: '',
          sequenceNumber: i + 1,
          approvalDate: null
        },
        { transaction }
      );
    }

    // Update requisition status to pending approval
    const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);
    await PurchaseRequisition.update(
      { status: ProcurementStatus.PENDING_APPROVAL },
      { where: { id: requisitionId }, transaction }
    );
  }

  /**
   * Determines required approval levels based on amount
   *
   * @param amount - Requisition amount
   * @returns Array of required approval levels
   */
  private determineApprovalLevels(amount: number): ApprovalLevel[] {
    const levels: ApprovalLevel[] = [ApprovalLevel.SUPERVISOR];

    if (amount > 2500) {
      levels.push(ApprovalLevel.DEPARTMENT_HEAD);
    }

    if (amount > 10000) {
      levels.push(ApprovalLevel.CONTRACTING_OFFICER);
    }

    if (amount > 50000) {
      levels.push(ApprovalLevel.FINANCE_DIRECTOR);
    }

    if (amount > 250000) {
      levels.push(ApprovalLevel.COMMANDING_OFFICER);
    }

    return levels;
  }

  /**
   * Processes approval workflow action
   *
   * @param workflowData - Approval workflow data
   * @param userId - ID of the user performing the action
   * @returns Updated document with approval status
   */
  async processApprovalWorkflow(
    workflowData: ApprovalWorkflowData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Processing approval workflow: ${workflowData.documentType} - ${workflowData.documentId}`);

      // Verify approver has authority
      await this.verifyApproverAuthority(userId, workflowData.currentLevel);

      const RequisitionApproval = createRequisitionApprovalModel(this.sequelize);

      // Get current approval record
      const approval = await RequisitionApproval.findOne({
        where: {
          requisitionId: workflowData.documentId,
          approvalLevel: workflowData.currentLevel,
          approvalDate: null
        },
        transaction
      });

      if (!approval) {
        throw new NotFoundException('Approval record not found or already processed');
      }

      // Update approval record
      await approval.update(
        {
          approverId: userId,
          approverName: await this.getUserName(userId),
          action: workflowData.action,
          comments: workflowData.comments,
          approvalDate: new Date()
        },
        { transaction }
      );

      // Update document status based on action
      if (workflowData.action === 'APPROVE') {
        await this.processApprovalAction(workflowData.documentId, workflowData.currentLevel, transaction);
      } else if (workflowData.action === 'REJECT') {
        await this.processRejectionAction(workflowData.documentId, workflowData.comments, transaction);
      } else if (workflowData.action === 'RETURN') {
        await this.processReturnAction(workflowData.documentId, workflowData.comments, transaction);
      }

      // Create audit trail entry
      await this.createAuditTrailEntry(
        workflowData.documentType,
        workflowData.documentId,
        '',
        `APPROVAL_${workflowData.action}`,
        userId,
        null,
        { level: workflowData.currentLevel, comments: workflowData.comments },
        transaction
      );

      await transaction.commit();
      this.logger.log(`Approval workflow processed successfully`);

      return approval;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to process approval workflow: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Verifies approver has authority for the approval level
   *
   * @param userId - User ID
   * @param level - Approval level
   */
  private async verifyApproverAuthority(userId: string, level: ApprovalLevel): Promise<void> {
    // Query user roles and permissions
    const result = await this.sequelize.query(
      `
      SELECT COUNT(*) as count
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      WHERE ur.user_id = :userId
        AND rp.permission = :permission
        AND ur.active = true
      `,
      {
        replacements: {
          userId,
          permission: `APPROVE_${level}`
        },
        type: QueryTypes.SELECT
      }
    );

    if (result[0]['count'] === 0) {
      throw new BadRequestException(`User does not have authority to approve at ${level} level`);
    }
  }

  /**
   * Gets user name by ID
   *
   * @param userId - User ID
   * @returns User full name
   */
  private async getUserName(userId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT full_name FROM users WHERE id = :userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return 'Unknown User';
    }

    return result[0]['full_name'];
  }

  /**
   * Processes approval action
   *
   * @param documentId - Document ID
   * @param currentLevel - Current approval level
   * @param transaction - Database transaction
   */
  private async processApprovalAction(
    documentId: string,
    currentLevel: ApprovalLevel,
    transaction: Transaction
  ): Promise<void> {
    const RequisitionApproval = createRequisitionApprovalModel(this.sequelize);

    // Check if there are more approval levels required
    const pendingApprovals = await RequisitionApproval.findAll({
      where: {
        requisitionId: documentId,
        approvalDate: null
      },
      transaction
    });

    const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);

    if (pendingApprovals.length === 0) {
      // All approvals complete - mark as approved
      await PurchaseRequisition.update(
        { status: ProcurementStatus.APPROVED },
        { where: { id: documentId }, transaction }
      );

      this.logger.log(`Requisition ${documentId} fully approved`);
    } else {
      // Still pending additional approvals
      this.logger.log(`Requisition ${documentId} approved at ${currentLevel}, ${pendingApprovals.length} levels remaining`);
    }
  }

  /**
   * Processes rejection action
   *
   * @param documentId - Document ID
   * @param comments - Rejection comments
   * @param transaction - Database transaction
   */
  private async processRejectionAction(
    documentId: string,
    comments: string,
    transaction: Transaction
  ): Promise<void> {
    const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);

    await PurchaseRequisition.update(
      {
        status: ProcurementStatus.REJECTED,
        rejectionReason: comments
      },
      { where: { id: documentId }, transaction }
    );

    // Release reserved funds
    await this.releaseFunds(documentId, transaction);

    this.logger.log(`Requisition ${documentId} rejected`);
  }

  /**
   * Processes return action
   *
   * @param documentId - Document ID
   * @param comments - Return comments
   * @param transaction - Database transaction
   */
  private async processReturnAction(
    documentId: string,
    comments: string,
    transaction: Transaction
  ): Promise<void> {
    const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);

    await PurchaseRequisition.update(
      {
        status: ProcurementStatus.DRAFT,
        returnReason: comments
      },
      { where: { id: documentId }, transaction }
    );

    this.logger.log(`Requisition ${documentId} returned for revision`);
  }

  /**
   * Releases reserved funds
   *
   * @param requisitionId - Requisition ID
   * @param transaction - Database transaction
   */
  private async releaseFunds(requisitionId: string, transaction: Transaction): Promise<void> {
    this.logger.log(`Releasing funds for requisition: ${requisitionId}`);

    // Get reservation records
    const reservations = await this.sequelize.query(
      `SELECT account_code, reserved_amount FROM funds_reservations WHERE requisition_id = :requisitionId AND status = 'ACTIVE'`,
      {
        replacements: { requisitionId },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    for (const reservation of reservations) {
      // Update budget allocation
      await this.sequelize.query(
        `
        UPDATE budget_allocations
        SET reserved_amount = COALESCE(reserved_amount, 0) - :amount
        WHERE account_code = :accountCode
          AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        {
          replacements: {
            accountCode: reservation['account_code'],
            amount: reservation['reserved_amount']
          },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    }

    // Mark reservations as released
    await this.sequelize.query(
      `UPDATE funds_reservations SET status = 'RELEASED' WHERE requisition_id = :requisitionId`,
      {
        replacements: { requisitionId },
        type: QueryTypes.UPDATE,
        transaction
      }
    );
  }

  /**
   * Creates a purchase order from an approved requisition
   *
   * @param requisitionId - Requisition ID
   * @param poData - Purchase order data
   * @param userId - ID of the user creating the PO
   * @returns Created purchase order
   */
  async createPurchaseOrderFromRequisition(
    requisitionId: string,
    poData: Partial<PurchaseOrderData>,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating purchase order from requisition: ${requisitionId}`);

      // Verify requisition is approved
      const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);
      const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });

      if (!requisition) {
        throw new NotFoundException(`Requisition not found: ${requisitionId}`);
      }

      if (requisition.status !== ProcurementStatus.APPROVED) {
        throw new BadRequestException(`Requisition must be approved before creating purchase order. Current status: ${requisition.status}`);
      }

      // Generate PO number
      const poNumber = await this.generatePurchaseOrderNumber();

      // Create purchase order
      const PurchaseOrder = createPurchaseOrderModel(this.sequelize);
      const purchaseOrder = await PurchaseOrder.create(
        {
          poNumber,
          requisitionId,
          vendorId: poData.vendorId,
          orderType: poData.orderType || PurchaseOrderType.STANDARD,
          orderDate: new Date(),
          deliveryDate: poData.deliveryDate,
          totalAmount: poData.totalAmount || requisition.estimatedAmount,
          taxAmount: poData.taxAmount || 0,
          shippingAmount: poData.shippingAmount || 0,
          discountAmount: poData.discountAmount || 0,
          netAmount: this.calculateNetAmount(poData),
          paymentTerms: poData.paymentTerms || 'Net 30',
          deliveryAddress: poData.deliveryAddress,
          billingAddress: poData.billingAddress,
          lineItems: poData.lineItems || [],
          status: ProcurementStatus.APPROVED,
          approvedBy: userId,
          createdBy: userId,
          createdAt: new Date()
        },
        { transaction }
      );

      // Convert reserved funds to committed funds
      await this.commitFunds(requisitionId, purchaseOrder.id, transaction);

      // Update requisition status
      await requisition.update(
        { status: ProcurementStatus.COMPLETED, purchaseOrderId: purchaseOrder.id },
        { transaction }
      );

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'PURCHASE_ORDER',
        purchaseOrder.id,
        poNumber,
        'CREATE',
        userId,
        null,
        { requisitionId, ...poData },
        transaction
      );

      await transaction.commit();
      this.logger.log(`Purchase order created successfully: ${poNumber}`);

      return purchaseOrder;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create purchase order: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique purchase order number
   *
   * @returns Generated PO number
   */
  private async generatePurchaseOrderNumber(): Promise<string> {
    const fiscalYear = new Date().getFullYear();
    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(po_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM purchase_orders
       WHERE po_number LIKE :pattern`,
      {
        replacements: { pattern: `PO-${fiscalYear}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `PO-${fiscalYear}-${String(nextNumber).padStart(6, '0')}`;
  }

  /**
   * Calculates net amount for purchase order
   *
   * @param poData - Purchase order data
   * @returns Net amount
   */
  private calculateNetAmount(poData: Partial<PurchaseOrderData>): number {
    const total = poData.totalAmount || 0;
    const tax = poData.taxAmount || 0;
    const shipping = poData.shippingAmount || 0;
    const discount = poData.discountAmount || 0;

    return total + tax + shipping - discount;
  }

  /**
   * Commits funds for a purchase order
   *
   * @param requisitionId - Requisition ID
   * @param purchaseOrderId - Purchase order ID
   * @param transaction - Database transaction
   */
  private async commitFunds(
    requisitionId: string,
    purchaseOrderId: string,
    transaction: Transaction
  ): Promise<void> {
    this.logger.log(`Committing funds for purchase order: ${purchaseOrderId}`);

    // Get reservation records
    const reservations = await this.sequelize.query(
      `SELECT account_code, reserved_amount FROM funds_reservations WHERE requisition_id = :requisitionId AND status = 'ACTIVE'`,
      {
        replacements: { requisitionId },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    for (const reservation of reservations) {
      const accountCode = reservation['account_code'];
      const amount = reservation['reserved_amount'];

      // Move from reserved to committed
      await this.sequelize.query(
        `
        UPDATE budget_allocations
        SET reserved_amount = COALESCE(reserved_amount, 0) - :amount,
            committed_amount = COALESCE(committed_amount, 0) + :amount
        WHERE account_code = :accountCode
          AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        {
          replacements: { accountCode, amount },
          type: QueryTypes.UPDATE,
          transaction
        }
      );

      // Create commitment record
      await this.sequelize.query(
        `
        INSERT INTO funds_commitments (id, purchase_order_id, account_code, committed_amount, commitment_date, status)
        VALUES (uuid_generate_v4(), :purchaseOrderId, :accountCode, :amount, CURRENT_TIMESTAMP, 'ACTIVE')
        `,
        {
          replacements: { purchaseOrderId, accountCode, amount },
          type: QueryTypes.INSERT,
          transaction
        }
      );
    }

    // Mark reservations as committed
    await this.sequelize.query(
      `UPDATE funds_reservations SET status = 'COMMITTED', purchase_order_id = :purchaseOrderId WHERE requisition_id = :requisitionId`,
      {
        replacements: { requisitionId, purchaseOrderId },
        type: QueryTypes.UPDATE,
        transaction
      }
    );
  }

  /**
   * Records receipt of purchase order items
   *
   * @param poId - Purchase order ID
   * @param receiptData - Receipt data
   * @param userId - ID of the user recording receipt
   * @returns Created receipt record
   */
  async recordPurchaseOrderReceipt(
    poId: string,
    receiptData: any,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Recording receipt for purchase order: ${poId}`);

      // Verify purchase order exists
      const PurchaseOrder = createPurchaseOrderModel(this.sequelize);
      const po = await PurchaseOrder.findByPk(poId, { transaction });

      if (!po) {
        throw new NotFoundException(`Purchase order not found: ${poId}`);
      }

      // Generate receipt number
      const receiptNumber = await this.generateReceiptNumber();

      // Create receipt record
      const PurchaseOrderReceipt = createPurchaseOrderReceiptModel(this.sequelize);
      const receipt = await PurchaseOrderReceipt.create(
        {
          receiptNumber,
          purchaseOrderId: poId,
          poNumber: po.poNumber,
          lineItemId: receiptData.lineItemId,
          receivedDate: new Date(),
          receivedBy: await this.getUserName(userId),
          receivedQuantity: receiptData.receivedQuantity,
          acceptedQuantity: receiptData.acceptedQuantity || receiptData.receivedQuantity,
          rejectedQuantity: receiptData.rejectedQuantity || 0,
          damageQuantity: receiptData.damageQuantity || 0,
          inspectionStatus: receiptData.inspectionStatus || 'PENDING',
          inspectionNotes: receiptData.inspectionNotes,
          location: receiptData.location,
          metadata: receiptData.metadata || {}
        },
        { transaction }
      );

      // Check if all line items have been received
      const allReceived = await this.checkPurchaseOrderComplete(poId, transaction);

      if (allReceived) {
        await po.update({ status: ProcurementStatus.COMPLETED }, { transaction });
        this.logger.log(`Purchase order ${po.poNumber} marked as completed`);
      }

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'PURCHASE_ORDER',
        poId,
        po.poNumber,
        'RECEIPT',
        userId,
        null,
        receiptData,
        transaction
      );

      await transaction.commit();
      this.logger.log(`Receipt recorded successfully: ${receiptNumber}`);

      return receipt;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to record receipt: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique receipt number
   *
   * @returns Generated receipt number
   */
  private async generateReceiptNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM purchase_order_receipts
       WHERE receipt_number LIKE :pattern`,
      {
        replacements: { pattern: `RCP-${dateStr}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `RCP-${dateStr}-${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * Checks if all line items for a purchase order have been received
   *
   * @param poId - Purchase order ID
   * @param transaction - Database transaction
   * @returns True if all items received
   */
  private async checkPurchaseOrderComplete(
    poId: string,
    transaction: Transaction
  ): Promise<boolean> {
    const result = await this.sequelize.query(
      `
      SELECT
        SUM(li.quantity) as total_ordered,
        SUM(COALESCE(r.accepted_quantity, 0)) as total_received
      FROM purchase_order_line_items li
      LEFT JOIN purchase_order_receipts r ON li.id = r.line_item_id
      WHERE li.purchase_order_id = :poId
      GROUP BY li.purchase_order_id
      `,
      {
        replacements: { poId },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (!result || result.length === 0) {
      return false;
    }

    const totalOrdered = parseFloat(result[0]['total_ordered']);
    const totalReceived = parseFloat(result[0]['total_received']);

    return totalReceived >= totalOrdered;
  }

  /**
   * Creates a contract obligation
   *
   * @param obligationData - Contract obligation data
   * @param userId - ID of the user creating the obligation
   * @returns Created contract obligation
   */
  async createContractObligation(
    obligationData: ContractObligationData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating contract obligation: ${obligationData.obligationNumber}`);

      // Check funds availability
      const fundsCheck = await this.checkFundsAvailability(
        obligationData.accountingCodes,
        obligationData.obligationAmount,
        transaction
      );

      if (!fundsCheck.available) {
        throw new BadRequestException(
          `Insufficient funds available. Requested: $${obligationData.obligationAmount}, Available: $${fundsCheck.availableAmount}`
        );
      }

      // Create obligation using composite service
      const ContractObligation = createContractObligationModel(this.sequelize);
      const obligation = await ContractObligation.create(
        {
          ...obligationData,
          status: 'ACTIVE',
          createdBy: userId,
          createdAt: new Date()
        },
        { transaction }
      );

      // Obligate funds
      await this.obligateFunds(
        obligation.id,
        obligationData.accountingCodes,
        obligationData.obligationAmount,
        transaction
      );

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'OBLIGATION',
        obligation.id,
        obligationData.obligationNumber,
        'CREATE',
        userId,
        null,
        obligationData,
        transaction
      );

      await transaction.commit();
      this.logger.log(`Contract obligation created successfully: ${obligationData.obligationNumber}`);

      return obligation;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create contract obligation: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obligates funds for a contract
   *
   * @param obligationId - Obligation ID
   * @param accountingCodes - Array of accounting codes
   * @param amount - Amount to obligate
   * @param transaction - Database transaction
   */
  private async obligateFunds(
    obligationId: string,
    accountingCodes: string[],
    amount: number,
    transaction: Transaction
  ): Promise<void> {
    this.logger.log(`Obligating funds for obligation: ${obligationId}, amount: $${amount}`);

    // Distribute amount across accounts proportionally
    const amountPerAccount = amount / accountingCodes.length;

    for (const accountCode of accountingCodes) {
      await this.sequelize.query(
        `
        UPDATE budget_allocations
        SET obligated_amount = COALESCE(obligated_amount, 0) + :amount
        WHERE account_code = :accountCode
          AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        {
          replacements: { accountCode, amount: amountPerAccount },
          type: QueryTypes.UPDATE,
          transaction
        }
      );

      // Create obligation record
      await this.sequelize.query(
        `
        INSERT INTO funds_obligations (id, obligation_id, account_code, obligated_amount, obligation_date, status)
        VALUES (uuid_generate_v4(), :obligationId, :accountCode, :amount, CURRENT_TIMESTAMP, 'ACTIVE')
        `,
        {
          replacements: { obligationId, accountCode, amount: amountPerAccount },
          type: QueryTypes.INSERT,
          transaction
        }
      );
    }
  }

  /**
   * Creates a contract modification
   *
   * @param modificationData - Contract modification data
   * @param userId - ID of the user creating the modification
   * @returns Created contract modification
   */
  async createContractModification(
    modificationData: any,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating contract modification: ${modificationData.modificationNumber}`);

      // Generate modification number if not provided
      const modNumber = modificationData.modificationNumber || await this.generateModificationNumber(modificationData.contractId);

      // Create modification
      const ContractModification = createContractModificationModel(this.sequelize);
      const modification = await ContractModification.create(
        {
          modificationNumber: modNumber,
          contractId: modificationData.contractId,
          contractNumber: modificationData.contractNumber,
          modificationType: modificationData.modificationType,
          modificationDate: new Date(),
          effectiveDate: modificationData.effectiveDate,
          description: modificationData.description,
          reason: modificationData.reason,
          originalAmount: modificationData.originalAmount,
          modificationAmount: modificationData.modificationAmount,
          newTotalAmount: modificationData.originalAmount + modificationData.modificationAmount,
          timeExtensionDays: modificationData.timeExtensionDays || 0,
          newCompletionDate: modificationData.newCompletionDate,
          approvedBy: null,
          status: ProcurementStatus.DRAFT,
          metadata: modificationData.metadata || {}
        },
        { transaction }
      );

      // If modification increases contract value, check funds availability
      if (modificationData.modificationAmount > 0) {
        const accountingCodes = modificationData.accountingCodes || [];
        const fundsCheck = await this.checkFundsAvailability(
          accountingCodes,
          modificationData.modificationAmount,
          transaction
        );

        if (!fundsCheck.available) {
          throw new BadRequestException(
            `Insufficient funds for modification. Requested: $${modificationData.modificationAmount}, Available: $${fundsCheck.availableAmount}`
          );
        }

        // Obligate additional funds
        await this.obligateFunds(
          modification.id,
          accountingCodes,
          modificationData.modificationAmount,
          transaction
        );
      }

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'MODIFICATION',
        modification.id,
        modNumber,
        'CREATE',
        userId,
        null,
        modificationData,
        transaction
      );

      await transaction.commit();
      this.logger.log(`Contract modification created successfully: ${modNumber}`);

      return modification;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create contract modification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique contract modification number
   *
   * @param contractId - Contract ID
   * @returns Generated modification number
   */
  private async generateModificationNumber(contractId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT COUNT(*) + 1 as next_number FROM contract_modifications WHERE contract_id = :contractId`,
      {
        replacements: { contractId },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `MOD-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Requests vendor quotations for a requisition
   *
   * @param requisitionId - Requisition ID
   * @param vendorIds - Array of vendor IDs to request quotations from
   * @param userId - ID of the user requesting quotations
   * @returns Array of created quotation request records
   */
  async requestVendorQuotations(
    requisitionId: string,
    vendorIds: string[],
    userId: string
  ): Promise<any[]> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Requesting quotations for requisition: ${requisitionId} from ${vendorIds.length} vendors`);

      const PurchaseRequisition = createPurchaseRequisitionModel(this.sequelize);
      const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });

      if (!requisition) {
        throw new NotFoundException(`Requisition not found: ${requisitionId}`);
      }

      const quotations = [];

      for (const vendorId of vendorIds) {
        const quotationNumber = await this.generateQuotationNumber();
        const vendorName = await this.getVendorName(vendorId);

        const VendorQuotation = createVendorQuotationModel(this.sequelize);
        const quotation = await VendorQuotation.create(
          {
            quotationNumber,
            requisitionId,
            vendorId,
            vendorName,
            quotationDate: new Date(),
            validUntilDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            totalAmount: 0,
            taxAmount: 0,
            shippingAmount: 0,
            discountAmount: 0,
            netAmount: 0,
            deliveryDays: 0,
            paymentTerms: '',
            notes: '',
            status: 'PENDING',
            lineItems: [],
            metadata: { requestedBy: userId, requestDate: new Date() }
          },
          { transaction }
        );

        quotations.push(quotation);

        // Send quotation request to vendor (would integrate with email/notification service)
        await this.sendQuotationRequest(vendorId, requisition, quotation);
      }

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'REQUISITION',
        requisitionId,
        requisition.requisitionNumber,
        'REQUEST_QUOTATIONS',
        userId,
        null,
        { vendorIds },
        transaction
      );

      await transaction.commit();
      this.logger.log(`Quotation requests sent successfully`);

      return quotations;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to request quotations: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique quotation number
   *
   * @returns Generated quotation number
   */
  private async generateQuotationNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM vendor_quotations
       WHERE quotation_number LIKE :pattern`,
      {
        replacements: { pattern: `QUO-${dateStr}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `QUO-${dateStr}-${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * Gets vendor name by ID
   *
   * @param vendorId - Vendor ID
   * @returns Vendor name
   */
  private async getVendorName(vendorId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT vendor_name FROM vendors WHERE id = :vendorId`,
      {
        replacements: { vendorId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Vendor not found: ${vendorId}`);
    }

    return result[0]['vendor_name'];
  }

  /**
   * Sends quotation request to vendor
   *
   * @param vendorId - Vendor ID
   * @param requisition - Purchase requisition
   * @param quotation - Vendor quotation record
   */
  private async sendQuotationRequest(
    vendorId: string,
    requisition: any,
    quotation: any
  ): Promise<void> {
    // Integration point with email/notification service
    this.logger.log(`Sending quotation request ${quotation.quotationNumber} to vendor ${vendorId}`);
    // Implementation would send email or API notification to vendor
  }

  /**
   * Submits vendor quotation
   *
   * @param quotationId - Quotation ID
   * @param quotationData - Quotation details
   * @returns Updated quotation
   */
  async submitVendorQuotation(
    quotationId: string,
    quotationData: any
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Submitting vendor quotation: ${quotationId}`);

      const VendorQuotation = createVendorQuotationModel(this.sequelize);
      const quotation = await VendorQuotation.findByPk(quotationId, { transaction });

      if (!quotation) {
        throw new NotFoundException(`Quotation not found: ${quotationId}`);
      }

      // Update quotation with submitted data
      await quotation.update(
        {
          totalAmount: quotationData.totalAmount,
          taxAmount: quotationData.taxAmount || 0,
          shippingAmount: quotationData.shippingAmount || 0,
          discountAmount: quotationData.discountAmount || 0,
          netAmount: this.calculateQuotationNetAmount(quotationData),
          deliveryDays: quotationData.deliveryDays,
          paymentTerms: quotationData.paymentTerms,
          notes: quotationData.notes,
          lineItems: quotationData.lineItems,
          status: 'PENDING',
          metadata: { ...quotation.metadata, submittedDate: new Date() }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Vendor quotation submitted successfully: ${quotation.quotationNumber}`);

      return quotation;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to submit quotation: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Calculates net amount for quotation
   *
   * @param quotationData - Quotation data
   * @returns Net amount
   */
  private calculateQuotationNetAmount(quotationData: any): number {
    const total = quotationData.totalAmount || 0;
    const tax = quotationData.taxAmount || 0;
    const shipping = quotationData.shippingAmount || 0;
    const discount = quotationData.discountAmount || 0;

    return total + tax + shipping - discount;
  }

  /**
   * Evaluates and selects best vendor quotation
   *
   * @param requisitionId - Requisition ID
   * @param evaluationCriteria - Evaluation criteria and weights
   * @param userId - ID of the user performing evaluation
   * @returns Selected quotation
   */
  async evaluateAndSelectQuotation(
    requisitionId: string,
    evaluationCriteria: any,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Evaluating quotations for requisition: ${requisitionId}`);

      const VendorQuotation = createVendorQuotationModel(this.sequelize);
      const quotations = await VendorQuotation.findAll({
        where: { requisitionId, status: 'PENDING' },
        transaction
      });

      if (quotations.length === 0) {
        throw new BadRequestException('No quotations available for evaluation');
      }

      // Score each quotation based on criteria
      const scoredQuotations = quotations.map(q => ({
        quotation: q,
        score: this.calculateQuotationScore(q, evaluationCriteria)
      }));

      // Sort by score descending
      scoredQuotations.sort((a, b) => b.score - a.score);

      // Select the highest scoring quotation
      const selectedQuotation = scoredQuotations[0].quotation;

      // Update selected quotation status
      await selectedQuotation.update({ status: 'SELECTED' }, { transaction });

      // Update rejected quotations
      for (let i = 1; i < scoredQuotations.length; i++) {
        await scoredQuotations[i].quotation.update({ status: 'REJECTED' }, { transaction });
      }

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'REQUISITION',
        requisitionId,
        '',
        'SELECT_QUOTATION',
        userId,
        null,
        { selectedQuotationId: selectedQuotation.id, scores: scoredQuotations.map(s => ({ id: s.quotation.id, score: s.score })) },
        transaction
      );

      await transaction.commit();
      this.logger.log(`Quotation ${selectedQuotation.quotationNumber} selected`);

      return selectedQuotation;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to evaluate quotations: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Calculates quotation score based on evaluation criteria
   *
   * @param quotation - Vendor quotation
   * @param criteria - Evaluation criteria with weights
   * @returns Calculated score
   */
  private calculateQuotationScore(quotation: any, criteria: any): number {
    let score = 0;

    // Price score (lower is better)
    if (criteria.priceWeight) {
      const priceScore = (1 / quotation.netAmount) * 1000000; // Normalize
      score += priceScore * criteria.priceWeight;
    }

    // Delivery time score (faster is better)
    if (criteria.deliveryWeight) {
      const deliveryScore = (1 / quotation.deliveryDays) * 100; // Normalize
      score += deliveryScore * criteria.deliveryWeight;
    }

    // Vendor performance score (if available)
    if (criteria.performanceWeight && quotation.metadata.vendorRating) {
      const performanceScore = quotation.metadata.vendorRating * 20; // Normalize (assuming 1-5 rating)
      score += performanceScore * criteria.performanceWeight;
    }

    // Quality score (if available)
    if (criteria.qualityWeight && quotation.metadata.qualityRating) {
      const qualityScore = quotation.metadata.qualityRating * 20; // Normalize
      score += qualityScore * criteria.qualityWeight;
    }

    return score;
  }

  /**
   * Records vendor performance evaluation
   *
   * @param performanceData - Vendor performance data
   * @param userId - ID of the user recording performance
   * @returns Created performance record
   */
  async recordVendorPerformance(
    performanceData: VendorPerformanceData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Recording vendor performance for vendor: ${performanceData.vendorId}`);

      const VendorPerformance = createVendorPerformanceModel(this.sequelize);
      const performance = await VendorPerformance.create(
        {
          ...performanceData,
          evaluatedBy: userId,
          evaluationDate: new Date()
        },
        { transaction }
      );

      // Update vendor's overall rating
      await this.updateVendorOverallRating(performanceData.vendorId, transaction);

      // Create audit trail entry
      await this.createAuditTrailEntry(
        'CONTRACT',
        performanceData.contractId,
        '',
        'VENDOR_PERFORMANCE_EVALUATION',
        userId,
        null,
        performanceData,
        transaction
      );

      await transaction.commit();
      this.logger.log(`Vendor performance recorded successfully`);

      return performance;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to record vendor performance: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates vendor's overall rating based on performance history
   *
   * @param vendorId - Vendor ID
   * @param transaction - Database transaction
   */
  private async updateVendorOverallRating(
    vendorId: string,
    transaction: Transaction
  ): Promise<void> {
    // Calculate average ratings from recent performance evaluations
    const result = await this.sequelize.query(
      `
      SELECT
        AVG(CASE quality_rating
          WHEN 'EXCEPTIONAL' THEN 5
          WHEN 'VERY_GOOD' THEN 4
          WHEN 'SATISFACTORY' THEN 3
          WHEN 'MARGINAL' THEN 2
          WHEN 'UNSATISFACTORY' THEN 1
        END) as avg_quality,
        AVG(CASE delivery_rating
          WHEN 'EXCEPTIONAL' THEN 5
          WHEN 'VERY_GOOD' THEN 4
          WHEN 'SATISFACTORY' THEN 3
          WHEN 'MARGINAL' THEN 2
          WHEN 'UNSATISFACTORY' THEN 1
        END) as avg_delivery,
        AVG(CASE compliance_rating
          WHEN 'EXCEPTIONAL' THEN 5
          WHEN 'VERY_GOOD' THEN 4
          WHEN 'SATISFACTORY' THEN 3
          WHEN 'MARGINAL' THEN 2
          WHEN 'UNSATISFACTORY' THEN 1
        END) as avg_compliance
      FROM vendor_performance
      WHERE vendor_id = :vendorId
        AND evaluation_date >= CURRENT_DATE - INTERVAL '12 months'
      `,
      {
        replacements: { vendorId },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (result && result.length > 0) {
      const avgQuality = parseFloat(result[0]['avg_quality']);
      const avgDelivery = parseFloat(result[0]['avg_delivery']);
      const avgCompliance = parseFloat(result[0]['avg_compliance']);

      const overallRating = (avgQuality + avgDelivery + avgCompliance) / 3;

      // Update vendor record
      await this.sequelize.query(
        `UPDATE vendors SET overall_rating = :rating WHERE id = :vendorId`,
        {
          replacements: { vendorId, rating: overallRating },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    }
  }

  /**
   * Generates procurement compliance report
   *
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @param filters - Optional filters
   * @returns Compliance report data
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    filters?: any
  ): Promise<any> {
    try {
      this.logger.log(`Generating procurement compliance report: ${startDate} to ${endDate}`);

      // Query procurement documents and check compliance
      const result = await this.sequelize.query(
        `
        SELECT
          pr.requisition_number,
          pr.estimated_amount,
          pr.status,
          pr.created_at,
          pr.requestor_id,
          COALESCE(
            (SELECT COUNT(*) FROM requisition_approvals WHERE requisition_id = pr.id),
            0
          ) as approval_count,
          COALESCE(
            (SELECT COUNT(*) FROM requisition_approvals WHERE requisition_id = pr.id AND approval_date IS NOT NULL),
            0
          ) as completed_approvals,
          po.po_number,
          po.order_date,
          po.total_amount as po_amount,
          CASE
            WHEN pr.estimated_amount > 250000 AND NOT EXISTS (
              SELECT 1 FROM requisition_approvals
              WHERE requisition_id = pr.id
                AND approval_level = 'COMMANDING_OFFICER'
                AND approval_date IS NOT NULL
            ) THEN 'NON_COMPLIANT'
            WHEN pr.estimated_amount > 50000 AND NOT EXISTS (
              SELECT 1 FROM requisition_approvals
              WHERE requisition_id = pr.id
                AND approval_level = 'FINANCE_DIRECTOR'
                AND approval_date IS NOT NULL
            ) THEN 'NON_COMPLIANT'
            ELSE 'COMPLIANT'
          END as compliance_status
        FROM purchase_requisitions pr
        LEFT JOIN purchase_orders po ON pr.id = po.requisition_id
        WHERE pr.created_at BETWEEN :startDate AND :endDate
        ORDER BY pr.created_at DESC
        `,
        {
          replacements: { startDate, endDate },
          type: QueryTypes.SELECT
        }
      );

      // Calculate compliance metrics
      const totalRequisitions = result.length;
      const compliantRequisitions = result.filter(r => r['compliance_status'] === 'COMPLIANT').length;
      const nonCompliantRequisitions = totalRequisitions - compliantRequisitions;
      const complianceRate = totalRequisitions > 0 ? (compliantRequisitions / totalRequisitions) * 100 : 0;

      return {
        reportPeriod: { startDate, endDate },
        summary: {
          totalRequisitions,
          compliantRequisitions,
          nonCompliantRequisitions,
          complianceRate: complianceRate.toFixed(2)
        },
        details: result
      };
    } catch (error) {
      this.logger.error(`Failed to generate compliance report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates procurement spending analysis report
   *
   * @param fiscalYear - Fiscal year
   * @param groupBy - Grouping dimension (department, vendor, category)
   * @returns Spending analysis data
   */
  async generateSpendingAnalysis(
    fiscalYear: number,
    groupBy: 'department' | 'vendor' | 'category'
  ): Promise<any> {
    try {
      this.logger.log(`Generating procurement spending analysis for FY${fiscalYear}, grouped by ${groupBy}`);

      let groupByField = '';
      let groupByLabel = '';

      switch (groupBy) {
        case 'department':
          groupByField = 'pr.department_id';
          groupByLabel = 'department_id';
          break;
        case 'vendor':
          groupByField = 'po.vendor_id';
          groupByLabel = 'vendor_id';
          break;
        case 'category':
          groupByField = 'pr.category';
          groupByLabel = 'category';
          break;
      }

      const result = await this.sequelize.query(
        `
        SELECT
          ${groupByField} as group_by,
          COUNT(DISTINCT pr.id) as requisition_count,
          COUNT(DISTINCT po.id) as purchase_order_count,
          SUM(pr.estimated_amount) as total_requisition_amount,
          SUM(po.total_amount) as total_po_amount,
          AVG(po.total_amount) as avg_po_amount,
          MIN(po.total_amount) as min_po_amount,
          MAX(po.total_amount) as max_po_amount
        FROM purchase_requisitions pr
        LEFT JOIN purchase_orders po ON pr.id = po.requisition_id
        WHERE EXTRACT(YEAR FROM pr.created_at) = :fiscalYear
        GROUP BY ${groupByField}
        ORDER BY total_po_amount DESC
        `,
        {
          replacements: { fiscalYear },
          type: QueryTypes.SELECT
        }
      );

      // Calculate grand totals
      const grandTotal = result.reduce((sum, row) => sum + (parseFloat(row['total_po_amount']) || 0), 0);

      return {
        fiscalYear,
        groupBy,
        grandTotal,
        breakdown: result.map(row => ({
          [groupByLabel]: row['group_by'],
          requisitionCount: row['requisition_count'],
          purchaseOrderCount: row['purchase_order_count'],
          totalRequisitionAmount: row['total_requisition_amount'],
          totalPOAmount: row['total_po_amount'],
          avgPOAmount: row['avg_po_amount'],
          minPOAmount: row['min_po_amount'],
          maxPOAmount: row['max_po_amount'],
          percentOfTotal: grandTotal > 0 ? ((row['total_po_amount'] / grandTotal) * 100).toFixed(2) : 0
        }))
      };
    } catch (error) {
      this.logger.error(`Failed to generate spending analysis: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates audit trail entry
   *
   * @param documentType - Type of document
   * @param documentId - Document ID
   * @param documentNumber - Document number
   * @param action - Action performed
   * @param userId - User ID
   * @param previousValues - Previous values before change
   * @param newValues - New values after change
   * @param transaction - Database transaction
   */
  private async createAuditTrailEntry(
    documentType: 'REQUISITION' | 'PURCHASE_ORDER' | 'CONTRACT' | 'OBLIGATION' | 'MODIFICATION',
    documentId: string,
    documentNumber: string,
    action: string,
    userId: string,
    previousValues: any,
    newValues: any,
    transaction: Transaction
  ): Promise<void> {
    const ProcurementAuditTrail = createProcurementAuditTrailModel(this.sequelize);

    await ProcurementAuditTrail.create(
      {
        documentType,
        documentId,
        documentNumber,
        action,
        performedBy: userId,
        performedByName: await this.getUserName(userId),
        actionDate: new Date(),
        previousValues,
        newValues,
        ipAddress: null,
        userAgent: null,
        reason: null,
        metadata: {}
      },
      { transaction }
    );
  }

  /**
   * Retrieves procurement document by ID
   *
   * @param documentId - Document ID
   * @param documentType - Document type
   * @returns Procurement document
   */
  async getProcurementDocument(
    documentId: string,
    documentType: 'REQUISITION' | 'PURCHASE_ORDER' | 'CONTRACT'
  ): Promise<any> {
    try {
      let model: any;

      switch (documentType) {
        case 'REQUISITION':
          model = createPurchaseRequisitionModel(this.sequelize);
          break;
        case 'PURCHASE_ORDER':
          model = createPurchaseOrderModel(this.sequelize);
          break;
        case 'CONTRACT':
          // Would use contract model from composite
          throw new BadRequestException('Contract retrieval not implemented in this method');
        default:
          throw new BadRequestException(`Invalid document type: ${documentType}`);
      }

      const document = await model.findByPk(documentId);

      if (!document) {
        throw new NotFoundException(`${documentType} not found: ${documentId}`);
      }

      return document;
    } catch (error) {
      this.logger.error(`Failed to retrieve procurement document: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Searches procurement documents with filters
   *
   * @param documentType - Document type
   * @param filters - Search filters
   * @param pagination - Pagination options
   * @returns Search results
   */
  async searchProcurementDocuments(
    documentType: 'REQUISITION' | 'PURCHASE_ORDER' | 'CONTRACT',
    filters: any,
    pagination: { page: number; limit: number }
  ): Promise<any> {
    try {
      const offset = (pagination.page - 1) * pagination.limit;
      const limit = pagination.limit;

      let tableName: string;
      let searchFields: string[] = [];

      switch (documentType) {
        case 'REQUISITION':
          tableName = 'purchase_requisitions';
          searchFields = ['requisition_number', 'description', 'status'];
          break;
        case 'PURCHASE_ORDER':
          tableName = 'purchase_orders';
          searchFields = ['po_number', 'vendor_id', 'status'];
          break;
        case 'CONTRACT':
          tableName = 'contracts';
          searchFields = ['contract_number', 'vendor_id', 'status'];
          break;
        default:
          throw new BadRequestException(`Invalid document type: ${documentType}`);
      }

      // Build WHERE clause based on filters
      const whereClauses: string[] = [];
      const replacements: any = { limit, offset };

      if (filters.status) {
        whereClauses.push('status = :status');
        replacements.status = filters.status;
      }

      if (filters.startDate && filters.endDate) {
        whereClauses.push('created_at BETWEEN :startDate AND :endDate');
        replacements.startDate = filters.startDate;
        replacements.endDate = filters.endDate;
      }

      if (filters.minAmount && filters.maxAmount) {
        whereClauses.push('total_amount BETWEEN :minAmount AND :maxAmount');
        replacements.minAmount = filters.minAmount;
        replacements.maxAmount = filters.maxAmount;
      }

      const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      // Execute count query
      const countResult = await this.sequelize.query(
        `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      const total = parseInt(countResult[0]['total']);

      // Execute data query
      const dataResult = await this.sequelize.query(
        `SELECT * FROM ${tableName} ${whereClause} ORDER BY created_at DESC LIMIT :limit OFFSET :offset`,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      return {
        data: dataResult,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          pages: Math.ceil(total / pagination.limit)
        }
      };
    } catch (error) {
      this.logger.error(`Failed to search procurement documents: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cancels a procurement document
   *
   * @param documentId - Document ID
   * @param documentType - Document type
   * @param reason - Cancellation reason
   * @param userId - User ID
   * @returns Cancelled document
   */
  async cancelProcurementDocument(
    documentId: string,
    documentType: 'REQUISITION' | 'PURCHASE_ORDER',
    reason: string,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Cancelling ${documentType}: ${documentId}`);

      let model: any;
      let documentNumber: string;

      switch (documentType) {
        case 'REQUISITION':
          model = createPurchaseRequisitionModel(this.sequelize);
          break;
        case 'PURCHASE_ORDER':
          model = createPurchaseOrderModel(this.sequelize);
          break;
        default:
          throw new BadRequestException(`Invalid document type: ${documentType}`);
      }

      const document = await model.findByPk(documentId, { transaction });

      if (!document) {
        throw new NotFoundException(`${documentType} not found: ${documentId}`);
      }

      documentNumber = document.requisitionNumber || document.poNumber;

      // Update document status
      await document.update(
        {
          status: ProcurementStatus.CANCELLED,
          cancellationReason: reason,
          cancelledBy: userId,
          cancelledAt: new Date()
        },
        { transaction }
      );

      // Release or deobligate funds based on document type
      if (documentType === 'REQUISITION') {
        await this.releaseFunds(documentId, transaction);
      } else if (documentType === 'PURCHASE_ORDER') {
        await this.deobligateFunds(documentId, transaction);
      }

      // Create audit trail entry
      await this.createAuditTrailEntry(
        documentType,
        documentId,
        documentNumber,
        'CANCEL',
        userId,
        { status: document.status },
        { status: ProcurementStatus.CANCELLED, reason },
        transaction
      );

      await transaction.commit();
      this.logger.log(`${documentType} cancelled successfully: ${documentNumber}`);

      return document;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to cancel ${documentType}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Deobligates funds for a cancelled purchase order
   *
   * @param purchaseOrderId - Purchase order ID
   * @param transaction - Database transaction
   */
  private async deobligateFunds(
    purchaseOrderId: string,
    transaction: Transaction
  ): Promise<void> {
    this.logger.log(`Deobligating funds for purchase order: ${purchaseOrderId}`);

    // Get commitment records
    const commitments = await this.sequelize.query(
      `SELECT account_code, committed_amount FROM funds_commitments WHERE purchase_order_id = :purchaseOrderId AND status = 'ACTIVE'`,
      {
        replacements: { purchaseOrderId },
        type: QueryTypes.SELECT,
        transaction
      }
    );

    for (const commitment of commitments) {
      const accountCode = commitment['account_code'];
      const amount = commitment['committed_amount'];

      // Update budget allocation
      await this.sequelize.query(
        `
        UPDATE budget_allocations
        SET committed_amount = COALESCE(committed_amount, 0) - :amount
        WHERE account_code = :accountCode
          AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE)
        `,
        {
          replacements: { accountCode, amount },
          type: QueryTypes.UPDATE,
          transaction
        }
      );
    }

    // Mark commitments as cancelled
    await this.sequelize.query(
      `UPDATE funds_commitments SET status = 'CANCELLED' WHERE purchase_order_id = :purchaseOrderId`,
      {
        replacements: { purchaseOrderId },
        type: QueryTypes.UPDATE,
        transaction
      }
    );
  }
}

/**
 * Export all models and services
 */
export default {
  CEFMSProcurementBackendService,
  createRequisitionApprovalModel,
  createPurchaseOrderReceiptModel,
  createContractModificationModel,
  createVendorQuotationModel,
  createProcurementAuditTrailModel,
  ProcurementStatus,
  PurchaseOrderType,
  ContractType,
  ApprovalLevel,
  FundsAvailabilityStatus,
  ProcurementMethod,
  VendorPerformanceRating
};
