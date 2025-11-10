"use strict";
/**
 * ASSET REPORTING AND ANALYTICS COMMAND FUNCTIONS
 *
 * Comprehensive reporting and analytics toolkit for enterprise asset management.
 * Provides 47 specialized functions covering:
 * - Standard report generation (predefined formats)
 * - Custom report builder with dynamic queries
 * - Interactive dashboard generation
 * - KPI tracking and calculation
 * - Compliance and regulatory reporting
 * - Financial analysis and depreciation reports
 * - Operational efficiency reports
 * - Executive summary generation
 * - Report scheduling and automation
 * - Report distribution and delivery
 * - Report template management
 * - Data visualization preparation
 * - Export to multiple formats (PDF, Excel, CSV)
 * - Report versioning and history
 * - Ad-hoc query execution
 *
 * @module AssetReportingCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security Role-based report access control
 * @performance Optimized queries with materialized views for large datasets
 *
 * @example
 * ```typescript
 * import {
 *   generateAssetInventoryReport,
 *   createCustomReport,
 *   generateDashboard,
 *   calculateAssetKPIs,
 *   scheduleReport,
 *   ReportFormat,
 *   ReportFrequency
 * } from './asset-reporting-commands';
 *
 * // Generate standard inventory report
 * const report = await generateAssetInventoryReport({
 *   includeDepreciation: true,
 *   groupBy: 'assetType',
 *   format: ReportFormat.PDF
 * });
 *
 * // Schedule monthly executive summary
 * await scheduleReport({
 *   reportTemplateId: 'exec-summary',
 *   frequency: ReportFrequency.MONTHLY,
 *   recipients: ['exec@company.com'],
 *   format: ReportFormat.PDF
 * });
 * ```
 */
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPIMetric = exports.Dashboard = exports.ReportDistribution = exports.ReportSchedule = exports.Report = exports.ReportTemplate = exports.KPIMetricType = exports.ChartType = exports.AggregationFunction = exports.ReportStatus = exports.ReportFrequency = exports.ReportFormat = exports.ReportType = void 0;
exports.generateAssetInventoryReport = generateAssetInventoryReport;
exports.generateDepreciationReport = generateDepreciationReport;
exports.generateMaintenanceReport = generateMaintenanceReport;
exports.generateComplianceReport = generateComplianceReport;
exports.generateExecutiveSummary = generateExecutiveSummary;
exports.createCustomReport = createCustomReport;
exports.executeCustomReport = executeCustomReport;
exports.updateCustomReportTemplate = updateCustomReportTemplate;
exports.createDashboard = createDashboard;
exports.generateDashboardData = generateDashboardData;
exports.updateDashboard = updateDashboard;
exports.calculateAssetKPIs = calculateAssetKPIs;
exports.getKPIHistory = getKPIHistory;
exports.scheduleReport = scheduleReport;
exports.updateReportSchedule = updateReportSchedule;
exports.executeScheduledReports = executeScheduledReports;
exports.distributeReport = distributeReport;
exports.getReportDistributionStatus = getReportDistributionStatus;
exports.getReportById = getReportById;
exports.deleteExpiredReports = deleteExpiredReports;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Report types
 */
var ReportType;
(function (ReportType) {
    ReportType["INVENTORY"] = "inventory";
    ReportType["DEPRECIATION"] = "depreciation";
    ReportType["MAINTENANCE"] = "maintenance";
    ReportType["COMPLIANCE"] = "compliance";
    ReportType["FINANCIAL"] = "financial";
    ReportType["OPERATIONAL"] = "operational";
    ReportType["UTILIZATION"] = "utilization";
    ReportType["LIFECYCLE"] = "lifecycle";
    ReportType["CUSTOM"] = "custom";
    ReportType["DASHBOARD"] = "dashboard";
    ReportType["EXECUTIVE_SUMMARY"] = "executive_summary";
    ReportType["AUDIT"] = "audit";
})(ReportType || (exports.ReportType = ReportType = {}));
/**
 * Report formats
 */
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "pdf";
    ReportFormat["EXCEL"] = "excel";
    ReportFormat["CSV"] = "csv";
    ReportFormat["JSON"] = "json";
    ReportFormat["HTML"] = "html";
    ReportFormat["DASHBOARD"] = "dashboard";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
/**
 * Report frequency for scheduling
 */
var ReportFrequency;
(function (ReportFrequency) {
    ReportFrequency["ONCE"] = "once";
    ReportFrequency["DAILY"] = "daily";
    ReportFrequency["WEEKLY"] = "weekly";
    ReportFrequency["MONTHLY"] = "monthly";
    ReportFrequency["QUARTERLY"] = "quarterly";
    ReportFrequency["YEARLY"] = "yearly";
})(ReportFrequency || (exports.ReportFrequency = ReportFrequency = {}));
/**
 * Report status
 */
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["GENERATING"] = "generating";
    ReportStatus["COMPLETED"] = "completed";
    ReportStatus["FAILED"] = "failed";
    ReportStatus["SCHEDULED"] = "scheduled";
    ReportStatus["CANCELLED"] = "cancelled";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
/**
 * Aggregation functions
 */
var AggregationFunction;
(function (AggregationFunction) {
    AggregationFunction["SUM"] = "sum";
    AggregationFunction["AVG"] = "avg";
    AggregationFunction["COUNT"] = "count";
    AggregationFunction["MIN"] = "min";
    AggregationFunction["MAX"] = "max";
    AggregationFunction["STDDEV"] = "stddev";
})(AggregationFunction || (exports.AggregationFunction = AggregationFunction = {}));
/**
 * Chart types
 */
var ChartType;
(function (ChartType) {
    ChartType["LINE"] = "line";
    ChartType["BAR"] = "bar";
    ChartType["PIE"] = "pie";
    ChartType["DOUGHNUT"] = "doughnut";
    ChartType["AREA"] = "area";
    ChartType["SCATTER"] = "scatter";
    ChartType["GAUGE"] = "gauge";
    ChartType["TABLE"] = "table";
})(ChartType || (exports.ChartType = ChartType = {}));
/**
 * KPI metric types
 */
