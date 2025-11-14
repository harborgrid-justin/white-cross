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
exports.UpdateIncidentReportDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_incident_report_dto_1 = require("./create-incident-report.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const insurance_claim_status_enum_1 = require("../enums/insurance-claim-status.enum");
class UpdateIncidentReportDto extends (0, swagger_1.PartialType)(create_incident_report_dto_1.CreateIncidentReportDto) {
    insuranceClaimStatus;
    parentNotificationMethod;
    parentNotifiedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { insuranceClaimStatus: { required: false, enum: require("../enums/insurance-claim-status.enum").InsuranceClaimStatus }, parentNotificationMethod: { required: false, type: () => String }, parentNotifiedAt: { required: false, type: () => Date } };
    }
}
exports.UpdateIncidentReportDto = UpdateIncidentReportDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Insurance claim status',
        enum: insurance_claim_status_enum_1.InsuranceClaimStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(insurance_claim_status_enum_1.InsuranceClaimStatus),
    __metadata("design:type", String)
], UpdateIncidentReportDto.prototype, "insuranceClaimStatus", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Parent notification method',
        example: 'Phone call',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentReportDto.prototype, "parentNotificationMethod", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Parent notified at timestamp',
        example: '2025-10-28T11:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateIncidentReportDto.prototype, "parentNotifiedAt", void 0);
//# sourceMappingURL=update-incident-report.dto.js.map