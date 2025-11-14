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
exports.SisAttendanceDto = exports.SisAttendanceStatus = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var SisAttendanceStatus;
(function (SisAttendanceStatus) {
    SisAttendanceStatus["PRESENT"] = "PRESENT";
    SisAttendanceStatus["ABSENT"] = "ABSENT";
    SisAttendanceStatus["TARDY"] = "TARDY";
    SisAttendanceStatus["EXCUSED"] = "EXCUSED";
})(SisAttendanceStatus || (exports.SisAttendanceStatus = SisAttendanceStatus = {}));
class SisAttendanceDto {
    studentSisId;
    date;
    status;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentSisId: { required: true, type: () => String, description: "Student's SIS ID", example: "PS-12345" }, date: { required: true, type: () => String, description: "Date of attendance record in ISO 8601 format", example: "2024-01-15" }, status: { required: true, description: "Attendance status for the day", enum: require("./sis-attendance.dto").SisAttendanceStatus }, notes: { required: false, type: () => String, description: "Optional notes about the attendance record", example: "Doctors appointment" } };
    }
}
exports.SisAttendanceDto = SisAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Student's SIS ID",
        example: 'PS-12345',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SisAttendanceDto.prototype, "studentSisId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of attendance record',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SisAttendanceDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attendance status for the day',
        enum: SisAttendanceStatus,
        example: SisAttendanceStatus.PRESENT,
    }),
    (0, class_validator_1.IsEnum)(SisAttendanceStatus),
    __metadata("design:type", String)
], SisAttendanceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional notes about the attendance record',
        example: "Doctor's appointment",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SisAttendanceDto.prototype, "notes", void 0);
//# sourceMappingURL=sis-attendance.dto.js.map