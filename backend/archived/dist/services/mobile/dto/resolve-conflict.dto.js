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
exports.ResolveConflictDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class ResolveConflictDto {
    resolution;
    mergedData;
    static _OPENAPI_METADATA_FACTORY() {
        return { resolution: { required: true, enum: require("../enums/sync.enum").ConflictResolution }, mergedData: { required: false, type: () => Object } };
    }
}
exports.ResolveConflictDto = ResolveConflictDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conflict resolution strategy',
        enum: enums_1.ConflictResolution,
    }),
    (0, class_validator_1.IsEnum)(enums_1.ConflictResolution),
    __metadata("design:type", String)
], ResolveConflictDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Manually merged data (for MERGE strategy)',
        required: false,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ResolveConflictDto.prototype, "mergedData", void 0);
//# sourceMappingURL=resolve-conflict.dto.js.map