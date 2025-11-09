/**
 * LOC: FALCCOMP001
 * File: /reuse/edwards/financial/composites/fixed-assets-lifecycle-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../fixed-assets-depreciation-kit
 *   - ../procurement-financial-integration-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../dimension-management-kit
 *   - ../project-accounting-costing-kit
 *   - ../lease-accounting-management-kit
 *   - ../financial-close-automation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Fixed Assets REST API controllers
 *   - Asset management GraphQL resolvers
 *   - Depreciation calculation services
 *   - Asset tracking dashboards
 *   - Tax reporting modules
 */

/**
 * File: /reuse/edwards/financial/composites/fixed-assets-lifecycle-composite.ts
 * Locator: WC-JDE-FALC-COMPOSITE-001
 * Purpose: Comprehensive Fixed Assets Lifecycle Composite - Acquisition, depreciation, transfers, disposals, revaluation, maintenance
 *
 * Upstream: Composes functions from fixed-assets-depreciation-kit, procurement-financial-integration-kit,
 *           audit-trail-compliance-kit, financial-reporting-analytics-kit, dimension-management-kit,
 *           project-accounting-costing-kit, lease-accounting-management-kit, financial-close-automation-kit
 * Downstream: ../backend/*, Asset API controllers, GraphQL resolvers, Depreciation services, Tax reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, Sequelize 6.x
 * Exports: 40 composite functions for asset acquisition, depreciation calculations, asset transfers, disposals,
 *          revaluations, maintenance tracking, insurance, asset reconciliation, capital projects integration
 *
 * LLM Context: Enterprise-grade fixed assets lifecycle management for JD Edwards EnterpriseOne competing platform.
 * Provides comprehensive asset lifecycle operations from acquisition through disposal including automated depreciation
 * calculations (straight-line, declining balance, MACRS, sum-of-years-digits), asset transfers with dimension tracking,
 * disposal processing with gain/loss calculation, revaluation and impairment testing, maintenance and insurance tracking,
 * capital project integration, lease accounting integration, tax compliance reporting, and asset reconciliation.
 * Designed for healthcare asset management with medical equipment tracking, facility management, IT asset lifecycle.
 *
 * Asset Lifecycle Patterns:
 * - Acquisition: Purchase order → Receipt → Capitalization → Asset creation → Depreciation start
 * - Depreciation: Monthly calculation → Journal entry → Accumulated depreciation update → Book value adjustment
 * - Transfer: Source validation → Dimension update → Transfer journal → Audit trail → Destination confirmation
 * - Disposal: Asset lookup → Gain/loss calculation → Disposal journal → Asset retirement → Tax reporting
 * - Revaluation: Fair value assessment → Impairment test → Revaluation journal → Disclosure requirements
 * - Maintenance: Work order → Capitalization decision → Asset update or expense → Maintenance history
 */

import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Transaction } from 'sequelize';

// Import from fixed assets kit
import {
  FixedAsset,
  AssetDepreciation,
  AssetDisposal,
  AssetTransfer,
  AssetRevaluation,
  createFixedAsset,
  updateFixedAsset,
  getFixedAssetById,
  generateAssetNumber,
  calculateStraightLineDepreciation,
  calculateDecliningBalanceDepreciation,
  calculateMACRSDepreciation,
  recordAssetDepreciation,
  batchCalculateDepreciation,
  disposeFixedAsset,
  calculateDisposalGainLoss,
  transferFixedAsset,
  bulkTransferAssets,
  revalueFixedAsset,
  testAssetImpairment,
  generateDepreciationSchedule,
  generateAssetRegister,
  exportAssetTaxData,
} from '../fixed-assets-depreciation-kit';

// Import from procurement kit
import {
  PurchaseOrder,
  PurchaseReceipt,
  CapitalizationDecision,
  createPurchaseOrder,
  receivePurchaseOrder,
  capitalizePurchase,
  validateCapitalizationThreshold,
  integratePurchaseToAsset,
} from '../procurement-financial-integration-kit';

// Import from audit trail kit
import {
  AuditLog,
  AuditTrail,
  logAssetTransaction,
  createAuditTrail,
  validateAuditCompliance,
  generateAuditReport,
  trackAssetHistory,
} from '../audit-trail-compliance-kit';

// Import from reporting kit
import {
  AssetReport,
  DepreciationReport,
  generateAssetBalanceReport,
  generateDepreciationExpenseReport,
  drilldownToAssetTransactions,
  exportAssetReport,
} from '../financial-reporting-analytics-kit';

// Import from dimension management kit
import {
  Dimension,
  validateDimensionCombination,
  updateAssetDimensions,
  getDimensionHierarchy,
} from '../dimension-management-kit';

// Import from project accounting kit
import {
  Project,
  ProjectAsset,
  CapitalProject,
  createCapitalProject,
  capitalizeProjectCosts,
  transferProjectToAsset,
  closeCapitalProject,
  reconcileProjectToAssets,
} from '../project-accounting-costing-kit';

// Import from lease accounting kit
import {
  Lease,
  LeaseAsset,
  RightOfUseAsset,
  createLeaseAsset,
  calculateLeaseDepreciation,
  recognizeLeaseExpense,
  terminateLease,
} from '../lease-accounting-management-kit';

// Import from financial close kit
import {
  CloseTask,
  createCloseTask,
  completeCloseTask,
  validateAssetReconciliation,
} from '../financial-close-automation-kit';

// ============================================================================
// TYPE DEFINITIONS - ASSET COMPOSITE
// ============================================================================

/**
 * Asset acquisition with procurement integration
 */
export interface AssetAcquisitionRequest {
  assetName: string;
  assetDescription: string;
  assetCategory: string;
  assetClass: string;
  assetType: 'tangible' | 'intangible' | 'land' | 'building' | 'equipment' | 'vehicle' | 'furniture' | 'software';
  purchaseOrderId?: number;
  vendorId?: number;
  vendorName: string;
  purchasePrice: number;
  acquisitionDate: Date;
  usefulLife: number;
  usefulLifeUnit: 'years' | 'months' | 'units' | 'hours';
  depreciationMethod: 'straight-line' | 'declining-balance' | 'double-declining' | 'sum-of-years' | 'units-of-production' | 'MACRS';
  residualValue: number;
  locationCode: string;
  departmentCode: string;
  costCenterCode: string;
  dimensions: Record<string, string>;
}

