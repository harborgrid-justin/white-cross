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
exports.WaitlistEntryResponseDto = exports.AutoFillFromWaitlistDto = exports.AddToWaitlistDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AddToWaitlistDto {
    studentId;
    appointmentType;
    priority;
    requestedDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, appointmentType: { required: true, type: () => String }, priority: { required: true, type: () => Object }, requestedDate: { required: false, type: () => String } };
    }
}
exports.AddToWaitlistDto = AddToWaitlistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToWaitlistDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of appointment requested' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddToWaitlistDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['routine', 'urgent'], description: 'Priority level' }),
    (0, class_validator_1.IsEnum)(['routine', 'urgent']),
    __metadata("design:type", String)
], AddToWaitlistDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Requested appointment date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AddToWaitlistDto.prototype, "requestedDate", void 0);
class AutoFillFromWaitlistDto {
    appointmentSlot;
    appointmentType;
    static _OPENAPI_METADATA_FACTORY() {
        return { appointmentSlot: { required: true, type: () => String }, appointmentType: { required: true, type: () => String } };
    }
}
exports.AutoFillFromWaitlistDto = AutoFillFromWaitlistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Available appointment slot' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AutoFillFromWaitlistDto.prototype, "appointmentSlot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of appointment' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoFillFromWaitlistDto.prototype, "appointmentType", void 0);
class WaitlistEntryResponseDto {
    id;
    studentId;
    appointmentType;
    priority;
    requestedDate;
    addedAt;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, appointmentType: { required: true, type: () => String }, priority: { required: true, type: () => Object }, requestedDate: { required: false, type: () => Date }, addedAt: { required: true, type: () => Date }, status: { required: true, type: () => Object } };
    }
}
exports.WaitlistEntryResponseDto = WaitlistEntryResponseDto;
//# sourceMappingURL=waitlist.dto.js.map