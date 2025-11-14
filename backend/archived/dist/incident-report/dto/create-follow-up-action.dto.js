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
exports.CreateFollowUpActionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const action_priority_enum_1 = require("../enums/action-priority.enum");
class CreateFollowUpActionDto {
    action;
    dueDate;
    priority;
    assignedTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { action: { required: true, type: () => String, minLength: 5 }, dueDate: { required: true, type: () => Date }, priority: { required: true, enum: require("../enums/action-priority.enum").ActionPriority }, assignedTo: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateFollowUpActionDto = CreateFollowUpActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action description (minimum 5 characters)',
        example: 'Follow up with parent about injury',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5, { message: 'Follow-up action must be at least 5 characters' }),
    __metadata("design:type", String)
], CreateFollowUpActionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Due date (must be in the future)',
        example: '2025-10-29T10:00:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateFollowUpActionDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority level',
        enum: action_priority_enum_1.ActionPriority,
        example: action_priority_enum_1.ActionPriority.HIGH,
    }),
    (0, class_validator_1.IsEnum)(action_priority_enum_1.ActionPriority),
    __metadata("design:type", String)
], CreateFollowUpActionDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Assigned to user ID',
        example: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateFollowUpActionDto.prototype, "assignedTo", void 0);
//# sourceMappingURL=create-follow-up-action.dto.js.map