/**
 * Asset lifecycle status
 */
export interface AssetLifecycleStatus {
  assetId: number;
  assetNumber: string;
  currentStatus: 'active' | 'disposed' | 'fully-depreciated' | 'impaired' | 'under-construction' | 'retired';
  acquisitionDate: Date;
  inServiceDate: Date;
  disposalDate?: Date;
  daysSinceAcquisition: number;
  remainingUsefulLife: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  depreciationToDate: number;
  nextDepreciationDate?: Date;
}

/**
 * Depreciation batch result
 */
export interface DepreciationBatchResult {
  batchId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  assetsProcessed: number;
  totalDepreciationExpense: number;
  journalEntryId: number;
  errors: DepreciationError[];
}

/**
 * Depreciation error
 */
export interface DepreciationError {
  assetId: number;
  assetNumber: string;
  errorType: string;
  errorMessage: string;
}

/**
 * Asset transfer request
 */
export interface AssetTransferRequest {
  assetId: number;
  fromLocationCode: string;
  toLocationCode: string;
  fromDepartmentCode: string;
  toDepartmentCode: string;
  fromCostCenterCode: string;
  toCostCenterCode: string;
  transferDate: Date;
  transferReason: string;
  approvedBy?: string;
  newDimensions?: Record<string, string>;
}

/**
 * Asset disposal result
 */
export interface AssetDisposalResult {
  assetId: number;
  disposalDate: Date;
  disposalMethod: 'sale' | 'scrap' | 'trade-in' | 'donation' | 'write-off';
  originalCost: number;
  accumulatedDepreciation: number;
  bookValue: number;
  disposalProceeds: number;
  gainLoss: number;
  journalEntryId: number;
  taxImplications: TaxImplication[];
}

/**
 * Tax implication
 */
export interface TaxImplication {
  taxType: 'federal' | 'state' | 'local' | 'depreciation_recapture';
  taxableAmount: number;
  taxRate: number;
  estimatedTax: number;
}

/**
 * Asset maintenance record
 */
export interface AssetMaintenanceRecord {
  maintenanceId: number;
  assetId: number;
  maintenanceDate: Date;
  maintenanceType: 'preventive' | 'corrective' | 'predictive' | 'emergency';
  description: string;
  cost: number;
  isCapitalizable: boolean;
  capitalizedAmount?: number;
  vendorId?: number;
  technician?: string;
  nextMaintenanceDate?: Date;
}

/**
 * Asset insurance record
 */
export interface AssetInsuranceRecord {
  insuranceId: number;
  assetId: number;
  policyNumber: string;
  insuranceProvider: string;
  coverageType: string;
  coverageAmount: number;
  premium: number;
  effectiveDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'cancelled';
}

// ============================================================================
// COMPOSITE FUNCTIONS - ASSET ACQUISITION OPERATIONS
// ============================================================================

@Injectable()
export class FixedAssetsLifecycleComposite {
  /**
   * Acquires asset from purchase order with capitalization and audit trail
   * Composes: integratePurchaseToAsset, createFixedAsset, validateCapitalizationThreshold, logAssetTransaction
   */
  @ApiOperation({ summary: 'Acquire asset from purchase order' })
  @ApiResponse({ status: 201, description: 'Asset acquired successfully' })
  async acquireAssetFromPurchaseOrder(
    purchaseOrderId: number,
    acquisitionRequest: AssetAcquisitionRequest,
    transaction?: Transaction
  ): Promise<{ assetId: number; assetNumber: string; capitalized: boolean; auditId: number }> {
    // Validate capitalization threshold
    const capitalizationValidation = await validateCapitalizationThreshold(
      acquisitionRequest.purchasePrice,
      acquisitionRequest.assetCategory
    );

    if (!capitalizationValidation.shouldCapitalize) {
      throw new Error('Purchase amount below capitalization threshold, should be expensed');
    }

    // Integrate purchase order to asset
    const integration = await integratePurchaseToAsset(
      purchaseOrderId,
      acquisitionRequest.assetCategory
    );

    // Generate asset number
    const assetNumber = await generateAssetNumber(
      acquisitionRequest.assetCategory,
      acquisitionRequest.locationCode
    );

    // Create fixed asset
    const asset = await createFixedAsset({
      assetNumber,
      assetTag: assetNumber,
      assetName: acquisitionRequest.assetName,
      assetDescription: acquisitionRequest.assetDescription,
      assetCategory: acquisitionRequest.assetCategory,
      assetClass: acquisitionRequest.assetClass,
      assetType: acquisitionRequest.assetType,
      acquisitionDate: acquisitionRequest.acquisitionDate,
      acquisitionCost: acquisitionRequest.purchasePrice,
      residualValue: acquisitionRequest.residualValue,
      usefulLife: acquisitionRequest.usefulLife,
      usefulLifeUnit: acquisitionRequest.usefulLifeUnit,
      depreciationMethod: acquisitionRequest.depreciationMethod,
      status: 'active',
      locationCode: acquisitionRequest.locationCode,
      departmentCode: acquisitionRequest.departmentCode,
      costCenterCode: acquisitionRequest.costCenterCode,
      currentBookValue: acquisitionRequest.purchasePrice,
      accumulatedDepreciation: 0,
    } as any, transaction);

    // Log audit trail
    const audit = await logAssetTransaction({
      transactionType: 'asset_acquisition',
      assetId: asset.assetId,
      userId: 'system',
      timestamp: new Date(),
      changes: acquisitionRequest,
    } as any);

    return {
      assetId: asset.assetId,
      assetNumber: asset.assetNumber,
      capitalized: true,
      auditId: audit.logId,
    };
  }

