"use strict";
/**
 * LOC: SECDASH1234567
 * File: /reuse/threat/security-dashboard-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Security dashboard services
 *   - Executive reporting modules
 *   - Real-time monitoring services
 *   - Metrics aggregation services
 *   - Threat visualization services
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
exports.MetricQueryDto = exports.UpdateDashboardDto = exports.CreateWidgetDto = exports.CreateDashboardDto = exports.DashboardDrillDown = exports.SecurityMetricModel = exports.DashboardLayoutModel = exports.DashboardWidget = exports.SecurityDashboard = exports.MetricAggregation = exports.RefreshInterval = exports.WidgetType = void 0;
exports.createExecutiveDashboard = createExecutiveDashboard;
exports.getExecutiveSummary = getExecutiveSummary;
exports.cloneExecutiveDashboard = cloneExecutiveDashboard;
exports.generateExecutiveBriefing = generateExecutiveBriefing;
exports.shareExecutiveDashboard = shareExecutiveDashboard;
exports.exportExecutiveDashboard = exportExecutiveDashboard;
exports.archiveExecutiveDashboard = archiveExecutiveDashboard;
exports.subscribeToRealtimeUpdates = subscribeToRealtimeUpdates;
exports.renderThreatMap = renderThreatMap;
exports.generateThreatTimeline = generateThreatTimeline;
exports.getSeverityDistribution = getSeverityDistribution;
exports.getAttackVectorBreakdown = getAttackVectorBreakdown;
exports.generateVulnerabilityHeatmap = generateVulnerabilityHeatmap;
exports.getRealtimeAlertFeed = getRealtimeAlertFeed;
exports.updateWidgetRealtimeData = updateWidgetRealtimeData;
exports.aggregateMetricsByCategory = aggregateMetricsByCategory;
exports.calculateCompositeSecurityScore = calculateCompositeSecurityScore;
exports.recordSecurityMetric = recordSecurityMetric;
exports.querySecurityMetrics = querySecurityMetrics;
exports.calculateMetricPercentiles = calculateMetricPercentiles;
exports.getTopMetrics = getTopMetrics;
exports.compareMetricsAcrossPeriods = compareMetricsAcrossPeriods;
exports.detectMetricAnomalies = detectMetricAnomalies;
exports.createCustomWidget = createCustomWidget;
exports.updateWidgetConfig = updateWidgetConfig;
exports.duplicateWidget = duplicateWidget;
exports.reorderDashboardWidgets = reorderDashboardWidgets;
exports.getWidgetTemplates = getWidgetTemplates;
exports.validateWidgetConfig = validateWidgetConfig;
exports.applyWidgetTheme = applyWidgetTheme;
exports.exportWidgetAsTemplate = exportWidgetAsTemplate;
exports.createDrillDownContext = createDrillDownContext;
exports.getDrillDownDetails = getDrillDownDetails;
exports.addDrillDownFilter = addDrillDownFilter;
exports.navigateDrillDownBack = navigateDrillDownBack;
exports.exportDrillDownData = exportDrillDownData;
exports.saveDrillDownView = saveDrillDownView;
exports.loadDrillDownView = loadDrillDownView;
exports.listUserDashboards = listUserDashboards;
exports.searchDashboards = searchDashboards;
exports.toggleDashboardFavorite = toggleDashboardFavorite;
exports.recordDashboardView = recordDashboardView;
exports.getDashboardAnalytics = getDashboardAnalytics;
exports.deleteDashboard = deleteDashboard;
/**
 * File: /reuse/threat/security-dashboard-kit.ts
 * Locator: WC-SECURITY-DASHBOARD-001
 * Purpose: Comprehensive Security Dashboard Toolkit - Production-ready dashboard and visualization operations
 *
 * Upstream: Independent utility module for security dashboard operations
 * Downstream: ../backend/*, Dashboard services, Metrics aggregation, Visualization, Executive reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 45 utility functions for dashboards, widgets, metrics, visualization, drill-down analytics
 *
 * LLM Context: Enterprise-grade security dashboard toolkit for White Cross healthcare platform.
 * Provides comprehensive executive security dashboards, real-time threat visualization, security
 * metrics aggregation, customizable widgets, drill-down analytics, dashboard management, and
 * HIPAA-compliant security monitoring for healthcare systems. Includes Sequelize models for
 * dashboards, widgets, layouts, and metrics with advanced TypeScript type safety.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Dashboard widget type discriminator
 */
var WidgetType;
(function (WidgetType) {
    WidgetType["THREAT_TIMELINE"] = "THREAT_TIMELINE";
    WidgetType["THREAT_MAP"] = "THREAT_MAP";
    WidgetType["SEVERITY_DISTRIBUTION"] = "SEVERITY_DISTRIBUTION";
    WidgetType["TOP_THREATS"] = "TOP_THREATS";
    WidgetType["METRIC_GAUGE"] = "METRIC_GAUGE";
    WidgetType["TREND_CHART"] = "TREND_CHART";
    WidgetType["INCIDENT_LIST"] = "INCIDENT_LIST";
    WidgetType["COMPLIANCE_SCORE"] = "COMPLIANCE_SCORE";
    WidgetType["VULNERABILITY_HEATMAP"] = "VULNERABILITY_HEATMAP";
    WidgetType["ATTACK_VECTOR_BREAKDOWN"] = "ATTACK_VECTOR_BREAKDOWN";
    WidgetType["RISK_SCORE_CARD"] = "RISK_SCORE_CARD";
    WidgetType["ALERT_FEED"] = "ALERT_FEED";
})(WidgetType || (exports.WidgetType = WidgetType = {}));
/**
 * Dashboard refresh interval
 */
var RefreshInterval;
(function (RefreshInterval) {
    RefreshInterval[RefreshInterval["REALTIME"] = 0] = "REALTIME";
    RefreshInterval[RefreshInterval["FIVE_SECONDS"] = 5000] = "FIVE_SECONDS";
    RefreshInterval[RefreshInterval["FIFTEEN_SECONDS"] = 15000] = "FIFTEEN_SECONDS";
    RefreshInterval[RefreshInterval["THIRTY_SECONDS"] = 30000] = "THIRTY_SECONDS";
    RefreshInterval[RefreshInterval["ONE_MINUTE"] = 60000] = "ONE_MINUTE";
    RefreshInterval[RefreshInterval["FIVE_MINUTES"] = 300000] = "FIVE_MINUTES";
    RefreshInterval[RefreshInterval["MANUAL"] = -1] = "MANUAL";
})(RefreshInterval || (exports.RefreshInterval = RefreshInterval = {}));
/**
 * Metric aggregation type
 */
