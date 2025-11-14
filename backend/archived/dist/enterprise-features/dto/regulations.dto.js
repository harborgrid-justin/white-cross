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
exports.RegulationUpdateResponseDto = exports.AssessImpactDto = exports.TrackRegulationsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TrackRegulationsDto {
    state;
    static _OPENAPI_METADATA_FACTORY() {
        return { state: { required: true, type: () => String } };
    }
}
exports.TrackRegulationsDto = TrackRegulationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State code (e.g., CA, TX)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackRegulationsDto.prototype, "state", void 0);
class AssessImpactDto {
    regulationId;
    static _OPENAPI_METADATA_FACTORY() {
        return { regulationId: { required: true, type: () => String } };
    }
}
exports.AssessImpactDto = AssessImpactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Regulation ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssessImpactDto.prototype, "regulationId", void 0);
class RegulationUpdateResponseDto {
    id;
    state;
    category;
    title;
    description;
    effectiveDate;
    impact;
    actionRequired;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, state: { required: true, type: () => String }, category: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, effectiveDate: { required: true, type: () => Date }, impact: { required: true, type: () => Object }, actionRequired: { required: true, type: () => String }, status: { required: true, type: () => Object } };
    }
}
exports.RegulationUpdateResponseDto = RegulationUpdateResponseDto;
//# sourceMappingURL=regulations.dto.js.map