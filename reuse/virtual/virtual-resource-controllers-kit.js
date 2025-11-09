"use strict";
/**
 * LOC: VRTRES9876543
 * File: /reuse/virtual/virtual-resource-controllers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual resource controller implementations
 *   - Compute/storage/network management services
 *   - Resource quota and tagging systems
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
exports.TenantId = exports.CreateSnapshotDto = exports.AttachNetworkInterfaceDto = exports.ResourceTagDto = exports.BulkResourceOperationDto = exports.ResourceQuotaDto = exports.UpdateResourceDto = exports.CreateNetworkResourceDto = exports.CreateStorageResourceDto = exports.CreateComputeResourceDto = exports.QuotaEnforcement = exports.NetworkInterfaceType = exports.StorageType = exports.AllocationMode = exports.ResourcePowerState = exports.VirtualResourceType = void 0;
exports.AuditLog = AuditLog;
exports.CreateComputeResourceDecorators = CreateComputeResourceDecorators;
exports.ListComputeResourcesDecorators = ListComputeResourcesDecorators;
exports.GetComputeResourceDecorators = GetComputeResourceDecorators;
exports.UpdateComputeResourceDecorators = UpdateComputeResourceDecorators;
exports.DeleteComputeResourceDecorators = DeleteComputeResourceDecorators;
exports.ComputePowerControlDecorators = ComputePowerControlDecorators;
exports.ResizeComputeResourceDecorators = ResizeComputeResourceDecorators;
exports.CreateStorageResourceDecorators = CreateStorageResourceDecorators;
exports.ListStorageResourcesDecorators = ListStorageResourcesDecorators;
exports.GetStorageResourceDecorators = GetStorageResourceDecorators;
exports.AttachStorageDecorators = AttachStorageDecorators;
exports.DetachStorageDecorators = DetachStorageDecorators;
exports.ResizeStorageDecorators = ResizeStorageDecorators;
exports.CreateStorageSnapshotDecorators = CreateStorageSnapshotDecorators;
exports.CreateNetworkResourceDecorators = CreateNetworkResourceDecorators;
exports.ListNetworkResourcesDecorators = ListNetworkResourcesDecorators;
exports.GetNetworkResourceDecorators = GetNetworkResourceDecorators;
exports.AttachNetworkInterfaceDecorators = AttachNetworkInterfaceDecorators;
exports.DetachNetworkInterfaceDecorators = DetachNetworkInterfaceDecorators;
exports.SetResourceQuotaDecorators = SetResourceQuotaDecorators;
exports.GetResourceQuotaDecorators = GetResourceQuotaDecorators;
exports.CheckQuotaAvailabilityDecorators = CheckQuotaAvailabilityDecorators;
exports.AddResourceTagDecorators = AddResourceTagDecorators;
exports.ListResourceTagsDecorators = ListResourceTagsDecorators;
exports.RemoveResourceTagDecorators = RemoveResourceTagDecorators;
exports.BulkTagResourcesDecorators = BulkTagResourcesDecorators;
exports.GetResourceMetricsDecorators = GetResourceMetricsDecorators;
exports.GetRealtimeResourceStatsDecorators = GetRealtimeResourceStatsDecorators;
exports.BulkDeleteResourcesDecorators = BulkDeleteResourcesDecorators;
exports.BulkPowerControlDecorators = BulkPowerControlDecorators;
exports.CloneResourceDecorators = CloneResourceDecorators;
exports.CreateResourceTemplateDecorators = CreateResourceTemplateDecorators;
exports.DeployFromTemplateDecorators = DeployFromTemplateDecorators;
exports.MigrateComputeResourceDecorators = MigrateComputeResourceDecorators;
exports.ConsolidateStorageDecorators = ConsolidateStorageDecorators;
exports.ListSnapshotsDecorators = ListSnapshotsDecorators;
exports.RestoreFromSnapshotDecorators = RestoreFromSnapshotDecorators;
exports.DeleteSnapshotDecorators = DeleteSnapshotDecorators;
exports.GetComputeConsoleDecorators = GetComputeConsoleDecorators;
exports.UpdateNetworkResourceDecorators = UpdateNetworkResourceDecorators;
exports.DeleteNetworkResourceDecorators = DeleteNetworkResourceDecorators;
/**
 * File: /reuse/virtual/virtual-resource-controllers-kit.ts
 * Locator: WC-UTL-VRTRES-001
 * Purpose: Virtual Resource Management Controllers - NestJS controllers for compute/storage/network CRUD operations, quota management, resource tagging
 *
 * Upstream: @nestjs/common, @nestjs/swagger, class-validator, class-transformer
 * Downstream: Virtual infrastructure controllers, resource management services, quota enforcement systems
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, class-validator 0.14.x
 * Exports: 42 controller functions for virtual resource management, CRUD operations, quota management, resource tagging
 *
 * LLM Context: Production-grade virtual resource management controller toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for managing virtual compute, storage, and network resources with VMware vRealize-level
 * capabilities. Includes HIPAA-compliant audit logging, resource quota management, tagging, lifecycle operations, and
 * advanced resource monitoring. Designed for enterprise healthcare infrastructure management.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================
/**
 * Resource types for virtual infrastructure
 */
var VirtualResourceType;
(function (VirtualResourceType) {
    VirtualResourceType["COMPUTE"] = "compute";
    VirtualResourceType["STORAGE"] = "storage";
    VirtualResourceType["NETWORK"] = "network";
    VirtualResourceType["VOLUME"] = "volume";
    VirtualResourceType["SNAPSHOT"] = "snapshot";
    VirtualResourceType["TEMPLATE"] = "template";
})(VirtualResourceType || (exports.VirtualResourceType = VirtualResourceType = {}));
/**
 * Resource power states
 */
var ResourcePowerState;
(function (ResourcePowerState) {
    ResourcePowerState["POWERED_ON"] = "powered_on";
    ResourcePowerState["POWERED_OFF"] = "powered_off";
    ResourcePowerState["SUSPENDED"] = "suspended";
    ResourcePowerState["PAUSED"] = "paused";
    ResourcePowerState["UNKNOWN"] = "unknown";
})(ResourcePowerState || (exports.ResourcePowerState = ResourcePowerState = {}));
/**
 * Resource allocation modes
 */
var AllocationMode;
(function (AllocationMode) {
    AllocationMode["STATIC"] = "static";
    AllocationMode["DYNAMIC"] = "dynamic";
    AllocationMode["ELASTIC"] = "elastic";
    AllocationMode["RESERVED"] = "reserved";
})(AllocationMode || (exports.AllocationMode = AllocationMode = {}));
/**
 * Storage types
 */
var StorageType;
(function (StorageType) {
    StorageType["SSD"] = "ssd";
    StorageType["HDD"] = "hdd";
    StorageType["NVME"] = "nvme";
    StorageType["NETWORK"] = "network";
    StorageType["OBJECT"] = "object";
})(StorageType || (exports.StorageType = StorageType = {}));
/**
 * Network interface types
 */
var NetworkInterfaceType;
(function (NetworkInterfaceType) {
    NetworkInterfaceType["VMXNET3"] = "vmxnet3";
    NetworkInterfaceType["E1000"] = "e1000";
    NetworkInterfaceType["E1000E"] = "e1000e";
    NetworkInterfaceType["VIRTIO"] = "virtio";
})(NetworkInterfaceType || (exports.NetworkInterfaceType = NetworkInterfaceType = {}));
/**
 * Quota enforcement levels
 */