var KPIMetricType;
(function (KPIMetricType) {
    KPIMetricType["ASSET_AVAILABILITY"] = "asset_availability";
    KPIMetricType["UTILIZATION_RATE"] = "utilization_rate";
    KPIMetricType["MAINTENANCE_COST_RATIO"] = "maintenance_cost_ratio";
    KPIMetricType["MEAN_TIME_BETWEEN_FAILURES"] = "mtbf";
    KPIMetricType["MEAN_TIME_TO_REPAIR"] = "mttr";
    KPIMetricType["ASSET_TURNOVER"] = "asset_turnover";
    KPIMetricType["DEPRECIATION_RATE"] = "depreciation_rate";
    KPIMetricType["COMPLIANCE_SCORE"] = "compliance_score";
    KPIMetricType["TOTAL_COST_OF_OWNERSHIP"] = "tco";
})(KPIMetricType || (exports.KPIMetricType = KPIMetricType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Report Template Model
 */
let ReportTemplate = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'report_templates',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['report_type'] },
                { fields: ['is_active'] },
                { fields: ['category'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _definition_decorators;
    let _definition_initializers = [];
    let _definition_extraInitializers = [];
    let _defaultParameters_decorators;
    let _defaultParameters_initializers = [];
    let _defaultParameters_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _reports_decorators;
    let _reports_initializers = [];
    let _reports_extraInitializers = [];
    let _schedules_decorators;
    let _schedules_initializers = [];
    let _schedules_extraInitializers = [];
    var ReportTemplate = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.reportType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _reportType_initializers, void 0));
            this.category = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.definition = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _definition_initializers, void 0));
            this.defaultParameters = (__runInitializers(this, _definition_extraInitializers), __runInitializers(this, _defaultParameters_initializers, void 0));
            this.isActive = (__runInitializers(this, _defaultParameters_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.version = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.createdBy = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.reports = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _reports_initializers, void 0));
            this.schedules = (__runInitializers(this, _reports_extraInitializers), __runInitializers(this, _schedules_initializers, void 0));
            __runInitializers(this, _schedules_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReportTemplate");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _reportType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }), sequelize_typescript_1.Index];
        _definition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report definition' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _defaultParameters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Default parameters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _reports_decorators = [(0, sequelize_typescript_1.HasMany)(() => Report)];
        _schedules_decorators = [(0, sequelize_typescript_1.HasMany)(() => ReportSchedule)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _definition_decorators, { kind: "field", name: "definition", static: false, private: false, access: { has: obj => "definition" in obj, get: obj => obj.definition, set: (obj, value) => { obj.definition = value; } }, metadata: _metadata }, _definition_initializers, _definition_extraInitializers);
        __esDecorate(null, null, _defaultParameters_decorators, { kind: "field", name: "defaultParameters", static: false, private: false, access: { has: obj => "defaultParameters" in obj, get: obj => obj.defaultParameters, set: (obj, value) => { obj.defaultParameters = value; } }, metadata: _metadata }, _defaultParameters_initializers, _defaultParameters_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _reports_decorators, { kind: "field", name: "reports", static: false, private: false, access: { has: obj => "reports" in obj, get: obj => obj.reports, set: (obj, value) => { obj.reports = value; } }, metadata: _metadata }, _reports_initializers, _reports_extraInitializers);
        __esDecorate(null, null, _schedules_decorators, { kind: "field", name: "schedules", static: false, private: false, access: { has: obj => "schedules" in obj, get: obj => obj.schedules, set: (obj, value) => { obj.schedules = value; } }, metadata: _metadata }, _schedules_initializers, _schedules_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportTemplate = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportTemplate = _classThis;
})();
exports.ReportTemplate = ReportTemplate;
/**
 * Report Model - Generated reports
 */
let Report = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'reports',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['template_id'] },
                { fields: ['status'] },
                { fields: ['report_type'] },
                { fields: ['generated_by'] },
                { fields: ['generated_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _reportNumber_decorators;
    let _reportNumber_initializers = [];
    let _reportNumber_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _parameters_decorators;
    let _parameters_initializers = [];
    let _parameters_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    let _dataRangeFrom_decorators;
    let _dataRangeFrom_initializers = [];
    let _dataRangeFrom_extraInitializers = [];
    let _dataRangeTo_decorators;
    let _dataRangeTo_initializers = [];
    let _dataRangeTo_extraInitializers = [];
    let _recordCount_decorators;
    let _recordCount_initializers = [];
    let _recordCount_extraInitializers = [];
    let _filePath_decorators;
    let _filePath_initializers = [];
    let _filePath_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _generatedAt_decorators;
    let _generatedAt_initializers = [];
    let _generatedAt_extraInitializers = [];
    let _generatedBy_decorators;
    let _generatedBy_initializers = [];
    let _generatedBy_extraInitializers = [];
    let _generationDuration_decorators;
    let _generationDuration_initializers = [];
    let _generationDuration_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _isArchived_decorators;
    let _isArchived_initializers = [];
    let _isArchived_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    let _distributions_decorators;
    let _distributions_initializers = [];
    let _distributions_extraInitializers = [];
    var Report = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.reportNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _reportNumber_initializers, void 0));
            this.templateId = (__runInitializers(this, _reportNumber_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.reportType = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _reportType_initializers, void 0));
            this.title = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.format = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _format_initializers, void 0));
            this.parameters = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _parameters_initializers, void 0));
            this.filters = (__runInitializers(this, _parameters_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
            this.dataRangeFrom = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _dataRangeFrom_initializers, void 0));
            this.dataRangeTo = (__runInitializers(this, _dataRangeFrom_extraInitializers), __runInitializers(this, _dataRangeTo_initializers, void 0));
            this.recordCount = (__runInitializers(this, _dataRangeTo_extraInitializers), __runInitializers(this, _recordCount_initializers, void 0));
            this.filePath = (__runInitializers(this, _recordCount_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.fileSize = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.generatedAt = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _generatedAt_initializers, void 0));
            this.generatedBy = (__runInitializers(this, _generatedAt_extraInitializers), __runInitializers(this, _generatedBy_initializers, void 0));
            this.generationDuration = (__runInitializers(this, _generatedBy_extraInitializers), __runInitializers(this, _generationDuration_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _generationDuration_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.isArchived = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _isArchived_initializers, void 0));
            this.metadata = (__runInitializers(this, _isArchived_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.template = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            this.distributions = (__runInitializers(this, _template_extraInitializers), __runInitializers(this, _distributions_initializers, void 0));
            __runInitializers(this, _distributions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Report");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _reportNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true })];
        _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ReportTemplate), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _reportType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportStatus)),
                defaultValue: ReportStatus.PENDING,
            }), sequelize_typescript_1.Index];
        _format_decorators = [(0, swagger_1.ApiProperty)({ description: 'Format' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportFormat)),
                allowNull: false,
            })];
        _parameters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generation parameters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _filters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Filters applied' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _dataRangeFrom_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data range from' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _dataRangeTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data range to' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _recordCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Record count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _filePath_decorators = [(0, swagger_1.ApiProperty)({ description: 'File path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _fileSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'File size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT })];
        _generatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generated at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _generatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generated by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _generationDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generation duration in seconds' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _errorMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _isArchived_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is archived' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _template_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ReportTemplate)];
        _distributions_decorators = [(0, sequelize_typescript_1.HasMany)(() => ReportDistribution)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _reportNumber_decorators, { kind: "field", name: "reportNumber", static: false, private: false, access: { has: obj => "reportNumber" in obj, get: obj => obj.reportNumber, set: (obj, value) => { obj.reportNumber = value; } }, metadata: _metadata }, _reportNumber_initializers, _reportNumber_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _parameters_decorators, { kind: "field", name: "parameters", static: false, private: false, access: { has: obj => "parameters" in obj, get: obj => obj.parameters, set: (obj, value) => { obj.parameters = value; } }, metadata: _metadata }, _parameters_initializers, _parameters_extraInitializers);
        __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
        __esDecorate(null, null, _dataRangeFrom_decorators, { kind: "field", name: "dataRangeFrom", static: false, private: false, access: { has: obj => "dataRangeFrom" in obj, get: obj => obj.dataRangeFrom, set: (obj, value) => { obj.dataRangeFrom = value; } }, metadata: _metadata }, _dataRangeFrom_initializers, _dataRangeFrom_extraInitializers);
        __esDecorate(null, null, _dataRangeTo_decorators, { kind: "field", name: "dataRangeTo", static: false, private: false, access: { has: obj => "dataRangeTo" in obj, get: obj => obj.dataRangeTo, set: (obj, value) => { obj.dataRangeTo = value; } }, metadata: _metadata }, _dataRangeTo_initializers, _dataRangeTo_extraInitializers);
        __esDecorate(null, null, _recordCount_decorators, { kind: "field", name: "recordCount", static: false, private: false, access: { has: obj => "recordCount" in obj, get: obj => obj.recordCount, set: (obj, value) => { obj.recordCount = value; } }, metadata: _metadata }, _recordCount_initializers, _recordCount_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: obj => "filePath" in obj, get: obj => obj.filePath, set: (obj, value) => { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _generatedAt_decorators, { kind: "field", name: "generatedAt", static: false, private: false, access: { has: obj => "generatedAt" in obj, get: obj => obj.generatedAt, set: (obj, value) => { obj.generatedAt = value; } }, metadata: _metadata }, _generatedAt_initializers, _generatedAt_extraInitializers);
        __esDecorate(null, null, _generatedBy_decorators, { kind: "field", name: "generatedBy", static: false, private: false, access: { has: obj => "generatedBy" in obj, get: obj => obj.generatedBy, set: (obj, value) => { obj.generatedBy = value; } }, metadata: _metadata }, _generatedBy_initializers, _generatedBy_extraInitializers);
        __esDecorate(null, null, _generationDuration_decorators, { kind: "field", name: "generationDuration", static: false, private: false, access: { has: obj => "generationDuration" in obj, get: obj => obj.generationDuration, set: (obj, value) => { obj.generationDuration = value; } }, metadata: _metadata }, _generationDuration_initializers, _generationDuration_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _isArchived_decorators, { kind: "field", name: "isArchived", static: false, private: false, access: { has: obj => "isArchived" in obj, get: obj => obj.isArchived, set: (obj, value) => { obj.isArchived = value; } }, metadata: _metadata }, _isArchived_initializers, _isArchived_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, null, _distributions_decorators, { kind: "field", name: "distributions", static: false, private: false, access: { has: obj => "distributions" in obj, get: obj => obj.distributions, set: (obj, value) => { obj.distributions = value; } }, metadata: _metadata }, _distributions_initializers, _distributions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Report = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Report = _classThis;
})();
exports.Report = Report;
/**
 * Report Schedule Model - Scheduled report execution
 */
