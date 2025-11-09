"use strict";
/**
 * LOC: VRTINF8765432
 * File: /reuse/virtual/virtual-infrastructure-api-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *
 * DOWNSTREAM (imported by):
 *   - Infrastructure controller implementations
 *   - Datacenter/cluster/host management services
 *   - Capacity planning and resource scheduling systems
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
exports.DRSRecommendationDto = exports.HostMaintenanceModeDto = exports.CapacityThresholdDto = exports.CreateResourcePoolDto = exports.UpdateClusterHADto = exports.UpdateClusterDRSDto = exports.AddHostDto = exports.CreateClusterDto = exports.CreateDatacenterDto = exports.MaintenanceMode = exports.ThresholdType = exports.AlarmSeverity = exports.HostConnectionState = exports.DRSMode = exports.HAMode = exports.HostPowerState = exports.InfrastructureType = void 0;
exports.InfrastructureAudit = InfrastructureAudit;
exports.RequireInfrastructureAdmin = RequireInfrastructureAdmin;
exports.CreateDatacenterDecorators = CreateDatacenterDecorators;
exports.ListDatacentersDecorators = ListDatacentersDecorators;
exports.GetDatacenterDecorators = GetDatacenterDecorators;
exports.UpdateDatacenterDecorators = UpdateDatacenterDecorators;
exports.DeleteDatacenterDecorators = DeleteDatacenterDecorators;
exports.CreateClusterDecorators = CreateClusterDecorators;
exports.ListClustersDecorators = ListClustersDecorators;
exports.GetClusterDecorators = GetClusterDecorators;
exports.UpdateClusterDRSDecorators = UpdateClusterDRSDecorators;
exports.UpdateClusterHADecorators = UpdateClusterHADecorators;
exports.GetClusterRecommendationsDecorators = GetClusterRecommendationsDecorators;
exports.ApplyDRSRecommendationDecorators = ApplyDRSRecommendationDecorators;
exports.AddHostDecorators = AddHostDecorators;
exports.ListHostsDecorators = ListHostsDecorators;
exports.GetHostDecorators = GetHostDecorators;
exports.RemoveHostDecorators = RemoveHostDecorators;
exports.HostMaintenanceModeDecorators = HostMaintenanceModeDecorators;
exports.HostPowerControlDecorators = HostPowerControlDecorators;
exports.ReconnectHostDecorators = ReconnectHostDecorators;
exports.CreateResourcePoolDecorators = CreateResourcePoolDecorators;
exports.ListResourcePoolsDecorators = ListResourcePoolsDecorators;
exports.UpdateResourcePoolDecorators = UpdateResourcePoolDecorators;
exports.DeleteResourcePoolDecorators = DeleteResourcePoolDecorators;
exports.GetCapacityOverviewDecorators = GetCapacityOverviewDecorators;
exports.GetCapacityForecastDecorators = GetCapacityForecastDecorators;
exports.SetCapacityThresholdsDecorators = SetCapacityThresholdsDecorators;
exports.GetCapacityRecommendationsDecorators = GetCapacityRecommendationsDecorators;
exports.GetInfrastructureHealthDecorators = GetInfrastructureHealthDecorators;
exports.ListAlarmsDecorators = ListAlarmsDecorators;
exports.AcknowledgeAlarmDecorators = AcknowledgeAlarmDecorators;
exports.GetInfrastructureMetricsDecorators = GetInfrastructureMetricsDecorators;
exports.OptimizeClusterPlacementDecorators = OptimizeClusterPlacementDecorators;
exports.SimulateWorkloadPlacementDecorators = SimulateWorkloadPlacementDecorators;
exports.GetHostPerformanceDecorators = GetHostPerformanceDecorators;
exports.UpdateHostConfigDecorators = UpdateHostConfigDecorators;
exports.ExportInfrastructureReportDecorators = ExportInfrastructureReportDecorators;
/**
 * File: /reuse/virtual/virtual-infrastructure-api-kit.ts
 * Locator: WC-UTL-VRTINF-001
 * Purpose: Virtual Infrastructure API Controllers - NestJS controllers for datacenter/cluster/host management, capacity planning, infrastructure monitoring
 *
 * Upstream: @nestjs/common, @nestjs/swagger, class-validator, class-transformer
 * Downstream: Infrastructure management controllers, datacenter services, cluster orchestration, host provisioning
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, class-validator 0.14.x
 * Exports: 38 controller functions for infrastructure management, datacenter operations, cluster management, host provisioning, capacity planning
 *
 * LLM Context: Enterprise-grade virtual infrastructure management controller toolkit for White Cross healthcare platform.
 * Provides VMware vCenter/vRealize-level capabilities for managing datacenters, clusters, hosts, and capacity planning.
 * Includes HIPAA-compliant audit logging, resource scheduling, DRS/HA configurations, and advanced infrastructure monitoring.
 * Designed for large-scale healthcare infrastructure orchestration and management.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================
/**
 * Infrastructure component types
 */
var InfrastructureType;
(function (InfrastructureType) {
    InfrastructureType["DATACENTER"] = "datacenter";
    InfrastructureType["CLUSTER"] = "cluster";
    InfrastructureType["HOST"] = "host";
    InfrastructureType["RESOURCE_POOL"] = "resource_pool";
    InfrastructureType["DATASTORE"] = "datastore";
    InfrastructureType["NETWORK"] = "network";
})(InfrastructureType || (exports.InfrastructureType = InfrastructureType = {}));
/**
 * Host power states
 */
var HostPowerState;
(function (HostPowerState) {
    HostPowerState["POWERED_ON"] = "powered_on";
    HostPowerState["POWERED_OFF"] = "powered_off";
    HostPowerState["STANDBY"] = "standby";
    HostPowerState["MAINTENANCE"] = "maintenance";
    HostPowerState["UNKNOWN"] = "unknown";
})(HostPowerState || (exports.HostPowerState = HostPowerState = {}));
/**
 * Cluster HA (High Availability) modes
 */
var HAMode;
(function (HAMode) {
    HAMode["DISABLED"] = "disabled";
    HAMode["ENABLED"] = "enabled";
    HAMode["FULLY_AUTOMATED"] = "fully_automated";
})(HAMode || (exports.HAMode = HAMode = {}));
/**
 * Cluster DRS (Distributed Resource Scheduler) modes
 */
var DRSMode;
(function (DRSMode) {
    DRSMode["DISABLED"] = "disabled";
    DRSMode["MANUAL"] = "manual";
    DRSMode["PARTIALLY_AUTOMATED"] = "partially_automated";
    DRSMode["FULLY_AUTOMATED"] = "fully_automated";
})(DRSMode || (exports.DRSMode = DRSMode = {}));
/**
 * Host connection states
 */
var HostConnectionState;
(function (HostConnectionState) {
    HostConnectionState["CONNECTED"] = "connected";
    HostConnectionState["DISCONNECTED"] = "disconnected";
    HostConnectionState["NOT_RESPONDING"] = "not_responding";
})(HostConnectionState || (exports.HostConnectionState = HostConnectionState = {}));
/**
 * Alarm severity levels
 */
var AlarmSeverity;
(function (AlarmSeverity) {
    AlarmSeverity["CRITICAL"] = "critical";
    AlarmSeverity["WARNING"] = "warning";
    AlarmSeverity["INFO"] = "info";
})(AlarmSeverity || (exports.AlarmSeverity = AlarmSeverity = {}));
/**
 * Capacity planning threshold types
 */
var ThresholdType;
(function (ThresholdType) {
    ThresholdType["CPU"] = "cpu";
    ThresholdType["MEMORY"] = "memory";
    ThresholdType["STORAGE"] = "storage";
    ThresholdType["NETWORK"] = "network";
})(ThresholdType || (exports.ThresholdType = ThresholdType = {}));
/**
 * Maintenance mode types
 */
var MaintenanceMode;
(function (MaintenanceMode) {
    MaintenanceMode["ENTER"] = "enter";
    MaintenanceMode["EXIT"] = "exit";
})(MaintenanceMode || (exports.MaintenanceMode = MaintenanceMode = {}));
// ============================================================================
// DTO CLASSES
// ============================================================================
/**
 * DTO for creating datacenter
 */
let CreateDatacenterDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _regionId_decorators;
    let _regionId_initializers = [];
    let _regionId_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    return _a = class CreateDatacenterDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.location = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.tags = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _tags_initializers, []));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.regionId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _regionId_initializers, void 0));
                this.enabled = (__runInitializers(this, _regionId_extraInitializers), __runInitializers(this, _enabled_initializers, true));
                __runInitializers(this, _enabled_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _location_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _regionId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _enabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _regionId_decorators, { kind: "field", name: "regionId", static: false, private: false, access: { has: obj => "regionId" in obj, get: obj => obj.regionId, set: (obj, value) => { obj.regionId = value; } }, metadata: _metadata }, _regionId_initializers, _regionId_extraInitializers);
            __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDatacenterDto = CreateDatacenterDto;
/**
 * DTO for creating cluster
 */
let CreateClusterDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _datacenterId_decorators;
    let _datacenterId_initializers = [];
    let _datacenterId_extraInitializers = [];
    let _drsMode_decorators;
    let _drsMode_initializers = [];
    let _drsMode_extraInitializers = [];
    let _haMode_decorators;
    let _haMode_initializers = [];
    let _haMode_extraInitializers = [];
    let _haAdmissionControlFailoverLevel_decorators;
    let _haAdmissionControlFailoverLevel_initializers = [];
    let _haAdmissionControlFailoverLevel_extraInitializers = [];
    let _vSanEnabled_decorators;
    let _vSanEnabled_initializers = [];
    let _vSanEnabled_extraInitializers = [];
    let _evrsEnabled_decorators;
    let _evrsEnabled_initializers = [];
    let _evrsEnabled_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateClusterDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.datacenterId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _datacenterId_initializers, void 0));
                this.drsMode = (__runInitializers(this, _datacenterId_extraInitializers), __runInitializers(this, _drsMode_initializers, DRSMode.FULLY_AUTOMATED));
                this.haMode = (__runInitializers(this, _drsMode_extraInitializers), __runInitializers(this, _haMode_initializers, HAMode.ENABLED));
                this.haAdmissionControlFailoverLevel = (__runInitializers(this, _haMode_extraInitializers), __runInitializers(this, _haAdmissionControlFailoverLevel_initializers, 1));
                this.vSanEnabled = (__runInitializers(this, _haAdmissionControlFailoverLevel_extraInitializers), __runInitializers(this, _vSanEnabled_initializers, false));
                this.evrsEnabled = (__runInitializers(this, _vSanEnabled_extraInitializers), __runInitializers(this, _evrsEnabled_initializers, false));
                this.tags = (__runInitializers(this, _evrsEnabled_extraInitializers), __runInitializers(this, _tags_initializers, []));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _datacenterId_decorators = [(0, class_validator_1.IsUUID)('4')];
            _drsMode_decorators = [(0, class_validator_1.IsEnum)(DRSMode), (0, class_validator_1.IsOptional)()];
            _haMode_decorators = [(0, class_validator_1.IsEnum)(HAMode), (0, class_validator_1.IsOptional)()];
            _haAdmissionControlFailoverLevel_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(4), (0, class_validator_1.IsOptional)()];
            _vSanEnabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _evrsEnabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _datacenterId_decorators, { kind: "field", name: "datacenterId", static: false, private: false, access: { has: obj => "datacenterId" in obj, get: obj => obj.datacenterId, set: (obj, value) => { obj.datacenterId = value; } }, metadata: _metadata }, _datacenterId_initializers, _datacenterId_extraInitializers);
            __esDecorate(null, null, _drsMode_decorators, { kind: "field", name: "drsMode", static: false, private: false, access: { has: obj => "drsMode" in obj, get: obj => obj.drsMode, set: (obj, value) => { obj.drsMode = value; } }, metadata: _metadata }, _drsMode_initializers, _drsMode_extraInitializers);
            __esDecorate(null, null, _haMode_decorators, { kind: "field", name: "haMode", static: false, private: false, access: { has: obj => "haMode" in obj, get: obj => obj.haMode, set: (obj, value) => { obj.haMode = value; } }, metadata: _metadata }, _haMode_initializers, _haMode_extraInitializers);
            __esDecorate(null, null, _haAdmissionControlFailoverLevel_decorators, { kind: "field", name: "haAdmissionControlFailoverLevel", static: false, private: false, access: { has: obj => "haAdmissionControlFailoverLevel" in obj, get: obj => obj.haAdmissionControlFailoverLevel, set: (obj, value) => { obj.haAdmissionControlFailoverLevel = value; } }, metadata: _metadata }, _haAdmissionControlFailoverLevel_initializers, _haAdmissionControlFailoverLevel_extraInitializers);
            __esDecorate(null, null, _vSanEnabled_decorators, { kind: "field", name: "vSanEnabled", static: false, private: false, access: { has: obj => "vSanEnabled" in obj, get: obj => obj.vSanEnabled, set: (obj, value) => { obj.vSanEnabled = value; } }, metadata: _metadata }, _vSanEnabled_initializers, _vSanEnabled_extraInitializers);
            __esDecorate(null, null, _evrsEnabled_decorators, { kind: "field", name: "evrsEnabled", static: false, private: false, access: { has: obj => "evrsEnabled" in obj, get: obj => obj.evrsEnabled, set: (obj, value) => { obj.evrsEnabled = value; } }, metadata: _metadata }, _evrsEnabled_initializers, _evrsEnabled_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateClusterDto = CreateClusterDto;
/**
 * DTO for adding host to infrastructure
 */
let AddHostDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _hostname_decorators;
    let _hostname_initializers = [];
    let _hostname_extraInitializers = [];
    let _clusterId_decorators;
    let _clusterId_initializers = [];
    let _clusterId_extraInitializers = [];
    let _datacenterId_decorators;
    let _datacenterId_initializers = [];
    let _datacenterId_extraInitializers = [];
    let _username_decorators;
    let _username_initializers = [];
    let _username_extraInitializers = [];
    let _password_decorators;
    let _password_initializers = [];
    let _password_extraInitializers = [];
    let _cpuCores_decorators;
    let _cpuCores_initializers = [];
    let _cpuCores_extraInitializers = [];
    let _memoryMB_decorators;
    let _memoryMB_initializers = [];
    let _memoryMB_extraInitializers = [];
    let _sslVerify_decorators;
    let _sslVerify_initializers = [];
    let _sslVerify_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class AddHostDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.ipAddress = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.hostname = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _hostname_initializers, void 0));
                this.clusterId = (__runInitializers(this, _hostname_extraInitializers), __runInitializers(this, _clusterId_initializers, void 0));
                this.datacenterId = (__runInitializers(this, _clusterId_extraInitializers), __runInitializers(this, _datacenterId_initializers, void 0));
                this.username = (__runInitializers(this, _datacenterId_extraInitializers), __runInitializers(this, _username_initializers, void 0));
                this.password = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.cpuCores = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _cpuCores_initializers, void 0));
                this.memoryMB = (__runInitializers(this, _cpuCores_extraInitializers), __runInitializers(this, _memoryMB_initializers, void 0));
                this.sslVerify = (__runInitializers(this, _memoryMB_extraInitializers), __runInitializers(this, _sslVerify_initializers, true));
                this.tags = (__runInitializers(this, _sslVerify_extraInitializers), __runInitializers(this, _tags_initializers, []));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _ipAddress_decorators = [(0, class_validator_1.IsIP)()];
            _hostname_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _clusterId_decorators = [(0, class_validator_1.IsUUID)('4'), (0, class_validator_1.IsOptional)()];
            _datacenterId_decorators = [(0, class_validator_1.IsUUID)('4'), (0, class_validator_1.IsOptional)()];
            _username_decorators = [(0, class_validator_1.IsString)()];
            _password_decorators = [(0, class_validator_1.IsString)()];
            _cpuCores_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(1024), (0, class_validator_1.IsOptional)()];
            _memoryMB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1024), (0, class_validator_1.Max)(8388608), (0, class_validator_1.IsOptional)()];
            _sslVerify_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _hostname_decorators, { kind: "field", name: "hostname", static: false, private: false, access: { has: obj => "hostname" in obj, get: obj => obj.hostname, set: (obj, value) => { obj.hostname = value; } }, metadata: _metadata }, _hostname_initializers, _hostname_extraInitializers);
            __esDecorate(null, null, _clusterId_decorators, { kind: "field", name: "clusterId", static: false, private: false, access: { has: obj => "clusterId" in obj, get: obj => obj.clusterId, set: (obj, value) => { obj.clusterId = value; } }, metadata: _metadata }, _clusterId_initializers, _clusterId_extraInitializers);
            __esDecorate(null, null, _datacenterId_decorators, { kind: "field", name: "datacenterId", static: false, private: false, access: { has: obj => "datacenterId" in obj, get: obj => obj.datacenterId, set: (obj, value) => { obj.datacenterId = value; } }, metadata: _metadata }, _datacenterId_initializers, _datacenterId_extraInitializers);
            __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: obj => "username" in obj, get: obj => obj.username, set: (obj, value) => { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: obj => "password" in obj, get: obj => obj.password, set: (obj, value) => { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _cpuCores_decorators, { kind: "field", name: "cpuCores", static: false, private: false, access: { has: obj => "cpuCores" in obj, get: obj => obj.cpuCores, set: (obj, value) => { obj.cpuCores = value; } }, metadata: _metadata }, _cpuCores_initializers, _cpuCores_extraInitializers);
            __esDecorate(null, null, _memoryMB_decorators, { kind: "field", name: "memoryMB", static: false, private: false, access: { has: obj => "memoryMB" in obj, get: obj => obj.memoryMB, set: (obj, value) => { obj.memoryMB = value; } }, metadata: _metadata }, _memoryMB_initializers, _memoryMB_extraInitializers);
            __esDecorate(null, null, _sslVerify_decorators, { kind: "field", name: "sslVerify", static: false, private: false, access: { has: obj => "sslVerify" in obj, get: obj => obj.sslVerify, set: (obj, value) => { obj.sslVerify = value; } }, metadata: _metadata }, _sslVerify_initializers, _sslVerify_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AddHostDto = AddHostDto;
/**
 * DTO for updating cluster DRS settings
 */
let UpdateClusterDRSDto = (() => {
    var _a;
    let _drsMode_decorators;
    let _drsMode_initializers = [];
    let _drsMode_extraInitializers = [];
    let _migrationThreshold_decorators;
    let _migrationThreshold_initializers = [];
    let _migrationThreshold_extraInitializers = [];
    let _vmDistribution_decorators;
    let _vmDistribution_initializers = [];
    let _vmDistribution_extraInitializers = [];
    let _memoryMetricForPlacement_decorators;
    let _memoryMetricForPlacement_initializers = [];
    let _memoryMetricForPlacement_extraInitializers = [];
    let _cpuOverCommitRatio_decorators;
    let _cpuOverCommitRatio_initializers = [];
    let _cpuOverCommitRatio_extraInitializers = [];
    let _memoryOverCommitRatio_decorators;
    let _memoryOverCommitRatio_initializers = [];
    let _memoryOverCommitRatio_extraInitializers = [];
    return _a = class UpdateClusterDRSDto {
            constructor() {
                this.drsMode = __runInitializers(this, _drsMode_initializers, void 0);
                this.migrationThreshold = (__runInitializers(this, _drsMode_extraInitializers), __runInitializers(this, _migrationThreshold_initializers, 3));
                this.vmDistribution = (__runInitializers(this, _migrationThreshold_extraInitializers), __runInitializers(this, _vmDistribution_initializers, true));
                this.memoryMetricForPlacement = (__runInitializers(this, _vmDistribution_extraInitializers), __runInitializers(this, _memoryMetricForPlacement_initializers, true));
                this.cpuOverCommitRatio = (__runInitializers(this, _memoryMetricForPlacement_extraInitializers), __runInitializers(this, _cpuOverCommitRatio_initializers, 400));
                this.memoryOverCommitRatio = (__runInitializers(this, _cpuOverCommitRatio_extraInitializers), __runInitializers(this, _memoryOverCommitRatio_initializers, 150));
                __runInitializers(this, _memoryOverCommitRatio_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _drsMode_decorators = [(0, class_validator_1.IsEnum)(DRSMode)];
            _migrationThreshold_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5), (0, class_validator_1.IsOptional)()];
            _vmDistribution_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _memoryMetricForPlacement_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _cpuOverCommitRatio_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100), (0, class_validator_1.IsOptional)()];
            _memoryOverCommitRatio_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _drsMode_decorators, { kind: "field", name: "drsMode", static: false, private: false, access: { has: obj => "drsMode" in obj, get: obj => obj.drsMode, set: (obj, value) => { obj.drsMode = value; } }, metadata: _metadata }, _drsMode_initializers, _drsMode_extraInitializers);
            __esDecorate(null, null, _migrationThreshold_decorators, { kind: "field", name: "migrationThreshold", static: false, private: false, access: { has: obj => "migrationThreshold" in obj, get: obj => obj.migrationThreshold, set: (obj, value) => { obj.migrationThreshold = value; } }, metadata: _metadata }, _migrationThreshold_initializers, _migrationThreshold_extraInitializers);
            __esDecorate(null, null, _vmDistribution_decorators, { kind: "field", name: "vmDistribution", static: false, private: false, access: { has: obj => "vmDistribution" in obj, get: obj => obj.vmDistribution, set: (obj, value) => { obj.vmDistribution = value; } }, metadata: _metadata }, _vmDistribution_initializers, _vmDistribution_extraInitializers);
            __esDecorate(null, null, _memoryMetricForPlacement_decorators, { kind: "field", name: "memoryMetricForPlacement", static: false, private: false, access: { has: obj => "memoryMetricForPlacement" in obj, get: obj => obj.memoryMetricForPlacement, set: (obj, value) => { obj.memoryMetricForPlacement = value; } }, metadata: _metadata }, _memoryMetricForPlacement_initializers, _memoryMetricForPlacement_extraInitializers);
            __esDecorate(null, null, _cpuOverCommitRatio_decorators, { kind: "field", name: "cpuOverCommitRatio", static: false, private: false, access: { has: obj => "cpuOverCommitRatio" in obj, get: obj => obj.cpuOverCommitRatio, set: (obj, value) => { obj.cpuOverCommitRatio = value; } }, metadata: _metadata }, _cpuOverCommitRatio_initializers, _cpuOverCommitRatio_extraInitializers);
            __esDecorate(null, null, _memoryOverCommitRatio_decorators, { kind: "field", name: "memoryOverCommitRatio", static: false, private: false, access: { has: obj => "memoryOverCommitRatio" in obj, get: obj => obj.memoryOverCommitRatio, set: (obj, value) => { obj.memoryOverCommitRatio = value; } }, metadata: _metadata }, _memoryOverCommitRatio_initializers, _memoryOverCommitRatio_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateClusterDRSDto = UpdateClusterDRSDto;
/**
 * DTO for updating cluster HA settings
 */
let UpdateClusterHADto = (() => {
    var _a;
    let _haMode_decorators;
    let _haMode_initializers = [];
    let _haMode_extraInitializers = [];
    let _failoverLevel_decorators;
    let _failoverLevel_initializers = [];
    let _failoverLevel_extraInitializers = [];
    let _admissionControlEnabled_decorators;
    let _admissionControlEnabled_initializers = [];
    let _admissionControlEnabled_extraInitializers = [];
    let _admissionControlPolicy_decorators;
    let _admissionControlPolicy_initializers = [];
    let _admissionControlPolicy_extraInitializers = [];
    let _admissionControlPercentage_decorators;
    let _admissionControlPercentage_initializers = [];
    let _admissionControlPercentage_extraInitializers = [];
    let _vmMonitoring_decorators;
    let _vmMonitoring_initializers = [];
    let _vmMonitoring_extraInitializers = [];
    let _vmMonitoringSensitivity_decorators;
    let _vmMonitoringSensitivity_initializers = [];
    let _vmMonitoringSensitivity_extraInitializers = [];
    let _hostMonitoring_decorators;
    let _hostMonitoring_initializers = [];
    let _hostMonitoring_extraInitializers = [];
    return _a = class UpdateClusterHADto {
            constructor() {
                this.haMode = __runInitializers(this, _haMode_initializers, void 0);
                this.failoverLevel = (__runInitializers(this, _haMode_extraInitializers), __runInitializers(this, _failoverLevel_initializers, 1));
                this.admissionControlEnabled = (__runInitializers(this, _failoverLevel_extraInitializers), __runInitializers(this, _admissionControlEnabled_initializers, true));
                this.admissionControlPolicy = (__runInitializers(this, _admissionControlEnabled_extraInitializers), __runInitializers(this, _admissionControlPolicy_initializers, void 0));
                this.admissionControlPercentage = (__runInitializers(this, _admissionControlPolicy_extraInitializers), __runInitializers(this, _admissionControlPercentage_initializers, 25));
                this.vmMonitoring = (__runInitializers(this, _admissionControlPercentage_extraInitializers), __runInitializers(this, _vmMonitoring_initializers, true));
                this.vmMonitoringSensitivity = (__runInitializers(this, _vmMonitoring_extraInitializers), __runInitializers(this, _vmMonitoringSensitivity_initializers, 120));
                this.hostMonitoring = (__runInitializers(this, _vmMonitoringSensitivity_extraInitializers), __runInitializers(this, _hostMonitoring_initializers, true));
                __runInitializers(this, _hostMonitoring_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _haMode_decorators = [(0, class_validator_1.IsEnum)(HAMode)];
            _failoverLevel_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(4), (0, class_validator_1.IsOptional)()];
            _admissionControlEnabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _admissionControlPolicy_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _admissionControlPercentage_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100), (0, class_validator_1.IsOptional)()];
            _vmMonitoring_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _vmMonitoringSensitivity_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(30), (0, class_validator_1.Max)(3600), (0, class_validator_1.IsOptional)()];
            _hostMonitoring_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _haMode_decorators, { kind: "field", name: "haMode", static: false, private: false, access: { has: obj => "haMode" in obj, get: obj => obj.haMode, set: (obj, value) => { obj.haMode = value; } }, metadata: _metadata }, _haMode_initializers, _haMode_extraInitializers);
            __esDecorate(null, null, _failoverLevel_decorators, { kind: "field", name: "failoverLevel", static: false, private: false, access: { has: obj => "failoverLevel" in obj, get: obj => obj.failoverLevel, set: (obj, value) => { obj.failoverLevel = value; } }, metadata: _metadata }, _failoverLevel_initializers, _failoverLevel_extraInitializers);
            __esDecorate(null, null, _admissionControlEnabled_decorators, { kind: "field", name: "admissionControlEnabled", static: false, private: false, access: { has: obj => "admissionControlEnabled" in obj, get: obj => obj.admissionControlEnabled, set: (obj, value) => { obj.admissionControlEnabled = value; } }, metadata: _metadata }, _admissionControlEnabled_initializers, _admissionControlEnabled_extraInitializers);
            __esDecorate(null, null, _admissionControlPolicy_decorators, { kind: "field", name: "admissionControlPolicy", static: false, private: false, access: { has: obj => "admissionControlPolicy" in obj, get: obj => obj.admissionControlPolicy, set: (obj, value) => { obj.admissionControlPolicy = value; } }, metadata: _metadata }, _admissionControlPolicy_initializers, _admissionControlPolicy_extraInitializers);
            __esDecorate(null, null, _admissionControlPercentage_decorators, { kind: "field", name: "admissionControlPercentage", static: false, private: false, access: { has: obj => "admissionControlPercentage" in obj, get: obj => obj.admissionControlPercentage, set: (obj, value) => { obj.admissionControlPercentage = value; } }, metadata: _metadata }, _admissionControlPercentage_initializers, _admissionControlPercentage_extraInitializers);
            __esDecorate(null, null, _vmMonitoring_decorators, { kind: "field", name: "vmMonitoring", static: false, private: false, access: { has: obj => "vmMonitoring" in obj, get: obj => obj.vmMonitoring, set: (obj, value) => { obj.vmMonitoring = value; } }, metadata: _metadata }, _vmMonitoring_initializers, _vmMonitoring_extraInitializers);
            __esDecorate(null, null, _vmMonitoringSensitivity_decorators, { kind: "field", name: "vmMonitoringSensitivity", static: false, private: false, access: { has: obj => "vmMonitoringSensitivity" in obj, get: obj => obj.vmMonitoringSensitivity, set: (obj, value) => { obj.vmMonitoringSensitivity = value; } }, metadata: _metadata }, _vmMonitoringSensitivity_initializers, _vmMonitoringSensitivity_extraInitializers);
            __esDecorate(null, null, _hostMonitoring_decorators, { kind: "field", name: "hostMonitoring", static: false, private: false, access: { has: obj => "hostMonitoring" in obj, get: obj => obj.hostMonitoring, set: (obj, value) => { obj.hostMonitoring = value; } }, metadata: _metadata }, _hostMonitoring_initializers, _hostMonitoring_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateClusterHADto = UpdateClusterHADto;
/**
 * DTO for resource pool configuration
 */
let CreateResourcePoolDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _clusterId_decorators;
    let _clusterId_initializers = [];
    let _clusterId_extraInitializers = [];
    let _parentPoolId_decorators;
    let _parentPoolId_initializers = [];
    let _parentPoolId_extraInitializers = [];
    let _cpuShares_decorators;
    let _cpuShares_initializers = [];
    let _cpuShares_extraInitializers = [];
    let _cpuReservationMHz_decorators;
    let _cpuReservationMHz_initializers = [];
    let _cpuReservationMHz_extraInitializers = [];
    let _cpuLimitMHz_decorators;
    let _cpuLimitMHz_initializers = [];
    let _cpuLimitMHz_extraInitializers = [];
    let _memorySharesMB_decorators;
    let _memorySharesMB_initializers = [];
    let _memorySharesMB_extraInitializers = [];
    let _memoryReservationMB_decorators;
    let _memoryReservationMB_initializers = [];
    let _memoryReservationMB_extraInitializers = [];
    let _memoryLimitMB_decorators;
    let _memoryLimitMB_initializers = [];
    let _memoryLimitMB_extraInitializers = [];
    let _expandableReservation_decorators;
    let _expandableReservation_initializers = [];
    let _expandableReservation_extraInitializers = [];
    return _a = class CreateResourcePoolDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.clusterId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _clusterId_initializers, void 0));
                this.parentPoolId = (__runInitializers(this, _clusterId_extraInitializers), __runInitializers(this, _parentPoolId_initializers, void 0));
                this.cpuShares = (__runInitializers(this, _parentPoolId_extraInitializers), __runInitializers(this, _cpuShares_initializers, -1));
                this.cpuReservationMHz = (__runInitializers(this, _cpuShares_extraInitializers), __runInitializers(this, _cpuReservationMHz_initializers, 0));
                this.cpuLimitMHz = (__runInitializers(this, _cpuReservationMHz_extraInitializers), __runInitializers(this, _cpuLimitMHz_initializers, -1));
                this.memorySharesMB = (__runInitializers(this, _cpuLimitMHz_extraInitializers), __runInitializers(this, _memorySharesMB_initializers, -1));
                this.memoryReservationMB = (__runInitializers(this, _memorySharesMB_extraInitializers), __runInitializers(this, _memoryReservationMB_initializers, 0));
                this.memoryLimitMB = (__runInitializers(this, _memoryReservationMB_extraInitializers), __runInitializers(this, _memoryLimitMB_initializers, -1));
                this.expandableReservation = (__runInitializers(this, _memoryLimitMB_extraInitializers), __runInitializers(this, _expandableReservation_initializers, true));
                __runInitializers(this, _expandableReservation_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _clusterId_decorators = [(0, class_validator_1.IsUUID)('4')];
            _parentPoolId_decorators = [(0, class_validator_1.IsUUID)('4'), (0, class_validator_1.IsOptional)()];
            _cpuShares_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(1000000), (0, class_validator_1.IsOptional)()];
            _cpuReservationMHz_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(1000000), (0, class_validator_1.IsOptional)()];
            _cpuLimitMHz_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(1000000), (0, class_validator_1.IsOptional)()];
            _memorySharesMB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(8388608), (0, class_validator_1.IsOptional)()];
            _memoryReservationMB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(8388608), (0, class_validator_1.IsOptional)()];
            _memoryLimitMB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(8388608), (0, class_validator_1.IsOptional)()];
            _expandableReservation_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _clusterId_decorators, { kind: "field", name: "clusterId", static: false, private: false, access: { has: obj => "clusterId" in obj, get: obj => obj.clusterId, set: (obj, value) => { obj.clusterId = value; } }, metadata: _metadata }, _clusterId_initializers, _clusterId_extraInitializers);
            __esDecorate(null, null, _parentPoolId_decorators, { kind: "field", name: "parentPoolId", static: false, private: false, access: { has: obj => "parentPoolId" in obj, get: obj => obj.parentPoolId, set: (obj, value) => { obj.parentPoolId = value; } }, metadata: _metadata }, _parentPoolId_initializers, _parentPoolId_extraInitializers);
            __esDecorate(null, null, _cpuShares_decorators, { kind: "field", name: "cpuShares", static: false, private: false, access: { has: obj => "cpuShares" in obj, get: obj => obj.cpuShares, set: (obj, value) => { obj.cpuShares = value; } }, metadata: _metadata }, _cpuShares_initializers, _cpuShares_extraInitializers);
            __esDecorate(null, null, _cpuReservationMHz_decorators, { kind: "field", name: "cpuReservationMHz", static: false, private: false, access: { has: obj => "cpuReservationMHz" in obj, get: obj => obj.cpuReservationMHz, set: (obj, value) => { obj.cpuReservationMHz = value; } }, metadata: _metadata }, _cpuReservationMHz_initializers, _cpuReservationMHz_extraInitializers);
            __esDecorate(null, null, _cpuLimitMHz_decorators, { kind: "field", name: "cpuLimitMHz", static: false, private: false, access: { has: obj => "cpuLimitMHz" in obj, get: obj => obj.cpuLimitMHz, set: (obj, value) => { obj.cpuLimitMHz = value; } }, metadata: _metadata }, _cpuLimitMHz_initializers, _cpuLimitMHz_extraInitializers);
            __esDecorate(null, null, _memorySharesMB_decorators, { kind: "field", name: "memorySharesMB", static: false, private: false, access: { has: obj => "memorySharesMB" in obj, get: obj => obj.memorySharesMB, set: (obj, value) => { obj.memorySharesMB = value; } }, metadata: _metadata }, _memorySharesMB_initializers, _memorySharesMB_extraInitializers);
            __esDecorate(null, null, _memoryReservationMB_decorators, { kind: "field", name: "memoryReservationMB", static: false, private: false, access: { has: obj => "memoryReservationMB" in obj, get: obj => obj.memoryReservationMB, set: (obj, value) => { obj.memoryReservationMB = value; } }, metadata: _metadata }, _memoryReservationMB_initializers, _memoryReservationMB_extraInitializers);
            __esDecorate(null, null, _memoryLimitMB_decorators, { kind: "field", name: "memoryLimitMB", static: false, private: false, access: { has: obj => "memoryLimitMB" in obj, get: obj => obj.memoryLimitMB, set: (obj, value) => { obj.memoryLimitMB = value; } }, metadata: _metadata }, _memoryLimitMB_initializers, _memoryLimitMB_extraInitializers);
            __esDecorate(null, null, _expandableReservation_decorators, { kind: "field", name: "expandableReservation", static: false, private: false, access: { has: obj => "expandableReservation" in obj, get: obj => obj.expandableReservation, set: (obj, value) => { obj.expandableReservation = value; } }, metadata: _metadata }, _expandableReservation_initializers, _expandableReservation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateResourcePoolDto = CreateResourcePoolDto;
/**
 * DTO for capacity planning thresholds
 */
let CapacityThresholdDto = (() => {
    var _a;
    let _thresholdType_decorators;
    let _thresholdType_initializers = [];
    let _thresholdType_extraInitializers = [];
    let _warningThreshold_decorators;
    let _warningThreshold_initializers = [];
    let _warningThreshold_extraInitializers = [];
    let _criticalThreshold_decorators;
    let _criticalThreshold_initializers = [];
    let _criticalThreshold_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _notificationEmail_decorators;
    let _notificationEmail_initializers = [];
    let _notificationEmail_extraInitializers = [];
    return _a = class CapacityThresholdDto {
            constructor() {
                this.thresholdType = __runInitializers(this, _thresholdType_initializers, void 0);
                this.warningThreshold = (__runInitializers(this, _thresholdType_extraInitializers), __runInitializers(this, _warningThreshold_initializers, void 0));
                this.criticalThreshold = (__runInitializers(this, _warningThreshold_extraInitializers), __runInitializers(this, _criticalThreshold_initializers, void 0));
                this.enabled = (__runInitializers(this, _criticalThreshold_extraInitializers), __runInitializers(this, _enabled_initializers, true));
                this.notificationEmail = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _notificationEmail_initializers, void 0));
                __runInitializers(this, _notificationEmail_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _thresholdType_decorators = [(0, class_validator_1.IsEnum)(ThresholdType)];
            _warningThreshold_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _criticalThreshold_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _enabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _notificationEmail_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _thresholdType_decorators, { kind: "field", name: "thresholdType", static: false, private: false, access: { has: obj => "thresholdType" in obj, get: obj => obj.thresholdType, set: (obj, value) => { obj.thresholdType = value; } }, metadata: _metadata }, _thresholdType_initializers, _thresholdType_extraInitializers);
            __esDecorate(null, null, _warningThreshold_decorators, { kind: "field", name: "warningThreshold", static: false, private: false, access: { has: obj => "warningThreshold" in obj, get: obj => obj.warningThreshold, set: (obj, value) => { obj.warningThreshold = value; } }, metadata: _metadata }, _warningThreshold_initializers, _warningThreshold_extraInitializers);
            __esDecorate(null, null, _criticalThreshold_decorators, { kind: "field", name: "criticalThreshold", static: false, private: false, access: { has: obj => "criticalThreshold" in obj, get: obj => obj.criticalThreshold, set: (obj, value) => { obj.criticalThreshold = value; } }, metadata: _metadata }, _criticalThreshold_initializers, _criticalThreshold_extraInitializers);
            __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
            __esDecorate(null, null, _notificationEmail_decorators, { kind: "field", name: "notificationEmail", static: false, private: false, access: { has: obj => "notificationEmail" in obj, get: obj => obj.notificationEmail, set: (obj, value) => { obj.notificationEmail = value; } }, metadata: _metadata }, _notificationEmail_initializers, _notificationEmail_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CapacityThresholdDto = CapacityThresholdDto;
/**
 * DTO for host maintenance mode
 */
let HostMaintenanceModeDto = (() => {
    var _a;
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _timeoutSeconds_decorators;
    let _timeoutSeconds_initializers = [];
    let _timeoutSeconds_extraInitializers = [];
    let _evacuatePoweredOffVMs_decorators;
    let _evacuatePoweredOffVMs_initializers = [];
    let _evacuatePoweredOffVMs_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class HostMaintenanceModeDto {
            constructor() {
                this.mode = __runInitializers(this, _mode_initializers, void 0);
                this.timeoutSeconds = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _timeoutSeconds_initializers, 600));
                this.evacuatePoweredOffVMs = (__runInitializers(this, _timeoutSeconds_extraInitializers), __runInitializers(this, _evacuatePoweredOffVMs_initializers, false));
                this.reason = (__runInitializers(this, _evacuatePoweredOffVMs_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _mode_decorators = [(0, class_validator_1.IsEnum)(MaintenanceMode)];
            _timeoutSeconds_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(3600), (0, class_validator_1.IsOptional)()];
            _evacuatePoweredOffVMs_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _reason_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(null, null, _timeoutSeconds_decorators, { kind: "field", name: "timeoutSeconds", static: false, private: false, access: { has: obj => "timeoutSeconds" in obj, get: obj => obj.timeoutSeconds, set: (obj, value) => { obj.timeoutSeconds = value; } }, metadata: _metadata }, _timeoutSeconds_initializers, _timeoutSeconds_extraInitializers);
            __esDecorate(null, null, _evacuatePoweredOffVMs_decorators, { kind: "field", name: "evacuatePoweredOffVMs", static: false, private: false, access: { has: obj => "evacuatePoweredOffVMs" in obj, get: obj => obj.evacuatePoweredOffVMs, set: (obj, value) => { obj.evacuatePoweredOffVMs = value; } }, metadata: _metadata }, _evacuatePoweredOffVMs_initializers, _evacuatePoweredOffVMs_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.HostMaintenanceModeDto = HostMaintenanceModeDto;
/**
 * DTO for DRS recommendation
 */
let DRSRecommendationDto = (() => {
    var _a;
    let _vmId_decorators;
    let _vmId_initializers = [];
    let _vmId_extraInitializers = [];
    let _sourceHostId_decorators;
    let _sourceHostId_initializers = [];
    let _sourceHostId_extraInitializers = [];
    let _targetHostId_decorators;
    let _targetHostId_initializers = [];
    let _targetHostId_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _expectedImprovement_decorators;
    let _expectedImprovement_initializers = [];
    let _expectedImprovement_extraInitializers = [];
    return _a = class DRSRecommendationDto {
            constructor() {
                this.vmId = __runInitializers(this, _vmId_initializers, void 0);
                this.sourceHostId = (__runInitializers(this, _vmId_extraInitializers), __runInitializers(this, _sourceHostId_initializers, void 0));
                this.targetHostId = (__runInitializers(this, _sourceHostId_extraInitializers), __runInitializers(this, _targetHostId_initializers, void 0));
                this.reason = (__runInitializers(this, _targetHostId_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.priority = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.expectedImprovement = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _expectedImprovement_initializers, void 0));
                __runInitializers(this, _expectedImprovement_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vmId_decorators = [(0, class_validator_1.IsUUID)('4')];
            _sourceHostId_decorators = [(0, class_validator_1.IsUUID)('4')];
            _targetHostId_decorators = [(0, class_validator_1.IsUUID)('4')];
            _reason_decorators = [(0, class_validator_1.IsString)()];
            _priority_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _expectedImprovement_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _vmId_decorators, { kind: "field", name: "vmId", static: false, private: false, access: { has: obj => "vmId" in obj, get: obj => obj.vmId, set: (obj, value) => { obj.vmId = value; } }, metadata: _metadata }, _vmId_initializers, _vmId_extraInitializers);
            __esDecorate(null, null, _sourceHostId_decorators, { kind: "field", name: "sourceHostId", static: false, private: false, access: { has: obj => "sourceHostId" in obj, get: obj => obj.sourceHostId, set: (obj, value) => { obj.sourceHostId = value; } }, metadata: _metadata }, _sourceHostId_initializers, _sourceHostId_extraInitializers);
            __esDecorate(null, null, _targetHostId_decorators, { kind: "field", name: "targetHostId", static: false, private: false, access: { has: obj => "targetHostId" in obj, get: obj => obj.targetHostId, set: (obj, value) => { obj.targetHostId = value; } }, metadata: _metadata }, _targetHostId_initializers, _targetHostId_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _expectedImprovement_decorators, { kind: "field", name: "expectedImprovement", static: false, private: false, access: { has: obj => "expectedImprovement" in obj, get: obj => obj.expectedImprovement, set: (obj, value) => { obj.expectedImprovement = value; } }, metadata: _metadata }, _expectedImprovement_initializers, _expectedImprovement_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DRSRecommendationDto = DRSRecommendationDto;
// ============================================================================
// DECORATOR UTILITIES
// ============================================================================
/**
 * Custom decorator for infrastructure audit logging
 *
 * @param {string} action - Action being performed
 * @returns {MethodDecorator} Audit decorator
 *
 * @example
 * ```typescript
 * @Post('datacenters')
 * @InfrastructureAudit('CREATE_DATACENTER')
 * async createDatacenter(@Body() dto: CreateDatacenterDto) {
 *   // Automatically logged for compliance
 * }
 * ```
 */
function InfrastructureAudit(action) {
    return (0, common_1.applyDecorators)();
}
/**
 * Decorator for infrastructure admin permissions
 *
 * @returns {MethodDecorator} Admin permission decorator
 *
 * @example
 * ```typescript
 * @Delete('hosts/:id')
 * @RequireInfrastructureAdmin()
 * async deleteHost(@Param('id') id: string) {
 *   return this.service.deleteHost(id);
 * }
 * ```
 */
function RequireInfrastructureAdmin() {
    return (0, common_1.applyDecorators)();
}
// ============================================================================
// DATACENTER CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for creating datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('datacenters')
 * @CreateDatacenterDecorators()
 * async createDatacenter(@Body() dto: CreateDatacenterDto) {
 *   return this.infraService.createDatacenter(dto);
 * }
 * ```
 */
function CreateDatacenterDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create datacenter', description: 'Creates a new virtual datacenter container for organizing infrastructure resources' }), (0, swagger_1.ApiBody)({ type: CreateDatacenterDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Datacenter created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Datacenter name already exists' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing datacenters endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('datacenters')
 * @ListDatacentersDecorators()
 * async listDatacenters(@Query('page') page: number, @Query('limit') limit: number) {
 *   return this.infraService.listDatacenters({ page, limit });
 * }
 * ```
 */
function ListDatacentersDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List datacenters', description: 'Retrieves paginated list of all datacenters with statistics' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (max 100)' }), (0, swagger_1.ApiQuery)({ name: 'enabled', required: false, type: Boolean, description: 'Filter by enabled status' }), (0, swagger_1.ApiQuery)({ name: 'regionId', required: false, type: String, description: 'Filter by region' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List retrieved successfully', type: [Object] }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting datacenter details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('datacenters/:id')
 * @GetDatacenterDecorators()
 * async getDatacenter(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getDatacenter(id);
 * }
 * ```
 */
function GetDatacenterDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get datacenter details', description: 'Retrieves detailed information about a specific datacenter including statistics and health' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Datacenter UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Datacenter details retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Datacenter not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for updating datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('datacenters/:id')
 * @UpdateDatacenterDecorators()
 * async updateDatacenter(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateDatacenter(id, dto);
 * }
 * ```
 */
function UpdateDatacenterDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update datacenter', description: 'Updates datacenter metadata, configuration, or settings' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Datacenter UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                location: { type: 'string' },
                enabled: { type: 'boolean' },
                tags: { type: 'array', items: { type: 'string' } },
                metadata: { type: 'object' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Datacenter updated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Datacenter not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for deleting datacenter endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('datacenters/:id')
 * @DeleteDatacenterDecorators()
 * async deleteDatacenter(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.infraService.deleteDatacenter(id, force);
 * }
 * ```
 */
function DeleteDatacenterDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete datacenter', description: 'Permanently deletes a datacenter (must be empty unless force=true)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Datacenter UUID' }), (0, swagger_1.ApiQuery)({ name: 'force', required: false, type: Boolean, description: 'Force deletion even if contains resources' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Datacenter deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Datacenter not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Datacenter contains resources and cannot be deleted' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
// ============================================================================
// CLUSTER CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for creating cluster endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters')
 * @CreateClusterDecorators()
 * async createCluster(@Body() dto: CreateClusterDto) {
 *   return this.infraService.createCluster(dto);
 * }
 * ```
 */
function CreateClusterDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create cluster', description: 'Creates a new compute cluster with DRS and HA configuration' }), (0, swagger_1.ApiBody)({ type: CreateClusterDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Cluster created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid cluster configuration' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Datacenter not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing clusters endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters')
 * @ListClustersDecorators()
 * async listClusters(@Query() query: any) {
 *   return this.infraService.listClusters(query);
 * }
 * ```
 */
function ListClustersDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List clusters', description: 'Retrieves paginated list of clusters with health and statistics' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'datacenterId', required: false, type: String, description: 'Filter by datacenter' }), (0, swagger_1.ApiQuery)({ name: 'drsMode', required: false, enum: DRSMode, description: 'Filter by DRS mode' }), (0, swagger_1.ApiQuery)({ name: 'haMode', required: false, enum: HAMode, description: 'Filter by HA mode' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List retrieved successfully', type: [Object] }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting cluster details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters/:id')
 * @GetClusterDecorators()
 * async getCluster(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getCluster(id);
 * }
 * ```
 */
function GetClusterDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get cluster details', description: 'Retrieves detailed cluster information including DRS/HA status and resource utilization' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Cluster UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Cluster details retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for updating cluster DRS settings endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('clusters/:id/drs')
 * @UpdateClusterDRSDecorators()
 * async updateDRS(@Param('id') id: string, @Body() dto: UpdateClusterDRSDto) {
 *   return this.infraService.updateClusterDRS(id, dto);
 * }
 * ```
 */
function UpdateClusterDRSDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update cluster DRS settings', description: 'Configures Distributed Resource Scheduler settings for load balancing and VM placement' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Cluster UUID' }), (0, swagger_1.ApiBody)({ type: UpdateClusterDRSDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'DRS settings updated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for updating cluster HA settings endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('clusters/:id/ha')
 * @UpdateClusterHADecorators()
 * async updateHA(@Param('id') id: string, @Body() dto: UpdateClusterHADto) {
 *   return this.infraService.updateClusterHA(id, dto);
 * }
 * ```
 */
function UpdateClusterHADecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update cluster HA settings', description: 'Configures High Availability settings for automatic VM failover and restart' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Cluster UUID' }), (0, swagger_1.ApiBody)({ type: UpdateClusterHADto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'HA settings updated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for getting cluster recommendations endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('clusters/:id/recommendations')
 * @GetClusterRecommendationsDecorators()
 * async getRecommendations(@Param('id') id: string) {
 *   return this.infraService.getClusterRecommendations(id);
 * }
 * ```
 */
function GetClusterRecommendationsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get DRS recommendations', description: 'Retrieves current DRS load balancing recommendations for the cluster' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Cluster UUID' }), (0, swagger_1.ApiQuery)({ name: 'autoApply', required: false, type: Boolean, description: 'Include auto-apply recommendations only' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Recommendations retrieved successfully', type: [Object] }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for applying DRS recommendation endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters/:id/recommendations/:recommendationId/apply')
 * @ApplyDRSRecommendationDecorators()
 * async applyRecommendation(@Param('id') id: string, @Param('recommendationId') recId: string) {
 *   return this.infraService.applyDRSRecommendation(id, recId);
 * }
 * ```
 */
function ApplyDRSRecommendationDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Apply DRS recommendation', description: 'Applies a specific DRS recommendation to migrate VM to optimal host' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Cluster UUID' }), (0, swagger_1.ApiParam)({ name: 'recommendationId', type: String, description: 'Recommendation UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Recommendation applied successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster or recommendation not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Recommendation no longer valid' }), (0, swagger_1.ApiBearerAuth)());
}
// ============================================================================
// HOST CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for adding host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts')
 * @AddHostDecorators()
 * async addHost(@Body() dto: AddHostDto) {
 *   return this.infraService.addHost(dto);
 * }
 * ```
 */
function AddHostDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Add host to infrastructure', description: 'Registers a new ESXi/hypervisor host to the infrastructure' }), (0, swagger_1.ApiBody)({ type: AddHostDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Host added successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid host credentials or configuration' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster or datacenter not found' }), (0, swagger_1.ApiResponse)({ status: 503, description: 'Unable to connect to host' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing hosts endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts')
 * @ListHostsDecorators()
 * async listHosts(@Query() query: any) {
 *   return this.infraService.listHosts(query);
 * }
 * ```
 */
function ListHostsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List hosts', description: 'Retrieves paginated list of hosts with power state and statistics' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'clusterId', required: false, type: String, description: 'Filter by cluster' }), (0, swagger_1.ApiQuery)({ name: 'powerState', required: false, enum: HostPowerState, description: 'Filter by power state' }), (0, swagger_1.ApiQuery)({ name: 'connectionState', required: false, enum: HostConnectionState, description: 'Filter by connection state' }), (0, swagger_1.ApiQuery)({ name: 'maintenanceMode', required: false, type: Boolean, description: 'Filter by maintenance mode' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List retrieved successfully', type: [Object] }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting host details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts/:id')
 * @GetHostDecorators()
 * async getHost(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.infraService.getHost(id);
 * }
 * ```
 */
function GetHostDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get host details', description: 'Retrieves detailed host information including hardware specs, running VMs, and utilization' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Host UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Host details retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Host not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for removing host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('hosts/:id')
 * @RemoveHostDecorators()
 * async removeHost(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.infraService.removeHost(id, force);
 * }
 * ```
 */
function RemoveHostDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Remove host from infrastructure', description: 'Removes a host from management (must be in maintenance mode unless force=true)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Host UUID' }), (0, swagger_1.ApiQuery)({ name: 'force', required: false, type: Boolean, description: 'Force removal even with running VMs' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Host removed successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Host not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Host has running VMs or not in maintenance mode' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
/**
 * Creates decorator for host maintenance mode endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/maintenance')
 * @HostMaintenanceModeDecorators()
 * async setMaintenanceMode(@Param('id') id: string, @Body() dto: HostMaintenanceModeDto) {
 *   return this.infraService.setHostMaintenanceMode(id, dto);
 * }
 * ```
 */
function HostMaintenanceModeDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Set host maintenance mode', description: 'Enters or exits maintenance mode, evacuating or allowing VMs' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Host UUID' }), (0, swagger_1.ApiBody)({ type: HostMaintenanceModeDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Maintenance mode changed successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Host not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Unable to evacuate VMs within timeout' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for host power control endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/power')
 * @HostPowerControlDecorators()
 * async controlHostPower(@Param('id') id: string, @Body() dto: { action: string }) {
 *   return this.infraService.controlHostPower(id, dto.action);
 * }
 * ```
 */
function HostPowerControlDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Control host power state', description: 'Powers on, off, or reboots a host (evacuates VMs first)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Host UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                action: { type: 'string', enum: ['poweron', 'poweroff', 'reboot', 'standby'], description: 'Power action to perform' },
                force: { type: 'boolean', description: 'Force action without VM evacuation' },
            },
            required: ['action'],
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Power action initiated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Host not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Invalid power state transition' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for reconnecting host endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('hosts/:id/reconnect')
 * @ReconnectHostDecorators()
 * async reconnectHost(@Param('id') id: string) {
 *   return this.infraService.reconnectHost(id);
 * }
 * ```
 */
function ReconnectHostDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Reconnect host', description: 'Attempts to reconnect a disconnected or not responding host' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Host UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Host reconnected successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Host not found' }), (0, swagger_1.ApiResponse)({ status: 503, description: 'Unable to connect to host' }), (0, swagger_1.ApiBearerAuth)());
}
// ============================================================================
// RESOURCE POOL CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for creating resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resource-pools')
 * @CreateResourcePoolDecorators()
 * async createResourcePool(@Body() dto: CreateResourcePoolDto) {
 *   return this.infraService.createResourcePool(dto);
 * }
 * ```
 */
function CreateResourcePoolDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create resource pool', description: 'Creates a resource pool for hierarchical resource management and allocation' }), (0, swagger_1.ApiBody)({ type: CreateResourcePoolDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Resource pool created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid resource pool configuration' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster or parent pool not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing resource pools endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resource-pools')
 * @ListResourcePoolsDecorators()
 * async listResourcePools(@Query() query: any) {
 *   return this.infraService.listResourcePools(query);
 * }
 * ```
 */
function ListResourcePoolsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List resource pools', description: 'Retrieves paginated list of resource pools with allocation details' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'clusterId', required: false, type: String, description: 'Filter by cluster' }), (0, swagger_1.ApiQuery)({ name: 'parentPoolId', required: false, type: String, description: 'Filter by parent pool' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List retrieved successfully', type: [Object] }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for updating resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('resource-pools/:id')
 * @UpdateResourcePoolDecorators()
 * async updateResourcePool(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateResourcePool(id, dto);
 * }
 * ```
 */
function UpdateResourcePoolDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update resource pool', description: 'Updates resource pool allocation settings (shares, reservation, limits)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Resource pool UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                name: { type: 'string' },
                cpuShares: { type: 'number' },
                cpuReservationMHz: { type: 'number' },
                cpuLimitMHz: { type: 'number' },
                memorySharesMB: { type: 'number' },
                memoryReservationMB: { type: 'number' },
                memoryLimitMB: { type: 'number' },
                expandableReservation: { type: 'boolean' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Resource pool updated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource pool not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for deleting resource pool endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('resource-pools/:id')
 * @DeleteResourcePoolDecorators()
 * async deleteResourcePool(@Param('id') id: string) {
 *   return this.infraService.deleteResourcePool(id);
 * }
 * ```
 */
function DeleteResourcePoolDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete resource pool', description: 'Deletes a resource pool (must be empty or VMs moved to parent)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Resource pool UUID' }), (0, swagger_1.ApiQuery)({ name: 'moveVMsToParent', required: false, type: Boolean, description: 'Move VMs to parent pool before deletion' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Resource pool deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource pool not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Resource pool contains VMs or child pools' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
// ============================================================================
// CAPACITY PLANNING CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for getting capacity overview endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/overview')
 * @GetCapacityOverviewDecorators()
 * async getCapacityOverview(@Query('datacenterId') datacenterId?: string) {
 *   return this.infraService.getCapacityOverview(datacenterId);
 * }
 * ```
 */
function GetCapacityOverviewDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get capacity overview', description: 'Retrieves current capacity utilization across all resources' }), (0, swagger_1.ApiQuery)({ name: 'datacenterId', required: false, type: String, description: 'Filter by datacenter' }), (0, swagger_1.ApiQuery)({ name: 'clusterId', required: false, type: String, description: 'Filter by cluster' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Capacity overview retrieved successfully',
        schema: {
            properties: {
                cpu: {
                    type: 'object',
                    properties: {
                        totalMHz: { type: 'number' },
                        usedMHz: { type: 'number' },
                        utilizationPercent: { type: 'number' },
                    },
                },
                memory: {
                    type: 'object',
                    properties: {
                        totalMB: { type: 'number' },
                        usedMB: { type: 'number' },
                        utilizationPercent: { type: 'number' },
                    },
                },
                storage: {
                    type: 'object',
                    properties: {
                        totalGB: { type: 'number' },
                        usedGB: { type: 'number' },
                        utilizationPercent: { type: 'number' },
                    },
                },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting capacity forecast endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/forecast')
 * @GetCapacityForecastDecorators()
 * async getCapacityForecast(@Query() query: any) {
 *   return this.infraService.getCapacityForecast(query);
 * }
 * ```
 */
function GetCapacityForecastDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get capacity forecast', description: 'Retrieves capacity forecasts based on historical trends and growth projections' }), (0, swagger_1.ApiQuery)({ name: 'resourceType', required: false, enum: ThresholdType, description: 'Resource type for forecast' }), (0, swagger_1.ApiQuery)({ name: 'forecastDays', required: false, type: Number, description: 'Number of days to forecast (default: 90)' }), (0, swagger_1.ApiQuery)({ name: 'datacenterId', required: false, type: String }), (0, swagger_1.ApiQuery)({ name: 'clusterId', required: false, type: String }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Forecast retrieved successfully', type: Object }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for setting capacity thresholds endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('capacity/thresholds')
 * @SetCapacityThresholdsDecorators()
 * async setThresholds(@Body() dto: CapacityThresholdDto) {
 *   return this.infraService.setCapacityThresholds(dto);
 * }
 * ```
 */
function SetCapacityThresholdsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Set capacity thresholds', description: 'Configures warning and critical thresholds for capacity monitoring' }), (0, swagger_1.ApiBody)({ type: CapacityThresholdDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Thresholds configured successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid threshold configuration' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for getting capacity recommendations endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('capacity/recommendations')
 * @GetCapacityRecommendationsDecorators()
 * async getCapacityRecommendations() {
 *   return this.infraService.getCapacityRecommendations();
 * }
 * ```
 */
function GetCapacityRecommendationsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get capacity recommendations', description: 'Retrieves AI-driven recommendations for capacity optimization and expansion' }), (0, swagger_1.ApiQuery)({ name: 'includeRightSizing', required: false, type: Boolean, description: 'Include VM rightsizing recommendations' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recommendations retrieved successfully',
        schema: {
            properties: {
                expansion: { type: 'array', items: { type: 'object' } },
                rightsizing: { type: 'array', items: { type: 'object' } },
                consolidation: { type: 'array', items: { type: 'object' } },
                decommission: { type: 'array', items: { type: 'object' } },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)());
}
// ============================================================================
// INFRASTRUCTURE HEALTH & MONITORING
// ============================================================================
/**
 * Creates decorator for getting infrastructure health endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('health')
 * @GetInfrastructureHealthDecorators()
 * async getHealth() {
 *   return this.infraService.getInfrastructureHealth();
 * }
 * ```
 */
function GetInfrastructureHealthDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get infrastructure health', description: 'Retrieves overall infrastructure health status and active alarms' }), (0, swagger_1.ApiQuery)({ name: 'severity', required: false, enum: AlarmSeverity, description: 'Filter alarms by severity' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Health status retrieved successfully', type: Object }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for listing alarms endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('alarms')
 * @ListAlarmsDecorators()
 * async listAlarms(@Query() query: any) {
 *   return this.infraService.listAlarms(query);
 * }
 * ```
 */
function ListAlarmsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List infrastructure alarms', description: 'Retrieves active and historical alarms with filtering options' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'severity', required: false, enum: AlarmSeverity }), (0, swagger_1.ApiQuery)({ name: 'resourceId', required: false, type: String, description: 'Filter by resource' }), (0, swagger_1.ApiQuery)({ name: 'acknowledged', required: false, type: Boolean, description: 'Filter by acknowledgment status' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Alarms retrieved successfully', type: [Object] }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for acknowledging alarm endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('alarms/:id/acknowledge')
 * @AcknowledgeAlarmDecorators()
 * async acknowledgeAlarm(@Param('id') id: string, @Body() dto: { comment: string }) {
 *   return this.infraService.acknowledgeAlarm(id, dto.comment);
 * }
 * ```
 */
function AcknowledgeAlarmDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Acknowledge alarm', description: 'Acknowledges an alarm with optional comment' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Alarm UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                comment: { type: 'string', description: 'Acknowledgment comment' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Alarm acknowledged successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Alarm not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting infrastructure metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('metrics')
 * @GetInfrastructureMetricsDecorators()
 * async getMetrics(@Query() query: any) {
 *   return this.infraService.getInfrastructureMetrics(query);
 * }
 * ```
 */
function GetInfrastructureMetricsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get infrastructure metrics', description: 'Retrieves time-series performance metrics for infrastructure components' }), (0, swagger_1.ApiQuery)({ name: 'resourceType', required: false, enum: InfrastructureType }), (0, swagger_1.ApiQuery)({ name: 'resourceId', required: false, type: String }), (0, swagger_1.ApiQuery)({ name: 'period', required: false, type: String, enum: ['1h', '6h', '24h', '7d', '30d'] }), (0, swagger_1.ApiQuery)({ name: 'metrics', required: false, type: String, description: 'Comma-separated metric names' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Metrics retrieved successfully', type: Object }), (0, swagger_1.ApiBearerAuth)());
}
// ============================================================================
// ADVANCED OPERATIONS
// ============================================================================
/**
 * Creates decorator for optimizing cluster placement endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('clusters/:id/optimize')
 * @OptimizeClusterPlacementDecorators()
 * async optimizeCluster(@Param('id') id: string) {
 *   return this.infraService.optimizeClusterPlacement(id);
 * }
 * ```
 */
function OptimizeClusterPlacementDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Optimize cluster VM placement', description: 'Runs DRS optimization to balance workload across cluster hosts' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Cluster UUID' }), (0, swagger_1.ApiBody)({
        required: false,
        schema: {
            properties: {
                targetUtilization: { type: 'number', minimum: 50, maximum: 90, description: 'Target CPU/memory utilization percentage' },
                autoApply: { type: 'boolean', default: false, description: 'Automatically apply high-priority recommendations' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Optimization completed successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Cluster not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for simulating workload placement endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('capacity/simulate')
 * @SimulateWorkloadPlacementDecorators()
 * async simulatePlacement(@Body() dto: any) {
 *   return this.infraService.simulateWorkloadPlacement(dto);
 * }
 * ```
 */
function SimulateWorkloadPlacementDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Simulate workload placement', description: 'Simulates placing new workloads to determine optimal host/cluster placement' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                workloads: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            cpuCores: { type: 'number' },
                            memoryMB: { type: 'number' },
                            storageGB: { type: 'number' },
                            count: { type: 'number', default: 1 },
                        },
                    },
                },
                targetClusterId: { type: 'string', format: 'uuid' },
                constraints: { type: 'object' },
            },
            required: ['workloads'],
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Simulation completed successfully',
        schema: {
            properties: {
                feasible: { type: 'boolean' },
                recommendedPlacements: { type: 'array', items: { type: 'object' } },
                projectedUtilization: { type: 'object' },
                warnings: { type: 'array', items: { type: 'string' } },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// ADDITIONAL HOST OPERATIONS
// ============================================================================
/**
 * Creates decorator for getting host performance metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('hosts/:id/performance')
 * @GetHostPerformanceDecorators()
 * async getHostPerformance(@Param('id') id: string, @Query() query: any) {
 *   return this.infraService.getHostPerformance(id, query);
 * }
 * ```
 */
function GetHostPerformanceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get host performance metrics', description: 'Retrieves detailed performance metrics for a host including CPU, memory, storage, and network' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Host UUID' }), (0, swagger_1.ApiQuery)({ name: 'period', required: false, type: String, enum: ['1h', '6h', '24h', '7d', '30d'], description: 'Metrics time period' }), (0, swagger_1.ApiQuery)({ name: 'interval', required: false, type: String, enum: ['1m', '5m', '15m', '1h'], description: 'Data point interval' }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Host performance metrics retrieved successfully',
        schema: {
            properties: {
                hostId: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                cpu: {
                    type: 'object',
                    properties: {
                        utilizationPercent: { type: 'number' },
                        mhzUsed: { type: 'number' },
                        mhzTotal: { type: 'number' },
                    },
                },
                memory: {
                    type: 'object',
                    properties: {
                        utilizationPercent: { type: 'number' },
                        usedMB: { type: 'number' },
                        totalMB: { type: 'number' },
                    },
                },
                network: {
                    type: 'object',
                    properties: {
                        rxBytesPerSec: { type: 'number' },
                        txBytesPerSec: { type: 'number' },
                    },
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Host not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for updating host configuration endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('hosts/:id/config')
 * @UpdateHostConfigDecorators()
 * async updateHostConfig(@Param('id') id: string, @Body() dto: any) {
 *   return this.infraService.updateHostConfig(id, dto);
 * }
 * ```
 */
function UpdateHostConfigDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update host configuration', description: 'Updates host settings including name, tags, resource pool assignments, and custom attributes' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Host UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                name: { type: 'string', description: 'Host display name' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Host tags' },
                customAttributes: { type: 'object', description: 'Custom key-value attributes' },
                powerPolicy: { type: 'string', enum: ['balanced', 'performance', 'low-power'], description: 'Power management policy' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Host configuration updated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Host not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for exporting infrastructure report endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('reports/export')
 * @ExportInfrastructureReportDecorators()
 * async exportReport(@Body() dto: any) {
 *   return this.infraService.exportInfrastructureReport(dto);
 * }
 * ```
 */
function ExportInfrastructureReportDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Export infrastructure report', description: 'Generates and exports comprehensive infrastructure report in various formats (PDF, CSV, JSON)' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                reportType: {
                    type: 'string',
                    enum: ['capacity', 'utilization', 'health', 'compliance', 'inventory', 'performance'],
                    description: 'Type of report to generate',
                },
                format: { type: 'string', enum: ['pdf', 'csv', 'json', 'xlsx'], description: 'Export format', default: 'pdf' },
                scope: {
                    type: 'object',
                    properties: {
                        datacenterIds: { type: 'array', items: { type: 'string' } },
                        clusterIds: { type: 'array', items: { type: 'string' } },
                        hostIds: { type: 'array', items: { type: 'string' } },
                    },
                },
                period: { type: 'string', enum: ['1d', '7d', '30d', '90d', '1y'], description: 'Reporting period', default: '30d' },
                includeCharts: { type: 'boolean', default: true, description: 'Include visualizations in report' },
            },
            required: ['reportType'],
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report generated successfully',
        schema: {
            properties: {
                reportId: { type: 'string' },
                downloadUrl: { type: 'string' },
                expiresAt: { type: 'string', format: 'date-time' },
                size: { type: 'number', description: 'File size in bytes' },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Datacenter Controllers
    CreateDatacenterDecorators,
    ListDatacentersDecorators,
    GetDatacenterDecorators,
    UpdateDatacenterDecorators,
    DeleteDatacenterDecorators,
    // Cluster Controllers
    CreateClusterDecorators,
    ListClustersDecorators,
    GetClusterDecorators,
    UpdateClusterDRSDecorators,
    UpdateClusterHADecorators,
    GetClusterRecommendationsDecorators,
    ApplyDRSRecommendationDecorators,
    // Host Controllers
    AddHostDecorators,
    ListHostsDecorators,
    GetHostDecorators,
    RemoveHostDecorators,
    HostMaintenanceModeDecorators,
    HostPowerControlDecorators,
    ReconnectHostDecorators,
    // Resource Pool Controllers
    CreateResourcePoolDecorators,
    ListResourcePoolsDecorators,
    UpdateResourcePoolDecorators,
    DeleteResourcePoolDecorators,
    // Capacity Planning
    GetCapacityOverviewDecorators,
    GetCapacityForecastDecorators,
    SetCapacityThresholdsDecorators,
    GetCapacityRecommendationsDecorators,
    // Health & Monitoring
    GetInfrastructureHealthDecorators,
    ListAlarmsDecorators,
    AcknowledgeAlarmDecorators,
    GetInfrastructureMetricsDecorators,
    // Advanced Operations
    OptimizeClusterPlacementDecorators,
    SimulateWorkloadPlacementDecorators,
    // Additional Host Operations
    GetHostPerformanceDecorators,
    UpdateHostConfigDecorators,
    // Reporting
    ExportInfrastructureReportDecorators,
    // Custom Decorators
    InfrastructureAudit,
    RequireInfrastructureAdmin,
    // DTOs
    CreateDatacenterDto,
    CreateClusterDto,
    AddHostDto,
    UpdateClusterDRSDto,
    UpdateClusterHADto,
    CreateResourcePoolDto,
    CapacityThresholdDto,
    HostMaintenanceModeDto,
    DRSRecommendationDto,
    // Enums
    InfrastructureType,
    HostPowerState,
    HAMode,
    DRSMode,
    HostConnectionState,
    AlarmSeverity,
    ThresholdType,
    MaintenanceMode,
};
//# sourceMappingURL=virtual-infrastructure-api-kit.js.map