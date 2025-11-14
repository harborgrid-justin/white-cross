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
exports.UpdateFollowUpActionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_follow_up_action_dto_1 = require("./create-follow-up-action.dto");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const action_status_enum_1 = require("../enums/action-status.enum");
class UpdateFollowUpActionDto extends (0, swagger_1.PartialType)(create_follow_up_action_dto_1.CreateFollowUpActionDto) {
    status;
    notes;
    completedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../enums/action-status.enum").ActionStatus }, notes: { required: false, type: () => String }, completedBy: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.UpdateFollowUpActionDto = UpdateFollowUpActionDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Action status',
        enum: action_status_enum_1.ActionStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(action_status_enum_1.ActionStatus),
    __metadata("design:type", String)
], UpdateFollowUpActionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Completion notes',
        example: 'Parent contacted and satisfied with response',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFollowUpActionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Completed by user ID',
        example: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateFollowUpActionDto.prototype, "completedBy", void 0);
//# sourceMappingURL=update-follow-up-action.dto.js.map