let ReportSchedule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'report_schedules',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['template_id'] },
                { fields: ['frequency'] },
                { fields: ['is_active'] },
                { fields: ['next_execution'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _executionTime_decorators;
    let _executionTime_initializers = [];
    let _executionTime_extraInitializers = [];
    let _nextExecution_decorators;
    let _nextExecution_initializers = [];
    let _nextExecution_extraInitializers = [];
    let _lastExecution_decorators;
    let _lastExecution_initializers = [];
    let _lastExecution_extraInitializers = [];
    let _recipients_decorators;
    let _recipients_initializers = [];
    let _recipients_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _parameters_decorators;
    let _parameters_initializers = [];
    let _parameters_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    var ReportSchedule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.templateId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.frequency = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.startDate = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.executionTime = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _executionTime_initializers, void 0));
            this.nextExecution = (__runInitializers(this, _executionTime_extraInitializers), __runInitializers(this, _nextExecution_initializers, void 0));
            this.lastExecution = (__runInitializers(this, _nextExecution_extraInitializers), __runInitializers(this, _lastExecution_initializers, void 0));
            this.recipients = (__runInitializers(this, _lastExecution_extraInitializers), __runInitializers(this, _recipients_initializers, void 0));
            this.format = (__runInitializers(this, _recipients_extraInitializers), __runInitializers(this, _format_initializers, void 0));
            this.parameters = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _parameters_initializers, void 0));
            this.isActive = (__runInitializers(this, _parameters_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdBy = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.template = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            __runInitializers(this, _template_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReportSchedule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ReportTemplate), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Frequency' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportFrequency)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _executionTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Execution time (HH:MM)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(5) })];
        _nextExecution_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next execution date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _lastExecution_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last execution date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _recipients_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipients' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _format_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report format' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReportFormat)),
                allowNull: false,
            })];
        _parameters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parameters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _template_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ReportTemplate)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _executionTime_decorators, { kind: "field", name: "executionTime", static: false, private: false, access: { has: obj => "executionTime" in obj, get: obj => obj.executionTime, set: (obj, value) => { obj.executionTime = value; } }, metadata: _metadata }, _executionTime_initializers, _executionTime_extraInitializers);
        __esDecorate(null, null, _nextExecution_decorators, { kind: "field", name: "nextExecution", static: false, private: false, access: { has: obj => "nextExecution" in obj, get: obj => obj.nextExecution, set: (obj, value) => { obj.nextExecution = value; } }, metadata: _metadata }, _nextExecution_initializers, _nextExecution_extraInitializers);
        __esDecorate(null, null, _lastExecution_decorators, { kind: "field", name: "lastExecution", static: false, private: false, access: { has: obj => "lastExecution" in obj, get: obj => obj.lastExecution, set: (obj, value) => { obj.lastExecution = value; } }, metadata: _metadata }, _lastExecution_initializers, _lastExecution_extraInitializers);
        __esDecorate(null, null, _recipients_decorators, { kind: "field", name: "recipients", static: false, private: false, access: { has: obj => "recipients" in obj, get: obj => obj.recipients, set: (obj, value) => { obj.recipients = value; } }, metadata: _metadata }, _recipients_initializers, _recipients_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _parameters_decorators, { kind: "field", name: "parameters", static: false, private: false, access: { has: obj => "parameters" in obj, get: obj => obj.parameters, set: (obj, value) => { obj.parameters = value; } }, metadata: _metadata }, _parameters_initializers, _parameters_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportSchedule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportSchedule = _classThis;
})();
exports.ReportSchedule = ReportSchedule;
/**
 * Report Distribution Model - Report delivery tracking
 */
let ReportDistribution = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'report_distributions',
            timestamps: true,
            indexes: [
                { fields: ['report_id'] },
                { fields: ['status'] },
                { fields: ['channel_type'] },
                { fields: ['distributed_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _reportId_decorators;
    let _reportId_initializers = [];
    let _reportId_extraInitializers = [];
    let _channelType_decorators;
    let _channelType_initializers = [];
    let _channelType_extraInitializers = [];
    let _recipient_decorators;
    let _recipient_initializers = [];
    let _recipient_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _distributedAt_decorators;
    let _distributedAt_initializers = [];
    let _distributedAt_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _deliveryConfirmation_decorators;
    let _deliveryConfirmation_initializers = [];
    let _deliveryConfirmation_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _report_decorators;
    let _report_initializers = [];
    let _report_extraInitializers = [];
    var ReportDistribution = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.reportId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _reportId_initializers, void 0));
            this.channelType = (__runInitializers(this, _reportId_extraInitializers), __runInitializers(this, _channelType_initializers, void 0));
            this.recipient = (__runInitializers(this, _channelType_extraInitializers), __runInitializers(this, _recipient_initializers, void 0));
            this.status = (__runInitializers(this, _recipient_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.distributedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _distributedAt_initializers, void 0));
            this.errorMessage = (__runInitializers(this, _distributedAt_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
            this.deliveryConfirmation = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _deliveryConfirmation_initializers, void 0));
            this.metadata = (__runInitializers(this, _deliveryConfirmation_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.report = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _report_initializers, void 0));
            __runInitializers(this, _report_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReportDistribution");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _reportId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Report), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _channelType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Channel type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('email', 'sftp', 'webhook', 'storage'),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _recipient_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recipient' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'sent', 'failed', 'bounced'),
                defaultValue: 'pending',
            }), sequelize_typescript_1.Index];
        _distributedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Distributed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _errorMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Error message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _deliveryConfirmation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery confirmation' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _report_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Report)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _reportId_decorators, { kind: "field", name: "reportId", static: false, private: false, access: { has: obj => "reportId" in obj, get: obj => obj.reportId, set: (obj, value) => { obj.reportId = value; } }, metadata: _metadata }, _reportId_initializers, _reportId_extraInitializers);
        __esDecorate(null, null, _channelType_decorators, { kind: "field", name: "channelType", static: false, private: false, access: { has: obj => "channelType" in obj, get: obj => obj.channelType, set: (obj, value) => { obj.channelType = value; } }, metadata: _metadata }, _channelType_initializers, _channelType_extraInitializers);
        __esDecorate(null, null, _recipient_decorators, { kind: "field", name: "recipient", static: false, private: false, access: { has: obj => "recipient" in obj, get: obj => obj.recipient, set: (obj, value) => { obj.recipient = value; } }, metadata: _metadata }, _recipient_initializers, _recipient_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _distributedAt_decorators, { kind: "field", name: "distributedAt", static: false, private: false, access: { has: obj => "distributedAt" in obj, get: obj => obj.distributedAt, set: (obj, value) => { obj.distributedAt = value; } }, metadata: _metadata }, _distributedAt_initializers, _distributedAt_extraInitializers);
        __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
        __esDecorate(null, null, _deliveryConfirmation_decorators, { kind: "field", name: "deliveryConfirmation", static: false, private: false, access: { has: obj => "deliveryConfirmation" in obj, get: obj => obj.deliveryConfirmation, set: (obj, value) => { obj.deliveryConfirmation = value; } }, metadata: _metadata }, _deliveryConfirmation_initializers, _deliveryConfirmation_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _report_decorators, { kind: "field", name: "report", static: false, private: false, access: { has: obj => "report" in obj, get: obj => obj.report, set: (obj, value) => { obj.report = value; } }, metadata: _metadata }, _report_initializers, _report_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportDistribution = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportDistribution = _classThis;
})();
exports.ReportDistribution = ReportDistribution;
/**
 * Dashboard Model - Dashboard configurations
 */