var QuotaEnforcement;
(function (QuotaEnforcement) {
    QuotaEnforcement["SOFT"] = "soft";
    QuotaEnforcement["HARD"] = "hard";
    QuotaEnforcement["ADVISORY"] = "advisory";
})(QuotaEnforcement || (exports.QuotaEnforcement = QuotaEnforcement = {}));
// ============================================================================
// DTO CLASSES
// ============================================================================
/**
 * DTO for creating virtual compute resource
 */
let CreateComputeResourceDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _cpuCores_decorators;
    let _cpuCores_initializers = [];
    let _cpuCores_extraInitializers = [];
    let _memoryMB_decorators;
    let _memoryMB_initializers = [];
    let _memoryMB_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _allocationMode_decorators;
    let _allocationMode_initializers = [];
    let _allocationMode_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _autoStart_decorators;
    let _autoStart_initializers = [];
    let _autoStart_extraInitializers = [];
    return _a = class CreateComputeResourceDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.cpuCores = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _cpuCores_initializers, void 0));
                this.memoryMB = (__runInitializers(this, _cpuCores_extraInitializers), __runInitializers(this, _memoryMB_initializers, void 0));
                this.templateId = (__runInitializers(this, _memoryMB_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
                this.allocationMode = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _allocationMode_initializers, AllocationMode.DYNAMIC));
                this.tags = (__runInitializers(this, _allocationMode_extraInitializers), __runInitializers(this, _tags_initializers, []));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                this.autoStart = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _autoStart_initializers, false));
                __runInitializers(this, _autoStart_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _cpuCores_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(128)];
            _memoryMB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(512), (0, class_validator_1.Max)(1048576)];
            _templateId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _allocationMode_decorators = [(0, class_validator_1.IsEnum)(AllocationMode), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _tenantId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _autoStart_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _cpuCores_decorators, { kind: "field", name: "cpuCores", static: false, private: false, access: { has: obj => "cpuCores" in obj, get: obj => obj.cpuCores, set: (obj, value) => { obj.cpuCores = value; } }, metadata: _metadata }, _cpuCores_initializers, _cpuCores_extraInitializers);
            __esDecorate(null, null, _memoryMB_decorators, { kind: "field", name: "memoryMB", static: false, private: false, access: { has: obj => "memoryMB" in obj, get: obj => obj.memoryMB, set: (obj, value) => { obj.memoryMB = value; } }, metadata: _metadata }, _memoryMB_initializers, _memoryMB_extraInitializers);
            __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
            __esDecorate(null, null, _allocationMode_decorators, { kind: "field", name: "allocationMode", static: false, private: false, access: { has: obj => "allocationMode" in obj, get: obj => obj.allocationMode, set: (obj, value) => { obj.allocationMode = value; } }, metadata: _metadata }, _allocationMode_initializers, _allocationMode_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _autoStart_decorators, { kind: "field", name: "autoStart", static: false, private: false, access: { has: obj => "autoStart" in obj, get: obj => obj.autoStart, set: (obj, value) => { obj.autoStart = value; } }, metadata: _metadata }, _autoStart_initializers, _autoStart_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateComputeResourceDto = CreateComputeResourceDto;
/**
 * DTO for creating storage resource
 */
let CreateStorageResourceDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _storageType_decorators;
    let _storageType_initializers = [];
    let _storageType_extraInitializers = [];
    let _encrypted_decorators;
    let _encrypted_initializers = [];
    let _encrypted_extraInitializers = [];
    let _encryptionKeyId_decorators;
    let _encryptionKeyId_initializers = [];
    let _encryptionKeyId_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _iopsLimit_decorators;
    let _iopsLimit_initializers = [];
    let _iopsLimit_extraInitializers = [];
    let _throughputMBps_decorators;
    let _throughputMBps_initializers = [];
    let _throughputMBps_extraInitializers = [];
    return _a = class CreateStorageResourceDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.sizeGB = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.storageType = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _storageType_initializers, void 0));
                this.encrypted = (__runInitializers(this, _storageType_extraInitializers), __runInitializers(this, _encrypted_initializers, false));
                this.encryptionKeyId = (__runInitializers(this, _encrypted_extraInitializers), __runInitializers(this, _encryptionKeyId_initializers, void 0));
                this.tags = (__runInitializers(this, _encryptionKeyId_extraInitializers), __runInitializers(this, _tags_initializers, []));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                this.iopsLimit = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _iopsLimit_initializers, void 0));
                this.throughputMBps = (__runInitializers(this, _iopsLimit_extraInitializers), __runInitializers(this, _throughputMBps_initializers, void 0));
                __runInitializers(this, _throughputMBps_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _sizeGB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(102400)];
            _storageType_decorators = [(0, class_validator_1.IsEnum)(StorageType)];
            _encrypted_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _encryptionKeyId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _tenantId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _iopsLimit_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(100), (0, class_validator_1.Max)(16000)];
            _throughputMBps_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(10), (0, class_validator_1.Max)(10000)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _storageType_decorators, { kind: "field", name: "storageType", static: false, private: false, access: { has: obj => "storageType" in obj, get: obj => obj.storageType, set: (obj, value) => { obj.storageType = value; } }, metadata: _metadata }, _storageType_initializers, _storageType_extraInitializers);
            __esDecorate(null, null, _encrypted_decorators, { kind: "field", name: "encrypted", static: false, private: false, access: { has: obj => "encrypted" in obj, get: obj => obj.encrypted, set: (obj, value) => { obj.encrypted = value; } }, metadata: _metadata }, _encrypted_initializers, _encrypted_extraInitializers);
            __esDecorate(null, null, _encryptionKeyId_decorators, { kind: "field", name: "encryptionKeyId", static: false, private: false, access: { has: obj => "encryptionKeyId" in obj, get: obj => obj.encryptionKeyId, set: (obj, value) => { obj.encryptionKeyId = value; } }, metadata: _metadata }, _encryptionKeyId_initializers, _encryptionKeyId_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _iopsLimit_decorators, { kind: "field", name: "iopsLimit", static: false, private: false, access: { has: obj => "iopsLimit" in obj, get: obj => obj.iopsLimit, set: (obj, value) => { obj.iopsLimit = value; } }, metadata: _metadata }, _iopsLimit_initializers, _iopsLimit_extraInitializers);
            __esDecorate(null, null, _throughputMBps_decorators, { kind: "field", name: "throughputMBps", static: false, private: false, access: { has: obj => "throughputMBps" in obj, get: obj => obj.throughputMBps, set: (obj, value) => { obj.throughputMBps = value; } }, metadata: _metadata }, _throughputMBps_initializers, _throughputMBps_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateStorageResourceDto = CreateStorageResourceDto;
/**
 * DTO for creating network resource
 */
let CreateNetworkResourceDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _cidr_decorators;
    let _cidr_initializers = [];
    let _cidr_extraInitializers = [];
    let _gateway_decorators;
    let _gateway_initializers = [];
    let _gateway_extraInitializers = [];
    let _vlanId_decorators;
    let _vlanId_initializers = [];
    let _vlanId_extraInitializers = [];
    let _dhcpEnabled_decorators;
    let _dhcpEnabled_initializers = [];
    let _dhcpEnabled_extraInitializers = [];
    let _dnsServers_decorators;
    let _dnsServers_initializers = [];
    let _dnsServers_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    return _a = class CreateNetworkResourceDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.cidr = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _cidr_initializers, void 0));
                this.gateway = (__runInitializers(this, _cidr_extraInitializers), __runInitializers(this, _gateway_initializers, void 0));
                this.vlanId = (__runInitializers(this, _gateway_extraInitializers), __runInitializers(this, _vlanId_initializers, void 0));
                this.dhcpEnabled = (__runInitializers(this, _vlanId_extraInitializers), __runInitializers(this, _dhcpEnabled_initializers, true));
                this.dnsServers = (__runInitializers(this, _dhcpEnabled_extraInitializers), __runInitializers(this, _dnsServers_initializers, []));
                this.tags = (__runInitializers(this, _dnsServers_extraInitializers), __runInitializers(this, _tags_initializers, []));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                __runInitializers(this, _tenantId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _cidr_decorators = [(0, class_validator_1.Matches)(/^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/)];
            _gateway_decorators = [(0, class_validator_1.Matches)(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/), (0, class_validator_1.IsOptional)()];
            _vlanId_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(4094), (0, class_validator_1.IsOptional)()];
            _dhcpEnabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _dnsServers_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _tenantId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _cidr_decorators, { kind: "field", name: "cidr", static: false, private: false, access: { has: obj => "cidr" in obj, get: obj => obj.cidr, set: (obj, value) => { obj.cidr = value; } }, metadata: _metadata }, _cidr_initializers, _cidr_extraInitializers);
            __esDecorate(null, null, _gateway_decorators, { kind: "field", name: "gateway", static: false, private: false, access: { has: obj => "gateway" in obj, get: obj => obj.gateway, set: (obj, value) => { obj.gateway = value; } }, metadata: _metadata }, _gateway_initializers, _gateway_extraInitializers);
            __esDecorate(null, null, _vlanId_decorators, { kind: "field", name: "vlanId", static: false, private: false, access: { has: obj => "vlanId" in obj, get: obj => obj.vlanId, set: (obj, value) => { obj.vlanId = value; } }, metadata: _metadata }, _vlanId_initializers, _vlanId_extraInitializers);
            __esDecorate(null, null, _dhcpEnabled_decorators, { kind: "field", name: "dhcpEnabled", static: false, private: false, access: { has: obj => "dhcpEnabled" in obj, get: obj => obj.dhcpEnabled, set: (obj, value) => { obj.dhcpEnabled = value; } }, metadata: _metadata }, _dhcpEnabled_initializers, _dhcpEnabled_extraInitializers);
            __esDecorate(null, null, _dnsServers_decorators, { kind: "field", name: "dnsServers", static: false, private: false, access: { has: obj => "dnsServers" in obj, get: obj => obj.dnsServers, set: (obj, value) => { obj.dnsServers = value; } }, metadata: _metadata }, _dnsServers_initializers, _dnsServers_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateNetworkResourceDto = CreateNetworkResourceDto;
/**
 * DTO for updating resource
 */
let UpdateResourceDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    return _a = class UpdateResourceDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.tags = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.enabled = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
                __runInitializers(this, _enabled_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _enabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateResourceDto = UpdateResourceDto;
/**
 * DTO for resource quota configuration
 */
let ResourceQuotaDto = (() => {
    var _a;
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _maxCpuCores_decorators;
    let _maxCpuCores_initializers = [];
    let _maxCpuCores_extraInitializers = [];
    let _maxMemoryMB_decorators;
    let _maxMemoryMB_initializers = [];
    let _maxMemoryMB_extraInitializers = [];
    let _maxStorageGB_decorators;
    let _maxStorageGB_initializers = [];
    let _maxStorageGB_extraInitializers = [];
    let _maxNetworks_decorators;
    let _maxNetworks_initializers = [];
    let _maxNetworks_extraInitializers = [];
    let _maxInstances_decorators;
    let _maxInstances_initializers = [];
    let _maxInstances_extraInitializers = [];
    let _enforcement_decorators;
    let _enforcement_initializers = [];
    let _enforcement_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    return _a = class ResourceQuotaDto {
            constructor() {
                this.resourceType = __runInitializers(this, _resourceType_initializers, void 0);
                this.tenantId = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
                this.maxCpuCores = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _maxCpuCores_initializers, void 0));
                this.maxMemoryMB = (__runInitializers(this, _maxCpuCores_extraInitializers), __runInitializers(this, _maxMemoryMB_initializers, void 0));
                this.maxStorageGB = (__runInitializers(this, _maxMemoryMB_extraInitializers), __runInitializers(this, _maxStorageGB_initializers, void 0));
                this.maxNetworks = (__runInitializers(this, _maxStorageGB_extraInitializers), __runInitializers(this, _maxNetworks_initializers, void 0));
                this.maxInstances = (__runInitializers(this, _maxNetworks_extraInitializers), __runInitializers(this, _maxInstances_initializers, void 0));
                this.enforcement = (__runInitializers(this, _maxInstances_extraInitializers), __runInitializers(this, _enforcement_initializers, QuotaEnforcement.HARD));
                this.enabled = (__runInitializers(this, _enforcement_extraInitializers), __runInitializers(this, _enabled_initializers, true));
                __runInitializers(this, _enabled_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _resourceType_decorators = [(0, class_validator_1.IsEnum)(VirtualResourceType)];
            _tenantId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _maxCpuCores_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _maxMemoryMB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _maxStorageGB_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _maxNetworks_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _maxInstances_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _enforcement_decorators = [(0, class_validator_1.IsEnum)(QuotaEnforcement), (0, class_validator_1.IsOptional)()];
            _enabled_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
            __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
            __esDecorate(null, null, _maxCpuCores_decorators, { kind: "field", name: "maxCpuCores", static: false, private: false, access: { has: obj => "maxCpuCores" in obj, get: obj => obj.maxCpuCores, set: (obj, value) => { obj.maxCpuCores = value; } }, metadata: _metadata }, _maxCpuCores_initializers, _maxCpuCores_extraInitializers);
            __esDecorate(null, null, _maxMemoryMB_decorators, { kind: "field", name: "maxMemoryMB", static: false, private: false, access: { has: obj => "maxMemoryMB" in obj, get: obj => obj.maxMemoryMB, set: (obj, value) => { obj.maxMemoryMB = value; } }, metadata: _metadata }, _maxMemoryMB_initializers, _maxMemoryMB_extraInitializers);
            __esDecorate(null, null, _maxStorageGB_decorators, { kind: "field", name: "maxStorageGB", static: false, private: false, access: { has: obj => "maxStorageGB" in obj, get: obj => obj.maxStorageGB, set: (obj, value) => { obj.maxStorageGB = value; } }, metadata: _metadata }, _maxStorageGB_initializers, _maxStorageGB_extraInitializers);
            __esDecorate(null, null, _maxNetworks_decorators, { kind: "field", name: "maxNetworks", static: false, private: false, access: { has: obj => "maxNetworks" in obj, get: obj => obj.maxNetworks, set: (obj, value) => { obj.maxNetworks = value; } }, metadata: _metadata }, _maxNetworks_initializers, _maxNetworks_extraInitializers);
            __esDecorate(null, null, _maxInstances_decorators, { kind: "field", name: "maxInstances", static: false, private: false, access: { has: obj => "maxInstances" in obj, get: obj => obj.maxInstances, set: (obj, value) => { obj.maxInstances = value; } }, metadata: _metadata }, _maxInstances_initializers, _maxInstances_extraInitializers);
            __esDecorate(null, null, _enforcement_decorators, { kind: "field", name: "enforcement", static: false, private: false, access: { has: obj => "enforcement" in obj, get: obj => obj.enforcement, set: (obj, value) => { obj.enforcement = value; } }, metadata: _metadata }, _enforcement_initializers, _enforcement_extraInitializers);
            __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ResourceQuotaDto = ResourceQuotaDto;
/**
 * DTO for bulk resource operations
 */
let BulkResourceOperationDto = (() => {
    var _a;
    let _resourceIds_decorators;
    let _resourceIds_initializers = [];
    let _resourceIds_extraInitializers = [];
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    let _parameters_decorators;
    let _parameters_initializers = [];
    let _parameters_extraInitializers = [];
    return _a = class BulkResourceOperationDto {
            constructor() {
                this.resourceIds = __runInitializers(this, _resourceIds_initializers, void 0);
                this.operation = (__runInitializers(this, _resourceIds_extraInitializers), __runInitializers(this, _operation_initializers, void 0));
                this.parameters = (__runInitializers(this, _operation_extraInitializers), __runInitializers(this, _parameters_initializers, void 0));
                __runInitializers(this, _parameters_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _resourceIds_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true }), (0, class_validator_1.ArrayMinSize)(1), (0, class_validator_1.ArrayMaxSize)(100)];
            _operation_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _parameters_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _resourceIds_decorators, { kind: "field", name: "resourceIds", static: false, private: false, access: { has: obj => "resourceIds" in obj, get: obj => obj.resourceIds, set: (obj, value) => { obj.resourceIds = value; } }, metadata: _metadata }, _resourceIds_initializers, _resourceIds_extraInitializers);
            __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
            __esDecorate(null, null, _parameters_decorators, { kind: "field", name: "parameters", static: false, private: false, access: { has: obj => "parameters" in obj, get: obj => obj.parameters, set: (obj, value) => { obj.parameters = value; } }, metadata: _metadata }, _parameters_initializers, _parameters_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BulkResourceOperationDto = BulkResourceOperationDto;
/**
 * DTO for resource tagging
 */
let ResourceTagDto = (() => {
    var _a;
    let _key_decorators;
    let _key_initializers = [];
    let _key_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    return _a = class ResourceTagDto {
            constructor() {
                this.key = __runInitializers(this, _key_initializers, void 0);
                this.value = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.category = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                __runInitializers(this, _category_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(1), (0, class_validator_1.MaxLength)(128)];
            _value_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(1), (0, class_validator_1.MaxLength)(256)];
            _category_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: obj => "key" in obj, get: obj => obj.key, set: (obj, value) => { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ResourceTagDto = ResourceTagDto;
/**
 * DTO for attaching network interface
 */
let AttachNetworkInterfaceDto = (() => {
    var _a;
    let _networkId_decorators;
    let _networkId_initializers = [];
    let _networkId_extraInitializers = [];
    let _interfaceType_decorators;
    let _interfaceType_initializers = [];
    let _interfaceType_extraInitializers = [];
    let _macAddress_decorators;
    let _macAddress_initializers = [];
    let _macAddress_extraInitializers = [];
    let _connected_decorators;
    let _connected_initializers = [];
    let _connected_extraInitializers = [];
    let _deviceIndex_decorators;
    let _deviceIndex_initializers = [];
    let _deviceIndex_extraInitializers = [];
    return _a = class AttachNetworkInterfaceDto {
            constructor() {
                this.networkId = __runInitializers(this, _networkId_initializers, void 0);
                this.interfaceType = (__runInitializers(this, _networkId_extraInitializers), __runInitializers(this, _interfaceType_initializers, NetworkInterfaceType.VMXNET3));
                this.macAddress = (__runInitializers(this, _interfaceType_extraInitializers), __runInitializers(this, _macAddress_initializers, void 0));
                this.connected = (__runInitializers(this, _macAddress_extraInitializers), __runInitializers(this, _connected_initializers, true));
                this.deviceIndex = (__runInitializers(this, _connected_extraInitializers), __runInitializers(this, _deviceIndex_initializers, void 0));
                __runInitializers(this, _deviceIndex_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _networkId_decorators = [(0, class_validator_1.IsUUID)('4')];
            _interfaceType_decorators = [(0, class_validator_1.IsEnum)(NetworkInterfaceType), (0, class_validator_1.IsOptional)()];
            _macAddress_decorators = [(0, class_validator_1.Matches)(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/), (0, class_validator_1.IsOptional)()];
            _connected_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _deviceIndex_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(9)];
            __esDecorate(null, null, _networkId_decorators, { kind: "field", name: "networkId", static: false, private: false, access: { has: obj => "networkId" in obj, get: obj => obj.networkId, set: (obj, value) => { obj.networkId = value; } }, metadata: _metadata }, _networkId_initializers, _networkId_extraInitializers);
            __esDecorate(null, null, _interfaceType_decorators, { kind: "field", name: "interfaceType", static: false, private: false, access: { has: obj => "interfaceType" in obj, get: obj => obj.interfaceType, set: (obj, value) => { obj.interfaceType = value; } }, metadata: _metadata }, _interfaceType_initializers, _interfaceType_extraInitializers);
            __esDecorate(null, null, _macAddress_decorators, { kind: "field", name: "macAddress", static: false, private: false, access: { has: obj => "macAddress" in obj, get: obj => obj.macAddress, set: (obj, value) => { obj.macAddress = value; } }, metadata: _metadata }, _macAddress_initializers, _macAddress_extraInitializers);
            __esDecorate(null, null, _connected_decorators, { kind: "field", name: "connected", static: false, private: false, access: { has: obj => "connected" in obj, get: obj => obj.connected, set: (obj, value) => { obj.connected = value; } }, metadata: _metadata }, _connected_initializers, _connected_extraInitializers);
            __esDecorate(null, null, _deviceIndex_decorators, { kind: "field", name: "deviceIndex", static: false, private: false, access: { has: obj => "deviceIndex" in obj, get: obj => obj.deviceIndex, set: (obj, value) => { obj.deviceIndex = value; } }, metadata: _metadata }, _deviceIndex_initializers, _deviceIndex_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AttachNetworkInterfaceDto = AttachNetworkInterfaceDto;
/**
 * DTO for creating snapshot
 */
let CreateSnapshotDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _includeMemory_decorators;
    let _includeMemory_initializers = [];
    let _includeMemory_extraInitializers = [];
    let _quiesce_decorators;
    let _quiesce_initializers = [];
    let _quiesce_extraInitializers = [];
    let _retentionDays_decorators;
    let _retentionDays_initializers = [];
    let _retentionDays_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CreateSnapshotDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.includeMemory = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _includeMemory_initializers, false));
                this.quiesce = (__runInitializers(this, _includeMemory_extraInitializers), __runInitializers(this, _quiesce_initializers, false));
                this.retentionDays = (__runInitializers(this, _quiesce_extraInitializers), __runInitializers(this, _retentionDays_initializers, void 0));
                this.tags = (__runInitializers(this, _retentionDays_extraInitializers), __runInitializers(this, _tags_initializers, []));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _includeMemory_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _quiesce_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _retentionDays_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(365)];
            _tags_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _includeMemory_decorators, { kind: "field", name: "includeMemory", static: false, private: false, access: { has: obj => "includeMemory" in obj, get: obj => obj.includeMemory, set: (obj, value) => { obj.includeMemory = value; } }, metadata: _metadata }, _includeMemory_initializers, _includeMemory_extraInitializers);
            __esDecorate(null, null, _quiesce_decorators, { kind: "field", name: "quiesce", static: false, private: false, access: { has: obj => "quiesce" in obj, get: obj => obj.quiesce, set: (obj, value) => { obj.quiesce = value; } }, metadata: _metadata }, _quiesce_initializers, _quiesce_extraInitializers);
            __esDecorate(null, null, _retentionDays_decorators, { kind: "field", name: "retentionDays", static: false, private: false, access: { has: obj => "retentionDays" in obj, get: obj => obj.retentionDays, set: (obj, value) => { obj.retentionDays = value; } }, metadata: _metadata }, _retentionDays_initializers, _retentionDays_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSnapshotDto = CreateSnapshotDto;
// ============================================================================
// DECORATOR UTILITIES
// ============================================================================
/**
 * Custom decorator for HIPAA audit logging
 *
 * @param {string} action - Action being performed
 * @returns {MethodDecorator} Audit decorator
 *
 * @example
 * ```typescript
 * @Post()
 * @AuditLog('CREATE_COMPUTE_RESOURCE')
 * async createCompute(@Body() dto: CreateComputeResourceDto) {
 *   // Automatically logged for HIPAA compliance
 * }
 * ```
 */
function AuditLog(action) {
    return (0, common_1.applyDecorators)();
}
/**
 * Decorator for tenant-scoped resources
 *
 * @returns {ParameterDecorator} Tenant decorator
 *
 * @example
 * ```typescript
 * @Get()
 * async getResources(@TenantId() tenantId: string) {
 *   return this.service.findByTenant(tenantId);
 * }
 * ```
 */
exports.TenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId || request.headers['x-tenant-id'];
});
// ============================================================================
// COMPUTE RESOURCE CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for compute resource creation endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute')
 * @CreateComputeResourceDecorators()
 * async createCompute(@Body() dto: CreateComputeResourceDto) {
 *   return this.resourceService.createCompute(dto);
 * }
 * ```
 */
function CreateComputeResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create virtual compute resource', description: 'Creates a new virtual machine or compute instance with specified CPU, memory, and configuration' }), (0, swagger_1.ApiBody)({ type: CreateComputeResourceDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Compute resource created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Quota exceeded or insufficient permissions' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing compute resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('compute')
 * @ListComputeResourcesDecorators()
 * async listCompute(@Query('page') page: number, @Query('limit') limit: number) {
 *   return this.resourceService.listCompute({ page, limit });
 * }
 * ```
 */
function ListComputeResourcesDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List virtual compute resources', description: 'Retrieves paginated list of compute resources with filtering and sorting options' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (max 100)' }), (0, swagger_1.ApiQuery)({ name: 'tags', required: false, type: String, description: 'Filter by tags (comma-separated)' }), (0, swagger_1.ApiQuery)({ name: 'powerState', required: false, enum: ResourcePowerState, description: 'Filter by power state' }), (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Sort field (name, createdAt, cpuCores)' }), (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List retrieved successfully', type: [Object] }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting compute resource details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('compute/:id')
 * @GetComputeResourceDecorators()
 * async getCompute(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.resourceService.getCompute(id);
 * }
 * ```
 */
function GetComputeResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get compute resource details', description: 'Retrieves detailed information about a specific compute resource including current state and metrics' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Resource details retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for updating compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('compute/:id')
 * @UpdateComputeResourceDecorators()
 * async updateCompute(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
 *   return this.resourceService.updateCompute(id, dto);
 * }
 * ```
 */
function UpdateComputeResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update compute resource', description: 'Updates compute resource metadata, tags, or configuration (hot-add for CPU/memory if supported)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiBody)({ type: UpdateResourceDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Resource updated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - resource in invalid state for update' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for deleting compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('compute/:id')
 * @DeleteComputeResourceDecorators()
 * async deleteCompute(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.resourceService.deleteCompute(id, force);
 * }
 * ```
 */
function DeleteComputeResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete compute resource', description: 'Permanently deletes a compute resource (must be powered off unless force=true)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiQuery)({ name: 'force', required: false, type: Boolean, description: 'Force deletion even if powered on' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Resource deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Resource cannot be deleted in current state' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
/**
 * Creates decorator for compute power state control endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/power')
 * @ComputePowerControlDecorators()
 * async controlPower(@Param('id') id: string, @Body() dto: { action: string }) {
 *   return this.resourceService.powerControl(id, dto.action);
 * }
 * ```
 */
function ComputePowerControlDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Control compute power state', description: 'Changes power state of compute resource (start, stop, restart, suspend, resume)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                action: { type: 'string', enum: ['start', 'stop', 'restart', 'suspend', 'resume', 'reset'], description: 'Power action to perform' },
                force: { type: 'boolean', description: 'Force action without graceful shutdown' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Power state changed successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Invalid power state transition' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for resizing compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('compute/:id/resize')
 * @ResizeComputeResourceDecorators()
 * async resizeCompute(@Param('id') id: string, @Body() dto: { cpuCores: number, memoryMB: number }) {
 *   return this.resourceService.resizeCompute(id, dto);
 * }
 * ```
 */
function ResizeComputeResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Resize compute resource', description: 'Changes CPU and/or memory allocation for compute resource (may require restart)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                cpuCores: { type: 'number', minimum: 1, maximum: 128, description: 'New CPU core count' },
                memoryMB: { type: 'number', minimum: 512, maximum: 1048576, description: 'New memory size in MB' },
                hotAdd: { type: 'boolean', description: 'Attempt hot-add without restart' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Resource resized successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Quota exceeded' }), (0, swagger_1.ApiResponse)({ status: 422, description: 'Hot-add not supported for this resource' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// STORAGE RESOURCE CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for creating storage resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage')
 * @CreateStorageResourceDecorators()
 * async createStorage(@Body() dto: CreateStorageResourceDto) {
 *   return this.resourceService.createStorage(dto);
 * }
 * ```
 */
function CreateStorageResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create storage resource', description: 'Creates a new virtual disk or storage volume with specified size and type' }), (0, swagger_1.ApiBody)({ type: CreateStorageResourceDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Storage resource created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Storage quota exceeded' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing storage resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('storage')
 * @ListStorageResourcesDecorators()
 * async listStorage(@Query() query: any) {
 *   return this.resourceService.listStorage(query);
 * }
 * ```
 */
function ListStorageResourcesDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List storage resources', description: 'Retrieves paginated list of storage resources with filtering options' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'storageType', required: false, enum: StorageType, description: 'Filter by storage type' }), (0, swagger_1.ApiQuery)({ name: 'encrypted', required: false, type: Boolean, description: 'Filter by encryption status' }), (0, swagger_1.ApiQuery)({ name: 'attached', required: false, type: Boolean, description: 'Filter by attachment status' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List retrieved successfully', type: [Object] }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting storage resource details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('storage/:id')
 * @GetStorageResourceDecorators()
 * async getStorage(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.resourceService.getStorage(id);
 * }
 * ```
 */
function GetStorageResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get storage resource details', description: 'Retrieves detailed information about a specific storage resource' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Storage resource UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage details retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage resource not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for attaching storage to compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/attach')
 * @AttachStorageDecorators()
 * async attachStorage(@Param('id') id: string, @Body() dto: { computeId: string }) {
 *   return this.resourceService.attachStorage(id, dto.computeId);
 * }
 * ```
 */
function AttachStorageDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Attach storage to compute resource', description: 'Attaches a storage volume to a compute instance' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Storage resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                computeId: { type: 'string', format: 'uuid', description: 'Target compute resource UUID' },
                deviceIndex: { type: 'number', minimum: 0, maximum: 15, description: 'Device index (e.g., /dev/sda = 0)' },
                readOnly: { type: 'boolean', description: 'Mount as read-only' },
            },
            required: ['computeId'],
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage attached successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage or compute resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Storage already attached or device index in use' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for detaching storage from compute resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/detach')
 * @DetachStorageDecorators()
 * async detachStorage(@Param('id') id: string, @Body() dto?: { force: boolean }) {
 *   return this.resourceService.detachStorage(id, dto?.force);
 * }
 * ```
 */
function DetachStorageDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Detach storage from compute resource', description: 'Detaches a storage volume from its attached compute instance' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Storage resource UUID' }), (0, swagger_1.ApiBody)({
        required: false,
        schema: {
            properties: {
                force: { type: 'boolean', description: 'Force detach even if volume is in use' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage detached successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Storage not attached or in use' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for resizing storage resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('storage/:id/resize')
 * @ResizeStorageDecorators()
 * async resizeStorage(@Param('id') id: string, @Body() dto: { sizeGB: number }) {
 *   return this.resourceService.resizeStorage(id, dto.sizeGB);
 * }
 * ```
 */
function ResizeStorageDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Resize storage resource', description: 'Expands storage volume size (cannot shrink, only expand)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Storage resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                sizeGB: { type: 'number', minimum: 1, maximum: 102400, description: 'New size in GB (must be larger than current)' },
            },
            required: ['sizeGB'],
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage resized successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage resource not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid size (must be larger than current)' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Storage quota exceeded' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for creating storage snapshot endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/snapshot')
 * @CreateStorageSnapshotDecorators()
 * async createSnapshot(@Param('id') id: string, @Body() dto: CreateSnapshotDto) {
 *   return this.resourceService.createSnapshot(id, dto);
 * }
 * ```
 */
function CreateStorageSnapshotDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create storage snapshot', description: 'Creates a point-in-time snapshot of a storage volume' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Storage resource UUID' }), (0, swagger_1.ApiBody)({ type: CreateSnapshotDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Snapshot created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage resource not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Snapshot quota exceeded' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// NETWORK RESOURCE CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for creating network resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('network')
 * @CreateNetworkResourceDecorators()
 * async createNetwork(@Body() dto: CreateNetworkResourceDto) {
 *   return this.resourceService.createNetwork(dto);
 * }
 * ```
 */
function CreateNetworkResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create network resource', description: 'Creates a new virtual network with specified CIDR and configuration' }), (0, swagger_1.ApiBody)({ type: CreateNetworkResourceDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Network resource created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid CIDR or configuration' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Network CIDR conflicts with existing network' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing network resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('network')
 * @ListNetworkResourcesDecorators()
 * async listNetworks(@Query() query: any) {
 *   return this.resourceService.listNetworks(query);
 * }
 * ```
 */
function ListNetworkResourcesDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List network resources', description: 'Retrieves paginated list of network resources' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'vlanId', required: false, type: Number, description: 'Filter by VLAN ID' }), (0, swagger_1.ApiQuery)({ name: 'dhcpEnabled', required: false, type: Boolean, description: 'Filter by DHCP status' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List retrieved successfully', type: [Object] }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting network resource details endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('network/:id')
 * @GetNetworkResourceDecorators()
 * async getNetwork(@Param('id', ParseUUIDPipe) id: string) {
 *   return this.resourceService.getNetwork(id);
 * }
 * ```
 */
function GetNetworkResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get network resource details', description: 'Retrieves detailed information about a specific network resource' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Network resource UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Network details retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Network resource not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for attaching network interface endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/network-interface')
 * @AttachNetworkInterfaceDecorators()
 * async attachInterface(@Param('id') id: string, @Body() dto: AttachNetworkInterfaceDto) {
 *   return this.resourceService.attachNetworkInterface(id, dto);
 * }
 * ```
 */
function AttachNetworkInterfaceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Attach network interface to compute', description: 'Attaches a network interface to a compute resource' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiBody)({ type: AttachNetworkInterfaceDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Network interface attached successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Compute or network resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Device index already in use or MAC address conflict' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for detaching network interface endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('compute/:computeId/network-interface/:interfaceId')
 * @DetachNetworkInterfaceDecorators()
 * async detachInterface(@Param('computeId') computeId: string, @Param('interfaceId') interfaceId: string) {
 *   return this.resourceService.detachNetworkInterface(computeId, interfaceId);
 * }
 * ```
 */
function DetachNetworkInterfaceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Detach network interface from compute', description: 'Detaches a network interface from a compute resource' }), (0, swagger_1.ApiParam)({ name: 'computeId', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiParam)({ name: 'interfaceId', type: String, description: 'Network interface UUID' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Network interface detached successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Compute resource or interface not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Cannot detach primary network interface' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
// ============================================================================
// QUOTA MANAGEMENT CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for setting resource quota endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Put('quota')
 * @SetResourceQuotaDecorators()
 * async setQuota(@Body() dto: ResourceQuotaDto, @TenantId() tenantId: string) {
 *   return this.resourceService.setQuota(tenantId, dto);
 * }
 * ```
 */
function SetResourceQuotaDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Set resource quota', description: 'Configures resource quotas for a tenant or global limits' }), (0, swagger_1.ApiBody)({ type: ResourceQuotaDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Quota configured successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid quota configuration' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions to set quota' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for getting resource quota endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('quota')
 * @GetResourceQuotaDecorators()
 * async getQuota(@TenantId() tenantId: string, @Query('resourceType') type: VirtualResourceType) {
 *   return this.resourceService.getQuota(tenantId, type);
 * }
 * ```
 */
function GetResourceQuotaDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get resource quota', description: 'Retrieves current quota limits and usage for a tenant' }), (0, swagger_1.ApiQuery)({ name: 'resourceType', required: false, enum: VirtualResourceType, description: 'Filter by resource type' }), (0, swagger_1.ApiQuery)({ name: 'tenantId', required: false, type: String, description: 'Tenant ID (admin only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Quota retrieved successfully', type: Object }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for checking quota availability endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('quota/check')
 * @CheckQuotaAvailabilityDecorators()
 * async checkQuota(@Body() dto: { resourceType: string, cpuCores: number, memoryMB: number }) {
 *   return this.resourceService.checkQuotaAvailability(dto);
 * }
 * ```
 */
function CheckQuotaAvailabilityDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Check quota availability', description: 'Validates if requested resources are within quota limits before provisioning' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                resourceType: { type: 'string', enum: Object.values(VirtualResourceType) },
                cpuCores: { type: 'number' },
                memoryMB: { type: 'number' },
                storageGB: { type: 'number' },
                count: { type: 'number', default: 1, description: 'Number of instances to provision' },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quota check result',
        schema: {
            properties: {
                available: { type: 'boolean' },
                currentUsage: { type: 'object' },
                limits: { type: 'object' },
                remaining: { type: 'object' },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// RESOURCE TAGGING CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for adding resource tag endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/:id/tags')
 * @AddResourceTagDecorators()
 * async addTag(@Param('id') id: string, @Body() dto: ResourceTagDto) {
 *   return this.resourceService.addTag(id, dto);
 * }
 * ```
 */
function AddResourceTagDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Add resource tag', description: 'Adds a tag to a resource for organization and filtering' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Resource UUID' }), (0, swagger_1.ApiBody)({ type: ResourceTagDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Tag added successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Tag key already exists' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for listing resource tags endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resources/:id/tags')
 * @ListResourceTagsDecorators()
 * async listTags(@Param('id') id: string) {
 *   return this.resourceService.listTags(id);
 * }
 * ```
 */
function ListResourceTagsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List resource tags', description: 'Retrieves all tags associated with a resource' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Resource UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Tags retrieved successfully', type: [Object] }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for removing resource tag endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('resources/:id/tags/:key')
 * @RemoveResourceTagDecorators()
 * async removeTag(@Param('id') id: string, @Param('key') key: string) {
 *   return this.resourceService.removeTag(id, key);
 * }
 * ```
 */
function RemoveResourceTagDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Remove resource tag', description: 'Removes a tag from a resource' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Resource UUID' }), (0, swagger_1.ApiParam)({ name: 'key', type: String, description: 'Tag key to remove' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Tag removed successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource or tag not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
/**
 * Creates decorator for bulk tagging resources endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/tags/bulk')
 * @BulkTagResourcesDecorators()
 * async bulkTag(@Body() dto: { resourceIds: string[], tags: ResourceTagDto[] }) {
 *   return this.resourceService.bulkTagResources(dto.resourceIds, dto.tags);
 * }
 * ```
 */
function BulkTagResourcesDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Bulk tag resources', description: 'Applies tags to multiple resources in a single operation' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                resourceIds: { type: 'array', items: { type: 'string', format: 'uuid' }, minItems: 1, maxItems: 100 },
                tags: { type: 'array', items: { $ref: '#/components/schemas/ResourceTagDto' }, minItems: 1, maxItems: 50 },
                overwrite: { type: 'boolean', default: false, description: 'Overwrite existing tags with same key' },
            },
            required: ['resourceIds', 'tags'],
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bulk tagging result',
        schema: {
            properties: {
                successful: { type: 'array', items: { type: 'string' } },
                failed: { type: 'array', items: { type: 'object' } },
                totalProcessed: { type: 'number' },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// RESOURCE METRICS & MONITORING CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for getting resource metrics endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resources/:id/metrics')
 * @GetResourceMetricsDecorators()
 * async getMetrics(@Param('id') id: string, @Query('period') period: string) {
 *   return this.resourceService.getMetrics(id, period);
 * }
 * ```
 */
function GetResourceMetricsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get resource metrics', description: 'Retrieves performance metrics for a resource (CPU, memory, disk, network)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Resource UUID' }), (0, swagger_1.ApiQuery)({ name: 'period', required: false, type: String, enum: ['1h', '6h', '24h', '7d', '30d'], description: 'Metrics time period' }), (0, swagger_1.ApiQuery)({ name: 'interval', required: false, type: String, enum: ['1m', '5m', '15m', '1h'], description: 'Data point interval' }), (0, swagger_1.ApiQuery)({ name: 'metrics', required: false, type: String, description: 'Comma-separated metric names' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Metrics retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for getting real-time resource stats endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('resources/:id/stats/realtime')
 * @GetRealtimeResourceStatsDecorators()
 * async getRealtimeStats(@Param('id') id: string) {
 *   return this.resourceService.getRealtimeStats(id);
 * }
 * ```
 */
function GetRealtimeResourceStatsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get real-time resource statistics', description: 'Retrieves current real-time resource utilization and performance stats' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Resource UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Real-time stats retrieved successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource not found' }), (0, swagger_1.ApiBearerAuth)());
}
// ============================================================================
// BULK OPERATIONS CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for bulk resource deletion endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/bulk-delete')
 * @BulkDeleteResourcesDecorators()
 * async bulkDelete(@Body() dto: BulkResourceOperationDto) {
 *   return this.resourceService.bulkDelete(dto);
 * }
 * ```
 */
function BulkDeleteResourcesDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Bulk delete resources', description: 'Deletes multiple resources in a single operation' }), (0, swagger_1.ApiBody)({ type: BulkResourceOperationDto }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bulk deletion result',
        schema: {
            properties: {
                successful: { type: 'array', items: { type: 'string' } },
                failed: { type: 'array', items: { type: 'object' } },
                totalProcessed: { type: 'number' },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for bulk power state change endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/bulk-power')
 * @BulkPowerControlDecorators()
 * async bulkPower(@Body() dto: { resourceIds: string[], action: string }) {
 *   return this.resourceService.bulkPowerControl(dto);
 * }
 * ```
 */
function BulkPowerControlDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Bulk power control', description: 'Changes power state for multiple compute resources simultaneously' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                resourceIds: { type: 'array', items: { type: 'string', format: 'uuid' }, minItems: 1, maxItems: 50 },
                action: { type: 'string', enum: ['start', 'stop', 'restart', 'suspend', 'resume'] },
                force: { type: 'boolean', default: false },
            },
            required: ['resourceIds', 'action'],
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bulk power control result',
        schema: {
            properties: {
                successful: { type: 'array', items: { type: 'string' } },
                failed: { type: 'array', items: { type: 'object' } },
                totalProcessed: { type: 'number' },
            },
        },
    }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// RESOURCE CLONING & TEMPLATES
// ============================================================================
/**
 * Creates decorator for cloning resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/:id/clone')
 * @CloneResourceDecorators()
 * async cloneResource(@Param('id') id: string, @Body() dto: { name: string, count: number }) {
 *   return this.resourceService.cloneResource(id, dto);
 * }
 * ```
 */
function CloneResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Clone resource', description: 'Creates one or more copies of a resource with optional modifications' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Source resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                name: { type: 'string', description: 'Name for cloned resource(s)' },
                count: { type: 'number', minimum: 1, maximum: 10, default: 1, description: 'Number of clones to create' },
                linked: { type: 'boolean', default: false, description: 'Create linked clone (storage snapshot based)' },
                powerOn: { type: 'boolean', default: false, description: 'Power on clones after creation' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Tags for cloned resources' },
            },
            required: ['name'],
        },
    }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Resources cloned successfully', type: [Object] }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Source resource not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Quota exceeded for cloning operation' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for creating resource template endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('resources/:id/template')
 * @CreateResourceTemplateDecorators()
 * async createTemplate(@Param('id') id: string, @Body() dto: { name: string, description: string }) {
 *   return this.resourceService.createTemplate(id, dto);
 * }
 * ```
 */
function CreateResourceTemplateDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create resource template', description: 'Converts a resource into a reusable template for rapid provisioning' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Source resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                name: { type: 'string', minLength: 3, maxLength: 255, description: 'Template name' },
                description: { type: 'string', description: 'Template description' },
                public: { type: 'boolean', default: false, description: 'Make template publicly available' },
                category: { type: 'string', description: 'Template category' },
                tags: { type: 'array', items: { type: 'string' } },
            },
            required: ['name'],
        },
    }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Source resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Resource must be powered off to create template' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for deploying from template endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('templates/:id/deploy')
 * @DeployFromTemplateDecorators()
 * async deployFromTemplate(@Param('id') id: string, @Body() dto: any) {
 *   return this.resourceService.deployFromTemplate(id, dto);
 * }
 * ```
 */
function DeployFromTemplateDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Deploy from template', description: 'Creates new resources from a template with customization options' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Template UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                name: { type: 'string', description: 'Name for deployed resource(s)' },
                count: { type: 'number', minimum: 1, maximum: 50, default: 1 },
                customization: {
                    type: 'object',
                    properties: {
                        cpuCores: { type: 'number' },
                        memoryMB: { type: 'number' },
                        hostname: { type: 'string' },
                        ipAddress: { type: 'string' },
                    },
                },
                powerOn: { type: 'boolean', default: true },
                tags: { type: 'array', items: { type: 'string' } },
            },
            required: ['name'],
        },
    }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Resources deployed successfully', type: [Object] }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Quota exceeded' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// RESOURCE LIFECYCLE OPERATIONS
// ============================================================================
/**
 * Creates decorator for migrating resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/migrate')
 * @MigrateComputeResourceDecorators()
 * async migrateCompute(@Param('id') id: string, @Body() dto: { targetHostId: string }) {
 *   return this.resourceService.migrateCompute(id, dto);
 * }
 * ```
 */
function MigrateComputeResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Migrate compute resource', description: 'Live migrates or cold migrates compute resource to different host' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                targetHostId: { type: 'string', format: 'uuid', description: 'Target host UUID' },
                live: { type: 'boolean', default: true, description: 'Perform live migration (vMotion-style)' },
                priority: { type: 'string', enum: ['low', 'normal', 'high'], default: 'normal' },
            },
            required: ['targetHostId'],
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Migration started successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Resource or target host not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Migration not possible in current state' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for resource consolidation endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('storage/:id/consolidate')
 * @ConsolidateStorageDecorators()
 * async consolidateStorage(@Param('id') id: string) {
 *   return this.resourceService.consolidateStorage(id);
 * }
 * ```
 */
function ConsolidateStorageDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Consolidate storage snapshots', description: 'Consolidates snapshot chain to improve storage performance' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Storage resource UUID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Consolidation started successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'No snapshots to consolidate' }), (0, swagger_1.ApiBearerAuth)());
}
// ============================================================================
// SNAPSHOT MANAGEMENT CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for listing snapshots endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Get('storage/:id/snapshots')
 * @ListSnapshotsDecorators()
 * async listSnapshots(@Param('id') id: string) {
 *   return this.resourceService.listSnapshots(id);
 * }
 * ```
 */
function ListSnapshotsDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'List storage snapshots', description: 'Retrieves all snapshots for a storage resource' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Storage resource UUID' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Snapshots retrieved successfully', type: [Object] }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Storage resource not found' }), (0, swagger_1.ApiBearerAuth)());
}
/**
 * Creates decorator for restoring from snapshot endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('snapshots/:id/restore')
 * @RestoreFromSnapshotDecorators()
 * async restoreSnapshot(@Param('id') id: string, @Body() dto: any) {
 *   return this.resourceService.restoreFromSnapshot(id, dto);
 * }
 * ```
 */
function RestoreFromSnapshotDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Restore from snapshot', description: 'Restores a storage resource or compute instance from a snapshot' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Snapshot UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                createNew: { type: 'boolean', default: false, description: 'Create new resource instead of overwriting' },
                name: { type: 'string', description: 'Name for new resource (if createNew=true)' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Restore initiated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Snapshot not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for deleting snapshot endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('snapshots/:id')
 * @DeleteSnapshotDecorators()
 * async deleteSnapshot(@Param('id') id: string) {
 *   return this.resourceService.deleteSnapshot(id);
 * }
 * ```
 */
function DeleteSnapshotDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete snapshot', description: 'Permanently deletes a snapshot and reclaims storage space' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Snapshot UUID' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Snapshot deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Snapshot not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Snapshot has dependent children' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
// ============================================================================
// CONSOLE & REMOTE ACCESS CONTROLLER FUNCTIONS
// ============================================================================
/**
 * Creates decorator for getting compute console endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Post('compute/:id/console')
 * @GetComputeConsoleDecorators()
 * async getConsole(@Param('id') id: string, @Body() dto: { type: string }) {
 *   return this.resourceService.getConsoleAccess(id, dto.type);
 * }
 * ```
 */
function GetComputeConsoleDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get compute console access', description: 'Generates secure console access URL for remote VM access (VNC, WebMKS, RDP)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Compute resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                type: { type: 'string', enum: ['vnc', 'webmks', 'rdp', 'ssh'], description: 'Console type' },
                duration: { type: 'number', default: 3600, description: 'Access duration in seconds' },
            },
            required: ['type'],
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Console access created',
        schema: {
            properties: {
                url: { type: 'string', description: 'Console access URL' },
                token: { type: 'string', description: 'Access token' },
                expiresAt: { type: 'string', format: 'date-time' },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Compute resource not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Resource must be powered on for console access' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
// ============================================================================
// ADDITIONAL NETWORK OPERATIONS
// ============================================================================
/**
 * Creates decorator for updating network resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Patch('network/:id')
 * @UpdateNetworkResourceDecorators()
 * async updateNetwork(@Param('id') id: string, @Body() dto: any) {
 *   return this.resourceService.updateNetwork(id, dto);
 * }
 * ```
 */
function UpdateNetworkResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update network resource', description: 'Updates network configuration, DNS servers, or DHCP settings' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Network resource UUID' }), (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                dhcpEnabled: { type: 'boolean' },
                dnsServers: { type: 'array', items: { type: 'string' } },
                tags: { type: 'array', items: { type: 'string' } },
            },
        },
    }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Network updated successfully', type: Object }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Network not found' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })));
}
/**
 * Creates decorator for deleting network resource endpoint
 *
 * @returns {MethodDecorator} Combined decorators
 *
 * @example
 * ```typescript
 * @Delete('network/:id')
 * @DeleteNetworkResourceDecorators()
 * async deleteNetwork(@Param('id') id: string, @Query('force') force: boolean) {
 *   return this.resourceService.deleteNetwork(id, force);
 * }
 * ```
 */