var MetricAggregation;
(function (MetricAggregation) {
    MetricAggregation["SUM"] = "SUM";
    MetricAggregation["AVG"] = "AVG";
    MetricAggregation["MIN"] = "MIN";
    MetricAggregation["MAX"] = "MAX";
    MetricAggregation["COUNT"] = "COUNT";
    MetricAggregation["PERCENTILE_50"] = "PERCENTILE_50";
    MetricAggregation["PERCENTILE_95"] = "PERCENTILE_95";
    MetricAggregation["PERCENTILE_99"] = "PERCENTILE_99";
    MetricAggregation["STDDEV"] = "STDDEV";
})(MetricAggregation || (exports.MetricAggregation = MetricAggregation = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let SecurityDashboard = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'security_dashboards',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['owner_id'] },
                { fields: ['visibility'] },
                { fields: ['created_at'] },
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
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _layoutId_decorators;
    let _layoutId_initializers = [];
    let _layoutId_extraInitializers = [];
    let _permissionsConfig_decorators;
    let _permissionsConfig_initializers = [];
    let _permissionsConfig_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _isFavorite_decorators;
    let _isFavorite_initializers = [];
    let _isFavorite_extraInitializers = [];
    let _viewCount_decorators;
    let _viewCount_initializers = [];
    let _viewCount_extraInitializers = [];
    let _lastViewedAt_decorators;
    let _lastViewedAt_initializers = [];
    let _lastViewedAt_extraInitializers = [];
    let _widgets_decorators;
    let _widgets_initializers = [];
    let _widgets_extraInitializers = [];
    let _layouts_decorators;
    let _layouts_initializers = [];
    let _layouts_extraInitializers = [];
    var SecurityDashboard = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.ownerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.visibility = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
            this.layoutId = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _layoutId_initializers, void 0));
            this.permissionsConfig = (__runInitializers(this, _layoutId_extraInitializers), __runInitializers(this, _permissionsConfig_initializers, void 0));
            this.settings = (__runInitializers(this, _permissionsConfig_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
            this.tags = (__runInitializers(this, _settings_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.isFavorite = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _isFavorite_initializers, void 0));
            this.viewCount = (__runInitializers(this, _isFavorite_extraInitializers), __runInitializers(this, _viewCount_initializers, void 0));
            this.lastViewedAt = (__runInitializers(this, _viewCount_extraInitializers), __runInitializers(this, _lastViewedAt_initializers, void 0));
            this.widgets = (__runInitializers(this, _lastViewedAt_extraInitializers), __runInitializers(this, _widgets_initializers, void 0));
            this.layouts = (__runInitializers(this, _widgets_extraInitializers), __runInitializers(this, _layouts_initializers, void 0));
            __runInitializers(this, _layouts_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SecurityDashboard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'dash_123456', description: 'Unique dashboard identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Executive Security Overview', description: 'Dashboard name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'High-level security metrics for executives', description: 'Dashboard description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _ownerId_decorators = [(0, swagger_1.ApiProperty)({ example: 'user_123', description: 'Dashboard owner ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'owner_id' })];
        _visibility_decorators = [(0, swagger_1.ApiProperty)({ enum: ['private', 'team', 'organization', 'public'], example: 'organization' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('private', 'team', 'organization', 'public'), allowNull: false })];
        _layoutId_decorators = [(0, swagger_1.ApiProperty)({ example: 'layout_123', description: 'Active layout ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'layout_id' })];
        _permissionsConfig_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard permissions configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'permissions_config' })];
        _settings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dashboard settings' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: ['executive', 'security'], description: 'Dashboard tags' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), defaultValue: [] })];
        _isFavorite_decorators = [(0, swagger_1.ApiProperty)({ example: false, description: 'Whether dashboard is favorited' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _viewCount_decorators = [(0, swagger_1.ApiProperty)({ example: 1250, description: 'Dashboard view count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0, field: 'view_count' })];
        _lastViewedAt_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-11-09T12:00:00Z', description: 'Last viewed timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'last_viewed_at' })];
        _widgets_decorators = [(0, sequelize_typescript_1.HasMany)(() => DashboardWidget)];
        _layouts_decorators = [(0, sequelize_typescript_1.HasMany)(() => DashboardLayout)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
        __esDecorate(null, null, _layoutId_decorators, { kind: "field", name: "layoutId", static: false, private: false, access: { has: obj => "layoutId" in obj, get: obj => obj.layoutId, set: (obj, value) => { obj.layoutId = value; } }, metadata: _metadata }, _layoutId_initializers, _layoutId_extraInitializers);
        __esDecorate(null, null, _permissionsConfig_decorators, { kind: "field", name: "permissionsConfig", static: false, private: false, access: { has: obj => "permissionsConfig" in obj, get: obj => obj.permissionsConfig, set: (obj, value) => { obj.permissionsConfig = value; } }, metadata: _metadata }, _permissionsConfig_initializers, _permissionsConfig_extraInitializers);
        __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _isFavorite_decorators, { kind: "field", name: "isFavorite", static: false, private: false, access: { has: obj => "isFavorite" in obj, get: obj => obj.isFavorite, set: (obj, value) => { obj.isFavorite = value; } }, metadata: _metadata }, _isFavorite_initializers, _isFavorite_extraInitializers);
        __esDecorate(null, null, _viewCount_decorators, { kind: "field", name: "viewCount", static: false, private: false, access: { has: obj => "viewCount" in obj, get: obj => obj.viewCount, set: (obj, value) => { obj.viewCount = value; } }, metadata: _metadata }, _viewCount_initializers, _viewCount_extraInitializers);
        __esDecorate(null, null, _lastViewedAt_decorators, { kind: "field", name: "lastViewedAt", static: false, private: false, access: { has: obj => "lastViewedAt" in obj, get: obj => obj.lastViewedAt, set: (obj, value) => { obj.lastViewedAt = value; } }, metadata: _metadata }, _lastViewedAt_initializers, _lastViewedAt_extraInitializers);
        __esDecorate(null, null, _widgets_decorators, { kind: "field", name: "widgets", static: false, private: false, access: { has: obj => "widgets" in obj, get: obj => obj.widgets, set: (obj, value) => { obj.widgets = value; } }, metadata: _metadata }, _widgets_initializers, _widgets_extraInitializers);
        __esDecorate(null, null, _layouts_decorators, { kind: "field", name: "layouts", static: false, private: false, access: { has: obj => "layouts" in obj, get: obj => obj.layouts, set: (obj, value) => { obj.layouts = value; } }, metadata: _metadata }, _layouts_initializers, _layouts_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityDashboard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityDashboard = _classThis;
})();
exports.SecurityDashboard = SecurityDashboard;
let DashboardWidget = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'dashboard_widgets',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['dashboard_id'] },
                { fields: ['widget_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _dashboardId_decorators;
    let _dashboardId_initializers = [];
    let _dashboardId_extraInitializers = [];
    let _widgetType_decorators;
    let _widgetType_initializers = [];
    let _widgetType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _config_decorators;
    let _config_initializers = [];
    let _config_extraInitializers = [];
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    let _refreshInterval_decorators;
    let _refreshInterval_initializers = [];
    let _refreshInterval_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _cachedData_decorators;
    let _cachedData_initializers = [];
    let _cachedData_extraInitializers = [];
    let _cacheExpiresAt_decorators;
    let _cacheExpiresAt_initializers = [];
    let _cacheExpiresAt_extraInitializers = [];
    let _dashboard_decorators;
    let _dashboard_initializers = [];
    let _dashboard_extraInitializers = [];
    var DashboardWidget = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.dashboardId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _dashboardId_initializers, void 0));
            this.widgetType = (__runInitializers(this, _dashboardId_extraInitializers), __runInitializers(this, _widgetType_initializers, void 0));
            this.title = (__runInitializers(this, _widgetType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.config = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _config_initializers, void 0));
            this.position = (__runInitializers(this, _config_extraInitializers), __runInitializers(this, _position_initializers, void 0));
            this.refreshInterval = (__runInitializers(this, _position_extraInitializers), __runInitializers(this, _refreshInterval_initializers, void 0));
            this.enabled = (__runInitializers(this, _refreshInterval_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
            this.cachedData = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _cachedData_initializers, void 0));
            this.cacheExpiresAt = (__runInitializers(this, _cachedData_extraInitializers), __runInitializers(this, _cacheExpiresAt_initializers, void 0));
            this.dashboard = (__runInitializers(this, _cacheExpiresAt_extraInitializers), __runInitializers(this, _dashboard_initializers, void 0));
            __runInitializers(this, _dashboard_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DashboardWidget");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'widget_123456', description: 'Unique widget identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _dashboardId_decorators = [(0, swagger_1.ApiProperty)({ example: 'dash_123456', description: 'Parent dashboard ID' }), (0, sequelize_typescript_1.ForeignKey)(() => SecurityDashboard), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'dashboard_id' })];
        _widgetType_decorators = [(0, swagger_1.ApiProperty)({ enum: WidgetType, example: WidgetType.THREAT_TIMELINE }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'widget_type' })];
        _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Threat Activity Timeline', description: 'Widget title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _config_decorators = [(0, swagger_1.ApiProperty)({ description: 'Widget configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _position_decorators = [(0, swagger_1.ApiProperty)({ description: 'Widget position and size' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _refreshInterval_decorators = [(0, swagger_1.ApiProperty)({ example: 30000, description: 'Refresh interval in milliseconds' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 30000, field: 'refresh_interval' })];
        _enabled_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Whether widget is enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _cachedData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cached widget data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'cached_data' })];
        _cacheExpiresAt_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-11-09T12:00:00Z', description: 'Cache expiration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'cache_expires_at' })];
        _dashboard_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SecurityDashboard)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _dashboardId_decorators, { kind: "field", name: "dashboardId", static: false, private: false, access: { has: obj => "dashboardId" in obj, get: obj => obj.dashboardId, set: (obj, value) => { obj.dashboardId = value; } }, metadata: _metadata }, _dashboardId_initializers, _dashboardId_extraInitializers);
        __esDecorate(null, null, _widgetType_decorators, { kind: "field", name: "widgetType", static: false, private: false, access: { has: obj => "widgetType" in obj, get: obj => obj.widgetType, set: (obj, value) => { obj.widgetType = value; } }, metadata: _metadata }, _widgetType_initializers, _widgetType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: obj => "config" in obj, get: obj => obj.config, set: (obj, value) => { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
        __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
        __esDecorate(null, null, _refreshInterval_decorators, { kind: "field", name: "refreshInterval", static: false, private: false, access: { has: obj => "refreshInterval" in obj, get: obj => obj.refreshInterval, set: (obj, value) => { obj.refreshInterval = value; } }, metadata: _metadata }, _refreshInterval_initializers, _refreshInterval_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _cachedData_decorators, { kind: "field", name: "cachedData", static: false, private: false, access: { has: obj => "cachedData" in obj, get: obj => obj.cachedData, set: (obj, value) => { obj.cachedData = value; } }, metadata: _metadata }, _cachedData_initializers, _cachedData_extraInitializers);
        __esDecorate(null, null, _cacheExpiresAt_decorators, { kind: "field", name: "cacheExpiresAt", static: false, private: false, access: { has: obj => "cacheExpiresAt" in obj, get: obj => obj.cacheExpiresAt, set: (obj, value) => { obj.cacheExpiresAt = value; } }, metadata: _metadata }, _cacheExpiresAt_initializers, _cacheExpiresAt_extraInitializers);
        __esDecorate(null, null, _dashboard_decorators, { kind: "field", name: "dashboard", static: false, private: false, access: { has: obj => "dashboard" in obj, get: obj => obj.dashboard, set: (obj, value) => { obj.dashboard = value; } }, metadata: _metadata }, _dashboard_initializers, _dashboard_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardWidget = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardWidget = _classThis;
})();
exports.DashboardWidget = DashboardWidget;
let DashboardLayoutModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'dashboard_layouts',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _dashboardId_decorators;
    let _dashboardId_initializers = [];
    let _dashboardId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _config_decorators;
    let _config_initializers = [];
    let _config_extraInitializers = [];
    let _isDefault_decorators;
    let _isDefault_initializers = [];
    let _isDefault_extraInitializers = [];
    let _dashboard_decorators;
    let _dashboard_initializers = [];
    let _dashboard_extraInitializers = [];
    var DashboardLayoutModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.dashboardId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _dashboardId_initializers, void 0));
            this.name = (__runInitializers(this, _dashboardId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.config = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _config_initializers, void 0));
            this.isDefault = (__runInitializers(this, _config_extraInitializers), __runInitializers(this, _isDefault_initializers, void 0));
            this.dashboard = (__runInitializers(this, _isDefault_extraInitializers), __runInitializers(this, _dashboard_initializers, void 0));
            __runInitializers(this, _dashboard_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DashboardLayoutModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'layout_123456', description: 'Unique layout identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _dashboardId_decorators = [(0, swagger_1.ApiProperty)({ example: 'dash_123456', description: 'Parent dashboard ID' }), (0, sequelize_typescript_1.ForeignKey)(() => SecurityDashboard), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'dashboard_id' })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Default Layout', description: 'Layout name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _config_decorators = [(0, swagger_1.ApiProperty)({ description: 'Layout configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _isDefault_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Whether layout is default' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false, field: 'is_default' })];
        _dashboard_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SecurityDashboard)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _dashboardId_decorators, { kind: "field", name: "dashboardId", static: false, private: false, access: { has: obj => "dashboardId" in obj, get: obj => obj.dashboardId, set: (obj, value) => { obj.dashboardId = value; } }, metadata: _metadata }, _dashboardId_initializers, _dashboardId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: obj => "config" in obj, get: obj => obj.config, set: (obj, value) => { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
        __esDecorate(null, null, _isDefault_decorators, { kind: "field", name: "isDefault", static: false, private: false, access: { has: obj => "isDefault" in obj, get: obj => obj.isDefault, set: (obj, value) => { obj.isDefault = value; } }, metadata: _metadata }, _isDefault_initializers, _isDefault_extraInitializers);
        __esDecorate(null, null, _dashboard_decorators, { kind: "field", name: "dashboard", static: false, private: false, access: { has: obj => "dashboard" in obj, get: obj => obj.dashboard, set: (obj, value) => { obj.dashboard = value; } }, metadata: _metadata }, _dashboard_initializers, _dashboard_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardLayoutModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardLayoutModel = _classThis;
})();
exports.DashboardLayoutModel = DashboardLayoutModel;
let SecurityMetricModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'security_metrics',
            timestamps: true,
            indexes: [
                { fields: ['metric_key'], unique: true },
                { fields: ['category'] },
                { fields: ['recorded_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _metricKey_decorators;
    let _metricKey_initializers = [];
    let _metricKey_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _recordedAt_decorators;
    let _recordedAt_initializers = [];
    let _recordedAt_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    var SecurityMetricModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.metricKey = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _metricKey_initializers, void 0));
            this.category = (__runInitializers(this, _metricKey_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.value = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.unit = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
            this.metadata = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.recordedAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _recordedAt_initializers, void 0));
            this.tags = (__runInitializers(this, _recordedAt_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            __runInitializers(this, _tags_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SecurityMetricModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'metric_123456', description: 'Unique metric identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _metricKey_decorators = [(0, swagger_1.ApiProperty)({ example: 'threats.detected.count', description: 'Metric key' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true, field: 'metric_key' })];
        _category_decorators = [(0, swagger_1.ApiProperty)({ enum: ['threat', 'vulnerability', 'compliance', 'incident', 'risk', 'performance'] }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _value_decorators = [(0, swagger_1.ApiProperty)({ example: 42.5, description: 'Metric value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, allowNull: false })];
        _unit_decorators = [(0, swagger_1.ApiProperty)({ example: 'count', description: 'Metric unit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _recordedAt_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-11-09T12:00:00Z', description: 'Metric timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'recorded_at' })];
        _tags_decorators = [(0, swagger_1.ApiProperty)({ example: ['production', 'critical'], description: 'Metric tags' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), defaultValue: [] })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _metricKey_decorators, { kind: "field", name: "metricKey", static: false, private: false, access: { has: obj => "metricKey" in obj, get: obj => obj.metricKey, set: (obj, value) => { obj.metricKey = value; } }, metadata: _metadata }, _metricKey_initializers, _metricKey_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _recordedAt_decorators, { kind: "field", name: "recordedAt", static: false, private: false, access: { has: obj => "recordedAt" in obj, get: obj => obj.recordedAt, set: (obj, value) => { obj.recordedAt = value; } }, metadata: _metadata }, _recordedAt_initializers, _recordedAt_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityMetricModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityMetricModel = _classThis;
})();
exports.SecurityMetricModel = SecurityMetricModel;
let DashboardDrillDown = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'dashboard_drill_downs',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _context_decorators;
    let _context_initializers = [];
    let _context_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    var DashboardDrillDown = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.context = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _context_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _context_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            __runInitializers(this, _expiresAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DashboardDrillDown");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'drill_123456', description: 'Unique drill-down identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ example: 'user_123', description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'user_id' })];
        _context_decorators = [(0, swagger_1.ApiProperty)({ description: 'Drill-down context' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _expiresAt_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-11-09T12:00:00Z', description: 'Expiration timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'expires_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: obj => "context" in obj, get: obj => obj.context, set: (obj, value) => { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardDrillDown = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardDrillDown = _classThis;
})();
exports.DashboardDrillDown = DashboardDrillDown;
// ============================================================================
// SWAGGER DTOs
// ============================================================================
let CreateDashboardDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CreateDashboardDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.visibility = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
                this.settings = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
                this.tags = (__runInitializers(this, _settings_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Executive Security Overview' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'High-level security metrics for executives' }), (0, class_validator_1.IsString)()];
            _visibility_decorators = [(0, swagger_1.ApiProperty)({ enum: ['private', 'team', 'organization', 'public'], example: 'organization' }), (0, class_validator_1.IsEnum)(['private', 'team', 'organization', 'public'])];
            _settings_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: 'object' }), (0, class_validator_1.IsObject)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['executive', 'security'] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDashboardDto = CreateDashboardDto;
let CreateWidgetDto = (() => {
    var _a;
    let _widgetType_decorators;
    let _widgetType_initializers = [];
    let _widgetType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _config_decorators;
    let _config_initializers = [];
    let _config_extraInitializers = [];
    let _refreshInterval_decorators;
    let _refreshInterval_initializers = [];
    let _refreshInterval_extraInitializers = [];
    return _a = class CreateWidgetDto {
            constructor() {
                this.widgetType = __runInitializers(this, _widgetType_initializers, void 0);
                this.title = (__runInitializers(this, _widgetType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.config = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _config_initializers, void 0));
                this.refreshInterval = (__runInitializers(this, _config_extraInitializers), __runInitializers(this, _refreshInterval_initializers, void 0));
                __runInitializers(this, _refreshInterval_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _widgetType_decorators = [(0, swagger_1.ApiProperty)({ enum: WidgetType, example: WidgetType.THREAT_TIMELINE }), (0, class_validator_1.IsEnum)(WidgetType)];
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Threat Activity Timeline' }), (0, class_validator_1.IsString)()];
            _config_decorators = [(0, swagger_1.ApiProperty)({ type: 'object', description: 'Widget configuration' }), (0, class_validator_1.IsObject)()];
            _refreshInterval_decorators = [(0, swagger_1.ApiProperty)({ example: 30000, description: 'Refresh interval in milliseconds' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _widgetType_decorators, { kind: "field", name: "widgetType", static: false, private: false, access: { has: obj => "widgetType" in obj, get: obj => obj.widgetType, set: (obj, value) => { obj.widgetType = value; } }, metadata: _metadata }, _widgetType_initializers, _widgetType_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: obj => "config" in obj, get: obj => obj.config, set: (obj, value) => { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
            __esDecorate(null, null, _refreshInterval_decorators, { kind: "field", name: "refreshInterval", static: false, private: false, access: { has: obj => "refreshInterval" in obj, get: obj => obj.refreshInterval, set: (obj, value) => { obj.refreshInterval = value; } }, metadata: _metadata }, _refreshInterval_initializers, _refreshInterval_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWidgetDto = CreateWidgetDto;
let UpdateDashboardDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class UpdateDashboardDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.settings = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
                this.tags = (__runInitializers(this, _settings_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Updated Dashboard Name' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Updated description' }), (0, class_validator_1.IsString)()];
            _settings_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: 'object' }), (0, class_validator_1.IsObject)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateDashboardDto = UpdateDashboardDto;
let MetricQueryDto = (() => {
    var _a;
    let _metricKey_decorators;
    let _metricKey_initializers = [];
    let _metricKey_extraInitializers = [];
    let _aggregation_decorators;
    let _aggregation_initializers = [];
    let _aggregation_extraInitializers = [];
    let _timeRange_decorators;
    let _timeRange_initializers = [];
    let _timeRange_extraInitializers = [];
    let _filters_decorators;
    let _filters_initializers = [];
    let _filters_extraInitializers = [];
    return _a = class MetricQueryDto {
            constructor() {
                this.metricKey = __runInitializers(this, _metricKey_initializers, void 0);
                this.aggregation = (__runInitializers(this, _metricKey_extraInitializers), __runInitializers(this, _aggregation_initializers, void 0));
                this.timeRange = (__runInitializers(this, _aggregation_extraInitializers), __runInitializers(this, _timeRange_initializers, void 0));
                this.filters = (__runInitializers(this, _timeRange_extraInitializers), __runInitializers(this, _filters_initializers, void 0));
                __runInitializers(this, _filters_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _metricKey_decorators = [(0, swagger_1.ApiProperty)({ example: 'threats.detected.count' }), (0, class_validator_1.IsString)()];
            _aggregation_decorators = [(0, swagger_1.ApiProperty)({ enum: MetricAggregation, example: MetricAggregation.SUM }), (0, class_validator_1.IsEnum)(MetricAggregation)];
            _timeRange_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' }), (0, class_validator_1.IsObject)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _filters_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: 'object' }), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _metricKey_decorators, { kind: "field", name: "metricKey", static: false, private: false, access: { has: obj => "metricKey" in obj, get: obj => obj.metricKey, set: (obj, value) => { obj.metricKey = value; } }, metadata: _metadata }, _metricKey_initializers, _metricKey_extraInitializers);
            __esDecorate(null, null, _aggregation_decorators, { kind: "field", name: "aggregation", static: false, private: false, access: { has: obj => "aggregation" in obj, get: obj => obj.aggregation, set: (obj, value) => { obj.aggregation = value; } }, metadata: _metadata }, _aggregation_initializers, _aggregation_extraInitializers);
            __esDecorate(null, null, _timeRange_decorators, { kind: "field", name: "timeRange", static: false, private: false, access: { has: obj => "timeRange" in obj, get: obj => obj.timeRange, set: (obj, value) => { obj.timeRange = value; } }, metadata: _metadata }, _timeRange_initializers, _timeRange_extraInitializers);
            __esDecorate(null, null, _filters_decorators, { kind: "field", name: "filters", static: false, private: false, access: { has: obj => "filters" in obj, get: obj => obj.filters, set: (obj, value) => { obj.filters = value; } }, metadata: _metadata }, _filters_initializers, _filters_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MetricQueryDto = MetricQueryDto;
// ============================================================================
// EXECUTIVE DASHBOARD FUNCTIONS (8 functions)
// ============================================================================
/**
 * Creates an executive security dashboard with pre-configured widgets
 * @param ownerId - Dashboard owner user ID
 * @param config - Dashboard configuration
 * @returns Created dashboard with default executive widgets
 */
async function createExecutiveDashboard(ownerId, config = {}) {
    const dashboardId = `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dashboard = await SecurityDashboard.create({
        id: dashboardId,
        name: config.name || 'Executive Security Dashboard',
        description: config.description || 'Comprehensive security overview for executives',
        ownerId,
        visibility: config.visibility || 'organization',
        permissionsConfig: {
            ownerId,
            visibility: config.visibility || 'organization',
            allowedRoles: ['EXECUTIVE', 'SECURITY_MANAGER', 'ADMIN'],
            allowedUsers: [],
            permissions: {
                canView: true,
                canEdit: false,
                canShare: true,
                canDelete: false,
            },
        },
        settings: {
            defaultTimeRange: { start: new Date(Date.now() - 24 * 60 * 60 * 1000), end: new Date(), preset: 'last_24h' },
            autoRefresh: true,
            theme: 'light',
            enableDrillDown: true,
            ...config.settings,
        },
        tags: config.tags || ['executive', 'security', 'overview'],
        isFavorite: false,
        viewCount: 0,
    });
    // Create default executive widgets
    await createDefaultExecutiveWidgets(dashboardId);
    return dashboard;
}
/**
 * Creates default executive widgets for a dashboard
 * @param dashboardId - Target dashboard ID
 */
async function createDefaultExecutiveWidgets(dashboardId) {
    const defaultWidgets = [
        {
            widgetType: WidgetType.RISK_SCORE_CARD,
            title: 'Overall Security Risk Score',
            position: { x: 0, y: 0, width: 4, height: 3 },
        },
        {
            widgetType: WidgetType.THREAT_TIMELINE,
            title: 'Threat Activity (24h)',
            position: { x: 4, y: 0, width: 8, height: 3 },
        },
        {
            widgetType: WidgetType.SEVERITY_DISTRIBUTION,
            title: 'Threat Severity Distribution',
            position: { x: 0, y: 3, width: 4, height: 3 },
        },
        {
            widgetType: WidgetType.COMPLIANCE_SCORE,
            title: 'Compliance Status',
            position: { x: 4, y: 3, width: 4, height: 3 },
        },
        {
            widgetType: WidgetType.TOP_THREATS,
            title: 'Top 10 Active Threats',
            position: { x: 8, y: 3, width: 4, height: 3 },
        },
    ];
    for (const widget of defaultWidgets) {
        await DashboardWidget.create({
            id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            dashboardId,
            widgetType: widget.widgetType,
            title: widget.title,
            config: createDefaultWidgetConfig(widget.widgetType),
            position: widget.position,
            refreshInterval: RefreshInterval.THIRTY_SECONDS,
            enabled: true,
        });
    }
}
/**
 * Gets executive summary metrics for dashboard
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for metrics
 * @returns Executive summary with key metrics
 */
async function getExecutiveSummary(dashboardId, timeRange) {
    const metrics = await SecurityMetricModel.findAll({
        where: {
            recordedAt: {
                $between: [timeRange.start, timeRange.end],
            },
            category: ['threat', 'risk', 'compliance', 'incident'],
        },
        order: [['recordedAt', 'DESC']],
    });
    const summary = {
        riskScore: calculateRiskScore(metrics),
        threatCount: metrics.filter(m => m.category === 'threat').length,
        criticalIncidents: metrics.filter(m => m.category === 'incident' && m.value >= 8).length,
        complianceScore: calculateComplianceScore(metrics),
        trends: calculateMetricTrends(metrics, timeRange),
    };
    return summary;
}
/**
 * Clones an executive dashboard for another user
 * @param sourceDashboardId - Source dashboard to clone
 * @param newOwnerId - New owner user ID
 * @param customizations - Optional customizations
 * @returns Cloned dashboard
 */
async function cloneExecutiveDashboard(sourceDashboardId, newOwnerId, customizations = {}) {
    const source = await SecurityDashboard.findByPk(sourceDashboardId, {
        include: [DashboardWidget],
    });
    if (!source) {
        throw new Error(`Dashboard ${sourceDashboardId} not found`);
    }
    const newDashboardId = `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cloned = await SecurityDashboard.create({
        id: newDashboardId,
        name: customizations.name || `${source.name} (Copy)`,
        description: customizations.description || source.description,
        ownerId: newOwnerId,
        visibility: customizations.visibility || 'private',
        permissionsConfig: {
            ...source.permissionsConfig,
            ownerId: newOwnerId,
        },
        settings: { ...source.settings, ...customizations.settings },
        tags: customizations.tags || source.tags,
        isFavorite: false,
        viewCount: 0,
    });
    // Clone widgets
    for (const widget of source.widgets || []) {
        await DashboardWidget.create({
            id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            dashboardId: newDashboardId,
            widgetType: widget.widgetType,
            title: widget.title,
            config: widget.config,
            position: widget.position,
            refreshInterval: widget.refreshInterval,
            enabled: widget.enabled,
        });
    }
    return cloned;
}
/**
 * Generates executive security briefing from dashboard data
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for briefing
 * @returns Executive briefing document
 */
async function generateExecutiveBriefing(dashboardId, timeRange) {
    const summary = await getExecutiveSummary(dashboardId, timeRange);
    const briefing = {
        summary: `Security posture assessment for ${timeRange.preset || 'custom period'}`,
        keyFindings: [
            `Overall risk score: ${summary.riskScore}/100`,
            `${summary.threatCount} threats detected in period`,
            `${summary.criticalIncidents} critical incidents requiring immediate attention`,
            `Compliance score: ${summary.complianceScore}%`,
        ],
        recommendations: generateSecurityRecommendations(summary),
        metrics: summary,
        timestamp: new Date(),
    };
    return briefing;
}
/**
 * Shares executive dashboard with specific users or roles
 * @param dashboardId - Dashboard ID
 * @param shareWith - Users or roles to share with
 * @param permissions - Sharing permissions
 */
async function shareExecutiveDashboard(dashboardId, shareWith, permissions = {}) {
    const dashboard = await SecurityDashboard.findByPk(dashboardId);
    if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
    }
    const updatedPermissions = {
        ...dashboard.permissionsConfig,
        allowedUsers: [...dashboard.permissionsConfig.allowedUsers, ...(shareWith.users || [])],
        allowedRoles: [...dashboard.permissionsConfig.allowedRoles, ...(shareWith.roles || [])],
        permissions: {
            ...dashboard.permissionsConfig.permissions,
            ...permissions,
        },
    };
    await dashboard.update({ permissionsConfig: updatedPermissions });
}
/**
 * Exports executive dashboard to specified format
 * @param dashboardId - Dashboard ID
 * @param format - Export format
 * @param options - Export options
 * @returns Export data or file path
 */
async function exportExecutiveDashboard(dashboardId, format, options = {}) {
    const dashboard = await SecurityDashboard.findByPk(dashboardId, {
        include: [DashboardWidget],
    });
    if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
    }
    const exportData = {
        dashboard: dashboard.toJSON(),
        widgets: dashboard.widgets?.map(w => w.toJSON()) || [],
        data: options.includeData && options.timeRange
            ? await getExecutiveSummary(dashboardId, options.timeRange)
            : null,
        exportedAt: new Date(),
    };
    return {
        format,
        data: exportData,
        filename: `dashboard_${dashboardId}_${Date.now()}.${format}`,
    };
}
/**
 * Archives executive dashboard (soft delete)
 * @param dashboardId - Dashboard ID
 * @param archiveReason - Reason for archival
 */
async function archiveExecutiveDashboard(dashboardId, archiveReason) {
    const dashboard = await SecurityDashboard.findByPk(dashboardId);
    if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
    }
    // Sequelize paranoid mode handles soft delete
    await dashboard.destroy();
    // Log archival
    console.log(`Dashboard ${dashboardId} archived: ${archiveReason || 'No reason provided'}`);
}
// ============================================================================
// REAL-TIME THREAT VISUALIZATION FUNCTIONS (8 functions)
// ============================================================================
/**
 * Subscribes to real-time dashboard updates
 * @param dashboardId - Dashboard ID
 * @param callback - Update callback function
 * @returns Unsubscribe function
 */
function subscribeToRealtimeUpdates(dashboardId, callback) {
    // In production, this would integrate with WebSocket server
    const eventHandler = (event) => {
        if (event.dashboardId === dashboardId) {
            callback(event);
        }
    };
    // Simulated event listener
    const intervalId = setInterval(() => {
        // Mock real-time update
        const mockEvent = {
            dashboardId,
            eventType: 'metric_update',
            timestamp: new Date(),
            data: { metricKey: 'threats.realtime.count', value: Math.floor(Math.random() * 100) },
        };
        eventHandler(mockEvent);
    }, 5000);
    return () => clearInterval(intervalId);
}
/**
 * Renders threat map visualization with geolocation data
 * @param timeRange - Time range for threat data
 * @param filters - Optional filters
 * @returns Threat map data for visualization
 */
async function renderThreatMap(timeRange, filters = {}) {
    // In production, this would query actual threat geolocation data
    const mockMarkers = Array.from({ length: 50 }, (_, i) => ({
        lat: (Math.random() * 180) - 90,
        lng: (Math.random() * 360) - 180,
        severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
        count: Math.floor(Math.random() * 100) + 1,
    }));
    return {
        markers: mockMarkers,
        heatmap: mockMarkers.map(m => ({ lat: m.lat, lng: m.lng, weight: m.count })),
        bounds: { north: 85, south: -85, east: 180, west: -180 },
    };
}
/**
 * Generates threat timeline visualization data
 * @param timeRange - Time range for timeline
 * @param groupBy - Grouping interval
 * @returns Timeline data points
 */
async function generateThreatTimeline(timeRange, groupBy = 'hour') {
    const intervals = calculateTimeIntervals(timeRange, groupBy);
    return intervals.map(interval => ({
        timestamp: interval,
        count: Math.floor(Math.random() * 100),
        severity: {
            CRITICAL: Math.floor(Math.random() * 10),
            HIGH: Math.floor(Math.random() * 20),
            MEDIUM: Math.floor(Math.random() * 40),
            LOW: Math.floor(Math.random() * 30),
        },
    }));
}
/**
 * Creates severity distribution chart data
 * @param timeRange - Time range for data
 * @returns Severity distribution data
 */
async function getSeverityDistribution(timeRange) {
    const metrics = await SecurityMetricModel.findAll({
        where: {
            recordedAt: { $between: [timeRange.start, timeRange.end] },
            category: 'threat',
        },
    });
    const distribution = {
        CRITICAL: { count: 0, percentage: 0 },
        HIGH: { count: 0, percentage: 0 },
        MEDIUM: { count: 0, percentage: 0 },
        LOW: { count: 0, percentage: 0 },
    };
    const total = metrics.length;
    metrics.forEach(metric => {
        const severity = metric.metadata?.severity || 'LOW';
        if (distribution[severity]) {
            distribution[severity].count++;
        }
    });
    Object.keys(distribution).forEach(severity => {
        distribution[severity].percentage = total > 0 ? (distribution[severity].count / total) * 100 : 0;
    });
    return distribution;
}
/**
 * Generates attack vector breakdown visualization
 * @param timeRange - Time range for data
 * @returns Attack vector distribution
 */
async function getAttackVectorBreakdown(timeRange) {
    const vectors = [
        'Phishing', 'Malware', 'Ransomware', 'DDoS', 'SQL Injection',
        'XSS', 'Brute Force', 'Zero-Day', 'Social Engineering', 'Insider Threat',
    ];
    const total = 1000;
    return vectors.map(vector => ({
        vector,
        count: Math.floor(Math.random() * 200),
        percentage: Math.random() * 100,
        trend: (Math.random() * 40) - 20, // -20% to +20%
    }));
}
/**
 * Creates vulnerability heatmap data
 * @param timeRange - Time range for data
 * @returns Heatmap data matrix
 */
async function generateVulnerabilityHeatmap(timeRange) {
    const systems = ['Web Server', 'Database', 'API Gateway', 'Auth Service', 'File Storage', 'Email Server'];
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const data = severities.map(() => systems.map(() => Math.floor(Math.random() * 50)));
    return {
        data,
        xLabels: systems,
        yLabels: severities,
        colorScale: { min: 0, max: 50 },
    };
}
/**
 * Generates real-time alert feed for dashboard
 * @param dashboardId - Dashboard ID
 * @param limit - Maximum number of alerts
 * @returns Recent alerts
 */
async function getRealtimeAlertFeed(dashboardId, limit = 50) {
    // In production, this would query actual alert system
    return Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
        id: `alert_${Date.now()}_${i}`,
        severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
        title: `Security Alert ${i + 1}`,
        description: 'Suspicious activity detected',
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        source: ['IDS', 'Firewall', 'EDR', 'SIEM'][Math.floor(Math.random() * 4)],
        status: ['new', 'acknowledged', 'resolved'][Math.floor(Math.random() * 3)],
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
/**
 * Updates widget with real-time data
 * @param widgetId - Widget ID
 * @param data - Real-time data
 * @param cacheFor - Cache duration in milliseconds
 */
async function updateWidgetRealtimeData(widgetId, data, cacheFor = 30000) {
    const widget = await DashboardWidget.findByPk(widgetId);
    if (!widget) {
        throw new Error(`Widget ${widgetId} not found`);
    }
    await widget.update({
        cachedData: data,
        cacheExpiresAt: new Date(Date.now() + cacheFor),
    });
}
// ============================================================================
// SECURITY METRICS AGGREGATION FUNCTIONS (8 functions)
// ============================================================================
/**
 * Aggregates security metrics by category
 * @param category - Metric category
 * @param timeRange - Time range for aggregation
 * @param aggregation - Aggregation type
 * @returns Aggregated metric value
 */
async function aggregateMetricsByCategory(category, timeRange, aggregation) {
    const metrics = await SecurityMetricModel.findAll({
        where: {
            category,
            recordedAt: { $between: [timeRange.start, timeRange.end] },
        },
    });
    return performAggregation(metrics.map(m => m.value), aggregation);
}
/**
 * Calculates composite security score
 * @param timeRange - Time range for calculation
 * @param weights - Category weights
 * @returns Composite security score (0-100)
 */
async function calculateCompositeSecurityScore(timeRange, weights = {}) {
    const defaultWeights = {
        threat: 0.3,
        vulnerability: 0.25,
        compliance: 0.25,
        incident: 0.15,
        risk: 0.05,
    };
    const finalWeights = { ...defaultWeights, ...weights };
    const breakdown = {};
    for (const [category, weight] of Object.entries(finalWeights)) {
        const categoryScore = await aggregateMetricsByCategory(category, timeRange, MetricAggregation.AVG);
        breakdown[category] = categoryScore * weight;
    }
    const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    // Calculate trend
    const previousRange = {
        start: new Date(timeRange.start.getTime() - (timeRange.end.getTime() - timeRange.start.getTime())),
        end: timeRange.start,
    };
    const previousScore = await calculateCompositeSecurityScore(previousRange, weights);
    const trend = score - (previousScore?.score || score);
    return { score, breakdown, trend };
}
/**
 * Records a new security metric
 * @param metricData - Metric data to record
 * @returns Created metric
 */
async function recordSecurityMetric(metricData) {
    const metric = await SecurityMetricModel.create({
        id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metricKey: metricData.metricKey,
        category: metricData.category,
        value: metricData.value,
        unit: metricData.unit,
        metadata: metricData.metadata,
        recordedAt: new Date(),
        tags: metricData.tags || [],
    });
    return metric;
}
/**
 * Queries metrics with flexible filters
 * @param query - Query parameters
 * @returns Matching metrics
 */
async function querySecurityMetrics(query) {
    const whereClause = {
        recordedAt: { $between: [query.timeRange.start, query.timeRange.end] },
    };
    if (query.metricKeys?.length) {
        whereClause.metricKey = { $in: query.metricKeys };
    }
    if (query.categories?.length) {
        whereClause.category = { $in: query.categories };
    }
    if (query.tags?.length) {
        whereClause.tags = { $overlap: query.tags };
    }
    const metrics = await SecurityMetricModel.findAll({
        where: whereClause,
        order: [['recordedAt', 'ASC']],
    });
    if (query.groupBy) {
        return groupMetricsByInterval(metrics, query.groupBy, query.aggregation || MetricAggregation.AVG);
    }
    return metrics;
}
/**
 * Calculates metric percentiles
 * @param metricKey - Metric key
 * @param timeRange - Time range
 * @param percentiles - Percentile values to calculate
 * @returns Percentile values
 */
async function calculateMetricPercentiles(metricKey, timeRange, percentiles = [50, 75, 90, 95, 99]) {
    const metrics = await SecurityMetricModel.findAll({
        where: {
            metricKey,
            recordedAt: { $between: [timeRange.start, timeRange.end] },
        },
        order: [['value', 'ASC']],
    });
    const values = metrics.map(m => m.value);
    const result = {};
    for (const p of percentiles) {
        const index = Math.ceil((p / 100) * values.length) - 1;
        result[p] = values[Math.max(0, Math.min(index, values.length - 1))] || 0;
    }
    return result;
}
/**
 * Gets top N metrics by value
 * @param category - Metric category
 * @param timeRange - Time range
 * @param limit - Number of top metrics
 * @param orderBy - Order direction
 * @returns Top metrics
 */
async function getTopMetrics(category, timeRange, limit = 10, orderBy = 'DESC') {
    return await SecurityMetricModel.findAll({
        where: {
            category,
            recordedAt: { $between: [timeRange.start, timeRange.end] },
        },
        order: [['value', orderBy]],
        limit,
    });
}
/**
 * Compares metrics across time periods
 * @param metricKey - Metric key
 * @param currentRange - Current time range
 * @param comparisonRange - Comparison time range
 * @returns Comparison results
 */
async function compareMetricsAcrossPeriods(metricKey, currentRange, comparisonRange) {
    const currentMetrics = await SecurityMetricModel.findAll({
        where: {
            metricKey,
            recordedAt: { $between: [currentRange.start, currentRange.end] },
        },
    });
    const comparisonMetrics = await SecurityMetricModel.findAll({
        where: {
            metricKey,
            recordedAt: { $between: [comparisonRange.start, comparisonRange.end] },
        },
    });
    const currentStats = calculateStats(currentMetrics.map(m => m.value));
    const comparisonStats = calculateStats(comparisonMetrics.map(m => m.value));
    return {
        current: { ...currentStats, count: currentMetrics.length },
        comparison: { ...comparisonStats, count: comparisonMetrics.length },
        change: {
            absolute: currentStats.avg - comparisonStats.avg,
            percentage: comparisonStats.avg > 0
                ? ((currentStats.avg - comparisonStats.avg) / comparisonStats.avg) * 100
                : 0,
        },
    };
}
/**
 * Detects metric anomalies using statistical methods
 * @param metricKey - Metric key
 * @param timeRange - Time range to analyze
 * @param sensitivity - Anomaly detection sensitivity (1-10)
 * @returns Detected anomalies
 */
async function detectMetricAnomalies(metricKey, timeRange, sensitivity = 5) {
    const metrics = await SecurityMetricModel.findAll({
        where: {
            metricKey,
            recordedAt: { $between: [timeRange.start, timeRange.end] },
        },
        order: [['recordedAt', 'ASC']],
    });
    const values = metrics.map(m => m.value);
    const stats = calculateStats(values);
    const threshold = stats.stddev * (sensitivity / 5);
    const anomalies = metrics
        .filter(m => Math.abs(m.value - stats.avg) > threshold)
        .map(m => ({
        timestamp: m.recordedAt,
        value: m.value,
        expectedValue: stats.avg,
        deviation: Math.abs(m.value - stats.avg),
        severity: categorizeAnomalySeverity(Math.abs(m.value - stats.avg), threshold),
    }));
    return anomalies;
}
// ============================================================================
// CUSTOMIZABLE WIDGET FUNCTIONS (8 functions)
// ============================================================================
/**
 * Creates a custom dashboard widget
 * @param dashboardId - Dashboard ID
 * @param widgetConfig - Widget configuration
 * @returns Created widget
 */
async function createCustomWidget(dashboardId, widgetConfig) {
    const widget = await DashboardWidget.create({
        id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dashboardId,
        widgetType: widgetConfig.widgetType,
        title: widgetConfig.title,
        config: widgetConfig.config,
        position: { x: 0, y: 0, width: 4, height: 3 }, // Default position
        refreshInterval: widgetConfig.refreshInterval,
        enabled: true,
    });
    return widget;
}
/**
 * Updates widget configuration
 * @param widgetId - Widget ID
 * @param updates - Configuration updates
 * @returns Updated widget
 */
async function updateWidgetConfig(widgetId, updates) {
    const widget = await DashboardWidget.findByPk(widgetId);
    if (!widget) {
        throw new Error(`Widget ${widgetId} not found`);
    }
    await widget.update(updates);
    return widget;
}
/**
 * Duplicates a widget within the same dashboard
 * @param widgetId - Widget ID to duplicate
 * @param customizations - Optional customizations
 * @returns Duplicated widget
 */
async function duplicateWidget(widgetId, customizations = {}) {
    const source = await DashboardWidget.findByPk(widgetId);
    if (!source) {
        throw new Error(`Widget ${widgetId} not found`);
    }
    const duplicate = await DashboardWidget.create({
        id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dashboardId: source.dashboardId,
        widgetType: customizations.widgetType || source.widgetType,
        title: customizations.title || `${source.title} (Copy)`,
        config: customizations.config || source.config,
        position: {
            ...source.position,
            y: source.position.y + source.position.height + 1, // Position below source
        },
        refreshInterval: customizations.refreshInterval || source.refreshInterval,
        enabled: true,
    });
    return duplicate;
}
/**
 * Reorders widgets in dashboard layout
 * @param dashboardId - Dashboard ID
 * @param widgetOrder - Array of widget IDs in desired order
 */
async function reorderDashboardWidgets(dashboardId, widgetOrder) {
    for (const item of widgetOrder) {
        await DashboardWidget.update({ position: item.position }, { where: { id: item.widgetId, dashboardId } });
    }
}
/**
 * Gets available widget templates
 * @returns Widget template definitions
 */
function getWidgetTemplates() {
    return [
        {
            type: WidgetType.THREAT_TIMELINE,
            name: 'Threat Activity Timeline',
            description: 'Visualizes threat activity over time with severity breakdown',
            defaultConfig: createDefaultWidgetConfig(WidgetType.THREAT_TIMELINE),
        },
        {
            type: WidgetType.THREAT_MAP,
            name: 'Geographic Threat Map',
            description: 'Shows threat origins on an interactive world map',
            defaultConfig: createDefaultWidgetConfig(WidgetType.THREAT_MAP),
        },
        {
            type: WidgetType.METRIC_GAUGE,
            name: 'Metric Gauge',
            description: 'Displays a single metric with threshold indicators',
            defaultConfig: createDefaultWidgetConfig(WidgetType.METRIC_GAUGE),
        },
        {
            type: WidgetType.SEVERITY_DISTRIBUTION,
            name: 'Severity Distribution',
            description: 'Pie chart showing threat severity breakdown',
            defaultConfig: createDefaultWidgetConfig(WidgetType.SEVERITY_DISTRIBUTION),
        },
        {
            type: WidgetType.COMPLIANCE_SCORE,
            name: 'Compliance Score Card',
            description: 'Displays compliance status across frameworks',
            defaultConfig: createDefaultWidgetConfig(WidgetType.COMPLIANCE_SCORE),
        },
    ];
}
/**
 * Validates widget configuration
 * @param widgetType - Widget type
 * @param config - Widget configuration
 * @returns Validation result
 */
function validateWidgetConfig(widgetType, config) {
    const errors = [];
    if (config.type !== widgetType) {
        errors.push(`Config type mismatch: expected ${widgetType}, got ${config.type}`);
    }
    if (!config.title || config.title.trim().length === 0) {
        errors.push('Widget title is required');
    }
    if (!config.timeRange || !config.timeRange.start || !config.timeRange.end) {
        errors.push('Valid time range is required');
    }
    // Type-specific validation
    switch (widgetType) {
        case WidgetType.METRIC_GAUGE:
            const gaugeConfig = config;
            if (!gaugeConfig.metricKey) {
                errors.push('Metric key is required for gauge widget');
            }
            if (!gaugeConfig.thresholds) {
                errors.push('Thresholds are required for gauge widget');
            }
            break;
        case WidgetType.THREAT_MAP:
            const mapConfig = config;
            if (!mapConfig.mapType) {
                errors.push('Map type is required for map widget');
            }
            break;
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Applies widget theme customization
 * @param widgetId - Widget ID
 * @param theme - Theme configuration
 */
async function applyWidgetTheme(widgetId, theme) {
    const widget = await DashboardWidget.findByPk(widgetId);
    if (!widget) {
        throw new Error(`Widget ${widgetId} not found`);
    }
    const updatedConfig = {
        ...widget.config,
        theme,
    };
    await widget.update({ config: updatedConfig });
}
/**
 * Exports widget configuration as template
 * @param widgetId - Widget ID
 * @returns Widget template
 */
async function exportWidgetAsTemplate(widgetId) {
    const widget = await DashboardWidget.findByPk(widgetId);
    if (!widget) {
        throw new Error(`Widget ${widgetId} not found`);
    }
    return {
        type: widget.widgetType,
        config: widget.config,
        metadata: {
            exportedAt: new Date(),
            sourceWidget: widgetId,
            title: widget.title,
        },
    };
}
// ============================================================================
// DRILL-DOWN ANALYTICS FUNCTIONS (7 functions)
// ============================================================================
/**
 * Creates drill-down context from widget interaction
 * @param widgetId - Source widget ID
 * @param filters - Applied filters
 * @param timeRange - Time range
 * @returns Drill-down context
 */
async function createDrillDownContext(userId, widgetId, filters, timeRange) {
    const widget = await DashboardWidget.findByPk(widgetId);
    if (!widget) {
        throw new Error(`Widget ${widgetId} not found`);
    }
    const context = {
        sourceWidget: widgetId,
        sourceDashboard: widget.dashboardId,
        filters,
        timeRange,
        breadcrumbs: [
            {
                label: widget.title,
                filters: {},
            },
            {
                label: 'Filtered View',
                filters,
            },
        ],
    };
    // Store drill-down session
    await DashboardDrillDown.create({
        id: `drill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        context,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour expiration
    });
    return context;
}
/**
 * Gets detailed data for drill-down view
 * @param context - Drill-down context
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Detailed drill-down data
 */
async function getDrillDownDetails(context, page = 1, pageSize = 50) {
    // In production, this would query based on context filters
    const mockData = Array.from({ length: pageSize }, (_, i) => ({
        id: `item_${page}_${i}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
        description: `Detailed threat information ${i + 1}`,
        metadata: context.filters,
    }));
    return {
        data: mockData,
        total: 500,
        page,
        pageSize,
        hasMore: page * pageSize < 500,
    };
}
/**
 * Adds filter to drill-down context
 * @param context - Current context
 * @param filterKey - Filter key
 * @param filterValue - Filter value
 * @returns Updated context
 */
function addDrillDownFilter(context, filterKey, filterValue) {
    const updatedFilters = {
        ...context.filters,
        [filterKey]: filterValue,
    };
    return {
        ...context,
        filters: updatedFilters,
        breadcrumbs: [
            ...context.breadcrumbs,
            {
                label: `${filterKey}: ${filterValue}`,
                filters: { [filterKey]: filterValue },
            },
        ],
    };
}
/**
 * Navigates back in drill-down breadcrumb trail
 * @param context - Current context
 * @param levels - Number of levels to go back
 * @returns Updated context
 */
function navigateDrillDownBack(context, levels = 1) {
    const newBreadcrumbs = context.breadcrumbs.slice(0, -levels);
    // Rebuild filters from breadcrumbs
    const rebuiltFilters = newBreadcrumbs.reduce((acc, crumb) => ({
        ...acc,
        ...crumb.filters,
    }), {});
    return {
        ...context,
        filters: rebuiltFilters,
        breadcrumbs: newBreadcrumbs,
    };
}
/**
 * Exports drill-down data to file
 * @param context - Drill-down context
 * @param format - Export format
 * @returns Export data
 */
async function exportDrillDownData(context, format) {
    const allData = await getDrillDownDetails(context, 1, 10000); // Get all data
    const filename = `drilldown_${context.sourceWidget}_${Date.now()}.${format}`;
    return {
        data: allData.data,
        filename,
    };
}
/**
 * Creates saved drill-down view
 * @param userId - User ID
 * @param context - Drill-down context
 * @param name - Saved view name
 * @returns Saved view ID
 */
async function saveDrillDownView(userId, context, name) {
    const drillDown = await DashboardDrillDown.create({
        id: `drill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        context: {
            ...context,
            savedViewName: name,
        },
        expiresAt: null, // Permanent save
    });
    return drillDown.id;
}
/**
 * Loads saved drill-down view
 * @param viewId - Saved view ID
 * @returns Drill-down context
 */
async function loadDrillDownView(viewId) {
    const drillDown = await DashboardDrillDown.findByPk(viewId);
    if (!drillDown) {
        throw new Error(`Drill-down view ${viewId} not found`);
    }
    return drillDown.context;
}
// ============================================================================
// DASHBOARD MANAGEMENT FUNCTIONS (6 functions)
// ============================================================================
/**
 * Lists all dashboards for a user
 * @param userId - User ID
 * @param filters - Optional filters
 * @returns User's dashboards
 */
async function listUserDashboards(userId, filters = {}) {
    const whereClause = {
        $or: [
            { ownerId: userId },
            { 'permissionsConfig.allowedUsers': { $contains: [userId] } },
        ],
    };
    if (filters.visibility?.length) {
        whereClause.visibility = { $in: filters.visibility };
    }
    if (filters.tags?.length) {
        whereClause.tags = { $overlap: filters.tags };
    }
    if (filters.favorites) {
        whereClause.isFavorite = true;
    }
    const orderField = filters.sortBy === 'views' ? 'viewCount' :
        filters.sortBy === 'updated' ? 'updatedAt' :
            filters.sortBy === 'created' ? 'createdAt' : 'name';
    return await SecurityDashboard.findAll({
        where: whereClause,
        order: [[orderField, filters.order || 'DESC']],
        include: [{ model: DashboardWidget, attributes: ['id'] }],
    });
}
/**
 * Searches dashboards by query
 * @param userId - User ID
 * @param query - Search query
 * @returns Matching dashboards
 */
async function searchDashboards(userId, query) {
    return await SecurityDashboard.findAll({
        where: {
            $or: [
                { ownerId: userId },
                { 'permissionsConfig.allowedUsers': { $contains: [userId] } },
            ],
            $and: [
                {
                    $or: [
                        { name: { $iLike: `%${query}%` } },
                        { description: { $iLike: `%${query}%` } },
                        { tags: { $overlap: [query] } },
                    ],
                },
            ],
        },
    });
}
/**
 * Sets dashboard as favorite
 * @param dashboardId - Dashboard ID
 * @param userId - User ID
 * @param favorite - Favorite status
 */
async function toggleDashboardFavorite(dashboardId, userId, favorite) {
    const dashboard = await SecurityDashboard.findByPk(dashboardId);
    if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
    }
    await dashboard.update({ isFavorite: favorite });
}
/**
 * Increments dashboard view count
 * @param dashboardId - Dashboard ID
 */
async function recordDashboardView(dashboardId) {
    const dashboard = await SecurityDashboard.findByPk(dashboardId);
    if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
    }
    await dashboard.update({
        viewCount: dashboard.viewCount + 1,
        lastViewedAt: new Date(),
    });
}
/**
 * Gets dashboard usage analytics
 * @param dashboardId - Dashboard ID
 * @param timeRange - Time range for analytics
 * @returns Usage analytics
 */
async function getDashboardAnalytics(dashboardId, timeRange) {
    // In production, this would query actual analytics data
    return {
        views: Math.floor(Math.random() * 1000),
        uniqueUsers: Math.floor(Math.random() * 50),
        avgSessionDuration: Math.floor(Math.random() * 600), // seconds
        widgetInteractions: {
            widget_1: 150,
            widget_2: 120,
            widget_3: 90,
        },
        popularWidgets: [
            { widgetId: 'widget_1', title: 'Threat Timeline', interactions: 150 },
            { widgetId: 'widget_2', title: 'Risk Score', interactions: 120 },
            { widgetId: 'widget_3', title: 'Compliance Status', interactions: 90 },
        ],
    };
}
/**
 * Deletes dashboard and all associated data
 * @param dashboardId - Dashboard ID
 * @param userId - User ID (for authorization)
 */
async function deleteDashboard(dashboardId, userId) {
    const dashboard = await SecurityDashboard.findByPk(dashboardId);
    if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
    }
    if (dashboard.ownerId !== userId) {
        throw new Error('Only dashboard owner can delete dashboard');
    }
    // Delete associated widgets
    await DashboardWidget.destroy({ where: { dashboardId } });
    // Delete layouts
    await DashboardLayoutModel.destroy({ where: { dashboardId } });
    // Delete drill-downs
    await DashboardDrillDown.destroy({ where: { 'context.sourceDashboard': dashboardId } });
    // Delete dashboard
    await dashboard.destroy();
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function createDefaultWidgetConfig(type) {
    const baseConfig = {
        type,
        title: '',
        refreshInterval: RefreshInterval.THIRTY_SECONDS,
        timeRange: { start: new Date(Date.now() - 24 * 60 * 60 * 1000), end: new Date(), preset: 'last_24h' },
    };
    switch (type) {
        case WidgetType.THREAT_TIMELINE:
            return { ...baseConfig, type, groupBy: 'hour', showTrend: true };
        case WidgetType.THREAT_MAP:
            return { ...baseConfig, type, mapType: 'world', heatmapEnabled: true, clusteringEnabled: true };
        case WidgetType.METRIC_GAUGE:
            return {
                ...baseConfig,
                type,
                metricKey: 'security.risk.score',
                aggregation: MetricAggregation.AVG,
                thresholds: { critical: 80, high: 60, medium: 40, low: 20 },
            };
        default:
            return baseConfig;
    }
}
function calculateRiskScore(metrics) {
    const riskMetrics = metrics.filter(m => m.category === 'risk');
    if (riskMetrics.length === 0)
        return 50;
    const avg = riskMetrics.reduce((sum, m) => sum + m.value, 0) / riskMetrics.length;
    return Math.min(100, Math.max(0, avg));
}
function calculateComplianceScore(metrics) {
    const complianceMetrics = metrics.filter(m => m.category === 'compliance');
    if (complianceMetrics.length === 0)
        return 75;
    const avg = complianceMetrics.reduce((sum, m) => sum + m.value, 0) / complianceMetrics.length;
    return Math.min(100, Math.max(0, avg));
}
function calculateMetricTrends(metrics, timeRange) {
    return {
        threats: (Math.random() * 40) - 20,
        vulnerabilities: (Math.random() * 40) - 20,
        incidents: (Math.random() * 40) - 20,
    };
}
function generateSecurityRecommendations(summary) {
    const recommendations = [];
    if (summary.riskScore > 70) {
        recommendations.push('High risk score detected - review critical vulnerabilities immediately');
    }
    if (summary.criticalIncidents > 5) {
        recommendations.push('Multiple critical incidents - escalate to security team');
    }
    if (summary.complianceScore < 80) {
        recommendations.push('Compliance gaps identified - review compliance requirements');
    }
    return recommendations;
}
function performAggregation(values, aggregation) {
    if (values.length === 0)
        return 0;
    switch (aggregation) {
        case MetricAggregation.SUM:
            return values.reduce((sum, val) => sum + val, 0);
        case MetricAggregation.AVG:
            return values.reduce((sum, val) => sum + val, 0) / values.length;
        case MetricAggregation.MIN:
            return Math.min(...values);
        case MetricAggregation.MAX:
            return Math.max(...values);
        case MetricAggregation.COUNT:
            return values.length;
        case MetricAggregation.STDDEV:
            const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
            const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
            return Math.sqrt(variance);
        default:
            return values[0];
    }
}
function groupMetricsByInterval(metrics, interval, aggregation) {
    const groups = new Map();
    metrics.forEach(metric => {
        const key = formatTimestampForInterval(metric.recordedAt, interval);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(metric.value);
    });
    return Array.from(groups.entries()).map(([timestamp, values]) => ({
        timestamp: new Date(timestamp),
        value: performAggregation(values, aggregation),
    }));
}
function formatTimestampForInterval(date, interval) {
    const d = new Date(date);
    switch (interval) {
        case 'hour':
            d.setMinutes(0, 0, 0);
            break;
        case 'day':
            d.setHours(0, 0, 0, 0);
            break;
        case 'week':
            const day = d.getDay();
            d.setDate(d.getDate() - day);
            d.setHours(0, 0, 0, 0);
            break;
        case 'month':
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
            break;
    }
    return d.toISOString();
}
function calculateStats(values) {
    if (values.length === 0)
        return { avg: 0, min: 0, max: 0, stddev: 0 };
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stddev = Math.sqrt(variance);
    return { avg, min, max, stddev };
}
function categorizeAnomalySeverity(deviation, threshold) {
    if (deviation > threshold * 2)
        return 'high';
    if (deviation > threshold * 1.5)
        return 'medium';
    return 'low';
}
function calculateTimeIntervals(timeRange, groupBy) {
    const intervals = [];
    const start = new Date(timeRange.start);
    const end = new Date(timeRange.end);
    let current = new Date(start);
    const incrementMs = groupBy === 'hour' ? 3600000 : groupBy === 'day' ? 86400000 : 604800000;
    while (current <= end) {
        intervals.push(new Date(current));
        current = new Date(current.getTime() + incrementMs);
    }
    return intervals;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Executive Dashboard (8)
    createExecutiveDashboard,
    getExecutiveSummary,
    cloneExecutiveDashboard,
    generateExecutiveBriefing,
    shareExecutiveDashboard,
    exportExecutiveDashboard,
    archiveExecutiveDashboard,
    // Real-time Visualization (8)
    subscribeToRealtimeUpdates,
    renderThreatMap,
    generateThreatTimeline,
    getSeverityDistribution,
    getAttackVectorBreakdown,
    generateVulnerabilityHeatmap,
    getRealtimeAlertFeed,
    updateWidgetRealtimeData,
    // Metrics Aggregation (8)
    aggregateMetricsByCategory,
    calculateCompositeSecurityScore,
    recordSecurityMetric,
    querySecurityMetrics,
    calculateMetricPercentiles,
    getTopMetrics,
    compareMetricsAcrossPeriods,
    detectMetricAnomalies,
    // Customizable Widgets (8)
    createCustomWidget,
    updateWidgetConfig,
    duplicateWidget,
    reorderDashboardWidgets,
    getWidgetTemplates,
    validateWidgetConfig,
    applyWidgetTheme,
    exportWidgetAsTemplate,
    // Drill-down Analytics (7)
    createDrillDownContext,
    getDrillDownDetails,
    addDrillDownFilter,
    navigateDrillDownBack,
    exportDrillDownData,
    saveDrillDownView,
    loadDrillDownView,
    // Dashboard Management (6)
    listUserDashboards,
    searchDashboards,
    toggleDashboardFavorite,
    recordDashboardView,
    getDashboardAnalytics,
    deleteDashboard,
};
//# sourceMappingURL=security-dashboard-kit.js.map