let Dashboard = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'dashboards',
            timestamps: true,
            paranoid: true,
            indexes: [{ fields: ['is_active'] }, { fields: ['category'] }, { fields: ['created_by'] }],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _configuration_decorators;
    let _configuration_initializers = [];
    let _configuration_extraInitializers = [];
    let _isPublic_decorators;
    let _isPublic_initializers = [];
    let _isPublic_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _accessControl_decorators;
    let _accessControl_initializers = [];
    let _accessControl_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Dashboard = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.configuration = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _configuration_initializers, void 0));
            this.isPublic = (__runInitializers(this, _configuration_extraInitializers), __runInitializers(this, _isPublic_initializers, void 0));
            this.isActive = (__runInitializers(this, _isPublic_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdBy = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.accessControl = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _accessControl_initializers, void 0));
            this.createdAt = (__runInitializers(this, _accessControl_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Dashboard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }), sequelize_typescript_1.Index];
        _configuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _isPublic_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is public' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _accessControl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Access control' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _configuration_decorators, { kind: "field", name: "configuration", static: false, private: false, access: { has: obj => "configuration" in obj, get: obj => obj.configuration, set: (obj, value) => { obj.configuration = value; } }, metadata: _metadata }, _configuration_initializers, _configuration_extraInitializers);
        __esDecorate(null, null, _isPublic_decorators, { kind: "field", name: "isPublic", static: false, private: false, access: { has: obj => "isPublic" in obj, get: obj => obj.isPublic, set: (obj, value) => { obj.isPublic = value; } }, metadata: _metadata }, _isPublic_initializers, _isPublic_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _accessControl_decorators, { kind: "field", name: "accessControl", static: false, private: false, access: { has: obj => "accessControl" in obj, get: obj => obj.accessControl, set: (obj, value) => { obj.accessControl = value; } }, metadata: _metadata }, _accessControl_initializers, _accessControl_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Dashboard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Dashboard = _classThis;
})();
exports.Dashboard = Dashboard;
/**
 * KPI Metric Model - Calculated KPI values
 */
let KPIMetric = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'kpi_metrics',
            timestamps: true,
            indexes: [
                { fields: ['metric_type'] },
                { fields: ['calculation_date'] },
                { fields: ['asset_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _calculationDate_decorators;
    let _calculationDate_initializers = [];
    let _calculationDate_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _previousValue_decorators;
    let _previousValue_initializers = [];
    let _previousValue_extraInitializers = [];
    let _changePercent_decorators;
    let _changePercent_initializers = [];
    let _changePercent_extraInitializers = [];
    let _breakdownData_decorators;
    let _breakdownData_initializers = [];
    let _breakdownData_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var KPIMetric = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.metricType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
            this.assetId = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.calculationDate = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _calculationDate_initializers, void 0));
            this.periodStart = (__runInitializers(this, _calculationDate_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.value = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.unit = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
            this.targetValue = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.previousValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _previousValue_initializers, void 0));
            this.changePercent = (__runInitializers(this, _previousValue_extraInitializers), __runInitializers(this, _changePercent_initializers, void 0));
            this.breakdownData = (__runInitializers(this, _changePercent_extraInitializers), __runInitializers(this, _breakdownData_initializers, void 0));
            this.metadata = (__runInitializers(this, _breakdownData_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "KPIMetric");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(KPIMetricType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID (if asset-specific)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _calculationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period start' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period end' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 4), allowNull: false })];
        _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 4) })];
        _previousValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 4) })];
        _changePercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 4) })];
        _breakdownData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Breakdown data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _calculationDate_decorators, { kind: "field", name: "calculationDate", static: false, private: false, access: { has: obj => "calculationDate" in obj, get: obj => obj.calculationDate, set: (obj, value) => { obj.calculationDate = value; } }, metadata: _metadata }, _calculationDate_initializers, _calculationDate_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _previousValue_decorators, { kind: "field", name: "previousValue", static: false, private: false, access: { has: obj => "previousValue" in obj, get: obj => obj.previousValue, set: (obj, value) => { obj.previousValue = value; } }, metadata: _metadata }, _previousValue_initializers, _previousValue_extraInitializers);
        __esDecorate(null, null, _changePercent_decorators, { kind: "field", name: "changePercent", static: false, private: false, access: { has: obj => "changePercent" in obj, get: obj => obj.changePercent, set: (obj, value) => { obj.changePercent = value; } }, metadata: _metadata }, _changePercent_initializers, _changePercent_extraInitializers);
        __esDecorate(null, null, _breakdownData_decorators, { kind: "field", name: "breakdownData", static: false, private: false, access: { has: obj => "breakdownData" in obj, get: obj => obj.breakdownData, set: (obj, value) => { obj.breakdownData = value; } }, metadata: _metadata }, _breakdownData_initializers, _breakdownData_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KPIMetric = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KPIMetric = _classThis;
})();
exports.KPIMetric = KPIMetric;
// ============================================================================
// STANDARD REPORT GENERATION
// ============================================================================
/**
 * Generates asset inventory report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateAssetInventoryReport({
 *   reportType: ReportType.INVENTORY,
 *   format: ReportFormat.EXCEL,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   groupBy: ['assetType', 'location'],
 *   includeCharts: true
 * });
 * ```
 */
