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
exports.UpdateAdministrationDto = exports.FollowUpStatus = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var FollowUpStatus;
(function (FollowUpStatus) {
    FollowUpStatus["PENDING"] = "pending";
    FollowUpStatus["COMPLETED"] = "completed";
    FollowUpStatus["CANCELLED"] = "cancelled";
})(FollowUpStatus || (exports.FollowUpStatus = FollowUpStatus = {}));
class UpdateAdministrationDto {
    notes;
    followUpStatus;
    studentResponse;
    static _OPENAPI_METADATA_FACTORY() {
        return { notes: { required: false, type: () => String }, followUpStatus: { required: false, enum: require("./update-administration.dto").FollowUpStatus }, studentResponse: { required: false, type: () => String } };
    }
}
exports.UpdateAdministrationDto = UpdateAdministrationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the administration',
        example: 'Student reported mild nausea after administration',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdministrationDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Follow-up status',
        enum: FollowUpStatus,
        example: FollowUpStatus.COMPLETED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(FollowUpStatus),
    __metadata("design:type", String)
], UpdateAdministrationDto.prototype, "followUpStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student response or feedback',
        example: 'Student tolerated medication well',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdministrationDto.prototype, "studentResponse", void 0);
//# sourceMappingURL=update-administration.dto.js.map