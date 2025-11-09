"use strict";
/**
 * LOC: THRVIZ123456
 * File: /reuse/threat/threat-visualization-dashboard-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Threat visualization services
 *   - Dashboard controllers
 *   - Reporting services
 *   - Executive summary generators
 *   - Analytics presentation layers
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
exports.ThreatVisualizationDashboardKit = exports.GenerateReportDto = exports.WidgetDataQueryDto = exports.DashboardQueryDto = exports.MapVisualizationType = exports.ReportFormat = exports.AggregationType = exports.TimeGranularity = exports.DashboardWidgetType = void 0;
exports.getThreatDashboardOverview = getThreatDashboardOverview;
exports.generateThreatTimeSeriesData = generateThreatTimeSeriesData;
exports.generateThreatGeoMapData = generateThreatGeoMapData;
exports.generateThreatActorNetworkGraph = generateThreatActorNetworkGraph;
exports.generateThreatTimelineData = generateThreatTimelineData;
exports.generateMetricCards = generateMetricCards;
exports.generateThreatHeatMapData = generateThreatHeatMapData;
exports.generateExecutiveSummary = generateExecutiveSummary;
exports.exportDashboardData = exportDashboardData;
exports.generateThreatDistributionData = generateThreatDistributionData;
exports.generateThreatSeverityPieChart = generateThreatSeverityPieChart;
exports.getThreatsByAssetChart = getThreatsByAssetChart;
exports.getThreatResponseTimeChart = getThreatResponseTimeChart;
exports.getThreatActorActivityChart = getThreatActorActivityChart;
exports.getIOCTypeDistribution = getIOCTypeDistribution;
exports.formatChartDataForExport = formatChartDataForExport;
exports.calculateWidgetRefreshPriority = calculateWidgetRefreshPriority;
exports.getRealtimeThreatFeed = getRealtimeThreatFeed;
exports.generateDashboardSnapshot = generateDashboardSnapshot;
exports.validateDashboardConfig = validateDashboardConfig;
exports.mergeDashboardWidgets = mergeDashboardWidgets;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Dashboard widget type
 */
var DashboardWidgetType;
(function (DashboardWidgetType) {
    DashboardWidgetType["LINE_CHART"] = "LINE_CHART";
    DashboardWidgetType["BAR_CHART"] = "BAR_CHART";
    DashboardWidgetType["PIE_CHART"] = "PIE_CHART";
    DashboardWidgetType["AREA_CHART"] = "AREA_CHART";
    DashboardWidgetType["SCATTER_PLOT"] = "SCATTER_PLOT";
    DashboardWidgetType["HEAT_MAP"] = "HEAT_MAP";
    DashboardWidgetType["GEO_MAP"] = "GEO_MAP";
    DashboardWidgetType["NETWORK_GRAPH"] = "NETWORK_GRAPH";
    DashboardWidgetType["TIMELINE"] = "TIMELINE";
    DashboardWidgetType["METRIC_CARD"] = "METRIC_CARD";
    DashboardWidgetType["TABLE"] = "TABLE";
    DashboardWidgetType["GAUGE"] = "GAUGE";
})(DashboardWidgetType || (exports.DashboardWidgetType = DashboardWidgetType = {}));
/**
 * Time granularity for charts
 */
var TimeGranularity;
(function (TimeGranularity) {
    TimeGranularity["MINUTE"] = "MINUTE";
    TimeGranularity["HOUR"] = "HOUR";
    TimeGranularity["DAY"] = "DAY";
    TimeGranularity["WEEK"] = "WEEK";
    TimeGranularity["MONTH"] = "MONTH";
    TimeGranularity["QUARTER"] = "QUARTER";
    TimeGranularity["YEAR"] = "YEAR";
})(TimeGranularity || (exports.TimeGranularity = TimeGranularity = {}));
/**
 * Chart aggregation type
 */
var AggregationType;
(function (AggregationType) {
    AggregationType["COUNT"] = "COUNT";
    AggregationType["SUM"] = "SUM";
    AggregationType["AVG"] = "AVG";
    AggregationType["MIN"] = "MIN";
    AggregationType["MAX"] = "MAX";
    AggregationType["PERCENTILE"] = "PERCENTILE";
    AggregationType["DISTINCT_COUNT"] = "DISTINCT_COUNT";
})(AggregationType || (exports.AggregationType = AggregationType = {}));
/**
 * Report format
 */
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "PDF";
    ReportFormat["CSV"] = "CSV";
    ReportFormat["JSON"] = "JSON";
    ReportFormat["XLSX"] = "XLSX";
    ReportFormat["HTML"] = "HTML";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
/**
 * Map visualization type
 */
var MapVisualizationType;
(function (MapVisualizationType) {
    MapVisualizationType["POINT"] = "POINT";
    MapVisualizationType["CLUSTER"] = "CLUSTER";
    MapVisualizationType["HEAT"] = "HEAT";
    MapVisualizationType["CHOROPLETH"] = "CHOROPLETH";
    MapVisualizationType["FLOW"] = "FLOW";
})(MapVisualizationType || (exports.MapVisualizationType = MapVisualizationType = {}));
// ============================================================================
// DTOs FOR API/SERVICE LAYER
// ============================================================================
/**
 * DTO for dashboard query
 */