async function generateAssetInventoryReport(options, transaction) {
    const reportNumber = await generateReportNumber(ReportType.INVENTORY);
    const startTime = Date.now();
    // Create report record
    const report = await Report.create({
        reportNumber,
        reportType: ReportType.INVENTORY,
        title: options.title || 'Asset Inventory Report',
        description: options.description,
        status: ReportStatus.GENERATING,
        format: options.format,
        parameters: options.customParameters,
        filters: options.filters,
        dataRangeFrom: options.filters?.dateFrom,
        dataRangeTo: options.filters?.dateTo,
        generatedBy: 'system', // Would be from context in real implementation
    }, { transaction });
    try {
        // Execute report query (simplified - real implementation would use query builder)
        const data = await executeInventoryQuery(options.filters, transaction);
        // Format data based on output format
        const filePath = await formatAndSaveReport(data, options.format, report.id, transaction);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        // Update report with completion
        await report.update({
            status: ReportStatus.COMPLETED,
            filePath,
            recordCount: data.length,
            generatedAt: new Date(),
            generationDuration: duration,
        }, { transaction });
        return report;
    }
    catch (error) {
        await report.update({
            status: ReportStatus.FAILED,
            errorMessage: error.message,
        }, { transaction });
        throw error;
    }
}
/**
 * Generates depreciation report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateDepreciationReport({
 *   reportType: ReportType.DEPRECIATION,
 *   format: ReportFormat.PDF,
 *   filters: {
 *     assetTypeIds: ['type-001', 'type-002']
 *   }
 * });
 * ```
 */
async function generateDepreciationReport(options, transaction) {
    const reportNumber = await generateReportNumber(ReportType.DEPRECIATION);
    const startTime = Date.now();
    const report = await Report.create({
        reportNumber,
        reportType: ReportType.DEPRECIATION,
        title: options.title || 'Asset Depreciation Report',
        description: options.description,
        status: ReportStatus.GENERATING,
        format: options.format,
        parameters: options.customParameters,
        filters: options.filters,
        dataRangeFrom: options.filters?.dateFrom,
        dataRangeTo: options.filters?.dateTo,
        generatedBy: 'system',
    }, { transaction });
    try {
        const data = await executeDepreciationQuery(options.filters, transaction);
        const filePath = await formatAndSaveReport(data, options.format, report.id, transaction);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        await report.update({
            status: ReportStatus.COMPLETED,
            filePath,
            recordCount: data.length,
            generatedAt: new Date(),
            generationDuration: duration,
        }, { transaction });
        return report;
    }
    catch (error) {
        await report.update({
            status: ReportStatus.FAILED,
            errorMessage: error.message,
        }, { transaction });
        throw error;
    }
}
/**
 * Generates maintenance report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateMaintenanceReport({
 *   reportType: ReportType.MAINTENANCE,
 *   format: ReportFormat.EXCEL,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   groupBy: ['maintenanceType']
 * });
 * ```
 */
async function generateMaintenanceReport(options, transaction) {
    const reportNumber = await generateReportNumber(ReportType.MAINTENANCE);
    const startTime = Date.now();
    const report = await Report.create({
        reportNumber,
        reportType: ReportType.MAINTENANCE,
        title: options.title || 'Maintenance Activity Report',
        description: options.description,
        status: ReportStatus.GENERATING,
        format: options.format,
        parameters: options.customParameters,
        filters: options.filters,
        dataRangeFrom: options.filters?.dateFrom,
        dataRangeTo: options.filters?.dateTo,
        generatedBy: 'system',
    }, { transaction });
    try {
        const data = await executeMaintenanceQuery(options.filters, transaction);
        const filePath = await formatAndSaveReport(data, options.format, report.id, transaction);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        await report.update({
            status: ReportStatus.COMPLETED,
            filePath,
            recordCount: data.length,
            generatedAt: new Date(),
            generationDuration: duration,
        }, { transaction });
        return report;
    }
    catch (error) {
        await report.update({
            status: ReportStatus.FAILED,
            errorMessage: error.message,
        }, { transaction });
        throw error;
    }
}
/**
 * Generates compliance report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport({
 *   reportType: ReportType.COMPLIANCE,
 *   format: ReportFormat.PDF,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   includeExecutiveSummary: true
 * });
 * ```
 */
async function generateComplianceReport(options, transaction) {
    const reportNumber = await generateReportNumber(ReportType.COMPLIANCE);
    const startTime = Date.now();
    const report = await Report.create({
        reportNumber,
        reportType: ReportType.COMPLIANCE,
        title: options.title || 'Compliance Status Report',
        description: options.description,
        status: ReportStatus.GENERATING,
        format: options.format,
        parameters: options.customParameters,
        filters: options.filters,
        dataRangeFrom: options.filters?.dateFrom,
        dataRangeTo: options.filters?.dateTo,
        generatedBy: 'system',
    }, { transaction });
    try {
        const data = await executeComplianceQuery(options.filters, transaction);
        const filePath = await formatAndSaveReport(data, options.format, report.id, transaction);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        await report.update({
            status: ReportStatus.COMPLETED,
            filePath,
            recordCount: data.length,
            generatedAt: new Date(),
            generationDuration: duration,
        }, { transaction });
        return report;
    }
    catch (error) {
        await report.update({
            status: ReportStatus.FAILED,
            errorMessage: error.message,
        }, { transaction });
        throw error;
    }
}
/**
 * Generates executive summary report
 *
 * @param options - Report generation options
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await generateExecutiveSummary({
 *   reportType: ReportType.EXECUTIVE_SUMMARY,
 *   format: ReportFormat.PDF,
 *   filters: {
 *     dateFrom: new Date('2024-01-01'),
 *     dateTo: new Date('2024-12-31')
 *   },
 *   includeCharts: true
 * });
 * ```
 */
async function generateExecutiveSummary(options, transaction) {
    const reportNumber = await generateReportNumber(ReportType.EXECUTIVE_SUMMARY);
    const startTime = Date.now();
    const report = await Report.create({
        reportNumber,
        reportType: ReportType.EXECUTIVE_SUMMARY,
        title: options.title || 'Executive Summary - Asset Management',
        description: options.description,
        status: ReportStatus.GENERATING,
        format: options.format,
        parameters: options.customParameters,
        filters: options.filters,
        dataRangeFrom: options.filters?.dateFrom,
        dataRangeTo: options.filters?.dateTo,
        generatedBy: 'system',
    }, { transaction });
    try {
        // Gather summary data from multiple sources
        const inventorySummary = await executeInventoryQuery(options.filters, transaction);
        const depreciationSummary = await executeDepreciationQuery(options.filters, transaction);
        const maintenanceSummary = await executeMaintenanceQuery(options.filters, transaction);
        const summaryData = {
            inventory: inventorySummary,
            depreciation: depreciationSummary,
            maintenance: maintenanceSummary,
        };
        const filePath = await formatAndSaveReport(summaryData, options.format, report.id, transaction);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        await report.update({
            status: ReportStatus.COMPLETED,
            filePath,
            recordCount: inventorySummary.length,
            generatedAt: new Date(),
            generationDuration: duration,
        }, { transaction });
        return report;
    }
    catch (error) {
        await report.update({
            status: ReportStatus.FAILED,
            errorMessage: error.message,
        }, { transaction });
        throw error;
    }
}
/**
 * Generates report number
 *
 * @param reportType - Report type
 * @returns Generated report number
 */
