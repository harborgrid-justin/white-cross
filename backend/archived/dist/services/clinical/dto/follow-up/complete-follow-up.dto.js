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
exports.CompleteFollowUpDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CompleteFollowUpDto {
    completedVisitId;
    completedAt;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { completedVisitId: { required: true, type: () => String, format: "uuid" }, completedAt: { required: true, type: () => Date }, notes: { required: false, type: () => String } };
    }
}
exports.CompleteFollowUpDto = CompleteFollowUpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clinic visit ID from completed appointment' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CompleteFollowUpDto.prototype, "completedVisitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Completion timestamp',
        example: '2025-11-15T14:30:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CompleteFollowUpDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Completion notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteFollowUpDto.prototype, "notes", void 0);
//# sourceMappingURL=complete-follow-up.dto.js.map