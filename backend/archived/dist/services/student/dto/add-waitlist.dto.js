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
exports.AddWaitlistDto = exports.WaitlistPriority = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var WaitlistPriority;
(function (WaitlistPriority) {
    WaitlistPriority["LOW"] = "low";
    WaitlistPriority["MEDIUM"] = "medium";
    WaitlistPriority["HIGH"] = "high";
    WaitlistPriority["URGENT"] = "urgent";
})(WaitlistPriority || (exports.WaitlistPriority = WaitlistPriority = {}));
class AddWaitlistDto {
    studentId;
    appointmentType;
    priority = WaitlistPriority.MEDIUM;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, appointmentType: { required: true, type: () => String }, priority: { required: false, default: WaitlistPriority.MEDIUM, enum: require("./add-waitlist.dto").WaitlistPriority }, notes: { required: false, type: () => String } };
    }
}
exports.AddWaitlistDto = AddWaitlistDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID to add to waitlist',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], AddWaitlistDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of appointment needed',
        example: 'vision_screening',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddWaitlistDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority level for waitlist placement',
        enum: WaitlistPriority,
        example: WaitlistPriority.MEDIUM,
        default: WaitlistPriority.MEDIUM,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(WaitlistPriority),
    __metadata("design:type", String)
], AddWaitlistDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about waitlist request',
        example: 'Student needs vision screening before returning to class',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddWaitlistDto.prototype, "notes", void 0);
//# sourceMappingURL=add-waitlist.dto.js.map