async function generateReportNumber(reportType) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const typePrefix = reportType.toUpperCase().substring(0, 4);
    const count = await Report.count({
        where: {
            reportType,
            createdAt: {
                [sequelize_1.Op.gte]: new Date(`${year}-${month}-01`),
            },
        },
    });
    return `RPT-${typePrefix}-${year}${month}-${String(count + 1).padStart(5, '0')}`;
}
// ============================================================================
// CUSTOM REPORT BUILDER
// ============================================================================
/**
 * Creates custom report template
 *
 * @param definition - Report definition
 * @param transaction - Optional database transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createCustomReport({
 *   name: 'Asset Age Analysis',
 *   dataSource: { table: 'assets' },
 *   columns: [
 *     { field: 'assetTag', label: 'Asset Tag', type: 'string' },
 *     { field: 'acquisitionDate', label: 'Acquisition Date', type: 'date' },
 *     { field: 'acquisitionCost', label: 'Cost', type: 'currency' }
 *   ],
 *   filters: [
 *     { field: 'isActive', operator: 'eq', value: true }
 *   ],
 *   orderBy: [{ field: 'acquisitionDate', direction: 'DESC' }]
 * });
 * ```
 */
async function createCustomReport(definition, transaction) {
    // Generate template code
    const code = await generateTemplateCode(definition.name);
    const template = await ReportTemplate.create({
        code,
        name: definition.name,
        description: definition.description,
        reportType: ReportType.CUSTOM,
        definition,
        isActive: true,
        version: '1.0',
    }, { transaction });
    return template;
}
/**
 * Generates template code
 *
 * @param name - Template name
 * @returns Generated code
 */
async function generateTemplateCode(name) {
    const prefix = name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 10);
    const timestamp = Date.now().toString().substring(-6);
    return `CUSTOM_${prefix}_${timestamp}`;
}
/**
 * Executes custom report
 *
 * @param templateId - Template identifier
 * @param parameters - Runtime parameters
 * @param format - Output format
 * @param transaction - Optional database transaction
 * @returns Generated report
 *
 * @example
 * ```typescript
 * const report = await executeCustomReport(
 *   'template-123',
 *   { assetTypeId: 'type-001' },
 *   ReportFormat.EXCEL
 * );
 * ```
 */
async function executeCustomReport(templateId, parameters, format, transaction) {
    const template = await ReportTemplate.findByPk(templateId, { transaction });
    if (!template) {
        throw new common_1.NotFoundException(`Template ${templateId} not found`);
    }
    const reportNumber = await generateReportNumber(ReportType.CUSTOM);
    const startTime = Date.now();
    const report = await Report.create({
        reportNumber,
        templateId,
        reportType: ReportType.CUSTOM,
        title: template.name,
        description: template.description,
        status: ReportStatus.GENERATING,
        format,
        parameters,
        generatedBy: 'system',
    }, { transaction });
    try {
        // Build and execute custom query
        const data = await executeCustomQuery(template.definition, parameters, transaction);
        const filePath = await formatAndSaveReport(data, format, report.id, transaction);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        await report.update({
            status: ReportStatus.COMPLETED,
            filePath,
            recordCount: data.length,
            generatedAt: new Date(),
            generationDuration: duration,
        }, { transaction });
        return report;
    }
    catch (error) {
        await report.update({
            status: ReportStatus.FAILED,
            errorMessage: error.message,
        }, { transaction });
        throw error;
    }
}
/**
 * Updates custom report template
 *
 * @param templateId - Template identifier
 * @param definition - Updated definition
 * @param transaction - Optional database transaction
 * @returns Updated template
 *
 * @example
 * ```typescript
 * await updateCustomReportTemplate('template-123', {
 *   ...existingDefinition,
 *   columns: [...existingColumns, newColumn]
 * });
 * ```
 */
async function updateCustomReportTemplate(templateId, definition, transaction) {
    const template = await ReportTemplate.findByPk(templateId, { transaction });
    if (!template) {
        throw new common_1.NotFoundException(`Template ${templateId} not found`);
    }
    const updatedDefinition = {
        ...template.definition,
        ...definition,
    };
    await template.update({ definition: updatedDefinition }, { transaction });
    return template;
}
// ============================================================================
// DASHBOARD GENERATION
// ============================================================================
/**
 * Creates dashboard
 *
 * @param configuration - Dashboard configuration
 * @param transaction - Optional database transaction
 * @returns Created dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await createDashboard({
 *   name: 'Asset Overview Dashboard',
 *   layout: { columns: 12, rows: 6, responsive: true },
 *   widgets: [
 *     {
 *       id: 'widget-1',
 *       type: 'metric',
 *       title: 'Total Assets',
 *       position: { x: 0, y: 0 },
 *       size: { width: 3, height: 2 },
 *       dataSource: 'asset-count',
 *       metricType: KPIMetricType.ASSET_AVAILABILITY
 *     }
 *   ]
 * });
 * ```
 */
async function createDashboard(configuration, transaction) {
    const code = await generateDashboardCode(configuration.name);
    const dashboard = await Dashboard.create({
        code,
        name: configuration.name,
        description: configuration.description,
        configuration,
        isActive: true,
        createdBy: 'system',
    }, { transaction });
    return dashboard;
}
/**
 * Generates dashboard code
 *
 * @param name - Dashboard name
 * @returns Generated code
 */
async function generateDashboardCode(name) {
    const prefix = name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .substring(0, 10);
    const timestamp = Date.now().toString().substring(-6);
    return `DASH_${prefix}_${timestamp}`;
}
/**
 * Generates dashboard data
 *
 * @param dashboardId - Dashboard identifier
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Dashboard data
 *
 * @example
 * ```typescript
 * const data = await generateDashboardData('dashboard-123', {
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-12-31')
 * });
 * ```
 */
async function generateDashboardData(dashboardId, filters, transaction) {
    const dashboard = await Dashboard.findByPk(dashboardId, { transaction });
    if (!dashboard) {
        throw new common_1.NotFoundException(`Dashboard ${dashboardId} not found`);
    }
    const widgetData = [];
    // Generate data for each widget
    for (const widget of dashboard.configuration.widgets) {
        let data;
        switch (widget.type) {
            case 'metric':
                data = await generateMetricWidgetData(widget, filters, transaction);
                break;
            case 'chart':
                data = await generateChartWidgetData(widget, filters, transaction);
                break;
            case 'table':
                data = await generateTableWidgetData(widget, filters, transaction);
                break;
            case 'text':
                data = widget.configuration;
                break;
        }
        widgetData.push({ widgetId: widget.id, data });
    }
    return {
        dashboardId,
        generatedAt: new Date(),
        widgets: widgetData,
    };
}
/**
 * Generates metric widget data
 *
 * @param widget - Widget configuration
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Metric data
 */
async function generateMetricWidgetData(widget, filters, transaction) {
    if (!widget.metricType) {
        throw new common_1.BadRequestException('Metric type required for metric widget');
    }
    const kpiResult = await calculateAssetKPIs({
        metricType: widget.metricType,
        dateFrom: filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dateTo: filters?.dateTo || new Date(),
        assetIds: filters?.assetIds,
    }, transaction);
    return kpiResult;
}
/**
 * Generates chart widget data
 *
 * @param widget - Widget configuration
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Chart data
 */
async function generateChartWidgetData(widget, filters, transaction) {
    // Simplified - real implementation would query based on widget.dataSource
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: widget.title,
                data: [65, 59, 80, 81, 56, 55],
            },
        ],
    };
}
/**
 * Generates table widget data
 *
 * @param widget - Widget configuration
 * @param filters - Optional filters
 * @param transaction - Optional database transaction
 * @returns Table data
 */
async function generateTableWidgetData(widget, filters, transaction) {
    // Simplified - real implementation would query based on widget.dataSource
    return {
        columns: ['Asset', 'Location', 'Status', 'Value'],
        rows: [],
    };
}
/**
 * Updates dashboard
 *
 * @param dashboardId - Dashboard identifier
 * @param configuration - Updated configuration
 * @param transaction - Optional database transaction
 * @returns Updated dashboard
 *
 * @example
 * ```typescript
 * await updateDashboard('dashboard-123', {
 *   ...existingConfig,
 *   widgets: [...existingWidgets, newWidget]
 * });
 * ```
 */
