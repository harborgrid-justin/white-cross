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
exports.DeactivateMedicationDto = exports.DeactivationType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var DeactivationType;
(function (DeactivationType) {
    DeactivationType["COMPLETED"] = "COMPLETED";
    DeactivationType["DISCONTINUED"] = "DISCONTINUED";
    DeactivationType["ADVERSE_REACTION"] = "ADVERSE_REACTION";
    DeactivationType["STUDENT_TRANSFERRED"] = "STUDENT_TRANSFERRED";
    DeactivationType["EXPIRED"] = "EXPIRED";
    DeactivationType["ERROR"] = "ERROR";
    DeactivationType["OTHER"] = "OTHER";
})(DeactivationType || (exports.DeactivationType = DeactivationType = {}));
class DeactivateMedicationDto {
    reason;
    deactivationType;
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: true, type: () => String }, deactivationType: { required: true, enum: require("./deactivate-medication.dto").DeactivationType } };
    }
}
exports.DeactivateMedicationDto = DeactivateMedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed reason for deactivation (for audit trail)',
        example: 'Treatment completed successfully. Full 10-day course finished.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeactivateMedicationDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category of deactivation',
        enum: DeactivationType,
        example: DeactivationType.COMPLETED,
    }),
    (0, class_validator_1.IsEnum)(DeactivationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeactivateMedicationDto.prototype, "deactivationType", void 0);
//# sourceMappingURL=deactivate-medication.dto.js.map