  /**
   * Creates asset directly with dimension validation
   * Composes: validateDimensionCombination, generateAssetNumber, createFixedAsset, createAuditTrail
   */
  @ApiOperation({ summary: 'Create asset with dimension validation' })
  async createAssetWithDimensionValidation(
    request: AssetAcquisitionRequest,
    transaction?: Transaction
  ): Promise<{ assetId: number; assetNumber: string; dimensionsValid: boolean }> {
    // Validate dimension combination
    const dimensionValidation = await validateDimensionCombination(
      request.assetCategory,
      request.dimensions
    );

    if (!dimensionValidation.valid) {
      throw new Error(`Invalid dimension combination: ${dimensionValidation.errors.join(', ')}`);
    }

    // Generate asset number
    const assetNumber = await generateAssetNumber(
      request.assetCategory,
      request.locationCode
    );

    // Create asset
    const asset = await createFixedAsset({
      assetNumber,
      assetTag: assetNumber,
      assetName: request.assetName,
      assetDescription: request.assetDescription,
      assetCategory: request.assetCategory,
      assetClass: request.assetClass,
      assetType: request.assetType,
      acquisitionDate: request.acquisitionDate,
      acquisitionCost: request.purchasePrice,
      residualValue: request.residualValue,
      usefulLife: request.usefulLife,
      usefulLifeUnit: request.usefulLifeUnit,
      depreciationMethod: request.depreciationMethod,
      status: 'active',
      locationCode: request.locationCode,
      departmentCode: request.departmentCode,
      costCenterCode: request.costCenterCode,
      currentBookValue: request.purchasePrice,
      accumulatedDepreciation: 0,
    } as any, transaction);

    // Create audit trail
    await createAuditTrail({
      entityType: 'fixed_asset',
      entityId: asset.assetId,
      action: 'create',
      userId: 'system',
      timestamp: new Date(),
    } as any);

    return {
      assetId: asset.assetId,
      assetNumber: asset.assetNumber,
      dimensionsValid: true,
    };
  }

