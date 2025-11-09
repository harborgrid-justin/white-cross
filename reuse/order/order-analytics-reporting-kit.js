"use strict";
/**
 * LOC: ORD-ANL-001
 * File: /reuse/order/order-analytics-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Analytics controllers
 *   - Reporting services
 *   - Dashboard services
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastConfigDto = exports.DashboardConfigDto = exports.CustomReportDto = exports.KpiConfigDto = exports.AnalyticsQueryDto = exports.ForecastModel = exports.DashboardWidgetType = exports.KpiThresholdType = exports.AggregationType = exports.ReportFormat = exports.AnalyticsPeriod = void 0;
exports.calculateOrderVolumeMetrics = calculateOrderVolumeMetrics;
exports.calculateAverageOrderValue = calculateAverageOrderValue;
exports.calculateFulfillmentMetrics = calculateFulfillmentMetrics;
exports.calculateRevenueMetrics = calculateRevenueMetrics;
exports.analyzeSalesConversionFunnel = analyzeSalesConversionFunnel;
exports.calculateSalesByCategory = calculateSalesByCategory;
exports.calculateCustomerLifetimeValue = calculateCustomerLifetimeValue;
exports.analyzeCustomerRetention = analyzeCustomerRetention;
exports.segmentCustomersByRFM = segmentCustomersByRFM;
exports.analyzeTopPerformingProducts = analyzeTopPerformingProducts;
exports.analyzeProductPerformanceTrends = analyzeProductPerformanceTrends;
exports.analyzeProductAffinity = analyzeProductAffinity;
exports.generateSalesForecast = generateSalesForecast;
exports.detectOrderTrendsAndAnomalies = detectOrderTrendsAndAnomalies;
exports.generateExecutiveDashboard = generateExecutiveDashboard;
exports.generateCustomReport = generateCustomReport;
exports.exportReportData = exportReportData;
exports.calculateRealTimeMetrics = calculateRealTimeMetrics;
/**
 * File: /reuse/order/order-analytics-reporting-kit.ts
 * Locator: WC-ORD-ANLRPT-001
 * Purpose: Order Analytics & Reporting - Comprehensive analytics, dashboards, KPIs
 *
 * Upstream: Independent utility module for order analytics and reporting
 * Downstream: ../backend/analytics/*, Reporting modules, Dashboard services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for analytics, reporting, KPIs, dashboards, forecasting
 *
 * LLM Context: Enterprise-grade order analytics and reporting utilities to compete with SAP BusinessObjects and Oracle Analytics.
 * Provides comprehensive order metrics, KPIs, sales analytics, customer analytics, product analytics, fulfillment analytics,
 * revenue reporting, trend analysis, forecasting, dashboard generation, custom reports, data export, and real-time analytics.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_1 = require("sequelize");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Analytics period types for time-based analysis
 */
var AnalyticsPeriod;
(function (AnalyticsPeriod) {
    AnalyticsPeriod["HOURLY"] = "HOURLY";
    AnalyticsPeriod["DAILY"] = "DAILY";
    AnalyticsPeriod["WEEKLY"] = "WEEKLY";
    AnalyticsPeriod["MONTHLY"] = "MONTHLY";
    AnalyticsPeriod["QUARTERLY"] = "QUARTERLY";
    AnalyticsPeriod["YEARLY"] = "YEARLY";
    AnalyticsPeriod["CUSTOM"] = "CUSTOM";
})(AnalyticsPeriod || (exports.AnalyticsPeriod = AnalyticsPeriod = {}));
/**
 * Report formats for data export
 */
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["JSON"] = "JSON";
    ReportFormat["CSV"] = "CSV";
    ReportFormat["EXCEL"] = "EXCEL";
    ReportFormat["PDF"] = "PDF";
    ReportFormat["HTML"] = "HTML";
    ReportFormat["XML"] = "XML";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
/**
 * Metric aggregation types
 */
var AggregationType;
(function (AggregationType) {
    AggregationType["SUM"] = "SUM";
    AggregationType["AVG"] = "AVG";
    AggregationType["MIN"] = "MIN";
    AggregationType["MAX"] = "MAX";
    AggregationType["COUNT"] = "COUNT";
    AggregationType["MEDIAN"] = "MEDIAN";
    AggregationType["PERCENTILE"] = "PERCENTILE";
    AggregationType["STDDEV"] = "STDDEV";
})(AggregationType || (exports.AggregationType = AggregationType = {}));
/**
 * KPI threshold types
 */
var KpiThresholdType;
(function (KpiThresholdType) {
    KpiThresholdType["GREATER_THAN"] = "GREATER_THAN";
    KpiThresholdType["LESS_THAN"] = "LESS_THAN";
    KpiThresholdType["EQUALS"] = "EQUALS";
    KpiThresholdType["BETWEEN"] = "BETWEEN";
    KpiThresholdType["OUTSIDE_RANGE"] = "OUTSIDE_RANGE";
})(KpiThresholdType || (exports.KpiThresholdType = KpiThresholdType = {}));
/**
 * Dashboard widget types
 */
var DashboardWidgetType;
(function (DashboardWidgetType) {
    DashboardWidgetType["LINE_CHART"] = "LINE_CHART";
    DashboardWidgetType["BAR_CHART"] = "BAR_CHART";
    DashboardWidgetType["PIE_CHART"] = "PIE_CHART";
    DashboardWidgetType["AREA_CHART"] = "AREA_CHART";
    DashboardWidgetType["SCATTER_CHART"] = "SCATTER_CHART";
    DashboardWidgetType["TABLE"] = "TABLE";
    DashboardWidgetType["KPI_CARD"] = "KPI_CARD";
    DashboardWidgetType["GAUGE"] = "GAUGE";
    DashboardWidgetType["HEATMAP"] = "HEATMAP";
    DashboardWidgetType["FUNNEL"] = "FUNNEL";
})(DashboardWidgetType || (exports.DashboardWidgetType = DashboardWidgetType = {}));
/**
 * Forecast models
 */