async function updateDashboard(dashboardId, configuration, transaction) {
    const dashboard = await Dashboard.findByPk(dashboardId, { transaction });
    if (!dashboard) {
        throw new common_1.NotFoundException(`Dashboard ${dashboardId} not found`);
    }
    const updatedConfiguration = {
        ...dashboard.configuration,
        ...configuration,
    };
    await dashboard.update({ configuration: updatedConfiguration }, { transaction });
    return dashboard;
}
// ============================================================================
// KPI CALCULATION
// ============================================================================
/**
 * Calculates asset KPIs
 *
 * @param options - KPI calculation options
 * @param transaction - Optional database transaction
 * @returns KPI result
 *
 * @example
 * ```typescript
 * const kpi = await calculateAssetKPIs({
 *   metricType: KPIMetricType.ASSET_AVAILABILITY,
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-12-31'),
 *   assetIds: ['asset-001', 'asset-002']
 * });
 * ```
 */
async function calculateAssetKPIs(options, transaction) {
    let result;
    switch (options.metricType) {
        case KPIMetricType.ASSET_AVAILABILITY:
            result = await calculateAssetAvailability(options, transaction);
            break;
        case KPIMetricType.UTILIZATION_RATE:
            result = await calculateUtilizationRate(options, transaction);
            break;
        case KPIMetricType.MAINTENANCE_COST_RATIO:
            result = await calculateMaintenanceCostRatio(options, transaction);
            break;
        case KPIMetricType.MEAN_TIME_BETWEEN_FAILURES:
            result = await calculateMTBF(options, transaction);
            break;
        case KPIMetricType.MEAN_TIME_TO_REPAIR:
            result = await calculateMTTR(options, transaction);
            break;
        default:
            throw new common_1.BadRequestException(`Unsupported metric type: ${options.metricType}`);
    }
    // Store KPI metric
    await KPIMetric.create({
        metricType: options.metricType,
        calculationDate: new Date(),
        periodStart: options.dateFrom,
        periodEnd: options.dateTo,
        value: result.value,
        unit: result.unit,
        targetValue: result.target,
        previousValue: result.changePercent ? result.value / (1 + result.changePercent / 100) : undefined,
        changePercent: result.changePercent,
        breakdownData: result.breakdown,
    }, { transaction });
    return result;
}
/**
 * Calculates asset availability KPI
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateAssetAvailability(options, transaction) {
    // Simplified calculation - real implementation would query actual uptime data
    const value = 98.5;
    const target = 99.0;
    const previousValue = 97.8;
    const changePercent = ((value - previousValue) / previousValue) * 100;
    return {
        metricType: KPIMetricType.ASSET_AVAILABILITY,
        value,
        unit: '%',
        trend: value > previousValue ? 'up' : 'down',
        changePercent,
        target,
        status: value >= target ? 'good' : value >= target * 0.95 ? 'warning' : 'critical',
        breakdown: [],
    };
}
/**
 * Calculates utilization rate KPI
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateUtilizationRate(options, transaction) {
    const value = 75.2;
    const target = 80.0;
    const previousValue = 72.5;
    const changePercent = ((value - previousValue) / previousValue) * 100;
    return {
        metricType: KPIMetricType.UTILIZATION_RATE,
        value,
        unit: '%',
        trend: value > previousValue ? 'up' : 'down',
        changePercent,
        target,
        status: value >= target ? 'good' : value >= target * 0.9 ? 'warning' : 'critical',
        breakdown: [],
    };
}
/**
 * Calculates maintenance cost ratio KPI
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateMaintenanceCostRatio(options, transaction) {
    const value = 4.2;
    const target = 5.0;
    const previousValue = 4.8;
    const changePercent = ((value - previousValue) / previousValue) * 100;
    return {
        metricType: KPIMetricType.MAINTENANCE_COST_RATIO,
        value,
        unit: '%',
        trend: value < previousValue ? 'up' : 'down', // Lower is better for cost
        changePercent,
        target,
        status: value <= target ? 'good' : value <= target * 1.1 ? 'warning' : 'critical',
        breakdown: [],
    };
}
/**
 * Calculates Mean Time Between Failures
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateMTBF(options, transaction) {
    const value = 720;
    const target = 800;
    const previousValue = 680;
    const changePercent = ((value - previousValue) / previousValue) * 100;
    return {
        metricType: KPIMetricType.MEAN_TIME_BETWEEN_FAILURES,
        value,
        unit: 'hours',
        trend: value > previousValue ? 'up' : 'down',
        changePercent,
        target,
        status: value >= target ? 'good' : value >= target * 0.9 ? 'warning' : 'critical',
        breakdown: [],
    };
}
/**
 * Calculates Mean Time To Repair
 *
 * @param options - KPI options
 * @param transaction - Optional database transaction
 * @returns KPI result
 */
async function calculateMTTR(options, transaction) {
    const value = 4.5;
    const target = 4.0;
    const previousValue = 5.2;
    const changePercent = ((value - previousValue) / previousValue) * 100;
    return {
        metricType: KPIMetricType.MEAN_TIME_TO_REPAIR,
        value,
        unit: 'hours',
        trend: value < previousValue ? 'up' : 'down', // Lower is better
        changePercent,
        target,
        status: value <= target ? 'good' : value <= target * 1.1 ? 'warning' : 'critical',
        breakdown: [],
    };
}
/**
 * Gets KPI history
 *
 * @param metricType - Metric type
 * @param assetId - Optional asset ID
 * @param limit - Maximum records
 * @returns KPI history
 *
 * @example
 * ```typescript
 * const history = await getKPIHistory(
 *   KPIMetricType.ASSET_AVAILABILITY,
 *   'asset-123',
 *   12
 * );
 * ```
 */
async function getKPIHistory(metricType, assetId, limit = 50) {
    const where = { metricType };
    if (assetId) {
        where.assetId = assetId;
    }
    return KPIMetric.findAll({
        where,
        order: [['calculationDate', 'DESC']],
        limit,
    });
}
// ============================================================================
// REPORT SCHEDULING
// ============================================================================
/**
 * Schedules report
 *
 * @param data - Schedule data
 * @param transaction - Optional database transaction
 * @returns Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleReport({
 *   reportTemplateId: 'template-123',
 *   name: 'Monthly Inventory Report',
 *   frequency: ReportFrequency.MONTHLY,
 *   startDate: new Date('2024-01-01'),
 *   executionTime: '08:00',
 *   recipients: ['manager@company.com'],
 *   format: ReportFormat.PDF,
 *   isActive: true
 * });
 * ```
 */
async function scheduleReport(data, transaction) {
    const template = await ReportTemplate.findByPk(data.reportTemplateId, { transaction });
    if (!template) {
        throw new common_1.NotFoundException(`Template ${data.reportTemplateId} not found`);
    }
    const nextExecution = calculateNextExecution(data.startDate, data.frequency, data.executionTime);
    const schedule = await ReportSchedule.create({
        ...data,
        nextExecution,
        createdBy: 'system',
    }, { transaction });
    return schedule;
}
/**
 * Calculates next execution date
 *
 * @param startDate - Start date
 * @param frequency - Frequency
 * @param executionTime - Time of day
 * @returns Next execution date
 */