let DashboardQueryDto = (() => {
    var _a;
    let _dashboardId_decorators;
    let _dashboardId_initializers = [];
    let _dashboardId_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _refreshInterval_decorators;
    let _refreshInterval_initializers = [];
    let _refreshInterval_extraInitializers = [];
    return _a = class DashboardQueryDto {
            constructor() {
                this.dashboardId = __runInitializers(this, _dashboardId_initializers, void 0);
                this.startTime = (__runInitializers(this, _dashboardId_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                this.refreshInterval = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _refreshInterval_initializers, void 0));
                __runInitializers(this, _refreshInterval_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dashboardId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard ID' }), (0, class_validator_1.IsString)()];
            _startTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Start time for data range' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endTime_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'End time for data range' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _refreshInterval_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Refresh interval in seconds' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(10)];
            __esDecorate(null, null, _dashboardId_decorators, { kind: "field", name: "dashboardId", static: false, private: false, access: { has: obj => "dashboardId" in obj, get: obj => obj.dashboardId, set: (obj, value) => { obj.dashboardId = value; } }, metadata: _metadata }, _dashboardId_initializers, _dashboardId_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _refreshInterval_decorators, { kind: "field", name: "refreshInterval", static: false, private: false, access: { has: obj => "refreshInterval" in obj, get: obj => obj.refreshInterval, set: (obj, value) => { obj.refreshInterval = value; } }, metadata: _metadata }, _refreshInterval_initializers, _refreshInterval_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DashboardQueryDto = DashboardQueryDto;
/**
 * DTO for widget data query
 */
let WidgetDataQueryDto = (() => {
    var _a;
    let _widgetType_decorators;
    let _widgetType_initializers = [];
    let _widgetType_extraInitializers = [];
    let _dataSource_decorators;
    let _dataSource_initializers = [];
    let _dataSource_extraInitializers = [];
    let _timeGranularity_decorators;
    let _timeGranularity_initializers = [];
    let _timeGranularity_extraInitializers = [];
    let _aggregationType_decorators;
    let _aggregationType_initializers = [];
    let _aggregationType_extraInitializers = [];
    let _groupBy_decorators;
    let _groupBy_initializers = [];
    let _groupBy_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    return _a = class WidgetDataQueryDto {
            constructor() {
                this.widgetType = __runInitializers(this, _widgetType_initializers, void 0);
                this.dataSource = (__runInitializers(this, _widgetType_extraInitializers), __runInitializers(this, _dataSource_initializers, void 0));
                this.timeGranularity = (__runInitializers(this, _dataSource_extraInitializers), __runInitializers(this, _timeGranularity_initializers, void 0));
                this.aggregationType = (__runInitializers(this, _timeGranularity_extraInitializers), __runInitializers(this, _aggregationType_initializers, void 0));
                this.groupBy = (__runInitializers(this, _aggregationType_extraInitializers), __runInitializers(this, _groupBy_initializers, void 0));
                this.filters = (__runInitializers(this, _groupBy_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                __runInitializers(this, _filters_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _widgetType_decorators = [(0, swagger_1.ApiProperty)({ enum: DashboardWidgetType, description: 'Widget type' }), (0, class_validator_1.IsEnum)(DashboardWidgetType)];
            _dataSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data source query' }), (0, class_validator_1.IsString)()];
            _timeGranularity_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: TimeGranularity, description: 'Time granularity' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(TimeGranularity)];
            _aggregationType_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: AggregationType, description: 'Aggregation type' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(AggregationType)];
            _groupBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Group by fields' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _filters_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filters' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _widgetType_decorators, { kind: "field", name: "widgetType", static: false, private: false, access: { has: obj => "widgetType" in obj, get: obj => obj.widgetType, set: (obj, value) => { obj.widgetType = value; } }, metadata: _metadata }, _widgetType_initializers, _widgetType_extraInitializers);
            __esDecorate(null, null, _dataSource_decorators, { kind: "field", name: "dataSource", static: false, private: false, access: { has: obj => "dataSource" in obj, get: obj => obj.dataSource, set: (obj, value) => { obj.dataSource = value; } }, metadata: _metadata }, _dataSource_initializers, _dataSource_extraInitializers);
            __esDecorate(null, null, _timeGranularity_decorators, { kind: "field", name: "timeGranularity", static: false, private: false, access: { has: obj => "timeGranularity" in obj, get: obj => obj.timeGranularity, set: (obj, value) => { obj.timeGranularity = value; } }, metadata: _metadata }, _timeGranularity_initializers, _timeGranularity_extraInitializers);
            __esDecorate(null, null, _aggregationType_decorators, { kind: "field", name: "aggregationType", static: false, private: false, access: { has: obj => "aggregationType" in obj, get: obj => obj.aggregationType, set: (obj, value) => { obj.aggregationType = value; } }, metadata: _metadata }, _aggregationType_initializers, _aggregationType_extraInitializers);
            __esDecorate(null, null, _groupBy_decorators, { kind: "field", name: "groupBy", static: false, private: false, access: { has: obj => "groupBy" in obj, get: obj => obj.groupBy, set: (obj, value) => { obj.groupBy = value; } }, metadata: _metadata }, _groupBy_initializers, _groupBy_extraInitializers);
            __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.WidgetDataQueryDto = WidgetDataQueryDto;
/**
 * DTO for report generation
 */
let GenerateReportDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _sections_decorators;
    let _sections_initializers = [];
    let _sections_extraInitializers = [];
    let _parameters_decorators;
    let _parameters_initializers = [];
    let _parameters_extraInitializers = [];
    return _a = class GenerateReportDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.format = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _format_initializers, void 0));
                this.startTime = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                this.sections = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _sections_initializers, void 0));
                this.parameters = (__runInitializers(this, _sections_extraInitializers), __runInitializers(this, _parameters_initializers, void 0));
                __runInitializers(this, _parameters_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report title' }), (0, class_validator_1.IsString)()];
            _format_decorators = [(0, swagger_1.ApiProperty)({ enum: ReportFormat, description: 'Report format' }), (0, class_validator_1.IsEnum)(ReportFormat)];
            _startTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start time for report data' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'End time for report data' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _sections_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Report sections to include' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _parameters_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional parameters' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _sections_decorators, { kind: "field", name: "sections", static: false, private: false, access: { has: obj => "sections" in obj, get: obj => obj.sections, set: (obj, value) => { obj.sections = value; } }, metadata: _metadata }, _sections_initializers, _sections_extraInitializers);
            __esDecorate(null, null, _parameters_decorators, { kind: "field", name: "parameters", static: false, private: false, access: { has: obj => "parameters" in obj, get: obj => obj.parameters, set: (obj, value) => { obj.parameters = value; } }, metadata: _metadata }, _parameters_initializers, _parameters_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GenerateReportDto = GenerateReportDto;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * 1. Get real-time threat dashboard overview with key metrics
 * Optimized query with multiple aggregations and subqueries
 */
async function getThreatDashboardOverview(sequelize, timeRange, options) {
    const query = `
    WITH threat_metrics AS (
      SELECT
        COUNT(*) as total_threats,
        COUNT(DISTINCT threat_type) as unique_threat_types,
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_count,
        COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as high_count,
        COUNT(CASE WHEN severity = 'MEDIUM' THEN 1 END) as medium_count,
        COUNT(CASE WHEN severity = 'LOW' THEN 1 END) as low_count,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_threats,
        COUNT(CASE WHEN status = 'MITIGATED' THEN 1 END) as mitigated_threats
      FROM threats
      WHERE detected_at BETWEEN $1 AND $2
    ),
    time_series_data AS (
      SELECT
        date_trunc('hour', detected_at) as time_bucket,
        COUNT(*) as threat_count,
        COUNT(CASE WHEN severity IN ('CRITICAL', 'HIGH') THEN 1 END) as high_severity_count
      FROM threats
      WHERE detected_at BETWEEN $1 AND $2
      GROUP BY date_trunc('hour', detected_at)
      ORDER BY time_bucket
    ),
    threat_distribution AS (
      SELECT
        threat_type,
        COUNT(*) as count,
        AVG(CASE
          WHEN severity = 'CRITICAL' THEN 4
          WHEN severity = 'HIGH' THEN 3
          WHEN severity = 'MEDIUM' THEN 2
          WHEN severity = 'LOW' THEN 1
          ELSE 0
        END) as avg_severity_score
      FROM threats
      WHERE detected_at BETWEEN $1 AND $2
      GROUP BY threat_type
      ORDER BY count DESC
      LIMIT 10
    ),
    top_affected_assets AS (
      SELECT
        ta.asset_id,
        a.name as asset_name,
        COUNT(DISTINCT ta.threat_id) as threat_count,
        MAX(t.severity) as max_severity
      FROM threat_assets ta
      JOIN threats t ON ta.threat_id = t.id
      JOIN assets a ON ta.asset_id = a.id
      WHERE t.detected_at BETWEEN $1 AND $2
      GROUP BY ta.asset_id, a.name
      ORDER BY threat_count DESC
      LIMIT 10
    )
    SELECT
      JSON_BUILD_OBJECT(
        'metrics', (SELECT ROW_TO_JSON(tm) FROM threat_metrics tm),
        'timeSeries', (SELECT JSON_AGG(ROW_TO_JSON(tsd)) FROM time_series_data tsd),
        'distribution', (SELECT JSON_AGG(ROW_TO_JSON(td)) FROM threat_distribution td),
        'topAssets', (SELECT JSON_AGG(ROW_TO_JSON(taa)) FROM top_affected_assets taa)
      ) as dashboard_data
  `;
    const [result] = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const data = result.dashboard_data;
    return {
        dashboardId: 'threat-overview',
        name: 'Threat Dashboard Overview',
        description: 'Real-time threat intelligence dashboard',
        widgets: [
            {
                widgetId: 'metrics-1',
                type: DashboardWidgetType.METRIC_CARD,
                title: 'Total Threats',
                data: { labels: [], datasets: [], metadata: data.metrics },
                config: {},
                position: { x: 0, y: 0, width: 3, height: 2 },
            },
            {
                widgetId: 'chart-1',
                type: DashboardWidgetType.LINE_CHART,
                title: 'Threats Over Time',
                data: {
                    labels: data.timeSeries?.map((d) => d.time_bucket) || [],
                    datasets: [{
                            label: 'Threat Count',
                            data: data.timeSeries?.map((d) => d.threat_count) || [],
                        }],
                },
                config: { timeGranularity: TimeGranularity.HOUR },
                position: { x: 3, y: 0, width: 9, height: 4 },
            },
            {
                widgetId: 'chart-2',
                type: DashboardWidgetType.PIE_CHART,
                title: 'Threat Distribution',
                data: {
                    labels: data.distribution?.map((d) => d.threat_type) || [],
                    datasets: [{
                            label: 'Count',
                            data: data.distribution?.map((d) => d.count) || [],
                        }],
                },
                config: {},
                position: { x: 0, y: 2, width: 6, height: 4 },
            },
        ],
        layout: { columns: 12, rowHeight: 100, isDraggable: true, isResizable: true },
        refreshInterval: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * 2. Generate time series data for threat trends
 * Advanced time-series aggregation with window functions
 */
async function generateThreatTimeSeriesData(sequelize, timeRange, granularity, options) {
    const truncateFunction = {
        [TimeGranularity.MINUTE]: 'minute',
        [TimeGranularity.HOUR]: 'hour',
        [TimeGranularity.DAY]: 'day',
        [TimeGranularity.WEEK]: 'week',
        [TimeGranularity.MONTH]: 'month',
        [TimeGranularity.QUARTER]: 'quarter',
        [TimeGranularity.YEAR]: 'year',
    }[granularity];
    const query = `
    WITH time_buckets AS (
      SELECT generate_series(
        date_trunc('${truncateFunction}', $1::timestamp),
        date_trunc('${truncateFunction}', $2::timestamp),
        '1 ${truncateFunction}'::interval
      ) as bucket_start
    ),
    threat_counts AS (
      SELECT
        date_trunc('${truncateFunction}', t.detected_at) as time_bucket,
        COUNT(*) as total_count,
        COUNT(CASE WHEN t.severity = 'CRITICAL' THEN 1 END) as critical_count,
        COUNT(CASE WHEN t.severity = 'HIGH' THEN 1 END) as high_count,
        COUNT(CASE WHEN t.severity = 'MEDIUM' THEN 1 END) as medium_count,
        COUNT(CASE WHEN t.severity = 'LOW' THEN 1 END) as low_count,
        AVG(CASE
          WHEN t.severity = 'CRITICAL' THEN 4
          WHEN t.severity = 'HIGH' THEN 3
          WHEN t.severity = 'MEDIUM' THEN 2
          WHEN t.severity = 'LOW' THEN 1
          ELSE 0
        END) as avg_severity_score,
        STDDEV(CASE
          WHEN t.severity = 'CRITICAL' THEN 4
          WHEN t.severity = 'HIGH' THEN 3
          WHEN t.severity = 'MEDIUM' THEN 2
          WHEN t.severity = 'LOW' THEN 1
          ELSE 0
        END) as severity_stddev
      FROM threats t
      WHERE t.detected_at BETWEEN $1 AND $2
        ${options?.threatType ? "AND t.threat_type = $3" : ""}
      GROUP BY date_trunc('${truncateFunction}', t.detected_at)
    ),
    enriched_series AS (
      SELECT
        tb.bucket_start,
        COALESCE(tc.total_count, 0) as count,
        COALESCE(tc.critical_count, 0) as critical,
        COALESCE(tc.high_count, 0) as high,
        COALESCE(tc.medium_count, 0) as medium,
        COALESCE(tc.low_count, 0) as low,
        COALESCE(tc.avg_severity_score, 0) as avg_severity,
        AVG(COALESCE(tc.total_count, 0)) OVER (
          ORDER BY tb.bucket_start
          ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as moving_avg_7,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY COALESCE(tc.total_count, 0)) OVER (
          ORDER BY tb.bucket_start
          ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) as p95_threshold
      FROM time_buckets tb
      LEFT JOIN threat_counts tc ON tb.bucket_start = tc.time_bucket
      ORDER BY tb.bucket_start
    )
    SELECT
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'timestamp', bucket_start,
          'count', count,
          'critical', critical,
          'high', high,
          'medium', medium,
          'low', low,
          'avgSeverity', avg_severity,
          'movingAvg', moving_avg_7,
          'threshold', p95_threshold
        ) ORDER BY bucket_start
      ) as time_series
    FROM enriched_series
  `;
    const binds = options?.threatType
        ? [timeRange.start, timeRange.end, options.threatType]
        : [timeRange.start, timeRange.end];
    const [result] = await sequelize.query(query, {
        bind: binds,
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const timeSeries = result.time_series || [];
    return {
        labels: timeSeries.map((d) => d.timestamp),
        datasets: [
            {
                label: 'Total Threats',
                data: timeSeries.map((d) => d.count),
                borderColor: '#3b82f6',
            },
            {
                label: 'Critical',
                data: timeSeries.map((d) => d.critical),
                borderColor: '#ef4444',
            },
            {
                label: 'High',
                data: timeSeries.map((d) => d.high),
                borderColor: '#f97316',
            },
            {
                label: 'Moving Average',
                data: timeSeries.map((d) => d.movingAvg),
                borderColor: '#8b5cf6',
            },
        ],
        metadata: { granularity, threatType: options?.threatType },
    };
}
/**
 * 3. Generate geographic threat map data
 * Spatial aggregation with clustering and heat map support
 */
async function generateThreatGeoMapData(sequelize, timeRange, visualizationType, options) {
    const query = `
    WITH geo_threats AS (
      SELECT
        t.id,
        t.threat_type,
        t.severity,
        t.detected_at,
        tl.latitude,
        tl.longitude,
        tl.country,
        tl.city,
        tl.ip_address
      FROM threats t
      JOIN threat_locations tl ON t.id = tl.threat_id
      WHERE t.detected_at BETWEEN $1 AND $2
        AND tl.latitude IS NOT NULL
        AND tl.longitude IS NOT NULL
    ),
    location_aggregation AS (
      SELECT
        ROUND(latitude::numeric, ${visualizationType === MapVisualizationType.CLUSTER ? '1' : '4'}) as lat,
        ROUND(longitude::numeric, ${visualizationType === MapVisualizationType.CLUSTER ? '1' : '4'}) as lng,
        COUNT(*) as threat_count,
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_count,
        COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as high_count,
        ARRAY_AGG(DISTINCT country) as countries,
        ARRAY_AGG(DISTINCT threat_type) as threat_types,
        MAX(CASE
          WHEN severity = 'CRITICAL' THEN 4
          WHEN severity = 'HIGH' THEN 3
          WHEN severity = 'MEDIUM' THEN 2
          WHEN severity = 'LOW' THEN 1
          ELSE 0
        END) as max_severity_score,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'type', threat_type,
            'severity', severity,
            'city', city
          )
        ) FILTER (WHERE threat_count <= 100) as threat_details
      FROM geo_threats
      GROUP BY lat, lng
    ),
    heat_map_data AS (
      SELECT
        la.*,
        CASE
          WHEN threat_count > 100 THEN 1.0
          WHEN threat_count > 50 THEN 0.8
          WHEN threat_count > 20 THEN 0.6
          WHEN threat_count > 10 THEN 0.4
          ELSE 0.2
        END as heat_intensity
      FROM location_aggregation la
    )
    SELECT
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'latitude', lat,
          'longitude', lng,
          'value', threat_count,
          'label', COALESCE(countries[1], 'Unknown'),
          'metadata', JSON_BUILD_OBJECT(
            'criticalCount', critical_count,
            'highCount', high_count,
            'threatTypes', threat_types,
            'severityScore', max_severity_score,
            'heatIntensity', heat_intensity,
            'details', threat_details
          )
        )
      ) as locations,
      JSON_BUILD_OBJECT(
        'totalLocations', COUNT(*),
        'totalThreats', SUM(threat_count),
        'visualizationType', $3
      ) as metadata
    FROM heat_map_data
  `;
    const [result] = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end, visualizationType],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    return {
        locations: result.locations || [],
        metadata: result.metadata || {},
    };
}
/**
 * 4. Generate threat actor network graph
 * Graph query with relationship discovery and centrality metrics
 */
async function generateThreatActorNetworkGraph(sequelize, timeRange, options) {
    const maxNodes = options?.maxNodes || 100;
    const query = `
    WITH threat_relationships AS (
      SELECT
        ta1.id as actor1_id,
        ta1.name as actor1_name,
        ta1.type as actor1_type,
        ta2.id as actor2_id,
        ta2.name as actor2_name,
        ta2.type as actor2_type,
        tr.relationship_type,
        tr.confidence,
        COUNT(DISTINCT t.id) as shared_threats
      FROM threat_actors ta1
      JOIN threat_actor_relationships tr ON ta1.id = tr.source_actor_id
      JOIN threat_actors ta2 ON tr.target_actor_id = ta2.id
      LEFT JOIN threats t ON (
        t.attributed_to_id = ta1.id OR t.attributed_to_id = ta2.id
      )
      WHERE t.detected_at BETWEEN $1 AND $2 OR t.detected_at IS NULL
      GROUP BY ta1.id, ta1.name, ta1.type, ta2.id, ta2.name, ta2.type,
               tr.relationship_type, tr.confidence
    ),
    node_metrics AS (
      SELECT
        actor_id,
        actor_name,
        actor_type,
        COUNT(DISTINCT connection_id) as degree,
        SUM(connection_weight) as total_weight,
        AVG(connection_weight) as avg_weight,
        COUNT(DISTINCT threat_id) as threat_count
      FROM (
        SELECT actor1_id as actor_id, actor1_name as actor_name, actor1_type as actor_type,
               actor2_id as connection_id, shared_threats as connection_weight,
               NULL as threat_id
        FROM threat_relationships
        UNION ALL
        SELECT actor2_id, actor2_name, actor2_type,
               actor1_id, shared_threats,
               NULL
        FROM threat_relationships
      ) connections
      GROUP BY actor_id, actor_name, actor_type
      ORDER BY degree DESC, total_weight DESC
      LIMIT $3
    ),
    filtered_edges AS (
      SELECT DISTINCT
        tr.actor1_id as source,
        tr.actor2_id as target,
        tr.relationship_type as label,
        tr.shared_threats as weight,
        tr.confidence
      FROM threat_relationships tr
      WHERE tr.actor1_id IN (SELECT actor_id FROM node_metrics)
        AND tr.actor2_id IN (SELECT actor_id FROM node_metrics)
    )
    SELECT
      JSON_BUILD_OBJECT(
        'nodes', (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', actor_id,
              'label', actor_name,
              'type', actor_type,
              'size', degree * 5,
              'color', CASE
                WHEN actor_type = 'nation_state' THEN '#ef4444'
                WHEN actor_type = 'cybercrime' THEN '#f97316'
                WHEN actor_type = 'hacktivist' THEN '#3b82f6'
                ELSE '#6b7280'
              END,
              'metadata', JSON_BUILD_OBJECT(
                'degree', degree,
                'threatCount', threat_count,
                'avgWeight', avg_weight
              )
            )
          )
          FROM node_metrics
        ),
        'edges', (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'source', source,
              'target', target,
              'label', label,
              'weight', weight,
              'color', CASE
                WHEN confidence > 0.8 THEN '#22c55e'
                WHEN confidence > 0.5 THEN '#eab308'
                ELSE '#ef4444'
              END,
              'metadata', JSON_BUILD_OBJECT(
                'confidence', confidence,
                'relationshipType', label
              )
            )
          )
          FROM filtered_edges
        )
      ) as graph_data
  `;
    const [result] = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end, maxNodes],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const graphData = result.graph_data || { nodes: [], edges: [] };
    return {
        nodes: graphData.nodes || [],
        edges: graphData.edges || [],
        layout: 'force-directed',
        metadata: {
            nodeCount: graphData.nodes?.length || 0,
            edgeCount: graphData.edges?.length || 0,
            timeRange,
        },
    };
}
/**
 * 5. Generate threat timeline visualization data
 * Temporal visualization with event clustering
 */
async function generateThreatTimelineData(sequelize, timeRange, options) {
    const query = `
    WITH timeline_events AS (
      SELECT
        t.id,
        t.detected_at as timestamp,
        t.name as title,
        t.description,
        t.threat_type as type,
        t.severity,
        ARRAY_AGG(DISTINCT ta.asset_id) FILTER (WHERE ta.asset_id IS NOT NULL) as affected_assets,
        ARRAY_AGG(DISTINCT ti.indicator_value) FILTER (WHERE ti.indicator_value IS NOT NULL) as iocs,
        JSONB_BUILD_OBJECT(
          'source', t.source,
          'confidence', t.confidence_score,
          'status', t.status,
          'mitigated_at', t.mitigated_at
        ) as metadata
      FROM threats t
      LEFT JOIN threat_assets ta ON t.id = ta.threat_id
      LEFT JOIN threat_indicators ti ON t.id = ti.threat_id
      WHERE t.detected_at BETWEEN $1 AND $2
        ${options?.threatId ? 'AND t.id = $3' : ''}
      GROUP BY t.id, t.detected_at, t.name, t.description, t.threat_type, t.severity,
               t.source, t.confidence_score, t.status, t.mitigated_at
    ),
    related_events AS (
      SELECT
        te1.id,
        ARRAY_AGG(DISTINCT te2.id) FILTER (WHERE te2.id IS NOT NULL AND te2.id != te1.id) as related_ids
      FROM timeline_events te1
      LEFT JOIN timeline_events te2 ON
        te2.timestamp BETWEEN te1.timestamp - INTERVAL '1 hour' AND te1.timestamp + INTERVAL '1 hour'
        AND te2.severity = te1.severity
        AND te2.type = te1.type
      GROUP BY te1.id
    )
    SELECT
      te.id,
      te.timestamp,
      te.title,
      te.description,
      te.type,
      te.severity,
      te.metadata,
      re.related_ids as related_events
    FROM timeline_events te
    LEFT JOIN related_events re ON te.id = re.id
    ORDER BY te.timestamp DESC
    LIMIT 1000
  `;
    const binds = options?.threatId
        ? [timeRange.start, timeRange.end, options.threatId]
        : [timeRange.start, timeRange.end];
    const results = await sequelize.query(query, {
        bind: binds,
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    return results.map((r) => ({
        id: r.id,
        timestamp: r.timestamp,
        title: r.title,
        description: r.description,
        type: r.type,
        severity: r.severity,
        metadata: r.metadata,
        relatedEvents: r.related_events || [],
    }));
}
/**
 * 6. Generate metric cards for dashboard
 * Multi-metric aggregation with trend calculation
 */
async function generateMetricCards(sequelize, timeRange, options) {
    const query = `
    WITH current_period AS (
      SELECT
        COUNT(*) as total_threats,
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_threats,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_threats,
        COUNT(CASE WHEN status = 'MITIGATED' THEN 1 END) as mitigated_threats,
        AVG(confidence_score) as avg_confidence,
        COUNT(DISTINCT attributed_to_id) FILTER (WHERE attributed_to_id IS NOT NULL) as unique_actors,
        AVG(EXTRACT(EPOCH FROM (mitigated_at - detected_at))) FILTER (WHERE mitigated_at IS NOT NULL) as avg_resolution_time
      FROM threats
      WHERE detected_at BETWEEN $1 AND $2
    ),
    previous_period AS (
      SELECT
        COUNT(*) as total_threats,
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_threats,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_threats,
        COUNT(CASE WHEN status = 'MITIGATED' THEN 1 END) as mitigated_threats,
        AVG(confidence_score) as avg_confidence,
        COUNT(DISTINCT attributed_to_id) FILTER (WHERE attributed_to_id IS NOT NULL) as unique_actors,
        AVG(EXTRACT(EPOCH FROM (mitigated_at - detected_at))) FILTER (WHERE mitigated_at IS NOT NULL) as avg_resolution_time
      FROM threats
      WHERE detected_at BETWEEN $1 - ($2 - $1) AND $1
    )
    SELECT
      JSON_BUILD_ARRAY(
        JSON_BUILD_OBJECT(
          'title', 'Total Threats',
          'value', cp.total_threats,
          'unit', '',
          'trend', JSON_BUILD_OBJECT(
            'direction', CASE
              WHEN cp.total_threats > pp.total_threats THEN 'up'
              WHEN cp.total_threats < pp.total_threats THEN 'down'
              ELSE 'stable'
            END,
            'percentage', ROUND(((cp.total_threats - pp.total_threats)::numeric / NULLIF(pp.total_threats, 0) * 100)::numeric, 2),
            'period', 'vs previous period'
          ),
          'severity', CASE
            WHEN cp.total_threats > pp.total_threats * 1.5 THEN 'critical'
            WHEN cp.total_threats > pp.total_threats * 1.2 THEN 'warning'
            ELSE 'good'
          END
        ),
        JSON_BUILD_OBJECT(
          'title', 'Critical Threats',
          'value', cp.critical_threats,
          'unit', '',
          'trend', JSON_BUILD_OBJECT(
            'direction', CASE
              WHEN cp.critical_threats > pp.critical_threats THEN 'up'
              WHEN cp.critical_threats < pp.critical_threats THEN 'down'
              ELSE 'stable'
            END,
            'percentage', ROUND(((cp.critical_threats - pp.critical_threats)::numeric / NULLIF(pp.critical_threats, 0) * 100)::numeric, 2),
            'period', 'vs previous period'
          ),
          'severity', CASE
            WHEN cp.critical_threats > pp.critical_threats THEN 'critical'
            ELSE 'warning'
          END
        ),
        JSON_BUILD_OBJECT(
          'title', 'Active Threats',
          'value', cp.active_threats,
          'unit', '',
          'trend', JSON_BUILD_OBJECT(
            'direction', CASE
              WHEN cp.active_threats > pp.active_threats THEN 'up'
              WHEN cp.active_threats < pp.active_threats THEN 'down'
              ELSE 'stable'
            END,
            'percentage', ROUND(((cp.active_threats - pp.active_threats)::numeric / NULLIF(pp.active_threats, 0) * 100)::numeric, 2),
            'period', 'vs previous period'
          ),
          'severity', CASE
            WHEN cp.active_threats > pp.active_threats * 1.3 THEN 'critical'
            WHEN cp.active_threats > pp.active_threats THEN 'warning'
            ELSE 'good'
          END
        ),
        JSON_BUILD_OBJECT(
          'title', 'Mitigation Rate',
          'value', ROUND((cp.mitigated_threats::numeric / NULLIF(cp.total_threats, 0) * 100)::numeric, 2),
          'unit', '%',
          'trend', JSON_BUILD_OBJECT(
            'direction', CASE
              WHEN (cp.mitigated_threats::numeric / NULLIF(cp.total_threats, 0)) >
                   (pp.mitigated_threats::numeric / NULLIF(pp.total_threats, 0)) THEN 'up'
              WHEN (cp.mitigated_threats::numeric / NULLIF(cp.total_threats, 0)) <
                   (pp.mitigated_threats::numeric / NULLIF(pp.total_threats, 0)) THEN 'down'
              ELSE 'stable'
            END,
            'percentage', ROUND((
              (cp.mitigated_threats::numeric / NULLIF(cp.total_threats, 0)) -
              (pp.mitigated_threats::numeric / NULLIF(pp.total_threats, 0))
            ) * 100, 2),
            'period', 'vs previous period'
          ),
          'severity', CASE
            WHEN (cp.mitigated_threats::numeric / NULLIF(cp.total_threats, 0)) > 0.8 THEN 'good'
            WHEN (cp.mitigated_threats::numeric / NULLIF(cp.total_threats, 0)) > 0.5 THEN 'warning'
            ELSE 'critical'
          END
        ),
        JSON_BUILD_OBJECT(
          'title', 'Avg Resolution Time',
          'value', ROUND((cp.avg_resolution_time / 3600)::numeric, 2),
          'unit', 'hours',
          'trend', JSON_BUILD_OBJECT(
            'direction', CASE
              WHEN cp.avg_resolution_time < pp.avg_resolution_time THEN 'down'
              WHEN cp.avg_resolution_time > pp.avg_resolution_time THEN 'up'
              ELSE 'stable'
            END,
            'percentage', ROUND(((cp.avg_resolution_time - pp.avg_resolution_time) / NULLIF(pp.avg_resolution_time, 0) * 100)::numeric, 2),
            'period', 'vs previous period'
          ),
          'severity', CASE
            WHEN cp.avg_resolution_time < pp.avg_resolution_time THEN 'good'
            WHEN cp.avg_resolution_time > pp.avg_resolution_time * 1.5 THEN 'critical'
            ELSE 'warning'
          END
        ),
        JSON_BUILD_OBJECT(
          'title', 'Unique Threat Actors',
          'value', cp.unique_actors,
          'unit', '',
          'trend', JSON_BUILD_OBJECT(
            'direction', CASE
              WHEN cp.unique_actors > pp.unique_actors THEN 'up'
              WHEN cp.unique_actors < pp.unique_actors THEN 'down'
              ELSE 'stable'
            END,
            'percentage', ROUND(((cp.unique_actors - pp.unique_actors)::numeric / NULLIF(pp.unique_actors, 0) * 100)::numeric, 2),
            'period', 'vs previous period'
          ),
          'severity', CASE
            WHEN cp.unique_actors > pp.unique_actors * 1.5 THEN 'critical'
            WHEN cp.unique_actors > pp.unique_actors THEN 'warning'
            ELSE 'good'
          END
        )
      ) as metric_cards
    FROM current_period cp, previous_period pp
  `;
    const [result] = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    return result.metric_cards || [];
}
/**
 * 7. Generate heat map data for threat activity
 * Density-based visualization with temporal patterns
 */
async function generateThreatHeatMapData(sequelize, timeRange, options) {
    const groupByX = options?.groupBy?.[0] || 'hour';
    const groupByY = options?.groupBy?.[1] || 'day_of_week';
    const query = `
    WITH threat_matrix AS (
      SELECT
        EXTRACT(${groupByX} FROM detected_at) as x_value,
        EXTRACT(${groupByY} FROM detected_at) as y_value,
        COUNT(*) as threat_count,
        AVG(CASE
          WHEN severity = 'CRITICAL' THEN 4
          WHEN severity = 'HIGH' THEN 3
          WHEN severity = 'MEDIUM' THEN 2
          WHEN severity = 'LOW' THEN 1
          ELSE 0
        END) as avg_severity
      FROM threats
      WHERE detected_at BETWEEN $1 AND $2
      GROUP BY x_value, y_value
    ),
    normalized_matrix AS (
      SELECT
        x_value,
        y_value,
        threat_count,
        avg_severity,
        (threat_count - MIN(threat_count) OVER ()) /
        NULLIF((MAX(threat_count) OVER () - MIN(threat_count) OVER ()), 0) as normalized_count
      FROM threat_matrix
    )
    SELECT
      JSON_BUILD_OBJECT(
        'data', JSON_AGG(
          JSON_BUILD_OBJECT(
            'x', x_value,
            'y', y_value,
            'value', threat_count,
            'normalized', COALESCE(normalized_count, 0),
            'severity', avg_severity
          )
        ),
        'xLabels', (SELECT JSON_AGG(DISTINCT x_value ORDER BY x_value) FROM normalized_matrix),
        'yLabels', (SELECT JSON_AGG(DISTINCT y_value ORDER BY y_value) FROM normalized_matrix),
        'stats', JSON_BUILD_OBJECT(
          'min', MIN(threat_count),
          'max', MAX(threat_count),
          'avg', AVG(threat_count),
          'total', SUM(threat_count)
        )
      ) as heat_map
    FROM normalized_matrix
  `;
    const [result] = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const heatMap = result.heat_map || {};
    const data = heatMap.data || [];
    // Convert to matrix format
    const xLabels = heatMap.xLabels || [];
    const yLabels = heatMap.yLabels || [];
    const matrix = [];
    for (let y = 0; y < yLabels.length; y++) {
        matrix[y] = [];
        for (let x = 0; x < xLabels.length; x++) {
            const point = data.find((d) => d.x === xLabels[x] && d.y === yLabels[y]);
            matrix[y][x] = point?.value || 0;
        }
    }
    return {
        matrix,
        labels: { x: xLabels, y: yLabels },
        metadata: heatMap.stats || {},
    };
}
/**
 * 8. Generate executive summary report
 * Comprehensive aggregation for C-level reporting
 */
async function generateExecutiveSummary(sequelize, timeRange, options) {
    const query = `
    WITH summary_metrics AS (
      SELECT
        COUNT(*) as total_threats,
        COUNT(CASE WHEN severity IN ('CRITICAL', 'HIGH') THEN 1 END) as high_severity_threats,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_threats,
        COUNT(CASE WHEN status = 'MITIGATED' THEN 1 END) as mitigated_threats,
        COUNT(DISTINCT attributed_to_id) FILTER (WHERE attributed_to_id IS NOT NULL) as unique_actors,
        COUNT(DISTINCT ta.asset_id) as affected_assets,
        AVG(EXTRACT(EPOCH FROM (mitigated_at - detected_at))) FILTER (WHERE mitigated_at IS NOT NULL) / 3600 as avg_resolution_hours
      FROM threats t
      LEFT JOIN threat_assets ta ON t.id = ta.threat_id
      WHERE t.detected_at BETWEEN $1 AND $2
    ),
    previous_metrics AS (
      SELECT
        COUNT(*) as prev_total_threats,
        COUNT(CASE WHEN severity IN ('CRITICAL', 'HIGH') THEN 1 END) as prev_high_severity
      FROM threats
      WHERE detected_at BETWEEN $1 - ($2 - $1) AND $1
    ),
    top_threats AS (
      SELECT
        t.id,
        t.name,
        t.severity,
        COUNT(*) as occurrence_count,
        COUNT(DISTINCT ta.asset_id) as affected_assets,
        CASE
          WHEN COUNT(*) > LAG(COUNT(*)) OVER (ORDER BY t.name) THEN 'increasing'
          WHEN COUNT(*) < LAG(COUNT(*)) OVER (ORDER BY t.name) THEN 'decreasing'
          ELSE 'stable'
        END as trend
      FROM threats t
      LEFT JOIN threat_assets ta ON t.id = ta.threat_id
      WHERE t.detected_at BETWEEN $1 AND $2
      GROUP BY t.id, t.name, t.severity
      ORDER BY occurrence_count DESC, affected_assets DESC
      LIMIT 10
    ),
    trend_analysis AS (
      SELECT
        threat_type as category,
        CASE
          WHEN REGR_SLOPE(threat_count, time_idx) > 0.5 THEN 'increasing'
          WHEN REGR_SLOPE(threat_count, time_idx) < -0.5 THEN 'decreasing'
          ELSE 'stable'
        END as trend,
        REGR_SLOPE(threat_count, time_idx) as change_rate
      FROM (
        SELECT
          threat_type,
          date_trunc('day', detected_at) as day,
          COUNT(*) as threat_count,
          ROW_NUMBER() OVER (PARTITION BY threat_type ORDER BY date_trunc('day', detected_at)) as time_idx
        FROM threats
        WHERE detected_at BETWEEN $1 AND $2
        GROUP BY threat_type, date_trunc('day', detected_at)
      ) daily_trends
      GROUP BY threat_type
    )
    SELECT
      JSON_BUILD_OBJECT(
        'metrics', (
          SELECT JSON_BUILD_ARRAY(
            JSON_BUILD_OBJECT(
              'name', 'Total Threats',
              'value', sm.total_threats,
              'change', ROUND(((sm.total_threats - pm.prev_total_threats)::numeric / NULLIF(pm.prev_total_threats, 0) * 100)::numeric, 2),
              'status', CASE
                WHEN sm.total_threats > pm.prev_total_threats * 1.5 THEN 'critical'
                WHEN sm.total_threats > pm.prev_total_threats * 1.2 THEN 'warning'
                ELSE 'good'
              END
            ),
            JSON_BUILD_OBJECT(
              'name', 'High Severity Threats',
              'value', sm.high_severity_threats,
              'change', ROUND(((sm.high_severity_threats - pm.prev_high_severity)::numeric / NULLIF(pm.prev_high_severity, 0) * 100)::numeric, 2),
              'status', CASE
                WHEN sm.high_severity_threats > pm.prev_high_severity THEN 'critical'
                ELSE 'warning'
              END
            ),
            JSON_BUILD_OBJECT(
              'name', 'Active Threats',
              'value', sm.active_threats,
              'change', 0,
              'status', CASE
                WHEN sm.active_threats > sm.total_threats * 0.3 THEN 'critical'
                WHEN sm.active_threats > sm.total_threats * 0.1 THEN 'warning'
                ELSE 'good'
              END
            ),
            JSON_BUILD_OBJECT(
              'name', 'Average Resolution Time',
              'value', ROUND(sm.avg_resolution_hours::numeric, 2) || ' hours',
              'change', 0,
              'status', CASE
                WHEN sm.avg_resolution_hours > 48 THEN 'critical'
                WHEN sm.avg_resolution_hours > 24 THEN 'warning'
                ELSE 'good'
              END
            )
          )
          FROM summary_metrics sm, previous_metrics pm
        ),
        'topThreats', (SELECT JSON_AGG(ROW_TO_JSON(tt)) FROM top_threats tt),
        'trends', (SELECT JSON_AGG(ROW_TO_JSON(ta)) FROM trend_analysis ta),
        'recommendations', JSON_BUILD_ARRAY(
          JSON_BUILD_OBJECT(
            'priority', 'high',
            'title', 'Increase Monitoring for Critical Assets',
            'description', 'Based on threat patterns, critical assets require enhanced monitoring',
            'actions', JSON_BUILD_ARRAY(
              'Deploy additional sensors on critical infrastructure',
              'Implement real-time alerting for suspicious activities',
              'Conduct vulnerability assessments'
            )
          ),
          JSON_BUILD_OBJECT(
            'priority', 'medium',
            'title', 'Update Threat Intelligence Feeds',
            'description', 'Ensure threat intelligence sources are current and comprehensive',
            'actions', JSON_BUILD_ARRAY(
              'Review and update threat feed subscriptions',
              'Integrate emerging threat sources',
              'Validate IOC accuracy'
            )
          )
        )
      ) as summary
    FROM summary_metrics
  `;
    const [result] = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const summary = result.summary || {};
    return {
        summaryId: `EXEC-SUMMARY-${Date.now()}`,
        period: timeRange,
        keyMetrics: summary.metrics || [],
        topThreats: summary.topThreats || [],
        trendAnalysis: summary.trends || [],
        recommendations: summary.recommendations || [],
        generatedAt: new Date(),
    };
}
/**
 * 9. Export dashboard data for external visualization tools
 * Formatted data export with multiple format support
 */
async function exportDashboardData(sequelize, dashboardId, format, timeRange, options) {
    const query = `
    SELECT
      t.id,
      t.name,
      t.threat_type,
      t.severity,
      t.status,
      t.detected_at,
      t.mitigated_at,
      t.confidence_score,
      t.source,
      ta.name as actor_name,
      ARRAY_AGG(DISTINCT ast.name) FILTER (WHERE ast.name IS NOT NULL) as affected_assets,
      ARRAY_AGG(DISTINCT ti.indicator_value) FILTER (WHERE ti.indicator_value IS NOT NULL) as iocs,
      COUNT(DISTINCT tev.id) as event_count
    FROM threats t
    LEFT JOIN threat_actors ta ON t.attributed_to_id = ta.id
    LEFT JOIN threat_assets tat ON t.id = tat.threat_id
    LEFT JOIN assets ast ON tat.asset_id = ast.id
    LEFT JOIN threat_indicators ti ON t.id = ti.threat_id
    LEFT JOIN threat_events tev ON t.id = tev.threat_id
    WHERE t.detected_at BETWEEN $1 AND $2
    GROUP BY t.id, t.name, t.threat_type, t.severity, t.status,
             t.detected_at, t.mitigated_at, t.confidence_score, t.source, ta.name
    ORDER BY t.detected_at DESC
  `;
    const results = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const metadata = {
        reportId: `EXPORT-${dashboardId}-${Date.now()}`,
        title: `Dashboard Export - ${dashboardId}`,
        format,
        generatedAt: new Date(),
        generatedBy: 'system',
        timeRange,
        parameters: { dashboardId },
    };
    return {
        data: results,
        metadata,
    };
}
/**
 * 10. Generate threat distribution chart data
 * Multi-dimensional distribution analysis
 */
async function generateThreatDistributionData(sequelize, timeRange, groupBy, options) {
    const query = `
    WITH threat_distribution AS (
      SELECT
        ${groupBy} as category,
        COUNT(*) as count,
        COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_count,
        COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as high_count,
        COUNT(CASE WHEN severity = 'MEDIUM' THEN 1 END) as medium_count,
        COUNT(CASE WHEN severity = 'LOW' THEN 1 END) as low_count,
        AVG(confidence_score) as avg_confidence,
        COUNT(DISTINCT attributed_to_id) FILTER (WHERE attributed_to_id IS NOT NULL) as unique_actors
      FROM threats
      WHERE detected_at BETWEEN $1 AND $2
      GROUP BY category
      ORDER BY count DESC
      LIMIT 20
    )
    SELECT
      JSON_AGG(category ORDER BY count DESC) as labels,
      JSON_BUILD_OBJECT(
        'total', JSON_AGG(count ORDER BY count DESC),
        'critical', JSON_AGG(critical_count ORDER BY count DESC),
        'high', JSON_AGG(high_count ORDER BY count DESC),
        'medium', JSON_AGG(medium_count ORDER BY count DESC),
        'low', JSON_AGG(low_count ORDER BY count DESC),
        'confidence', JSON_AGG(ROUND(avg_confidence::numeric, 2) ORDER BY count DESC)
      ) as datasets
    FROM threat_distribution
  `;
    const [result] = await sequelize.query(query, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const labels = result.labels || [];
    const datasets = result.datasets || {};
    return {
        labels,
        datasets: [
            { label: 'Total', data: datasets.total || [] },
            { label: 'Critical', data: datasets.critical || [], backgroundColor: '#ef4444' },
            { label: 'High', data: datasets.high || [], backgroundColor: '#f97316' },
            { label: 'Medium', data: datasets.medium || [], backgroundColor: '#eab308' },
            { label: 'Low', data: datasets.low || [], backgroundColor: '#22c55e' },
        ],
        metadata: { groupBy },
    };
}
/**
 * 11-40: Additional visualization and dashboard functions
 */
async function generateThreatSeverityPieChart(sequelize, timeRange, options) {
    const [result] = await sequelize.query(`
    SELECT
      severity,
      COUNT(*) as count,
      ROUND((COUNT(*)::numeric / SUM(COUNT(*)) OVER ()) * 100, 2) as percentage
    FROM threats
    WHERE detected_at BETWEEN $1 AND $2
    GROUP BY severity
    ORDER BY count DESC
    `, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const data = result;
    return {
        labels: data.map(d => d.severity),
        datasets: [{
                label: 'Threat Severity Distribution',
                data: data.map(d => d.count),
                backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
                metadata: { percentages: data.map(d => d.percentage) },
            }],
    };
}
async function getThreatsByAssetChart(sequelize, timeRange, options) {
    const results = await sequelize.query(`
    SELECT
      a.name as asset_name,
      COUNT(DISTINCT t.id) as threat_count,
      MAX(t.severity) as max_severity
    FROM assets a
    JOIN threat_assets ta ON a.id = ta.asset_id
    JOIN threats t ON ta.threat_id = t.id
    WHERE t.detected_at BETWEEN $1 AND $2
    GROUP BY a.id, a.name
    ORDER BY threat_count DESC
    LIMIT $3
    `, {
        bind: [timeRange.start, timeRange.end, options?.limit || 10],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const data = results;
    return {
        labels: data.map(d => d.asset_name),
        datasets: [{
                label: 'Threats per Asset',
                data: data.map(d => d.threat_count),
                backgroundColor: '#3b82f6',
            }],
    };
}
async function getThreatResponseTimeChart(sequelize, timeRange, options) {
    const results = await sequelize.query(`
    SELECT
      date_trunc('day', detected_at) as day,
      AVG(EXTRACT(EPOCH FROM (mitigated_at - detected_at)) / 3600) as avg_hours,
      MIN(EXTRACT(EPOCH FROM (mitigated_at - detected_at)) / 3600) as min_hours,
      MAX(EXTRACT(EPOCH FROM (mitigated_at - detected_at)) / 3600) as max_hours
    FROM threats
    WHERE detected_at BETWEEN $1 AND $2
      AND mitigated_at IS NOT NULL
    GROUP BY day
    ORDER BY day
    `, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const data = results;
    return {
        labels: data.map(d => d.day),
        datasets: [
            { label: 'Average Response Time', data: data.map(d => d.avg_hours) },
            { label: 'Min Response Time', data: data.map(d => d.min_hours) },
            { label: 'Max Response Time', data: data.map(d => d.max_hours) },
        ],
    };
}
async function getThreatActorActivityChart(sequelize, timeRange, options) {
    const results = await sequelize.query(`
    SELECT
      ta.name as actor_name,
      COUNT(t.id) as threat_count,
      MAX(t.detected_at) as last_activity
    FROM threat_actors ta
    JOIN threats t ON ta.id = t.attributed_to_id
    WHERE t.detected_at BETWEEN $1 AND $2
    GROUP BY ta.id, ta.name
    ORDER BY threat_count DESC
    LIMIT $3
    `, {
        bind: [timeRange.start, timeRange.end, options?.limit || 10],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const data = results;
    return {
        labels: data.map(d => d.actor_name),
        datasets: [{
                label: 'Threats by Actor',
                data: data.map(d => d.threat_count),
                backgroundColor: '#8b5cf6',
            }],
    };
}
async function getIOCTypeDistribution(sequelize, timeRange, options) {
    const results = await sequelize.query(`
    SELECT
      ti.indicator_type,
      COUNT(*) as count
    FROM threat_indicators ti
    JOIN threats t ON ti.threat_id = t.id
    WHERE t.detected_at BETWEEN $1 AND $2
    GROUP BY ti.indicator_type
    ORDER BY count DESC
    `, {
        bind: [timeRange.start, timeRange.end],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    const data = results;
    return {
        labels: data.map(d => d.indicator_type),
        datasets: [{
                label: 'IOC Types',
                data: data.map(d => d.count),
                backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
            }],
    };
}
function formatChartDataForExport(widgetData, format) {
    if (format === ReportFormat.JSON) {
        return widgetData;
    }
    else if (format === ReportFormat.CSV) {
        const rows = [['Label', ...widgetData.datasets.map(d => d.label)]];
        widgetData.labels.forEach((label, idx) => {
            rows.push([label, ...widgetData.datasets.map(d => d.data[idx]?.toString() || '')]);
        });
        return rows;
    }
    return widgetData;
}
function calculateWidgetRefreshPriority(widget) {
    const priorityMap = {
        [DashboardWidgetType.METRIC_CARD]: 10,
        [DashboardWidgetType.LINE_CHART]: 8,
        [DashboardWidgetType.GEO_MAP]: 6,
        [DashboardWidgetType.NETWORK_GRAPH]: 4,
        [DashboardWidgetType.TABLE]: 7,
        [DashboardWidgetType.HEAT_MAP]: 5,
        [DashboardWidgetType.PIE_CHART]: 6,
        [DashboardWidgetType.BAR_CHART]: 7,
        [DashboardWidgetType.AREA_CHART]: 7,
        [DashboardWidgetType.SCATTER_PLOT]: 5,
        [DashboardWidgetType.TIMELINE]: 6,
        [DashboardWidgetType.GAUGE]: 9,
    };
    return priorityMap[widget.type] || 5;
}
async function getRealtimeThreatFeed(sequelize, lastFetchTime, options) {
    const results = await sequelize.query(`
    SELECT
      t.id,
      t.name,
      t.threat_type,
      t.severity,
      t.detected_at,
      ta.name as actor_name
    FROM threats t
    LEFT JOIN threat_actors ta ON t.attributed_to_id = ta.id
    WHERE t.detected_at > $1
    ORDER BY t.detected_at DESC
    LIMIT $2
    `, {
        bind: [lastFetchTime, options?.limit || 50],
        type: sequelize_1.QueryTypes.SELECT,
        transaction: options?.transaction,
    });
    return results;
}
async function generateDashboardSnapshot(sequelize, dashboardId, timeRange, options) {
    const overview = await getThreatDashboardOverview(sequelize, timeRange, options);
    const metrics = await generateMetricCards(sequelize, timeRange, options);
    const timeSeries = await generateThreatTimeSeriesData(sequelize, timeRange, TimeGranularity.HOUR, options);
    return {
        dashboardId,
        snapshotTime: new Date(),
        timeRange,
        overview,
        metrics,
        timeSeries,
    };
}
function validateDashboardConfig(config) {
    if (!config.dashboardId || !config.name || !config.widgets || !config.layout) {
        return false;
    }
    for (const widget of config.widgets) {
        if (!widget.widgetId || !widget.type || !widget.position) {
            return false;
        }
    }
    return true;
}
function mergeDashboardWidgets(widgets1, widgets2) {
    const merged = [...widgets1];
    const existingIds = new Set(widgets1.map(w => w.widgetId));
    for (const widget of widgets2) {
        if (!existingIds.has(widget.widgetId)) {
            merged.push(widget);
        }
    }
    return merged;
}
// Export all functions for reuse
exports.ThreatVisualizationDashboardKit = {
    getThreatDashboardOverview,
    generateThreatTimeSeriesData,
    generateThreatGeoMapData,
    generateThreatActorNetworkGraph,
    generateThreatTimelineData,
    generateMetricCards,
    generateThreatHeatMapData,
    generateExecutiveSummary,
    exportDashboardData,
    generateThreatDistributionData,
    generateThreatSeverityPieChart,
    getThreatsByAssetChart,
    getThreatResponseTimeChart,
    getThreatActorActivityChart,
    getIOCTypeDistribution,
    formatChartDataForExport,
    calculateWidgetRefreshPriority,
    getRealtimeThreatFeed,
    generateDashboardSnapshot,
    validateDashboardConfig,
    mergeDashboardWidgets,
};
exports.default = exports.ThreatVisualizationDashboardKit;
//# sourceMappingURL=threat-visualization-dashboard-kit.js.map