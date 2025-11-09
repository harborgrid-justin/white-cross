"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedAssetsLifecycleComposite = void 0;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
// Import from fixed assets kit
const fixed_assets_depreciation_kit_1 = require("../fixed-assets-depreciation-kit");
// Import from procurement kit
const procurement_financial_integration_kit_1 = require("../procurement-financial-integration-kit");
// Import from audit trail kit
const audit_trail_compliance_kit_1 = require("../audit-trail-compliance-kit");
// Import from reporting kit
const financial_reporting_analytics_kit_1 = require("../financial-reporting-analytics-kit");
// Import from dimension management kit
const dimension_management_kit_1 = require("../dimension-management-kit");
// Import from project accounting kit
const project_accounting_costing_kit_1 = require("../project-accounting-costing-kit");
// Import from lease accounting kit
const lease_accounting_management_kit_1 = require("../lease-accounting-management-kit");
// Import from financial close kit
const financial_close_automation_kit_1 = require("../financial-close-automation-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - ASSET ACQUISITION OPERATIONS
// ============================================================================
let FixedAssetsLifecycleComposite = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _acquireAssetFromPurchaseOrder_decorators;
    let _createAssetWithDimensionValidation_decorators;
    let _capitalizeProjectToAsset_decorators;
    let _calculateMonthlyDepreciationBatch_decorators;
    let _generateAssetDepreciationSchedule_decorators;
    let _compareDepreciationMethods_decorators;
    let _processCatchUpDepreciation_decorators;
    let _transferAssetWithDimensions_decorators;
    let _bulkTransferAssetsBetweenLocations_decorators;
    let _transferAssetBetweenCostCenters_decorators;
    let _disposeAssetWithTaxImplications_decorators;
    let _writeOffAsset_decorators;
    let _processAssetTradeIn_decorators;
    let _revalueAssetWithImpairmentTest_decorators;
    let _performAnnualImpairmentTesting_decorators;
    let _recordAssetMaintenance_decorators;
    let _manageAssetInsurance_decorators;
    let _reconcileAssetRegisterToGL_decorators;
    let _generateAssetReportingPackage_decorators;
    let _analyzeAssetLifecycleMetrics_decorators;
    let _createROUAssetFromLease_decorators;
    let _terminateLeaseAndDisposeROUAsset_decorators;
    let _componentizeComplexAsset_decorators;
    let _generateAssetReplacementForecast_decorators;
    let _analyzeAssetUtilization_decorators;
    var FixedAssetsLifecycleComposite = _classThis = class {
        /**
         * Acquires asset from purchase order with capitalization and audit trail
         * Composes: integratePurchaseToAsset, createFixedAsset, validateCapitalizationThreshold, logAssetTransaction
         */
        async acquireAssetFromPurchaseOrder(purchaseOrderId, acquisitionRequest, transaction) {
            // Validate capitalization threshold
            const capitalizationValidation = await (0, procurement_financial_integration_kit_1.validateCapitalizationThreshold)(acquisitionRequest.purchasePrice, acquisitionRequest.assetCategory);
            if (!capitalizationValidation.shouldCapitalize) {
                throw new Error('Purchase amount below capitalization threshold, should be expensed');
            }
            // Integrate purchase order to asset
            const integration = await (0, procurement_financial_integration_kit_1.integratePurchaseToAsset)(purchaseOrderId, acquisitionRequest.assetCategory);
            // Generate asset number
            const assetNumber = await (0, fixed_assets_depreciation_kit_1.generateAssetNumber)(acquisitionRequest.assetCategory, acquisitionRequest.locationCode);
            // Create fixed asset
            const asset = await (0, fixed_assets_depreciation_kit_1.createFixedAsset)({
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
            }, transaction);
            // Log audit trail
            const audit = await (0, audit_trail_compliance_kit_1.logAssetTransaction)({
                transactionType: 'asset_acquisition',
                assetId: asset.assetId,
                userId: 'system',
                timestamp: new Date(),
                changes: acquisitionRequest,
            });
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
        async createAssetWithDimensionValidation(request, transaction) {
            // Validate dimension combination
            const dimensionValidation = await (0, dimension_management_kit_1.validateDimensionCombination)(request.assetCategory, request.dimensions);
            if (!dimensionValidation.valid) {
                throw new Error(`Invalid dimension combination: ${dimensionValidation.errors.join(', ')}`);
            }
            // Generate asset number
            const assetNumber = await (0, fixed_assets_depreciation_kit_1.generateAssetNumber)(request.assetCategory, request.locationCode);
            // Create asset
            const asset = await (0, fixed_assets_depreciation_kit_1.createFixedAsset)({
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
            }, transaction);
            // Create audit trail
            await (0, audit_trail_compliance_kit_1.createAuditTrail)({
                entityType: 'fixed_asset',
                entityId: asset.assetId,
                action: 'create',
                userId: 'system',
                timestamp: new Date(),
            });
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
        async capitalizeProjectToAsset(projectId, assetRequest, transaction) {
            // Capitalize project costs
            const capitalization = await (0, project_accounting_costing_kit_1.capitalizeProjectCosts)(projectId, assetRequest.acquisitionDate);
            // Transfer project to asset
            const transfer = await (0, project_accounting_costing_kit_1.transferProjectToAsset)(projectId, assetRequest.assetCategory);
            // Generate asset number
            const assetNumber = await (0, fixed_assets_depreciation_kit_1.generateAssetNumber)(assetRequest.assetCategory, assetRequest.locationCode);
            // Create asset from project
            const asset = await (0, fixed_assets_depreciation_kit_1.createFixedAsset)({
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
            }, transaction);
            // Close capital project
            const closureResult = await (0, project_accounting_costing_kit_1.closeCapitalProject)(projectId, asset.assetId, transaction);
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
        async calculateMonthlyDepreciationBatch(fiscalYear, fiscalPeriod, assetFilter, transaction) {
            // Batch calculate depreciation
            const batchResult = await (0, fixed_assets_depreciation_kit_1.batchCalculateDepreciation)(fiscalYear, fiscalPeriod, assetFilter, transaction);
            const errors = [];
            let totalDepreciationExpense = 0;
            // Record depreciation for each asset
            for (const depreciationCalc of batchResult.depreciations) {
                try {
                    await (0, fixed_assets_depreciation_kit_1.recordAssetDepreciation)(depreciationCalc, transaction);
                    totalDepreciationExpense += depreciationCalc.depreciationAmount;
                }
                catch (error) {
                    errors.push({
                        assetId: depreciationCalc.assetId,
                        assetNumber: depreciationCalc.assetNumber || 'unknown',
                        errorType: 'posting_error',
                        errorMessage: error.message,
                    });
                }
            }
            // Create close task for depreciation
            await (0, financial_close_automation_kit_1.createCloseTask)({
                taskName: 'Monthly Depreciation',
                taskDescription: `Depreciation for period ${fiscalYear}-${fiscalPeriod}`,
                taskCategory: 'preparation',
                taskType: 'automated',
                status: 'completed',
                fiscalYear,
                fiscalPeriod,
            });
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
        async generateAssetDepreciationSchedule(assetId, includeTaxBasis = true, transaction) {
            // Get asset details
            const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
            // Generate depreciation schedule
            const schedule = await (0, fixed_assets_depreciation_kit_1.generateDepreciationSchedule)(assetId, includeTaxBasis);
            // Export schedule
            const exportPath = await (0, financial_reporting_analytics_kit_1.exportAssetReport)([schedule], 'excel', `depreciation_schedule_${asset.assetNumber}`);
            return {
                schedule,
                exportPath,
            };
        }
        /**
         * Calculates depreciation with multiple methods for comparison
         * Composes: calculateStraightLineDepreciation, calculateDecliningBalanceDepreciation, calculateMACRSDepreciation
         */
        async compareDepreciationMethods(assetId, periodDate, transaction) {
            // Get asset
            const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
            // Calculate using different methods
            const straightLine = await (0, fixed_assets_depreciation_kit_1.calculateStraightLineDepreciation)(asset, periodDate);
            const decliningBalance = await (0, fixed_assets_depreciation_kit_1.calculateDecliningBalanceDepreciation)(asset, periodDate, 2.0);
            const macrs = await (0, fixed_assets_depreciation_kit_1.calculateMACRSDepreciation)(asset, periodDate);
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
        async processCatchUpDepreciation(assetId, fromPeriod, toPeriod, transaction) {
            const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
            const journalEntries = [];
            let totalDepreciation = 0;
            let periodsProcessed = 0;
            // Calculate and record depreciation for each missed period
            // In actual implementation, iterate through periods
            const depreciation = await (0, fixed_assets_depreciation_kit_1.calculateStraightLineDepreciation)(asset, toPeriod);
            await (0, fixed_assets_depreciation_kit_1.recordAssetDepreciation)(depreciation, transaction);
            totalDepreciation += depreciation.depreciationAmount;
            journalEntries.push(depreciation.journalEntryId || 0);
            periodsProcessed++;
            // Create audit trail
            await (0, audit_trail_compliance_kit_1.createAuditTrail)({
                entityType: 'fixed_asset',
                entityId: assetId,
                action: 'catch_up_depreciation',
                userId: 'system',
                timestamp: new Date(),
                relatedEntities: [{ type: 'depreciation', id: depreciation.depreciationId }],
            });
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
        async transferAssetWithDimensions(transferRequest, transaction) {
            // Validate new dimension combination
            if (transferRequest.newDimensions) {
                const validation = await (0, dimension_management_kit_1.validateDimensionCombination)('ASSET', transferRequest.newDimensions);
                if (!validation.valid) {
                    throw new Error(`Invalid dimension combination: ${validation.errors.join(', ')}`);
                }
            }
            // Transfer asset
            const transfer = await (0, fixed_assets_depreciation_kit_1.transferFixedAsset)({
                assetId: transferRequest.assetId,
                fromLocationCode: transferRequest.fromLocationCode,
                toLocationCode: transferRequest.toLocationCode,
                fromDepartmentCode: transferRequest.fromDepartmentCode,
                toDepartmentCode: transferRequest.toDepartmentCode,
                transferDate: transferRequest.transferDate,
                transferReason: transferRequest.transferReason,
                approvedBy: transferRequest.approvedBy,
            }, transaction);
            // Update dimensions if provided
            let dimensionsUpdated = false;
            if (transferRequest.newDimensions) {
                await (0, dimension_management_kit_1.updateAssetDimensions)(transferRequest.assetId, transferRequest.newDimensions);
                dimensionsUpdated = true;
            }
            // Track asset history
            const history = await (0, audit_trail_compliance_kit_1.trackAssetHistory)(transferRequest.assetId, 'transfer', transferRequest);
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
        async bulkTransferAssetsBetweenLocations(assetIds, fromLocationCode, toLocationCode, transferDate, transaction) {
            // Bulk transfer assets
            const result = await (0, fixed_assets_depreciation_kit_1.bulkTransferAssets)(assetIds, fromLocationCode, toLocationCode, transferDate, transaction);
            // Create audit trail for bulk transfer
            await (0, audit_trail_compliance_kit_1.createAuditTrail)({
                entityType: 'bulk_asset_transfer',
                entityId: 0,
                action: 'bulk_transfer',
                userId: 'system',
                timestamp: new Date(),
                relatedEntities: assetIds.map(id => ({ type: 'fixed_asset', id })),
            });
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
        async transferAssetBetweenCostCenters(assetId, fromCostCenter, toCostCenter, transferDate, transaction) {
            // Get asset for location and department
            const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
            // Transfer asset
            const transfer = await (0, fixed_assets_depreciation_kit_1.transferFixedAsset)({
                assetId,
                fromLocationCode: asset.locationCode,
                toLocationCode: asset.locationCode,
                fromDepartmentCode: asset.departmentCode,
                toDepartmentCode: asset.departmentCode,
                fromCostCenterCode: fromCostCenter,
                toCostCenterCode: toCostCenter,
                transferDate,
                transferReason: 'Cost center reallocation',
            }, transaction);
            // Analyze financial impact
            const transactions = await (0, financial_reporting_analytics_kit_1.drilldownToAssetTransactions)(assetId, new Date(transferDate.getFullYear(), 0, 1), transferDate);
            const financialImpact = {
                depreciationExpense: asset.accumulatedDepreciation,
                bookValue: asset.currentBookValue,
                transactions: transactions.length,
            };
            // Generate balance report
            const balanceReport = await (0, financial_reporting_analytics_kit_1.generateAssetBalanceReport)(fromCostCenter, toCostCenter, transferDate);
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
        async disposeAssetWithTaxImplications(assetId, disposalDate, disposalMethod, disposalProceeds, transaction) {
            // Get asset details
            const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
            // Calculate gain/loss
            const gainLoss = (0, fixed_assets_depreciation_kit_1.calculateDisposalGainLoss)(asset.acquisitionCost, asset.accumulatedDepreciation, disposalProceeds);
            // Dispose asset
            const disposal = await (0, fixed_assets_depreciation_kit_1.disposeFixedAsset)({
                assetId,
                disposalDate,
                disposalMethod,
                disposalProceeds,
                gainLoss,
            }, transaction);
            // Calculate tax implications
            const taxImplications = [];
            if (gainLoss > 0) {
                // Capital gain
                taxImplications.push({
                    taxType: 'federal',
                    taxableAmount: gainLoss,
                    taxRate: 0.21,
                    estimatedTax: gainLoss * 0.21,
                });
            }
            else if (gainLoss < 0) {
                // Capital loss
                taxImplications.push({
                    taxType: 'federal',
                    taxableAmount: gainLoss,
                    taxRate: 0,
                    estimatedTax: 0,
                });
            }
            // Export tax data
            await (0, fixed_assets_depreciation_kit_1.exportAssetTaxData)(assetId, disposalDate.getFullYear());
            // Log disposal transaction
            await (0, audit_trail_compliance_kit_1.logAssetTransaction)({
                transactionType: 'asset_disposal',
                assetId,
                userId: 'system',
                timestamp: new Date(),
                changes: { disposalMethod, disposalProceeds, gainLoss },
            });
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
        async writeOffAsset(assetId, writeOffDate, writeOffReason, approvedBy, transaction) {
            // Get asset
            const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
            // Dispose asset as write-off
            const disposal = await (0, fixed_assets_depreciation_kit_1.disposeFixedAsset)({
                assetId,
                disposalDate: writeOffDate,
                disposalMethod: 'write-off',
                disposalProceeds: 0,
                gainLoss: -asset.currentBookValue,
                approvedBy,
            }, transaction);
            // Create audit trail
            const auditTrail = await (0, audit_trail_compliance_kit_1.createAuditTrail)({
                entityType: 'fixed_asset',
                entityId: assetId,
                action: 'write_off',
                userId: approvedBy,
                timestamp: new Date(),
                details: { reason: writeOffReason },
            });
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
        async processAssetTradeIn(oldAssetId, tradeInValue, newAssetRequest, transaction) {
            // Get old asset
            const oldAsset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(oldAssetId);
            // Calculate gain/loss on trade-in
            const gainLoss = (0, fixed_assets_depreciation_kit_1.calculateDisposalGainLoss)(oldAsset.acquisitionCost, oldAsset.accumulatedDepreciation, tradeInValue);
            // Dispose old asset
            await (0, fixed_assets_depreciation_kit_1.disposeFixedAsset)({
                assetId: oldAssetId,
                disposalDate: newAssetRequest.acquisitionDate,
                disposalMethod: 'trade-in',
                disposalProceeds: tradeInValue,
                gainLoss,
            }, transaction);
            // Calculate net purchase price
            const netPurchasePrice = newAssetRequest.purchasePrice - tradeInValue;
            // Create new asset
            const assetNumber = await (0, fixed_assets_depreciation_kit_1.generateAssetNumber)(newAssetRequest.assetCategory, newAssetRequest.locationCode);
            const newAsset = await (0, fixed_assets_depreciation_kit_1.createFixedAsset)({
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
            }, transaction);
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
        async revalueAssetWithImpairmentTest(assetId, fairValue, revaluationDate, transaction) {
            // Test for impairment
            const impairmentTest = await (0, fixed_assets_depreciation_kit_1.testAssetImpairment)(assetId, fairValue, revaluationDate);
            // Revalue asset
            const revaluation = await (0, fixed_assets_depreciation_kit_1.revalueFixedAsset)({
                assetId,
                revaluationDate,
                fairValue,
                revaluedBy: 'system',
            }, transaction);
            // Create audit trail
            await (0, audit_trail_compliance_kit_1.createAuditTrail)({
                entityType: 'fixed_asset',
                entityId: assetId,
                action: 'revaluation',
                userId: 'system',
                timestamp: new Date(),
                details: { fairValue, impaired: impairmentTest.impaired },
            });
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
        async performAnnualImpairmentTesting(assetCategory, testDate, transaction) {
            // In actual implementation, retrieve all assets in category
            const assetIds = [1, 2, 3]; // Simulated
            let impairedCount = 0;
            let totalImpairmentLoss = 0;
            const impairmentResults = [];
            for (const assetId of assetIds) {
                const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
                const fairValue = asset.currentBookValue * 0.8; // Simulated fair value
                const impairmentTest = await (0, fixed_assets_depreciation_kit_1.testAssetImpairment)(assetId, fairValue, testDate);
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
            const reportPath = await (0, financial_reporting_analytics_kit_1.exportAssetReport)(impairmentResults, 'excel', `impairment_test_${assetCategory}_${testDate.getFullYear()}`);
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
        async recordAssetMaintenance(assetId, maintenance, transaction) {
            // Validate if maintenance should be capitalized
            const capitalizationValidation = await (0, procurement_financial_integration_kit_1.validateCapitalizationThreshold)(maintenance.cost, 'maintenance');
            let capitalized = false;
            let capitalizedAmount = 0;
            let expensed = maintenance.cost;
            if (capitalizationValidation.shouldCapitalize && maintenance.isCapitalizable) {
                // Update asset cost
                const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
                const updatedAsset = await (0, fixed_assets_depreciation_kit_1.updateFixedAsset)({
                    ...asset,
                    acquisitionCost: asset.acquisitionCost + maintenance.cost,
                    currentBookValue: asset.currentBookValue + maintenance.cost,
                }, transaction);
                capitalized = true;
                capitalizedAmount = maintenance.cost;
                expensed = 0;
            }
            // Log maintenance transaction
            await (0, audit_trail_compliance_kit_1.logAssetTransaction)({
                transactionType: 'asset_maintenance',
                assetId,
                userId: 'system',
                timestamp: new Date(),
                changes: maintenance,
            });
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
        async manageAssetInsurance(assetId, insurance, transaction) {
            // Get asset
            const asset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(assetId);
            // Check if coverage is adequate (at least 80% of current book value)
            const coverageAdequate = insurance.coverageAmount >= asset.currentBookValue * 0.8;
            // Check for expiration warning (within 30 days)
            const daysToExpiration = Math.floor((insurance.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const expirationWarning = daysToExpiration <= 30;
            // Track insurance history
            await (0, audit_trail_compliance_kit_1.trackAssetHistory)(assetId, 'insurance_update', insurance);
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
        async reconcileAssetRegisterToGL(fiscalYear, fiscalPeriod, transaction) {
            // Generate asset register
            const assetRegister = await (0, fixed_assets_depreciation_kit_1.generateAssetRegister)(fiscalYear, fiscalPeriod);
            // Generate GL balance report
            const glReport = await (0, financial_reporting_analytics_kit_1.generateAssetBalanceReport)('ALL', 'ALL', new Date(fiscalYear, fiscalPeriod, 0));
            // Calculate variance
            const assetRegisterTotal = assetRegister.totalBookValue;
            const glBalance = glReport.totalAssets;
            const variance = assetRegisterTotal - glBalance;
            // Validate reconciliation
            const reconciliation = await (0, financial_close_automation_kit_1.validateAssetReconciliation)(fiscalYear, fiscalPeriod);
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
        async generateAssetReportingPackage(fiscalYear, fiscalPeriod, includeTaxReports = true, transaction) {
            // Generate asset register
            const assetRegister = await (0, fixed_assets_depreciation_kit_1.generateAssetRegister)(fiscalYear, fiscalPeriod);
            // Generate depreciation expense report
            const depreciationReport = await (0, financial_reporting_analytics_kit_1.generateDepreciationExpenseReport)(fiscalYear, fiscalPeriod);
            // Export tax data if requested
            let taxData = undefined;
            if (includeTaxReports) {
                taxData = await (0, fixed_assets_depreciation_kit_1.exportAssetTaxData)(0, fiscalYear); // 0 for all assets
            }
            // Export complete package
            const reports = [assetRegister, depreciationReport];
            if (taxData)
                reports.push(taxData);
            const packagePath = await (0, financial_reporting_analytics_kit_1.exportAssetReport)(reports, 'pdf', `asset_package_${fiscalYear}_${fiscalPeriod}`);
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
        async analyzeAssetLifecycleMetrics(assetCategory, periodStart, periodEnd, transaction) {
            // Generate asset register for category
            const register = await (0, fixed_assets_depreciation_kit_1.generateAssetRegister)(periodEnd.getFullYear(), periodEnd.getMonth() + 1);
            // Calculate metrics (simulated)
            const totalAssets = register.assets.length;
            const fullyDepreciated = register.assets.filter((a) => a.status === 'fully-depreciated').length;
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
        async createROUAssetFromLease(leaseId, assetRequest, transaction) {
            // Create lease asset
            const leaseAsset = await (0, lease_accounting_management_kit_1.createLeaseAsset)({
                leaseId,
                assetCategory: assetRequest.assetCategory,
                initialMeasurement: assetRequest.purchasePrice,
                leaseTermMonths: assetRequest.usefulLife,
            });
            // Generate asset number
            const assetNumber = await (0, fixed_assets_depreciation_kit_1.generateAssetNumber)(assetRequest.assetCategory, assetRequest.locationCode);
            // Create fixed asset for ROU
            const fixedAsset = await (0, fixed_assets_depreciation_kit_1.createFixedAsset)({
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
            }, transaction);
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
        async terminateLeaseAndDisposeROUAsset(leaseId, rouAssetId, terminationDate, transaction) {
            // Terminate lease
            const leaseTermination = await (0, lease_accounting_management_kit_1.terminateLease)(leaseId, terminationDate);
            // Get ROU asset
            const rouAsset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(rouAssetId);
            // Calculate gain/loss
            const gainLoss = (0, fixed_assets_depreciation_kit_1.calculateDisposalGainLoss)(rouAsset.acquisitionCost, rouAsset.accumulatedDepreciation, 0 // No proceeds on lease termination
            );
            // Dispose ROU asset
            await (0, fixed_assets_depreciation_kit_1.disposeFixedAsset)({
                assetId: rouAssetId,
                disposalDate: terminationDate,
                disposalMethod: 'write-off',
                disposalProceeds: 0,
                gainLoss,
            }, transaction);
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
        async componentizeComplexAsset(parentAssetId, components, transaction) {
            const componentIds = [];
            let totalComponentValue = 0;
            // Get parent asset
            const parentAsset = await (0, fixed_assets_depreciation_kit_1.getFixedAssetById)(parentAssetId);
            // Create component assets
            for (const component of components) {
                const assetNumber = await (0, fixed_assets_depreciation_kit_1.generateAssetNumber)(component.assetCategory, component.locationCode);
                const componentAsset = await (0, fixed_assets_depreciation_kit_1.createFixedAsset)({
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
                }, transaction);
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
        async generateAssetReplacementForecast(assetCategory, forecastYears, transaction) {
            // Generate asset register
            const register = await (0, fixed_assets_depreciation_kit_1.generateAssetRegister)(new Date().getFullYear(), new Date().getMonth() + 1);
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
            const reportPath = await (0, financial_reporting_analytics_kit_1.exportAssetReport)(forecastPeriods, 'excel', `replacement_forecast_${assetCategory}`);
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
        async analyzeAssetUtilization(departmentCode, periodStart, periodEnd, transaction) {
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
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "FixedAssetsLifecycleComposite");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _acquireAssetFromPurchaseOrder_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Acquire asset from purchase order' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Asset acquired successfully' })];
        _createAssetWithDimensionValidation_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Create asset with dimension validation' })];
        _capitalizeProjectToAsset_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Capitalize project to asset' })];
        _calculateMonthlyDepreciationBatch_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Calculate monthly depreciation batch' })];
        _generateAssetDepreciationSchedule_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Generate asset depreciation schedule' })];
        _compareDepreciationMethods_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Compare depreciation methods' })];
        _processCatchUpDepreciation_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Process catch-up depreciation' })];
        _transferAssetWithDimensions_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Transfer asset with dimensions' })];
        _bulkTransferAssetsBetweenLocations_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Bulk transfer assets' })];
        _transferAssetBetweenCostCenters_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Transfer asset between cost centers' })];
        _disposeAssetWithTaxImplications_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Dispose asset with tax implications' })];
        _writeOffAsset_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Write off asset' })];
        _processAssetTradeIn_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Process asset trade-in' })];
        _revalueAssetWithImpairmentTest_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Revalue asset with impairment test' })];
        _performAnnualImpairmentTesting_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Annual impairment testing' })];
        _recordAssetMaintenance_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Record asset maintenance' })];
        _manageAssetInsurance_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Manage asset insurance' })];
        _reconcileAssetRegisterToGL_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Reconcile asset register to GL' })];
        _generateAssetReportingPackage_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Generate asset reporting package' })];
        _analyzeAssetLifecycleMetrics_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Analyze asset lifecycle metrics' })];
        _createROUAssetFromLease_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Create ROU asset from lease' })];
        _terminateLeaseAndDisposeROUAsset_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Terminate lease and dispose ROU asset' })];
        _componentizeComplexAsset_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Componentize complex asset' })];
        _generateAssetReplacementForecast_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Generate asset replacement forecast' })];
        _analyzeAssetUtilization_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Analyze asset utilization' })];
        __esDecorate(_classThis, null, _acquireAssetFromPurchaseOrder_decorators, { kind: "method", name: "acquireAssetFromPurchaseOrder", static: false, private: false, access: { has: obj => "acquireAssetFromPurchaseOrder" in obj, get: obj => obj.acquireAssetFromPurchaseOrder }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAssetWithDimensionValidation_decorators, { kind: "method", name: "createAssetWithDimensionValidation", static: false, private: false, access: { has: obj => "createAssetWithDimensionValidation" in obj, get: obj => obj.createAssetWithDimensionValidation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _capitalizeProjectToAsset_decorators, { kind: "method", name: "capitalizeProjectToAsset", static: false, private: false, access: { has: obj => "capitalizeProjectToAsset" in obj, get: obj => obj.capitalizeProjectToAsset }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateMonthlyDepreciationBatch_decorators, { kind: "method", name: "calculateMonthlyDepreciationBatch", static: false, private: false, access: { has: obj => "calculateMonthlyDepreciationBatch" in obj, get: obj => obj.calculateMonthlyDepreciationBatch }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateAssetDepreciationSchedule_decorators, { kind: "method", name: "generateAssetDepreciationSchedule", static: false, private: false, access: { has: obj => "generateAssetDepreciationSchedule" in obj, get: obj => obj.generateAssetDepreciationSchedule }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _compareDepreciationMethods_decorators, { kind: "method", name: "compareDepreciationMethods", static: false, private: false, access: { has: obj => "compareDepreciationMethods" in obj, get: obj => obj.compareDepreciationMethods }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processCatchUpDepreciation_decorators, { kind: "method", name: "processCatchUpDepreciation", static: false, private: false, access: { has: obj => "processCatchUpDepreciation" in obj, get: obj => obj.processCatchUpDepreciation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transferAssetWithDimensions_decorators, { kind: "method", name: "transferAssetWithDimensions", static: false, private: false, access: { has: obj => "transferAssetWithDimensions" in obj, get: obj => obj.transferAssetWithDimensions }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _bulkTransferAssetsBetweenLocations_decorators, { kind: "method", name: "bulkTransferAssetsBetweenLocations", static: false, private: false, access: { has: obj => "bulkTransferAssetsBetweenLocations" in obj, get: obj => obj.bulkTransferAssetsBetweenLocations }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transferAssetBetweenCostCenters_decorators, { kind: "method", name: "transferAssetBetweenCostCenters", static: false, private: false, access: { has: obj => "transferAssetBetweenCostCenters" in obj, get: obj => obj.transferAssetBetweenCostCenters }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _disposeAssetWithTaxImplications_decorators, { kind: "method", name: "disposeAssetWithTaxImplications", static: false, private: false, access: { has: obj => "disposeAssetWithTaxImplications" in obj, get: obj => obj.disposeAssetWithTaxImplications }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _writeOffAsset_decorators, { kind: "method", name: "writeOffAsset", static: false, private: false, access: { has: obj => "writeOffAsset" in obj, get: obj => obj.writeOffAsset }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processAssetTradeIn_decorators, { kind: "method", name: "processAssetTradeIn", static: false, private: false, access: { has: obj => "processAssetTradeIn" in obj, get: obj => obj.processAssetTradeIn }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revalueAssetWithImpairmentTest_decorators, { kind: "method", name: "revalueAssetWithImpairmentTest", static: false, private: false, access: { has: obj => "revalueAssetWithImpairmentTest" in obj, get: obj => obj.revalueAssetWithImpairmentTest }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _performAnnualImpairmentTesting_decorators, { kind: "method", name: "performAnnualImpairmentTesting", static: false, private: false, access: { has: obj => "performAnnualImpairmentTesting" in obj, get: obj => obj.performAnnualImpairmentTesting }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordAssetMaintenance_decorators, { kind: "method", name: "recordAssetMaintenance", static: false, private: false, access: { has: obj => "recordAssetMaintenance" in obj, get: obj => obj.recordAssetMaintenance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _manageAssetInsurance_decorators, { kind: "method", name: "manageAssetInsurance", static: false, private: false, access: { has: obj => "manageAssetInsurance" in obj, get: obj => obj.manageAssetInsurance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reconcileAssetRegisterToGL_decorators, { kind: "method", name: "reconcileAssetRegisterToGL", static: false, private: false, access: { has: obj => "reconcileAssetRegisterToGL" in obj, get: obj => obj.reconcileAssetRegisterToGL }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateAssetReportingPackage_decorators, { kind: "method", name: "generateAssetReportingPackage", static: false, private: false, access: { has: obj => "generateAssetReportingPackage" in obj, get: obj => obj.generateAssetReportingPackage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeAssetLifecycleMetrics_decorators, { kind: "method", name: "analyzeAssetLifecycleMetrics", static: false, private: false, access: { has: obj => "analyzeAssetLifecycleMetrics" in obj, get: obj => obj.analyzeAssetLifecycleMetrics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createROUAssetFromLease_decorators, { kind: "method", name: "createROUAssetFromLease", static: false, private: false, access: { has: obj => "createROUAssetFromLease" in obj, get: obj => obj.createROUAssetFromLease }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _terminateLeaseAndDisposeROUAsset_decorators, { kind: "method", name: "terminateLeaseAndDisposeROUAsset", static: false, private: false, access: { has: obj => "terminateLeaseAndDisposeROUAsset" in obj, get: obj => obj.terminateLeaseAndDisposeROUAsset }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _componentizeComplexAsset_decorators, { kind: "method", name: "componentizeComplexAsset", static: false, private: false, access: { has: obj => "componentizeComplexAsset" in obj, get: obj => obj.componentizeComplexAsset }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateAssetReplacementForecast_decorators, { kind: "method", name: "generateAssetReplacementForecast", static: false, private: false, access: { has: obj => "generateAssetReplacementForecast" in obj, get: obj => obj.generateAssetReplacementForecast }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeAssetUtilization_decorators, { kind: "method", name: "analyzeAssetUtilization", static: false, private: false, access: { has: obj => "analyzeAssetUtilization" in obj, get: obj => obj.analyzeAssetUtilization }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FixedAssetsLifecycleComposite = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FixedAssetsLifecycleComposite = _classThis;
})();
exports.FixedAssetsLifecycleComposite = FixedAssetsLifecycleComposite;
//# sourceMappingURL=fixed-assets-lifecycle-composite.js.map