function DeleteNetworkResourceDecorators() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete network resource', description: 'Permanently deletes a virtual network (must have no connected devices unless force=true)' }), (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Network resource UUID' }), (0, swagger_1.ApiQuery)({ name: 'force', required: false, type: Boolean, description: 'Force deletion even with connected devices' }), (0, swagger_1.ApiResponse)({ status: 204, description: 'Network deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Network not found' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Network has connected devices' }), (0, swagger_1.ApiBearerAuth)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT));
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Compute Resource Controllers
    CreateComputeResourceDecorators,
    ListComputeResourcesDecorators,
    GetComputeResourceDecorators,
    UpdateComputeResourceDecorators,
    DeleteComputeResourceDecorators,
    ComputePowerControlDecorators,
    ResizeComputeResourceDecorators,
    // Storage Resource Controllers
    CreateStorageResourceDecorators,
    ListStorageResourcesDecorators,
    GetStorageResourceDecorators,
    AttachStorageDecorators,
    DetachStorageDecorators,
    ResizeStorageDecorators,
    CreateStorageSnapshotDecorators,
    // Network Resource Controllers
    CreateNetworkResourceDecorators,
    ListNetworkResourcesDecorators,
    GetNetworkResourceDecorators,
    AttachNetworkInterfaceDecorators,
    DetachNetworkInterfaceDecorators,
    // Quota Management
    SetResourceQuotaDecorators,
    GetResourceQuotaDecorators,
    CheckQuotaAvailabilityDecorators,
    // Resource Tagging
    AddResourceTagDecorators,
    ListResourceTagsDecorators,
    RemoveResourceTagDecorators,
    BulkTagResourcesDecorators,
    // Metrics & Monitoring
    GetResourceMetricsDecorators,
    GetRealtimeResourceStatsDecorators,
    // Bulk Operations
    BulkDeleteResourcesDecorators,
    BulkPowerControlDecorators,
    // Cloning & Templates
    CloneResourceDecorators,
    CreateResourceTemplateDecorators,
    DeployFromTemplateDecorators,
    // Lifecycle Operations
    MigrateComputeResourceDecorators,
    ConsolidateStorageDecorators,
    // Snapshot Management
    ListSnapshotsDecorators,
    RestoreFromSnapshotDecorators,
    DeleteSnapshotDecorators,
    // Console & Remote Access
    GetComputeConsoleDecorators,
    // Additional Network Operations
    UpdateNetworkResourceDecorators,
    DeleteNetworkResourceDecorators,
    // Custom Decorators
    AuditLog,
    TenantId: exports.TenantId,
    // DTOs
    CreateComputeResourceDto,
    CreateStorageResourceDto,
    CreateNetworkResourceDto,
    UpdateResourceDto,
    ResourceQuotaDto,
    BulkResourceOperationDto,
    ResourceTagDto,
    AttachNetworkInterfaceDto,
    CreateSnapshotDto,
    // Enums
    VirtualResourceType,
    ResourcePowerState,
    AllocationMode,
    StorageType,
    NetworkInterfaceType,
    QuotaEnforcement,
};
//# sourceMappingURL=virtual-resource-controllers-kit.js.map