var ForecastModel;
(function (ForecastModel) {
    ForecastModel["LINEAR_REGRESSION"] = "LINEAR_REGRESSION";
    ForecastModel["MOVING_AVERAGE"] = "MOVING_AVERAGE";
    ForecastModel["EXPONENTIAL_SMOOTHING"] = "EXPONENTIAL_SMOOTHING";
    ForecastModel["SEASONAL_DECOMPOSITION"] = "SEASONAL_DECOMPOSITION";
    ForecastModel["ARIMA"] = "ARIMA";
})(ForecastModel || (exports.ForecastModel = ForecastModel = {}));
// ============================================================================
// DTOs
// ============================================================================
let AnalyticsQueryDto = (() => {
    var _a;
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _period_decorators;
    let _period_initializers = [];
    let _period_extraInitializers = [];
    let _comparisonStartDate_decorators;
    let _comparisonStartDate_initializers = [];
    let _comparisonStartDate_extraInitializers = [];
    let _comparisonEndDate_decorators;
    let _comparisonEndDate_initializers = [];
    let _comparisonEndDate_extraInitializers = [];
    let _customerIds_decorators;
    let _customerIds_initializers = [];
    let _customerIds_extraInitializers = [];
    let _productIds_decorators;
    let _productIds_initializers = [];
    let _productIds_extraInitializers = [];
    let _orderStatus_decorators;
    let _orderStatus_initializers = [];
    let _orderStatus_extraInitializers = [];
    let _orderSource_decorators;
    let _orderSource_initializers = [];
    let _orderSource_extraInitializers = [];
    let _regions_decorators;
    let _regions_initializers = [];
    let _regions_extraInitializers = [];
    let _groupBy_decorators;
    let _groupBy_initializers = [];
    let _groupBy_extraInitializers = [];
    return _a = class AnalyticsQueryDto {
            constructor() {
                this.startDate = __runInitializers(this, _startDate_initializers, void 0);
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.period = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _period_initializers, AnalyticsPeriod.DAILY));
                this.comparisonStartDate = (__runInitializers(this, _period_extraInitializers), __runInitializers(this, _comparisonStartDate_initializers, void 0));
                this.comparisonEndDate = (__runInitializers(this, _comparisonStartDate_extraInitializers), __runInitializers(this, _comparisonEndDate_initializers, void 0));
                this.customerIds = (__runInitializers(this, _comparisonEndDate_extraInitializers), __runInitializers(this, _customerIds_initializers, void 0));
                this.productIds = (__runInitializers(this, _customerIds_extraInitializers), __runInitializers(this, _productIds_initializers, void 0));
                this.orderStatus = (__runInitializers(this, _productIds_extraInitializers), __runInitializers(this, _orderStatus_initializers, void 0));
                this.orderSource = (__runInitializers(this, _orderStatus_extraInitializers), __runInitializers(this, _orderSource_initializers, void 0));
                this.regions = (__runInitializers(this, _orderSource_extraInitializers), __runInitializers(this, _regions_initializers, void 0));
                this.groupBy = (__runInitializers(this, _regions_extraInitializers), __runInitializers(this, _groupBy_initializers, void 0));
                __runInitializers(this, _groupBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date for analytics period' }), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date for analytics period' }), (0, class_validator_1.IsNotEmpty)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _period_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Period granularity', enum: AnalyticsPeriod }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(AnalyticsPeriod)];
            _comparisonStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Comparison period start date' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _comparisonEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Comparison period end date' }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _customerIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by customer IDs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _productIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by product IDs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _orderStatus_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by order status' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _orderSource_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by order source' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _regions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filter by geographic region' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _groupBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Group by fields' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: obj => "period" in obj, get: obj => obj.period, set: (obj, value) => { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
            __esDecorate(null, null, _comparisonStartDate_decorators, { kind: "field", name: "comparisonStartDate", static: false, private: false, access: { has: obj => "comparisonStartDate" in obj, get: obj => obj.comparisonStartDate, set: (obj, value) => { obj.comparisonStartDate = value; } }, metadata: _metadata }, _comparisonStartDate_initializers, _comparisonStartDate_extraInitializers);
            __esDecorate(null, null, _comparisonEndDate_decorators, { kind: "field", name: "comparisonEndDate", static: false, private: false, access: { has: obj => "comparisonEndDate" in obj, get: obj => obj.comparisonEndDate, set: (obj, value) => { obj.comparisonEndDate = value; } }, metadata: _metadata }, _comparisonEndDate_initializers, _comparisonEndDate_extraInitializers);
            __esDecorate(null, null, _customerIds_decorators, { kind: "field", name: "customerIds", static: false, private: false, access: { has: obj => "customerIds" in obj, get: obj => obj.customerIds, set: (obj, value) => { obj.customerIds = value; } }, metadata: _metadata }, _customerIds_initializers, _customerIds_extraInitializers);
            __esDecorate(null, null, _productIds_decorators, { kind: "field", name: "productIds", static: false, private: false, access: { has: obj => "productIds" in obj, get: obj => obj.productIds, set: (obj, value) => { obj.productIds = value; } }, metadata: _metadata }, _productIds_initializers, _productIds_extraInitializers);
            __esDecorate(null, null, _orderStatus_decorators, { kind: "field", name: "orderStatus", static: false, private: false, access: { has: obj => "orderStatus" in obj, get: obj => obj.orderStatus, set: (obj, value) => { obj.orderStatus = value; } }, metadata: _metadata }, _orderStatus_initializers, _orderStatus_extraInitializers);
            __esDecorate(null, null, _orderSource_decorators, { kind: "field", name: "orderSource", static: false, private: false, access: { has: obj => "orderSource" in obj, get: obj => obj.orderSource, set: (obj, value) => { obj.orderSource = value; } }, metadata: _metadata }, _orderSource_initializers, _orderSource_extraInitializers);
            __esDecorate(null, null, _regions_decorators, { kind: "field", name: "regions", static: false, private: false, access: { has: obj => "regions" in obj, get: obj => obj.regions, set: (obj, value) => { obj.regions = value; } }, metadata: _metadata }, _regions_initializers, _regions_extraInitializers);
            __esDecorate(null, null, _groupBy_decorators, { kind: "field", name: "groupBy", static: false, private: false, access: { has: obj => "groupBy" in obj, get: obj => obj.groupBy, set: (obj, value) => { obj.groupBy = value; } }, metadata: _metadata }, _groupBy_initializers, _groupBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AnalyticsQueryDto = AnalyticsQueryDto;
let KpiConfigDto = (() => {
    var _a;
    let _kpiId_decorators;
    let _kpiId_initializers = [];
    let _kpiId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _warningThreshold_decorators;
    let _warningThreshold_initializers = [];
    let _warningThreshold_extraInitializers = [];
    let _criticalThreshold_decorators;
    let _criticalThreshold_initializers = [];
    let _criticalThreshold_extraInitializers = [];
    let _enableAlerts_decorators;
    let _enableAlerts_initializers = [];
    let _enableAlerts_extraInitializers = [];
    return _a = class KpiConfigDto {
            constructor() {
                this.kpiId = __runInitializers(this, _kpiId_initializers, void 0);
                this.name = (__runInitializers(this, _kpiId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.target = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _target_initializers, void 0));
                this.warningThreshold = (__runInitializers(this, _target_extraInitializers), __runInitializers(this, _warningThreshold_initializers, void 0));
                this.criticalThreshold = (__runInitializers(this, _warningThreshold_extraInitializers), __runInitializers(this, _criticalThreshold_initializers, void 0));
                this.enableAlerts = (__runInitializers(this, _criticalThreshold_extraInitializers), __runInitializers(this, _enableAlerts_initializers, false));
                __runInitializers(this, _enableAlerts_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _kpiId_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI identifier' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _target_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _warningThreshold_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Warning threshold' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _criticalThreshold_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Critical threshold' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _enableAlerts_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enable alerts' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _kpiId_decorators, { kind: "field", name: "kpiId", static: false, private: false, access: { has: obj => "kpiId" in obj, get: obj => obj.kpiId, set: (obj, value) => { obj.kpiId = value; } }, metadata: _metadata }, _kpiId_initializers, _kpiId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
            __esDecorate(null, null, _warningThreshold_decorators, { kind: "field", name: "warningThreshold", static: false, private: false, access: { has: obj => "warningThreshold" in obj, get: obj => obj.warningThreshold, set: (obj, value) => { obj.warningThreshold = value; } }, metadata: _metadata }, _warningThreshold_initializers, _warningThreshold_extraInitializers);
            __esDecorate(null, null, _criticalThreshold_decorators, { kind: "field", name: "criticalThreshold", static: false, private: false, access: { has: obj => "criticalThreshold" in obj, get: obj => obj.criticalThreshold, set: (obj, value) => { obj.criticalThreshold = value; } }, metadata: _metadata }, _criticalThreshold_initializers, _criticalThreshold_extraInitializers);
            __esDecorate(null, null, _enableAlerts_decorators, { kind: "field", name: "enableAlerts", static: false, private: false, access: { has: obj => "enableAlerts" in obj, get: obj => obj.enableAlerts, set: (obj, value) => { obj.enableAlerts = value; } }, metadata: _metadata }, _enableAlerts_initializers, _enableAlerts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.KpiConfigDto = KpiConfigDto;
let CustomReportDto = (() => {
    var _a;
    let _reportName_decorators;
    let _reportName_initializers = [];
    let _reportName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _metrics_decorators;
    let _metrics_initializers = [];
    let _metrics_extraInitializers = [];
    let _dimensions_decorators;
    let _dimensions_initializers = [];
    let _dimensions_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _includeVisualizations_decorators;
    let _includeVisualizations_initializers = [];
    let _includeVisualizations_extraInitializers = [];
    let _schedule_decorators;
    let _schedule_initializers = [];
    let _schedule_extraInitializers = [];
    return _a = class CustomReportDto {
            constructor() {
                this.reportName = __runInitializers(this, _reportName_initializers, void 0);
                this.description = (__runInitializers(this, _reportName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.metrics = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _metrics_initializers, void 0));
                this.dimensions = (__runInitializers(this, _metrics_extraInitializers), __runInitializers(this, _dimensions_initializers, void 0));
                this.filters = (__runInitializers(this, _dimensions_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                this.format = (__runInitializers(this, _filters_extraInitializers), __runInitializers(this, _format_initializers, void 0));
                this.includeVisualizations = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _includeVisualizations_initializers, false));
                this.schedule = (__runInitializers(this, _includeVisualizations_extraInitializers), __runInitializers(this, _schedule_initializers, void 0));
                __runInitializers(this, _schedule_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reportName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metrics_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report metrics to include' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsArray)()];
            _dimensions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report dimensions for grouping' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _filters_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report filters' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => AnalyticsQueryDto)];
            _format_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report format', enum: ReportFormat }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(ReportFormat)];
            _includeVisualizations_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include visualizations' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _schedule_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Schedule report generation' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _reportName_decorators, { kind: "field", name: "reportName", static: false, private: false, access: { has: obj => "reportName" in obj, get: obj => obj.reportName, set: (obj, value) => { obj.reportName = value; } }, metadata: _metadata }, _reportName_initializers, _reportName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _metrics_decorators, { kind: "field", name: "metrics", static: false, private: false, access: { has: obj => "metrics" in obj, get: obj => obj.metrics, set: (obj, value) => { obj.metrics = value; } }, metadata: _metadata }, _metrics_initializers, _metrics_extraInitializers);
            __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: obj => "dimensions" in obj, get: obj => obj.dimensions, set: (obj, value) => { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
            __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _includeVisualizations_decorators, { kind: "field", name: "includeVisualizations", static: false, private: false, access: { has: obj => "includeVisualizations" in obj, get: obj => obj.includeVisualizations, set: (obj, value) => { obj.includeVisualizations = value; } }, metadata: _metadata }, _includeVisualizations_initializers, _includeVisualizations_extraInitializers);
            __esDecorate(null, null, _schedule_decorators, { kind: "field", name: "schedule", static: false, private: false, access: { has: obj => "schedule" in obj, get: obj => obj.schedule, set: (obj, value) => { obj.schedule = value; } }, metadata: _metadata }, _schedule_initializers, _schedule_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CustomReportDto = CustomReportDto;
let DashboardConfigDto = (() => {
    var _a;
    let _dashboardId_decorators;
    let _dashboardId_initializers = [];
    let _dashboardId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _widgets_decorators;
    let _widgets_initializers = [];
    let _widgets_extraInitializers = [];
    let _refreshInterval_decorators;
    let _refreshInterval_initializers = [];
    let _refreshInterval_extraInitializers = [];
    let _layout_decorators;
    let _layout_initializers = [];
    let _layout_extraInitializers = [];
    return _a = class DashboardConfigDto {
            constructor() {
                this.dashboardId = __runInitializers(this, _dashboardId_initializers, void 0);
                this.name = (__runInitializers(this, _dashboardId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.widgets = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _widgets_initializers, void 0));
                this.refreshInterval = (__runInitializers(this, _widgets_extraInitializers), __runInitializers(this, _refreshInterval_initializers, void 0));
                this.layout = (__runInitializers(this, _refreshInterval_extraInitializers), __runInitializers(this, _layout_initializers, void 0));
                __runInitializers(this, _layout_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dashboardId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _widgets_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard widgets' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsArray)()];
            _refreshInterval_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Auto-refresh interval in seconds' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(30)];
            _layout_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard layout configuration' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _dashboardId_decorators, { kind: "field", name: "dashboardId", static: false, private: false, access: { has: obj => "dashboardId" in obj, get: obj => obj.dashboardId, set: (obj, value) => { obj.dashboardId = value; } }, metadata: _metadata }, _dashboardId_initializers, _dashboardId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _widgets_decorators, { kind: "field", name: "widgets", static: false, private: false, access: { has: obj => "widgets" in obj, get: obj => obj.widgets, set: (obj, value) => { obj.widgets = value; } }, metadata: _metadata }, _widgets_initializers, _widgets_extraInitializers);
            __esDecorate(null, null, _refreshInterval_decorators, { kind: "field", name: "refreshInterval", static: false, private: false, access: { has: obj => "refreshInterval" in obj, get: obj => obj.refreshInterval, set: (obj, value) => { obj.refreshInterval = value; } }, metadata: _metadata }, _refreshInterval_initializers, _refreshInterval_extraInitializers);
            __esDecorate(null, null, _layout_decorators, { kind: "field", name: "layout", static: false, private: false, access: { has: obj => "layout" in obj, get: obj => obj.layout, set: (obj, value) => { obj.layout = value; } }, metadata: _metadata }, _layout_initializers, _layout_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DashboardConfigDto = DashboardConfigDto;
let ForecastConfigDto = (() => {
    var _a;
    let _metric_decorators;
    let _metric_initializers = [];
    let _metric_extraInitializers = [];
    let _model_decorators;
    let _model_initializers = [];
    let _model_extraInitializers = [];
    let _historicalPeriodDays_decorators;
    let _historicalPeriodDays_initializers = [];
    let _historicalPeriodDays_extraInitializers = [];
    let _forecastPeriodDays_decorators;
    let _forecastPeriodDays_initializers = [];
    let _forecastPeriodDays_extraInitializers = [];
    let _confidenceInterval_decorators;
    let _confidenceInterval_initializers = [];
    let _confidenceInterval_extraInitializers = [];
    let _modelParams_decorators;
    let _modelParams_initializers = [];
    let _modelParams_extraInitializers = [];
    return _a = class ForecastConfigDto {
            constructor() {
                this.metric = __runInitializers(this, _metric_initializers, void 0);
                this.model = (__runInitializers(this, _metric_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.historicalPeriodDays = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _historicalPeriodDays_initializers, void 0));
                this.forecastPeriodDays = (__runInitializers(this, _historicalPeriodDays_extraInitializers), __runInitializers(this, _forecastPeriodDays_initializers, void 0));
                this.confidenceInterval = (__runInitializers(this, _forecastPeriodDays_extraInitializers), __runInitializers(this, _confidenceInterval_initializers, 0.95));
                this.modelParams = (__runInitializers(this, _confidenceInterval_extraInitializers), __runInitializers(this, _modelParams_initializers, void 0));
                __runInitializers(this, _modelParams_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _metric_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric to forecast' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _model_decorators = [(0, swagger_1.ApiProperty)({ description: 'Forecast model', enum: ForecastModel }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(ForecastModel)];
            _historicalPeriodDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Historical data period in days' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(30), (0, class_validator_1.Max)(730)];
            _forecastPeriodDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Forecast period in days' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(365)];
            _confidenceInterval_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Confidence interval (0.0-1.0)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _modelParams_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Model parameters' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _metric_decorators, { kind: "field", name: "metric", static: false, private: false, access: { has: obj => "metric" in obj, get: obj => obj.metric, set: (obj, value) => { obj.metric = value; } }, metadata: _metadata }, _metric_initializers, _metric_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: obj => "model" in obj, get: obj => obj.model, set: (obj, value) => { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _historicalPeriodDays_decorators, { kind: "field", name: "historicalPeriodDays", static: false, private: false, access: { has: obj => "historicalPeriodDays" in obj, get: obj => obj.historicalPeriodDays, set: (obj, value) => { obj.historicalPeriodDays = value; } }, metadata: _metadata }, _historicalPeriodDays_initializers, _historicalPeriodDays_extraInitializers);
            __esDecorate(null, null, _forecastPeriodDays_decorators, { kind: "field", name: "forecastPeriodDays", static: false, private: false, access: { has: obj => "forecastPeriodDays" in obj, get: obj => obj.forecastPeriodDays, set: (obj, value) => { obj.forecastPeriodDays = value; } }, metadata: _metadata }, _forecastPeriodDays_initializers, _forecastPeriodDays_extraInitializers);
            __esDecorate(null, null, _confidenceInterval_decorators, { kind: "field", name: "confidenceInterval", static: false, private: false, access: { has: obj => "confidenceInterval" in obj, get: obj => obj.confidenceInterval, set: (obj, value) => { obj.confidenceInterval = value; } }, metadata: _metadata }, _confidenceInterval_initializers, _confidenceInterval_extraInitializers);
            __esDecorate(null, null, _modelParams_decorators, { kind: "field", name: "modelParams", static: false, private: false, access: { has: obj => "modelParams" in obj, get: obj => obj.modelParams, set: (obj, value) => { obj.modelParams = value; } }, metadata: _metadata }, _modelParams_initializers, _modelParams_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ForecastConfigDto = ForecastConfigDto;
// ============================================================================
// ANALYTICS FUNCTIONS - ORDER METRICS & KPIs
// ============================================================================
/**
 * Calculate comprehensive order volume metrics
 * Provides total orders, average orders per day, growth rates, and period comparisons
 */
async function calculateOrderVolumeMetrics(sequelize, query) {
    const logger = new common_1.Logger('OrderVolumeMetrics');
    try {
        // Get total orders in period
        const [totalResult] = await sequelize.query(`
      SELECT COUNT(DISTINCT o.id) as total_orders
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND (:orderStatus::text[] IS NULL OR o.status = ANY(:orderStatus))
        AND (:orderSource::text[] IS NULL OR o.source = ANY(:orderSource))
        AND o.deleted_at IS NULL
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
                orderStatus: query.orderStatus || null,
                orderSource: query.orderSource || null,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const totalOrders = parseInt(totalResult.total_orders || 0);
        const daysDiff = Math.ceil((query.endDate.getTime() - query.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const averageOrdersPerDay = totalOrders / daysDiff;
        // Get comparison period data if provided
        let growthRate = 0;
        let periodComparison = { value: totalOrders };
        if (query.comparisonStartDate && query.comparisonEndDate) {
            const [comparisonResult] = await sequelize.query(`
        SELECT COUNT(DISTINCT o.id) as total_orders
        FROM orders o
        WHERE o.created_at BETWEEN :comparisonStartDate AND :comparisonEndDate
          AND (:orderStatus::text[] IS NULL OR o.status = ANY(:orderStatus))
          AND (:orderSource::text[] IS NULL OR o.source = ANY(:orderSource))
          AND o.deleted_at IS NULL
        `, {
                replacements: {
                    comparisonStartDate: query.comparisonStartDate,
                    comparisonEndDate: query.comparisonEndDate,
                    orderStatus: query.orderStatus || null,
                    orderSource: query.orderSource || null,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const comparisonTotal = parseInt(comparisonResult.total_orders || 0);
            growthRate = comparisonTotal > 0 ? ((totalOrders - comparisonTotal) / comparisonTotal) * 100 : 0;
            periodComparison = {
                value: totalOrders,
                percentage: growthRate,
                changeFromPrevious: totalOrders - comparisonTotal,
                trend: growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : 'stable',
            };
        }
        // Get time series breakdown
        const periodGrouping = getPeriodGrouping(query.period);
        const breakdown = await sequelize.query(`
      SELECT
        ${periodGrouping} as period,
        COUNT(DISTINCT o.id) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND (:orderStatus::text[] IS NULL OR o.status = ANY(:orderStatus))
        AND (:orderSource::text[] IS NULL OR o.source = ANY(:orderSource))
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
                orderStatus: query.orderStatus || null,
                orderSource: query.orderSource || null,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const timeSeriesData = breakdown.map((row) => ({
            timestamp: new Date(row.period),
            value: parseInt(row.value),
        }));
        logger.log(`Calculated order volume metrics: ${totalOrders} total orders, ${averageOrdersPerDay.toFixed(2)} avg/day`);
        return {
            totalOrders,
            averageOrdersPerDay,
            growthRate,
            periodComparison,
            breakdown: timeSeriesData,
        };
    }
    catch (error) {
        logger.error(`Failed to calculate order volume metrics: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to calculate order volume metrics');
    }
}
/**
 * Calculate average order value (AOV) and related metrics
 */
async function calculateAverageOrderValue(sequelize, query) {
    const logger = new common_1.Logger('AverageOrderValue');
    try {
        const [metrics] = await sequelize.query(`
      SELECT
        AVG(o.total_amount) as avg_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o.total_amount) as median_value,
        MIN(o.total_amount) as min_value,
        MAX(o.total_amount) as max_value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status NOT IN ('CANCELLED', 'DRAFT')
        AND o.deleted_at IS NULL
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get time series breakdown
        const periodGrouping = getPeriodGrouping(query.period);
        const breakdown = await sequelize.query(`
      SELECT
        ${periodGrouping} as period,
        AVG(o.total_amount) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status NOT IN ('CANCELLED', 'DRAFT')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get distribution
        const distribution = await sequelize.query(`
      WITH ranges AS (
        SELECT
          CASE
            WHEN total_amount < 50 THEN '$0-$50'
            WHEN total_amount < 100 THEN '$50-$100'
            WHEN total_amount < 250 THEN '$100-$250'
            WHEN total_amount < 500 THEN '$250-$500'
            WHEN total_amount < 1000 THEN '$500-$1000'
            ELSE '$1000+'
          END as range,
          COUNT(*) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status NOT IN ('CANCELLED', 'DRAFT')
          AND deleted_at IS NULL
        GROUP BY range
      )
      SELECT
        range,
        count,
        ROUND(count * 100.0 / SUM(count) OVER (), 2) as percentage
      FROM ranges
      ORDER BY
        CASE range
          WHEN '$0-$50' THEN 1
          WHEN '$50-$100' THEN 2
          WHEN '$100-$250' THEN 3
          WHEN '$250-$500' THEN 4
          WHEN '$500-$1000' THEN 5
          ELSE 6
        END
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            averageOrderValue: parseFloat(metrics.avg_value || 0),
            medianOrderValue: parseFloat(metrics.median_value || 0),
            minOrderValue: parseFloat(metrics.min_value || 0),
            maxOrderValue: parseFloat(metrics.max_value || 0),
            breakdown: breakdown.map((row) => ({
                timestamp: new Date(row.period),
                value: parseFloat(row.value),
            })),
            distribution: distribution.map((row) => ({
                range: row.range,
                count: parseInt(row.count),
                percentage: parseFloat(row.percentage),
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to calculate average order value: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to calculate average order value');
    }
}
/**
 * Calculate order fulfillment rate and time metrics
 */
async function calculateFulfillmentMetrics(sequelize, query) {
    const logger = new common_1.Logger('FulfillmentMetrics');
    try {
        const [metrics] = await sequelize.query(`
      WITH fulfillment_stats AS (
        SELECT
          o.id,
          o.status,
          o.created_at,
          o.shipped_at,
          o.delivered_at,
          o.expected_delivery_date,
          EXTRACT(EPOCH FROM (COALESCE(o.delivered_at, NOW()) - o.created_at)) / 3600 as fulfillment_hours,
          CASE
            WHEN o.delivered_at IS NOT NULL AND o.delivered_at <= o.expected_delivery_date THEN true
            ELSE false
          END as on_time
        FROM orders o
        WHERE o.created_at BETWEEN :startDate AND :endDate
          AND o.status NOT IN ('CANCELLED', 'DRAFT')
          AND o.deleted_at IS NULL
      )
      SELECT
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_orders,
        AVG(fulfillment_hours) FILTER (WHERE status = 'COMPLETED') as avg_fulfillment_hours,
        COUNT(*) FILTER (WHERE on_time = true) as on_time_deliveries,
        COUNT(*) FILTER (WHERE delivered_at IS NOT NULL) as delivered_orders
      FROM fulfillment_stats
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const totalOrders = parseInt(metrics.total_orders || 0);
        const completedOrders = parseInt(metrics.completed_orders || 0);
        const deliveredOrders = parseInt(metrics.delivered_orders || 0);
        const onTimeDeliveries = parseInt(metrics.on_time_deliveries || 0);
        const fulfillmentRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
        const onTimeDeliveryRate = deliveredOrders > 0 ? (onTimeDeliveries / deliveredOrders) * 100 : 0;
        const averageFulfillmentTime = parseFloat(metrics.avg_fulfillment_hours || 0);
        // Get status distribution
        const statusDistribution = await sequelize.query(`
      SELECT
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM orders
      WHERE created_at BETWEEN :startDate AND :endDate
        AND deleted_at IS NULL
      GROUP BY status
      ORDER BY count DESC
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get time series breakdown
        const periodGrouping = getPeriodGrouping(query.period);
        const breakdown = await sequelize.query(`
      SELECT
        ${periodGrouping} as period,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') * 100.0 / NULLIF(COUNT(*), 0) as value
      FROM orders
      WHERE created_at BETWEEN :startDate AND :endDate
        AND status NOT IN ('DRAFT')
        AND deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            fulfillmentRate,
            averageFulfillmentTime,
            onTimeDeliveryRate,
            breakdown: breakdown.map((row) => ({
                timestamp: new Date(row.period),
                value: parseFloat(row.value || 0),
            })),
            statusDistribution: statusDistribution.map((row) => ({
                status: row.status,
                count: parseInt(row.count),
                percentage: parseFloat(row.percentage),
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to calculate fulfillment metrics: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to calculate fulfillment metrics');
    }
}
// ============================================================================
// SALES ANALYTICS
// ============================================================================
/**
 * Calculate comprehensive revenue metrics
 */
async function calculateRevenueMetrics(sequelize, query) {
    const logger = new common_1.Logger('RevenueMetrics');
    try {
        const [metrics] = await sequelize.query(`
      SELECT
        SUM(o.total_amount) as total_revenue,
        SUM(o.total_amount - COALESCE(o.discount_amount, 0) - COALESCE(o.tax_amount, 0)) as net_revenue,
        SUM(o.total_amount - COALESCE(o.cost_amount, 0)) as gross_profit
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const totalRevenue = parseFloat(metrics.total_revenue || 0);
        const netRevenue = parseFloat(metrics.net_revenue || 0);
        const grossProfit = parseFloat(metrics.gross_profit || 0);
        const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
        // Get growth rate
        let revenueGrowth = 0;
        if (query.comparisonStartDate && query.comparisonEndDate) {
            const [comparisonMetrics] = await sequelize.query(`
        SELECT SUM(o.total_amount) as total_revenue
        FROM orders o
        WHERE o.created_at BETWEEN :comparisonStartDate AND :comparisonEndDate
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        `, {
                replacements: {
                    comparisonStartDate: query.comparisonStartDate,
                    comparisonEndDate: query.comparisonEndDate,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const comparisonRevenue = parseFloat(comparisonMetrics.total_revenue || 0);
            revenueGrowth = comparisonRevenue > 0 ? ((totalRevenue - comparisonRevenue) / comparisonRevenue) * 100 : 0;
        }
        // Get revenue by channel
        const byChannel = await sequelize.query(`
      SELECT
        o.source as channel,
        SUM(o.total_amount) as revenue,
        ROUND(SUM(o.total_amount) * 100.0 / SUM(SUM(o.total_amount)) OVER (), 2) as percentage
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY o.source
      ORDER BY revenue DESC
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get time series breakdown
        const periodGrouping = getPeriodGrouping(query.period);
        const breakdown = await sequelize.query(`
      SELECT
        ${periodGrouping} as period,
        SUM(o.total_amount) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            totalRevenue,
            netRevenue,
            grossProfit,
            grossMargin,
            revenueGrowth,
            breakdown: breakdown.map((row) => ({
                timestamp: new Date(row.period),
                value: parseFloat(row.value || 0),
            })),
            byChannel: byChannel.map((row) => ({
                channel: row.channel,
                revenue: parseFloat(row.revenue),
                percentage: parseFloat(row.percentage),
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to calculate revenue metrics: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to calculate revenue metrics');
    }
}
/**
 * Analyze sales conversion funnel
 */
async function analyzeSalesConversionFunnel(sequelize, query) {
    const logger = new common_1.Logger('SalesConversionFunnel');
    try {
        const stages = await sequelize.query(`
      WITH funnel_stages AS (
        SELECT
          'Browsing' as stage, 1 as stage_order, COUNT(DISTINCT session_id) as count
        FROM user_sessions
        WHERE created_at BETWEEN :startDate AND :endDate

        UNION ALL

        SELECT
          'Cart Created' as stage, 2 as stage_order, COUNT(DISTINCT cart_id) as count
        FROM shopping_carts
        WHERE created_at BETWEEN :startDate AND :endDate

        UNION ALL

        SELECT
          'Checkout Started' as stage, 3 as stage_order, COUNT(DISTINCT id) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status != 'DRAFT'

        UNION ALL

        SELECT
          'Payment Completed' as stage, 4 as stage_order, COUNT(DISTINCT id) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status NOT IN ('DRAFT', 'CANCELLED')

        UNION ALL

        SELECT
          'Order Completed' as stage, 5 as stage_order, COUNT(DISTINCT id) as count
        FROM orders
        WHERE created_at BETWEEN :startDate AND :endDate
          AND status = 'COMPLETED'
      )
      SELECT
        stage,
        count,
        ROUND(count * 100.0 / FIRST_VALUE(count) OVER (ORDER BY stage_order), 2) as conversion_rate,
        ROUND((LAG(count) OVER (ORDER BY stage_order) - count) * 100.0 /
              NULLIF(LAG(count) OVER (ORDER BY stage_order), 0), 2) as drop_off_rate
      FROM funnel_stages
      ORDER BY stage_order
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const firstStageCount = stages[0]?.count || 1;
        const lastStageCount = stages[stages.length - 1]?.count || 0;
        const overallConversionRate = (lastStageCount / firstStageCount) * 100;
        // Calculate average time to convert
        const [timeMetrics] = await sequelize.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600) as avg_hours
      FROM orders
      WHERE created_at BETWEEN :startDate AND :endDate
        AND status = 'COMPLETED'
        AND completed_at IS NOT NULL
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            stages: stages.map((row) => ({
                stage: row.stage,
                count: parseInt(row.count),
                conversionRate: parseFloat(row.conversion_rate || 0),
                dropOffRate: parseFloat(row.drop_off_rate || 0),
            })),
            overallConversionRate,
            averageTimeToConvert: parseFloat(timeMetrics.avg_hours || 0),
        };
    }
    catch (error) {
        logger.error(`Failed to analyze sales conversion funnel: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to analyze sales conversion funnel');
    }
}
/**
 * Calculate sales by product category
 */
async function calculateSalesByCategory(sequelize, query) {
    const logger = new common_1.Logger('SalesByCategory');
    try {
        const categories = await sequelize.query(`
      SELECT
        p.category_id as category_id,
        pc.name as category_name,
        SUM(oi.subtotal) as revenue,
        COUNT(DISTINCT oi.order_id) as orders,
        SUM(oi.quantity) as units,
        ROUND(SUM(oi.subtotal) * 100.0 / SUM(SUM(oi.subtotal)) OVER (), 2) as percentage
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      JOIN product_categories pc ON pc.id = p.category_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.category_id, pc.name
      ORDER BY revenue DESC
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const sortedByRevenue = [...categories].sort((a, b) => b.revenue - a.revenue);
        const topPerforming = sortedByRevenue.slice(0, 5);
        const underPerforming = sortedByRevenue.slice(-5).reverse();
        return {
            categories: categories.map((row) => ({
                categoryId: row.category_id,
                categoryName: row.category_name,
                revenue: parseFloat(row.revenue),
                orders: parseInt(row.orders),
                units: parseInt(row.units),
                percentage: parseFloat(row.percentage),
            })),
            topPerforming,
            underPerforming,
        };
    }
    catch (error) {
        logger.error(`Failed to calculate sales by category: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to calculate sales by category');
    }
}
// ============================================================================
// CUSTOMER ANALYTICS
// ============================================================================
/**
 * Calculate customer lifetime value (CLV) metrics
 */
async function calculateCustomerLifetimeValue(sequelize, query) {
    const logger = new common_1.Logger('CustomerLifetimeValue');
    try {
        const [metrics] = await sequelize.query(`
      WITH customer_clv AS (
        SELECT
          o.customer_id,
          SUM(o.total_amount) as lifetime_value,
          COUNT(*) as order_count
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      )
      SELECT
        AVG(lifetime_value) as avg_clv,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY lifetime_value) as median_clv
      FROM customer_clv
      `, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get top customers
        const topCustomers = await sequelize.query(`
      WITH customer_clv AS (
        SELECT
          o.customer_id,
          c.name as customer_name,
          SUM(o.total_amount) as lifetime_value,
          COUNT(*) as order_count
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id, c.name
      )
      SELECT *
      FROM customer_clv
      ORDER BY lifetime_value DESC
      LIMIT 20
      `, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get CLV distribution
        const clvDistribution = await sequelize.query(`
      WITH customer_clv AS (
        SELECT
          o.customer_id,
          SUM(o.total_amount) as lifetime_value
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      ),
      ranges AS (
        SELECT
          CASE
            WHEN lifetime_value < 100 THEN '$0-$100'
            WHEN lifetime_value < 500 THEN '$100-$500'
            WHEN lifetime_value < 1000 THEN '$500-$1000'
            WHEN lifetime_value < 5000 THEN '$1000-$5000'
            WHEN lifetime_value < 10000 THEN '$5000-$10000'
            ELSE '$10000+'
          END as range,
          COUNT(*) as count
        FROM customer_clv
        GROUP BY range
      )
      SELECT
        range,
        count,
        ROUND(count * 100.0 / SUM(count) OVER (), 2) as percentage
      FROM ranges
      ORDER BY
        CASE range
          WHEN '$0-$100' THEN 1
          WHEN '$100-$500' THEN 2
          WHEN '$500-$1000' THEN 3
          WHEN '$1000-$5000' THEN 4
          WHEN '$5000-$10000' THEN 5
          ELSE 6
        END
      `, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            averageCLV: parseFloat(metrics.avg_clv || 0),
            medianCLV: parseFloat(metrics.median_clv || 0),
            topCustomers: topCustomers.map((row) => ({
                customerId: row.customer_id,
                customerName: row.customer_name,
                clv: parseFloat(row.lifetime_value),
                orderCount: parseInt(row.order_count),
            })),
            clvDistribution: clvDistribution.map((row) => ({
                range: row.range,
                count: parseInt(row.count),
                percentage: parseFloat(row.percentage),
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to calculate customer lifetime value: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to calculate customer lifetime value');
    }
}
/**
 * Analyze customer retention and churn
 */
async function analyzeCustomerRetention(sequelize, query) {
    const logger = new common_1.Logger('CustomerRetention');
    try {
        // Calculate retention metrics
        const [metrics] = await sequelize.query(`
      WITH customer_stats AS (
        SELECT
          customer_id,
          MIN(created_at) as first_order_date,
          MAX(created_at) as last_order_date,
          COUNT(*) as order_count
        FROM orders
        WHERE status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND deleted_at IS NULL
        GROUP BY customer_id
      )
      SELECT
        COUNT(DISTINCT CASE WHEN order_count > 1 THEN customer_id END) * 100.0 /
          NULLIF(COUNT(DISTINCT customer_id), 0) as repeat_customer_rate,
        COUNT(DISTINCT CASE
          WHEN last_order_date >= :startDate - INTERVAL '90 days' THEN customer_id
        END) * 100.0 / NULLIF(COUNT(DISTINCT customer_id), 0) as retention_rate,
        COUNT(DISTINCT CASE
          WHEN last_order_date < :startDate - INTERVAL '90 days' THEN customer_id
        END) * 100.0 / NULLIF(COUNT(DISTINCT customer_id), 0) as churn_rate
      FROM customer_stats
      WHERE first_order_date < :startDate
      `, {
            replacements: {
                startDate: query.startDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Cohort analysis
        const cohortAnalysis = await sequelize.query(`
      WITH first_orders AS (
        SELECT
          customer_id,
          DATE_TRUNC('month', MIN(created_at)) as cohort_month
        FROM orders
        WHERE status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND deleted_at IS NULL
        GROUP BY customer_id
      ),
      cohort_customers AS (
        SELECT
          fo.cohort_month,
          COUNT(DISTINCT fo.customer_id) as total_customers,
          COUNT(DISTINCT CASE
            WHEN o.created_at >= :startDate THEN o.customer_id
          END) as retained_customers
        FROM first_orders fo
        LEFT JOIN orders o ON o.customer_id = fo.customer_id
          AND o.created_at >= :startDate
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        WHERE fo.cohort_month >= :startDate - INTERVAL '12 months'
          AND fo.cohort_month < :startDate
        GROUP BY fo.cohort_month
      )
      SELECT
        TO_CHAR(cohort_month, 'YYYY-MM') as cohort,
        total_customers as customers,
        retained_customers as retained,
        ROUND(retained_customers * 100.0 / NULLIF(total_customers, 0), 2) as retention_rate
      FROM cohort_customers
      ORDER BY cohort_month DESC
      `, {
            replacements: {
                startDate: query.startDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            retentionRate: parseFloat(metrics.retention_rate || 0),
            churnRate: parseFloat(metrics.churn_rate || 0),
            repeatCustomerRate: parseFloat(metrics.repeat_customer_rate || 0),
            cohortAnalysis: cohortAnalysis.map((row) => ({
                cohort: row.cohort,
                customers: parseInt(row.customers),
                retained: parseInt(row.retained),
                retentionRate: parseFloat(row.retention_rate),
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to analyze customer retention: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to analyze customer retention');
    }
}
/**
 * Segment customers by RFM (Recency, Frequency, Monetary) analysis
 */
async function segmentCustomersByRFM(sequelize, query) {
    const logger = new common_1.Logger('CustomerRFMSegmentation');
    try {
        const rfmSegments = await sequelize.query(`
      WITH customer_rfm AS (
        SELECT
          o.customer_id,
          EXTRACT(DAYS FROM (NOW() - MAX(o.created_at))) as recency_days,
          COUNT(DISTINCT o.id) as frequency,
          SUM(o.total_amount) as monetary
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      ),
      rfm_scores AS (
        SELECT
          customer_id,
          recency_days,
          frequency,
          monetary,
          NTILE(5) OVER (ORDER BY recency_days DESC) as recency_score,
          NTILE(5) OVER (ORDER BY frequency ASC) as frequency_score,
          NTILE(5) OVER (ORDER BY monetary ASC) as monetary_score
        FROM customer_rfm
      ),
      segmented AS (
        SELECT
          customer_id,
          recency_score,
          frequency_score,
          monetary_score,
          monetary,
          CASE
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
            WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
            WHEN recency_score >= 4 AND frequency_score <= 2 THEN 'Potential Loyalists'
            WHEN recency_score >= 3 AND monetary_score >= 4 THEN 'Big Spenders'
            WHEN recency_score <= 2 AND frequency_score >= 3 THEN 'At Risk'
            WHEN recency_score <= 1 AND frequency_score >= 4 THEN 'Cant Lose Them'
            WHEN recency_score >= 4 AND frequency_score <= 1 THEN 'New Customers'
            WHEN recency_score <= 2 AND frequency_score <= 2 THEN 'Hibernating'
            ELSE 'Need Attention'
          END as segment
        FROM rfm_scores
      )
      SELECT
        segment,
        COUNT(*) as customers,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
        AVG(monetary) as avg_revenue
      FROM segmented
      GROUP BY segment
      ORDER BY customers DESC
      `, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get individual customer segments
        const customerSegments = await sequelize.query(`
      WITH customer_rfm AS (
        SELECT
          o.customer_id,
          EXTRACT(DAYS FROM (NOW() - MAX(o.created_at))) as recency_days,
          COUNT(DISTINCT o.id) as frequency,
          SUM(o.total_amount) as monetary
        FROM orders o
        WHERE o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY o.customer_id
      ),
      rfm_scores AS (
        SELECT
          customer_id,
          NTILE(5) OVER (ORDER BY recency_days DESC) as recency_score,
          NTILE(5) OVER (ORDER BY frequency ASC) as frequency_score,
          NTILE(5) OVER (ORDER BY monetary ASC) as monetary_score
        FROM customer_rfm
      )
      SELECT
        customer_id,
        recency_score,
        frequency_score,
        monetary_score,
        CASE
          WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
          WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
          WHEN recency_score >= 4 AND frequency_score <= 2 THEN 'Potential Loyalists'
          WHEN recency_score >= 3 AND monetary_score >= 4 THEN 'Big Spenders'
          WHEN recency_score <= 2 AND frequency_score >= 3 THEN 'At Risk'
          WHEN recency_score <= 1 AND frequency_score >= 4 THEN 'Cant Lose Them'
          WHEN recency_score >= 4 AND frequency_score <= 1 THEN 'New Customers'
          WHEN recency_score <= 2 AND frequency_score <= 2 THEN 'Hibernating'
          ELSE 'Need Attention'
        END as segment
      FROM rfm_scores
      LIMIT 1000
      `, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            segments: rfmSegments.map((row) => ({
                segment: row.segment,
                customers: parseInt(row.customers),
                percentage: parseFloat(row.percentage),
                avgRevenue: parseFloat(row.avg_revenue),
            })),
            customerSegments: customerSegments.map((row) => ({
                customerId: row.customer_id,
                recencyScore: parseInt(row.recency_score),
                frequencyScore: parseInt(row.frequency_score),
                monetaryScore: parseInt(row.monetary_score),
                segment: row.segment,
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to segment customers by RFM: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to segment customers by RFM');
    }
}
// ============================================================================
// PRODUCT ANALYTICS
// ============================================================================
/**
 * Analyze top-performing products
 */
async function analyzeTopPerformingProducts(sequelize, query, limit = 50) {
    const logger = new common_1.Logger('TopPerformingProducts');
    try {
        // Top by revenue
        const topByRevenue = await sequelize.query(`
      SELECT
        p.id as product_id,
        p.name as product_name,
        SUM(oi.subtotal) as revenue,
        SUM(oi.quantity) as units,
        COUNT(DISTINCT oi.order_id) as orders
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT :limit
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
                limit,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Top by units
        const topByUnits = await sequelize.query(`
      SELECT
        p.id as product_id,
        p.name as product_name,
        SUM(oi.quantity) as units,
        SUM(oi.subtotal) as revenue,
        COUNT(DISTINCT oi.order_id) as orders
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY units DESC
      LIMIT :limit
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
                limit,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Top by orders
        const topByOrders = await sequelize.query(`
      SELECT
        p.id as product_id,
        p.name as product_name,
        COUNT(DISTINCT oi.order_id) as orders,
        SUM(oi.subtotal) as revenue,
        SUM(oi.quantity) as units
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY orders DESC
      LIMIT :limit
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
                limit,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const mapProduct = (row) => ({
            productId: row.product_id,
            productName: row.product_name,
            revenue: parseFloat(row.revenue || 0),
            units: parseInt(row.units || 0),
            orders: parseInt(row.orders || 0),
        });
        return {
            topByRevenue: topByRevenue.map(mapProduct),
            topByUnits: topByUnits.map(mapProduct),
            topByOrders: topByOrders.map(mapProduct),
        };
    }
    catch (error) {
        logger.error(`Failed to analyze top performing products: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to analyze top performing products');
    }
}
/**
 * Analyze product performance trends
 */
async function analyzeProductPerformanceTrends(sequelize, productId, query) {
    const logger = new common_1.Logger('ProductPerformanceTrends');
    try {
        // Get product info
        const [productInfo] = await sequelize.query(`
      SELECT
        p.id as product_id,
        p.name as product_name,
        pc.name as category
      FROM products p
      JOIN product_categories pc ON pc.id = p.category_id
      WHERE p.id = :productId
      `, {
            replacements: { productId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!productInfo) {
            throw new common_1.NotFoundException('Product not found');
        }
        // Get sales trend
        const periodGrouping = getPeriodGrouping(query.period);
        const salesTrend = await sequelize.query(`
      SELECT
        ${periodGrouping} as period,
        SUM(oi.subtotal) as value
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.product_id = :productId
        AND o.created_at BETWEEN :startDate AND :endDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `, {
            replacements: {
                productId,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Calculate seasonality index
        const seasonality = await sequelize.query(`
      WITH monthly_sales AS (
        SELECT
          EXTRACT(MONTH FROM o.created_at) as month,
          SUM(oi.subtotal) as revenue
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.product_id = :productId
          AND o.created_at >= NOW() - INTERVAL '2 years'
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY month
      ),
      avg_monthly AS (
        SELECT AVG(revenue) as avg_revenue
        FROM monthly_sales
      )
      SELECT
        ms.month,
        ROUND((ms.revenue / am.avg_revenue) * 100, 2) as index_value
      FROM monthly_sales ms
      CROSS JOIN avg_monthly am
      ORDER BY ms.month
      `, {
            replacements: { productId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Calculate growth rate
        let growthRate = 0;
        let performance = 'stable';
        if (salesTrend.length >= 2) {
            const firstPeriodRevenue = parseFloat(salesTrend[0].value || 0);
            const lastPeriodRevenue = parseFloat(salesTrend[salesTrend.length - 1].value || 0);
            if (firstPeriodRevenue > 0) {
                growthRate = ((lastPeriodRevenue - firstPeriodRevenue) / firstPeriodRevenue) * 100;
                performance = growthRate > 10 ? 'growing' : growthRate < -10 ? 'declining' : 'stable';
            }
        }
        return {
            productInfo: {
                productId: productInfo.product_id,
                productName: productInfo.product_name,
                category: productInfo.category,
            },
            salesTrend: salesTrend.map((row) => ({
                timestamp: new Date(row.period),
                value: parseFloat(row.value || 0),
            })),
            seasonalityIndex: seasonality.map((row) => ({
                month: parseInt(row.month),
                indexValue: parseFloat(row.index_value),
            })),
            growthRate,
            performance,
        };
    }
    catch (error) {
        logger.error(`Failed to analyze product performance trends: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to analyze product performance trends');
    }
}
/**
 * Analyze product cross-sell and upsell opportunities
 */
async function analyzeProductAffinity(sequelize, productId, minSupport = 0.01, minConfidence = 0.3) {
    const logger = new common_1.Logger('ProductAffinity');
    try {
        // Find frequently bought together products
        const frequentlyBoughtTogether = await sequelize.query(`
      WITH product_pairs AS (
        SELECT
          oi1.order_id,
          oi2.product_id as companion_product_id
        FROM order_items oi1
        JOIN order_items oi2 ON oi2.order_id = oi1.order_id AND oi2.product_id != oi1.product_id
        JOIN orders o ON o.id = oi1.order_id
        WHERE oi1.product_id = :productId
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
      ),
      pair_counts AS (
        SELECT
          companion_product_id,
          COUNT(*) as pair_count
        FROM product_pairs
        GROUP BY companion_product_id
      ),
      base_count AS (
        SELECT COUNT(DISTINCT oi.order_id) as total_orders
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.product_id = :productId
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
      )
      SELECT
        p.id as product_id,
        p.name as product_name,
        pc.pair_count as frequency,
        ROUND(pc.pair_count * 100.0 / bc.total_orders, 2) as confidence
      FROM pair_counts pc
      JOIN products p ON p.id = pc.companion_product_id
      CROSS JOIN base_count bc
      WHERE pc.pair_count * 1.0 / bc.total_orders >= :minConfidence
      ORDER BY frequency DESC
      LIMIT 20
      `, {
            replacements: {
                productId,
                minConfidence,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Find upsell opportunities
        const recommendedUpsells = await sequelize.query(`
      WITH base_product AS (
        SELECT price, category_id
        FROM products
        WHERE id = :productId
      ),
      upsell_candidates AS (
        SELECT
          p.id as product_id,
          p.name as product_name,
          p.price,
          COUNT(DISTINCT o.customer_id) as customer_count
        FROM products p
        JOIN order_items oi ON oi.product_id = p.id
        JOIN orders o ON o.id = oi.order_id
        CROSS JOIN base_product bp
        WHERE p.category_id = bp.category_id
          AND p.price > bp.price
          AND p.price <= bp.price * 1.5
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
        GROUP BY p.id, p.name, p.price
      ),
      base_customers AS (
        SELECT COUNT(DISTINCT o.customer_id) as total_customers
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.product_id = :productId
          AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
          AND o.deleted_at IS NULL
      )
      SELECT
        uc.product_id,
        uc.product_name,
        ROUND(uc.price - bp.price, 2) as price_difference,
        ROUND(uc.customer_count * 100.0 / bc.total_customers, 2) as conversion_rate
      FROM upsell_candidates uc
      CROSS JOIN base_product bp
      CROSS JOIN base_customers bc
      WHERE uc.customer_count * 1.0 / bc.total_customers >= 0.05
      ORDER BY conversion_rate DESC
      LIMIT 10
      `, {
            replacements: { productId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            frequentlyBoughtTogether: frequentlyBoughtTogether.map((row) => ({
                productId: row.product_id,
                productName: row.product_name,
                frequency: parseInt(row.frequency),
                confidence: parseFloat(row.confidence),
            })),
            recommendedUpsells: recommendedUpsells.map((row) => ({
                productId: row.product_id,
                productName: row.product_name,
                priceDifference: parseFloat(row.price_difference),
                conversionRate: parseFloat(row.conversion_rate),
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to analyze product affinity: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to analyze product affinity');
    }
}
// ============================================================================
// FORECASTING & TREND ANALYSIS
// ============================================================================
/**
 * Generate sales forecast using linear regression
 */
async function generateSalesForecast(sequelize, config) {
    const logger = new common_1.Logger('SalesForecast');
    try {
        const historicalStartDate = new Date();
        historicalStartDate.setDate(historicalStartDate.getDate() - config.historicalPeriodDays);
        // Get historical data
        const historicalData = await sequelize.query(`
      SELECT
        DATE_TRUNC('day', o.created_at) as period,
        SUM(o.total_amount) as value
      FROM orders o
      WHERE o.created_at >= :startDate
        AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `, {
            replacements: { startDate: historicalStartDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const timeSeries = historicalData.map((row) => ({
            timestamp: new Date(row.period),
            value: parseFloat(row.value || 0),
        }));
        // Simple linear regression
        const n = timeSeries.length;
        const xValues = timeSeries.map((_, i) => i);
        const yValues = timeSeries.map(point => point.value);
        const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
        const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
            denominator += Math.pow(xValues[i] - xMean, 2);
        }
        const slope = numerator / denominator;
        const intercept = yMean - slope * xMean;
        // Generate forecast
        const forecastData = [];
        const lastDate = timeSeries[timeSeries.length - 1].timestamp;
        for (let i = 1; i <= config.forecastPeriodDays; i++) {
            const forecastDate = new Date(lastDate);
            forecastDate.setDate(forecastDate.getDate() + i);
            const forecastValue = slope * (n + i - 1) + intercept;
            forecastData.push({
                timestamp: forecastDate,
                value: Math.max(0, forecastValue),
            });
        }
        // Calculate standard error for confidence intervals
        let sumSquaredErrors = 0;
        for (let i = 0; i < n; i++) {
            const predicted = slope * i + intercept;
            sumSquaredErrors += Math.pow(yValues[i] - predicted, 2);
        }
        const standardError = Math.sqrt(sumSquaredErrors / (n - 2));
        // Z-score for 95% confidence interval
        const zScore = 1.96;
        const confidenceMargin = zScore * standardError;
        const upperConfidence = forecastData.map(point => ({
            timestamp: point.timestamp,
            value: point.value + confidenceMargin,
        }));
        const lowerConfidence = forecastData.map(point => ({
            timestamp: point.timestamp,
            value: Math.max(0, point.value - confidenceMargin),
        }));
        // Calculate accuracy metrics on historical data
        let mae = 0;
        let mse = 0;
        let mape = 0;
        for (let i = 0; i < n; i++) {
            const predicted = slope * i + intercept;
            const actual = yValues[i];
            const error = actual - predicted;
            mae += Math.abs(error);
            mse += error * error;
            if (actual !== 0) {
                mape += Math.abs(error / actual);
            }
        }
        mae /= n;
        const rmse = Math.sqrt(mse / n);
        mape = (mape / n) * 100;
        logger.log(`Generated sales forecast for ${config.forecastPeriodDays} days`);
        return {
            historicalData: timeSeries,
            forecastData,
            confidence: {
                upper: upperConfidence,
                lower: lowerConfidence,
            },
            accuracy: {
                mae,
                rmse,
                mape,
            },
        };
    }
    catch (error) {
        logger.error(`Failed to generate sales forecast: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to generate sales forecast');
    }
}
/**
 * Detect trends and anomalies in order data
 */
async function detectOrderTrendsAndAnomalies(sequelize, query) {
    const logger = new common_1.Logger('TrendAnomalyDetection');
    try {
        const periodGrouping = getPeriodGrouping(query.period);
        const timeSeries = await sequelize.query(`
      SELECT
        ${periodGrouping} as period,
        COUNT(DISTINCT o.id) as value
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.deleted_at IS NULL
      GROUP BY period
      ORDER BY period
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const values = timeSeries.map((row) => parseFloat(row.value || 0));
        const n = values.length;
        if (n < 3) {
            throw new common_1.BadRequestException('Insufficient data for trend analysis');
        }
        // Calculate trend using linear regression
        const xValues = values.map((_, i) => i);
        const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
        const yMean = values.reduce((sum, y) => sum + y, 0) / n;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (values[i] - yMean);
            denominator += Math.pow(i - xMean, 2);
        }
        const slope = numerator / denominator;
        const intercept = yMean - slope * xMean;
        // Determine trend direction and strength
        const trendStrength = Math.abs(slope / yMean) * 100;
        const trend = slope > yMean * 0.05 ? 'upward' :
            slope < -yMean * 0.05 ? 'downward' :
                'stable';
        // Detect anomalies using standard deviation
        const mean = yMean;
        const variance = values.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        const anomalies = [];
        for (let i = 0; i < n; i++) {
            const expectedValue = slope * i + intercept;
            const actualValue = values[i];
            const deviation = Math.abs(actualValue - expectedValue);
            const zScore = deviation / stdDev;
            if (zScore > 2) {
                anomalies.push({
                    timestamp: new Date(timeSeries[i].period),
                    value: actualValue,
                    expectedValue,
                    deviation,
                    severity: zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low',
                });
            }
        }
        // Detect seasonal pattern (simple check for cyclical behavior)
        let seasonalPattern = false;
        if (n >= 12) {
            const periods = [7, 30, 90]; // Weekly, monthly, quarterly
            for (const period of periods) {
                if (n >= period * 2) {
                    let correlation = 0;
                    for (let i = 0; i < n - period; i++) {
                        correlation += values[i] * values[i + period];
                    }
                    correlation /= (n - period);
                    if (correlation > mean * mean * 0.7) {
                        seasonalPattern = true;
                        break;
                    }
                }
            }
        }
        logger.log(`Detected ${trend} trend with ${anomalies.length} anomalies`);
        return {
            trend,
            trendStrength,
            anomalies,
            seasonalPattern,
        };
    }
    catch (error) {
        logger.error(`Failed to detect trends and anomalies: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to detect trends and anomalies');
    }
}
// ============================================================================
// DASHBOARD & REPORTING
// ============================================================================
/**
 * Generate executive dashboard with key metrics
 */
async function generateExecutiveDashboard(sequelize, query) {
    const logger = new common_1.Logger('ExecutiveDashboard');
    try {
        // Calculate KPIs with period comparison
        const [currentMetrics] = await sequelize.query(`
      SELECT
        SUM(o.total_amount) as total_revenue,
        COUNT(DISTINCT o.id) as total_orders,
        AVG(o.total_amount) as avg_order_value,
        COUNT(DISTINCT o.customer_id) as customer_count,
        COUNT(*) FILTER (WHERE o.status = 'COMPLETED') * 100.0 / NULLIF(COUNT(*), 0) as fulfillment_rate
      FROM orders o
      WHERE o.created_at BETWEEN :startDate AND :endDate
        AND o.status NOT IN ('DRAFT', 'CANCELLED')
        AND o.deleted_at IS NULL
      `, {
            replacements: {
                startDate: query.startDate,
                endDate: query.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get comparison metrics if available
        let comparisonMetrics = null;
        if (query.comparisonStartDate && query.comparisonEndDate) {
            [comparisonMetrics] = await sequelize.query(`
        SELECT
          SUM(o.total_amount) as total_revenue,
          COUNT(DISTINCT o.id) as total_orders,
          AVG(o.total_amount) as avg_order_value,
          COUNT(DISTINCT o.customer_id) as customer_count,
          COUNT(*) FILTER (WHERE o.status = 'COMPLETED') * 100.0 / NULLIF(COUNT(*), 0) as fulfillment_rate
        FROM orders o
        WHERE o.created_at BETWEEN :comparisonStartDate AND :comparisonEndDate
          AND o.status NOT IN ('DRAFT', 'CANCELLED')
          AND o.deleted_at IS NULL
        `, {
                replacements: {
                    comparisonStartDate: query.comparisonStartDate,
                    comparisonEndDate: query.comparisonEndDate,
                },
                type: sequelize_1.QueryTypes.SELECT,
            });
        }
        const createMetricValue = (current, comparison) => {
            if (comparison === null) {
                return { value: current };
            }
            const change = current - comparison;
            const percentage = comparison !== 0 ? (change / comparison) * 100 : 0;
            return {
                value: current,
                percentage,
                changeFromPrevious: change,
                trend: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
            };
        };
        const kpis = {
            totalRevenue: createMetricValue(parseFloat(currentMetrics.total_revenue || 0), comparisonMetrics ? parseFloat(comparisonMetrics.total_revenue || 0) : null),
            totalOrders: createMetricValue(parseInt(currentMetrics.total_orders || 0), comparisonMetrics ? parseInt(comparisonMetrics.total_orders || 0) : null),
            averageOrderValue: createMetricValue(parseFloat(currentMetrics.avg_order_value || 0), comparisonMetrics ? parseFloat(comparisonMetrics.avg_order_value || 0) : null),
            customerCount: createMetricValue(parseInt(currentMetrics.customer_count || 0), comparisonMetrics ? parseInt(comparisonMetrics.customer_count || 0) : null),
            fulfillmentRate: createMetricValue(parseFloat(currentMetrics.fulfillment_rate || 0), comparisonMetrics ? parseFloat(comparisonMetrics.fulfillment_rate || 0) : null),
        };
        // Generate charts
        const charts = [
            {
                id: 'revenue-trend',
                type: DashboardWidgetType.LINE_CHART,
                title: 'Revenue Trend',
                data: await getRevenueTrendData(sequelize, query),
                position: { x: 0, y: 0, width: 6, height: 3 },
            },
            {
                id: 'orders-by-status',
                type: DashboardWidgetType.PIE_CHART,
                title: 'Orders by Status',
                data: await getOrdersByStatusData(sequelize, query),
                position: { x: 6, y: 0, width: 3, height: 3 },
            },
            {
                id: 'sales-by-channel',
                type: DashboardWidgetType.BAR_CHART,
                title: 'Sales by Channel',
                data: await getSalesByChannelData(sequelize, query),
                position: { x: 9, y: 0, width: 3, height: 3 },
            },
        ];
        // Generate alerts based on thresholds
        const alerts = [];
        if (kpis.fulfillmentRate.value < 85) {
            alerts.push({
                severity: 'critical',
                message: `Fulfillment rate is ${kpis.fulfillmentRate.value.toFixed(1)}%, below target of 85%`,
                metric: 'fulfillmentRate',
            });
        }
        if (kpis.totalRevenue.trend === 'down' && Math.abs(kpis.totalRevenue.percentage || 0) > 10) {
            alerts.push({
                severity: 'warning',
                message: `Revenue decreased by ${Math.abs(kpis.totalRevenue.percentage || 0).toFixed(1)}% compared to previous period`,
                metric: 'totalRevenue',
            });
        }
        if (kpis.totalOrders.trend === 'down' && Math.abs(kpis.totalOrders.percentage || 0) > 15) {
            alerts.push({
                severity: 'critical',
                message: `Order volume dropped by ${Math.abs(kpis.totalOrders.percentage || 0).toFixed(1)}%`,
                metric: 'totalOrders',
            });
        }
        logger.log('Generated executive dashboard with KPIs and alerts');
        return {
            kpis,
            charts,
            alerts,
        };
    }
    catch (error) {
        logger.error(`Failed to generate executive dashboard: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to generate executive dashboard');
    }
}
/**
 * Generate custom report based on configuration
 */
async function generateCustomReport(sequelize, config) {
    const logger = new common_1.Logger('CustomReport');
    try {
        // Build dynamic SQL based on requested metrics and dimensions
        const metrics = config.metrics.map(m => {
            switch (m) {
                case 'revenue':
                    return 'SUM(o.total_amount) as revenue';
                case 'orders':
                    return 'COUNT(DISTINCT o.id) as orders';
                case 'units':
                    return 'SUM(oi.quantity) as units';
                case 'avgOrderValue':
                    return 'AVG(o.total_amount) as avg_order_value';
                default:
                    return null;
            }
        }).filter(Boolean).join(', ');
        const dimensions = config.dimensions?.map(d => {
            switch (d) {
                case 'date':
                    return "DATE_TRUNC('day', o.created_at) as date";
                case 'customer':
                    return 'o.customer_id, c.name as customer_name';
                case 'product':
                    return 'oi.product_id, p.name as product_name';
                case 'category':
                    return 'p.category_id, pc.name as category_name';
                case 'source':
                    return 'o.source';
                case 'status':
                    return 'o.status';
                default:
                    return null;
            }
        }).filter(Boolean).join(', ') || '1';
        const groupBy = config.dimensions?.map(d => {
            switch (d) {
                case 'date':
                    return 'date';
                case 'customer':
                    return 'o.customer_id, c.name';
                case 'product':
                    return 'oi.product_id, p.name';
                case 'category':
                    return 'p.category_id, pc.name';
                case 'source':
                    return 'o.source';
                case 'status':
                    return 'o.status';
                default:
                    return null;
            }
        }).filter(Boolean).join(', ') || '1';
        // Determine required joins
        const needsOrderItems = config.metrics.includes('units') || config.dimensions?.includes('product');
        const needsProducts = config.dimensions?.includes('product') || config.dimensions?.includes('category');
        const needsCategories = config.dimensions?.includes('category');
        const needsCustomers = config.dimensions?.includes('customer');
        let joins = '';
        if (needsOrderItems)
            joins += '\nLEFT JOIN order_items oi ON oi.order_id = o.id';
        if (needsProducts)
            joins += '\nLEFT JOIN products p ON p.id = oi.product_id';
        if (needsCategories)
            joins += '\nLEFT JOIN product_categories pc ON pc.id = p.category_id';
        if (needsCustomers)
            joins += '\nLEFT JOIN customers c ON c.id = o.customer_id';
        // Build WHERE clause from filters
        const whereClauses = ['o.deleted_at IS NULL'];
        const replacements = {};
        if (config.filters?.startDate && config.filters?.endDate) {
            whereClauses.push('o.created_at BETWEEN :startDate AND :endDate');
            replacements.startDate = config.filters.startDate;
            replacements.endDate = config.filters.endDate;
        }
        if (config.filters?.orderStatus && config.filters.orderStatus.length > 0) {
            whereClauses.push('o.status = ANY(:orderStatus)');
            replacements.orderStatus = config.filters.orderStatus;
        }
        const whereClause = whereClauses.join(' AND ');
        // Execute query
        const query = `
      SELECT ${dimensions}, ${metrics}
      FROM orders o
      ${joins}
      WHERE ${whereClause}
      GROUP BY ${groupBy}
      ORDER BY ${config.metrics[0]} DESC
      LIMIT 10000
    `;
        const data = await sequelize.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Calculate summary statistics
        const summary = {};
        config.metrics.forEach(metric => {
            const values = data.map((row) => parseFloat(row[metric] || 0));
            summary[metric] = {
                total: values.reduce((sum, v) => sum + v, 0),
                average: values.reduce((sum, v) => sum + v, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
            };
        });
        logger.log(`Generated custom report: ${config.reportName} with ${data.length} rows`);
        return {
            reportMetadata: {
                name: config.reportName,
                generatedAt: new Date(),
                filters: config.filters,
            },
            data,
            summary,
        };
    }
    catch (error) {
        logger.error(`Failed to generate custom report: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to generate custom report');
    }
}
/**
 * Export report data to specified format
 */
async function exportReportData(data, format, reportName) {
    const logger = new common_1.Logger('ExportReportData');
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${reportName}_${timestamp}`;
        switch (format) {
            case ReportFormat.JSON:
                return {
                    fileName: `${fileName}.json`,
                    content: JSON.stringify(data, null, 2),
                    mimeType: 'application/json',
                };
            case ReportFormat.CSV:
                const csvContent = convertToCSV(data);
                return {
                    fileName: `${fileName}.csv`,
                    content: csvContent,
                    mimeType: 'text/csv',
                };
            case ReportFormat.HTML:
                const htmlContent = convertToHTML(data, reportName);
                return {
                    fileName: `${fileName}.html`,
                    content: htmlContent,
                    mimeType: 'text/html',
                };
            default:
                throw new common_1.BadRequestException(`Export format ${format} not implemented`);
        }
    }
    catch (error) {
        logger.error(`Failed to export report data: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to export report data');
    }
}
/**
 * Calculate real-time analytics metrics (last 24 hours)
 */
async function calculateRealTimeMetrics(sequelize) {
    const logger = new common_1.Logger('RealTimeMetrics');
    try {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        // Get hourly and daily metrics
        const [metrics] = await sequelize.query(`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= :oneHourAgo) as orders_last_hour,
        COUNT(*) FILTER (WHERE created_at >= :twentyFourHoursAgo) as orders_last_24_hours,
        SUM(total_amount) FILTER (WHERE created_at >= :oneHourAgo) as revenue_last_hour,
        SUM(total_amount) FILTER (WHERE created_at >= :twentyFourHoursAgo) as revenue_last_24_hours,
        AVG(total_amount) FILTER (WHERE created_at >= :twentyFourHoursAgo) as avg_order_value_24h
      FROM orders
      WHERE created_at >= :twentyFourHoursAgo
        AND status NOT IN ('DRAFT', 'CANCELLED')
        AND deleted_at IS NULL
      `, {
            replacements: {
                oneHourAgo,
                twentyFourHoursAgo,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get top products last 24 hours
        const topProducts = await sequelize.query(`
      SELECT
        p.id as product_id,
        p.name as product_name,
        SUM(oi.quantity) as units
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.created_at >= :twentyFourHoursAgo
        AND o.status NOT IN ('DRAFT', 'CANCELLED')
        AND o.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY units DESC
      LIMIT 10
      `, {
            replacements: { twentyFourHoursAgo },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Get recent orders
        const recentOrders = await sequelize.query(`
      SELECT
        id as order_id,
        customer_id,
        total_amount as amount,
        status,
        created_at
      FROM orders
      WHERE created_at >= :twentyFourHoursAgo
        AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 20
      `, {
            replacements: { twentyFourHoursAgo },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return {
            ordersLastHour: parseInt(metrics.orders_last_hour || 0),
            ordersLast24Hours: parseInt(metrics.orders_last_24_hours || 0),
            revenueLastHour: parseFloat(metrics.revenue_last_hour || 0),
            revenueLast24Hours: parseFloat(metrics.revenue_last_24_hours || 0),
            averageOrderValueLast24Hours: parseFloat(metrics.avg_order_value_24h || 0),
            topProductsLast24Hours: topProducts.map((row) => ({
                productId: row.product_id,
                productName: row.product_name,
                units: parseInt(row.units),
            })),
            recentOrders: recentOrders.map((row) => ({
                orderId: row.order_id,
                customerId: row.customer_id,
                amount: parseFloat(row.amount),
                status: row.status,
                createdAt: new Date(row.created_at),
            })),
        };
    }
    catch (error) {
        logger.error(`Failed to calculate real-time metrics: ${error.message}`, error.stack);
        throw new common_1.UnprocessableEntityException('Failed to calculate real-time metrics');
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Get SQL period grouping based on analytics period
 */
function getPeriodGrouping(period) {
    switch (period) {
        case AnalyticsPeriod.HOURLY:
            return "DATE_TRUNC('hour', o.created_at)";
        case AnalyticsPeriod.DAILY:
            return "DATE_TRUNC('day', o.created_at)";
        case AnalyticsPeriod.WEEKLY:
            return "DATE_TRUNC('week', o.created_at)";
        case AnalyticsPeriod.MONTHLY:
            return "DATE_TRUNC('month', o.created_at)";
        case AnalyticsPeriod.QUARTERLY:
            return "DATE_TRUNC('quarter', o.created_at)";
        case AnalyticsPeriod.YEARLY:
            return "DATE_TRUNC('year', o.created_at)";
        default:
            return "DATE_TRUNC('day', o.created_at)";
    }
}
/**
 * Get revenue trend data for dashboard
 */
async function getRevenueTrendData(sequelize, query) {
    const periodGrouping = getPeriodGrouping(query.period);
    const data = await sequelize.query(`
    SELECT
      ${periodGrouping} as period,
      SUM(o.total_amount) as value
    FROM orders o
    WHERE o.created_at BETWEEN :startDate AND :endDate
      AND o.status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
      AND o.deleted_at IS NULL
    GROUP BY period
    ORDER BY period
    `, {
        replacements: {
            startDate: query.startDate,
            endDate: query.endDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return data.map((row) => ({
        timestamp: new Date(row.period),
        value: parseFloat(row.value || 0),
    }));
}
/**
 * Get orders by status distribution for dashboard
 */
async function getOrdersByStatusData(sequelize, query) {
    const data = await sequelize.query(`
    SELECT
      status,
      COUNT(*) as count
    FROM orders
    WHERE created_at BETWEEN :startDate AND :endDate
      AND deleted_at IS NULL
    GROUP BY status
    ORDER BY count DESC
    `, {
        replacements: {
            startDate: query.startDate,
            endDate: query.endDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return data.map((row) => ({
        label: row.status,
        value: parseInt(row.count),
    }));
}
/**
 * Get sales by channel for dashboard
 */
async function getSalesByChannelData(sequelize, query) {
    const data = await sequelize.query(`
    SELECT
      source as channel,
      SUM(total_amount) as revenue
    FROM orders
    WHERE created_at BETWEEN :startDate AND :endDate
      AND status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
      AND deleted_at IS NULL
    GROUP BY source
    ORDER BY revenue DESC
    `, {
        replacements: {
            startDate: query.startDate,
            endDate: query.endDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return data.map((row) => ({
        label: row.channel,
        value: parseFloat(row.revenue || 0),
    }));
}
/**
 * Convert data array to CSV format
 */
function convertToCSV(data) {
    if (data.length === 0)
        return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined)
            return '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }).join(','));
    return [headers.join(','), ...rows].join('\n');
}
/**
 * Convert data array to HTML table format
 */
function convertToHTML(data, title) {
    if (data.length === 0)
        return '<html><body><h1>No Data</h1></body></html>';
    const headers = Object.keys(data[0]);
    const headerRow = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const dataRows = data.map(row => `<tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`).join('');
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  <table>
    <thead>${headerRow}</thead>
    <tbody>${dataRows}</tbody>
  </table>
</body>
</html>
  `;
}
//# sourceMappingURL=order-analytics-reporting-kit.js.map