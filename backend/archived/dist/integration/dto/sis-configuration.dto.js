"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSISConfigurationDto = exports.SyncEntitiesDto = exports.ConflictResolutionStrategy = exports.SyncSchedule = exports.SISPlatform = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var SISPlatform;
(function (SISPlatform) {
    SISPlatform["POWERSCHOOL"] = "POWERSCHOOL";
    SISPlatform["INFINITE_CAMPUS"] = "INFINITE_CAMPUS";
    SISPlatform["SKYWARD"] = "SKYWARD";
    SISPlatform["AERIES"] = "AERIES";
    SISPlatform["SCHOOLOGY"] = "SCHOOLOGY";
    SISPlatform["CUSTOM"] = "CUSTOM";
})(SISPlatform || (exports.SISPlatform = SISPlatform = {}));
var SyncSchedule;
(function (SyncSchedule) {
    SyncSchedule["REALTIME"] = "REALTIME";
    SyncSchedule["HOURLY"] = "HOURLY";
    SyncSchedule["DAILY"] = "DAILY";
    SyncSchedule["WEEKLY"] = "WEEKLY";
    SyncSchedule["MANUAL"] = "MANUAL";
})(SyncSchedule || (exports.SyncSchedule = SyncSchedule = {}));
var ConflictResolutionStrategy;
(function (ConflictResolutionStrategy) {
    ConflictResolutionStrategy["KEEP_LOCAL"] = "KEEP_LOCAL";
    ConflictResolutionStrategy["KEEP_SIS"] = "KEEP_SIS";
    ConflictResolutionStrategy["MANUAL"] = "MANUAL";
    ConflictResolutionStrategy["NEWEST_WINS"] = "NEWEST_WINS";
})(ConflictResolutionStrategy || (exports.ConflictResolutionStrategy = ConflictResolutionStrategy = {}));
class SyncEntitiesDto {
    students;
    demographics;
    enrollment;
    attendance;
    grades;
    schedules;
    contacts;
    static _OPENAPI_METADATA_FACTORY() {
        return { students: { required: true, type: () => Boolean }, demographics: { required: true, type: () => Boolean }, enrollment: { required: true, type: () => Boolean }, attendance: { required: true, type: () => Boolean }, grades: { required: true, type: () => Boolean }, schedules: { required: true, type: () => Boolean }, contacts: { required: true, type: () => Boolean } };
    }
}
exports.SyncEntitiesDto = SyncEntitiesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync students' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncEntitiesDto.prototype, "students", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync demographics' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncEntitiesDto.prototype, "demographics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync enrollment' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncEntitiesDto.prototype, "enrollment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync attendance' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncEntitiesDto.prototype, "attendance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync grades' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncEntitiesDto.prototype, "grades", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync schedules' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncEntitiesDto.prototype, "schedules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sync contacts' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncEntitiesDto.prototype, "contacts", void 0);
class CreateSISConfigurationDto {
    schoolId;
    platform;
    apiUrl;
    apiVersion;
    apiKey;
    clientId;
    clientSecret;
    syncDirection;
    syncSchedule;
    fieldMappings;
    syncEntities;
    autoCreateStudents;
    updateExistingOnly;
    conflictResolution;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, platform: { required: true, enum: require("./sis-configuration.dto").SISPlatform }, apiUrl: { required: true, type: () => String }, apiVersion: { required: false, type: () => String }, apiKey: { required: false, type: () => String }, clientId: { required: false, type: () => String }, clientSecret: { required: false, type: () => String }, syncDirection: { required: true, type: () => Object }, syncSchedule: { required: true, enum: require("./sis-configuration.dto").SyncSchedule }, fieldMappings: { required: true, type: () => Object }, syncEntities: { required: true, type: () => require("./sis-configuration.dto").SyncEntitiesDto }, autoCreateStudents: { required: true, type: () => Boolean }, updateExistingOnly: { required: true, type: () => Boolean }, conflictResolution: { required: true, enum: require("./sis-configuration.dto").ConflictResolutionStrategy } };
    }
}
exports.CreateSISConfigurationDto = CreateSISConfigurationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SISPlatform, description: 'SIS platform' }),
    (0, class_validator_1.IsEnum)(SISPlatform),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'API URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "apiUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'API version' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "apiVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'API key' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client ID for OAuth' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client secret for OAuth' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "clientSecret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['PULL', 'PUSH', 'BIDIRECTIONAL'],
        description: 'Sync direction',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "syncDirection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SyncSchedule, description: 'Sync schedule' }),
    (0, class_validator_1.IsEnum)(SyncSchedule),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "syncSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Field mappings' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSISConfigurationDto.prototype, "fieldMappings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entities to sync' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SyncEntitiesDto),
    __metadata("design:type", SyncEntitiesDto)
], CreateSISConfigurationDto.prototype, "syncEntities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Auto-create students' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSISConfigurationDto.prototype, "autoCreateStudents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Update existing only' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSISConfigurationDto.prototype, "updateExistingOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ConflictResolutionStrategy,
        description: 'Conflict resolution strategy',
    }),
    (0, class_validator_1.IsEnum)(ConflictResolutionStrategy),
    __metadata("design:type", String)
], CreateSISConfigurationDto.prototype, "conflictResolution", void 0);
//# sourceMappingURL=sis-configuration.dto.js.map