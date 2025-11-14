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
exports.QueueSyncActionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class QueueSyncActionDto {
    deviceId;
    actionType;
    entityType;
    entityId;
    data;
    priority;
    static _OPENAPI_METADATA_FACTORY() {
        return { deviceId: { required: true, type: () => String }, actionType: { required: true, enum: require("../enums/sync.enum").SyncActionType }, entityType: { required: true, enum: require("../enums/sync.enum").SyncEntityType }, entityId: { required: true, type: () => String }, data: { required: true, type: () => Object }, priority: { required: false, enum: require("../enums/sync.enum").SyncPriority } };
    }
}
exports.QueueSyncActionDto = QueueSyncActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device identifier' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QueueSyncActionDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sync action type',
        enum: enums_1.SyncActionType,
    }),
    (0, class_validator_1.IsEnum)(enums_1.SyncActionType),
    __metadata("design:type", String)
], QueueSyncActionDto.prototype, "actionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Entity type being synced',
        enum: enums_1.SyncEntityType,
    }),
    (0, class_validator_1.IsEnum)(enums_1.SyncEntityType),
    __metadata("design:type", String)
], QueueSyncActionDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity identifier' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QueueSyncActionDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity data' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], QueueSyncActionDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sync priority',
        enum: enums_1.SyncPriority,
        required: false,
        default: enums_1.SyncPriority.NORMAL,
    }),
    (0, class_validator_1.IsEnum)(enums_1.SyncPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueueSyncActionDto.prototype, "priority", void 0);
//# sourceMappingURL=queue-sync-action.dto.js.map