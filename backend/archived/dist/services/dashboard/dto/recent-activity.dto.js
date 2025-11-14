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
exports.RecentActivityDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RecentActivityDto {
    id;
    type;
    message;
    time;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, format: "uuid" }, type: { required: true, type: () => Object, enum: ['medication', 'incident', 'appointment'] }, message: { required: true, type: () => String }, time: { required: true, type: () => String }, status: { required: true, type: () => Object, enum: ['completed', 'pending', 'warning', 'upcoming'] } };
    }
}
exports.RecentActivityDto = RecentActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity type',
        enum: ['medication', 'incident', 'appointment'],
        example: 'medication',
    }),
    (0, class_validator_1.IsIn)(['medication', 'incident', 'appointment']),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable activity message',
        example: 'Administered Amoxicillin to John Doe',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Relative time string',
        example: '5 minutes ago',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity status',
        enum: ['completed', 'pending', 'warning', 'upcoming'],
        example: 'completed',
    }),
    (0, class_validator_1.IsIn)(['completed', 'pending', 'warning', 'upcoming']),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "status", void 0);
//# sourceMappingURL=recent-activity.dto.js.map