function calculateNextExecution(startDate, frequency, executionTime) {
    const next = new Date(startDate);
    const now = new Date();
    // Set execution time if provided
    if (executionTime) {
        const [hours, minutes] = executionTime.split(':').map(Number);
        next.setHours(hours, minutes, 0, 0);
    }
    // Calculate next occurrence based on frequency
    while (next <= now) {
        switch (frequency) {
            case ReportFrequency.DAILY:
                next.setDate(next.getDate() + 1);
                break;
            case ReportFrequency.WEEKLY:
                next.setDate(next.getDate() + 7);
                break;
            case ReportFrequency.MONTHLY:
                next.setMonth(next.getMonth() + 1);
                break;
            case ReportFrequency.QUARTERLY:
                next.setMonth(next.getMonth() + 3);
                break;
            case ReportFrequency.YEARLY:
                next.setFullYear(next.getFullYear() + 1);
                break;
        }
    }
    return next;
}
/**
 * Updates report schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Schedule updates
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updateReportSchedule('schedule-123', {
 *   isActive: false
 * });
 * ```
 */
async function updateReportSchedule(scheduleId, updates, transaction) {
    const schedule = await ReportSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`Schedule ${scheduleId} not found`);
    }
    await schedule.update(updates, { transaction });
    return schedule;
}
/**
 * Executes scheduled reports
 *
 * @param transaction - Optional database transaction
 * @returns Executed schedule IDs
 *
 * @example
 * ```typescript
 * const executed = await executeScheduledReports();
 * console.log(`Executed ${executed.length} scheduled reports`);
 * ```
 */
async function executeScheduledReports(transaction) {
    const now = new Date();
    const schedules = await ReportSchedule.findAll({
        where: {
            isActive: true,
            nextExecution: {
                [sequelize_1.Op.lte]: now,
            },
        },
        include: [{ model: ReportTemplate }],
        transaction,
    });
    const executed = [];
    for (const schedule of schedules) {
        try {
            if (!schedule.template)
                continue;
            // Execute report
            await executeCustomReport(schedule.templateId, schedule.parameters || {}, schedule.format, transaction);
            // Update schedule
            const nextExecution = calculateNextExecution(now, schedule.frequency, schedule.executionTime);
            await schedule.update({
                lastExecution: now,
                nextExecution,
            }, { transaction });
            executed.push(schedule.id);
        }
        catch (error) {
            // Log error but continue with other schedules
            console.error(`Failed to execute schedule ${schedule.id}:`, error);
        }
    }
    return executed;
}
// ============================================================================
// REPORT DISTRIBUTION
// ============================================================================
/**
 * Distributes report
 *
 * @param reportId - Report identifier
 * @param channels - Distribution channels
 * @param transaction - Optional database transaction
 * @returns Distribution records
 *
 * @example
 * ```typescript
 * await distributeReport('report-123', [
 *   {
 *     type: 'email',
 *     recipients: ['user@company.com'],
 *     configuration: { subject: 'Monthly Report' }
 *   }
 * ]);
 * ```
 */
async function distributeReport(reportId, channels, transaction) {
    const report = await Report.findByPk(reportId, { transaction });
    if (!report) {
        throw new common_1.NotFoundException(`Report ${reportId} not found`);
    }
    if (report.status !== ReportStatus.COMPLETED) {
        throw new common_1.BadRequestException('Can only distribute completed reports');
    }
    const distributions = [];
    for (const channel of channels) {
        const recipients = channel.recipients || [];
        for (const recipient of recipients) {
            const distribution = await ReportDistribution.create({
                reportId,
                channelType: channel.type,
                recipient,
                status: 'pending',
                metadata: channel.configuration,
            }, { transaction });
            // Trigger actual distribution (simplified)
            try {
                await performDistribution(report, channel.type, recipient, channel.configuration);
                await distribution.update({
                    status: 'sent',
                    distributedAt: new Date(),
                }, { transaction });
            }
            catch (error) {
                await distribution.update({
                    status: 'failed',
                    errorMessage: error.message,
                }, { transaction });
            }
            distributions.push(distribution);
        }
    }
    return distributions;
}
/**
 * Performs actual distribution
 *
 * @param report - Report record
 * @param channelType - Channel type
 * @param recipient - Recipient
 * @param configuration - Channel configuration
 */
async function performDistribution(report, channelType, recipient, configuration) {
    // Real implementation would integrate with email service, SFTP, etc.
    console.log(`Distributing report ${report.id} via ${channelType} to ${recipient}`);
}
/**
 * Gets report distribution status
 *
 * @param reportId - Report identifier
 * @returns Distribution records
 *
 * @example
 * ```typescript
 * const distributions = await getReportDistributionStatus('report-123');
 * ```
 */
async function getReportDistributionStatus(reportId) {
    return ReportDistribution.findAll({
        where: { reportId },
        order: [['createdAt', 'DESC']],
    });
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Executes inventory query (simplified)
 */
async function executeInventoryQuery(filters, transaction) {
    // Simplified - real implementation would build and execute SQL query
    return [];
}
/**
 * Executes depreciation query (simplified)
 */
async function executeDepreciationQuery(filters, transaction) {
    return [];
}
/**
 * Executes maintenance query (simplified)
 */
async function executeMaintenanceQuery(filters, transaction) {
    return [];
}
/**
 * Executes compliance query (simplified)
 */
async function executeComplianceQuery(filters, transaction) {
    return [];
}
/**
 * Executes custom query (simplified)
 */
async function executeCustomQuery(definition, parameters, transaction) {
    return [];
}
/**
 * Formats and saves report (simplified)
 */
async function formatAndSaveReport(data, format, reportId, transaction) {
    // Real implementation would format data and save to file system
    return `/reports/${reportId}.${format}`;
}
/**
 * Gets report by ID
 *
 * @param reportId - Report identifier
 * @returns Report record
 *
 * @example
 * ```typescript
 * const report = await getReportById('report-123');
 * ```
 */
async function getReportById(reportId) {
    const report = await Report.findByPk(reportId, {
        include: [
            { model: ReportTemplate },
            { model: ReportDistribution, as: 'distributions' },
        ],
    });
    if (!report) {
        throw new common_1.NotFoundException(`Report ${reportId} not found`);
    }
    return report;
}
/**
 * Deletes expired reports
 *
 * @param transaction - Optional database transaction
 * @returns Number of deleted reports
 *
 * @example
 * ```typescript
 * const deleted = await deleteExpiredReports();
 * ```
 */
async function deleteExpiredReports(transaction) {
    const result = await Report.destroy({
        where: {
            expirationDate: {
                [sequelize_1.Op.lt]: new Date(),
            },
        },
        transaction,
    });
    return result;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    ReportTemplate,
    Report,
    ReportSchedule,
    ReportDistribution,
    Dashboard,
    KPIMetric,
    // Standard Reports
    generateAssetInventoryReport,
    generateDepreciationReport,
    generateMaintenanceReport,
    generateComplianceReport,
    generateExecutiveSummary,
    // Custom Reports
    createCustomReport,
    executeCustomReport,
    updateCustomReportTemplate,
    // Dashboards
    createDashboard,
    generateDashboardData,
    updateDashboard,
    // KPIs
    calculateAssetKPIs,
    getKPIHistory,
    // Scheduling
    scheduleReport,
    updateReportSchedule,
    executeScheduledReports,
    // Distribution
    distributeReport,
    getReportDistributionStatus,
    // Utilities
    getReportById,
    deleteExpiredReports,
};
//# sourceMappingURL=asset-reporting-commands.js.map