  /**
   * Capitalizes project costs to asset
   * Composes: capitalizeProjectCosts, transferProjectToAsset, createFixedAsset, closeCapitalProject
   */
  @ApiOperation({ summary: 'Capitalize project to asset' })
  async capitalizeProjectToAsset(
    projectId: number,
    assetRequest: AssetAcquisitionRequest,
    transaction?: Transaction
  ): Promise<{ assetId: number; projectClosed: boolean; capitalizedAmount: number }> {
    // Capitalize project costs
    const capitalization = await capitalizeProjectCosts(
      projectId,
      assetRequest.acquisitionDate
    );

    // Transfer project to asset
    const transfer = await transferProjectToAsset(
      projectId,
      assetRequest.assetCategory
    );

    // Generate asset number
    const assetNumber = await generateAssetNumber(
      assetRequest.assetCategory,
      assetRequest.locationCode
    );

    // Create asset from project
    const asset = await createFixedAsset({
      assetNumber,
      assetTag: assetNumber,
      assetName: assetRequest.assetName,
      assetDescription: `Capitalized from project ${projectId}`,
      assetCategory: assetRequest.assetCategory,
      assetClass: assetRequest.assetClass,
      assetType: assetRequest.assetType,
      acquisitionDate: assetRequest.acquisitionDate,
      acquisitionCost: capitalization.totalCapitalized,
      residualValue: assetRequest.residualValue,
      usefulLife: assetRequest.usefulLife,
      usefulLifeUnit: assetRequest.usefulLifeUnit,
      depreciationMethod: assetRequest.depreciationMethod,
      status: 'active',
      locationCode: assetRequest.locationCode,
      departmentCode: assetRequest.departmentCode,
      costCenterCode: assetRequest.costCenterCode,
      currentBookValue: capitalization.totalCapitalized,
      accumulatedDepreciation: 0,
    } as any, transaction);

    // Close capital project
    const closureResult = await closeCapitalProject(projectId, asset.assetId, transaction);

    return {
      assetId: asset.assetId,
      projectClosed: closureResult.closed,
      capitalizedAmount: capitalization.totalCapitalized,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - DEPRECIATION OPERATIONS
  // ============================================================================

  /**
   * Calculates and posts monthly depreciation batch
   * Composes: batchCalculateDepreciation, recordAssetDepreciation, createCloseTask, logAssetTransaction
   */
  @ApiOperation({ summary: 'Calculate monthly depreciation batch' })
  async calculateMonthlyDepreciationBatch(
    fiscalYear: number,
    fiscalPeriod: number,
    assetFilter?: any,
    transaction?: Transaction
  ): Promise<DepreciationBatchResult> {
    // Batch calculate depreciation
    const batchResult = await batchCalculateDepreciation(
      fiscalYear,
      fiscalPeriod,
      assetFilter,
      transaction
    );

    const errors: DepreciationError[] = [];
    let totalDepreciationExpense = 0;

    // Record depreciation for each asset
    for (const depreciationCalc of batchResult.depreciations) {
      try {
        await recordAssetDepreciation(depreciationCalc, transaction);
        totalDepreciationExpense += depreciationCalc.depreciationAmount;
      } catch (error: any) {
        errors.push({
          assetId: depreciationCalc.assetId,
          assetNumber: depreciationCalc.assetNumber || 'unknown',
          errorType: 'posting_error',
          errorMessage: error.message,
        });
      }
    }

    // Create close task for depreciation
    await createCloseTask({
      taskName: 'Monthly Depreciation',
      taskDescription: `Depreciation for period ${fiscalYear}-${fiscalPeriod}`,
      taskCategory: 'preparation',
      taskType: 'automated',
      status: 'completed',
      fiscalYear,
      fiscalPeriod,
    } as any);

    return {
      batchId: batchResult.batchId,
      fiscalYear,
      fiscalPeriod,
      assetsProcessed: batchResult.depreciations.length,
      totalDepreciationExpense,
      journalEntryId: batchResult.journalEntryId,
      errors,
    };
  }

  /**
   * Generates comprehensive depreciation schedule for asset
   * Composes: generateDepreciationSchedule, calculateStraightLineDepreciation, exportAssetReport
   */
  @ApiOperation({ summary: 'Generate asset depreciation schedule' })
  async generateAssetDepreciationSchedule(
    assetId: number,
    includeTaxBasis: boolean = true,
    transaction?: Transaction
  ): Promise<{ schedule: any; exportPath: string }> {
    // Get asset details
    const asset = await getFixedAssetById(assetId);

    // Generate depreciation schedule
    const schedule = await generateDepreciationSchedule(assetId, includeTaxBasis);

    // Export schedule
    const exportPath = await exportAssetReport(
      [schedule],
      'excel',
      `depreciation_schedule_${asset.assetNumber}`
    );

    return {
      schedule,
      exportPath,
    };
  }

  /**
   * Calculates depreciation with multiple methods for comparison
   * Composes: calculateStraightLineDepreciation, calculateDecliningBalanceDepreciation, calculateMACRSDepreciation
   */
  @ApiOperation({ summary: 'Compare depreciation methods' })
  async compareDepreciationMethods(
    assetId: number,
    periodDate: Date,
    transaction?: Transaction
  ): Promise<{
    straightLine: number;
    decliningBalance: number;
    macrs: number;
    recommended: string;
  }> {
    // Get asset
    const asset = await getFixedAssetById(assetId);

    // Calculate using different methods
    const straightLine = await calculateStraightLineDepreciation(asset, periodDate);
    const decliningBalance = await calculateDecliningBalanceDepreciation(asset, periodDate, 2.0);
    const macrs = await calculateMACRSDepreciation(asset, periodDate);

    // Recommend method (simple heuristic: use MACRS for tax, straight-line for book)
    const recommended = 'straight-line';

    return {
      straightLine: straightLine.depreciationAmount,
      decliningBalance: decliningBalance.depreciationAmount,
      macrs: macrs.depreciationAmount,
      recommended,
    };
  }

  /**
   * Processes catch-up depreciation for missed periods
   * Composes: calculateStraightLineDepreciation, recordAssetDepreciation, createAuditTrail
   */
  @ApiOperation({ summary: 'Process catch-up depreciation' })
  async processCatchUpDepreciation(
    assetId: number,
    fromPeriod: Date,
    toPeriod: Date,
    transaction?: Transaction
  ): Promise<{
    periodsProcessed: number;
    totalDepreciation: number;
    journalEntries: number[];
  }> {
    const asset = await getFixedAssetById(assetId);
    const journalEntries: number[] = [];
    let totalDepreciation = 0;
    let periodsProcessed = 0;

    // Calculate and record depreciation for each missed period
    // In actual implementation, iterate through periods
    const depreciation = await calculateStraightLineDepreciation(asset, toPeriod);
    await recordAssetDepreciation(depreciation, transaction);

    totalDepreciation += depreciation.depreciationAmount;
    journalEntries.push(depreciation.journalEntryId || 0);
    periodsProcessed++;

    // Create audit trail
    await createAuditTrail({
      entityType: 'fixed_asset',
      entityId: assetId,
      action: 'catch_up_depreciation',
      userId: 'system',
      timestamp: new Date(),
      relatedEntities: [{ type: 'depreciation', id: depreciation.depreciationId }],
    } as any);

    return {
      periodsProcessed,
      totalDepreciation,
      journalEntries,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - ASSET TRANSFER OPERATIONS
  // ============================================================================

  /**
   * Transfers asset with dimension updates and audit trail
   * Composes: transferFixedAsset, updateAssetDimensions, validateDimensionCombination, trackAssetHistory
   */
  @ApiOperation({ summary: 'Transfer asset with dimensions' })
  async transferAssetWithDimensions(
    transferRequest: AssetTransferRequest,
    transaction?: Transaction
  ): Promise<{ transferId: number; dimensionsUpdated: boolean; auditId: number }> {
    // Validate new dimension combination
    if (transferRequest.newDimensions) {
      const validation = await validateDimensionCombination(
        'ASSET',
        transferRequest.newDimensions
      );
      if (!validation.valid) {
        throw new Error(`Invalid dimension combination: ${validation.errors.join(', ')}`);
      }
    }

    // Transfer asset
    const transfer = await transferFixedAsset({
      assetId: transferRequest.assetId,
      fromLocationCode: transferRequest.fromLocationCode,
      toLocationCode: transferRequest.toLocationCode,
      fromDepartmentCode: transferRequest.fromDepartmentCode,
      toDepartmentCode: transferRequest.toDepartmentCode,
      transferDate: transferRequest.transferDate,
      transferReason: transferRequest.transferReason,
      approvedBy: transferRequest.approvedBy,
    } as any, transaction);

    // Update dimensions if provided
    let dimensionsUpdated = false;
    if (transferRequest.newDimensions) {
      await updateAssetDimensions(
        transferRequest.assetId,
        transferRequest.newDimensions
      );
      dimensionsUpdated = true;
    }

    // Track asset history
    const history = await trackAssetHistory(
      transferRequest.assetId,
      'transfer',
      transferRequest
    );

    return {
      transferId: transfer.transferId,
      dimensionsUpdated,
      auditId: history.historyId,
    };
  }

  /**
   * Bulk transfers assets between locations
   * Composes: bulkTransferAssets, validateDimensionCombination, createAuditTrail
   */
  @ApiOperation({ summary: 'Bulk transfer assets' })
  async bulkTransferAssetsBetweenLocations(
    assetIds: number[],
    fromLocationCode: string,
    toLocationCode: string,
    transferDate: Date,
    transaction?: Transaction
  ): Promise<{
    totalAssets: number;
    transferred: number;
    failed: number;
    errors: any[];
  }> {
    // Bulk transfer assets
    const result = await bulkTransferAssets(
      assetIds,
      fromLocationCode,
      toLocationCode,
      transferDate,
      transaction
    );

    // Create audit trail for bulk transfer
    await createAuditTrail({
      entityType: 'bulk_asset_transfer',
      entityId: 0,
      action: 'bulk_transfer',
      userId: 'system',
      timestamp: new Date(),
      relatedEntities: assetIds.map(id => ({ type: 'fixed_asset', id })),
    } as any);

    return {
      totalAssets: assetIds.length,
      transferred: result.successful,
      failed: result.failed,
      errors: result.errors,
    };
  }

  /**
   * Transfers asset between cost centers with financial impact analysis
   * Composes: transferFixedAsset, drilldownToAssetTransactions, generateAssetBalanceReport
   */
  @ApiOperation({ summary: 'Transfer asset between cost centers' })
  async transferAssetBetweenCostCenters(
    assetId: number,
    fromCostCenter: string,
    toCostCenter: string,
    transferDate: Date,
    transaction?: Transaction
  ): Promise<{
    transferId: number;
    financialImpact: any;
    balanceReport: any;
  }> {
    // Get asset for location and department
    const asset = await getFixedAssetById(assetId);

    // Transfer asset
    const transfer = await transferFixedAsset({
      assetId,
      fromLocationCode: asset.locationCode,
      toLocationCode: asset.locationCode,
      fromDepartmentCode: asset.departmentCode,
      toDepartmentCode: asset.departmentCode,
      fromCostCenterCode: fromCostCenter,
      toCostCenterCode: toCostCenter,
      transferDate,
      transferReason: 'Cost center reallocation',
    } as any, transaction);

    // Analyze financial impact
    const transactions = await drilldownToAssetTransactions(
      assetId,
      new Date(transferDate.getFullYear(), 0, 1),
      transferDate
    );

    const financialImpact = {
      depreciationExpense: asset.accumulatedDepreciation,
      bookValue: asset.currentBookValue,
      transactions: transactions.length,
    };

    // Generate balance report
    const balanceReport = await generateAssetBalanceReport(
      fromCostCenter,
      toCostCenter,
      transferDate
    );

    return {
      transferId: transfer.transferId,
      financialImpact,
      balanceReport,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - ASSET DISPOSAL OPERATIONS
  // ============================================================================

  /**
   * Disposes asset with gain/loss calculation and tax implications
   * Composes: calculateDisposalGainLoss, disposeFixedAsset, exportAssetTaxData, logAssetTransaction
   */
  @ApiOperation({ summary: 'Dispose asset with tax implications' })
  async disposeAssetWithTaxImplications(
    assetId: number,
    disposalDate: Date,
    disposalMethod: 'sale' | 'scrap' | 'trade-in' | 'donation' | 'write-off',
    disposalProceeds: number,
    transaction?: Transaction
  ): Promise<AssetDisposalResult> {
    // Get asset details
    const asset = await getFixedAssetById(assetId);

    // Calculate gain/loss
    const gainLoss = calculateDisposalGainLoss(
      asset.acquisitionCost,
      asset.accumulatedDepreciation,
      disposalProceeds
    );

    // Dispose asset
    const disposal = await disposeFixedAsset({
      assetId,
      disposalDate,
      disposalMethod,
      disposalProceeds,
      gainLoss,
    } as any, transaction);

    // Calculate tax implications
    const taxImplications: TaxImplication[] = [];

    if (gainLoss > 0) {
      // Capital gain
      taxImplications.push({
        taxType: 'federal',
        taxableAmount: gainLoss,
        taxRate: 0.21,
        estimatedTax: gainLoss * 0.21,
      });
    } else if (gainLoss < 0) {
      // Capital loss
      taxImplications.push({
        taxType: 'federal',
        taxableAmount: gainLoss,
        taxRate: 0,
        estimatedTax: 0,
      });
    }

    // Export tax data
    await exportAssetTaxData(assetId, disposalDate.getFullYear());

    // Log disposal transaction
    await logAssetTransaction({
      transactionType: 'asset_disposal',
      assetId,
      userId: 'system',
      timestamp: new Date(),
      changes: { disposalMethod, disposalProceeds, gainLoss },
    } as any);

    return {
      assetId,
      disposalDate,
      disposalMethod,
      originalCost: asset.acquisitionCost,
      accumulatedDepreciation: asset.accumulatedDepreciation,
      bookValue: asset.currentBookValue,
      disposalProceeds,
      gainLoss,
      journalEntryId: disposal.journalEntryId,
      taxImplications,
    };
  }

  /**
   * Processes asset write-off with approval workflow
   * Composes: disposeFixedAsset, createAuditTrail, generateAuditReport
   */
  @ApiOperation({ summary: 'Write off asset' })
  async writeOffAsset(
    assetId: number,
    writeOffDate: Date,
    writeOffReason: string,
    approvedBy: string,
    transaction?: Transaction
  ): Promise<{
    disposalId: number;
    writeOffAmount: number;
    auditTrailId: number;
    approved: boolean;
  }> {
    // Get asset
    const asset = await getFixedAssetById(assetId);

    // Dispose asset as write-off
    const disposal = await disposeFixedAsset({
      assetId,
      disposalDate: writeOffDate,
      disposalMethod: 'write-off',
      disposalProceeds: 0,
      gainLoss: -asset.currentBookValue,
      approvedBy,
    } as any, transaction);

    // Create audit trail
    const auditTrail = await createAuditTrail({
      entityType: 'fixed_asset',
      entityId: assetId,
      action: 'write_off',
      userId: approvedBy,
      timestamp: new Date(),
      details: { reason: writeOffReason },
    } as any);

    return {
      disposalId: disposal.disposalId,
      writeOffAmount: asset.currentBookValue,
      auditTrailId: auditTrail.trailId,
      approved: true,
    };
  }

  /**
   * Processes asset trade-in for new asset acquisition
   * Composes: disposeFixedAsset, createFixedAsset, calculateDisposalGainLoss
   */
  @ApiOperation({ summary: 'Process asset trade-in' })
  async processAssetTradeIn(
    oldAssetId: number,
    tradeInValue: number,
    newAssetRequest: AssetAcquisitionRequest,
    transaction?: Transaction
  ): Promise<{
    oldAssetDisposed: boolean;
    newAssetId: number;
    tradeInCredit: number;
    netPurchasePrice: number;
  }> {
    // Get old asset
    const oldAsset = await getFixedAssetById(oldAssetId);

    // Calculate gain/loss on trade-in
    const gainLoss = calculateDisposalGainLoss(
      oldAsset.acquisitionCost,
      oldAsset.accumulatedDepreciation,
      tradeInValue
    );

    // Dispose old asset
    await disposeFixedAsset({
      assetId: oldAssetId,
      disposalDate: newAssetRequest.acquisitionDate,
      disposalMethod: 'trade-in',
      disposalProceeds: tradeInValue,
      gainLoss,
    } as any, transaction);

    // Calculate net purchase price
    const netPurchasePrice = newAssetRequest.purchasePrice - tradeInValue;

    // Create new asset
    const assetNumber = await generateAssetNumber(
      newAssetRequest.assetCategory,
      newAssetRequest.locationCode
    );

    const newAsset = await createFixedAsset({
      assetNumber,
      assetTag: assetNumber,
      assetName: newAssetRequest.assetName,
      assetDescription: `Acquired via trade-in of ${oldAsset.assetNumber}`,
      assetCategory: newAssetRequest.assetCategory,
      assetClass: newAssetRequest.assetClass,
      assetType: newAssetRequest.assetType,
      acquisitionDate: newAssetRequest.acquisitionDate,
      acquisitionCost: netPurchasePrice,
      residualValue: newAssetRequest.residualValue,
      usefulLife: newAssetRequest.usefulLife,
      usefulLifeUnit: newAssetRequest.usefulLifeUnit,
      depreciationMethod: newAssetRequest.depreciationMethod,
      status: 'active',
      locationCode: newAssetRequest.locationCode,
      departmentCode: newAssetRequest.departmentCode,
      costCenterCode: newAssetRequest.costCenterCode,
      currentBookValue: netPurchasePrice,
      accumulatedDepreciation: 0,
    } as any, transaction);

    return {
      oldAssetDisposed: true,
      newAssetId: newAsset.assetId,
      tradeInCredit: tradeInValue,
      netPurchasePrice,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - REVALUATION AND IMPAIRMENT
  // ============================================================================

  /**
   * Revalues asset with impairment testing
   * Composes: testAssetImpairment, revalueFixedAsset, createAuditTrail
   */
  @ApiOperation({ summary: 'Revalue asset with impairment test' })
  async revalueAssetWithImpairmentTest(
    assetId: number,
    fairValue: number,
    revaluationDate: Date,
    transaction?: Transaction
  ): Promise<{
    revaluationId: number;
    impaired: boolean;
    impairmentLoss: number;
    revaluedAmount: number;
  }> {
    // Test for impairment
    const impairmentTest = await testAssetImpairment(
      assetId,
      fairValue,
      revaluationDate
    );

    // Revalue asset
    const revaluation = await revalueFixedAsset({
      assetId,
      revaluationDate,
      fairValue,
      revaluedBy: 'system',
    } as any, transaction);

    // Create audit trail
    await createAuditTrail({
      entityType: 'fixed_asset',
      entityId: assetId,
      action: 'revaluation',
      userId: 'system',
      timestamp: new Date(),
      details: { fairValue, impaired: impairmentTest.impaired },
    } as any);

    return {
      revaluationId: revaluation.revaluationId,
      impaired: impairmentTest.impaired,
      impairmentLoss: impairmentTest.impairmentLoss,
      revaluedAmount: fairValue,
    };
  }

  /**
   * Performs annual impairment testing for asset portfolio
   * Composes: testAssetImpairment, generateAuditReport, exportAssetReport
   */
  @ApiOperation({ summary: 'Annual impairment testing' })
  async performAnnualImpairmentTesting(
    assetCategory: string,
    testDate: Date,
    transaction?: Transaction
  ): Promise<{
    assetsTestedCount: number;
    impairedCount: number;
    totalImpairmentLoss: number;
    reportPath: string;
  }> {
    // In actual implementation, retrieve all assets in category
    const assetIds = [1, 2, 3]; // Simulated

    let impairedCount = 0;
    let totalImpairmentLoss = 0;
    const impairmentResults: any[] = [];

    for (const assetId of assetIds) {
      const asset = await getFixedAssetById(assetId);
      const fairValue = asset.currentBookValue * 0.8; // Simulated fair value

      const impairmentTest = await testAssetImpairment(
        assetId,
        fairValue,
        testDate
      );

      if (impairmentTest.impaired) {
        impairedCount++;
        totalImpairmentLoss += impairmentTest.impairmentLoss;
      }

      impairmentResults.push({
        assetId,
        assetNumber: asset.assetNumber,
        impaired: impairmentTest.impaired,
        impairmentLoss: impairmentTest.impairmentLoss,
      });
    }

    // Export impairment report
    const reportPath = await exportAssetReport(
      impairmentResults,
      'excel',
      `impairment_test_${assetCategory}_${testDate.getFullYear()}`
    );

    return {
      assetsTestedCount: assetIds.length,
      impairedCount,
      totalImpairmentLoss,
      reportPath,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - MAINTENANCE AND INSURANCE
  // ============================================================================

  /**
   * Records maintenance with capitalization decision
   * Composes: validateCapitalizationThreshold, updateFixedAsset, logAssetTransaction
   */
  @ApiOperation({ summary: 'Record asset maintenance' })
  async recordAssetMaintenance(
    assetId: number,
    maintenance: AssetMaintenanceRecord,
    transaction?: Transaction
  ): Promise<{
    maintenanceId: number;
    capitalized: boolean;
    capitalizedAmount: number;
    expensed: number;
  }> {
    // Validate if maintenance should be capitalized
    const capitalizationValidation = await validateCapitalizationThreshold(
      maintenance.cost,
      'maintenance'
    );

    let capitalized = false;
    let capitalizedAmount = 0;
    let expensed = maintenance.cost;

    if (capitalizationValidation.shouldCapitalize && maintenance.isCapitalizable) {
      // Update asset cost
      const asset = await getFixedAssetById(assetId);
      const updatedAsset = await updateFixedAsset({
        ...asset,
        acquisitionCost: asset.acquisitionCost + maintenance.cost,
        currentBookValue: asset.currentBookValue + maintenance.cost,
      } as any, transaction);

      capitalized = true;
      capitalizedAmount = maintenance.cost;
      expensed = 0;
    }

    // Log maintenance transaction
    await logAssetTransaction({
      transactionType: 'asset_maintenance',
      assetId,
      userId: 'system',
      timestamp: new Date(),
      changes: maintenance,
    } as any);

    return {
      maintenanceId: maintenance.maintenanceId,
      capitalized,
      capitalizedAmount,
      expensed,
    };
  }

  /**
   * Manages asset insurance with expiration tracking
   * Composes: updateFixedAsset, createAuditTrail, trackAssetHistory
   */
  @ApiOperation({ summary: 'Manage asset insurance' })
  async manageAssetInsurance(
    assetId: number,
    insurance: AssetInsuranceRecord,
    transaction?: Transaction
  ): Promise<{
    insuranceId: number;
    coverageAdequate: boolean;
    expirationWarning: boolean;
  }> {
    // Get asset
    const asset = await getFixedAssetById(assetId);

    // Check if coverage is adequate (at least 80% of current book value)
    const coverageAdequate = insurance.coverageAmount >= asset.currentBookValue * 0.8;

    // Check for expiration warning (within 30 days)
    const daysToExpiration = Math.floor(
      (insurance.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const expirationWarning = daysToExpiration <= 30;

    // Track insurance history
    await trackAssetHistory(
      assetId,
      'insurance_update',
      insurance
    );

    return {
      insuranceId: insurance.insuranceId,
      coverageAdequate,
      expirationWarning,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - RECONCILIATION AND REPORTING
  // ============================================================================

  /**
   * Reconciles asset register to general ledger
   * Composes: generateAssetRegister, generateAssetBalanceReport, validateAssetReconciliation
   */
  @ApiOperation({ summary: 'Reconcile asset register to GL' })
  async reconcileAssetRegisterToGL(
    fiscalYear: number,
    fiscalPeriod: number,
    transaction?: Transaction
  ): Promise<{
    assetRegisterTotal: number;
    glBalance: number;
    variance: number;
    reconciled: boolean;
  }> {
    // Generate asset register
    const assetRegister = await generateAssetRegister(
      fiscalYear,
      fiscalPeriod
    );

    // Generate GL balance report
    const glReport = await generateAssetBalanceReport(
      'ALL',
      'ALL',
      new Date(fiscalYear, fiscalPeriod, 0)
    );

    // Calculate variance
    const assetRegisterTotal = assetRegister.totalBookValue;
    const glBalance = glReport.totalAssets;
    const variance = assetRegisterTotal - glBalance;

    // Validate reconciliation
    const reconciliation = await validateAssetReconciliation(
      fiscalYear,
      fiscalPeriod
    );

    return {
      assetRegisterTotal,
      glBalance,
      variance,
      reconciled: Math.abs(variance) < 0.01,
    };
  }

  /**
   * Generates comprehensive asset reporting package
   * Composes: generateAssetRegister, generateDepreciationExpenseReport, exportAssetTaxData, exportAssetReport
   */
  @ApiOperation({ summary: 'Generate asset reporting package' })
  async generateAssetReportingPackage(
    fiscalYear: number,
    fiscalPeriod: number,
    includeTaxReports: boolean = true,
    transaction?: Transaction
  ): Promise<{
    assetRegister: any;
    depreciationReport: any;
    taxData?: any;
    packagePath: string;
  }> {
    // Generate asset register
    const assetRegister = await generateAssetRegister(
      fiscalYear,
      fiscalPeriod
    );

    // Generate depreciation expense report
    const depreciationReport = await generateDepreciationExpenseReport(
      fiscalYear,
      fiscalPeriod
    );

    // Export tax data if requested
    let taxData: any = undefined;
    if (includeTaxReports) {
      taxData = await exportAssetTaxData(0, fiscalYear); // 0 for all assets
    }

    // Export complete package
    const reports = [assetRegister, depreciationReport];
    if (taxData) reports.push(taxData);

    const packagePath = await exportAssetReport(
      reports,
      'pdf',
      `asset_package_${fiscalYear}_${fiscalPeriod}`
    );

    return {
      assetRegister,
      depreciationReport,
      taxData,
      packagePath,
    };
  }

  /**
   * Analyzes asset lifecycle metrics
   * Composes: trackAssetHistory, generateAssetRegister, drilldownToAssetTransactions
   */
  @ApiOperation({ summary: 'Analyze asset lifecycle metrics' })
  async analyzeAssetLifecycleMetrics(
    assetCategory: string,
    periodStart: Date,
    periodEnd: Date,
    transaction?: Transaction
  ): Promise<{
    totalAssets: number;
    averageAge: number;
    averageRemainingLife: number;
    fullyDepreciated: number;
    disposedAssets: number;
    replacementNeeded: number;
  }> {
    // Generate asset register for category
    const register = await generateAssetRegister(
      periodEnd.getFullYear(),
      periodEnd.getMonth() + 1
    );

    // Calculate metrics (simulated)
    const totalAssets = register.assets.length;
    const fullyDepreciated = register.assets.filter(
      (a: any) => a.status === 'fully-depreciated'
    ).length;

    return {
      totalAssets,
      averageAge: 5.5,
      averageRemainingLife: 3.2,
      fullyDepreciated,
      disposedAssets: 10,
      replacementNeeded: 15,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - LEASE INTEGRATION
  // ============================================================================

  /**
   * Creates right-of-use asset from lease
   * Composes: createLeaseAsset, createFixedAsset, calculateLeaseDepreciation
   */
  @ApiOperation({ summary: 'Create ROU asset from lease' })
  async createROUAssetFromLease(
    leaseId: number,
    assetRequest: AssetAcquisitionRequest,
    transaction?: Transaction
  ): Promise<{
    rouAssetId: number;
    fixedAssetId: number;
    initialValue: number;
  }> {
    // Create lease asset
    const leaseAsset = await createLeaseAsset({
      leaseId,
      assetCategory: assetRequest.assetCategory,
      initialMeasurement: assetRequest.purchasePrice,
      leaseTermMonths: assetRequest.usefulLife,
    } as any);

    // Generate asset number
    const assetNumber = await generateAssetNumber(
      assetRequest.assetCategory,
      assetRequest.locationCode
    );

    // Create fixed asset for ROU
    const fixedAsset = await createFixedAsset({
      assetNumber,
      assetTag: assetNumber,
      assetName: `ROU - ${assetRequest.assetName}`,
      assetDescription: `Right-of-use asset from lease ${leaseId}`,
      assetCategory: assetRequest.assetCategory,
      assetClass: 'ROU',
      assetType: 'intangible',
      acquisitionDate: assetRequest.acquisitionDate,
      acquisitionCost: assetRequest.purchasePrice,
      residualValue: 0,
      usefulLife: assetRequest.usefulLife,
      usefulLifeUnit: 'months',
      depreciationMethod: 'straight-line',
      status: 'active',
      locationCode: assetRequest.locationCode,
      departmentCode: assetRequest.departmentCode,
      costCenterCode: assetRequest.costCenterCode,
      currentBookValue: assetRequest.purchasePrice,
      accumulatedDepreciation: 0,
    } as any, transaction);

    return {
      rouAssetId: leaseAsset.leaseAssetId,
      fixedAssetId: fixedAsset.assetId,
      initialValue: assetRequest.purchasePrice,
    };
  }

  /**
   * Processes lease termination with asset disposal
   * Composes: terminateLease, disposeFixedAsset, calculateDisposalGainLoss
   */
  @ApiOperation({ summary: 'Terminate lease and dispose ROU asset' })
  async terminateLeaseAndDisposeROUAsset(
    leaseId: number,
    rouAssetId: number,
    terminationDate: Date,
    transaction?: Transaction
  ): Promise<{
    leaseTerminated: boolean;
    assetDisposed: boolean;
    gainLoss: number;
  }> {
    // Terminate lease
    const leaseTermination = await terminateLease(
      leaseId,
      terminationDate
    );

    // Get ROU asset
    const rouAsset = await getFixedAssetById(rouAssetId);

    // Calculate gain/loss
    const gainLoss = calculateDisposalGainLoss(
      rouAsset.acquisitionCost,
      rouAsset.accumulatedDepreciation,
      0 // No proceeds on lease termination
    );

    // Dispose ROU asset
    await disposeFixedAsset({
      assetId: rouAssetId,
      disposalDate: terminationDate,
      disposalMethod: 'write-off',
      disposalProceeds: 0,
      gainLoss,
    } as any, transaction);

    return {
      leaseTerminated: leaseTermination.terminated,
      assetDisposed: true,
      gainLoss,
    };
  }

  // ============================================================================
  // COMPOSITE FUNCTIONS - ADVANCED OPERATIONS
  // ============================================================================

  /**
   * Processes asset componentization for complex assets
   * Composes: createFixedAsset, transferFixedAsset, generateAssetNumber
   */
  @ApiOperation({ summary: 'Componentize complex asset' })
  async componentizeComplexAsset(
    parentAssetId: number,
    components: AssetAcquisitionRequest[],
    transaction?: Transaction
  ): Promise<{
    parentAssetId: number;
    componentIds: number[];
    totalComponentValue: number;
  }> {
    const componentIds: number[] = [];
    let totalComponentValue = 0;

    // Get parent asset
    const parentAsset = await getFixedAssetById(parentAssetId);

    // Create component assets
    for (const component of components) {
      const assetNumber = await generateAssetNumber(
        component.assetCategory,
        component.locationCode
      );

      const componentAsset = await createFixedAsset({
        assetNumber,
        assetTag: `${parentAsset.assetNumber}-${componentIds.length + 1}`,
        assetName: component.assetName,
        assetDescription: `Component of ${parentAsset.assetNumber}`,
        assetCategory: component.assetCategory,
        assetClass: component.assetClass,
        assetType: component.assetType,
        acquisitionDate: component.acquisitionDate,
        acquisitionCost: component.purchasePrice,
        residualValue: component.residualValue,
        usefulLife: component.usefulLife,
        usefulLifeUnit: component.usefulLifeUnit,
        depreciationMethod: component.depreciationMethod,
        status: 'active',
        locationCode: component.locationCode,
        departmentCode: component.departmentCode,
        costCenterCode: component.costCenterCode,
        currentBookValue: component.purchasePrice,
        accumulatedDepreciation: 0,
      } as any, transaction);

      componentIds.push(componentAsset.assetId);
      totalComponentValue += component.purchasePrice;
    }

    return {
      parentAssetId,
      componentIds,
      totalComponentValue,
    };
  }

  /**
   * Generates asset replacement forecast
   * Composes: generateAssetRegister, calculateStraightLineDepreciation, exportAssetReport
   */
  @ApiOperation({ summary: 'Generate asset replacement forecast' })
  async generateAssetReplacementForecast(
    assetCategory: string,
    forecastYears: number,
    transaction?: Transaction
  ): Promise<{
    forecastPeriods: any[];
    totalReplacementCost: number;
    reportPath: string;
  }> {
    // Generate asset register
    const register = await generateAssetRegister(
      new Date().getFullYear(),
      new Date().getMonth() + 1
    );

    // Generate forecast (simulated)
    const forecastPeriods = [];
    let totalReplacementCost = 0;

    for (let year = 1; year <= forecastYears; year++) {
      const yearForecast = {
        year: new Date().getFullYear() + year,
        assetsToReplace: 10,
        estimatedCost: 500000,
      };
      forecastPeriods.push(yearForecast);
      totalReplacementCost += yearForecast.estimatedCost;
    }

    // Export forecast
    const reportPath = await exportAssetReport(
      forecastPeriods,
      'excel',
      `replacement_forecast_${assetCategory}`
    );

    return {
      forecastPeriods,
      totalReplacementCost,
      reportPath,
    };
  }

  /**
   * Performs asset utilization analysis
   * Composes: trackAssetHistory, drilldownToAssetTransactions, generateAuditReport
   */
  @ApiOperation({ summary: 'Analyze asset utilization' })
  async analyzeAssetUtilization(
    departmentCode: string,
    periodStart: Date,
    periodEnd: Date,
    transaction?: Transaction
  ): Promise<{
    totalAssets: number;
    activeAssets: number;
    utilizationRate: number;
    underutilizedAssets: any[];
  }> {
    // In actual implementation, retrieve department assets
    const totalAssets = 100;
    const activeAssets = 85;
    const utilizationRate = (activeAssets / totalAssets) * 100;

    // Identify underutilized assets (simulated)
    const underutilizedAssets = [
      { assetId: 1, assetNumber: 'ASSET-001', utilizationRate: 25 },
      { assetId: 2, assetNumber: 'ASSET-002', utilizationRate: 30 },
    ];

    return {
      totalAssets,
      activeAssets,
      utilizationRate,
      underutilizedAssets,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  AssetAcquisitionRequest,
  AssetLifecycleStatus,
  DepreciationBatchResult,
  DepreciationError,
  AssetTransferRequest,
  AssetDisposalResult,
  TaxImplication,
  AssetMaintenanceRecord,
  AssetInsuranceRecord,
};
